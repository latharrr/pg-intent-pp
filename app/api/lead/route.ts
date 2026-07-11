import { NextResponse } from "next/server";
import { z } from "zod";
import { appendLeadToSheet, getSheetConfig } from "@/lib/googleSheets";
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
  // Optional: older persisted profiles (from before referral tracking existed)
  // won't send this key at all.
  referralSource: z.string().nullable().optional(),
});

// Mock persistence retained as a safety net when Sheets isn't configured.
const leads: Lead[] = [];

/** Appends the lead to the configured Google Sheet. Falls back to in-memory
 * storage when credentials are missing so local dev never breaks. */
async function persistLead(lead: Lead & { bestAreaName?: string | null }): Promise<void> {
  const config = getSheetConfig();
  if (config.hasCredentials && config.hasLeadSheet) {
    try {
      await appendLeadToSheet(lead);
      return;
    } catch (error) {
      console.error("Failed to append lead to Google Sheet", error);
      // Fall through to in-memory storage so the user still sees success.
    }
  }
  leads.push(lead);
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const lead: Lead = {
    ...parsed.data,
    referralSource: parsed.data.referralSource ?? null,
    createdAt: new Date().toISOString(),
  };
  await persistLead(lead);

  return NextResponse.json({ ok: true, lead });
}
