// Load archived leaderboard snapshots from src/lib/leaderboard/history/.
//
// The cron at capframe/capframe (`leaderboard-daily.yml`) archives the
// previous sample.json into `history/leaderboard-<iso-ts>.json` before
// overwriting. The /movers page reads the most recent archive and diffs
// against the current live sample.json.
//
// Server-only — uses `fs`. Imports of this module from a "use client"
// component would fail at build, so it's kept separate from sample-only
// loading in load.ts.

import { promises as fs } from "fs";
import path from "path";
import type { Leaderboard } from "./types";

const HISTORY_DIR = path.join(
  process.cwd(),
  "src",
  "lib",
  "leaderboard",
  "history",
);

export interface HistorySnapshot {
  /** Filename without path (e.g. `leaderboard-2026-05-30T07-54-02.json`). */
  filename: string;
  /** Parsed leaderboard. */
  board: Leaderboard;
}

/** Return the most recent archived snapshot, or null if none exists yet. */
export async function loadMostRecentSnapshot(): Promise<HistorySnapshot | null> {
  let names: string[];
  try {
    names = await fs.readdir(HISTORY_DIR);
  } catch {
    return null;
  }
  const candidates = names
    .filter((n) => n.startsWith("leaderboard-") && n.endsWith(".json"))
    .sort()
    .reverse();
  if (candidates.length === 0) return null;
  const top = candidates[0];
  const body = await fs.readFile(path.join(HISTORY_DIR, top), "utf8");
  return { filename: top, board: JSON.parse(body) as Leaderboard };
}

/** List all archived snapshot filenames, newest first. */
export async function listSnapshotFilenames(): Promise<string[]> {
  let names: string[];
  try {
    names = await fs.readdir(HISTORY_DIR);
  } catch {
    return [];
  }
  return names
    .filter((n) => n.startsWith("leaderboard-") && n.endsWith(".json"))
    .sort()
    .reverse();
}
