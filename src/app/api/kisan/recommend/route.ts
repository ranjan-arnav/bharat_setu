import { NextRequest, NextResponse } from 'next/server';
import { azureConfig } from '@/lib/azure-config';

export async function POST(request: NextRequest) {
  try {
    const { soil, location, season, lang } = await request.json();

    const prompt = `You are an expert agricultural AI in India. Provide crop recommendations for the following parameters:
- Soil: ${soil}
- Location: ${location}
- Season & Water: ${season}
Language: ${lang}

Return ONLY a JSON array of objects with the following schema:
[
  {
    "crop_name": "string",
    "yield": "string",
    "water": "string",
    "conditions": "string",
    "market": "string",
    "duration": "string",
    "investment": "string"
  }
]`;

    const isGithubFallback = !azureConfig.openai.endpoint;
    const azureUrl = isGithubFallback
      ? `${azureConfig.githubModels.endpoint}/chat/completions`
      : `${azureConfig.openai.endpoint}/openai/deployments/${azureConfig.openai.deploymentName}/chat/completions?api-version=${azureConfig.openai.apiVersion}`;

    const res = await fetch(azureUrl, {
      method: 'POST',
      headers: isGithubFallback
        ? {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${azureConfig.githubModels.token}`,
          }
        : {
            'Content-Type': 'application/json',
            'api-key': azureConfig.openai.apiKey,
          },
      body: JSON.stringify({
        model: isGithubFallback ? azureConfig.githubModels.model : undefined,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('Azure OpenAI error:', errText);
      return NextResponse.json({ error: 'Failed to generate recommendation' }, { status: 500 });
    }

    const data = await res.json();
    const resultText = data.choices?.[0]?.message?.content || '[]';
    
    return NextResponse.json({ result: resultText });
  } catch (error) {
    console.error('Recommend error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
