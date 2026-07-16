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
 * timestamp | name | phone | email | whatsappOptIn | campusZone | budgetBand | roomType | moveTimeline | bestAreaName | leadScore | referralSource
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
    campusZone: lead.campusZone ?? "",
    budgetBand: lead.budgetBand ?? "",
    roomType: lead.roomType ?? "",
    moveTimeline: lead.moveTimeline ?? "",
    bestAreaName: lead.bestAreaName ?? "",
    leadScore: lead.leadScore ?? "",
    referralSource: lead.referralSource ?? "",
  });
}

const ANALYTICS_COLUMN_COUNT = 11; // date, time, sessionId, deviceId, ip, event, page, payload, userAgent, referrer, timestampIso

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
 * date | time | sessionId | deviceId | ip | event | page | payload | userAgent | referrer | timestampIso
 *
 * Each row's date/time is converted from UTC to Asia/Kolkata, and the whole
 * row is background-colored by a hash of sessionId so events from the same
 * visit are visually grouped (colors repeat once every palette slot is used).
 *
 * `timestampIso` duplicates `date`/`time` as a raw sortable value - the referral
 * stats job needs to diff timestamps precisely, which the locale-formatted
 * date/time strings can't be parsed back into reliably.
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
    timestampIso: r.timestamp,
  }));

  const addedRows = await sheet.addRows(sheetRows);

  const firstRow = addedRows[0].rowNumber;
  const lastRow = addedRows[addedRows.length - 1].rowNumber;
  await sheet.loadCells(`A${firstRow}:K${lastRow}`);

  addedRows.forEach((addedRow, i) => {
    const color = colorForSession(rows[i].sessionId);
    for (let col = 0; col < ANALYTICS_COLUMN_COUNT; col++) {
      sheet.getCell(addedRow.rowNumber - 1, col).backgroundColor = color;
    }
  });

  await sheet.saveUpdatedCells();
}

/**
 * Returns the named tab, creating it with the given header row if it doesn't
 * exist yet. Two overlapping requests can both miss the "already exists"
 * check and both call addSheet - Google resolves that by silently renaming
 * the second one (e.g. "ReferralStats_conflict123") rather than erroring, so
 * this detects that and cleans up the accidental duplicate.
 */
async function getOrCreateSheet(doc: GoogleSpreadsheet, title: string, headerValues: string[]) {
  const existing = doc.sheetsByTitle[title];
  if (existing) return existing;

  const created = await doc.addSheet({ title, headerValues });
  if (created.title === title) return created;

  await doc.loadInfo();
  const original = doc.sheetsByTitle[title];
  if (original) {
    await doc.deleteSheet(created.sheetId);
    return original;
  }
  return created;
}

export interface ReferralLink {
  slug: string;
  label: string;
  link: string;
  createdAt: string;
}

const REFERRALS_HEADER = ["slug", "label", "link", "createdAt"];

/** Lists every admin-generated referral link, newest first. Auto-creates the
 * "Referrals" tab on first use. */
export async function getReferralLinks(): Promise<ReferralLink[]> {
  if (!PG_SHEET_ID || !GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY) {
    throw new Error("Google Sheets config missing");
  }

  const doc = new GoogleSpreadsheet(PG_SHEET_ID, getAuth());
  await doc.loadInfo();
  const sheet = await getOrCreateSheet(doc, "Referrals", REFERRALS_HEADER);
  const rows = await sheet.getRows();

  return rows
    .map((row) => ({
      slug: String(row.get("slug") ?? ""),
      label: String(row.get("label") ?? ""),
      link: String(row.get("link") ?? ""),
      createdAt: String(row.get("createdAt") ?? ""),
    }))
    .filter((r) => r.slug)
    .reverse();
}

/** Appends a new referral link row. Throws if the slug is already taken. */
export async function appendReferralLink(link: Omit<ReferralLink, "createdAt">): Promise<ReferralLink> {
  if (!PG_SHEET_ID || !GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY) {
    throw new Error("Google Sheets config missing");
  }

  const doc = new GoogleSpreadsheet(PG_SHEET_ID, getAuth());
  await doc.loadInfo();
  const sheet = await getOrCreateSheet(doc, "Referrals", REFERRALS_HEADER);
  const rows = await sheet.getRows();
  if (rows.some((row) => row.get("slug") === link.slug)) {
    throw new Error(`Slug "${link.slug}" is already in use`);
  }

  const createdAt = new Date().toISOString();
  await sheet.addRow({ slug: link.slug, label: link.label, link: link.link, createdAt });
  return { ...link, createdAt };
}

export interface ReferralStatRow {
  referralSource: string;
  opens: number;
  completed: number;
  completionRate: string;
  avgTimeToCompleteSec: number | "";
  dropOffCount: number;
  topDropOffStep: string;
  downloadClicks: number;
  lastUpdated: string;
}

const REFERRAL_STATS_HEADER = [
  "referralSource",
  "opens",
  "completed",
  "completionRate",
  "avgTimeToCompleteSec",
  "dropOffCount",
  "topDropOffStep",
  "downloadClicks",
  "lastUpdated",
];

