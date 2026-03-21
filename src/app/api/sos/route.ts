/**
 * POST /api/sos
 * ─────────────────────────────────────────────────────────────────────────────
 * Primary SOS trigger endpoint.
 *
 * 1. Validates the incoming alert payload from the client.
 * 2. Classifies the incident context (women/child/cyber/disaster).
 * 3. Builds the responder list (base + conditional channels).
 * 4. Launches the async fan-out dispatch — returns the eventId immediately
 *    so the client can start polling /api/sos/status?id=<eventId>.
 * 5. Stores the dispatch result in an in-process cache (replace with Redis /
 *    Azure Cosmos in production).
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  classifySOSContext,
  buildResponderList,
  buildAlertPayload,
  dispatchSOS,
} from '@/lib/sos-engine';
import { setSOSDispatchResult } from '@/lib/sos-storage';

export interface SOSRequestBody {
  lat: number;
  lng: number;
  digipin: string;
  accuracy: number;
  userId: string;
  userName: string;
  userMobile: string;
  userGender?: string;
  userAge?: number;
  description?: string;
  emergencyContactName?: string;
  emergencyContactMobile?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: SOSRequestBody = await request.json();

    // ── Validate required fields ─────────────────────────────────────────────
    const hasValidCoords = Number.isFinite(body.lat) && Number.isFinite(body.lng);
    const hasValidDigipin = typeof body.digipin === 'string' && body.digipin.trim().length > 0;
    if (!hasValidCoords || !hasValidDigipin) {
      return NextResponse.json(
        { error: 'lat, lng, and digipin are required' },
        { status: 400 }
      );
    }

    // ── Classify incident context ─────────────────────────────────────────────
    const context = classifySOSContext(
      body.description || '',
      body.userGender,
      body.userAge
    );

    // ── Build responder list ──────────────────────────────────────────────────
    const responders = buildResponderList(
      context,
      body.emergencyContactName && body.emergencyContactMobile
        ? { name: body.emergencyContactName, mobile: body.emergencyContactMobile }
        : undefined
    );

    // ── Assemble payload ──────────────────────────────────────────────────────
    const payload = buildAlertPayload({
      userId: body.userId || 'anonymous',
      userName: body.userName || 'Bharat Setu User',
      userMobile: body.userMobile || 'N/A',
      location: {
        lat: body.lat,
        lng: body.lng,
        digipin: body.digipin.trim(),
        accuracy: body.accuracy || 0,
        capturedAt: Date.now(),
      },
      context,
      responders,
    });

    // ── Async fan-out (non-blocking for the HTTP response) ────────────────────
    // We launch the dispatch and immediately return the eventId.
    // The client polls /api/sos/status?id=<eventId> for live results.
    dispatchSOS(payload)
      .then((result) => {
        return setSOSDispatchResult(result.eventId, result);
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : 'Dispatch failed';
        console.error('[SOS Dispatch] Unhandled dispatch failure:', message);
        return setSOSDispatchResult(payload.eventId, {
          eventId: payload.eventId,
          results: [],
          dispatchedAt: Date.now(),
          allNotified: false,
        });
      });

    // ── Send ONE consolidated SMS ────────────────────────────────
    const coords = `${body.lat.toFixed(5)},${body.lng.toFixed(5)}`;
    const bingMapsLink = `https://bing.com/maps?cp=${body.lat}~${body.lng}&lvl=16`;
    
    // Mask mobile number (show only last 3 digits)
    const maskedMobile = body.userMobile 
      ? `+91-${body.userMobile.slice(-10, -3).replace(/./g, 'X')}${body.userMobile.slice(-3)}`
      : 'N/A';
    
    const smsText = `SOS
Name:${body.userName}
Mob:${maskedMobile}
Loc:${bingMapsLink}
DIGIPIN:${body.digipin}
Accuracy:${body.accuracy || 0}m
Coords:${coords}
Needs help. Dispatch immediately.`;

    const smsEndpoint = new URL('/api/sos/sms', request.url).toString();

    // Send single SMS to reduce costs
    fetch(smsEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: smsText, eventId: payload.eventId }),
      signal: AbortSignal.timeout(15_000),
    }).catch(e => console.error('[SOS] Fast2SMS error:', e));

    return NextResponse.json({
      success: true,
      eventId: payload.eventId,
      context,
      responderCount: responders.length,
      responders: responders.map((r) => ({
        id: r.id,
        name: r.name,
        type: r.type,
        priority: r.priority,
        conditional: r.conditional ?? false,
      })),
    });
  } catch (err) {
    console.error('[SOS API] Error:', err);
    return NextResponse.json(
      { error: 'Internal server error during SOS dispatch' },
      { status: 500 }
    );
  }
}

// GET /api/sos — health check
export async function GET() {
  return NextResponse.json({ status: 'SOS API online', version: '1.0' });
}
