import { getReferralLinks, getSheetConfig } from "@/lib/googleSheets";
import { AdminDashboard } from "./AdminDashboard";

// Reads live Sheets data on every visit - must never be frozen at build time.
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const config = getSheetConfig();
  const sheetsConfigured = config.hasCredentials && config.hasPgSheet;
  const initialLinks = sheetsConfigured ? await getReferralLinks().catch(() => []) : [];

  return <AdminDashboard initialLinks={initialLinks} sheetsConfigured={sheetsConfigured} />;
}
