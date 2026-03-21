import { NextRequest, NextResponse } from 'next/server';
import ModelClient, { isUnexpected } from '@azure-rest/ai-inference';
import { AzureKeyCredential } from '@azure/core-auth';
import { azureConfig } from '@/lib/azure-config';

let rrCounter = 0;
function pickDeployment(): string {
  const depB = azureConfig.openai.deploymentNameB;
  if (!depB) return azureConfig.openai.deploymentName; // only A configured
  return (rrCounter++ % 2 === 0) ? azureConfig.openai.deploymentName : depB;
}

export async function POST(req: NextRequest) {
  try {
    const { prompt, agentKey, userProfile } = await req.json();

    let client;
    let modelName;

    if (azureConfig.openai.apiKey) {
      client = ModelClient(
        azureConfig.openai.endpoint,
        new AzureKeyCredential(azureConfig.openai.apiKey)
      );
      modelName = pickDeployment();
    } else if (azureConfig.githubModels?.token) {
      client = ModelClient(
        azureConfig.githubModels.endpoint,
        new AzureKeyCredential(azureConfig.githubModels.token)
      );
      modelName = azureConfig.githubModels.model || 'openai/gpt-4o-mini';
    } else {
      console.log('[Generate Form] No LLM keys found. Returning mock contextual form.');
      const lowerPrompt = prompt.toLowerCase();
      let type = 'grievance';
      let title = 'General Service Request';
      let ctxFields = [{ name: 'details', label: 'Additional Details' }];

      if (lowerPrompt.includes('loan') || lowerPrompt.includes('kcc') || lowerPrompt.includes('finance')) {
        type = 'finance'; title = 'Loan Application';
        ctxFields = [{ name: 'amount', label: 'Requested Amount' }, { name: 'purpose', label: 'Loan Purpose' }];
      } else if (lowerPrompt.includes('hospital') || lowerPrompt.includes('health') || lowerPrompt.includes('doctor')) {
        type = 'health'; title = 'Medical Assistance';
        ctxFields = [{ name: 'symptoms', label: 'Symptoms / Issue' }, { name: 'hospital', label: 'Preferred Clinic' }];
      } else if (lowerPrompt.includes('scheme') || lowerPrompt.includes('yojana') || lowerPrompt.includes('kisan')) {
        type = 'scheme'; title = 'Scheme Application';
        ctxFields = [{ name: 'income', label: 'Annual Household Income' }, { name: 'category', label: 'Beneficiary Category' }];
      } else if (lowerPrompt.includes('fir') || lowerPrompt.includes('police') || lowerPrompt.includes('scam')) {
        type = 'legal'; title = 'Legal Incident Report';
        ctxFields = [{ name: 'incidentTime', label: 'Time of Incident' }, { name: 'suspect', label: 'Suspect Details (if any)' }];
      }

      return NextResponse.json({
        success: true,
        form: {
          title,
          type,
          fields: [
            { name: 'name', label: 'Full Name', autofillSource: 'Aadhaar' },
            { name: 'location', label: 'Location / DIGIPIN', autofillSource: 'DigiLocker' },
            ...ctxFields
          ],
          documents: ['Aadhaar Card', 'Recent Photograph', 'Proof of Address']
        }
      });
    }

    const userLang = userProfile?.language || 'hi';
    const systemPrompt = `You are an AI assistant specialized in generating structured JSON forms based on user intents. 
The user is talking to the agent: ${agentKey || 'assistant'}.

Here is the secure Citizen Profile of the user requesting help. Use this to determine if you can accurately "auto-fill" fields you generate.
USER PROFILE:
${userProfile ? JSON.stringify(userProfile, null, 2) : 'No profile provided.'}

Your task: Extract the exact custom fields required to fulfill the user's request, and guess the likely required documents.
Generate a JSON object containing:
1. "title": A short, clear title for the form (e.g., "Mudra Loan Application"). MUST BE IN THE LANGUAGE: ${userLang}.
2. "type": The core category type. Must be one of: ["grievance", "scheme", "health", "legal", "finance"]. Keep this in English.
3. "fields": An array of objects, each representing a required data input field. Every field MUST be highly relevant to fulfilling the user's specific context. Include:
   - "name": CamelCase key for the data field. Keep this in English.
   - "label": A user-facing short readable label (e.g., "Type of Crop", "Name of Hospital", "Details of Incident"). MUST BE TRANSLATED TO: ${userLang}.
   - "autofillSource": (OPTIONAL). If the user profile contains data that directly answers this field, set this to "Aadhaar" or "DigiLocker".
4. "documents": An array of strings representing official documents the user will likely need to provide for this specific request. MUST BE TRANSLATED TO: ${userLang}.

Always include "name" (Full Name) and "location" (Location / DIGIPIN) as standard starting fields. Translate these labels into ${userLang}. Then add 2-5 highly contextual fields.

OUTPUT STRICTLY VALID JSON. DO NOT WRAP IN BACKTICKS.`;

    const response = await client.path('/chat/completions').post({
      body: {
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Please generate a structured form data extraction JSON for the following request: "${prompt}"` }
        ],
        model: modelName,
        temperature: 0.2, // Low temp for strictly structured output
        response_format: { type: "json_object" }
      }
    });

    if (isUnexpected(response)) {
      console.error('[Generate Form] Unexpected Azure response:', response.body);
      return NextResponse.json({ error: 'Failed to generate form LLM response' }, { status: 500 });
    }

    const content = response.body.choices?.[0]?.message?.content || '{}';
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(content);
    } catch {
      console.error('[Generate Form] Failed to parse JSON from LLM:', content);
      return NextResponse.json({ error: 'Failed to parse JSON' }, { status: 500 });
    }

    return NextResponse.json({ success: true, form: parsed });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Generate Form] Exception:', message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
