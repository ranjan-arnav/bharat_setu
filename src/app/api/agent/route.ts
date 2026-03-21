import { NextRequest, NextResponse } from 'next/server';
import ModelClient, { isUnexpected } from '@azure-rest/ai-inference';
import { AzureKeyCredential } from '@azure/core-auth';
import { azureConfig, agentConfigs } from '@/lib/azure-config';

type AgentKey = keyof typeof agentConfigs;

// ── Language code → full display name + native script (for system prompt) ────
const LANGUAGE_NAMES: Record<string, string> = {
  // Primary codes
  'hi':  'Hindi (हिंदी)',
  'en':  'English',
  'bn':  'Bengali (বাংলা)',
  'te':  'Telugu (తెలుగు)',
  'mr':  'Marathi (मराठी)',
  'ta':  'Tamil (தமிழ்)',
  'gu':  'Gujarati (ગુજરાતી)',
  'kn':  'Kannada (ಕನ್ನಡ)',
  'ml':  'Malayalam (മലയാളം)',
  'pa':  'Punjabi (ਪੰਜਾਬੀ)',
  'or':  'Odia (ଓଡ଼ିଆ)',
  'as':  'Assamese (অসমীয়া)',
  'ur':  'Urdu (اردو)',
  'ne':  'Nepali (नेपाली)',
  'mai': 'Maithili (मैथिली)',
  'kok': 'Konkani (कोंकणी)',
  'mni': 'Manipuri / Meitei (মেইতেই)',
  'doi': 'Dogri (डोगरी)',
  'sat': 'Santali (ᱥᱟᱱᱛᱟᱲᱤ)',
  'brx': 'Bodo (बड़ो)',
  'ks':  'Kashmiri (کٲشُر)',
  'sd':  'Sindhi (سنڌي)',
  'sa':  'Sanskrit (संस्कृतम्)',
  // Region-suffixed variants
  'hi-IN': 'Hindi (हिंदी)',
  'en-IN': 'English', 'en-US': 'English', 'en-GB': 'English',
  'bn-IN': 'Bengali (বাংলা)',
  'te-IN': 'Telugu (తెలుగు)',
  'mr-IN': 'Marathi (मराठी)',
  'ta-IN': 'Tamil (தமிழ்)',
  'gu-IN': 'Gujarati (ગુજરાતી)',
  'kn-IN': 'Kannada (ಕನ್ನಡ)',
  'ml-IN': 'Malayalam (മലയാളം)',
  'pa-IN': 'Punjabi (ਪੰਜਾਬੀ)',
  'or-IN': 'Odia (ଓଡ଼ିଆ)',
  'as-IN': 'Assamese (অসমীয়া)',
  'ur-IN': 'Urdu (اردو)',
  'ne-NP': 'Nepali (नेपाली)',
};

// ── Round-robin counter for Azure OpenAI deployments ──────────────────────────
// Module-level: persists across requests in the same server instance.
// Alternates every request: A, B, A, B ... → effectively doubles TPM.
let rrCounter = 0;
function pickDeployment(): string {
  const depB = azureConfig.openai.deploymentNameB;
  if (!depB) return azureConfig.openai.deploymentName; // only A configured
  const pick = (rrCounter++ % 2 === 0) ? azureConfig.openai.deploymentName : depB;
  return pick;
}

const VALID_AGENTS: AgentKey[] = ['nagarik_mitra', 'swasthya_sahayak', 'yojana_saathi', 'arthik_salahkar', 'vidhi_sahayak'];

const PHI_ROUTING_MODEL = "microsoft/Phi-4";
const GITHUB_MODELS_ENDPOINT = "https://models.github.ai/inference";

// ── In-memory caches (persists for lifetime of server process) ────────────────
// Translator cache: avoids calling Azure Translator for the same text twice
const translatorCache = new Map<string, string>();
// Routing cache: avoids re-calling Phi for identical messages
const routingCache = new Map<string, AgentKey>();

// ── GPT-4.1-mini fallback via GitHub Models (free tier, rate-limited) ──────────
// Only used when Azure OpenAI returns 429 (rate limit). Never called on 401.
async function _callGpt41MiniFallback(
  messages: { role: string; content: string }[],
  maxTokens: number
): Promise<string | null> {
  const token = process.env['GITHUB_TOKEN'] || '';
  if (!token) return null;
  try {
    const client = ModelClient('https://models.github.ai/inference', new AzureKeyCredential(token));
    const timeoutP = new Promise<never>((_, reject) => setTimeout(() => reject(new Error('GPT41_TIMEOUT')), 12000));
    const res = await Promise.race([
      client.path('/chat/completions').post({
        body: { messages, model: 'openai/gpt-4.1-mini', max_tokens: maxTokens, temperature: 0.7 },
      }),
      timeoutP,
    ]);
    if (isUnexpected(res)) { console.warn('[FALLBACK] gpt-4.1-mini unexpected:', res.body.error?.message); return null; }
    const reply = res.body.choices?.[0]?.message?.content || null;
    console.log('[FALLBACK] gpt-4.1-mini replied ok');
    return reply;
  } catch (e) {
    console.warn('[FALLBACK] gpt-4.1-mini failed:', e instanceof Error ? e.message.slice(0, 80) : String(e));
    return null;
  }
}

// ── Azure Translator: translate any Indian language → English ─────────────────
async function translateToEnglish(text: string): Promise<string> {
  const key    = process.env["AZURE_TRANSLATOR_KEY"] || '';
  const region = process.env["AZURE_TRANSLATOR_REGION"] || 'global';
  if (!key) return text; // no key → pass through as-is
  // Cache hit — skip API call entirely
  const cacheKey = text.slice(0, 200);
  if (translatorCache.has(cacheKey)) return translatorCache.get(cacheKey)!;
  try {
    const t0 = Date.now();
    const res = await fetch(
      'https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=en',
      {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key':    key,
          'Ocp-Apim-Subscription-Region': region,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([{ text: text.slice(0, 500) }]),
        signal: AbortSignal.timeout(3000),
      }
    );
    if (!res.ok) {
      console.warn(`[TRANSLATE] Azure HTTP ${res.status} — trying MyMemory fallback`);
      return translateWithMyMemory(text, cacheKey);
    }
    type TranslateResponse = { translations: { text: string; to: string }[] }[];
    const data = await res.json() as TranslateResponse;
    const translated = data?.[0]?.translations?.[0]?.text || text;
    console.log(`[TRANSLATE] "${text.slice(0,60)}" → "${translated.slice(0,80)}" (${Date.now()-t0}ms)`);
    translatorCache.set(cacheKey, translated);
    return translated;
  } catch (e) {
    console.warn('[TRANSLATE] Azure failed:', e instanceof Error ? e.message.slice(0,80) : String(e));
    return translateWithMyMemory(text, cacheKey);
  }
}

