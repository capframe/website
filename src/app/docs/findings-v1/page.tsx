import type { Metadata } from "next";
import Link from "next/link";
import { Footer, Header, StatusBar } from "@/app/leaderboard/_components";
import { CAPFRAME_GITHUB } from "@/lib/version";

export const metadata: Metadata = {
  title: "findings.v1 schema reference",
  description:
    "Reference documentation for capframe.findings.v1 — the shared findings format produced by capframe-find and consumed by capframe-bind, capframe-guard, and capframe-report. JSON Schema 2020-12.",
  alternates: { canonical: "/docs/findings-v1" },
};

const SCHEMA_URL = `${CAPFRAME_GITHUB}/blob/main/schemas/findings.v1.json`;
const SCHEMA_RAW = `${CAPFRAME_GITHUB.replace("github.com", "raw.githubusercontent.com")}/main/schemas/findings.v1.json`;

export default function FindingsV1ReferencePage() {
  return (
    <>
      <StatusBar />
      <Header activePage="docs" />
      <main className="px-6 sm:px-10 lg:px-16">
        <article className="max-w-[820px] mx-auto pt-12 sm:pt-16 pb-24">
          {/* Breadcrumb */}
          <div className="mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-fg-3)] mb-6">
            <Link href="/" className="hover:text-[var(--color-fg)]">
              ← capframe
            </Link>
            <span className="mx-3 opacity-50">/</span>
            <span>docs</span>
            <span className="mx-3 opacity-50">/</span>
            <span className="text-[var(--color-fg-3)]">findings.v1</span>
          </div>

          <div className="flex items-baseline gap-3 mb-3">
            <span className="mono text-[12px] text-[var(--color-accent)]">
              § schema
            </span>
            <span className="label">capframe.findings.v1</span>
            <span className="label">JSON Schema 2020-12</span>
          </div>
          <h1 className="text-[clamp(2rem,4.5vw,3.2rem)] font-semibold tracking-[-0.03em] leading-[1.05]">
            findings.v1
          </h1>
          <p className="mt-4 text-[1rem] text-[var(--color-fg-2)]">
            The shared wire format every Capframe module emits or consumes.{" "}
            <Link
              href={SCHEMA_URL}
              className="underline decoration-[var(--color-accent-3)] underline-offset-2 hover:text-[var(--color-accent)]"
            >
              View raw JSON Schema →
            </Link>
          </p>

          <CalloutRow />

          {/* Envelope */}
          <H2 id="envelope">Top-level envelope</H2>
          <P>
            Every <Code>findings.v1</Code> document is an object with these
            required fields. Anything else is rejected by the schema.
          </P>
          <Table
            rows={[
              [
                "schema_version",
                "const",
                <>literal <Code>capframe.findings.v1</Code></>,
                "required",
              ],
              ["scanned_at", "string · date-time", "RFC 3339", "required"],
              ["scan_id", "string · uuid", "stable per scan", "optional"],
              [
                "scanner",
                <Link key="s" href="#scanner" className="link">
                  Scanner
                </Link>,
                "who produced this",
                "required",
              ],
              [
                "target",
                <Link key="t" href="#target" className="link">
                  Target
                </Link>,
                "what was scanned",
                "required",
              ],
              [
                "tools",
                <>array of{" "}<Link key="t" href="#tool" className="link">Tool</Link></>,
                "tool surface seen",
                "required",
              ],
              [
                "findings",
                <>array of{" "}<Link key="f" href="#finding" className="link">Finding</Link></>,
                "what the classifier emitted",
                "required",
              ],
              [
                "summary",
                <Link key="su" href="#summary" className="link">
                  Summary
                </Link>,
                "aggregated counts + mappings",
                "required",
              ],
            ]}
          />

          {/* Scanner */}
          <H2 id="scanner">Scanner</H2>
          <P>Identifies the tool that emitted the document.</P>
          <Table
            rows={[
              [
                "name",
                "string",
                <>e.g. <Code>capframe-find</Code>, <Code>mcp-recon</Code></>,
                "required",
              ],
              ["version", "string", <>e.g. <Code>0.2.0</Code></>, "required"],
            ]}
          />

          {/* Target */}
          <H2 id="target">Target</H2>
          <P>Describes the artefact under scan.</P>
          <Table
            rows={[
              [
                "kind",
                <Link key="tk" href="#targetkind" className="link">
                  TargetKind
                </Link>,
                "discriminator",
                "required",
              ],
              ["name", "string", "free-form display name", "optional"],
              ["url", "string · uri", "for HTTP targets", "optional"],
              ["path", "string", "for filesystem targets", "optional"],
              [
                "transport",
                <>enum:{" "}<Code>stdio | http | sse | websocket</Code></>,
                "for MCP servers",
                "optional",
              ],
            ]}
          />

          <H3 id="targetkind">TargetKind enum</H3>
          <EnumList
            items={[
              ["mcp_server", "An MCP server (stdio or HTTP)"],
              ["openai_function", "An OpenAI function-calling tool spec"],
              ["anthropic_tool", "An Anthropic tool_use block"],
              ["langgraph_node", "A LangGraph node definition"],
              ["custom", "Anything else; the scanner attaches its own shape"],
            ]}
          />

          {/* Tool */}
          <H2 id="tool">Tool</H2>
          <P>
            One entry per tool in the scanned surface. Same shape regardless of{" "}
            <Link href="#targetkind" className="link">TargetKind</Link>.
          </P>
          <Table
            rows={[
              ["name", "string", "tool identity", "required"],
              ["description", "string", "free-form blurb", "optional"],
              [
                "parameters",
                "object · JSON Schema",
                "the tool's input contract",
                "optional",
              ],
              [
                "side_effects",
                <>array of{" "}<Link key="se" href="#sideeffect" className="link">SideEffect</Link></>,
                "declared, not inferred",
                "optional",
              ],
              [
                "auth_required",
                "boolean",
                "did the manifest claim auth?",
                "optional",
              ],
              ["rate_limited", "boolean", "manifest claim", "optional"],
            ]}
          />

          <H3 id="sideeffect">SideEffect enum</H3>
          <EnumList
            items={[
              ["read", "Reads bounded state"],
              ["write", "Mutates state inside the bounded scope"],
              ["network", "Egresses to the network"],
              ["filesystem", "Touches the host filesystem"],
              ["execute", "Runs code or shell commands"],
              ["money", "Moves funds, charges, refunds"],
              ["irreversible", "Destructive — delete, drop, send"],
            ]}
          />

          {/* Finding */}
          <H2 id="finding">Finding</H2>
          <P>
            One rule firing on one tool (or, occasionally, server-level).
            Findings are the unit of cross-tool exchange — the same Finding
            object can flow from <Code>mcp-recon</Code> →{" "}
            <Code>capnagent</Code> for caveat issuance, or →{" "}
            <Code>capframe-report</Code> for OWASP/NIST/ATLAS reporting.
          </P>
          <Table
            rows={[
              ["id", "string", "stable hash; safe to diff across scans", "required"],
              [
                "severity",
                <Link key="sev" href="#severity" className="link">
                  Severity
                </Link>,
                "info | low | medium | high | critical",
                "required",
              ],
              [
                "category",
                <Link key="cat" href="#category" className="link">
                  Category
                </Link>,
                "stable taxonomy",
                "required",
              ],
              ["title", "string · max 200", "one-line summary", "required"],
              ["description", "string", "longer body", "optional"],
              [
                "tool",
                "string",
                "name of the tool this finding relates to",
                "optional",
              ],
              [
                "evidence",
                "object",
                "scanner-specific structured detail",
                "optional",
              ],
              ["remediation", "string", "actionable fix text", "optional"],
              [
                "mappings",
                <Link key="m" href="#mappings" className="link">
                  Mappings
                </Link>,
                "compliance-framework IDs",
                "optional",
              ],
              [
                "first_seen",
                "string · date-time",
                "carried across scans by the consumer",
                "optional",
              ],
              ["last_seen", "string · date-time", "carried similarly", "optional"],
            ]}
          />

          <H3 id="severity">Severity enum</H3>
          <EnumList
            items={[
              ["info", "Informational; no action required"],
              ["low", "Worth noting; doesn't block"],
              [
                "medium",
                <>Should be remediated; typical for{" "}
                  <Code>unconstrained_input</Code>
                </>,
              ],
              [
                "high",
                "Blocks production for security-sensitive deployments",
              ],
              [
                "critical",
                <>Maximal authority leak (e.g. arbitrary code execution surface — see R7)</>,
              ],
            ]}
          />

          <H3 id="category">Category enum</H3>
          <EnumList
            items={[
              ["indirect_injection", "Tool fetches/forwards untrusted content"],
              ["excessive_agency", "Tool has more power than its caveats declare"],
              ["unconstrained_input", "String / object parameter with no bound"],
              ["missing_authz", "Side-effect tool with no auth claim"],
              ["insecure_output_handling", "Output not sanitised back to the agent"],
              ["secret_exposure", "Schema implies leaking credentials"],
              ["tool_naming_conflict", "Two tools with overlapping names"],
              ["deserialization", "Accepts opaque blobs that could be exploits"],
              ["ssrf_surface", "URL parameter with no host allowlist"],
              ["filesystem_egress", "Reads outside its declared scope"],
              ["network_egress", "Egresses without rate limit / domain bound"],
              ["untrusted_dependency", "Pulls in a dep we can't vouch for"],
              ["other", "Doesn't fit the above; subject to taxonomy change"],
            ]}
          />

          <H3 id="mappings">Mappings — compliance IDs</H3>
          <P>
            Each finding can carry compliance-framework references. Patterns
            are enforced by the schema, so consumers can trust the strings.
          </P>
          <Table
            rows={[
              [
                "owasp_llm[]",
                "string",
                <>pattern <Code>^LLM(0[1-9]|10)$</Code></>,
                "e.g. LLM08",
              ],
              [
                "nist_rmf[]",
                "string",
                <>
                  pattern{" "}
                  <Code>^(GOVERN|MAP|MEASURE|MANAGE)-[0-9]+(\.[0-9]+)*$</Code>
                </>,
                "e.g. MANAGE-2.2",
              ],
              [
                "mitre_atlas[]",
                "string",
                <>pattern <Code>^T[0-9]{`{4}`}(\.[0-9]{`{3}`})?$</Code></>,
                "e.g. T0051",
              ],
            ]}
          />

          {/* Summary */}
          <H2 id="summary">Summary</H2>
          <P>
            Aggregated counts. Computed by the scanner; consumers should not
            recompute. The fields are flat and stable for diffing across scans.
          </P>
          <Table
            rows={[
              ["total", "integer ≥ 0", "findings.length", "required"],
              [
                "by_severity",
                <Link key="sc" href="#severitycounts" className="link">
                  SeverityCounts
                </Link>,
                "five-key tally",
                "required",
              ],
              [
                "by_category",
                <>object · keys are <Link key="c" href="#category" className="link">Category</Link></>,
                "k → count of findings in that category",
                "optional",
              ],
              [
                "mappings",
                "object",
                <>roll-up of <Link key="m" href="#mappings" className="link">Mappings</Link> IDs across all findings</>,
                "optional",
              ],
            ]}
          />

          <H3 id="severitycounts">SeverityCounts</H3>
          <P>
            All five severity keys present, default <Code>0</Code>. Sum equals{" "}
            <Code>summary.total</Code>.
          </P>

          {/* Example */}
          <H2 id="example">Example envelope</H2>
          <P>
            Minimal but valid. Strip the <Code>tools</Code> and{" "}
            <Code>findings</Code> arrays empty and you have the empty-scan
            shape that mcp-recon emits when its input can't be parsed.
          </P>
          <pre className="mt-4 p-4 rounded-md border border-[var(--color-line)] bg-[var(--color-bg-2)]/50 overflow-x-auto text-[12px] mono leading-relaxed">{`{
  "schema_version": "capframe.findings.v1",
  "scanned_at": "2026-05-30T13:47:37Z",
  "scan_id": "0c81b6d2-7a91-4c52-9c1e-aa8e90e3f6b1",
  "scanner": { "name": "mcp-recon", "version": "0.2.0" },
  "target":  { "kind": "mcp_server", "name": "shopify-mcp", "transport": "stdio" },
  "tools": [
    {
      "name": "order.refund",
      "description": "Issue a refund on an order",
      "side_effects": ["write", "money", "irreversible"],
      "auth_required": true
    }
  ],
  "findings": [
    {
      "id": "f-order-refund-unbounded",
      "severity": "high",
      "category": "excessive_agency",
      "title": "order.refund has no monetary cap",
      "description": "Accepts arbitrary amount with no policy-side cap.",
      "tool": "order.refund",
      "remediation": "Bind a capability with --max-refund.",
      "mappings": {
        "owasp_llm":   ["LLM08"],
        "nist_rmf":    ["MANAGE-2.2"],
        "mitre_atlas": ["T0051"]
      }
    }
  ],
  "summary": {
    "total": 1,
    "by_severity": { "info": 0, "low": 0, "medium": 0, "high": 1, "critical": 0 },
    "by_category": { "excessive_agency": 1 }
  }
}`}</pre>

          {/* Footer note */}
          <div className="mt-12 rounded-md border border-[var(--color-line)] bg-[var(--color-bg-2)]/40 p-5 text-[0.92rem] text-[var(--color-fg-2)]">
            <p className="mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-accent-3)] mb-2">
              Versioning
            </p>
            <p>
              Schema changes that add optional fields are{" "}
              <span className="text-[var(--color-fg)]">backwards-compatible</span>{" "}
              and don't bump the version. Renaming, removing, or
              changing semantics of an existing field bumps the
              version (<Code>capframe.findings.v2</Code>, etc.).
              Consumers should accept unknown optional fields silently.
            </p>
            <p className="mt-3">
              Canonical JSON Schema:{" "}
              <Link href={SCHEMA_RAW} className="link">
                {SCHEMA_RAW.replace("https://", "")}
              </Link>
            </p>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}

/* ──────────────────────────────────────────────────────────────────────── */
/* Helpers                                                                   */
/* ──────────────────────────────────────────────────────────────────────── */

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="mt-12 text-[1.5rem] font-semibold tracking-[-0.02em] scroll-mt-24"
    >
      <Link href={`#${id}`} className="hover:text-[var(--color-accent)]">
        {children}
      </Link>
    </h2>
  );
}

