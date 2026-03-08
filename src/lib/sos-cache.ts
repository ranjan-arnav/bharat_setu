/**
 * Shared in-process SOS result cache
 * Using globalThis ensures the Map is shared across all route module instances
 * in the same Node.js process (important for Next.js hot-reload and serverless
 * where each route handler is a separate module but runs in the same process).
 */

import { SOSDispatchResult } from './sos-engine';

const g = globalThis as typeof globalThis & {
  _sosCacheMap?: Map<string, SOSDispatchResult>;
};

if (!g._sosCacheMap) {
  g._sosCacheMap = new Map<string, SOSDispatchResult>();
}

export const sosResultCache: Map<string, SOSDispatchResult> = g._sosCacheMap;
