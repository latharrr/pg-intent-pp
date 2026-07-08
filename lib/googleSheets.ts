import { JWT } from "google-auth-library";
import { GoogleSpreadsheet } from "google-spreadsheet";
import type { PG } from "@/types";
import type { Lead } from "@/types/lead";

export interface AnalyticsEventRow {
  timestamp: string;
  sessionId: string;
  deviceId: string;
  ip: string;
  event: string;
  page: string;
  payload: string;
  userAgent: string;
  referrer: string;
  [key: string]: string;
}

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
 *
 * When GOOGLE_LEAD_SHEET_ID and GOOGLE_PG_SHEET_ID point to the same spreadsheet
 * (one sheet, two tabs), leads go to the second tab (index 1) so they don't
 * collide with the PG inventory on the first tab.
 */
export async function appendLeadToSheet(lead: Lead & { bestAreaName?: string | null }): Promise<void> {
  if (!LEAD_SHEET_ID || !GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY) {
    throw new Error("Google Sheets lead config missing");
  }

  const doc = new GoogleSpreadsheet(LEAD_SHEET_ID, getAuth());
  await doc.loadInfo();
  const sharedSpreadsheet = LEAD_SHEET_ID === PG_SHEET_ID;
  const sheet = sharedSpreadsheet ? (doc.sheetsByIndex[1] ?? doc.sheetsByIndex[0]) : doc.sheetsByIndex[0];

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

const ANALYTICS_COLUMN_COUNT = 10; // date, time, sessionId, deviceId, ip, event, page, payload, userAgent, referrer

/** Light, readable-with-black-text palette. Cycles (repeats) once every session has been assigned one. */
const SESSION_COLORS: { red: number; green: number; blue: number }[] = [
  { red: 1, green: 0.8, blue: 0.8 }, // pink
  { red: 1, green: 0.89, blue: 0.7 }, // peach
  { red: 1, green: 0.96, blue: 0.7 }, // yellow
  { red: 0.82, green: 0.94, blue: 0.8 }, // green
  { red: 0.8, green: 0.93, blue: 0.93 }, // teal
  { red: 0.8, green: 0.88, blue: 1 }, // blue
  { red: 0.88, green: 0.82, blue: 0.96 }, // purple
  { red: 0.96, green: 0.82, blue: 0.92 }, // magenta
  { red: 0.9, green: 0.9, blue: 0.9 }, // gray
  { red: 0.93, green: 0.87, blue: 0.78 }, // tan
];

/** Deterministic hash so the same sessionId always gets the same color, even
 * across separate serverless invocations that share no memory. */
function colorForSession(sessionId: string) {
  let hash = 0;
  const key = sessionId || "unknown";
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  return SESSION_COLORS[hash % SESSION_COLORS.length];
}

function formatDelhiDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatDelhiTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(date);
}

/**
 * Appends a batch of analytics events to the Analytics tab (third tab, index 2)
 * of the same spreadsheet as the PG inventory. Always uses PG_SHEET_ID's
 * spreadsheet since analytics isn't a separately-configured destination.
 *
 * Expected sheet columns (header row):
 * date | time | sessionId | deviceId | ip | event | page | payload | userAgent | referrer
 *
 * Each row's date/time is converted from UTC to Asia/Kolkata, and the whole
 * row is background-colored by a hash of sessionId so events from the same
 * visit are visually grouped (colors repeat once every palette slot is used).
 */
export async function appendAnalyticsEvents(rows: AnalyticsEventRow[]): Promise<void> {
  if (!PG_SHEET_ID || !GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY || rows.length === 0) {
    throw new Error("Google Sheets analytics config missing");
  }

  const doc = new GoogleSpreadsheet(PG_SHEET_ID, getAuth());
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[2] ?? doc.sheetsByIndex[0];

  const sheetRows = rows.map((r) => ({
    date: formatDelhiDate(r.timestamp),
    time: formatDelhiTime(r.timestamp),
    sessionId: r.sessionId,
    deviceId: r.deviceId,
    ip: r.ip,
    event: r.event,
    page: r.page,
    payload: r.payload,
    userAgent: r.userAgent,
    referrer: r.referrer,
  }));

  const addedRows = await sheet.addRows(sheetRows);

  const firstRow = addedRows[0].rowNumber;
  const lastRow = addedRows[addedRows.length - 1].rowNumber;
  await sheet.loadCells(`A${firstRow}:J${lastRow}`);

  addedRows.forEach((addedRow, i) => {
    const color = colorForSession(rows[i].sessionId);
    for (let col = 0; col < ANALYTICS_COLUMN_COUNT; col++) {
      sheet.getCell(addedRow.rowNumber - 1, col).backgroundColor = color;
    }
  });

  await sheet.saveUpdatedCells();
}
