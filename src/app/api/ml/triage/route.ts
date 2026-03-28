import { NextResponse } from 'next/server';
import ModelClient from '@azure-rest/ai-inference';
import { AzureKeyCredential } from '@azure/core-auth';

interface TriageRequest {
  cases: {
    id: string;
    title: string;
    description: string;
    category: string;
  }[];
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as TriageRequest;
    const { cases } = body;

    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      console.warn('No GITHUB_TOKEN, returning fallback triage data.');
      return NextResponse.json({
        updates: cases.map(c => ({
          id: c.id,
          priority: 'high',
          reasoning: 'Fallback mode active'
        }))
      });
    }

    const client = ModelClient('https://models.inference.ai.azure.com', new AzureKeyCredential(token));

    const prompt = `You are an AI Triage assistant for the Bharat Setu Government Portal.
Analyze the following batch of citizen grievances and determine their priority ('critical', 'high', 'medium', 'low').

Cases to analyze:
${JSON.stringify(cases, null, 2)}

Rules for Priority:
- critical: Immediate threat to life, major public safety hazard, SOS, severe disaster.
- high: Major utility disruption (water, power), large potholes on main roads, disease outbreaks.
- medium: Scheme issues, card issues, minor streetlight outages, general complaints.
- low: Information requests, feedback, minor aesthetic issues.

Output MUST be valid JSON strictly matching the structure:
{
  "updates": [
    {
      "id": "case_id",
      "priority": "critical | high | medium | low",
      "reasoning": "A short 1-sentence explanation"
    }
  ]
}`;

    const response = await client.path('/chat/completions').post({
      body: {
        messages: [{ role: 'system', content: prompt }],
        model: 'gpt-4o-mini',
        temperature: 0.1,
        max_tokens: 800,
        response_format: { type: 'json_object' }
      }
    });

    if (response.status !== '200') {
      throw new Error(`Model API error: ${(response.body as any).error?.message || response.status}`);
    }

    const resultText = (response.body as any).choices[0].message.content;
    const resultObj = JSON.parse(resultText);

    return NextResponse.json(resultObj);

  } catch (error: any) {
    console.error('Triage Analysis Error:', error);
    return NextResponse.json(
      { error: 'Failed to run triage analysis', details: error.message },
      { status: 500 }
    );
  }
}
