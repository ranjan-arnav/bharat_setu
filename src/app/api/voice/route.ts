import { NextRequest, NextResponse } from 'next/server';
import { azureConfig } from '@/lib/azure-config';

// Allowlist of supported Azure Speech language codes for India
const VALID_LANG_CODES = new Set([
  'hi-IN', 'en-IN', 'bn-IN', 'te-IN', 'mr-IN', 'ta-IN', 'gu-IN', 'kn-IN', 'ml-IN',
]);

// POST /api/voice - Handle voice-to-text and text-to-speech via Azure Speech Services
export async function POST(request: NextRequest) {
  try {
    const { action, text, language = 'hi-IN' } = await request.json();

    if (action === 'tts') {
      // Validate language against allowlist to prevent SSML attribute injection
      const safeLang = VALID_LANG_CODES.has(language) ? language : 'hi-IN';

      // Escape XML special characters to prevent SSML injection / malformed markup
      const safeText = (text as string)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');

      // Text-to-Speech using Azure Speech REST API
      const tokenUrl = `https://${azureConfig.speech.region}.api.cognitive.microsoft.com/sts/v1.0/issueToken`;
      const tokenResponse = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': azureConfig.speech.key,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      if (!tokenResponse.ok) {
        return NextResponse.json({ error: 'Failed to get speech token' }, { status: 500 });
      }

      const token = await tokenResponse.text();
      
      // Voice mapping for Indian languages
      const voiceMap: Record<string, string> = {
        'hi-IN': 'hi-IN-SwaraNeural',
        'en-IN': 'en-IN-NeerjaNeural',
        'bn-IN': 'bn-IN-TanishaaNeural',
        'te-IN': 'te-IN-ShrutiNeural',
        'mr-IN': 'mr-IN-AarohiNeural',
        'ta-IN': 'ta-IN-PallaviNeural',
        'gu-IN': 'gu-IN-DhwaniNeural',
        'kn-IN': 'kn-IN-SapnaNeural',
        'ml-IN': 'ml-IN-SobhanaNeural',
      };

      const voice = voiceMap[safeLang] || 'hi-IN-SwaraNeural';

      const ssml = `
        <speak version="1.0" xml:lang="${safeLang}">
          <voice name="${voice}">
            <prosody rate="0.9" pitch="+0%">
              ${safeText}
            </prosody>
          </voice>
        </speak>
      `;

      const ttsUrl = `https://${azureConfig.speech.region}.tts.speech.microsoft.com/cognitiveservices/v1`;
      const audioResponse = await fetch(ttsUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
        },
        body: ssml,
      });

      if (!audioResponse.ok) {
        return NextResponse.json({ error: 'TTS failed' }, { status: 500 });
      }

      const audioBuffer = await audioResponse.arrayBuffer();
      return new NextResponse(audioBuffer, {
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Length': String(audioBuffer.byteLength),
        },
      });
    }

    if (action === 'token') {
      // Return speech token for client-side STT
      const tokenUrl = `https://${azureConfig.speech.region}.api.cognitive.microsoft.com/sts/v1.0/issueToken`;
      const tokenResponse = await fetch(tokenUrl, {
        method: 'POST',
        headers: { 'Ocp-Apim-Subscription-Key': azureConfig.speech.key },
      });

      if (!tokenResponse.ok) {
        return NextResponse.json({ error: 'Token fetch failed' }, { status: 500 });
      }

      const token = await tokenResponse.text();
      return NextResponse.json({ 
        token, 
        region: azureConfig.speech.region 
      });
    }

    return NextResponse.json({ error: 'Invalid action. Use "tts" or "token"' }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal error';
    console.error('Voice API error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
