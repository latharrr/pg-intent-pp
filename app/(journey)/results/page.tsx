import { PGS } from "@/lib/data/pgs";
import { fetchPGsFromSheet, getSheetConfig } from "@/lib/googleSheets";
import { ResultsView } from "@/features/results/ResultsView";
import type { PG } from "@/types";

async function fetchPGs(): Promise<{ source: string; pgs: PG[] }> {
  const config = getSheetConfig();
  if (config.hasCredentials && config.hasPgSheet) {
    try {
      const pgs = await fetchPGsFromSheet();
      return { source: "sheets", pgs };
    } catch (error) {
      console.error("Failed to fetch PGs from Google Sheets, using static fallback", error);
      return { source: "static_fallback", pgs: PGS };
    }
  }
  return { source: "static", pgs: PGS };
}

/**
 * Results page (server component).
 *
 * Fetches PGs server-side from Google Sheets when configured. Falls back to
 * static data if credentials or the sheet are missing. The interactive UI
 * lives in ResultsView.
 */
export default async function ResultsPage() {
  const { source, pgs } = await fetchPGs();
  return <ResultsView pgs={pgs} source={source} />;
}