// MyMemory free translator — no key, no signup, 5000 words/day free
async function translateWithMyMemory(text: string, cacheKey: string): Promise<string> {
  try {
    const q = encodeURIComponent(text.slice(0, 500));
    const res = await fetch(`https://api.mymemory.translated.net/get?q=${q}&langpair=auto|en`, {
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return text;
    const data = await res.json() as { responseData?: { translatedText?: string } };
    const translated = data?.responseData?.translatedText || text;
    console.log(`[TRANSLATE] MyMemory fallback: "${translated.slice(0,80)}"`);
    translatorCache.set(cacheKey, translated);
    return translated;
  } catch {
    return text; // final fallback: pass original text through
  }
}

// One-shot routing: English query → single Phi-4-mini-instruct call → one agent key
const PHI_ROUTING_SYSTEM = `You are a routing classifier. You MUST reply with exactly ONE word — either one of the agent keys below, or the word null if you cannot determine the category. No explanation, no punctuation, no extra text.
nagarik_mitra
swasthya_sahayak
yojana_saathi
arthik_salahkar
vidhi_sahayak
null`;

function buildPhiUserPrompt(english: string): string {
  return `Classify the following citizen request into exactly one of these agent keys. If the request does not clearly match any category, reply with null. Reply with ONLY the key name or the word null — no explanation, no punctuation, no sentence.

Agent keys:
nagarik_mitra = road, water, electricity, garbage, civic complaint
swasthya_sahayak = health, symptoms, doctor, medicine, feeling ill or weird
yojana_saathi = government scheme, subsidy, ration, pension, MGNREGA
arthik_salahkar = money, bank, loan, fraud, UPI, savings
vidhi_sahayak = police, FIR, law, lawyer, abuse, rights, harassment

Request: ${english.slice(0, 300)}

Reply with one word only (agent key or null):`;
}

// ── Script-agnostic overrides — run on the RAW message BEFORE translation ──────
// Catches Devanagari/regional keywords when Azure Translator is not configured.
const RAW_OVERRIDES: { pattern: RegExp; agent: AgentKey; reason: string }[] = [
  { pattern: /बैंक|खाता|पैसा|पैसे|लोन|ऋण|कर्ज|बचत|निवेश|भुगतान|ईएमआई|मुद्रा|जन\s*धन|खुलवाना|बीमा|यूपीआई/, agent: 'arthik_salahkar', reason: 'Hindi banking keywords' },
  { pattern: /धोखा|ठगी|साइबर|फ्रॉड|घोटाला|ओटीपी/,                                                           agent: 'arthik_salahkar', reason: 'Hindi fraud keywords' },
  { pattern: /डॉक्टर|दवा|दवाई|अस्पताल|बीमार|बुखार|दर्द|खांसी|उल्टी|इलाज|तबियत/,                           agent: 'swasthya_sahayak', reason: 'Hindi health keywords' },
  { pattern: /योजना|किसान|राशन|पेंशन|सब्सिडी|मनरेगा|नरेगा|उज्ज्वला|आवास|फसल/,                              agent: 'yojana_saathi',    reason: 'Hindi scheme keywords' },
  { pattern: /पुलिस|कानून|वकील|अदालत|एफआईआर|न्याय|अधिकार|गिरफ्तार|जमानत|थाना/,                             agent: 'vidhi_sahayak',    reason: 'Hindi legal keywords' },
  { pattern: /घरेलू\s*हिंसा|मारपीट|उत्पीड़न|छेड़छाड़|बलात्कार|दहेज|यौन\s*शोषण|महिला\s*सुरक्षा|पति.*मार|पति.*पीट|मारता\s*है|पीटता\s*है/, agent: 'vidhi_sahayak', reason: 'Hindi domestic violence and women safety keywords' },
  { pattern: /सड़क|पानी|बिजली|सफाई|कचरा|नाला|नगर\s*निगम|शिकायत/,                                            agent: 'nagarik_mitra',    reason: 'Hindi civic keywords' },
  { pattern: /पेट.*अजीब|अजीब.*पेट|पेट.*अजब|अजब.*पेट|पेट.*खराब|पेट.*दर्द|पेट.*ठीक\s*नहीं/,              agent: 'swasthya_sahayak',  reason: 'Hindi stomach/digestive complaint' },
  { pattern: /pet.*ajib|ajib.*pet|pet.*ajeeb|ajeeb.*pet|pet.*kharab|pet.*dard/i,                             agent: 'swasthya_sahayak',  reason: 'Transliterated stomach complaint' },
  // Lawyer/legal counsel — Urdu/Hindi transliterations often missed by Ministral
  { pattern: /wak[ie]el|waqeel|vakeel?|vakil|attorney|lawyer|legal\s*aid|mujhe.*waqeel|ek.*vakil/i,           agent: 'vidhi_sahayak',    reason: 'lawyer/legal counsel transliterations' },
  // Property encroachment — civic-sounding but fundamentally a legal matter
  { pattern: /kabza|encroach|unauthori[sz]ed.*propert|propert.*disput|zameen.*vivad|zameen.*kabza|propert.*kabza/i, agent: 'vidhi_sahayak', reason: 'property encroachment = legal dispute' },
];

function getRawOverride(message: string): AgentKey | null {
  for (const rule of RAW_OVERRIDES) {
    if (rule.pattern.test(message)) {
      console.log(`[RAW_OVERRIDE] "${rule.reason}" → ${rule.agent}`);
      return rule.agent;
    }
  }
  return null;
}

const ENGLISH_OVERRIDES: { pattern: RegExp; agent: AgentKey; reason: string }[] = [
  // Ration card operations — always a government scheme (PDS), never civic
  { pattern: /ration\s+card|rashan\s+card|ration\s+list/i,            agent: 'yojana_saathi',    reason: 'ration card = PDS scheme' },
  // Ayushman Bharat card registration/application — scheme enrollment, not health treatment
  { pattern: /ayushman\s+bharat\s+card|pmjay\s+card|ayushman\s+card/i, agent: 'yojana_saathi',   reason: 'Ayushman card = PMJAY scheme enrollment' },
  // MGNREGA job card
  { pattern: /mgnrega\s+card|job\s+card|narega\s+card/i,              agent: 'yojana_saathi',    reason: 'job card = MGNREGA scheme' },
  // Feeling unwell / sick / strange — any form of body health complaint in English
  { pattern: /not\s+feeling\s+well|not\s+feeling\s+good|feeling\s+(sick|ill|bad|unwell|dizzy|weak|weird|strange|off|funny|odd)|not\s+well|i'?m\s+(sick|ill|unwell)|i\s+am\s+(sick|ill|unwell)|feel\s+(sick|bad|ill|unwell|weird|strange|off|funny|odd)|man.*ajeeb|ajeeb.*lag|body\s+(pain|ache)|headache|sore\s+throat|high\s+fever|stomach\s+(pain|ache|upset)|chest\s+pain/i, agent: 'swasthya_sahayak', reason: 'feeling unwell/sick/weird = health' },
  // Eating/drinking/digestion/bowel problems — body health, not financial
  { pattern: /\b(poop|stool|bowel movement|loose motion|diarrh|vomit(?:ing)?|nausea|problem in eating|problem in drinking|eating problem|digestion problem)\b/i, agent: 'swasthya_sahayak', reason: 'eating/digestion/bowel = body health' },
  // Stomach feeling strange/weird/bad
  { pattern: /stomach\s+(?:is\s+)?(?:strange|weird|bad|off|wrong|not\s+(?:ok|right|normal|good))|(?:strange|weird|ajeeb|ajib)\s+(?:stomach|tummy|gut|pet)|my\s+stomach|stomach\s+(?:ache|pain|hurt)/i, agent: 'swasthya_sahayak', reason: 'stomach strange/weird/bad = health' },
  // Property encroachment — a legal matter not civic
  { pattern: /\bkabza\b|encroach|unauthori[sz]ed.*propert|propert.*disput|propert.*encroach|illegal.*occupation/i, agent: 'vidhi_sahayak', reason: 'property encroachment = legal dispute' },
  // Lawyer/legal help — English
  { pattern: /\b(lawyer|attorney|advocate|legal\s+counsel|legal\s+help|need.*lawyer|want.*lawyer|find.*lawyer)\b/i, agent: 'vidhi_sahayak', reason: 'lawyer/legal help keywords' },
  // Domestic violence, abuse, harassment, and women safety issues are legal/safety matters
  { pattern: /domestic\s+violence|domestic\s+abuse|abusive\s+husband|husband.*(beat|hits|hit|abuse)|beating\s+me|marital\s+rape|sexual\s+harassment|molest|molestation|rape|assault|stalking|dowry\s+harassment|women'?s\s+safety|gender\s+violence/i, agent: 'vidhi_sahayak', reason: 'domestic violence and women safety keywords' },
  // Personal safety concerns — night, streets, threats
  { pattern: /feel\s+unsafe|feeling\s+unsafe|unsafe\s+at\s+night|not\s+safe|feel\s+threatened|feel\s+scared|being\s+followed|someone\s+following|stalked|i\s+am\s+scared|scared\s+at\s+night|fear\s+for\s+(my\s+)?safety/i, agent: 'vidhi_sahayak', reason: 'personal safety/unsafe = legal/police' },
];

function getKeywordOverride(english: string): AgentKey | null {
  for (const rule of ENGLISH_OVERRIDES) {
    if (rule.pattern.test(english)) {
      console.log(`[OVERRIDE] keyword match: "${rule.reason}" → ${rule.agent}`);
      return rule.agent;
    }
  }
  return null;
}

async function classifyAgentWithPhi(message: string): Promise<AgentKey | null> {
  // Step 0: check raw message for high-confidence script-agnostic keyword overrides
  // (runs before translation so Hindi/regional queries are never misrouted)
  const rawOverride = getRawOverride(message);
  if (rawOverride) return rawOverride;

  // Routing cache hit — skip Phi entirely for repeated/identical queries
  const msgKey = message.trim().toLowerCase().slice(0, 150);
  if (routingCache.has(msgKey)) {
    console.log(`[PHI] cache hit → ${routingCache.get(msgKey)}`);
    return routingCache.get(msgKey)!;
  }

  const token = process.env["GITHUB_TOKEN_PHI"] || process.env["GITHUB_TOKEN"] || '';
  if (!token) return null;
  const t0 = Date.now();
  try {
    // Step 1: translate to English via Azure AI Translator (handles all regional languages)
    // This is mandatory — Phi-4-mini works best on English input
    const english = await translateToEnglish(message);

    // Step 1b: keyword override — for unambiguous high-confidence cases, skip model call
    const override = getKeywordOverride(english);
    if (override) {
      console.log(`[PHI] keyword override → ${override} (skipped model call)`);
      return override;
    }

    // Step 2: send the translated English query to Phi and force a one-word route.
    const client = ModelClient(GITHUB_MODELS_ENDPOINT, new AzureKeyCredential(token));
    const phiTimeoutP = new Promise<never>((_, reject) => setTimeout(() => reject(new Error('PHI_TIMEOUT')), 35000));
    const res = await Promise.race([
      client.path('/chat/completions').post({
        body: {
          model: PHI_ROUTING_MODEL,
          messages: [
            { role: 'system', content: PHI_ROUTING_SYSTEM },
            { role: 'user', content: buildPhiUserPrompt(english) },
          ],
          max_tokens: 20,
          temperature: 0.0,
          top_p: 1.0,
        },
      }),
      phiTimeoutP,
    ]);

    if (isUnexpected(res)) {
      console.warn('[PHI] unexpected response:', res.body.error?.message);
      return null;
    }

    const raw = ((res.body.choices as Array<{ message: { content: string } }>)?.[0]?.message?.content || '').trim().toLowerCase().replace(/[^a-z_]/g, '');
    console.log(`[PHI] raw="${raw}" in ${Date.now() - t0}ms`);

    let best: AgentKey | null = null;
    let bestLen = 0;
    for (const a of VALID_AGENTS) {
      if (raw.includes(a) && a.length > bestLen) { bestLen = a.length; best = a; }
    }
    console.log(`[PHI] resolved="${best}"`);
    if (best) routingCache.set(msgKey, best);
    return best;
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes('429') || msg.includes('rate')) console.warn('[PHI] Rate limited');
    else console.warn('[PHI] Error:', msg.slice(0, 100));
    return null;
  }
}

// ── Protection layer: use the main Azure/GitHub model as a smarter routing verifier ──
// Runs in parallel with the reply fetch — zero latency overhead.
// Translates the message first (same Azure Translator), then uses rich few-shot prompt.
// If it disagrees with Ministral, it wins (GPT-4o > Ministral-3B for routing).
async function _backgroundRouteCheck(
  message: string,
  apiUrl: string,
  headers: Record<string, string>,
  useGitHubModels: boolean,
  ghModel?: string
): Promise<AgentKey | null> {
  const BG_ROUTE_SYSTEM = `You are a routing assistant for Bharat Setu — a unified Indian citizen services platform.
Given a user message IN ENGLISH, reply with ONLY the single best agent key — nothing else.

INDIAN GOVERNMENT CONTEXT:
- Central schemes: PM-KISAN, Ayushman Bharat/PMJAY, MGNREGA, PM-Awas, PDS/ration card, PMFBY crop insurance, Ujjwala LPG
- Local body complaints (road, water, drainage) go to gram panchayat / nagar palika
- Health: ABDM, PHC, ASHA workers, Jan Aushadhi, vaccination drives
- Finance: Jan Dhan accounts, UPI/NPCI, MUDRA loans, e-RUPI
- Legal: NALSA legal aid, lok adalat, district courts, RTI

nagarik_mitra    = Civic & Municipal Agent
  Scope: broken roads, potholes, water supply failure, drainage/sewage overflow, street light fault,
         garbage/sanitation, encroachment, local government complaint, bus stop, public toilet repair
  NOT: electricity bills, land title, scheme money

swasthya_sahayak = Health & Wellness Agent
  Scope: fever, pain, cough, loose motion, diarrhea, poop/stool difficulty, vomiting, nausea, eating/drinking problem,
         loss of appetite, dehydration, weakness, dizziness, diabetes, BP, pregnancy, vaccination, Jan Aushadhi,
         mental health, anxiety, depression, addiction, alcohol/drug problem, obsession, craving, body symptoms
  NOT: Ayushman Bharat card new registration (→ yojana_saathi)

yojana_saathi    = Government Schemes Agent
  Scope: PM-KISAN money, PM-Awas housing scheme, MGNREGA job card, PDS ration card (new/add name/correction/lost),
         Ayushman Bharat/PMJAY card application or enrollment, APL/BPL/AAY ration, pension (old age/widow/disability),
         scholarship, PM SVANidhi, MUDRA scheme, PMFBY crop insurance, LPG/Ujjwala subsidy, caste/income certificate,
         government benefit not received, scheme status
  NOTE: Ration card name addition, Ayushman card banwana = yojana_saathi

arthik_salahkar  = Finance & Money Agent
  Scope: bank account problem, Jan Dhan, ATM/card issue, UPI payment failure/fraud, OTP scam, phishing,
         cyber fraud, unexpected money deduction, loan EMI, LIC/insurance claim, money transfer failure, e-RUPI
  NOT: government scheme money not received (→ yojana_saathi)

vidhi_sahayak    = Legal & Rights Agent
  Scope: FIR registration or refusal, police complaint, domestic violence, land/property dispute,
         khasra/khatauni/patta records, eviction, bail, arrest, consumer court, RTI, NALSA legal aid,
         lok adalat, rights violation, harassment, discrimination
`;

  try {
    // Translate first — same as Ministral pipeline, so both classifiers see English
    const english = await translateToEnglish(message);

    // Keyword override — same high-confidence dict as Ministral step
    const bgOverride = getKeywordOverride(english);
    if (bgOverride) return bgOverride;

    const checkPayload: Record<string, unknown> = {
      messages: [
        { role: 'system',    content: BG_ROUTE_SYSTEM },
        // Few-shot anchors (one per agent + edge cases)
        { role: 'user',      content: 'I have had fever for 3 days and need medicine' },
        { role: 'assistant', content: 'swasthya_sahayak' },
        { role: 'user',      content: 'The road in my colony is broken and full of potholes' },
        { role: 'assistant', content: 'nagarik_mitra' },
        { role: 'user',      content: 'Someone stole money from my UPI account using fraud' },
        { role: 'assistant', content: 'arthik_salahkar' },
        { role: 'user',      content: 'I have not received my PM-KISAN instalment this season' },
        { role: 'assistant', content: 'yojana_saathi' },
        { role: 'user',      content: 'How do I make an Ayushman Bharat card or register for the scheme' },
        { role: 'assistant', content: 'yojana_saathi' },
        { role: 'user',      content: 'I want to add my name to the ration card' },
        { role: 'assistant', content: 'yojana_saathi' },
        { role: 'user',      content: 'I want to add my name to the ration card.' },
        { role: 'assistant', content: 'yojana_saathi' },
        { role: 'user',      content: 'Police is refusing to file my FIR' },
        { role: 'assistant', content: 'vidhi_sahayak' },
        { role: 'user',      content: 'I have a problem eating, drinking and having a bowel movement' },
        { role: 'assistant', content: 'swasthya_sahayak' },
        { role: 'user',      content: 'I have problem in eating drinking and having poop' },
        { role: 'assistant', content: 'swasthya_sahayak' },
        { role: 'user',      content: 'My husband is obsessed and addicted to diet coke, please help' },
        { role: 'assistant', content: 'swasthya_sahayak' },
        { role: 'user',      content: english.slice(0, 350) },
      ],
      max_tokens: 10,
      temperature: 0.0,
    };
    if (useGitHubModels && ghModel) checkPayload.model = ghModel;

    const res = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(checkPayload),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return null;
    const data = await res.json() as { choices?: Array<{ message?: { content?: string } }> };
    const raw = (data.choices?.[0]?.message?.content as string || '').trim().toLowerCase().replace(/[^a-z_]/g, '');
    let best: AgentKey | null = null;
    let bestLen = 0;
    for (const a of VALID_AGENTS) {
      if (raw.includes(a) && a.length > bestLen) { bestLen = a.length; best = a; }
    }
    console.log(`[BG_ROUTE] english="${english.slice(0,60)}" raw="${raw}" → resolved="${best}"`);
    return best;
  } catch {
    return null;
  }
}

// Local fallback classifier — calls Python TF-IDF+SVC on localhost:5001
async function classifyAgentLocal(message: string): Promise<AgentKey | null> {
  try {
    const res = await fetch('http://127.0.0.1:5001/classify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: message.slice(0, 300) }),
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return null;
    const data = await res.json() as { agent: string; confidence: number };
    const agent = data.agent as AgentKey;
    console.log(`[LOCAL] predicted=${agent} conf=${data.confidence}`);
    return VALID_AGENTS.includes(agent) ? agent : null;
  } catch {
    console.warn('[LOCAL] classifier unavailable');
    return null;
  }
}

// POST /api/agent - Multi-agent orchestration via Azure OpenAI (AutoGen 0.4 pattern)
export async function POST(request: NextRequest) {
  let reqMessage = '';
  let reqAgentKey: AgentKey = 'nagarik_mitra';
  let reqLanguage = 'hi';

  try {
    const { message, userText, agentKey, clientDetectedAgent, conversationHistory = [], sharedContext = '', language = 'hi', digipin, classifyOnly = false, citizenProfile = null } = await request.json();
    reqMessage = message || '';
    reqAgentKey = agentKey as AgentKey;
    reqLanguage = language || 'hi';

    // Short-circuit: empty or trivially short messages don't need AI
    if (!reqMessage || reqMessage.trim().length < 2) {
      return NextResponse.json({ error: 'Message too short' }, { status: 400 });
    }

    // For routing purposes, use just the user's typed text (strip image analysis prefix).
    // This prevents Phi from routing on image metadata instead of user intent.
    // If userText is provided, use it; otherwise strip [Image analysis: ...] from message.
    const routingText = (() => {
      if (typeof userText === 'string' && userText.trim()) return userText.trim();
      const stripped = (message as string).replace(/^\[Image analysis:[^\]]*\]\n?/i, '').trim();
      // If nothing left after stripping (image-only, no caption), skip routing
      return stripped || '';
    })();

    // Validate agent key
    const requestedAgent = agentConfigs[agentKey as AgentKey];
    if (!requestedAgent) {
      return NextResponse.json({ error: 'Invalid agent key' }, { status: 400 });
    }

    const ghToken = azureConfig.githubModels.token;
    // Use Azure OpenAI only when endpoint+key are both configured.
    // Student subscription has 0 quota for all GPT models → default to GitHub Models (free).
    const hasAzureOpenAI = !!(
      azureConfig.openai.apiKey &&
      azureConfig.openai.endpoint &&
      !azureConfig.openai.apiKey.startsWith('your-')
    );
    const useGitHubModels = !hasAzureOpenAI; // GitHub Models is primary when Azure not configured
    // Phi-4-mini-instruct routing via GitHub Models free tier
    const usePhiRouting = !!(process.env["GITHUB_TOKEN_PHI"] || process.env["GITHUB_TOKEN"]);

    // ═══════════════════════════════════════════════════
    // STEP 1: Route to the correct agent
    //   Order: Phi-4-mini-instruct → local TF-IDF (fallback) → clientDetected
    // ═══════════════════════════════════════════════════
    let resolvedAgentKey: AgentKey = agentKey as AgentKey;
    let suggestedAgent: string | null = null;
    let phiClassified: AgentKey | null = null;
    // Kept alive so post-GPT code can harvest a Phi result that arrives during GPT execution
    let phiPromise: Promise<AgentKey | null> = Promise.resolve(null);

    const clientAgent = VALID_AGENTS.includes(clientDetectedAgent as AgentKey) ? clientDetectedAgent as AgentKey : null;

    console.log(`\n[ROUTING] msg="${message.slice(0,60)}" | routingText="${routingText.slice(0,40)}" | from=${agentKey} | clientDetected=${clientDetectedAgent}`);

    // Skip routing only if there's no meaningful text to analyze
    if (!routingText || routingText.length < 3) {
      console.log(`[ROUTING] SKIPPED — no meaningful text to route`);
      resolvedAgentKey = agentKey as AgentKey;
    } else if (clientAgent === agentKey) {
      // Client keyword detection and active agent already agree — skip Phi entirely.
      // Running Phi here adds latency with no benefit: both signals point to the same agent.
      resolvedAgentKey = agentKey as AgentKey;
      console.log(`[ROUTING] client+current agree: ${clientAgent} — Phi skipped`);
    } else {
      // Run full classification (client detected different agent OR client detected nothing)
      let classified: AgentKey | null = null;

      // ── Phi-4-mini-instruct routing — parallel with GPT ──
      // Fire Phi immediately but only wait 5s max before proceeding to GPT.
      // Warm Phi resolves in 2-3s so it usually wins the race.
      // Cold-starting Phi (>5s) no longer blocks the user — GPT starts right away.
      // phiPromise stays alive; post-GPT code harvests the result if it arrives in time.
      if (usePhiRouting) {
        phiPromise = classifyAgentWithPhi(routingText);
        classified = await Promise.race([
          phiPromise,
          new Promise<null>(r => setTimeout(() => r(null), 5000)),
        ]);
        if (classified) {
          phiClassified = classified;
        } else {
          console.log('[PHI] 5s early timeout — GPT starting immediately, Phi still running in background');
        }
      }

      // ── Pass 2: Local TF-IDF (fallback if Phi didn't resolve in 5s) ─────
      if (!classified) {
        console.log(`[LOCAL] Phi null/slow — falling back to TF-IDF`);
        const t0 = Date.now();
        classified = await classifyAgentLocal(message);
        console.log(`[LOCAL] returned="${classified}" in ${Date.now()-t0}ms`);
      }

      // Apply result
      if (classified && classified !== agentKey) {
        suggestedAgent = classified;
        resolvedAgentKey = classified;
        console.log(`[ROUTING] HANDOFF: ${agentKey} → ${classified} (clientDetected=${clientDetectedAgent})`);
      } else if (!classified && clientAgent && clientAgent !== agentKey) {
        // Both classifiers failed — last resort: trust client keyword detection
        resolvedAgentKey = clientAgent;
        suggestedAgent = clientAgent;
        console.log(`[ROUTING] Both classifiers failed, using clientDetected: ${clientAgent}`);
      } else {
        console.log(`[ROUTING] No change — staying on ${agentKey}`);
      }
    }

    console.log(`[ROUTING] resolved → ${resolvedAgentKey}${suggestedAgent ? ` (handoff suggested: ${suggestedAgent})` : ''}\n`);

    // ── classifyOnly mode: skip LLM, return agent routing result immediately ──
    // Used by VoiceAssistant for fast agent detection without generating a reply.
    if (classifyOnly) {
      return NextResponse.json({
        resolvedAgentKey,
        suggestedAgent,
        reply: null,
        source: 'classify-only',
      });
    }

    // Get the resolved agent (could be different from what user was talking to)
    const agent = agentConfigs[resolvedAgentKey];

    // ═══════════════════════════════════════════════════
    // STEP 2: Build system prompt for the CORRECT agent
    // ═══════════════════════════════════════════════════
    const userLang = LANGUAGE_NAMES[language] || LANGUAGE_NAMES[language.split('-')[0]] || language;
    const isEnglish = language === 'en' || language.startsWith('en-');

    const langInstruction = isEnglish
      ? `LANGUAGE: Respond in clear, simple English. Avoid jargon; write as if explaining to a first-time government portal user.`
      : `LANGUAGE — MANDATORY:
• Your PRIMARY language is ${userLang}. Write the overwhelming majority of your response in ${userLang} script.
• You may naturally mix in a SMALL number of English words ONLY for: scheme names (e.g. PM-KISAN, Ayushman Bharat), portal names (e.g. pgportal.gov.in), app names, ticket IDs, and well-known technical terms (OTP, UPI, FIR, URL). This light English mix is natural and authentic for Indian users.
• DO NOT write entire sentences in English. DO NOT switch to Hindi if the user's language is not Hindi.
• If the user wrote in ${userLang}, reply in ${userLang}. If they mixed languages, still reply in ${userLang} with light English terms.`;

    const orchestratorSystemPrompt = `You are ${agent.name}, the ${agent.role} in the Bharat Setu digital governance platform.
User's DIGIPIN: ${citizenProfile?.digipin || digipin || 'Not provided'}
User's preferred language: ${userLang}

${langInstruction}

${agent.systemPrompt}

RULES:
1. ${isEnglish ? 'Write in English.' : `Write in ${userLang} with only light English technical terms mixed in.`}
2. If DIGIPIN is provided, use it for location-aware recommendations.
3. Reference specific Indian scheme names, deadlines, and portal URLs where relevant.
4. You are the CHOSEN agent for this query — answer directly, empathetically, and helpfully.
5. Use simple vocabulary appropriate for a citizen who may not be tech-savvy.
6. For emergencies, always mention 112 (National Emergency) or 108 (Ambulance).
7. Do NOT mention other agents, do NOT suggest handoffs — you are already the correct agent.
${(() => {
  if (!citizenProfile) return '';
  const dobYear = citizenProfile.dob ? parseInt((citizenProfile.dob as string).split(' ').pop() || '0') : 0;
  const age = dobYear ? new Date().getFullYear() - dobYear : null;
  const incomeFormatted = citizenProfile.income ? `₹${(citizenProfile.income as number).toLocaleString('en-IN')}/year` : 'Not provided';
  const linked = Array.isArray(citizenProfile.linkedSchemes) && citizenProfile.linkedSchemes.length ? (citizenProfile.linkedSchemes as string[]).join(', ') : 'None';
  const eligible = Array.isArray(citizenProfile.eligibleSchemes) && citizenProfile.eligibleSchemes.length ? (citizenProfile.eligibleSchemes as string[]).join(', ') : 'Not determined';
  return `
CITIZEN PROFILE (Aadhaar-verified — use this for personalised responses):
• Name: ${citizenProfile.name}${citizenProfile.nameHindi ? ` (${citizenProfile.nameHindi})` : ''}
• Age: ${age ? `${age} years` : 'Not provided'} | Gender: ${citizenProfile.gender || 'Not specified'}
• Location: ${citizenProfile.district ? `${citizenProfile.district}, ` : ''}${citizenProfile.state || 'India'} | DIGIPIN: ${citizenProfile.digipin || digipin || 'Not provided'}
• Address: ${citizenProfile.address || 'Not provided'}
• Occupation: ${citizenProfile.occupation || 'Not provided'} | Annual Income: ${incomeFormatted}
• Ration Card: ${citizenProfile.rationCardType || 'Not provided'} | BPL: ${citizenProfile.bplCard ? 'Yes' : 'No'}
• Currently Enrolled Schemes: ${linked}
• Eligible But Not Yet Applied: ${eligible}

KEY INSTRUCTIONS:
- Address the citizen by first name when natural.
- Never suggest schemes they are already enrolled in (see enrolled list above) unless they ask.
- Use their income and occupation to calibrate advice (e.g. don’t recommend premium products to a low-income citizen).
- Their location/DIGIPIN determines nearby PHC, police station, and local government offices.`;
})()}

${sharedContext ? `
[SHARED MCP CONTEXT - RECENT CROSS-AGENT INTERACTIONS]
The citizen recently spoke to other specialized agents. Use this history to seamlessly continue the conversation without asking them to repeat themselves:
${sharedContext}
` : ''}`;

    // Build messages array — cap history at 6 messages (3 turns) to save tokens
    const trimmedHistory = (conversationHistory as { role: string; content: string }[])
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .slice(-6);
    const messages = [
      { role: 'system', content: orchestratorSystemPrompt },
      ...trimmedHistory.map((msg) => ({ role: msg.role, content: msg.content })),
      { role: 'user', content: message },
    ];

    // ── Pick Azure deployment via round-robin (A / B alternate each request) ──
    const chosenDeployment = pickDeployment();
    console.log(`[DEPLOY] using ${chosenDeployment} (counter=${rrCounter})`);

    const apiUrl = useGitHubModels
      ? `${azureConfig.githubModels.endpoint}/chat/completions`
      : `${azureConfig.openai.endpoint}/openai/deployments/${chosenDeployment}/chat/completions?api-version=${azureConfig.openai.apiVersion}`;

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (useGitHubModels) {
      // When Phi failed and GPT is doing routing, use the dedicated routing token to avoid
      // exhausting the main chat token's rate limit on routing calls.
      const gptRoutingToken = !phiClassified
        ? (process.env['GITHUB_TOKEN_GPT_ROUTING'] || ghToken)
        : ghToken;
      headers['Authorization'] = `Bearer ${gptRoutingToken}`;
    } else {
      headers['api-key'] = azureConfig.openai.apiKey;
    }

    const bodyPayload: Record<string, unknown> = {
      messages,
      max_tokens: 700,  // enough for detailed step-by-step guidance
      temperature: 0.7,
      top_p: 0.95,
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
    };
    if (useGitHubModels) {
      bodyPayload.model = azureConfig.githubModels.model;
    }

    let response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(bodyPayload),
      signal: AbortSignal.timeout(12000), // 12s hard limit
    });

    // ── 429 handling: try the OTHER deployment first, then GitHub fallback ─────
    // If deployment A is rate-limited, try deployment B before giving up.
    // This makes 429s invisible to users as long as both aren't simultaneously exhausted.
    if (!response.ok && response.status === 429 && !useGitHubModels) {
      const otherDeployment = chosenDeployment === azureConfig.openai.deploymentName
        ? azureConfig.openai.deploymentNameB
        : azureConfig.openai.deploymentName;

      if (otherDeployment) {
        console.warn(`[RETRY] ${chosenDeployment} 429 — retrying with ${otherDeployment}`);
        const retryUrl = `${azureConfig.openai.endpoint}/openai/deployments/${otherDeployment}/chat/completions?api-version=${azureConfig.openai.apiVersion}`;
        try {
          const retryResponse = await fetch(retryUrl, {
            method: 'POST',
            headers,
            body: JSON.stringify(bodyPayload),
            signal: AbortSignal.timeout(15000),
          });
          if (retryResponse.ok) {
            response = retryResponse;
            console.log(`[RETRY] ${otherDeployment} succeeded`);
          } else {
            console.warn(`[RETRY] ${otherDeployment} also failed (${retryResponse.status}) — falling back to GitHub Models`);
          }
        } catch {
          console.warn(`[RETRY] ${otherDeployment} timed out`);
        }
      }
    }

    // ── Azure → GitHub Models fallback (both deployments exhausted) ──────────
    if (!response.ok && response.status === 429 && !useGitHubModels && ghToken) {
      console.warn('[FALLBACK] Azure 429 — retrying with GitHub Models gpt-4o');
      const ghUrl = `${azureConfig.githubModels.endpoint}/chat/completions`;
      const ghHeaders = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${ghToken}` };
      const ghBody = { ...bodyPayload, model: azureConfig.githubModels.model };
      try {
        response = await fetch(ghUrl, { method: 'POST', headers: ghHeaders, body: JSON.stringify(ghBody), signal: AbortSignal.timeout(12000) });
      } catch {
        console.warn('[FALLBACK] GitHub Models fetch failed/timed out — using rich demo response');
        return NextResponse.json({
          reply: getDemoReply(resolvedAgentKey, message, language, digipin),
          agent: { name: agent.name, role: agent.role, color: agent.color, icon: agent.icon },
          suggestedAgent,
          resolvedAgentKey,
          source: 'demo-rate-limited',
        });
      }
      // If GitHub also fails for any reason, return rich demo — don't throw
      if (!response.ok) {
        console.warn(`[FALLBACK] GitHub Models also failed (${response.status}) — using rich demo response`);
        return NextResponse.json({
          reply: getDemoReply(resolvedAgentKey, message, language, digipin),
          agent: { name: agent.name, role: agent.role, color: agent.color, icon: agent.icon },
          suggestedAgent,
          resolvedAgentKey,
          source: 'demo-rate-limited',
        });
      }
    }

    if (!response.ok) {
      const err = await response.text();
      console.error(`${useGitHubModels ? 'GitHub Models' : 'Azure OpenAI'} error:`, err);
      throw new Error(`AI service error: ${response.status}`);
    }

    const data = await response.json();
    // Log the actual model used — Azure returns the fine-tune model ID here (confirms v2 vs v1)
    if (data.model) console.log(`[MODEL] actual="${data.model}" deploy="${chosenDeployment}"`);
    const rawReply = data.choices?.[0]?.message?.content || 'कृपया पुनः प्रयास करें।';

    // ── Post-GPT: harvest Phi if it resolved while GPT was running ─────────
    // GPT takes 3-12s; warm Phi takes 2-3s — so Phi is often already done here.
    // 100ms gives it a final chance without adding meaningful latency.
    if (!phiClassified) {
      const phiLate = await Promise.race([
        phiPromise,
        new Promise<null>(r => setTimeout(() => r(null), 100)),
      ]);
      if (phiLate) {
        phiClassified = phiLate;
        console.log(`[PHI] late result (resolved during GPT execution): ${phiLate}`);
        if (phiLate !== resolvedAgentKey && !suggestedAgent) {
          suggestedAgent = phiLate;
          console.log(`[PHI] late handoff suggestion: → ${phiLate}`);
        }
      }
    }

    // ── Extract and strip the AGENT: routing prefix emitted by GPT (Legacy Support) ─
    let reply = rawReply;
    const agentPrefixMatch = rawReply.match(/^AGENT:(nagarik_mitra|swasthya_sahayak|yojana_saathi|arthik_salahkar|vidhi_sahayak)[\s\n]*/i);
    if (agentPrefixMatch) {
      const gptAgent = agentPrefixMatch[1].toLowerCase() as AgentKey;
      reply = rawReply.slice(agentPrefixMatch[0].length).trim();
      console.log(`[GPT] stripped legacy routing tag: ${gptAgent}`);
      // NOTE: GPT routing fallback is now disabled to strictly use Phi
    }

    return NextResponse.json({
      reply,
      agent: {
        name: agent.name,
        role: agent.role,
        color: agent.color,
        icon: agent.icon,
      },
      suggestedAgent, // non-null if Phi-3 routed to a different agent
      resolvedAgentKey, // which agent actually answered
      usage: data.usage,
    });
  } catch (error: unknown) {
    console.error('Agent API error:', error);
    // Demo fallback when AI is unavailable
    const agent = agentConfigs[reqAgentKey] || agentConfigs.nagarik_mitra;
    return NextResponse.json({
      reply: getDemoReply(reqAgentKey, reqMessage, reqLanguage),
      agent: { name: agent.name, role: agent.role, color: agent.color, icon: agent.icon },
      suggestedAgent: null,
      source: 'demo',
    });
  }
}

function getDemoReply(agentKey: string, message: string, language = 'hi', digipin = '88-H2K-99L1'): string {
  const DEMO_YEAR = new Date().getFullYear();
  const msg = (message || '').toLowerCase();
  const isEn = language === 'en' || language.startsWith('en-');

  // ── English responses ────────────────────────────────────────────────────────
  const enReplies: Record<string, Record<string, string>> = {
    nagarik_mitra: {
      default: '🏛️ Hello! I am Nagarik Mitra, your civic services assistant.\n\nI can help you with:\n• Street light / road repairs\n• Water supply issues\n• Sanitation complaints\n• File RTI or grievances via PGPortal\n\n📍 Your DIGIPIN zone is Active. Please describe your issue.',
      streetlight: `💡 Street light complaint registered!\n\nTicket: GRV-${DEMO_YEAR}-4521\nCategory: Electricity / Lighting\nPriority: HIGH\n\n📋 Status: Forwarded to PWD Department\n⏰ Expected resolution: 48 hours\n\n+25 Karma Points earned! 🌟`,
      water: `🚰 Water supply issue — we understand!\n\nJal Board has been alerted for your DIGIPIN zone.\nTicket: GRV-${DEMO_YEAR}-4522\n\nNearby Options:\n• Tanker Service: 1800-XXX-XXXX\n• Community Bore: 500m NW\n\nWant to know your legal right to water? Ask Vidhi Sahayak.`,
    },
    swasthya_sahayak: {
      default: '🏥 Hello! I am Swasthya Sahayak, your health assistant.\n\n💊 Nearest PHC: 2.1 km away\n🩺 Ayushman Bharat: ACTIVE\n📅 Next vaccination reminder: scheduled\n\nHow can I help you today — vaccination, ABHA ID, nearest hospital, or medicine?',
      vaccination: '💉 Vaccination Update:\n\n✅ BCG - Done\n✅ OPV 1,2,3 - Done\n⏳ Measles-1 - Due soon\n⏳ JE-1 - Due Dec\n\nNearest Center: Primary Health Centre\nReminder has been set! 🔔',
    },
    yojana_saathi: {
      default: '📋 Hello! I am Yojana Saathi, your welfare scheme guide.\n\n🔍 I can help you:\n• Check eligibility for PM-KISAN, Ayushman, MGNREGA\n• Apply for schemes via Jan Samarth portal\n• Track your DBT (Direct Benefit Transfer) payments\n\n✅ Multiple schemes available — tell me your need.',
      kisan: '🌾 PM-KISAN Status:\n\n✅ Registration: Active\n💰 Last installment: ₹2,000\n📅 Next installment: Expected soon\n\nAlso eligible for:\n• PMFBY (Crop Insurance) — Apply Now\n• KCC (Kisan Credit Card) — Pre-approved\n• PM-KUSUM (Solar Pump) — 60% subsidy',
    },
    arthik_salahkar: {
      default: '💰 Hello! I am Arthik Salahkar, your financial advisor.\n\n🛡️ Scam Shield: ACTIVE\n📊 I can help with UPI safety, Mudra loans, Jan Dhan account, and cyber fraud reporting.\n\nReport fraud: **1930** (National Cyber Crime Helpline)',
      scam: '🚨 SCAM ALERT DETECTED!\n\nPattern: Fake KYC request\nThreat Level: HIGH\n\n⚠️ Never share OTP, PIN, or bank details over phone!\n\n📞 Report: **1930** (Cyber Crime Helpline)\n🔒 Your accounts are SAFE',
    },
    vidhi_sahayak: {
      default: '⚖️ Hello! I am Vidhi Sahayak, your free legal aid assistant.\n\n📋 Your Rights:\n• Right to Information (RTI)\n• Right to Free Legal Aid (if income < ₹3L)\n• Right to Fair Trial\n\n🏛️ NALSA Helpline: **15100** (free, 24×7)',
      zerofir: '📋 How to file a Zero FIR:\n\n1. Go to **any** police station\n2. Demand FIR registration (cannot be refused)\n3. Get a free copy of your FIR\n4. It will be auto-transferred to the concerned station\n\n⚖️ Under Section 173 BNSS\n\nI can help draft your FIR. Please share the details.',
    },
  };

  // ── Hindi responses (original) ───────────────────────────────────────────────
  const replies: Record<string, Record<string, string>> = {
    nagarik_mitra: {
      default: `🏛️ नमस्ते! मैं नागरिक मित्र हूं। आपकी नगरपालिका सेवाओं में मदद के लिए यहां हूं। कृपया अपनी समस्या बताएं - सड़क, पानी, बिजली, या कोई और सेवा।\n\n📍 DIGIPIN: ${digipin} (Active)\n🔧 आज 12 शिकायतें हल हुईं आपके क्षेत्र में।`,
      streetlight: `💡 स्ट्रीटलाइट शिकायत दर्ज!\n\nTicket: GRV-${DEMO_YEAR}-4521\nDIGIPIN Location: ${digipin}\nCategory: Electricity/Lighting\nPriority: HIGH\n\n📋 Status: PWD विभाग को भेजा गया\n⏰ Expected: 48 hours\n\n+25 Karma Points earned! 🌟`,
      water: `🚰 पानी की समस्या – हम समझते हैं!\n\nDIGIPIN ${digipin} पर Jal Board को alert भेजा गया।\nTicket: GRV-${DEMO_YEAR}-4522\n\nNearby Options:\n• Tanker Service: 1800-XXX-XXXX\n• Community Bore: 500m NW\n\nVidhi Sahayak से बात करें? (Right to Water Act)`,
    },
    swasthya_sahayak: {
      default: `🏥 नमस्ते! मैं स्वास्थ्य सहायक हूं। आपके स्वास्थ्य संबंधी प्रश्नों में मदद करने के लिए यहां हूं।\n\n💊 Nearest PHC: 2.1 km (DIGIPIN)\n🩺 Ayushman Bharat: ACTIVE\n📅 Next vaccination: 15 Nov ${DEMO_YEAR}`,
      vaccination: `💉 टीकाकरण अपडेट:\n\nShishu (Age: 8 months)\n✅ BCG - Done\n✅ OPV 1,2,3 - Done\n⏳ Measles-1 - Due 15 Nov ${DEMO_YEAR}\n⏳ JE-1 - Due 20 Dec ${DEMO_YEAR}\n\nNearest Center: Nearest PHC\nReminder set! 🔔`,
    },
    yojana_saathi: {
      default: '📋 नमस्ते! मैं योजना साथी हूं। सरकारी योजनाओं की जानकारी और आवेदन में मदद करता हूं।\n\n✅ योजनाओं के लिए पात्रता जांचें\n⚡ PM-KISAN, Ayushman, MGNREGA, Ujjwala जैसी योजनाएं\n📲 Jan Samarth portal पर आवेदन करें\n\nअपनी ज़रूरत बताएं — मैं सही योजना खोजूंगा।',
      kisan: `🌾 PM-KISAN Status:\n\n✅ Registration: Active\n💰 Last installment: ₹2,000 (Aug ${DEMO_YEAR - 1})\n📅 Next installment: Expected Dec ${DEMO_YEAR}\n\nAdditional Eligible:\n• PMFBY (Crop Insurance) - Apply Now\n• KCC (Kisan Credit Card) - Pre-approved\n• PM-KUSUM (Solar Pump) - 60% subsidy`,
    },
    arthik_salahkar: {
      default: '💰 नमस्ते! मैं आर्थिक सलाहकार हूं। वित्तीय मार्गदर्शन में मदद करता हूं।\n\n🛡️ Scam Shield: ACTIVE\n📊 Financial Health Score: 72/100\n💳 UPI Safety: All transactions monitored',
      scam: '🚨 SCAM ALERT DETECTED!\n\nPattern: Fake KYC request via SMS\nThreat Level: HIGH\n\n⚠️ कभी भी OTP, PIN, या bank details फोन पर न दें!\n\n📞 Report: 1930 (Cyber Crime)\n🔒 Your accounts are SAFE\n\nAzure Content Safety Score: 98.2% threat confidence',
    },
    vidhi_sahayak: {
      default: '⚖️ नमस्ते! मैं विधि सहायक हूं। कानूनी सहायता में मदद करता हूं।\n\n📋 Your Rights:\n• Right to Information (RTI)\n• Right to Fair Trial\n• Legal Aid (Free if income < ₹3L)\n\n🏛️ Nearest Legal Aid: District Court, 4.2 km\n📞 NALSA Helpline: 15100',
      zerofir: '📋 Zero FIR दर्ज करने की प्रक्रिया:\n\n1. किसी भी थाने में जाएं\n2. FIR लिखवाएं (मना करने पर SP को शिकायत)\n3. FIR की कॉपी लें (Free)\n4. Auto-transfer होगा concerned PS को\n\n⚖️ BNSS Section 173 (पूर्व CrPC Section 154)\n\nMein aapki FIR draft kar sakta hoon. Details share karein.',
    },
  };

  // Route to English, Hindi, or English-fallback responses based on language
  // For languages other than Hindi (e.g. Tamil, Telugu, Bengali), serve English as
  // the clearest available fallback when the real API is unavailable.
  const isHindi = language === 'hi' || language.startsWith('hi-');
  const agentReplies = (isEn || (!isHindi))
    ? (enReplies[agentKey] || enReplies.nagarik_mitra)
    : (replies[agentKey] || replies.nagarik_mitra);

  // Try to match keywords
  for (const [key, reply] of Object.entries(agentReplies)) {
    if (key !== 'default' && msg.includes(key)) return reply;
  }

  // Additional keyword matching
  if (msg.includes('street') || msg.includes('light') || msg.includes('bijli')) return agentReplies.streetlight || agentReplies.default;
  if (msg.includes('water') || msg.includes('pani') || msg.includes('jal')) return agentReplies.water || agentReplies.default;
  if (msg.includes('vaccine') || msg.includes('teeka') || msg.includes('tika')) return agentReplies.vaccination || agentReplies.default;
  if (msg.includes('kisan') || msg.includes('farm') || msg.includes('kheti')) return agentReplies.kisan || agentReplies.default;
  if (msg.includes('scam') || msg.includes('fraud') || msg.includes('otp') || msg.includes('dhoka')) return agentReplies.scam || agentReplies.default;
  if (msg.includes('fir') || msg.includes('police') || msg.includes('complaint')) return agentReplies.zerofir || agentReplies.default;

  return agentReplies.default;
}
