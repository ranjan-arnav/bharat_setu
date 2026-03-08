import { NextRequest, NextResponse } from 'next/server';
import { azureConfig } from '@/lib/azure-config';

// POST /api/translate — Translation via Azure AI Translator
export async function POST(request: NextRequest) {
  let text = '';
  let sourceLang = 'en';
  let targetLang = 'hi';

  try {
    const body = await request.json();
    text = body.text || '';
    sourceLang = body.sourceLang || 'en';
    targetLang = body.targetLang || 'hi';

    if (!text.trim()) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // No-op when source and target are the same language
    if (sourceLang === targetLang) {
      return NextResponse.json({ translated: text, sourceLang, targetLang, source: 'passthrough' });
    }

    if (!azureConfig.translator.key) {
      console.warn('[TRANSLATOR] AZURE_TRANSLATOR_KEY not configured — returning passthrough');
      return NextResponse.json({
        translated: text,
        sourceLang,
        targetLang,
        source: 'passthrough',
        note: 'AZURE_TRANSLATOR_KEY not configured',
      });
    }

    const url =
      `${azureConfig.translator.endpoint}/translate` +
      `?api-version=3.0&from=${sourceLang}&to=${targetLang}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': azureConfig.translator.key,
        'Ocp-Apim-Subscription-Region': azureConfig.translator.region,
      },
      body: JSON.stringify([{ Text: text }]),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('[TRANSLATOR] API error:', response.status, errText);
      return NextResponse.json({
        translated: text,
        sourceLang,
        targetLang,
        source: 'fallback',
        error: `Azure Translator returned ${response.status}`,
      });
    }

    const data = await response.json();
    const translated = data?.[0]?.translations?.[0]?.text || text;

    return NextResponse.json({ translated, sourceLang, targetLang, source: 'azure-translator' });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('[TRANSLATOR] Error:', msg);
    return NextResponse.json(
      { translated: text || '', sourceLang, targetLang, error: msg },
      { status: 500 }
    );
  }
}
