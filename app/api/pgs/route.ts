import { NextResponse } from "next/server";
import { fetchPGsFromSheet, getSheetConfig } from "@/lib/googleSheets";
import { PGS } from "@/lib/data/pgs";

export const dynamic = "force-dynamic";

/**
 * GET /api/pgs
 *
 * Returns active PGs from Google Sheets when configured, otherwise falls back
 * to the static mock data. This lets the team launch with static data and flip
 * to Sheets by setting three env vars.
 */
export async function GET() {
  const config = getSheetConfig();

  if (config.hasCredentials && config.hasPgSheet) {
    try {
      const pgs = await fetchPGsFromSheet();
      return NextResponse.json({ source: "sheets", count: pgs.length, pgs });
    } catch (error) {
      console.error("Failed to fetch PGs from Google Sheets", error);
      // Fall back to static data so the site never goes down because of a sheet issue.
      return NextResponse.json({ source: "static_fallback", count: PGS.length, pgs: PGS });
    }
  }

  return NextResponse.json({ source: "static", count: PGS.length, pgs: PGS });
}
