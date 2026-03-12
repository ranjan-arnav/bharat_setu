'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useAppStore, type AgentKey } from '@/lib/store';
import { agentConfigs } from '@/lib/azure-config';
import { DEMO_AGENT_RESPONSES, getTypingDelay } from '@/lib/demo-data';
import type { TrackedItem } from '@/lib/store';
import GovStatusBar from './GovStatusBar';
import RichChatCard, { type ParsedCard } from './RichChatCard';
import { FlagStripe, GoiBadge } from '@/components/ui/GoiElements';
import { useTranslation } from '@/lib/i18n/useTranslation';

/** Returns a localised "added to Track tab" toast message */
function getTrackAddedMsg(language?: string): string {
  const lang = (language || 'hi').split('-')[0];
  const msgs: Record<string, string> = {
    hi: '✓ Track tab में जोड़ा गया',
    en: '✓ Added to Track tab',
    mr: '✓ Track tab ला जोडले',
    ta: '✓ Track tab-ல் சேர்க்கப்பட்டது',
    te: '✓ Track tab కి జోడించబడింది',
    bn: '✓ Track tab-এ যোগ করা হয়েছে',
    gu: '✓ Track tab માં ઉમેર્યું',
    kn: '✓ Track tab ಗೆ ಸೇರಿಸಲಾಗಿದೆ',
    ml: '✓ Track tab-ൽ ചേർത്തു',
    pa: '✓ Track tab ਵਿੱਚ ਜੋੜਿਆ',
    ur: '✓ Track tab میں شامل کیا',
  };
  return msgs[lang] || msgs.hi;
}

