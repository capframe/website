// Phase-4 scaffold: import the sample bundled with the site so the
// /leaderboard route renders something real on every build, even before
// the Phase-5 Vercel Cron is wiring up daily aggregator runs.
//
// When the cron lands it will write a fresh leaderboard.json into
// public/ (or push it to a separate bucket); flip `loadLeaderboard()` to
// fetch that URL at request time and the page swap is transparent.

import sample from "./sample.json";
import type { Leaderboard } from "./types";

export async function loadLeaderboard(): Promise<Leaderboard> {
  return sample as Leaderboard;
}
