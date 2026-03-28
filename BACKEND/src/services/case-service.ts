import { randomUUID } from 'crypto';
import { getBackendContainer } from '../cosmos-backend';
import { BackendHttpError } from './backend-errors';

const CASE_TYPE = 'case';

function normalizeLimit(limitRaw: number | undefined, fallback: number, max: number): number {
  const candidate = typeof limitRaw === 'number' ? limitRaw : fallback;
  return Number.isFinite(candidate) ? Math.max(1, Math.min(max, Math.floor(candidate))) : fallback;
}

export async function getCases(params: { userId?: string; caseId?: string; limitRaw?: number }) {
  const caseId = params.caseId?.trim();
  const userId = params.userId?.trim();
  const limit = normalizeLimit(params.limitRaw, 50, 100);

  const container = await getBackendContainer('cases');
  if (!container) {
    throw new BackendHttpError(503, 'Cosmos backend is not configured');
  }

  if (caseId) {
    const { resources } = await container.items
      .query({
        query: 'SELECT TOP 1 * FROM c WHERE c.type = @type AND c.id = @caseId',
        parameters: [
          { name: '@type', value: CASE_TYPE },
          { name: '@caseId', value: caseId },
        ],
      })
      .fetchAll();

    return { found: Boolean(resources[0]), case: resources[0] || null };
  }

  if (!userId) {
    throw new BackendHttpError(400, 'userId is required when caseId is not provided');
  }

  const { resources } = await container.items
    .query(
      {
        query:
          `SELECT TOP ${limit} * FROM c WHERE c.type = @type AND c.userId = @userId ORDER BY c.updatedAt DESC`,
        parameters: [
          { name: '@type', value: CASE_TYPE },
          { name: '@userId', value: userId },
        ],
      },
      { partitionKey: userId },
    )
    .fetchAll();

  return { userId, count: resources.length, cases: resources };
}

export async function getGovernmentCases(params: {
  limitRaw?: number;
  status?: string;
  category?: string;
  dept?: string;
  ward?: string;
}) {
  const container = await getBackendContainer('cases');
  if (!container) {
    throw new BackendHttpError(503, 'Cosmos backend is not configured');
  }

  const limit = normalizeLimit(params.limitRaw, 120, 300);
  const status = params.status?.trim();
  const category = params.category?.trim();
  const dept = params.dept?.trim();
  const ward = params.ward?.trim();

  const queryParts: string[] = ['c.type = @type'];
  const parameters: Array<{ name: string; value: any }> = [{ name: '@type', value: CASE_TYPE }];

  if (status && status !== 'all') {
    queryParts.push('c.status = @status');
    parameters.push({ name: '@status', value: status });
  }

  if (category && category !== 'all') {
    queryParts.push('c.category = @category');
    parameters.push({ name: '@category', value: category });
  }

  if (dept && dept !== 'All') {
    queryParts.push('IS_DEFINED(c.metadata.department) AND c.metadata.department = @dept');
    parameters.push({ name: '@dept', value: dept });
  }

  if (ward && ward !== 'All Wards') {
    queryParts.push('IS_DEFINED(c.metadata.ward) AND c.metadata.ward = @ward');
    parameters.push({ name: '@ward', value: ward });
  }

  const { resources } = await container.items
    .query({
      query: `SELECT TOP ${limit} * FROM c WHERE ${queryParts.join(' AND ')} ORDER BY c.updatedAt DESC`,
      parameters,
    })
    .fetchAll();

  return { scope: 'government', count: resources.length, cases: resources };
}

export async function upsertCase(body: Record<string, unknown>) {
  const userId = typeof body.userId === 'string' ? body.userId.trim() : '';
  if (!userId) {
    throw new BackendHttpError(400, 'userId is required');
  }

  const container = await getBackendContainer('cases');
  if (!container) {
    throw new BackendHttpError(503, 'Cosmos backend is not configured');
  }

  const caseId =
    typeof body.caseId === 'string' && body.caseId.trim()
      ? body.caseId.trim()
      : `CASE-${Date.now()}-${randomUUID().slice(0, 6)}`;
  const now = Date.now();

  const item = {
    id: caseId,
    type: CASE_TYPE,
    userId,
    grievanceId: typeof body.grievanceId === 'string' ? body.grievanceId : undefined,
    category: typeof body.category === 'string' ? body.category : undefined,
    status: typeof body.status === 'string' ? body.status : 'open',
    assignee: typeof body.assignee === 'string' ? body.assignee : undefined,
    eta: typeof body.eta === 'string' ? body.eta : undefined,
    title: typeof body.title === 'string' ? body.title.slice(0, 200) : undefined,
    description: typeof body.description === 'string' ? body.description.slice(0, 5000) : undefined,
    metadata: body.metadata ?? undefined,
    updatedAt: now,
    createdAt: typeof body.createdAt === 'number' ? body.createdAt : now,
  };

  const result = await container.items.upsert(item);
  return { success: true, case: result.resource };
}
