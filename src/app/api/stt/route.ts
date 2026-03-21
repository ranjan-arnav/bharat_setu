import { NextRequest, NextResponse } from 'next/server';
import { azureConfig } from '@/lib/azure-config';

export const runtime = 'nodejs';

const LANGUAGE_MAP: Record<string, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
};

function resolveLanguage(input: string): string {
  const normalized = input.trim().toLowerCase();
  if (!normalized) return 'en-IN';
  if (LANGUAGE_MAP[normalized]) return LANGUAGE_MAP[normalized];
  if (/^[a-z]{2}-[a-z]{2}$/i.test(normalized)) return normalized;
  return 'en-IN';
}

export async function POST(request: NextRequest) {
  try {
    if (!azureConfig.speech.key || !azureConfig.speech.region) {
      return NextResponse.json(
        { error: 'Azure Speech is not configured. Set AZURE_SPEECH_KEY and AZURE_SPEECH_REGION.' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const audio = formData.get('audio');
    const language = resolveLanguage((formData.get('language') || 'en').toString());

    if (!audio || typeof audio === 'string') {
      return NextResponse.json({ error: 'Missing audio file in form field "audio".' }, { status: 400 });
    }

    const file = audio as File;
    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = Buffer.from(arrayBuffer);

    if (!audioBuffer.length) {
      return NextResponse.json({ error: 'Uploaded audio file is empty.' }, { status: 400 });
    }

    const recognitionUrl = `https://${azureConfig.speech.region}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=${encodeURIComponent(language)}&format=detailed`;
    const contentType = file.type || 'audio/wav';

    const speechResponse = await fetch(recognitionUrl, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': azureConfig.speech.key,
        'Content-Type': contentType,
        Accept: 'application/json',
      },
      body: audioBuffer,
    });

    const rawBody = await speechResponse.text();

    if (!speechResponse.ok) {
      return NextResponse.json(
        {
          error: 'Azure STT request failed.',
          status: speechResponse.status,
          details: rawBody.slice(0, 300),
        },
        { status: speechResponse.status }
      );
    }

    let parsed: {
      RecognitionStatus?: string;
      DisplayText?: string;
      NBest?: Array<{ Display?: string; Lexical?: string }>;
    } = {};

    try {
      parsed = JSON.parse(rawBody) as {
        RecognitionStatus?: string;
        DisplayText?: string;
        NBest?: Array<{ Display?: string; Lexical?: string }>;
      };
    } catch {
      return NextResponse.json({ error: 'Azure STT returned non-JSON response.', details: rawBody.slice(0, 300) }, { status: 502 });
    }

    const text =
      parsed.DisplayText ||
      parsed.NBest?.[0]?.Display ||
      parsed.NBest?.[0]?.Lexical ||
      '';

    if (!text.trim()) {
      const isLikelyUnsupportedWebm =
        file.type.toLowerCase().includes('webm') &&
        parsed.RecognitionStatus &&
        parsed.RecognitionStatus !== 'NoMatch';

      return NextResponse.json(
        {
          error:
            parsed.RecognitionStatus === 'NoMatch'
              ? 'No speech recognized. Please speak clearly and retry.'
              : isLikelyUnsupportedWebm
                ? 'Could not transcribe this audio format. Please retry; the app will prefer OGG/Opus for better Azure compatibility.'
                : 'Could not transcribe speech.',
          recognitionStatus: parsed.RecognitionStatus || 'Unknown',
        },
        { status: 422 }
      );
    }

    return NextResponse.json({
      text: text.trim(),
      language,
      recognitionStatus: parsed.RecognitionStatus || 'Success',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unexpected STT server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
