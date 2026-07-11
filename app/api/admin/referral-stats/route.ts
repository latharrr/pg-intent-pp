import { NextResponse } from "next/server";
import { refreshReferralStats } from "@/lib/googleSheets";

export async function POST() {
  try {
    const stats = await refreshReferralStats();
    return NextResponse.json({ stats });
  } catch (error) {
    console.error("Failed to refresh referral stats", error);
    return NextResponse.json({ error: "Failed to refresh referral stats" }, { status: 500 });
  }
}