interface SessionAgg {
  referralSource: string;
  firstTs: number;
  completedTs: number | null;
  lastStep: string | null;
  downloadClicked: boolean;
}

/**
 * Recomputes per-referral-source funnel stats from the raw Analytics tab rows
 * and overwrites the ReferralStats tab (auto-created on first use).
 *
 * Per session (grouped by sessionId): the referralSource is whatever any of
 * its events carried (set once the [ref] landing page runs, so it sticks to
 * every later event in that session); "completed" comes from a lead_submitted
 * event; drop-off step comes from session_end's lastStep (falling back to the
 * last step_viewed seen) for sessions that never completed; download clicks
 * from any download_app_click event; completion time is
 * (lead_submitted timestamp - the session's earliest event timestamp).
 */
export async function refreshReferralStats(): Promise<ReferralStatRow[]> {
  if (!PG_SHEET_ID || !GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY) {
    throw new Error("Google Sheets config missing");
  }

  const doc = new GoogleSpreadsheet(PG_SHEET_ID, getAuth());
  await doc.loadInfo();
  const analyticsSheet = doc.sheetsByTitle.Analytics ?? doc.sheetsByIndex[2] ?? doc.sheetsByIndex[0];
  const rows = await analyticsSheet.getRows({ limit: 50000 });

  const sessions = new Map<string, SessionAgg>();

  for (const row of rows) {
    const sessionId = String(row.get("sessionId") ?? "");
    if (!sessionId) continue;

    let payload: Record<string, unknown> = {};
    try {
      payload = JSON.parse(String(row.get("payload") ?? "")) || {};
    } catch {
      // malformed/empty payload cell - treat as no payload
    }

    const event = String(row.get("event") ?? "");
    const tsRaw = String(row.get("timestampIso") ?? "");
    const ts = tsRaw ? new Date(tsRaw).getTime() : NaN;

    let session = sessions.get(sessionId);
    if (!session) {
      session = { referralSource: "", firstTs: Infinity, completedTs: null, lastStep: null, downloadClicked: false };
      sessions.set(sessionId, session);
    }

    const referralSource = typeof payload.referralSource === "string" ? payload.referralSource : "";
    if (referralSource) session.referralSource = referralSource;
    if (Number.isFinite(ts) && ts < session.firstTs) session.firstTs = ts;

    if (event === "lead_submitted" && Number.isFinite(ts)) {
      if (session.completedTs === null || ts < session.completedTs) session.completedTs = ts;
    }
    if (event === "download_app_click") session.downloadClicked = true;

    if (event === "session_end" && typeof payload.lastStep === "string") {
      session.lastStep = payload.lastStep;
    } else if (event === "step_viewed" && typeof payload.stepId === "string") {
      session.lastStep = payload.stepId;
    }
  }

  interface Bucket {
    opens: number;
    completed: number;
    downloadClicks: number;
    completionDurationsSec: number[];
    dropOffSteps: Record<string, number>;
  }
  const buckets = new Map<string, Bucket>();

  for (const session of sessions.values()) {
    if (!session.referralSource) continue;
    let bucket = buckets.get(session.referralSource);
    if (!bucket) {
      bucket = { opens: 0, completed: 0, downloadClicks: 0, completionDurationsSec: [], dropOffSteps: {} };
      buckets.set(session.referralSource, bucket);
    }

    bucket.opens += 1;
    if (session.downloadClicked) bucket.downloadClicks += 1;

    if (session.completedTs !== null) {
      bucket.completed += 1;
      if (Number.isFinite(session.firstTs)) {
        bucket.completionDurationsSec.push((session.completedTs - session.firstTs) / 1000);
      }
    } else if (session.lastStep) {
      bucket.dropOffSteps[session.lastStep] = (bucket.dropOffSteps[session.lastStep] ?? 0) + 1;
    }
  }

  const lastUpdated = new Date().toISOString();
  const statRows: ReferralStatRow[] = Array.from(buckets.entries())
    .map(([referralSource, bucket]) => {
      const topDropOffStep = Object.entries(bucket.dropOffSteps).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "";
      const avgTimeToCompleteSec: number | "" = bucket.completionDurationsSec.length
        ? Math.round(
            bucket.completionDurationsSec.reduce((sum, d) => sum + d, 0) / bucket.completionDurationsSec.length,
          )
        : "";

      return {
        referralSource,
        opens: bucket.opens,
        completed: bucket.completed,
        completionRate: bucket.opens ? `${Math.round((bucket.completed / bucket.opens) * 100)}%` : "0%",
        avgTimeToCompleteSec,
        dropOffCount: bucket.opens - bucket.completed,
        topDropOffStep,
        downloadClicks: bucket.downloadClicks,
        lastUpdated,
      };
    })
    .sort((a, b) => b.opens - a.opens);

  const statsSheet = await getOrCreateSheet(doc, "ReferralStats", REFERRAL_STATS_HEADER);
  await statsSheet.clearRows();
  if (statRows.length > 0) {
    await statsSheet.addRows(statRows.map((r) => ({ ...r })));
  }

  return statRows;
}
