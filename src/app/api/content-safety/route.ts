import { NextRequest, NextResponse } from 'next/server';
import { azureConfig } from '@/lib/azure-config';

// POST /api/content-safety - Check content safety via Azure Content Safety
export async function POST(request: NextRequest) {
  try {
    const { text, image } = await request.json();

    if (!azureConfig.contentSafety.key) {
      return NextResponse.json({ safe: true, source: 'bypass' });
    }

    if (text) {
      const response = await fetch(
        `${azureConfig.contentSafety.endpoint}/contentsafety/text:analyze?api-version=2024-09-01`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': azureConfig.contentSafety.key,
          },
          body: JSON.stringify({
            text,
            categories: ['Hate', 'SelfHarm', 'Sexual', 'Violence'],
          }),
        }
      );

      if (!response.ok) {
        return NextResponse.json({ safe: true, source: 'error-bypass' });
      }

      const result = await response.json();
      const categories = result.categoriesAnalysis || [];
      const safe = categories.every((c: any) => c.severity <= 2);

      return NextResponse.json({
        safe,
        categories: categories.map((c: any) => ({
          category: c.category,
          severity: c.severity,
        })),
        source: 'azure',
      });
    }

    return NextResponse.json({ safe: true, source: 'no-content' });
  } catch (error: any) {
    console.error('Content safety error:', error);
    return NextResponse.json({ safe: true, source: 'error-bypass' });
  }
}
