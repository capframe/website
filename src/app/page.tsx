import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const INSTALL_CMD = "curl -fsSL capframe.ai/install | sh";
const GH = "https://github.com/capframe/capframe";

export default function Home() {
  return (
    <>
      <Header />
      <main className="px-6 sm:px-10 md:px-16 max-w-[1280px] mx-auto">
        <Hero />
        <Problem />
        <Modules />
        <Demo />
        <Compliance />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}

/* ──────────────────────────────────────────────────────────────────────── */
/* HEADER                                                                    */
/* ──────────────────────────────────────────────────────────────────────── */

function Header() {
  return (
    <header className="px-6 sm:px-10 md:px-16 max-w-[1280px] mx-auto pt-8 pb-2 flex items-center justify-between rise rise-1">
      <a href="/" className="mono text-[13px] tracking-[0.2em] uppercase">
        <span className="text-[var(--color-ink-3)]">[</span>
        <span className="px-1 text-ink">capframe</span>
        <span className="text-[var(--color-ink-3)]">]</span>
      </a>
      <nav className="hidden sm:flex items-center gap-8 mono text-[12px] tracking-[0.18em] uppercase text-[var(--color-ink-2)]">
        <a href="#modules" className="hover:text-ink transition-colors">Modules</a>
        <a href="#compliance" className="hover:text-ink transition-colors">Compliance</a>
        <a href="#pricing" className="hover:text-ink transition-colors">Pricing</a>
        <a href={GH} className="hover:text-ink transition-colors">GitHub ↗</a>
      </nav>
    </header>
  );
}

/* ──────────────────────────────────────────────────────────────────────── */
/* HERO                                                                      */
/* ──────────────────────────────────────────────────────────────────────── */

function Hero() {
  return (
    <section className="pt-16 sm:pt-24 md:pt-32 pb-16 sm:pb-20 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-end">
      <div className="lg:col-span-7 xl:col-span-7">
        <p className="label rise rise-1">§&nbsp;0.1 &nbsp;·&nbsp; Introduction</p>

        <h1 className="rise rise-2 mt-5 font-display font-light text-[clamp(2.6rem,7.2vw,5.6rem)] leading-[0.96] tracking-[-0.02em]">
          Your AI agents have <em className="text-[var(--color-amber-2)] not-italic font-normal italic">unbounded</em> authority.
        </h1>

        <h2 className="rise rise-3 mt-3 font-display font-normal italic text-[clamp(1.6rem,3.4vw,2.6rem)] leading-tight text-[var(--color-ink-2)]">
          Capframe fixes that.
        </h2>

        <p className="rise rise-4 mt-8 text-[1.05rem] sm:text-[1.12rem] leading-[1.7] text-[var(--color-ink-2)] max-w-[36rem]">
          Capframe is a three-module Rust platform for AI agents that call tools — discovery,
          scoped capability tokens, and runtime policy enforcement. MCP-native. Audit-mapped to
          OWASP&nbsp;LLM&nbsp;Top&nbsp;10, NIST&nbsp;AI&nbsp;RMF, and MITRE&nbsp;ATLAS. Open source.
        </p>

        <div className="rise rise-5 mt-10 flex flex-wrap items-center gap-3">
          <a
            href="#install"
            className="group inline-flex items-center gap-3 bg-ink text-paper px-5 py-3 mono text-[12px] tracking-[0.18em] uppercase hover:bg-[var(--color-amber-2)] transition-colors"
          >
            Install Capframe
            <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
          </a>
          <a
            href={GH}
            className="inline-flex items-center gap-2 px-3 py-3 mono text-[12px] tracking-[0.18em] uppercase text-[var(--color-ink-2)] hover:text-ink underline decoration-[var(--color-rule-2)] underline-offset-[6px] hover:decoration-ink"
          >
            View on GitHub ↗
          </a>
        </div>
      </div>

      {/* The "credential" / passport block */}
      <aside className="lg:col-span-5 xl:col-span-5 rise rise-4">
        <CredentialBlock />
      </aside>
    </section>
  );
}

function CredentialBlock() {
  return (
    <div className="bg-[var(--color-paper-3)] border border-[var(--color-rule-2)] p-6 sm:p-8 relative">
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-ink" />
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-[var(--color-rule)]" />

      <div className="flex items-baseline justify-between border-b border-[var(--color-rule)] pb-3">
        <span className="font-display text-[1.6rem] leading-none tracking-[-0.01em]">Capframe</span>
        <span className="mono text-[11px] tracking-[0.18em] uppercase text-[var(--color-ink-3)]">v0.1.0</span>
      </div>

      <dl className="mt-5 space-y-3 mono text-[12px] leading-relaxed">
        <ModuleRow no="i."   key1="FIND"  caption="Discovery" />
        <ModuleRow no="ii."  key1="BIND"  caption="Authority" />
        <ModuleRow no="iii." key1="GUARD" caption="Enforcement" />
      </dl>

      <div className="mt-7 pt-4 border-t border-[var(--color-rule)] flex items-baseline justify-between">
        <span className="mono text-[10.5px] tracking-[0.22em] uppercase text-[var(--color-ink-3)]">Issued</span>
        <span className="mono text-[11px] tracking-[0.18em] uppercase">MMXXVI</span>
      </div>

      <div className="mt-2 flex items-baseline justify-between">
        <span className="mono text-[10.5px] tracking-[0.22em] uppercase text-[var(--color-ink-3)]">Origin</span>
        <span className="mono text-[11px] tracking-[0.18em] uppercase">github.com/capframe</span>
      </div>

      <div className="mt-2 flex items-baseline justify-between">
        <span className="mono text-[10.5px] tracking-[0.22em] uppercase text-[var(--color-ink-3)]">License</span>
        <span className="mono text-[11px] tracking-[0.18em] uppercase">MIT</span>
      </div>

      {/* Faux "seal" mark */}
      <div className="mt-7 flex items-center gap-3">
        <div className="w-12 h-12 rounded-full border-[1.5px] border-[var(--color-amber-2)] flex items-center justify-center">
          <span className="font-display italic text-[var(--color-amber-2)] text-[1.3rem] leading-none">C</span>
        </div>
        <div className="mono text-[10px] tracking-[0.22em] uppercase text-[var(--color-ink-3)] leading-tight">
          Compliance-mapped<br />
          OWASP · NIST · ATLAS
        </div>
      </div>
    </div>
  );
}

function ModuleRow({ no, key1, caption }: { no: string; key1: string; caption: string }) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="text-[var(--color-amber-2)] w-8 shrink-0">{no}</span>
      <span className="text-ink font-semibold tracking-[0.12em]">{key1}</span>
      <span className="flex-1 border-b border-dotted border-[var(--color-rule-2)] mx-2" />
      <span className="text-[var(--color-ink-2)] italic font-[var(--font-body)]">{caption}</span>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────── */
/* THE PROBLEM                                                               */
/* ──────────────────────────────────────────────────────────────────────── */

function Problem() {
  return (
    <section className="border-t border-[var(--color-rule)] pt-16 pb-20">
      <p className="label">Abstract</p>
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <h3 className="lg:col-span-5 font-display font-normal text-[clamp(1.9rem,3.6vw,2.8rem)] leading-[1.08] tracking-[-0.015em]">
          The agent runs with <em className="not-italic text-[var(--color-rust)]">your</em> permissions. Not its own.
        </h3>
        <div className="lg:col-span-7 space-y-5 text-[1.05rem] leading-[1.75] text-[var(--color-ink-2)] max-w-[40rem]">
          <p className="dropcap">
            When an AI agent calls a tool — to read a database, refund a customer, send an email, write a
            file — <span className="italic">the agent is the principal.</span> There is no boundary between
            what the agent <span className="italic">should</span> be allowed to do and what it
            <span className="italic"> can</span> do. No scoped authority. No revocation. No audit trail
            of what each agent touched, and why.
          </p>
          <p className="pullquote">
            Capframe is the boundary.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────────── */
/* MODULES                                                                   */
/* ──────────────────────────────────────────────────────────────────────── */

function Modules() {
  return (
    <section id="modules" className="border-t border-[var(--color-rule)] pt-16 pb-24">
      <div className="flex items-baseline gap-4">
        <span className="section-no text-[1.4rem]">§ 1.0</span>
        <p className="label">The Three Modules</p>
      </div>
      <h3 className="mt-4 font-display font-light text-[clamp(2.2rem,4.4vw,3.4rem)] leading-[1.05] tracking-[-0.02em] max-w-[44rem]">
        Three modules. One CLI. Use them standalone or together.
      </h3>

      <ol className="mt-14 space-y-14">
        <ModuleEntry
          roman="i."
          name="Find"
          subtitle="Discovery"
          binary="capframe find"
          body={
            <>
              Walk every MCP server, every tool endpoint, every parameter your agent can touch.
              <code className="mono mx-1">Find</code> surfaces indirect-injection gaps and unconstrained
              inputs, then emits a structured findings file aligned to the OWASP LLM Top 10.
            </>
          }
          output="findings.json"
        />
        <ModuleEntry
          roman="ii."
          name="Bind"
          subtitle="Authority"
          binary="capframe bind"
          body={
            <>
              Mint capability tokens — macaroon-style, attenuable, revocable, ed25519 holder-of-key,
              with signed denial receipts (HMAC-SHA256). Each agent carries a scoped token; every
              call produces a tamper-evident receipt that doubles as compliance evidence.
            </>
          }
          output="cf_tok_…"
        />
        <ModuleEntry
          roman="iii."
          name="Guard"
          subtitle="Enforcement"
          binary="capframe guard"
          body={
            <>
              A deterministic runtime policy layer. Each tool call is evaluated against the token and the
              policy synthesized from Find's report — <span className="italic">before</span> the call
              reaches the tool. No LLM in the decision path. Single-digit-microsecond evaluation.
            </>
          }
          output="allow · deny · quarantine"
        />
      </ol>
    </section>
  );
}

function ModuleEntry({
  roman,
  name,
  subtitle,
  binary,
  body,
  output,
}: {
  roman: string;
  name: string;
  subtitle: string;
  binary: string;
  body: React.ReactNode;
  output: string;
}) {
  return (
    <li className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 group">
      <div className="lg:col-span-3 flex items-baseline gap-4">
        <span className="font-display italic text-[var(--color-amber-2)] text-[1.6rem]">{roman}</span>
        <div>
          <h4 className="font-display font-normal text-[clamp(2rem,3.2vw,2.6rem)] leading-none tracking-[-0.02em] text-ink">
            {name}
          </h4>
          <p className="mt-1 mono text-[11px] tracking-[0.22em] uppercase text-[var(--color-ink-3)]">
            {subtitle}
          </p>
        </div>
      </div>
      <div className="lg:col-span-7">
        <p className="text-[1.05rem] leading-[1.75] text-[var(--color-ink-2)] max-w-[36rem]">{body}</p>
        <p className="mt-4 mono text-[12px] text-[var(--color-ink-3)]">
          <span className="text-[var(--color-amber-2)]">$</span> {binary} …
        </p>
      </div>
      <div className="lg:col-span-2">
        <div className="mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-ink-3)]">Output</div>
        <div className="mt-2 mono text-[12px] text-ink border-l-2 border-[var(--color-amber)] pl-3 leading-snug break-words">
          {output}
        </div>
      </div>
    </li>
  );
}

/* ──────────────────────────────────────────────────────────────────────── */
/* DEMO                                                                      */
/* ──────────────────────────────────────────────────────────────────────── */

function Demo() {
  return (
    <section id="install" className="border-t border-[var(--color-rule)] pt-16 pb-20">
      <div className="flex items-baseline gap-4">
        <span className="section-no text-[1.4rem]">§ 2.0</span>
        <p className="label">Specimen Transcript</p>
      </div>
      <h3 className="mt-4 font-display font-light text-[clamp(2rem,3.8vw,2.8rem)] leading-[1.08] tracking-[-0.02em] max-w-[40rem]">
        What it looks like in the shell.
      </h3>

      <pre className="mt-10 bg-[var(--color-ink)] text-[#e7dec8] border border-[var(--color-ink)] p-6 sm:p-8 overflow-x-auto leading-[1.7] text-[12.5px] sm:text-[13.5px] rounded-none">
{`$ capframe find ./my-mcp-server.toml
✓ Mapped 14 tools across 2 MCP servers
⚠ 3 tools accept user input without parameter constraints (LLM01)
⚠ 1 tool has indirect-injection surface (LLM01, ATLAS T0051)
→ findings written to ./capframe.findings.json

$ capframe bind --agent shopify-bot \\
                --tools "order.read, refund.write" \\
                --max-refund 50.00 \\
                --ttl 24h
✓ Token minted: cf_tok_a91f4e...
  Holder:    ed25519 / shopify-bot
  Scope:     2 tools, $50 refund ceiling
  Expires:   2026-05-18T08:14:00Z
  Revoke:    capframe revoke cf_tok_a91f4e

$ capframe guard --policy ./policy.toml --port 8783
✓ Sentry listening on :8783
✓ Policy synced: 14 rules, 3 categories
✓ Watching for tool calls...

$ capframe report --format html --out ./report.html
✓ Report written
   OWASP LLM Top 10:  4/10 covered, 2 findings open
   NIST AI RMF:       Govern ✓  Map ✓  Measure ✓  Manage ✓
   MITRE ATLAS:       2 techniques flagged, 0 active exploits`}
      </pre>

      <p className="mt-6 mono text-[12px] text-[var(--color-ink-3)]">
        <span className="text-[var(--color-amber-2)]">$</span> {INSTALL_CMD}
      </p>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────────── */
/* COMPLIANCE                                                                */
/* ──────────────────────────────────────────────────────────────────────── */

function Compliance() {
  const frameworks = [
    {
      name: "OWASP LLM",
      version: "Top 10 (2025)",
      lines: ["LLM01 prompt injection", "LLM02 insecure output", "LLM07 insecure plugin design", "LLM08 excessive agency"],
    },
    {
      name: "NIST AI RMF",
      version: "1.0",
      lines: ["GOVERN", "MAP", "MEASURE", "MANAGE"],
    },
    {
      name: "MITRE ATLAS",
      version: "v4.7",
      lines: ["TA0043 reconnaissance", "TA0006 credential access", "TA0040 impact", "TA0007 discovery"],
    },
  ];

  return (
    <section id="compliance" className="border-t border-[var(--color-rule)] pt-16 pb-20">
      <div className="flex items-baseline gap-4">
        <span className="section-no text-[1.4rem]">§ 3.0</span>
        <p className="label">Compliance</p>
      </div>
      <h3 className="mt-4 font-display font-light text-[clamp(2rem,3.8vw,2.8rem)] leading-[1.08] tracking-[-0.02em] max-w-[40rem]">
        The artifact your security team can hand to an auditor.
      </h3>
      <p className="mt-4 max-w-[40rem] text-[1.02rem] leading-[1.7] text-[var(--color-ink-2)]">
        Every run produces an audit-ready report mapped to the three frameworks regulated buyers
        already require:
      </p>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-px bg-[var(--color-rule-2)] border border-[var(--color-rule-2)]">
        {frameworks.map((f) => (
          <article key={f.name} className="bg-[var(--color-paper-3)] p-6 sm:p-7">
            <div className="flex items-baseline justify-between">
              <h4 className="font-display font-normal text-[1.4rem] leading-none">{f.name}</h4>
              <span className="mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-ink-3)]">{f.version}</span>
            </div>
            <ul className="mt-5 space-y-1.5 mono text-[12px] text-[var(--color-ink-2)] leading-relaxed">
              {f.lines.map((l) => (
                <li key={l} className="flex gap-2 items-baseline">
                  <span className="text-[var(--color-amber-2)]">·</span>
                  <span>{l}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────────── */
/* PRICING                                                                   */
/* ──────────────────────────────────────────────────────────────────────── */

function Pricing() {
  const tiers = [
    {
      name: "Free",
      price: "$0",
      cadence: "self-hosted",
      blurb: "All three modules. Local CLI. Local findings, local tokens, local Guard. The full OWASP / NIST / ATLAS report generator. MIT license.",
      features: ["All three modules", "Local-first CLI", "Full report generator", "Run anywhere"],
      cta: "Install",
      ctaHref: "#install",
    },
    {
      name: "Pro",
      price: "$199",
      cadence: "per month",
      blurb: "Hosted dashboard with findings history, scheduled scans, and alerts. For AI teams shipping agents at velocity.",
      features: ["Hosted dashboard", "Findings history & diffing", "Scheduled scans", "Slack / Discord alerts", "Up to 10 agents"],
      cta: "Start trial",
      ctaHref: "mailto:hello@capframe.ai?subject=Capframe%20Pro%20trial",
    },
    {
      name: "Enterprise",
      price: "Talk",
      cadence: "to us",
      blurb: "On-prem / VPC, SSO, audit logs, signed compliance reports, SLA, dedicated channel — for regulated buyers in financial services, healthcare, defense.",
      features: ["SSO + audit logs", "On-prem / VPC deploy", "Signed compliance reports", "SLA + Slack channel", "Unlimited agents"],
      cta: "Contact",
      ctaHref: "mailto:hello@capframe.ai?subject=Capframe%20Enterprise",
    },
  ];

  return (
    <section id="pricing" className="border-t border-[var(--color-rule)] pt-16 pb-20">
      <div className="flex items-baseline gap-4">
        <span className="section-no text-[1.4rem]">§ 4.0</span>
        <p className="label">Pricing</p>
      </div>
      <h3 className="mt-4 font-display font-light text-[clamp(2rem,3.8vw,2.8rem)] leading-[1.08] tracking-[-0.02em] max-w-[40rem]">
        Open source. Hosted when you need it.
      </h3>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--color-rule-2)] border border-[var(--color-rule-2)]">
        {tiers.map((t, i) => (
          <div key={t.name} className="bg-[var(--color-paper-3)] p-7 flex flex-col">
            <div className="flex items-baseline justify-between border-b border-[var(--color-rule)] pb-4">
              <h4 className="font-display font-normal text-[1.6rem] leading-none">{t.name}</h4>
              <div className="text-right">
                <div className="font-display font-light text-[1.9rem] leading-none">{t.price}</div>
                <div className="mono text-[10px] tracking-[0.18em] uppercase text-[var(--color-ink-3)] mt-1">{t.cadence}</div>
              </div>
            </div>
            <p className="mt-5 text-[0.96rem] leading-[1.65] text-[var(--color-ink-2)]">{t.blurb}</p>
            <ul className="mt-5 space-y-2 mono text-[12px] text-[var(--color-ink-2)] flex-1">
              {t.features.map((f) => (
                <li key={f} className="flex gap-2 items-baseline">
                  <span className="text-[var(--color-amber-2)] shrink-0">·</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <a
              href={t.ctaHref}
              className={`mt-7 inline-flex items-center justify-center gap-2 px-5 py-3 mono text-[11px] tracking-[0.22em] uppercase transition-colors
              ${i === 0
                ? "bg-ink text-paper hover:bg-[var(--color-amber-2)]"
                : i === 1
                ? "border border-ink text-ink hover:bg-ink hover:text-paper"
                : "border border-[var(--color-rule-2)] text-ink hover:border-ink"}`}
            >
              {t.cta} →
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────────── */
/* FAQ                                                                       */
/* ──────────────────────────────────────────────────────────────────────── */

function FAQ() {
  const qa = [
    {
      q: "Does this only work with MCP?",
      a: "Today, yes — Capframe is built around the Model Context Protocol. Adapter support for OpenAI function calling, Anthropic tool use, and LangGraph is on the roadmap.",
    },
    {
      q: "Does my agent data leave my environment?",
      a: "No. The CLI is local-first. The Pro / Enterprise hosted control plane is opt-in and stores only the metadata you choose to sync.",
    },
    {
      q: "Is the runtime Guard fast enough for production?",
      a: "Yes. Guard is a Rust process; policy evaluation is single-digit microseconds. There is no LLM in the decision path — every allow/deny is deterministic.",
    },
    {
      q: "Why three separate modules?",
      a: "Different teams adopt them at different speeds. Security teams often start with Find. AI engineers usually start with Guard. The capability-token layer (Bind) is for teams ready to commit to a permission model.",
    },
    {
      q: "Why open source?",
      a: "Security infrastructure you can't read isn't trustworthy. The code your boundaries depend on should be inspectable.",
    },
  ];

  return (
    <section className="border-t border-[var(--color-rule)] pt-16 pb-20">
      <div className="flex items-baseline gap-4">
        <span className="section-no text-[1.4rem]">§ 5.0</span>
        <p className="label">Common Questions</p>
      </div>
      <h3 className="mt-4 font-display font-light text-[clamp(2rem,3.8vw,2.8rem)] leading-[1.08] tracking-[-0.02em] max-w-[40rem]">
        What people ask before they install.
      </h3>

      <dl className="mt-12 space-y-10">
        {qa.map((item, i) => (
          <div key={item.q} className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-10">
            <dt className="lg:col-span-4 flex gap-3 items-baseline">
              <span className="font-display italic text-[var(--color-amber-2)] text-[1.1rem] shrink-0">
                Q.{(i + 1).toString().padStart(2, "0")}
              </span>
              <span className="font-display text-[1.2rem] leading-snug text-ink">{item.q}</span>
            </dt>
            <dd className="lg:col-span-8 text-[1.02rem] leading-[1.75] text-[var(--color-ink-2)] max-w-[40rem]">
              {item.a}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────────── */
/* FOOTER                                                                    */
/* ──────────────────────────────────────────────────────────────────────── */

function Footer() {
  return (
    <footer className="mt-20 border-t-2 border-[var(--color-rule-2)] bg-[var(--color-paper-2)]">
      <div className="px-6 sm:px-10 md:px-16 max-w-[1280px] mx-auto py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-6">
            <div className="font-display font-light text-[clamp(2.2rem,4vw,3rem)] leading-[1.05] tracking-[-0.02em] max-w-[28rem]">
              Install Capframe in 90 seconds.
            </div>
            <p className="mt-6 mono text-[12.5px] text-[var(--color-ink-2)] bg-[var(--color-paper-3)] border border-[var(--color-rule)] p-4 inline-block">
              <span className="text-[var(--color-amber-2)]">$</span> {INSTALL_CMD}
            </p>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <FooterCol heading="Project" links={[
              { label: "GitHub", href: GH },
              { label: "Docs", href: "/docs" },
              { label: "Schema", href: `${GH}/blob/main/schemas/findings.v1.json` },
              { label: "Releases", href: `${GH}/releases` },
            ]} />
            <FooterCol heading="Pricing" links={[
              { label: "Free", href: "#pricing" },
              { label: "Pro", href: "#pricing" },
              { label: "Enterprise", href: "mailto:hello@capframe.ai" },
            ]} />
            <FooterCol heading="Contact" links={[
              { label: "hello@", href: "mailto:hello@capframe.ai" },
              { label: "security@", href: "mailto:security@capframe.ai" },
            ]} />
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-[var(--color-rule)] flex flex-wrap items-baseline justify-between gap-4 mono text-[11px] tracking-[0.18em] uppercase text-[var(--color-ink-3)]">
          <div>
            <span className="text-ink font-semibold">Capframe</span>
            <span className="mx-3">·</span>
            <span>v0.1.0</span>
            <span className="mx-3">·</span>
            <span>MIT</span>
            <span className="mx-3">·</span>
            <span>MMXXVI</span>
          </div>
          <div className="italic font-display normal-case tracking-[0.04em] text-[var(--color-amber-2)] text-[14px]">
            Find. Bind. Guard.
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  heading,
  links,
}: {
  heading: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <p className="mono text-[10.5px] tracking-[0.22em] uppercase text-[var(--color-ink-3)] mb-4">
        {heading}
      </p>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              className="text-[0.95rem] text-[var(--color-ink-2)] hover:text-ink underline decoration-[var(--color-rule-2)] hover:decoration-ink underline-offset-[5px]"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