function H3({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h3
      id={id}
      className="mt-8 text-[1.15rem] font-semibold tracking-[-0.01em] scroll-mt-24 text-[var(--color-fg-2)]"
    >
      <Link href={`#${id}`} className="hover:text-[var(--color-accent)]">
        {children}
      </Link>
    </h3>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-3 text-[0.98rem] text-[var(--color-fg-2)] leading-[1.55]">
      {children}
    </p>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="mono text-[12px] text-[var(--color-fg)] bg-[var(--color-bg-2)]/60 px-1.5 py-0.5 rounded border border-[var(--color-line)]">
      {children}
    </code>
  );
}

function Table({ rows }: { rows: React.ReactNode[][] }) {
  return (
    <div className="mt-4 overflow-x-auto rounded-md border border-[var(--color-line)]">
      <table className="w-full text-[0.88rem]">
        <thead>
          <tr className="mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-3)] border-b border-[var(--color-line)]">
            <th className="text-left px-3 py-2 font-normal">field</th>
            <th className="text-left px-3 py-2 font-normal">type</th>
            <th className="text-left px-3 py-2 font-normal">notes</th>
            <th className="text-left px-3 py-2 font-normal w-24">required?</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={i}
              className={
                i % 2 === 1
                  ? "bg-[var(--color-bg-2)]/20"
                  : ""
              }
            >
              {r.map((cell, j) => (
                <td
                  key={j}
                  className={`px-3 py-2 align-top text-[var(--color-fg-2)] ${j === 0 ? "mono text-[12px] text-[var(--color-fg)] whitespace-nowrap" : ""}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EnumList({ items }: { items: [string, React.ReactNode][] }) {
  return (
    <ul className="mt-3 space-y-1.5">
      {items.map(([k, v]) => (
        <li key={k} className="text-[0.93rem] text-[var(--color-fg-2)]">
          <Code>{k}</Code>{" "}
          <span className="text-[var(--color-fg-3)]">— {v}</span>
        </li>
      ))}
    </ul>
  );
}

function CalloutRow() {
  return (
    <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 mono text-[11px] uppercase tracking-[0.14em]">
      <Pill label="Producers">capframe-find · mcp-recon · capframe-report</Pill>
      <Pill label="Consumers">capframe-bind · capframe-guard · capframe-report</Pill>
      <Pill label="Frameworks">OWASP LLM · NIST AI RMF · MITRE ATLAS</Pill>
    </div>
  );
}

function Pill({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-[var(--color-line)] rounded-md p-3 bg-[var(--color-bg-2)]/30">
      <div className="text-[var(--color-fg-3)]">{label}</div>
      <div className="mt-1 text-[var(--color-fg)] text-[11px] tracking-[0.12em] truncate">
        {children}
      </div>
    </div>
  );
}
