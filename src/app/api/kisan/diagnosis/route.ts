import { NextRequest, NextResponse } from 'next/server';
import { azureConfig } from '@/lib/azure-config';

export async function POST(request: NextRequest) {
  try {
    const { imageBase64, prompt, lang, location } = await request.json();

    // 1. Call Azure Vision to describe the image
    let caption = 'crop';
    let tags = 'leaf, plant';
    
    // Convert base64 to byte array
    try {
      if (azureConfig.vision.key) {
        const imageBuffer = Buffer.from(imageBase64, 'base64');
        const visionResponse = await fetch(
          `${azureConfig.vision.endpoint}/computervision/imageanalysis:analyze?features=caption,tags&api-version=2024-02-01`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/octet-stream',
              'Ocp-Apim-Subscription-Key': azureConfig.vision.key,
            },
            body: imageBuffer,
          }
        );
        if (visionResponse.ok) {
          const result = await visionResponse.json();
          caption = result.captionResult?.text || caption;
          tags = (result.tagsResult?.values || []).map((t: { name: string }) => t.name).join(', ') || tags;
        }
      }
    } catch (e) {
      console.error('Vision analysis error:', e);
    }

    // 2. Use OpenAI to formulate JSON diagnosis
    const aiPrompt = `${prompt}
    
Image analysis from computer vision system:
Caption: ${caption}
Tags: ${tags}
Location: ${location}

Analyze the provided image description and symptoms, and generate the required diagnosis JSON in ${lang} language.`;

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
        messages: [{ role: 'user', content: aiPrompt }],
        temperature: 0.3,
        max_tokens: 1000,
        response_format: { type: "json_object" }
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to generate diagnosis' }, { status: 500 });
    }

    const data = await res.json();
    const resultText = data.choices?.[0]?.message?.content || '{}';
    
    return NextResponse.json({ result: resultText });
  } catch (error) {
    console.error('Diagnosis error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
