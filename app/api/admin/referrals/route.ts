import { NextResponse } from "next/server";
import { appendReferralLink, getReferralLinks } from "@/lib/googleSheets";
import { isValidReferralSlug } from "@/constants/reservedSlugs";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://pg.picapool.tech";

export async function GET() {
  try {
    const links = await getReferralLinks();
    return NextResponse.json({ links });
  } catch (error) {
    console.error("Failed to load referral links", error);
    return NextResponse.json({ error: "Failed to load referral links" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const slug = typeof body?.slug === "string" ? body.slug.trim().toLowerCase() : "";
  const label = typeof body?.label === "string" ? body.label.trim() : "";

  if (!isValidReferralSlug(slug)) {
    return NextResponse.json(
      { error: "Slug must be 2-40 lowercase letters, numbers, - or _, and not a reserved word" },
      { status: 400 },
    );
  }

  try {
    const created = await appendReferralLink({ slug, label, link: `${SITE_URL}/${slug}` });
    return NextResponse.json({ link: created });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create referral link";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
