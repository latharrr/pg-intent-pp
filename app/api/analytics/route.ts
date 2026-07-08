import { NextResponse } from "next/server";
import { appendAnalyticsEvents, type AnalyticsEventRow } from "@/lib/googleSheets";

interface IncomingEvent {
  ts?: string;
  event?: string;
  page?: string;
  payload?: Record<string, unknown>;
}

// navigator.sendBeacon posts a Blob without a reliable Content-Type, so this
// reads the raw body instead of relying on request.json()'s content-type check.
export async function POST(request: Request) {
  let body: { sessionId?: string; deviceId?: string; events?: IncomingEvent[] } | null = null;
  try {
    const text = await request.text();
    body = text ? JSON.parse(text) : null;
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }

  const events = body?.events;
  if (!Array.isArray(events) || events.length === 0) {
    return NextResponse.json({ ok: true });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const userAgent = request.headers.get("user-agent") ?? "";
  const referrer = request.headers.get("referer") ?? "";

  // Defensive cap - never let one batch (or an abusive client) write unbounded rows.
  const rows: AnalyticsEventRow[] = events.slice(0, 50).map((e) => ({
    timestamp: e.ts ?? new Date().toISOString(),
    sessionId: body?.sessionId ?? "",
    deviceId: body?.deviceId ?? "",
    ip,
    event: e.event ?? "unknown",
    page: e.page ?? "",
    payload: e.payload ? JSON.stringify(e.payload) : "",
    userAgent,
    referrer,
  }));

  try {
    await appendAnalyticsEvents(rows);
  } catch (error) {
    console.error("Failed to append analytics events", error);
  }

  return NextResponse.json({ ok: true });
}
