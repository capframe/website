import type { Metadata } from "next";
import Link from "next/link";
import { Footer, Header, StatusBar } from "@/app/leaderboard/_components";
import { CAPFRAME_GITHUB, CAPFRAME_INSTALL } from "@/lib/version";

export const metadata: Metadata = {
  title: "Quickstart — get findings out of a real MCP server in 5 minutes",
  description:
    "Install Capframe, scan a known MCP server with mcp-recon, read the findings.v1 output, and chain into capnagent for capability tokens. Five steps, copy-paste shell commands.",
  alternates: { canonical: "/quickstart" },
};

export default function QuickstartPage() {
  return (
    <>
      <StatusBar />
      <Header activePage="quickstart" />
      <main className="px-6 sm:px-10 lg:px-16">
        <article className="max-w-[820px] mx-auto pt-12 sm:pt-16 pb-24">
          <div className="flex items-baseline gap-3 mb-3">
            <span className="mono text-[12px] text-[var(--color-accent)]">
              § quickstart
            </span>
            <span className="label">5 minutes</span>
            <span className="label">copy-paste</span>
          </div>
          <h1 className="text-[clamp(2.2rem,5vw,3.6rem)] font-semibold tracking-[-0.03em] leading-[1.05]">
            Get findings out of a real MCP server.
          </h1>
          <p className="mt-5 text-[1.04rem] text-[var(--color-fg-2)] max-w-[44rem] leading-[1.55]">
            Five steps. Copy-paste shell commands. Real binaries. By the end
            you'll have a{" "}
            <Link href="/docs/findings-v1" className="link">
              findings.v1.json
            </Link>{" "}
            document for a server you can verify against the public{" "}
            <Link href="/leaderboard" className="link">
              leaderboard
            </Link>
            .
          </p>

          {/* Prereqs */}
          <Section
            n="0"
            title="Prereqs"
            note="2 min if these aren't already installed"
          >
            <ul className="mt-2 space-y-1 text-[0.94rem] text-[var(--color-fg-2)]">
              <li>
                · <strong>curl</strong> and a POSIX-ish shell (bash, zsh, or
                Git Bash on Windows)
              </li>
              <li>
                · <strong>Node 20+</strong> (only if you want to scan an npm
                MCP server in the sandbox path — optional for the static
                steps below)
              </li>
              <li>
                · <strong>Docker</strong> (only for the live sandbox path —
                same caveat)
              </li>
            </ul>
          </Section>

          {/* 1. Install */}
          <Section n="1" title="Install Capframe" note="20s">
            <p className="mt-2 text-[0.94rem] text-[var(--color-fg-2)] leading-[1.55]">
              One sha256-verified installer drops the <Code>capframe</Code>{" "}
              umbrella + <Code>mcp-recon</Code> +{" "}
              <Code>capnagent</Code> binaries onto your PATH.
            </p>
            <CodeBlock>{CAPFRAME_INSTALL}</CodeBlock>
            <p className="mt-2 text-[0.85rem] text-[var(--color-fg-3)]">
              Verify:{" "}
              <Code>capframe --version</Code> should print a version line. If
              you'd rather install from source, see the{" "}
              <Link
                href={`${CAPFRAME_GITHUB}/blob/main/README.md#install`}
                className="link"
              >
                source-install steps
              </Link>
              .
            </p>
          </Section>

          {/* 2. Grab an inventory */}
          <Section n="2" title="Grab a real inventory" note="10s">
            <p className="mt-2 text-[0.94rem] text-[var(--color-fg-2)] leading-[1.55]">
              The fastest first run uses a pre-built inventory from the repo
              so you can see findings without setting up an MCP config first.
              We'll fetch the <Code>safe-mcp</Code> sample — a deliberately
              well-defended server, plus a deliberately leaky one — and
              classify both in step 3.
            </p>
            <CodeBlock>{`curl -fsSL \\
  https://raw.githubusercontent.com/euanmcrosson-dotcom/mcp-recon/master/examples/safe-mcp.inventory.json \\
  -o inventory.json`}</CodeBlock>
            <p className="mt-2 text-[0.85rem] text-[var(--color-fg-3)]">
              <strong className="text-[var(--color-fg-2)]">
                Already have an MCP config?
              </strong>{" "}
              Skip the curl and build a live inventory from your own setup
              with{" "}
              <Code>mcp-recon enumerate ~/.cursor/mcp.json --out inventory.json --pretty</Code>
              . Failures don't abort the run — a server that can't be reached
              becomes an empty inventory entry, so the output is always a
              well-formed{" "}
              <Link href="/docs/findings-v1#example" className="link">
                envelope
              </Link>
              .
            </p>
          </Section>

          {/* 3. Classify */}
          <Section
            n="3"
            title="Classify the inventory into findings"
            note="instant — deterministic, no LLM"
          >
            <p className="mt-2 text-[0.94rem] text-[var(--color-fg-2)] leading-[1.55]">
              Same input → same output, every run. Seven rules (R1–R7) map to
              OWASP LLM Top 10, NIST AI RMF, and MITRE ATLAS IDs.
            </p>
            <CodeBlock>{`mcp-recon --target inventory.json --out findings.json --pretty
# Or via the umbrella:
capframe find inventory.json --out findings.json`}</CodeBlock>
            <p className="mt-2 text-[0.85rem] text-[var(--color-fg-3)]">
              The file you get is a{" "}
              <Link href="/docs/findings-v1" className="link">
                findings.v1
              </Link>{" "}
              JSON envelope. Open <Code>findings.json</Code> in your editor —
              the <Code>findings[]</Code> array is the unit of value, each
              entry has a stable <Code>id</Code>, a severity, a category, a
              remediation hint, and the compliance-framework IDs that map to
              it.
            </p>
          </Section>

          {/* 4. Skim the output */}
          <Section n="4" title="Skim the output without leaving the shell" note="30s">
            <p className="mt-2 text-[0.94rem] text-[var(--color-fg-2)] leading-[1.55]">
              Two one-liners that work on any{" "}
              <Link href="/docs/findings-v1" className="link">
                findings.v1
              </Link>{" "}
              document:
            </p>
            <CodeBlock>{`# Counts by severity
jq '.summary.by_severity' findings.json

# Worst-first list of titles
jq '[.findings[] | select(.severity=="critical" or .severity=="high")] | sort_by(.severity) | reverse | .[].title' findings.json`}</CodeBlock>
            <p className="mt-2 text-[0.85rem] text-[var(--color-fg-3)]">
              Want to verify against the public scoreboard? The same scanner
              runs daily on a corpus of 72+ servers at{" "}
              <Link href="/leaderboard" className="link">
                capframe.ai/leaderboard
              </Link>{" "}
              — find any package you're using and compare findings to the live
              scan.
            </p>
          </Section>

          {/* 5. Bind */}
          <Section
            n="5"
            title="Turn findings into capability caveats"
            note="hand-off to capnagent"
          >
            <p className="mt-2 text-[0.94rem] text-[var(--color-fg-2)] leading-[1.55]">
              The Find module names the surface; the Bind module shrinks it.{" "}
              <Code>mcp-recon caveats</Code> emits a capnagent-ready issuance
              plan — a deny/scope recommendation per authority-relevant
              finding, plus caveat-DSL strings ready to mint into a capability
              token.
            </p>
            <CodeBlock>{`mcp-recon caveats inventory.json --out caveats.json --pretty
# Inspect the recommended plans:
jq '.plans[] | {tool, recommend, caveats: [.caveats[].dsl]}' caveats.json
# Hand off to capnagent:
capframe bind caveats.json --out token.bin`}</CodeBlock>
            <p className="mt-2 text-[0.85rem] text-[var(--color-fg-3)]">
              The token is a macaroon-style capability — pass it to your agent
              runtime and{" "}
              <Code>capframe-guard</Code> enforces the caveats at call time.
              That's the full Find → Bind → Guard loop in five steps.
            </p>
          </Section>

          {/* Next */}
          <div className="mt-14 rounded-md border border-[var(--color-line)] bg-[var(--color-bg-2)]/40 p-5">
            <p className="mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-accent-3)] mb-3">
              Where to next
            </p>
            <ul className="space-y-2 text-[0.95rem] text-[var(--color-fg-2)]">
              <li>
                ·{" "}
                <Link href="/docs/findings-v1" className="link">
                  findings.v1 schema reference
                </Link>{" "}
                — every field of the wire format, with the JSON Schema regex
                patterns
              </li>
              <li>
                ·{" "}
                <Link href="/leaderboard" className="link">
                  live leaderboard
                </Link>{" "}
                — 72 MCP servers, refreshed daily, full per-tool findings
              </li>
              <li>
                ·{" "}
                <Link href="/blog" className="link">
                  blog
                </Link>{" "}
                — write-ups of specific findings + classifier discipline
              </li>
              <li>
                ·{" "}
                <Link href={CAPFRAME_GITHUB} className="link">
                  GitHub
                </Link>{" "}
                — issue a bug report, propose a new rule, vendor the binaries
              </li>
            </ul>
          </div>

          <p className="mt-10 text-[0.85rem] text-[var(--color-fg-3)]">
            Hit a snag?{" "}
            <Link
              href={`${CAPFRAME_GITHUB}/issues/new?title=quickstart%3A%20`}
              className="link"
            >
              Open an issue
            </Link>{" "}
            with the step number and the error — the quickstart should work
            on a clean machine.
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}

function Section({
  n,
  title,
  note,
  children,
}: {
  n: string;
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10 border-t border-[var(--color-line)] pt-8">
      <div className="flex items-baseline gap-3 flex-wrap">
        <span className="mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-accent-3)] tabular-nums">
          step {n}
        </span>
        {note && (
          <span className="mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-fg-3)]">
            ~ {note}
          </span>
        )}
      </div>
      <h2 className="mt-2 text-[1.45rem] font-semibold tracking-[-0.02em]">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="mono text-[12px] text-[var(--color-fg)] bg-[var(--color-bg-2)]/60 px-1.5 py-0.5 rounded border border-[var(--color-line)]">
      {children}
    </code>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="mt-3 p-4 rounded-md border border-[var(--color-line)] bg-[var(--color-bg-2)]/50 overflow-x-auto text-[12.5px] mono leading-[1.55]">
      {children}
    </pre>
  );
}
