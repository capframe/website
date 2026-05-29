// Vercel Cron entry — POSTed once a day after the GitHub Actions
// pipeline has published a fresh leaderboard.json.
//
// Flow:
//   1. GitHub Actions cron (.github/workflows/leaderboard-daily.yml)
//      runs the Rust pipeline: corpus → mcp-recon producer →
//      capframe-leaderboard build → leaderboard.json.
//   2. That workflow commits the new leaderboard.json into
//      src/lib/leaderboard/sample.json on `main`. The Vercel
//      Git integration deploys automatically.
//   3. THIS route is the safety net: Vercel Cron POSTs daily, and
//      we revalidate /leaderboard so any ISR cache (none today,
//      but cheap insurance for when we move to SWR/ISR) gets
//      bumped on the same cadence as the data.
//
// Auth: bearer CRON_SECRET. Missing env = 500 (our system is broken,
// don't pretend it's a caller problem). Bad token = 401.

import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  const expected = process.env.CRON_SECRET;
  if (!expected) {
    return NextResponse.json(
      { error: "CRON_SECRET not configured" },
      { status: 500 },
    );
  }
  const auth = request.headers.get("authorization") ?? "";
  const provided = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (provided !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  revalidatePath("/leaderboard");

  return NextResponse.json({
    ok: true,
    tick: new Date().toISOString(),
    revalidated: ["/leaderboard"],
  });
}
