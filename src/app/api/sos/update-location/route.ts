import { NextRequest, NextResponse } from 'next/server';

const g = globalThis as typeof globalThis & {
    _sosActivityCache?: Map<string, { locations: any[] }>;
};
if (!g._sosActivityCache) g._sosActivityCache = new Map();
const sosActivityCache = g._sosActivityCache;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { eventId, updates, isOfflineBatch } = body;

        if (!eventId || !updates || !Array.isArray(updates)) {
            return NextResponse.json({ error: 'Missing or malformed payload' }, { status: 400 });
        }

        if (!sosActivityCache.has(eventId)) {
            sosActivityCache.set(eventId, { locations: [] });
        }

        const session = sosActivityCache.get(eventId)!;
        session.locations.push(...updates);

        // In a production environment, this data would sync to Redis, Cosmos DB, or an Azure IoT hub
        console.log(`[SOS-Update] Stored ${updates.length} locations for ${eventId}. OfflineBatch: ${!!isOfflineBatch}`);

        return NextResponse.json({ success: true, count: session.locations.length });
    } catch (err) {
        console.error('[SOS API Update Location] Error:', err);
        return NextResponse.json(
            { error: 'Internal server error processing location updates' },
            { status: 500 }
        );
    }
}
