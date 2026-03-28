'use server';
import ModelClient, { isUnexpected } from '@azure-rest/ai-inference';
import { AzureKeyCredential } from '@azure/core-auth';

export async function translateText(text: string, toLang: string) {
  const key = process.env.AZURE_TRANSLATOR_KEY;
  const region = process.env.AZURE_TRANSLATOR_REGION;
  if (!key || !region) throw new Error("Missing Azure Translator Key or Region");

  const url = `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=${toLang}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': key,
      'Ocp-Apim-Subscription-Region': region as string,
      'Content-type': 'application/json'
    },
    body: JSON.stringify([{ text }])
  });

  if (!response.ok) {
    const err = await response.text();
    console.error("Translator Error:", err);
    throw new Error("Translation failed");
  }

  const data = await response.json();
  return data[0].translations[0].text;
}

export async function generateSpeechBase64(text: string, lang: string): Promise<string> {
  const key = process.env.AZURE_SPEECH_KEY;
  const region = process.env.AZURE_SPEECH_REGION;
  if (!key) throw new Error("Missing Azure Speech Key");

  // Map general language shortcodes to Azure Neural Voice names for 22 languages
  const voiceMap: Record<string, string> = {
    'hi': 'hi-IN-SwaraNeural',
    'mr': 'mr-IN-AarohiNeural',
    'bn': 'bn-IN-TanishaaNeural',
    'te': 'te-IN-ShrutiNeural',
    'ta': 'ta-IN-PallaviNeural',
    'gu': 'gu-IN-DhwaniNeural',
    'kn': 'kn-IN-SapnaNeural',
    'ml': 'ml-IN-SobhanaNeural',
    'pa': 'pa-IN-OjasNeural',
    'ur': 'ur-IN-GulNeural',
    'en': 'en-IN-NeerjaNeural',
    'or': 'or-IN-SubhasiniNeural',
    'as': 'hi-IN-SwaraNeural', // fallbacks to Hindi if not native
    'ks': 'ur-IN-GulNeural',
    'sd': 'hi-IN-SwaraNeural',
    'sa': 'hi-IN-SwaraNeural',
    'ne': 'hi-IN-SwaraNeural',
    'mai': 'hi-IN-SwaraNeural',
    'doi': 'hi-IN-SwaraNeural',
    'brx': 'hi-IN-SwaraNeural',
    'mni': 'hi-IN-SwaraNeural',
    'kok': 'mr-IN-AarohiNeural',
    'sat': 'hi-IN-SwaraNeural'
  };

  const shortLang = lang.split('-')[0];
  const voiceName = voiceMap[shortLang] || voiceMap['en'];
  const fullLang = voiceName.substring(0, 5); // e.g. 'mr-IN'

  const ssml = `<speak version='1.0' xml:lang='${fullLang}'><voice xml:lang='${fullLang}' name='${voiceName}'>${text}</voice></speak>`;

  const url = `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': key,
      'Content-Type': 'application/ssml+xml',
      'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3'
    },
    body: ssml
  });

  if (!response.ok) {
    const err = await response.text();
    console.error("Speech Error:", err);
    throw new Error("Speech synthesis failed");
  }

  const arrayBuffer = await response.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString('base64');
  return `data:audio/mp3;base64,${base64}`;
}

export async function generateAudioSummary(text: string, langName: string): Promise<string> {
  const token = process.env.GITHUB_TOKEN_PHI || process.env.GITHUB_TOKEN;
  if (!token) return text.slice(0, 200); // Fallback to truncated text if no key

  const prompt = `You are a helpful assistant. 
Summarize the following document explanation into about 50 words in ${langName}. 
The summary should be concise, clear, and easy to understand when spoken.
Explanation:
${text}`;

  try {
    const client = ModelClient('https://models.github.ai/inference', new AzureKeyCredential(token));
    const response = await client.path('/chat/completions').post({
      body: {
        messages: [{ role: 'user', content: prompt }],
        model: 'openai/gpt-4o-mini',
        max_tokens: 150,
        temperature: 0.3,
      },
    });

    if (isUnexpected(response)) return text.slice(0, 200);

    return response.body.choices?.[0]?.message?.content?.trim() || text.slice(0, 200);
  } catch (err) {
    console.error('Audio summarization failed:', err);
    return text.slice(0, 200);
  }
}
