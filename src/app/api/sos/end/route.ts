import { NextRequest, NextResponse } from 'next/server';
import { sosResultCache } from '@/lib/sos-cache';
// Import activity cache from update-location
const g = globalThis as typeof globalThis & {
    _sosActivityCache?: Map<string, { locations: any[] }>;
};
const sosActivityCache = g._sosActivityCache;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { eventId } = body;

        if (!eventId) {
            return NextResponse.json({ error: 'Missing eventId' }, { status: 400 });
        }

        // In production, notify dispatchers / responders the SOS is concluded.

        // Clear out caches
        if (sosResultCache && sosResultCache.has(eventId)) {
            sosResultCache.delete(eventId);
        }
        if (sosActivityCache && sosActivityCache.has(eventId)) {
            sosActivityCache.delete(eventId);
        }

        console.log(`[SOS-End] Session concluded and purged: ${eventId}`);

        return NextResponse.json({ success: true, message: 'SOS Event Concluded.' });
    } catch (err) {
        console.error('[SOS API End] Error:', err);
        return NextResponse.json(
            { error: 'Internal server error concluding SOS' },
            { status: 500 }
        );
    }
}
