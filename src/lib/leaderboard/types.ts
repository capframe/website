// TypeScript mirror of the `capframe.leaderboard.v1` schema emitted by
// the Rust `capframe-leaderboard` crate (capframe repo). Keep in sync.

export type ServerSource = "registry" | "http" | "sandbox" | "file";

export interface SeverityCounts {
  info: number;
  low: number;
  medium: number;
  high: number;
  critical: number;
}

export interface Weights {
  critical: number;
  high: number;
  medium: number;
  low: number;
  score_max: number;
}

export interface Row {
  score: number;
  handle: string;
  source: ServerSource;
  name?: string;
  repo_url?: string;
  counts: SeverityCounts;
  last_scanned: string;
}

export interface Leaderboard {
  schema_version: "capframe.leaderboard.v1";
  generated_at: string;
  total_scanned: number;
  weights: Weights;
  rows: Row[];
}
