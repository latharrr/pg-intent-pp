import { JWT } from "google-auth-library";
import { GoogleSpreadsheet } from "google-spreadsheet";
import type { PG } from "@/types";
import type { Lead } from "@/types/lead";

const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ?? "";
const GOOGLE_PRIVATE_KEY = (process.env.GOOGLE_PRIVATE_KEY ?? "").replace(/\\n/g, "\n");
const PG_SHEET_ID = process.env.GOOGLE_PG_SHEET_ID ?? "";
const LEAD_SHEET_ID = process.env.GOOGLE_LEAD_SHEET_ID ?? "";

function getAuth() {
  return new JWT({
    email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: GOOGLE_PRIVATE_KEY,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

export interface SheetConfig {
  hasCredentials: boolean;
  hasPgSheet: boolean;
  hasLeadSheet: boolean;
}

export function getSheetConfig(): SheetConfig {
  return {
    hasCredentials: Boolean(GOOGLE_SERVICE_ACCOUNT_EMAIL && GOOGLE_PRIVATE_KEY),
    hasPgSheet: Boolean(PG_SHEET_ID),
    hasLeadSheet: Boolean(LEAD_SHEET_ID),
  };
}

/**
 * Fetches active PGs from the configured Google Sheet.
 *
 * Expected sheet columns (header row):
 * id | name | areaId | pricePerMonth | roomTypes | foodPolicy | verifiedStatus | distanceToCollegeMin | amenities | genderPolicy | rating | active
 *
 * Rows with active !== "TRUE" are skipped.
 */
export async function fetchPGsFromSheet(): Promise<PG[]> {
  if (!PG_SHEET_ID || !GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY) {
    throw new Error("Google Sheets PG config missing");
  }

  const doc = new GoogleSpreadsheet(PG_SHEET_ID, getAuth());
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];
  const rows = await sheet.getRows();

  return rows
    .filter((row) => row.get("active")?.toString().toUpperCase() === "TRUE")
    .map((row) => {
      const price = Number(row.get("pricePerMonth"));
      const distance = row.get("distanceToCollegeMin");
      const rating = row.get("rating");

      return {
        id: String(row.get("id")),
        name: String(row.get("name")),
        areaId: String(row.get("areaId")),
        pricePerMonth: Number.isFinite(price) ? price : 0,
        roomTypes: String(row.get("roomTypes") ?? "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        foodPolicy: row.get("foodPolicy") || null,
        verifiedStatus: String(row.get("verifiedStatus") ?? "").toUpperCase() === "TRUE",
        lastVerifiedDate: row.get("lastVerifiedDate") || null,
        photoUrl: row.get("photoUrl") || null,
        photoTakenDate: row.get("photoTakenDate") || null,
        distanceToCollegeMin: distance ? Number(distance) : null,
        amenities: String(row.get("amenities") ?? "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        genderPolicy: row.get("genderPolicy") || "any",
        rating: rating ? Number(rating) : null,
      } as PG;
    });
}

/**
 * Appends a lead to the configured Google Sheet.
 *
 * Expected sheet columns (header row):
 * timestamp | name | phone | email | whatsappOptIn | budgetBand | roomType | moveTimeline | bestAreaName | leadScore
 */
export async function appendLeadToSheet(lead: Lead & { bestAreaName?: string | null }): Promise<void> {
  if (!LEAD_SHEET_ID || !GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY) {
    throw new Error("Google Sheets lead config missing");
  }

  const doc = new GoogleSpreadsheet(LEAD_SHEET_ID, getAuth());
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];

  await sheet.addRow({
    timestamp: lead.createdAt,
    name: lead.name ?? "",
    phone: lead.phone ?? "",
    email: lead.email ?? "",
    whatsappOptIn: lead.whatsappOptIn ? "TRUE" : "FALSE",
    budgetBand: lead.budgetBand ?? "",
    roomType: lead.roomType ?? "",
    moveTimeline: lead.moveTimeline ?? "",
    bestAreaName: lead.bestAreaName ?? "",
    leadScore: lead.leadScore ?? "",
  });
}
