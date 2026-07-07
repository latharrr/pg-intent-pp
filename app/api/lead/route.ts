import { NextResponse } from "next/server";
import { z } from "zod";
import type { Lead } from "@/types/lead";

const leadSchema = z.object({
  name: z.string().nullable(),
  phone: z.string().nullable(),
  email: z.string().email().nullable(),
  whatsappOptIn: z.boolean(),
  leadScore: z.enum(["hot", "warm", "cold"]).nullable(),
  budgetBand: z.string().nullable(),
  bestAreaName: z.string().nullable(),
  moveTimeline: z.string().nullable(),
  roomType: z.string().nullable(),
});

// Mock persistence - an in-memory array standing in for a real table until
// Supabase is wired in. Data doesn't survive a server restart; that's fine
// for now, the point is exercising a real request/response contract.
const leads: Lead[] = [];

/** Appends the lead as a row to the configured Google Sheet via an Apps
 * Script Web App (doPost). Silently skipped when the env var isn't set, so
 * local dev works with zero Sheets setup. Never blocks/breaks the request
 * on failure - losing an analytics-adjacent side effect shouldn't fail the
 * user's actual submission. */
async function appendToGoogleSheet(lead: Lead): Promise<void> {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!webhookUrl) return;

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
    });
  } catch (error) {
    console.error("Failed to append lead to Google Sheet", error);
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const lead: Lead = { ...parsed.data, createdAt: new Date().toISOString() };
  leads.push(lead);
  await appendToGoogleSheet(lead);

  return NextResponse.json({ ok: true, lead });
}