/** Parse an agent reply for structured ticket metadata to enrich a tracked item. */
function parseReplyForTrackData(reply: string): {
  refId?: string;
  eta?: string;
  status?: 'Active' | 'Under Review' | 'In Progress' | 'Resolved' | 'Pending';
  portal?: string;
  title?: string;
  neighbourhood?: number;
  amount?: string;
} {
  const out: ReturnType<typeof parseReplyForTrackData> = {};

  // Ref ID — "Ticket: GRV-2026-4521" or bare ID patterns
  const refMatch = reply.match(/(?:Ticket|Ref(?:erence)?|No\.?|ID|#)\s*[:.]?\s*([A-Z][A-Z0-9\/\-]{4,25})/i)
    || reply.match(/\b(GRV-[A-Z0-9\-]+|TKT-[A-Z0-9\-]+|KISAN-TKT-[A-Z0-9\-]+|PMJAY-[A-Z0-9\-]+|WTR-[A-Z0-9\-]+|FIR-[A-Z0-9\-]+|CYBER-[A-Z0-9\-]+)\b/);
  if (refMatch) out.refId = (refMatch[1] || refMatch[0]).trim();

  // ETA
  const etaMatch = reply.match(/(?:Expected\s+resolution|ETA|within(?:\s+next)?|in)\s*[:.–-]?\s*(\d+\s+hours?|\d+[-–]\d+\s+(?:hours?|days?|working\s+days?)|\d+\s+(?:working\s+)?days?)/i);
  if (etaMatch) out.eta = etaMatch[1].trim();

  // Status
  if (/\b(forwarded|registered|submitted|processing|in\s+progress)\b/i.test(reply)) out.status = 'In Progress';
  else if (/\b(under\s+review|reviewing|being\s+reviewed)\b/i.test(reply)) out.status = 'Under Review';
  else if (/\b(resolved|completed|fixed|done|closed)\b/i.test(reply)) out.status = 'Resolved';
  else if (/\b(pending|waiting|queued)\b/i.test(reply)) out.status = 'Pending';

  // Portal URL
  const portalMap: [RegExp, string][] = [
    [/pgportal\.gov\.in/i, 'pgportal.gov.in'],
    [/pmkisan\.gov\.in/i, 'pmkisan.gov.in'],
    [/pmjay\.gov\.in/i, 'pmjay.gov.in'],
    [/jansamarth/i, 'jansamarth.in'],
    [/umang|mygov/i, 'umang.gov.in'],
    [/myscheme/i, 'myscheme.gov.in'],
    [/1930|cybercrime\.gov/i, 'cybercrime.gov.in'],
    [/nalsa/i, 'nalsa.gov.in'],
  ];
  for (const [pattern, portal] of portalMap) {
    if (pattern.test(reply)) { out.portal = portal; break; }
  }

  // Neighbourhood count — "+12 same issue" or "12 others"
  const nbMatch = reply.match(/[+\+](\d+)\s+(?:same\s+issue|others?|neighbou?rs?)/i);
  if (nbMatch) out.neighbourhood = parseInt(nbMatch[1], 10);

  // Amount — ₹2,000 or Rs. 2000
  const amtMatch = reply.match(/[₹Rs\.]+\s?([\d,]+(?:\.\d{2})?)/);
  if (amtMatch) out.amount = `₹${amtMatch[1]}`;

  // Title — first meaningful non-emoji line from reply (under 65 chars)
  const titleLine = reply
    .split('\n')
    .map(l => l.replace(/^[\s\uD83D\uDD26\uD83D\uDCA1\uD83D\uDEB0\uD83C\uDF3E\uD83D\uDC8A\u2696\uFE0F\uD83C\uDFE5\uD83D\uDCB0\uD83D\uDCCB\uD83D\uDEA8\u2705\u26A0\uFE0F\uD83C\uDF1F\uD83C\uDFDB\uFE0F]+/, '').replace(/\*\*/g, '').trim())
    .find(l => l.length > 8 && l.length < 65 && !/^(Hello|Hi|I am|Namaskar|नमस्ते)/i.test(l));
  if (titleLine) out.title = titleLine;

  return out;
}

const agents: { key: AgentKey; name: string; nameHi: string; icon: string; color: string; shortName: string }[] = [
  { key: 'nagarik_mitra', name: 'Nagarik Mitra', nameHi: 'नागरिक मित्र', icon: 'account_balance', color: '#3B82F6', shortName: 'NM' },
  { key: 'swasthya_sahayak', name: 'Swasthya Sahayak', nameHi: 'स्वास्थ्य सहायक', icon: 'health_and_safety', color: '#10B981', shortName: 'SS' },
  { key: 'yojana_saathi', name: 'Yojana Saathi', nameHi: 'योजना साथी', icon: 'volunteer_activism', color: '#F59E0B', shortName: 'YS' },
  { key: 'arthik_salahkar', name: 'Arthik Salahkar', nameHi: 'आर्थिक सलाहकार', icon: 'account_balance_wallet', color: '#8B5CF6', shortName: 'AS' },
  { key: 'vidhi_sahayak', name: 'Vidhi Sahayak', nameHi: 'विधि सहायक', icon: 'gavel', color: '#EF4444', shortName: 'VS' },
];

// Keyword → Agent intent detection for smart routing
// Includes phonetic/transliterated Hindi variants and common typos
const AGENT_KEYWORDS: Record<AgentKey, RegExp> = {
  nagarik_mitra: /(street\s?light|road|sadak|सड़क|paani|pani|पानी|water|bijli|bijlee|बिजली|electric|safai|safaai|सफाई|garbage|kachra|nagar\s?nigam|municipal|rti|birth\s?cert|death\s?cert|property|ration\s?card|rashan|digipin|infrastr|sewage|drain|nalaa|nala|pothole|gadha|complaint|shikayat|shikaayat|शिकायत|pramanpatra|praman\s?patra|प्रमाणपत्र|sampatti|संपत्ति|राशन|sadak|bijli|sewer|light\s?pole|lamp\s?post|জল|পানি|রাস্তা|বিদ্যুৎ|নালা|আবর্জনা|নগর|నీళ్ళు|రోడ్డు|కరెంట్|వీధి|తాగునీరు|தண்ணீர்|சாலை|மின்சாரம்|கால்வாய்|குப்பை|पाणी|रस्ता|वीज|ड्रेनेज|ಕುಡಿಯುವ ನೀರು|ರಸ್ತೆ|ವಿದ್ಯುತ್|ಚರಂಡಿ|ಕಸ|വെള്ളം|റോഡ്|വൈദ്യുതി|ഡ്രൈനേജ്|ਪਾਣੀ|ਸੜਕ|ਬਿਜਲੀ|ਨਾਲਾ)/i,
  swasthya_sahayak: /(hospital|hosptl|aspatal|aspataal|doctor|daktar|doktar|health|helth|স্বাস্থ্য|swasthya|vaccin|vaxin|vaksin|vakcin|tika|teeka|teekaa|टीका|medicin|dawai|dawa|davai|दवाई|ayushman|aayushman|আয়ুষ্মান|ambulance|ambulans|এম্বুলেন্স|blood|khoon|বীমার|bimar|beemar|sick|fever|bukhar|bukhaar|বুখার|covid|pregnan|garbh|গর্ভ|abdm|u-?win|uwin|ilaj|ilaaj|treatment|checkup|check-?up|rog|rogi|bimari|bimaari|দবা|sehat|tablet|injection|clinic|tabiyat|tabeeyat|तबियत|thik\s?nahi?|ठीक नहीं|unwell|not\s?well|not\s?feeling|feeling\s?(sick|ill|bad|unwell|dizzy)|feel\s?(sick|bad|ill|unwell)|i.?m\s+(sick|ill|unwell)|body\s?(pain|ache)|headache|sore\s?throat|high\s?temp|ill\b|feel\s?nahi?|dard|দর্দ|স্বাস্থ্য|ডাক্তার|ওষুধ|অসুস্থ|টিকা|জ্বর|ఆసుపత్రి|డాక్టర్|మందు|జబ్బు|టీకా|జ్వరం|மருத்துவமனை|டாக்டர்|மருந்து|நோய்|தடுப்பூசி|காய்ச்சல்|रुग्णालय|औषध|आजारी|लस|ताप|ಆಸ್ಪತ್ರೆ|ವೈದ್ಯ|ಔಷಧ|ಜ್ವರ|ആശുപത്രി|ഡോക്ടർ|മരുന്ന്|പനി|ਹਸਪਤਾਲ|ਡਾਕਟਰ|ਦਵਾਈ|ਬਿਮਾਰ|eating|khaana|khana|khana\s?nahi|khana\s?nahi?|not\s?eating|loss\s?of\s?appetite|bhookh\s?nahi|bhojan|poop|stool|latrine|motion|loose\s?motion|diarrhea|diarrhoea|daast|dast|दस्त|ulti|ultee|vomit|उल्टी|nausea|ghbrahat|nauzia|digest|digestive|pet\s?kharab|khana\s?nahi\s?pa|peena|drinking\s?problem|pain\s?eating|khana\s?khaane\s?mein|pina|पेट खराब|dysentr|cholera|dehydr|kamzori|weakness|dizziness|chakkar|चक्कर|weight\s?loss|vajan\s?kam|appetite|bhookh|भूख|पीना|खाना|addict|addiction|obsess|craving|paglu|naasha|nasha|नशा|alcohol|smoking|cigaret|drug\s?habit|junk\s?food|diet\s?coke|mental\s?health|anxiety|depress|stress|phobia|aadat|adat|आदत|latt|lat)/i,
  yojana_saathi: /(scheme|skeem|yojana|yojna|योजना|pm[\s-]?kisan|kisan|kisaan|কিষান|subsidy|subsidi|sabsidi|সাবসিডি|awas|aavas|awaas|housing|makan|makaan|মাকান|mgnrega|mnrega|narega|nrega|নরেগা|ujjwala|ujwala|ujala|গ্যাস|gas|fasal\s?bima|crop|fasal|ফসল|enroll|patrata|paatrata|পাত্রতা|eligib|registr|panjikaran|panjikran|পঞ্জিকরণ|welfare|sarkari|government\s?scheme|labh|laabh|pension|ration|ayushman|ayushmann|ayushmaan|pmjay|pm-?jay|আয়ুষ্মান|যোজনা|প্রকল্প|পেনশন|রেশন|ভর্তুকি|কৃষক|పథకం|యోజన|పెన్షన్|రేషన్|సబ్సిడీ|రైతు|திட்டம்|யோஜனை|ஓய்வூதியம்|ரேஷன்|மானியம்|விவசாயி|योजना|पेन्शन|रेशन|शेतकरी|ಯೋಜನೆ|ಪಿಂಚಣಿ|ರೇಷನ್|ರೈತ|പദ്ധതി|പെൻഷൻ|ਯੋਜਨਾ|ਪੈਨਸ਼ਨ|ਰਾਸ਼ਨ|ਕਿਸਾਨ)/i,
  arthik_salahkar: /(scam|skam|fraud|frod|dhokha|धोखा|otp|upi|loan|lon|লোন|mudra|মুদ্রা|bank|baink|বাইংক|jan\s?dhan|saving|bachat|বচত|invest|nivesh|নিবেশ|money|paisa|paise|পাইসা|payment|paymnt|financi|emi|credit|debit|digital\s?pay|phishing|cyber\s?fraud|mulehunter|cheat|thug|thagi|thagee|ঠগি|loot|rupay|rupee|atm|wallet|account|khata|খাতা|ব্যাংক|ঋণ|জালিয়াতি|প্রতারণা|ইউপিআই|బ్యాంకు|రుణం|మోసం|సైబర్|வங்கி|கடன்|மோசடி|சைபர்|बँक|कर्ज|फसवणूक|ਬੈਂਕ|ਕਰਜ਼|ਧੋਖਾ|ಬ್ಯಾಂಕ್|ಸಾಲ|ವಂಚನೆ|ಸೈಬರ್|ബാങ്ക്|വായ്പ|തട്ടിപ്പ്|സൈബർ)/i,
  vidhi_sahayak: /(fir|f\.i\.r|police|pulis|pulice|পুলিশ|court|kort|আদালত|legal|legl|kanoon|kानून|কানুন|law|adhikar|অধিকার|right|arrest|giraftar|giraftaar|গ্রেফতার|bail|zamanat|jamanat|জামানত|nalsa|nyaya|nyay|ন্যায়|consumer|upbhokta|উপভোক্তা|lawyer|vakil|vakeel|বাকিল|magistrate|dispute|vivad|vivaad|বিবাদ|domestic\s?violen|domestic\s?abuse|abuse|harassment|assault|rape|molest|stalk|dowry|dahej|দাহেজ|zero\s?fir|thana|chauki|case\s?file|complain\s?police|kanuni|घरेलू\s*हिंसा|मारपीट|उत्पीड़न|छेड़छाड़|बलात्कार|महिला\s*सुरक्षा|पति.*मार|पति.*पीट|পুলিশ|আদালত|আইন|অধিকার|এফআইআর|పోలీసు|న్యాయస్థానం|చట్టం|హక్కు|போலீஸ்|நீதிமன்றம்|சட்டம்|உரிமை|पोलीस|न्यायालय|कायदा|हक्क|ਪੁਲਿਸ|ਅਦਾਲਤ|ਕਾਨੂੰਨ|ਅਧਿਕਾਰ|ಪೊಲೀಸ್|ನ್ಯಾಯಾಲಯ|ಕಾನೂನು|ಹಕ್ಕು|പോലീസ്|കോടതി|നിയമം|അവകാശം)/i,
};

/** Score all agents against a pre-normalised message string. Shared by detectBestAgent and
 *  the clientDetectedAgent IIFE so we iterate AGENT_KEYWORDS only once per message send. */
function scoreAgentKeywords(normalized: string): Partial<Record<AgentKey, number>> {
  const scores: Partial<Record<AgentKey, number>> = {};
  for (const [agent, pattern] of Object.entries(AGENT_KEYWORDS)) {
    const matches = normalized.match(new RegExp(pattern, 'gi'));
    if (matches) scores[agent as AgentKey] = matches.length;
  }
  return scores;
}

/** Detect the best-fit agent for a user message. Returns null if current agent is fine. */
function detectBestAgent(message: string, currentAgent: AgentKey): AgentKey | null {
  // Normalize: lowercase, collapse whitespace, strip punctuation for fuzzy matching
  const normalized = message.toLowerCase().replace(/[.,!?;:'"()]/g, ' ').replace(/\s+/g, ' ').trim();

  const scores = scoreAgentKeywords(normalized);
  // Find highest scoring agent
  let best: AgentKey | null = null;
  let bestScore = 0;
  for (const [agent, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score;
      best = agent as AgentKey;
    }
  }
  // Only redirect if best agent is different from current AND has high enough confidence
  if (best && best !== currentAgent && bestScore >= 1) {
    // Check if current agent also matched — if so, don't redirect
    if (scores[currentAgent] && scores[currentAgent]! >= bestScore) return null;
    return best;
  }
  return null;
}

const quickActions: Record<AgentKey, { label: string; query: string }[]> = {
  nagarik_mitra: [
    { label: '🔦 Broken streetlight', query: 'streetlight' },
    { label: '💧 Water problem', query: 'water' },
    { label: '📋 RTI file करें', query: 'default' },
  ],
  swasthya_sahayak: [
    { label: '💉 Vaccination schedule', query: 'vaccination' },
    { label: '🏥 Nearest hospital', query: 'default' },
    { label: '💊 Ayushman Bharat', query: 'default' },
  ],
  yojana_saathi: [
    { label: '🌾 PM-KISAN Info', query: 'kisan' },
    { label: '🔍 Scheme Scanner', query: 'default' },
    { label: '📊 My eligibility', query: 'default' },
  ],
  arthik_salahkar: [
    { label: '🚨 Scam report', query: 'scam' },
    { label: '💳 Mudra Loan', query: 'default' },
    { label: '📱 UPI help', query: 'default' },
  ],
  vidhi_sahayak: [
    { label: '🚨 Zero FIR', query: 'zerofir' },
    { label: '⚖️ Free legal aid', query: 'default' },
    { label: '🛡️ Consumer rights', query: 'default' },
  ],
};

/** Find TrackedItems relevant to a quick-action button click */
function findRelatedTrackedItems(
  query: string,
  label: string,
  items: TrackedItem[],
): TrackedItem[] {
  const combined = (query + ' ' + label).toLowerCase();
  const rules: Array<{ re: RegExp; check: (it: TrackedItem) => boolean }> = [
    {
      re: /streetlight|street.?light|lamp|bulb|broken.?light/,
      check: it =>
        it.type === 'grievance' &&
        /streetlight|light|lamp|bulb/i.test(it.title + ' ' + it.description),
    },
    {
      re: /water|paani|pani/,
      check: it =>
        it.type === 'grievance' &&
        /water|paani|pani|supply/i.test(it.title + ' ' + it.description),
    },
    {
      re: /road|pothole|sadak/,
      check: it =>
        it.type === 'grievance' &&
        /road|pothole|sadak/i.test(it.title + ' ' + it.description),
    },
    {
      re: /kisan|pm.?kisan|farmer|crop/,
      check: it =>
        it.type === 'scheme' && /kisan/i.test(it.title + ' ' + it.description),
    },
    { re: /scam|fraud|upi|otp|cyber/, check: it => it.type === 'finance' },
    { re: /zerofir|zero.?fir|fir|court|legal/, check: it => it.type === 'legal' },
    {
      re: /vaccin|health|hospital|ayushman/,
      check: it => it.type === 'health',
    },
    { re: /scheme|yojana|pension/, check: it => it.type === 'scheme' },
  ];
  for (const { re, check } of rules) {
    if (re.test(combined)) {
      const found = items.filter(check);
      if (found.length) return found;
    }
  }
  return [];
}

export default function AgentChat({ onClose }: { onClose: () => void }) {
  const { activeAgent, setActiveAgent, setOverlay, chatHistory, addMessage, addTrackedItem, enrichTrackedItem } = useAppStore();
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showAgentPicker, setShowAgentPicker] = useState(false);
  const [pendingHandoff, setPendingHandoff] = useState<{ agent: AgentKey; userMsg: string } | null>(null);
  const [trackToast, setTrackToast] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [attachedPreview, setAttachedPreview] = useState<string | null>(null);
  const [attachedAnalysis, setAttachedAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<unknown>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Holds the id of the auto-tracked item just added, so we can enrich it once the reply arrives
  const pendingTrackId = useRef<string | null>(null);

  const currentAgent = agents.find((a) => a.key === activeAgent) || agents[0];
  const messages = chatHistory[activeAgent];

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  // Send welcome message on first open if no messages
  useEffect(() => {
    if (messages.length === 0) {
      // Language-aware fallback welcome (used only if DEMO_AGENT_RESPONSES has no default)
      const lang = useAppStore.getState().userProfile.language?.split('-')[0] || 'hi';
      const WELCOME_FALLBACK: Record<string, string> = {
        hi: 'नमस्ते! मैं आपकी कैसे मदद कर सकता हूँ?',
        mr: 'नमस्कार! मी तुम्हाला कशी मदत करू शकतो?',
        ta: 'வணக்கம்! நான் உங்களுக்கு எப்படி உதவலாம்?',
        te: 'నమస్కారం! నేను మీకు ఎలా సహాయం చేయగలను?',
        bn: 'নমস্কার! আমি আপনাকে কীভাবে সাহায্য করতে পারি?',
        gu: 'નમસ્તે! હું તમારી કેવી રીતે મદદ કરી શકું?',
        kn: 'ನಮಸ್ಕಾರ! ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?',
        ml: 'നമസ്കാരം! ഞാൻ നിങ്ങളെ എങ്ങനെ സഹായിക്കട്ടെ?',
        pa: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?',
        ur: 'السلام علیکم! میں آپ کی کیسے مدد کر سکتا ہوں؟',
        en: 'Hello! How can I help you today?',
      };
      // Agent-specific English welcome messages so each agent introduces itself properly
      const ENGLISH_AGENT_WELCOME: Partial<Record<AgentKey, string>> = {
        nagarik_mitra:    `🏛️ Hello! I'm **Nagarik Mitra**, your civic services assistant.\n\nI can help you with:\n• 🔦 Broken streetlights, potholes, road repairs\n• 💧 Water supply & drainage complaints\n• 📋 Birth/death certificates, ration card\n• 📍 DIGIPIN address verification\n• 📝 RTI filing & municipal complaints\n\nWhat can I help you with today?`,
        swasthya_sahayak: `🏥 Hello! I'm **Swasthya Sahayak**, your health assistant.\n\nI can help you with:\n• 🩺 Symptoms, medicines & health guidance\n• 🏨 Nearest hospitals & PHCs\n• 💉 Vaccination schedule (U-WIN)\n• 💊 Ayushman Bharat PM-JAY health cover\n• 🆘 Emergency: call **108** for ambulance\n\nHow are you feeling today?`,
        yojana_saathi:    `📋 Hello! I'm **Yojana Saathi**, your government schemes guide.\n\nI can help you find and apply for:\n• 🌾 PM-KISAN, MGNREGA, PM-Awas\n• 🏥 Ayushman Bharat card\n• 🛒 Ration card & PDS benefits\n• 🎓 Scholarships & pensions\n• 800+ central & state schemes\n\nTell me about yourself to find eligible schemes!`,
        arthik_salahkar:  `💰 Hello! I'm **Arthik Salahkar**, your financial guide.\n\nI can help with:\n• 🚨 UPI fraud & cyber scam reporting\n• 🏦 Bank account & Jan Dhan issues\n• 💳 MUDRA loan guidance\n• 📱 Digital payment problems\n• 🔐 OTP & phishing protection\n\nWhat financial issue can I assist you with?`,
        vidhi_sahayak:    `⚖️ Hello! I'm **Vidhi Sahayak**, your legal rights assistant.\n\nI can help you with:\n• 🚔 Filing FIR or Zero FIR\n• 🆓 Free legal aid (NALSA)\n• 🛡️ Consumer court complaints\n• 🏡 Land & property disputes\n• 📜 RTI filing & rights violations\n\nWhat legal matter do you need help with?`,
      };
      // Language-first: Hindi → DEMO_AGENT_RESPONSES default; English → agent-specific;
      // other languages → their WELCOME_FALLBACK or Hindi fallback.
      const welcome = (lang === 'hi' || lang.startsWith('hi-'))
        ? (DEMO_AGENT_RESPONSES[activeAgent]?.default || WELCOME_FALLBACK.hi)
        : (lang === 'en' || lang.startsWith('en-'))
          ? (ENGLISH_AGENT_WELCOME[activeAgent] || WELCOME_FALLBACK.en)
          : (WELCOME_FALLBACK[lang] || WELCOME_FALLBACK.hi);
      setIsTyping(true);
      const timer = setTimeout(() => {
        addMessage(activeAgent, {
          id: `welcome-${Date.now()}`,
          role: 'assistant',
          content: welcome,
          timestamp: Date.now(),
          agentKey: activeAgent,
        });
        setIsTyping(false);

        // Auto-send any pending voice transcript (set by VoiceAssistant) — fresh agent session
        const voiceText = useAppStore.getState().lastTranscript;
        if (voiceText) {
          useAppStore.getState().setTranscript('');
          setTimeout(() => sendMessage(voiceText), 500);
        }
      }, 1200);
      return () => clearTimeout(timer);
    } else {
      // Agent already has messages — still check for pending voice transcript
      const voiceText = useAppStore.getState().lastTranscript;
      if (voiceText) {
        useAppStore.getState().setTranscript('');
        setTimeout(() => sendMessage(voiceText), 400);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeAgent]);

  // Listen for inject-chat-message event (from scheme application flow)
  useEffect(() => {
    const handleInjectMessage = (e: Event) => {
      const customEvent = e as CustomEvent;
      const message = customEvent.detail?.message;
      if (message && typeof message === 'string') {
        // Wait a bit for the agent to be fully open
        setTimeout(() => {
          setInput(message);
          // Auto-send after setting the input
          setTimeout(() => sendMessage(message), 100);
        }, 100);
      }
    };

    window.addEventListener('inject-chat-message', handleInjectMessage);
    return () => window.removeEventListener('inject-chat-message', handleInjectMessage);
  }, []);

  const handleImageAttach = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      addMessage(activeAgent, { id: `err-${Date.now()}`, role: 'assistant', content: '⚠️ Image must be under 5 MB. Please choose a smaller photo.', timestamp: Date.now(), agentKey: activeAgent });
      e.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setAttachedPreview(reader.result as string);
    reader.readAsDataURL(file);
    setIsAnalyzing(true);
    setAttachedAnalysis(null);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await fetch('/api/vision-chat', { method: 'POST', body: fd, signal: AbortSignal.timeout(8000) });
      if (res.ok) {
        const data = await res.json() as { analysis?: string };
        setAttachedAnalysis(data.analysis || '');
      }
    } catch { setAttachedAnalysis(''); }
    setIsAnalyzing(false);
    e.target.value = '';
  };

  /** Text-to-Speech: speaks agent responses using Azure TTS */
  const speakText = useCallback(async (text: string) => {
    if (!ttsEnabled || isSpeaking) return;
    
    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    // Strip markdown and formatting for clean speech
    const cleanText = text
      .replace(/\*\*(.*?)\*\*/g, '$1')  // Remove bold
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')  // Remove links
      .replace(/[•📋🏥⚖️💰🌾🔦💧📍🆘]/g, '')  // Remove icons/bullets
      .replace(/\n+/g, '. ')  // Convert newlines to pauses
      .trim();

    if (!cleanText) return;

    setIsSpeaking(true);
    try {
      const lang = useAppStore.getState().userProfile.language || 'hi';
      const langCode = lang.startsWith('hi') ? 'hi-IN' : 
                       lang.startsWith('en') ? 'en-IN' :
                       lang.startsWith('bn') ? 'bn-IN' :
                       lang.startsWith('te') ? 'te-IN' :
                       lang.startsWith('mr') ? 'mr-IN' :
                       lang.startsWith('ta') ? 'ta-IN' :
                       lang.startsWith('gu') ? 'gu-IN' :
                       lang.startsWith('kn') ? 'kn-IN' :
                       lang.startsWith('ml') ? 'ml-IN' : 'hi-IN';

      const res = await fetch('/api/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'tts', text: cleanText, language: langCode }),
      });

      if (res.ok) {
        const audioBlob = await res.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audioRef.current = audio;

        audio.onended = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
          audioRef.current = null;
        };

        audio.onerror = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
          audioRef.current = null;
        };

        await audio.play();
      } else {
        setIsSpeaking(false);
      }
    } catch (err) {
      console.error('[TTS] Failed:', err);
      setIsSpeaking(false);
    }
  }, [ttsEnabled, isSpeaking]);

  // Stop TTS when component unmounts
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const sendMessage = async (text: string, demoKey?: string, skipAutoTrack = false, skipAddUserMsg = false) => {
    if (!text.trim() && !attachedPreview) return;

    // Capture image state before clearing
    const imgPreview = attachedPreview;
    const imgAnalysis = attachedAnalysis;

    // ── Re-read fresh state at call time ──────────────────────────────────────
    // sendMessage can be invoked from stale closures (e.g. after agent handoff),
    // so we always pull activeAgent + chatHistory directly from the store.
    const { activeAgent: currentAgent, chatHistory: freshHistory } = useAppStore.getState();
    const currentMessages = freshHistory[currentAgent];

    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user' as const,
      content: text || '📷 Image sent',
      timestamp: Date.now(),
      ...(imgPreview ? { imageUrl: imgPreview } : {}),
    };
    if (!skipAddUserMsg) {
      addMessage(currentAgent, userMsg);
    }
    setInput('');
    setAttachedPreview(null);
    setAttachedAnalysis(null);
    setIsTyping(true);

    // Auto-track complaints / health / legal into Track tab (skip on handoff replays)
    const COMPLAINT_KW = /\b(pothole|gadha|sadak|street\s?light|paani|pani|water|sewage|nala|nalaa|kachra|garbage|bijli|safai|complaint|shikayat|FIR|zero\s?fir|court|vakil|vakeel|hospital|doctor|beemar|ambulance|108|1930|PM-?KISAN|kisan|yojana|pension|ration|scholarship|chhatravritti|ayushman|pmjay|mgnrega|narega|subsidy|scheme|UPI|fraud|scam|loan)\b/i;
    if (!skipAutoTrack && COMPLAINT_KW.test(text)) {
      const trackedType: TrackedItem['type'] =
        /\b(FIR|court|vakil|vakeel|legal|kanoon|arrest|bail|RTI)\b/i.test(text) ? 'legal' :
        /\b(hospital|doctor|health|beemar|sick|108|ambulance|ayushman|pmjay|abdm)\b/i.test(text) ? 'health' :
        /\b(PM-?KISAN|yojana|pension|ration|scholarship|chhatravritti|mgnrega|narega|subsidy|scheme)\b/i.test(text) ? 'scheme' :
        /\b(UPI|fraud|scam|loan|bank|OTP|cyber)\b/i.test(text) ? 'finance' :
        'grievance';
      const trackId = `auto-${Date.now()}`;
      pendingTrackId.current = trackId;
      const autoItem: TrackedItem = {
        id: trackId,
        type: trackedType,
        title: text.length > 55 ? text.slice(0, 55) + '…' : text,
        description: `Via ${agents.find(a => a.key === currentAgent)?.name || 'Agent'}`,
        status: 'Active',
        createdAt: Date.now(),
        agentKey: currentAgent,
        emoji: trackedType === 'grievance' ? '📋' : trackedType === 'health' ? '🏥' : trackedType === 'scheme' ? '🌾' : trackedType === 'finance' ? '💳' : '⚖️',
      };
      addTrackedItem(autoItem);
      setTrackToast(getTrackAddedMsg(useAppStore.getState().userProfile.language));
      setTimeout(() => setTrackToast(null), 3000);
    }

    // --- SMART AGENT ROUTING ---
    // Check if user's message belongs to a different agent
    const bestAgent = detectBestAgent(text, currentAgent);
    if (bestAgent && !demoKey && !skipAddUserMsg) {
      const targetInfo = agents.find((a) => a.key === bestAgent)!;
      const currentInfo = agents.find((a) => a.key === currentAgent)!;

      const redirectMsg = `🔁 **Better Agent · सही एजेंट**

Your question is best handled by **${targetInfo.name}** · आपका सवाल **${targetInfo.nameHi}** से जुड़ा है।

I am **${currentInfo.name}** — I specialise in ${currentInfo.name === 'Nagarik Mitra' ? 'civic services · नागरिक सेवाएं' : currentInfo.name === 'Swasthya Sahayak' ? 'health · स्वास्थ्य' : currentInfo.name === 'Yojana Saathi' ? 'gov. schemes · सरकारी योजनाएं' : currentInfo.name === 'Arthik Salahkar' ? 'finance · वित्त' : 'legal help · कानूनी सहायता'}.

👇 Tap below to connect · नीचे tap करें:`;

      setTimeout(() => {
        addMessage(currentAgent, {
          id: `redirect-${Date.now()}`,
          role: 'assistant',
          content: redirectMsg,
          timestamp: Date.now(),
          agentKey: currentAgent,
        });
        setPendingHandoff({ agent: bestAgent, userMsg: text });
        setIsTyping(false);
      }, 1200);
      return;
    }

    // Detect which agent client-side keywords point to (even if same as current agent).
    // Reuses scoreAgentKeywords() so AGENT_KEYWORDS is only iterated once per message send.
    // This is sent to the server so Phi skips re-classification when client is confident.
    const clientDetectedAgent = (() => {
      const normalized = text.toLowerCase().replace(/[.,!?;:'"()]/g, ' ').trim();
      const scores = scoreAgentKeywords(normalized);
      let best: AgentKey | null = null;
      let bestScore = 0;
      for (const [agent, score] of Object.entries(scores)) {
        if ((score as number) > bestScore) { bestScore = score as number; best = agent as AgentKey; }
      }
      return best;
    })();

    // Content Safety check — fire-and-forget, non-blocking. Block only high-severity content.
    try {
      const safetyRes = await fetch('/api/content-safety', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.slice(0, 500) }),
        signal: AbortSignal.timeout(4000),
      });
      if (safetyRes.ok) {
        const safetyData = await safetyRes.json() as { safe: boolean; source?: string };
        if (!safetyData.safe) {
          addMessage(currentAgent, {
            id: `safety-${Date.now()}`,
            role: 'assistant',
            content: '⚠️ आपका संदेश सुरक्षा जाँच में विफल रहा। कृपया संदेश संशोधित करें।\n\n⚠️ Your message was flagged by our safety check. Please revise and resend.',
            timestamp: Date.now(),
            agentKey: currentAgent,
          });
          setIsTyping(false);
          return;
        }
      }
    } catch { /* safety bypass on timeout/error — don't block user */ }

    // Translate to English for better Phi-4 classification if user's language is not English
    let textForRouting = text;
    const userLang = useAppStore.getState().userProfile.language || 'hi';
    
    if (!userLang.startsWith('en')) {
      try {
        const translateRes = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: text,
            sourceLang: userLang.split('-')[0], // Extract language code (e.g., 'hi' from 'hi-IN')
            targetLang: 'en',
          }),
          signal: AbortSignal.timeout(5000),
        });

        if (translateRes.ok) {
          const translateData = await translateRes.json();
          textForRouting = translateData.translated || text;
          console.log('[Routing Translation]', { original: text, translated: textForRouting });
        }
      } catch (err) {
        console.warn('[Routing Translation] Failed, using original text:', err);
        // Continue with original text if translation fails
      }
    }

    // Try real API first, then fallback to demo
    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: imgAnalysis
            ? `[Image analysis: ${imgAnalysis}]\n${text || 'Please describe what you see in this image and how it may relate to civic or government services in India.'}`
            : text,
          userText: textForRouting, // translated to English for better routing — used for Phi-4 classification
          agentKey: currentAgent,
          clientDetectedAgent: clientDetectedAgent, // null = let server classify
          // Only send user/assistant turns — filter out system handoff messages,
          // welcome messages, and anything Azure would reject mid-conversation.
          conversationHistory: currentMessages
            .filter((m) => m.role === 'user' || m.role === 'assistant')
            .filter((m) => !(m.id?.startsWith('welcome-')))
            .slice(-6)
            .map((m) => ({ role: m.role, content: m.content })),
          language: useAppStore.getState().userProfile.language || 'hi',
          digipin: useAppStore.getState().userProfile.digipin || '',
          citizenProfile: useAppStore.getState().citizenProfile,
        }),
        signal: AbortSignal.timeout(35000), // 35s — allows for Azure + GitHub fallback
      });

      if (res.ok) {
        const data = await res.json();
        if (data.reply && !data.reply.includes('कृपया पुनः प्रयास करें')) {
          // Check if server routed to a different agent
          const resolvedKey = (data.resolvedAgentKey || currentAgent) as AgentKey;
          const wasRerouted = resolvedKey !== currentAgent;
          const targetAgent = wasRerouted ? agents.find((a) => a.key === resolvedKey) : null;

          setTimeout(() => {
            if (wasRerouted && targetAgent && !skipAddUserMsg) {
              // Auto-switch: store response in the resolved agent's history and switch to it
              addMessage(resolvedKey, {
                id: `agent-${Date.now()}`,
                role: 'assistant',
                content: data.reply,
                timestamp: Date.now(),
                agentKey: resolvedKey,
              });
              // Show handoff notification in current chat
              addMessage(currentAgent, {
                id: `handoff-${Date.now()}`,
                role: 'system',
                content: `🤖 Routing to **${targetAgent.name}** · **${targetAgent.nameHi}** सबसे उपयुक्त हैं — connecting now...`,
                timestamp: Date.now(),
              });
              setIsTyping(false);
              // Auto-execute handoff after brief delay
              setTimeout(() => {
                setPendingHandoff({ agent: resolvedKey, userMsg: imgPreview
                  ? `[Image analysis: ${imgAnalysis || ''}]\n${text || 'Please describe what you see in this image.'}` 
                  : text });
              }, 800);
            } else {
              addMessage(currentAgent, {
                id: `agent-${Date.now()}`,
                role: 'assistant',
                content: data.reply,
                timestamp: Date.now(),
                agentKey: currentAgent,
              });
              setIsTyping(false);
              // Enrich the pending tracked item with ticket details from the reply
              if (pendingTrackId.current) {
                const patch = parseReplyForTrackData(data.reply);
                if (Object.keys(patch).length > 0) enrichTrackedItem(pendingTrackId.current, patch);
                pendingTrackId.current = null;
              }

              // Handle server-side agent handoff suggestion (fallback keyword-based)
              if (data.suggestedAgent && data.suggestedAgent !== currentAgent && !wasRerouted && !skipAddUserMsg) {
                const sTarget = agents.find((a) => a.key === data.suggestedAgent);
                if (sTarget) {
                  setTimeout(() => {
                    addMessage(currentAgent, {
                      id: `handoff-${Date.now()}`,
                      role: 'system',
                      content: `🔁 Also try **${sTarget.name}** · **${sTarget.nameHi}** से भी बात करें?`,
                      timestamp: Date.now(),
                    });
                    setPendingHandoff({ agent: data.suggestedAgent as AgentKey, userMsg: text });
                  }, 500);
                }
              }
            }
          }, 800);
          return;
        }
      }
    } catch {
      // API failed, use demo data
    }

    // Demo fallback with realistic typing delay
    const responses = DEMO_AGENT_RESPONSES[currentAgent] || {};
    const responseKey = demoKey || 'default';
    const reply = responses[responseKey] || responses.default || 'I understand. Let me help you. · मैं समझ गया। मैं इसमें आपकी मदद करूँगा।';
    const delay = getTypingDelay(reply);

    setTimeout(() => {
      addMessage(currentAgent, {
        id: `agent-${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: Date.now(),
        agentKey: currentAgent,
      });
      setIsTyping(false);
      // Enrich the pending tracked item with ticket details from the demo reply
      if (pendingTrackId.current) {
        const patch = parseReplyForTrackData(reply);
        if (Object.keys(patch).length > 0) enrichTrackedItem(pendingTrackId.current, patch);
        pendingTrackId.current = null;
      }
      // Speak the response if TTS is enabled
      if (ttsEnabled) speakText(reply);
    }, delay);
  };

  /** Execute handoff: switch to the suggested agent and replay the user's message */
  const executeHandoff = () => {
    if (!pendingHandoff) return;
    const { agent, userMsg } = pendingHandoff;
    const target = agents.find((a) => a.key === agent)!;

    // Add system message in current chat
    addMessage(activeAgent, {
      id: `sys-handoff-${Date.now()}`,
      role: 'system',
      content: `✅ Connecting to **${target.name}** · **${target.nameHi}** से connect हो रहे हैं...`,
      timestamp: Date.now(),
    });

    setPendingHandoff(null);

    // Switch agent after small delay
    setTimeout(() => {
      setActiveAgent(agent);

      // If agent has no messages yet, the welcome will fire from useEffect.
      // After welcome, send the original user message to get a contextual reply.
      // Translation for routing happens automatically in sendMessage.
      // skipAutoTrack=true prevents creating a duplicate tracked item (was already tracked on first send).
      setTimeout(() => {
        sendMessage(userMsg, undefined, true);
      }, 2000);
    }, 600);
  };

  const handleQuickAction = (query: string, label: string) => {
    // Strip leading emoji and whitespace
    const cleanLabel = label.replace(/^[^\w\u0900-\u097F]+/, '').trim();

    if (/scheme\s*scanner/i.test(cleanLabel)) {
      setOverlay('scheme-scanner');
      return;
    }

    // If there are matching items in the Track tab, show a rich status response
    const relatedItems = findRelatedTrackedItems(
      query,
      label,
      useAppStore.getState().trackedItems,
    );
    if (relatedItems.length > 0) {
      const item = relatedItems[0];
      const sEmoji: Record<string, string> = {
        Active: '\uD83D\uDD35',
        'Under Review': '\uD83D\uDFE1',
        'In Progress': '\uD83D\uDFE0',
        Resolved: '\u2705',
        Pending: '\u23F3',
      };
      const lines: string[] = [
        `${item.emoji || '\uD83D\uDCCB'} **${item.title}** Track tab \u092e\u0947\u0902 \u0926\u0930\u094d\u091c \u0939\u0948\u0964`,
        `Your case is already being tracked.`,
        ``,
        `**Status:** ${sEmoji[item.status] ?? '\uD83D\uDD35'} ${item.status}`,
      ];
      if (item.refId) lines.push(`**Ticket ID:** \`${item.refId}\``);
      if (item.eta) lines.push(`**ETA:** ${item.eta}`);
      if (item.neighbourhood)
        lines.push(`**+${item.neighbourhood}** neighbours in your area filed the same issue`);
      if (item.amount) lines.push(`**Amount:** ${item.amount}`);
      if (item.portal) lines.push(`**Portal:** ${item.portal}`);
      if (relatedItems.length > 1)
        lines.push(
          ``,
          `+${relatedItems.length - 1} more related case${
            relatedItems.length > 2 ? 's' : ''
          } in your Track tab`,
        );
      lines.push(``, `~~TRACK_TAB~~`);

      const { activeAgent: curAgent } = useAppStore.getState();
      addMessage(curAgent, {
        id: `user-${Date.now()}`,
        role: 'user',
        content: cleanLabel || label,
        timestamp: Date.now(),
      });
      setIsTyping(true);
      setTimeout(() => {
        addMessage(curAgent, {
          id: `track-rich-${Date.now()}`,
          role: 'assistant',
          content: lines.join('\n'),
          timestamp: Date.now(),
          agentKey: curAgent,
        });
        setIsTyping(false);
      }, 700);
      return;
    }

    sendMessage(cleanLabel || label, query);
  };

  const switchAgent = (key: AgentKey) => {
    setActiveAgent(key);
    setShowAgentPicker(false);
    setPendingHandoff(null);
  };

  /** Lightweight markdown renderer: **bold**, line breaks preserved */
  // NOTE: kept as utility for potential future use — currently RichChatCard handles formatting

  const renderMessage = (msg: typeof messages[0]) => {
    if (msg.role === 'system') {
      // Render **bold** in handoff / system messages
      const parsedSystem = msg.content.split(/(\*\*[^*]+\*\*)/g).map((part, idx) =>
        part.startsWith('**') && part.endsWith('**')
          ? <strong key={idx} className="font-semibold text-slate-800 dark:text-white">{part.slice(2, -2)}</strong>
          : <span key={idx}>{part}</span>
      );
      return (
        <div key={msg.id} className="flex justify-center my-2">
          <div className="bg-slate-100 dark:bg-[#162a4a]/80 border border-slate-300 dark:border-white/10 rounded-full px-4 py-1.5 text-[11px] text-slate-600 dark:text-gray-400">
            {parsedSystem}
          </div>
        </div>
      );
    }

    const isUser = msg.role === 'user';
    return (
      <div key={msg.id} className={`flex gap-2 mb-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {!isUser && (
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-1"
            style={{ backgroundColor: currentAgent.color }}
          >
            {currentAgent.shortName}
          </div>
        )}
        <div
          className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? 'bg-gradient-to-br from-[#FF9933] to-[#E68A2E] text-white rounded-br-md'
              : 'bg-slate-100 dark:bg-[#162a4a] border border-slate-300 dark:border-white/10 text-slate-800 dark:text-gray-200 rounded-bl-md'
          }`}
        >
          <div>
            {isUser && msg.imageUrl && (
              <img src={msg.imageUrl} alt="Attached" className="max-w-full rounded-xl mb-2 max-h-40 object-cover" />
            )}
            {isUser ? (msg.imageUrl && !msg.content.startsWith('📷') ? msg.content || null : (msg.content === '📷 Image sent' ? null : msg.content)) : (
              <RichChatCard
                content={msg.content}
                agentKey={activeAgent}
                onAction={(card: ParsedCard) => {
                  // 1. Open URL / dial phone based on card type
                  const phoneMatch = card.subtitle?.match(/\b(108|112|102|1930|181|1098|14567)\b/);
                  if (card.type === 'emergency' && phoneMatch) {
                    window.open(`tel:${phoneMatch[0]}`);
                  } else if (card.type === 'health' && card.actionLabel?.toLowerCase().includes('navigate')) {
                    window.open('https://www.bing.com/maps?q=primary+health+centre+near+me', '_blank');
                  } else if (card.type === 'abha') {
                    window.open('https://healthid.ndhm.gov.in', '_blank');
                  } else if (card.type === 'legal') {
                    window.open('https://nalsa.gov.in', '_blank');
                  } else if (card.type === 'dbt') {
                    window.open('https://dbtbharat.gov.in', '_blank');
                  } else if (card.type === 'scheme') {
                    window.open('https://jansamarth.in', '_blank');
                  } else if (card.type === 'track-tab') {
                    setOverlay('track');
                  }

                  // 2. Also track the card if it has a refId
                  if (card.refId) {
                    const typeToEmoji: Record<string, string> = {
                      grievance: '📋', health: '🏥', legal: '⚖️', scheme: '📜',
                      dbt: '💰', finance: '💳', default: '📌',
                    };
                    addTrackedItem({
                      id: `card-${card.refId}-${Date.now()}`,
                      type: card.type === 'grievance' ? 'grievance' : card.type === 'health' ? 'health' : card.type === 'legal' ? 'legal' : card.type === 'dbt' || card.type === 'finance' ? 'finance' : 'scheme',
                      title: card.title,
                      description: card.subtitle || '',
                      status: 'Active',
                      createdAt: Date.now(),
                      agentKey: activeAgent,
                      refId: card.refId,
                      emoji: typeToEmoji[card.type] || typeToEmoji.default,
                    });
                    setTrackToast(getTrackAddedMsg(useAppStore.getState().userProfile.language));
                    setTimeout(() => setTrackToast(null), 3000);
                  }
                }}
              />
            )}
          </div>
          <div className={`text-[9px] mt-1.5 ${isUser ? 'text-white/60' : 'text-slate-500 dark:text-gray-500'}`}>
            {new Date(msg.timestamp).toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white dark:bg-[#0a1628] flex flex-col max-w-[430px] mx-auto" style={{ animation: 'slideUp 0.3s ease-out' }}>
      <FlagStripe />
      {/* Header */}
      <div className="relative flex items-center gap-3 px-4 py-3 bg-slate-100/95 dark:bg-[#0f1f3a]/95 backdrop-blur-xl border-b border-slate-300 dark:border-white/10">
        <button onClick={onClose} className="p-1">
          <span className="material-symbols-outlined text-gray-400">arrow_back</span>
        </button>
        <button
          onClick={() => setShowAgentPicker(!showAgentPicker)}
          className="flex items-center gap-2 flex-1"
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs"
            style={{ backgroundColor: currentAgent.color }}
          >
            <span className="material-symbols-outlined text-lg">{currentAgent.icon}</span>
          </div>
          <div className="text-left">
            <div className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1">
              {currentAgent.name}
              <span className="material-symbols-outlined text-sm text-gray-500 dark:text-gray-400">expand_more</span>
            </div>
            <div className="text-[10px] text-green-600 dark:text-green-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-600 dark:bg-green-400"></span>
              AutoGen 0.4 • Online
            </div>
          </div>
        </button>
        <button onClick={() => { 
          if (messages.length > 0) setShowClearConfirm(true);
        }} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10" title="Clear chat">
          <span className="material-symbols-outlined text-gray-600 dark:text-gray-400 text-xl">delete_sweep</span>
        </button>
        <button 
          onClick={() => {
            setTtsEnabled(!ttsEnabled);
            // Stop any playing audio when disabled
            if (ttsEnabled && audioRef.current) {
              audioRef.current.pause();
              audioRef.current = null;
              setIsSpeaking(false);
            }
          }} 
          className={`p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 ${ttsEnabled ? 'bg-green-100 dark:bg-green-900/30' : ''}`} 
          title={ttsEnabled ? 'TTS Enabled' : 'Enable TTS'}
        >
          <span className={`material-symbols-outlined text-xl ${
            isSpeaking ? 'animate-pulse text-green-600 dark:text-green-400' :
            ttsEnabled ? 'text-green-600 dark:text-green-400' : 
            'text-gray-600 dark:text-gray-400'
          }`}>
            {isSpeaking ? 'volume_up' : ttsEnabled ? 'record_voice_over' : 'voice_over_off'}
          </span>
        </button>
        <GoiBadge className="mr-0.5" />
        {showClearConfirm && (
          <div className="absolute top-14 right-4 z-50 bg-white dark:bg-[#1a0a3a] border border-slate-300 dark:border-white/10 rounded-xl p-3 shadow-2xl flex flex-col gap-2 min-w-[160px]">
            <p className="text-xs text-slate-700 dark:text-gray-300">Clear chat history?</p>
            <div className="flex gap-2">
              <button onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-1 text-xs rounded-lg bg-slate-200 dark:bg-white/5 text-slate-700 dark:text-gray-300 hover:bg-slate-300 dark:hover:bg-white/10">
                Cancel
              </button>
              <button onClick={() => { const { clearChat } = useAppStore.getState(); clearChat(activeAgent); setShowClearConfirm(false); }}
                className="flex-1 py-1 text-xs rounded-lg bg-red-600/80 text-white hover:bg-red-600">
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Agent Handoff Trace */}
      <div className="px-4 py-2 bg-slate-50/90 dark:bg-[#0a1628]/90 border-b border-slate-200 dark:border-white/5 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {agents.map((a, i) => (
          <div key={a.key} className="flex items-center shrink-0">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold border-2 cursor-pointer transition-all ${
                a.key === activeAgent
                  ? 'border-white/50 scale-110'
                  : 'border-transparent opacity-50 hover:opacity-80'
              }`}
              style={{ backgroundColor: a.color }}
              onClick={() => switchAgent(a.key)}
              title={a.name}
            >
              {a.shortName}
            </div>
            {i < agents.length - 1 && (
              <div className="w-4 h-[1px] bg-white/20 mx-0.5"></div>
            )}
          </div>
        ))}
      </div>

      {/* GoI Ecosystem Bar */}
      <GovStatusBar agentKey={activeAgent} />

      {/* Agent Picker Dropdown */}
      {showAgentPicker && (
        <div className="absolute top-[60px] left-0 right-0 z-50 bg-slate-100/98 dark:bg-[#0f1f3a]/98 backdrop-blur-xl border-b border-slate-300 dark:border-white/10 p-3 space-y-1" style={{ animation: 'fadeIn 0.2s ease-out' }}>
          {agents.map((a) => (
            <button
              key={a.key}
              onClick={() => switchAgent(a.key)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                a.key === activeAgent ? 'bg-slate-200 dark:bg-white/10' : 'hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: a.color }}
              >
                <span className="material-symbols-outlined text-lg">{a.icon}</span>
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-slate-800 dark:text-white">{a.name}</div>
                <div className="text-[10px] text-slate-600 dark:text-gray-400">{agentConfigs[a.key].role}</div>
              </div>
              {a.key === activeAgent && (
                <span className="material-symbols-outlined text-green-400 ml-auto">check_circle</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Track toast */}
      {trackToast && (
        <div className="flex justify-center px-4 py-1.5 bg-green-500/15 border-b border-green-500/20">
          <span className="text-[11px] text-green-400 font-semibold">{trackToast}</span>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {messages.map(renderMessage)}

        {/* Handoff Button */}
        {pendingHandoff && !isTyping && (() => {
          const target = agents.find((a) => a.key === pendingHandoff.agent)!;
          return (
            <div className="flex flex-col items-center gap-2 my-3">
              <button
                onClick={executeHandoff}
                className="flex items-center gap-2.5 bg-gradient-to-r from-[#FF9933]/20 to-[#138808]/20 border border-[#FF9933]/40 rounded-2xl px-5 py-3 hover:from-[#FF9933]/30 hover:to-[#138808]/30 transition-all active:scale-95"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: target.color }}
                >
                  <span className="material-symbols-outlined text-base">{target.icon}</span>
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-800 dark:text-white">{target.nameHi} से बात करें</div>
                  <div className="text-[10px] text-slate-600 dark:text-gray-400">Tap to switch → {target.name}</div>
                </div>
                <span className="material-symbols-outlined text-[#FF9933] ml-1">arrow_forward</span>
              </button>
              <button
                onClick={() => {
                  const stayMsg = pendingHandoff.userMsg;
                  setPendingHandoff(null);
                  addMessage(activeAgent, {
                    id: `stay-${Date.now()}`,
                    role: 'system',
                    content: `✅ ${currentAgent.nameHi} के साथ बातचीत जारी है`,
                    timestamp: Date.now(),
                  });
                  // Get current agent's answer to the original query (don't re-add user msg)
                  setTimeout(() => sendMessage(stayMsg, undefined, true, true), 300);
                }}
                className="text-[10px] text-slate-600 dark:text-gray-500 hover:text-slate-800 dark:hover:text-gray-300 transition-colors"
              >
                यहीं रहें • Stay with {currentAgent.name}
              </button>
            </div>
          );
        })()}

        {isTyping && (
          <div className="flex gap-2 mb-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
              style={{ backgroundColor: currentAgent.color }}
            >
              {currentAgent.shortName}
            </div>
            <div className="bg-slate-100 dark:bg-[#162a4a] border border-slate-300 dark:border-white/10 rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-slate-400 dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-slate-400 dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-slate-400 dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
          {quickActions[activeAgent]?.map((action) => (
            <button
              key={action.label}
              onClick={() => handleQuickAction(action.query, action.label)}
              className="shrink-0 bg-slate-100 dark:bg-[#162a4a] border border-slate-300 dark:border-white/10 rounded-full px-4 py-2 text-xs text-slate-700 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-[#1a3a5a] transition-all"
            >
              {action.label}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="px-4 py-3 bg-slate-100/95 dark:bg-[#0f1f3a]/95 border-t border-slate-300 dark:border-white/10">
        {/* Image preview strip */}
        {attachedPreview && (
          <div className="flex items-center gap-2 mb-2 bg-slate-50 dark:bg-[#162a4a] border border-slate-300 dark:border-white/10 rounded-xl px-3 py-2">
            <img src={attachedPreview} alt="Preview" className="w-12 h-12 rounded-lg object-cover shrink-0" />
            <div className="flex-1 min-w-0">
              {isAnalyzing ? (
                <p className="text-[11px] text-blue-400 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                  Analyzing with Azure Vision...
                </p>
              ) : attachedAnalysis ? (
                <p className="text-[11px] text-green-600 dark:text-green-400 truncate">✓ {attachedAnalysis.slice(0, 60)}{attachedAnalysis.length > 60 ? '…' : ''}</p>
              ) : (
                <p className="text-[11px] text-slate-600 dark:text-gray-400">Image ready to send</p>
              )}
            </div>
            <button onClick={() => { setAttachedPreview(null); setAttachedAnalysis(null); }} className="p-1 hover:bg-slate-200 dark:hover:bg-white/10 rounded-lg">
              <span className="material-symbols-outlined text-slate-600 dark:text-gray-400 text-base">close</span>
            </button>
          </div>
        )}
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center bg-slate-50 dark:bg-[#162a4a] border border-slate-300 dark:border-white/10 rounded-2xl px-4 py-2.5">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
              placeholder={isListening ? '🎙️ Listening...' : t('chatPlaceholder')}
              className="flex-1 bg-transparent text-sm text-slate-800 dark:text-white placeholder:text-slate-500 dark:placeholder:text-gray-500 outline-none"
              disabled={isTyping}
            />
            {/* Image attach button (inside input box) */}
            <button
              onClick={() => imageInputRef.current?.click()}
              disabled={isTyping || isAnalyzing}
              className="ml-1 p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 transition-all disabled:opacity-40"
              title="Attach image for Vision analysis"
            >
              <span className="material-symbols-outlined text-slate-600 dark:text-gray-400 text-xl">attach_file</span>
            </button>
            <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageAttach} aria-label="Attach image" />
          </div>
          {/* Voice mic button */}
          <button
            onClick={() => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const win = window as any;
              const SRClass = win.SpeechRecognition || win.webkitSpeechRecognition;
              if (!SRClass) { alert('Voice not supported in this browser.'); return; }
              if (isListening) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (recognitionRef.current as any)?.stop();
                setIsListening(false);
                return;
              }
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const rec: any = new SRClass();
              recognitionRef.current = rec;
              const lang = useAppStore.getState().userProfile.language || 'hi';
              rec.lang = lang.includes('-') ? lang : `${lang}-IN`;
              rec.interimResults = false;
              rec.maxAlternatives = 1;
              setIsListening(true);
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              rec.onresult = (event: any) => {
                const transcript: string = event.results[0][0].transcript;
                setInput((prev) => (prev ? prev + ' ' + transcript : transcript));
                setIsListening(false);
              };
              rec.onerror = (e: any) => {
                if (e?.error === 'language-not-supported') {
                  // Browser doesn't support this language — retry with hi-IN fallback
                  const fallback: any = new SRClass();
                  recognitionRef.current = fallback;
                  fallback.lang = 'hi-IN';
                  fallback.interimResults = false;
                  fallback.maxAlternatives = 1;
                  fallback.onresult = (ev: any) => {
                    const t2: string = ev.results[0][0].transcript;
                    setInput((prev: string) => (prev ? prev + ' ' + t2 : t2));
                    setIsListening(false);
                  };
                  fallback.onerror = () => setIsListening(false);
                  fallback.onend = () => setIsListening(false);
                  fallback.start();
                } else {
                  setIsListening(false);
                }
              };
              rec.onend = () => setIsListening(false);
              rec.start();
            }}
            className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all active:scale-95 ${
              isListening
                ? 'bg-red-500/20 border-red-500/50 animate-pulse'
                : 'bg-slate-200 dark:bg-[#162a4a] border-slate-300 dark:border-white/10 hover:bg-slate-300 dark:hover:bg-[#1a3a5a]'
            }`}
            title={isListening ? 'Stop listening' : 'Speak your message'}
          >
            <span
              className="material-symbols-outlined text-xl"
              style={{ color: isListening ? '#EF4444' : 'var(--icon-color)', fontVariationSettings: isListening ? "'FILL' 1" : "'FILL' 0" }}
            >
              mic
            </span>
          </button>
          <button
            onClick={() => sendMessage(input)}
            disabled={(!input.trim() && !attachedPreview) || isTyping || isAnalyzing}
            className="w-11 h-11 rounded-full bg-gradient-to-br from-[#FF9933] to-[#E68A2E] flex items-center justify-center shadow-lg shadow-orange-500/20 disabled:opacity-40 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-white text-xl">send</span>
          </button>
        </div>
      </div>
    </div>
  );
}
