import { azureConfig } from '@/lib/azure-config';

export type RagCitation = {
  id: string;
  title: string;
  snippet: string;
  url?: string;
  score: number;
};

export type GroundedAnswerResult = {
  answer: string;
  confidence: number;
  usedFallback: boolean;
  citations: RagCitation[];
  source: 'azure-search' | 'demo';
};

type SearchResultDoc = {
  id?: string;
  scheme_name?: string;
  title?: string;
  description?: string;
  eligibility?: string;
  benefits?: string;
  application_url?: string;
  source_url?: string;
  ministry?: string;
  category?: string;
  match_score?: number;
  '@search.score'?: number;
};

type SearchResponse = {
  value?: SearchResultDoc[];
};

function normalizeText(value: string | undefined): string {
  return (value || '').replace(/\s+/g, ' ').trim();
}

function tokenize(value: string): string[] {
  return normalizeText(value)
    .toLowerCase()
    .split(/[^a-z0-9\u0900-\u097f]+/)
    .filter((token) => token.length >= 2)
    .slice(0, 64);
}

function lexicalSimilarity(query: string, docText: string): number {
  const queryTokens = new Set(tokenize(query));
  if (!queryTokens.size) return 0;
  const docTokens = new Set(tokenize(docText));
  if (!docTokens.size) return 0;

  let overlap = 0;
  queryTokens.forEach((token) => {
    if (docTokens.has(token)) overlap += 1;
  });

  return overlap / queryTokens.size;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function confidenceThreshold(): number {
  const raw = Number(process.env.RAG_CONFIDENCE_THRESHOLD || 0.62);
  if (!Number.isFinite(raw)) return 0.62;
  return clamp(raw, 0.35, 0.9);
}

function fallbackAnswer(language?: string): string {
  const normalized = (language || '').toLowerCase();
  if (normalized.startsWith('hi')) {
    return 'मुझे पक्की जानकारी नहीं मिली। कृपया आधिकारिक पोर्टल या स्थानीय अधिकारी से पुष्टि करें।';
  }
  return "I’m not sure based on available records. Please verify on the official government portal or with your local office.";
}

function buildSnippet(doc: SearchResultDoc): string {
  return [doc.description, doc.eligibility, doc.benefits]
    .map((part) => normalizeText(part))
    .filter(Boolean)
    .join(' ')
    .slice(0, 260);
}

function buildCitation(doc: SearchResultDoc, score: number, rank: number): RagCitation {
  return {
    id: doc.id || `doc-${rank + 1}`,
    title: normalizeText(doc.scheme_name || doc.title || `Scheme ${rank + 1}`),
    snippet: buildSnippet(doc),
    url: normalizeText(doc.application_url || doc.source_url) || undefined,
    score: Number(score.toFixed(3)),
  };
}

export function shouldUseGroundedRag(query: string, agentKey?: string): boolean {
  const byAgent = agentKey === 'yojana_saathi' || agentKey === 'vidhi_sahayak' || agentKey === 'nagarik_mitra';
  if (byAgent) return true;

  return /(scheme|yojana|pension|subsidy|benefit|eligibility|ration|card|legal|fir|rights|law|complaint|application|deadline|document)/i.test(
    query
  );
}

export async function retrieveAndRerank(
  query: string,
  options?: {
    top?: number;
    filters?: Record<string, unknown>;
  }
): Promise<{ citations: RagCitation[]; source: 'azure-search' | 'demo' }> {
  const endpoint = azureConfig.search.endpoint?.trim();
  const key = azureConfig.search.key?.trim();
  const indexName = azureConfig.search.indexName?.trim();

  if (!endpoint || !key || !indexName) {
    return { citations: [], source: 'demo' };
  }

  const top = Math.max(3, Math.min(Number(options?.top || 8), 20));
  const searchUrl = `${endpoint.replace(/\/$/, '')}/indexes/${indexName}/docs/search?api-version=2024-07-01`;

  const body: Record<string, unknown> = {
    search: query,
    queryType: 'simple',
    top,
    select: 'id,scheme_name,title,description,eligibility,benefits,application_url,source_url,ministry,category,match_score,@search.score',
    count: true,
  };

  const filters = options?.filters || {};
  const filterParts: string[] = [];

  if (filters.category) {
    const safeCategory = String(filters.category).replace(/'/g, '');
    filterParts.push(`category eq '${safeCategory}'`);
  }

  if (filters.state) {
    const safeState = String(filters.state).replace(/'/g, '');
    filterParts.push(`states/any(s: s eq '${safeState}')`);
  }

  if (filters.income_limit !== undefined) {
    const n = Number(filters.income_limit);
    if (Number.isFinite(n) && n >= 0) filterParts.push(`income_limit ge ${n}`);
  }

  if (filterParts.length) {
    body.filter = filterParts.join(' and ');
  }

  try {
    const response = await fetch(searchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': key,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(6500),
    });

    if (!response.ok) {
      return { citations: [], source: 'demo' };
    }

    const payload = (await response.json()) as SearchResponse;
    const docs = payload.value || [];

    const reranked = docs
      .map((doc, index) => {
        const text = [doc.scheme_name, doc.title, doc.description, doc.eligibility, doc.benefits].join(' ');
        const lexical = lexicalSimilarity(query, text);
        const azureScore = Number(doc['@search.score'] || doc.match_score || 0);
        const normalizedAzure = clamp(azureScore / 10, 0, 1);
        const rerankScore = clamp(0.65 * lexical + 0.35 * normalizedAzure, 0, 1);

        return {
          doc,
          rank: index,
          rerankScore,
        };
      })
      .sort((a, b) => b.rerankScore - a.rerankScore)
      .slice(0, 6)
      .map((item, idx) => buildCitation(item.doc, item.rerankScore, idx));

    return {
      citations: reranked,
      source: 'azure-search',
    };
  } catch {
    return { citations: [], source: 'demo' };
  }
}

export async function buildGroundedAnswer(
  query: string,
  options?: {
    language?: string;
    top?: number;
    filters?: Record<string, unknown>;
  }
): Promise<GroundedAnswerResult> {
  const retrieval = await retrieveAndRerank(query, options);
  const citations = retrieval.citations;

  if (!citations.length) {
    return {
      answer: fallbackAnswer(options?.language),
      confidence: 0,
      usedFallback: true,
      citations: [],
      source: retrieval.source,
    };
  }

  const first = citations[0]?.score || 0;
  const second = citations[1]?.score || 0;
  const confidence = clamp(first * 0.8 + Math.max(0, first - second) * 0.2, 0, 1);
  const threshold = confidenceThreshold();

  if (confidence < threshold) {
    return {
      answer: fallbackAnswer(options?.language),
      confidence: Number(confidence.toFixed(3)),
      usedFallback: true,
      citations: citations.slice(0, 2),
      source: retrieval.source,
    };
  }

  const top = citations.slice(0, 3);
  const lines = top.map((citation, index) => {
    const snippet = citation.snippet ? ` ${citation.snippet}` : '';
    return `[${index + 1}] ${citation.title}.${snippet}`;
  });

  const answer = `Based on available government records, these are the closest relevant matches:\n${lines.join('\n')}\n\nPlease verify eligibility and latest deadlines on the official portal before applying.`;

  return {
    answer,
    confidence: Number(confidence.toFixed(3)),
    usedFallback: false,
    citations: top,
    source: retrieval.source,
  };
}
