// TypeScript mirror of the `capframe.leaderboard.v1` schema emitted by
// the Rust `capframe-leaderboard` crate (capframe repo). Keep in sync.

export type ServerSource = "registry" | "http" | "sandbox" | "file";

export type Severity = "info" | "low" | "medium" | "high" | "critical";

export type Category =
  | "indirect_injection"
  | "excessive_agency"
  | "unconstrained_input"
  | "missing_authz"
  | "insecure_output_handling"
  | "secret_exposure"
  | "tool_naming_conflict"
  | "deserialization"
  | "ssrf_surface"
  | "filesystem_egress"
  | "network_egress"
  | "untrusted_dependency"
  | "other";

export interface FindingMappings {
  owasp_llm?: string[];
  nist_rmf?: string[];
  mitre_atlas?: string[];
}

export interface Finding {
  id: string;
  severity: Severity;
  category: Category;
  title: string;
  description?: string;
  tool?: string;
  remediation?: string;
  mappings?: FindingMappings;
}

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
  /** Number of tools the producer exposed for this server.
   *  Optional for backward-compat with leaderboards generated before
   *  the field was added. */
  tool_count?: number;
  counts: SeverityCounts;
  last_scanned: string;
  /** Full findings list for the per-server detail view. Optional —
   *  older leaderboards (before this field was added) don't carry
   *  it; the page falls back to summary-only rendering for those. */
  findings?: Finding[];
}

export interface Leaderboard {
  schema_version: "capframe.leaderboard.v1";
  generated_at: string;
  total_scanned: number;
  weights: Weights;
  rows: Row[];
}
