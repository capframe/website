import type { Metadata } from "next";
import Link from "next/link";
import { Footer, Header, StatusBar } from "@/app/leaderboard/_components";
import { CAPFRAME_GITHUB } from "@/lib/version";

export const metadata: Metadata = {
  title: "CAST — Capframe Agent Security Taxonomy",
  description:
    "CAST is a focused taxonomy of the nine risk categories that only exist when an AI is calling tools — each mapped to a concrete Capframe mitigation. It extends OWASP-LLM, NIST-RMF, and MITRE ATLAS; it does not replace them.",
  alternates: { canonical: "/cast" },
  openGraph: {
    title: "CAST — Capframe Agent Security Taxonomy",
    description:
      "Nine risk categories that only exist when an AI is calling tools, each mapped to a concrete Capframe module.",
  },
};

type Cat = {
  id: string;
  name: string;
  what: string;
  module: string;
};

const CATEGORIES: Cat[] = [
  {
    id: "CAST-01",
    name: "Tool Capability Excess",
    what: "Agent granted tools with dangerous native authority without meaningful constraints — code execution, unbounded money movement, filesystem or secret access.",
    module: "Find",
  },
  {
    id: "CAST-02",
    name: "Indirect Injection via Tool Output",
    what: "Tool-returned content (a scraped page, an email, an invoice) hijacks agent reasoning into unauthorized actions.",
    module: "Guard",
  },
  {
    id: "CAST-03",
    name: "Insufficient Capability Scoping",
    what: "Agent holds broader tool access than any single task requires — no least-privilege at token issuance.",
    module: "Bind",
  },
  {
    id: "CAST-04",
    name: "Tool Metadata Poisoning",
    what: "Tool names, descriptions, or input schemas manipulated to deceive the agent about what a call actually does.",
    module: "Find",
  },
  {
    id: "CAST-05",
    name: "Capability Boundary Violation",
    what: "Agent escapes its permission scope via token abuse, chaining, or attenuation attacks.",
    module: "Bind",
  },
  {
    id: "CAST-06",
    name: "Cross-Tool Propagation",
    what: "Compromise of one tool cascades unauthorized actions across the agent's whole tool surface.",
    module: "Guard",
  },
  {
    id: "CAST-07",
    name: "Persistent State Poisoning",
    what: "Agent memory, context store, or RAG corpus poisoned to persistently skew every future session that reads it.",
    module: "Guard",
  },
  {
    id: "CAST-08",
    name: "Uncontrolled Tool Invocation",
    what: "Runaway loops or burst tool calls cause DoS, cost explosion, or side-effect storms.",
    module: "Guard",
  },
  {
    id: "CAST-09",
    name: "Multi-Agent Authority Delegation",
    what: "An agent delegates authority to a sub-agent that would not have been granted it directly.",
    module: "Bind + Guard",
  },
];

export default function CastPage() {
  return (
    <>
      <StatusBar />
      <Header activePage="cast" />
      <main className="px-6 sm:px-10 lg:px-16">
        <article className="max-w-[860px] mx-auto pt-12 sm:pt-16 pb-24">
          <div className="flex items-baseline gap-3 mb-3">
            <span className="mono text-[12px] text-[var(--color-accent)]">
              § cast v0.1
            </span>
            <span className="label">taxonomy</span>
            <span className="label">9 categories</span>
          </div>
          <h1 className="text-[clamp(2.2rem,5vw,3.6rem)] font-semibold tracking-[-0.03em] leading-[1.05]">
            The risks that only exist when an AI calls tools.
          </h1>
          <p className="mt-5 text-[1.04rem] text-[var(--color-fg-2)] max-w-[46rem] leading-[1.55]">
            <strong>CAST</strong> — the Capframe Agent Security Taxonomy — is a
            focused set of nine risk categories specific to tool-using AI
            agents. Each maps to a concrete Capframe module, so the taxonomy is
            actionable rather than theoretical. CAST <em>extends</em> OWASP-LLM,
            NIST AI-RMF, and MITRE ATLAS — where they already cover something
            well, we say so and point to them. CAST fills the gaps they leave.
          </p>

          <div className="mt-12 border-t border-[var(--color-line)]">
            {CATEGORIES.map((c) => (
              <div
                key={c.id}
                className="grid grid-cols-[auto_1fr] sm:grid-cols-[7.5rem_1fr_auto] gap-x-5 gap-y-1 py-5 border-b border-[var(--color-line)]"
              >
                <span className="mono text-[12px] tracking-[0.08em] text-[var(--color-accent-3)] pt-[2px]">
                  {c.id}
                </span>
                <div className="col-span-1">
                  <h2 className="text-[1.02rem] font-medium tracking-[-0.01em]">
                    {c.name}
                  </h2>
                  <p className="mt-1 text-[0.92rem] text-[var(--color-fg-2)] leading-[1.5]">
                    {c.what}
                  </p>
                </div>
                <span className="label self-start mt-[3px] whitespace-nowrap col-start-2 sm:col-start-3">
                  {c.module}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-lg border border-[var(--color-line)] p-6 bg-[var(--color-bg-2,transparent)]">
            <p className="text-[0.92rem] text-[var(--color-fg-2)] leading-[1.6]">
              Every finding on the public{" "}
              <Link href="/leaderboard" className="link">
                leaderboard
              </Link>{" "}
              and in every{" "}
              <Link href="/docs/findings-v1" className="link">
                findings.v1
              </Link>{" "}
              report is tagged with its CAST category alongside its OWASP / NIST
              / ATLAS mappings — the same taxonomy, applied to real MCP servers.
            </p>
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 mono text-[12px]">
              <Link
                href={`${CAPFRAME_GITHUB}/blob/main/CAST.md`}
                className="text-[var(--color-accent-3)] hover:text-[var(--color-fg)]"
              >
                → Full CAST v0.1 specification
              </Link>
              <Link href="/leaderboard" className="link">
                → See CAST on live scans
              </Link>
            </div>
          </div>

          <p className="mt-10 mono text-[11px] text-[var(--color-fg-3)] leading-[1.6]">
            Cite as: Capframe Agent Security Taxonomy (CAST) v0.1. Capframe,
            2026. https://capframe.ai/cast
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}
