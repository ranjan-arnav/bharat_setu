import { NextRequest, NextResponse } from 'next/server';
import { azureConfig } from '@/lib/azure-config';

export async function POST(request: NextRequest) {
  try {
    const { originCity, destinationCities } = await request.json();

    const prompt = `Calculate approximate road distance in kilometers from ${originCity}, India to each of these Indian cities. Return ONLY a JSON object like {"City1": 100, "City2": 200}. Cities: ${destinationCities.join(', ')}`;

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
        temperature: 0.1,
        max_tokens: 500,
        response_format: { type: "json_object" }
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to generate distances' }, { status: 500 });
    }

    const data = await res.json();
    const resultText = data.choices?.[0]?.message?.content || '{}';
    
    return NextResponse.json({ result: resultText });
  } catch (error) {
    console.error('Distance error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
