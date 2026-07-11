"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Box } from "@/components/Box";
import type { ReferralLink, ReferralStatRow } from "@/lib/googleSheets";

export interface AdminDashboardProps {
  initialLinks: ReferralLink[];
  sheetsConfigured: boolean;
}

export function AdminDashboard({ initialLinks, sheetsConfigured }: AdminDashboardProps) {
  const router = useRouter();
  const [links, setLinks] = useState(initialLinks);
  const [slug, setSlug] = useState("");
  const [label, setLabel] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const [stats, setStats] = useState<ReferralStatRow[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  async function refreshStats() {
    setStatsLoading(true);
    setStatsError(null);
    try {
      const res = await fetch("/api/admin/referral-stats", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to refresh stats");
      setStats(data.stats);
    } catch (error) {
      setStatsError(error instanceof Error ? error.message : "Failed to refresh stats");
    } finally {
      setStatsLoading(false);
    }
  }

  useEffect(() => {
    // Recomputed once whenever the dashboard is opened, so the numbers are
    // always current without anyone needing to remember to click refresh.
    void refreshStats();
  }, []);

  async function onGenerate(event: FormEvent) {
    event.preventDefault();
    setIsGenerating(true);
    setGenerateError(null);

    try {
      const res = await fetch("/api/admin/referrals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: slug.trim().toLowerCase(), label: label.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to create link");
      setLinks((prev) => [data.link, ...prev]);
      setSlug("");
      setLabel("");
    } catch (error) {
      setGenerateError(error instanceof Error ? error.message : "Failed to create link");
    } finally {
      setIsGenerating(false);
    }
  }

  async function copyLink(link: string) {
    await navigator.clipboard.writeText(link);
    setCopiedSlug(link);
    setTimeout(() => setCopiedSlug((current) => (current === link ? null : current)), 1500);
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  if (!sheetsConfigured) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-10">
        <p className="text-[14px] text-ink">
          Google Sheets isn&apos;t configured (missing service account credentials or GOOGLE_PG_SHEET_ID). Set those
          env vars to use the referral link generator.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-[20px] font-semibold text-ink">Referral links</h1>
        <button type="button" onClick={logout} className="text-[13px] text-muted-foreground underline underline-offset-4 hover:text-ink">
          Log out
        </button>
      </div>

      <Box tone="dashed" className="gap-3">
        <p className="text-[13px] font-semibold text-ink">Generate a new link</p>
        <form onSubmit={onGenerate} className="flex flex-col gap-2 sm:flex-row sm:items-start">
          <Input
            placeholder="slug, e.g. insta_ritika"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="sm:flex-1"
          />
          <Input
            placeholder="label (optional), e.g. Ritika - Instagram"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="sm:flex-1"
          />
          <Button type="submit" disabled={isGenerating || !slug.trim()} className="whitespace-nowrap">
            {isGenerating ? "Generating..." : "Generate"}
          </Button>
        </form>
        {generateError && <p className="text-[12.5px] text-note">{generateError}</p>}
      </Box>

      <div className="overflow-x-auto rounded-lg border-[1.5px] border-ink/20">
        <table className="w-full text-left text-[13px]">
          <thead className="bg-muted text-[11px] uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">Slug</th>
              <th className="px-3 py-2 font-medium">Label</th>
              <th className="px-3 py-2 font-medium">Link</th>
              <th className="px-3 py-2 font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {links.length === 0 && (
              <tr>
                <td colSpan={4} className="px-3 py-4 text-center text-muted-foreground">
                  No links yet - generate one above.
                </td>
              </tr>
            )}
            {links.map((link) => (
              <tr key={link.slug} className="border-t border-ink/10">
                <td className="px-3 py-2 font-mono">{link.slug}</td>
                <td className="px-3 py-2 text-muted-foreground">{link.label || "-"}</td>
                <td className="px-3 py-2">
                  <button
                    type="button"
                    onClick={() => copyLink(link.link)}
                    className="text-selected underline underline-offset-4 hover:text-selected/80"
                  >
                    {copiedSlug === link.link ? "Copied!" : link.link}
                  </button>
                </td>
                <td className="px-3 py-2 text-muted-foreground">
                  {link.createdAt ? new Date(link.createdAt).toLocaleDateString() : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-[20px] font-semibold text-ink">Referral stats</h2>
        <button
          type="button"
          onClick={() => void refreshStats()}
          disabled={statsLoading}
          className="text-[13px] text-muted-foreground underline underline-offset-4 hover:text-ink disabled:opacity-50"
        >
          {statsLoading ? "Refreshing..." : "Refresh now"}
        </button>
      </div>

      {statsError && <p className="text-[13px] text-note">{statsError}</p>}

      <div className="overflow-x-auto rounded-lg border-[1.5px] border-ink/20">
        <table className="w-full text-left text-[13px]">
          <thead className="bg-muted text-[11px] uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">Source</th>
              <th className="px-3 py-2 font-medium">Opens</th>
              <th className="px-3 py-2 font-medium">Completed</th>
              <th className="px-3 py-2 font-medium">Completion</th>
              <th className="px-3 py-2 font-medium">Avg time to fill</th>
              <th className="px-3 py-2 font-medium">Drop-offs</th>
              <th className="px-3 py-2 font-medium">Top drop-off step</th>
              <th className="px-3 py-2 font-medium">Downloads</th>
            </tr>
          </thead>
          <tbody>
            {!statsLoading && stats.length === 0 && (
              <tr>
                <td colSpan={8} className="px-3 py-4 text-center text-muted-foreground">
                  No referral traffic recorded yet.
                </td>
              </tr>
            )}
            {stats.map((row) => (
              <tr key={row.referralSource} className="border-t border-ink/10">
                <td className="px-3 py-2 font-mono">{row.referralSource}</td>
                <td className="px-3 py-2">{row.opens}</td>
                <td className="px-3 py-2">{row.completed}</td>
                <td className="px-3 py-2">{row.completionRate}</td>
                <td className="px-3 py-2">
                  {row.avgTimeToCompleteSec === "" ? "-" : formatDuration(row.avgTimeToCompleteSec)}
                </td>
                <td className="px-3 py-2">{row.dropOffCount}</td>
                <td className="px-3 py-2 text-muted-foreground">{row.topDropOffStep || "-"}</td>
                <td className="px-3 py-2">{row.downloadClicks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}
