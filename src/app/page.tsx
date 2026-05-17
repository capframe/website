import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const INSTALL = "curl -fsSL capframe.ai/install | sh";
const GH = "https://github.com/capframe/capframe";

export default function Home() {
  return (
    <>
      <StatusBar />
      <Header />
      <main className="px-6 sm:px-10 lg:px-16">
        <Hero />
        <Flow />
        <Modules />
        <Compliance />
        <Demo />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* STATUS BAR                                                                  */
/* ────────────────────────────────────────────────────────────────────────── */

function StatusBar() {
  return (
    <div className="border-b border-[var(--color-line)] bg-[var(--color-bg-2)]/60 backdrop-blur supports-[backdrop-filter]:bg-[var(--color-bg-2)]/40">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-2.5 flex items-center justify-between mono text-[10.5px] tracking-[0.18em] uppercase text-[var(--color-fg-3)]">
        <div className="flex items-center gap-6">
          <span className="inline-flex items-center gap-2">
            <span className="pulse" /> v0.1.0 · live
          </span>
          <span className="hidden sm:inline">MIT</span>
          <span className="hidden sm:inline">Rust 1.78+</span>
          <span className="hidden md:inline">MCP-native</span>
        </div>
        <div className="hidden sm:flex items-center gap-5">
          <span>OWASP LLM</span>
          <span className="text-[var(--color-fg-4)]">·</span>
          <span>NIST AI RMF</span>
          <span className="text-[var(--color-fg-4)]">·</span>
          <span>MITRE ATLAS</span>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* HEADER                                                                      */
/* ────────────────────────────────────────────────────────────────────────── */

function Header() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-[var(--color-bg)]/70 border-b border-[var(--color-line)]/80">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 h-14 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5 group">
          <span className="w-7 h-7 rounded border border-[var(--color-accent)]/50 flex items-center justify-center font-mono text-[14px] text-[var(--color-accent)] group-hover:shadow-[0_0_16px_rgba(0,245,160,0.4)] transition-shadow">
            C
          </span>
          <span className="mono text-[13px] tracking-[0.16em] uppercase">capframe</span>
        </a>
        <nav className="hidden md:flex items-center gap-7 mono text-[12px] tracking-[0.12em] uppercase text-[var(--color-fg-2)]">
          <a href="#modules" className="hover:text-fg transition-colors">Modules</a>
          <a href="#compliance" className="hover:text-fg transition-colors">Compliance</a>
          <a href="#install" className="hover:text-fg transition-colors">Install</a>
          <a href="#pricing" className="hover:text-fg transition-colors">Pricing</a>
          <a href={GH} className="hover:text-fg transition-colors">GitHub ↗</a>
        </nav>
        <a href="#install" className="md:hidden mono text-[12px] tracking-[0.12em] uppercase text-[var(--color-accent)]">
          Install ↗
        </a>
      </div>
    </header>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* HERO                                                                        */
/* ────────────────────────────────────────────────────────────────────────── */

function Hero() {
  return (
    <section className="max-w-[1440px] mx-auto pt-20 sm:pt-28 lg:pt-32 pb-24 lg:pb-32 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
      <div className="lg:col-span-6 xl:col-span-7">
        <div className="rise rise-1 flex items-center gap-2 mb-7">
          <span className="badge-ok"><span className="pulse" /> v0.1.0 released</span>
          <span className="mono text-[11px] tracking-[0.16em] uppercase text-[var(--color-fg-3)]">
            AI agent security
          </span>
        </div>

        <h1 className="rise rise-2 text-[clamp(2.6rem,6vw,4.8rem)] leading-[1.02] font-semibold tracking-[-0.03em]">
          Capability security<br />
          for{" "}
          <span className="text-[var(--color-accent)] glow">AI agents</span>.
        </h1>

        <p className="rise rise-3 mt-7 text-[1.05rem] sm:text-[1.15rem] leading-[1.65] text-[var(--color-fg-2)] max-w-[34rem]">
          Three Rust modules for AI agents that call tools.{" "}
          <span className="text-fg">Find</span> what they touch.{" "}
          <span className="text-fg">Bind</span> their authority.{" "}
          <span className="text-fg">Guard</span> every call.{" "}
          <span className="text-[var(--color-fg-3)]">
            MCP-native. Audit-mapped to OWASP LLM, NIST AI RMF, MITRE ATLAS. MIT licensed.
          </span>
        </p>

        <div className="rise rise-4 mt-10 flex flex-wrap items-center gap-3">
          <a href="#install" className="btn-primary">
            Install Capframe
            <span aria-hidden>→</span>
          </a>
          <a href={GH} className="btn-ghost">
            <GitHubMark /> Star on GitHub
          </a>
        </div>

        <div className="rise rise-5 mt-8">
          <CopyableCommand cmd={INSTALL} />
        </div>
      </div>

      <div className="lg:col-span-6 xl:col-span-5 rise rise-3">
        <HeroTerminal />
      </div>
    </section>
  );
}

function HeroTerminal() {
  const ok = "text-[var(--color-accent)]";
  const dim = "text-[var(--color-fg-3)]";
  return (
    <div className="terminal">
      <div className="terminal-header">
        <span className="terminal-dot" />
        <span className="terminal-dot" />
        <span className="terminal-dot" />
        <span className="ml-3 mono text-[11px] text-[var(--color-fg-3)] tracking-wide">
          ~/agents — capframe doctor
        </span>
      </div>
      <pre className="mono text-[12.5px] sm:text-[13px] leading-[1.7] p-5 sm:p-7 text-fg overflow-x-auto">
{`$ capframe doctor

`}<span className={ok}>{`[`}<span className="glow">ok</span>{`]`}</span>{`   find       discovery       v0.1.0
`}<span className={ok}>{`[ok]`}</span>{`   bind       authority       v0.1.0
`}<span className={ok}>{`[ok]`}</span>{`   guard      enforcement     v0.1.0
`}<span className={ok}>{`[ok]`}</span>{`   report     compliance      v0.1.0

`}<span className={dim}>{`→ all systems ready
→ 2 MCP servers detected
→ 14 tools mapped
→ 0 unbounded agents`}</span>
      </pre>
    </div>
  );
}

function CopyableCommand({ cmd }: { cmd: string }) {
  return (
    <div className="inline-flex items-stretch border border-[var(--color-line-2)] rounded-md overflow-hidden bg-[var(--color-bg-2)]">
      <div className="px-3 flex items-center mono text-[12px] text-[var(--color-accent)] border-r border-[var(--color-line)]">
        $
      </div>
      <code className="px-4 py-2.5 mono text-[12.5px] text-fg whitespace-nowrap">{cmd}</code>
    </div>
  );
}

function GitHubMark() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden>
      <path d="M12 .5C5.7.5.5 5.7.5 12.1c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.2.8-.5v-2.1c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.4-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2.9-.3 1.9-.4 2.9-.4s2 .1 2.9.4c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.7.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.6.8.5 4.6-1.5 7.9-5.9 7.9-10.9C23.5 5.7 18.3.5 12 .5z" />
    </svg>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* FLOW DIAGRAM                                                                */
/* ────────────────────────────────────────────────────────────────────────── */

function Flow() {
  const steps = [
    { tag: "01", name: "Find",   sub: "Discovery",   out: "findings.json",  desc: "Map the tool surface. Catch indirect-injection gaps." },
    { tag: "02", name: "Bind",   sub: "Authority",   out: "cf_tok_a91…",     desc: "Mint scoped, revocable capability tokens." },
    { tag: "03", name: "Guard",  sub: "Enforcement", out: "allow / deny",    desc: "Evaluate every tool call against policy at runtime." },
    { tag: "04", name: "Report", sub: "Compliance",  out: "report.html",     desc: "Audit-ready artifact: OWASP / NIST / ATLAS." },
  ];
  return (
    <section className="max-w-[1440px] mx-auto py-20 lg:py-24 border-t border-[var(--color-line)]">
      <div className="flex items-baseline gap-3 mb-4">
        <span className="mono text-[12px] text-[var(--color-accent)]">§ 01</span>
        <span className="label">The pipeline</span>
      </div>
      <h2 className="text-[clamp(1.9rem,3.4vw,2.7rem)] font-semibold tracking-[-0.025em] max-w-[44rem]">
        Four stages. One binary. No LLM in the decision path.
      </h2>

      <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 relative">
        {steps.map((s, i) => (
          <div key={s.tag} className="relative">
            <article className="card h-full p-5 flex flex-col group hover:border-[var(--color-accent)]/40 hover:shadow-[0_0_40px_-12px_rgba(0,245,160,0.25)]">
              <div className="flex items-baseline justify-between">
                <span className="mono text-[11px] text-[var(--color-fg-4)] tracking-[0.18em]">{s.tag}</span>
                <span className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-fg-3)]">{s.sub}</span>
              </div>
              <div className="mt-5 text-[1.6rem] font-semibold tracking-[-0.02em] group-hover:text-[var(--color-accent)] transition-colors">
                {s.name}
              </div>
              <p className="mt-3 text-[0.94rem] leading-snug text-[var(--color-fg-2)] flex-1">{s.desc}</p>
              <div className="mt-5 pt-4 border-t border-[var(--color-line)] mono text-[11.5px] text-[var(--color-accent-3)]">
                → {s.out}
              </div>
            </article>
            {/* connector arrow */}
            {i < steps.length - 1 && (
              <div className="hidden lg:flex absolute top-1/2 -right-3 -translate-y-1/2 z-10 items-center justify-center w-6 h-6 text-[var(--color-fg-4)]">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                  <path d="M1 7h12m0 0L8 2m5 5L8 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* MODULES                                                                     */
/* ────────────────────────────────────────────────────────────────────────── */

function Modules() {
  const mods = [
    {
      tag: "02.1",
      name: "Find",
      role: "Discovery",
      desc: "Walks every MCP server, every tool endpoint, every parameter your agent can touch. Surfaces indirect-injection gaps and unconstrained inputs, then emits a structured findings file aligned to the OWASP LLM Top 10.",
      code: `$ capframe find ./mcp-server.toml
✓ mapped 14 tools across 2 mcp servers
⚠ 3 tools accept input without constraints (LLM01)
→ ./capframe.findings.json`,
    },
    {
      tag: "02.2",
      name: "Bind",
      role: "Authority",
      desc: "Mints capability tokens — macaroon-style, attenuable, revocable, ed25519 holder-of-key, with signed denial receipts (HMAC-SHA256). Each agent carries a scoped token; every call produces a tamper-evident receipt that doubles as compliance evidence.",
      code: `$ capframe bind --agent shopify-bot \\
                --tools "order.read, refund.write" \\
                --max-refund 50.00 --ttl 24h
✓ token minted: cf_tok_a91f4e…
  scope:  2 tools, $50 ceiling
  expires: 2026-05-18T08:14:00Z`,
    },
    {
      tag: "02.3",
      name: "Guard",
      role: "Enforcement",
      desc: "A deterministic runtime policy layer. Each tool call is evaluated against the token and the policy synthesized from Find's report — before the call reaches the tool. No LLM in the decision path. Single-digit-microsecond evaluation.",
      code: `$ capframe guard --policy ./policy.toml
✓ sentry listening on :8783
✓ policy synced: 14 rules, 3 categories
✓ watching for tool calls…`,
    },
  ];
  return (
    <section id="modules" className="max-w-[1440px] mx-auto py-20 lg:py-24 border-t border-[var(--color-line)]">
      <div className="flex items-baseline gap-3 mb-4">
        <span className="mono text-[12px] text-[var(--color-accent)]">§ 02</span>
        <span className="label">The three modules</span>
      </div>
      <h2 className="text-[clamp(1.9rem,3.4vw,2.7rem)] font-semibold tracking-[-0.025em] max-w-[44rem]">
        Standalone, or composed.
      </h2>
      <p className="mt-4 text-[1.02rem] text-[var(--color-fg-2)] max-w-[40rem]">
        Each module ships as its own Rust crate, its own CLI subcommand, and its own GitHub repo.
        Run them independently or wire them together through a shared findings schema.
      </p>

      <div className="mt-14 space-y-6 lg:space-y-8">
        {mods.map((m) => (
          <article key={m.tag} className="card p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 group hover:border-[var(--color-accent)]/30">
            <div className="lg:col-span-4">
              <div className="flex items-baseline gap-3">
                <span className="mono text-[11px] text-[var(--color-fg-4)] tracking-[0.18em]">{m.tag}</span>
                <span className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-accent)]">{m.role}</span>
              </div>
              <h3 className="mt-3 text-[2.4rem] font-semibold tracking-[-0.025em] leading-none">
                {m.name}
              </h3>
              <p className="mt-5 text-[0.98rem] leading-[1.7] text-[var(--color-fg-2)]">{m.desc}</p>
            </div>
            <div className="lg:col-span-8">
              <div className="terminal">
                <div className="terminal-header">
                  <span className="terminal-dot" />
                  <span className="terminal-dot" />
                  <span className="terminal-dot" />
                  <span className="ml-3 mono text-[11px] text-[var(--color-fg-3)] tracking-wide">
                    capframe {m.name.toLowerCase()}
                  </span>
                </div>
                <pre className="mono text-[12.5px] leading-[1.65] p-5 sm:p-6 text-fg overflow-x-auto">
{m.code}
                </pre>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* COMPLIANCE                                                                  */
/* ────────────────────────────────────────────────────────────────────────── */

function Compliance() {
  const frameworks = [
    { name: "OWASP LLM",     version: "Top 10 — 2025", lines: ["LLM01  prompt injection", "LLM02  insecure output", "LLM07  insecure plugin", "LLM08  excessive agency"] },
    { name: "NIST AI RMF",   version: "v1.0",          lines: ["GOVERN", "MAP", "MEASURE", "MANAGE"] },
    { name: "MITRE ATLAS",   version: "v4.7",          lines: ["TA0043  reconnaissance", "TA0006  credential access", "TA0040  impact", "TA0007  discovery"] },
  ];
  return (
    <section id="compliance" className="max-w-[1440px] mx-auto py-20 lg:py-24 border-t border-[var(--color-line)]">
      <div className="flex items-baseline gap-3 mb-4">
        <span className="mono text-[12px] text-[var(--color-accent)]">§ 03</span>
        <span className="label">Compliance</span>
      </div>
      <h2 className="text-[clamp(1.9rem,3.4vw,2.7rem)] font-semibold tracking-[-0.025em] max-w-[44rem]">
        The artifact your security team hands to an auditor.
      </h2>
      <p className="mt-4 text-[1.02rem] text-[var(--color-fg-2)] max-w-[40rem]">
        Every Capframe run produces evidence mapped to the three frameworks regulated buyers already require.
        Run <code className="text-[var(--color-accent-3)]">capframe report</code> to export HTML or PDF.
      </p>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
        {frameworks.map((f) => (
          <article key={f.name} className="card p-6 hover:border-[var(--color-accent)]/40 hover:shadow-[0_0_40px_-12px_rgba(0,245,160,0.2)]">
            <div className="flex items-baseline justify-between border-b border-[var(--color-line)] pb-3">
              <h3 className="text-[1.25rem] font-semibold">{f.name}</h3>
              <span className="mono text-[10px] tracking-[0.18em] uppercase text-[var(--color-fg-3)]">{f.version}</span>
            </div>
            <ul className="mt-5 space-y-2 mono text-[12.5px] text-[var(--color-fg-2)]">
              {f.lines.map((l) => (
                <li key={l} className="flex gap-3">
                  <span className="text-[var(--color-accent)] shrink-0">✓</span>
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

/* ────────────────────────────────────────────────────────────────────────── */
/* DEMO                                                                        */
/* ────────────────────────────────────────────────────────────────────────── */

function Demo() {
  return (
    <section id="install" className="max-w-[1440px] mx-auto py-20 lg:py-24 border-t border-[var(--color-line)]">
      <div className="flex items-baseline gap-3 mb-4">
        <span className="mono text-[12px] text-[var(--color-accent)]">§ 04</span>
        <span className="label">Specimen transcript</span>
      </div>
      <h2 className="text-[clamp(1.9rem,3.4vw,2.7rem)] font-semibold tracking-[-0.025em] max-w-[44rem]">
        What it looks like in the shell.
      </h2>

      <div className="mt-10 terminal">
        <div className="terminal-header">
          <span className="terminal-dot" />
          <span className="terminal-dot" />
          <span className="terminal-dot" />
          <span className="ml-3 mono text-[11px] text-[var(--color-fg-3)] tracking-wide">
            ~/agents — capframe — 80×24
          </span>
        </div>
        <pre className="mono text-[12.5px] sm:text-[13px] leading-[1.75] p-5 sm:p-8 text-fg overflow-x-auto">
{`$ capframe find ./my-mcp-server.toml
`}<span className="text-[var(--color-accent)]">✓</span>{` mapped 14 tools across 2 MCP servers
`}<span className="text-[var(--color-amber)]">⚠</span>{` 3 tools accept input without constraints `}<span className="text-[var(--color-fg-3)]">(LLM01)</span>{`
`}<span className="text-[var(--color-amber)]">⚠</span>{` 1 tool has indirect-injection surface `}<span className="text-[var(--color-fg-3)]">(LLM01, ATLAS T0051)</span>{`
`}<span className="text-[var(--color-fg-3)]">→ findings written to ./capframe.findings.json</span>{`

$ capframe bind --agent shopify-bot \\
                --tools "order.read, refund.write" \\
                --max-refund 50.00 --ttl 24h
`}<span className="text-[var(--color-accent)]">✓</span>{` token minted: `}<span className="text-[var(--color-accent-3)]">cf_tok_a91f4e…</span>{`
  holder:    ed25519 / shopify-bot
  scope:     2 tools, $50 refund ceiling
  expires:   2026-05-18T08:14:00Z
  revoke:    capframe revoke cf_tok_a91f4e

$ capframe guard --policy ./policy.toml --port 8783
`}<span className="text-[var(--color-accent)]">✓</span>{` sentry listening on :8783
`}<span className="text-[var(--color-accent)]">✓</span>{` policy synced: 14 rules, 3 categories
`}<span className="text-[var(--color-accent)]">✓</span>{` watching for tool calls…

$ capframe report --format html --out ./report.html
`}<span className="text-[var(--color-accent)]">✓</span>{` report written
   `}<span className="text-[var(--color-fg-2)]">OWASP LLM Top 10:</span>{`  4/10 covered, 2 findings open
   `}<span className="text-[var(--color-fg-2)]">NIST AI RMF:</span>{`       Govern `}<span className="text-[var(--color-accent)]">✓</span>{`  Map `}<span className="text-[var(--color-accent)]">✓</span>{`  Measure `}<span className="text-[var(--color-accent)]">✓</span>{`  Manage `}<span className="text-[var(--color-accent)]">✓</span>{`
   `}<span className="text-[var(--color-fg-2)]">MITRE ATLAS:</span>{`       2 techniques flagged, 0 active exploits`}
        </pre>
      </div>

      <div className="mt-8 flex items-center gap-4 flex-wrap">
        <CopyableCommand cmd={INSTALL} />
        <a href={GH} className="mono text-[12px] tracking-[0.12em] uppercase text-[var(--color-fg-2)] hover:text-[var(--color-accent)] underline decoration-[var(--color-line-2)] underline-offset-[6px] hover:decoration-[var(--color-accent)]">
          Read the source →
        </a>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* PRICING                                                                     */
/* ────────────────────────────────────────────────────────────────────────── */

function Pricing() {
  const tiers = [
    {
      name: "Free", price: "$0", cadence: "self-hosted",
      blurb: "All three modules. Local CLI. Full OWASP / NIST / ATLAS report generator. MIT license.",
      features: ["All three modules", "Local-first CLI", "Full report generator", "Run anywhere"],
      cta: "Install", ctaHref: "#install", featured: false,
    },
    {
      name: "Pro", price: "$199", cadence: "per month",
      blurb: "Hosted dashboard, findings history, scheduled scans, Slack alerts. For AI teams shipping agents at velocity.",
      features: ["Hosted dashboard", "Findings history + diffing", "Scheduled scans", "Slack / Discord alerts", "Up to 10 agents"],
      cta: "Start trial", ctaHref: "mailto:hello@capframe.ai?subject=Capframe%20Pro%20trial", featured: true,
    },
    {
      name: "Enterprise", price: "Talk", cadence: "to us",
      blurb: "On-prem / VPC. SSO, audit logs, signed compliance reports, SLA. For regulated buyers in fintech, healthcare, defence.",
      features: ["SSO + audit logs", "On-prem / VPC deploy", "Signed compliance reports", "SLA + Slack channel", "Unlimited agents"],
      cta: "Contact", ctaHref: "mailto:hello@capframe.ai?subject=Capframe%20Enterprise", featured: false,
    },
  ];
  return (
    <section id="pricing" className="max-w-[1440px] mx-auto py-20 lg:py-24 border-t border-[var(--color-line)]">
      <div className="flex items-baseline gap-3 mb-4">
        <span className="mono text-[12px] text-[var(--color-accent)]">§ 05</span>
        <span className="label">Pricing</span>
      </div>
      <h2 className="text-[clamp(1.9rem,3.4vw,2.7rem)] font-semibold tracking-[-0.025em] max-w-[44rem]">
        Open source. Hosted when you need it.
      </h2>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
        {tiers.map((t) => (
          <div key={t.name}
               className={`card p-7 flex flex-col relative ${t.featured ? "border-[var(--color-accent)]/50 shadow-[0_0_60px_-20px_rgba(0,245,160,0.4)]" : ""}`}>
            {t.featured && (
              <div className="absolute -top-3 left-7 px-2 py-0.5 bg-[var(--color-accent)] text-[#04241a] mono text-[10px] tracking-[0.18em] uppercase rounded">
                Most popular
              </div>
            )}
            <div className="flex items-baseline justify-between pb-5 border-b border-[var(--color-line)]">
              <h3 className="text-[1.4rem] font-semibold">{t.name}</h3>
              <div className="text-right">
                <div className="text-[1.7rem] font-semibold leading-none tracking-[-0.02em]">{t.price}</div>
                <div className="mono text-[10px] tracking-[0.16em] uppercase text-[var(--color-fg-3)] mt-1">{t.cadence}</div>
              </div>
            </div>
            <p className="mt-5 text-[0.95rem] leading-[1.65] text-[var(--color-fg-2)]">{t.blurb}</p>
            <ul className="mt-5 space-y-2 text-[13px] flex-1">
              {t.features.map((f) => (
                <li key={f} className="flex gap-3 text-[var(--color-fg-2)]">
                  <span className="text-[var(--color-accent)] shrink-0">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <a href={t.ctaHref}
               className={`mt-7 inline-flex items-center justify-center gap-2 px-5 py-3 mono text-[11px] tracking-[0.18em] uppercase rounded-md transition-all
               ${t.featured
                 ? "btn-primary"
                 : "border border-[var(--color-line-2)] text-fg hover:bg-[var(--color-bg-3)] hover:border-[var(--color-fg-3)]"}`}>
              {t.cta} →
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* FAQ                                                                         */
/* ────────────────────────────────────────────────────────────────────────── */

function FAQ() {
  const qa = [
    { q: "Does this only work with MCP?",
      a: "Today, yes — Capframe is built around the Model Context Protocol. Adapter support for OpenAI function calling, Anthropic tool use, and LangGraph is on the roadmap." },
    { q: "Does my agent data leave my environment?",
      a: "No. The CLI is local-first. The Pro / Enterprise hosted control plane is opt-in and stores only the metadata you choose to sync." },
    { q: "Is the runtime Guard fast enough for production?",
      a: "Yes. Guard is a Rust process; policy evaluation is single-digit microseconds. There is no LLM in the decision path — every allow/deny is deterministic." },
    { q: "Why three separate modules?",
      a: "Different teams adopt them at different speeds. Security teams often start with Find. AI engineers usually start with Guard. The capability-token layer (Bind) is for teams ready to commit to a permission model." },
    { q: "Why open source?",
      a: "Security infrastructure you can't read isn't trustworthy. The code your boundaries depend on should be inspectable." },
    { q: "Which agent frameworks does Capframe support today?",
      a: "Anything that speaks MCP. That covers Claude Desktop, Cursor, Continue, Cline, LangGraph (via the MCP bridge), and most agentic Rust/Python frameworks." },
  ];
  return (
    <section className="max-w-[1440px] mx-auto py-20 lg:py-24 border-t border-[var(--color-line)]">
      <div className="flex items-baseline gap-3 mb-4">
        <span className="mono text-[12px] text-[var(--color-accent)]">§ 06</span>
        <span className="label">Common questions</span>
      </div>
      <h2 className="text-[clamp(1.9rem,3.4vw,2.7rem)] font-semibold tracking-[-0.025em] max-w-[44rem]">
        What people ask before they install.
      </h2>

      <dl className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10">
        {qa.map((item, i) => (
          <div key={item.q}>
            <dt className="flex items-baseline gap-3">
              <span className="mono text-[11px] text-[var(--color-fg-4)] tracking-[0.18em]">
                Q.{(i + 1).toString().padStart(2, "0")}
              </span>
              <span className="text-[1.05rem] font-medium text-fg">{item.q}</span>
            </dt>
            <dd className="mt-3 ml-9 text-[0.96rem] leading-[1.7] text-[var(--color-fg-2)]">{item.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* FOOTER                                                                      */
/* ────────────────────────────────────────────────────────────────────────── */

function Footer() {
  return (
    <footer className="mt-12 border-t border-[var(--color-line-2)] bg-[var(--color-bg-2)] relative overflow-hidden">
      <div className="absolute inset-0 opacity-30 pointer-events-none"
           style={{
             backgroundImage: "radial-gradient(ellipse 600px 300px at 20% 0%, rgba(0,245,160,0.12), transparent 70%)",
           }} />
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-20 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-2 mb-5">
              <span className="pulse" />
              <span className="mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-fg-3)]">Ready to install</span>
            </div>
            <h3 className="text-[clamp(2rem,4vw,3rem)] font-semibold tracking-[-0.025em] leading-[1.05] max-w-[28rem]">
              Bind your agents in <span className="text-[var(--color-accent)] glow">90 seconds</span>.
            </h3>
            <div className="mt-8">
              <CopyableCommand cmd={INSTALL} />
            </div>
            <div className="mt-6 flex items-center gap-3">
              <a href={GH} className="btn-ghost"><GitHubMark /> Source</a>
              <a href="mailto:hello@capframe.ai" className="btn-ghost">hello@capframe.ai</a>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <FooterCol heading="Project" links={[
              { label: "GitHub",   href: GH },
              { label: "Releases", href: `${GH}/releases` },
              { label: "Schema",   href: `${GH}/blob/main/schemas/findings.v1.json` },
              { label: "Issues",   href: `${GH}/issues` },
            ]} />
            <FooterCol heading="Plans" links={[
              { label: "Free",       href: "#pricing" },
              { label: "Pro",        href: "#pricing" },
              { label: "Enterprise", href: "mailto:hello@capframe.ai" },
            ]} />
            <FooterCol heading="Contact" links={[
              { label: "hello@",    href: "mailto:hello@capframe.ai" },
              { label: "security@", href: "mailto:security@capframe.ai" },
            ]} />
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-[var(--color-line)] flex flex-wrap items-baseline justify-between gap-4 mono text-[11px] tracking-[0.18em] uppercase text-[var(--color-fg-3)]">
          <div className="flex items-center gap-3">
            <span className="text-fg font-medium">Capframe</span>
            <span className="text-[var(--color-fg-4)]">·</span>
            <span>v0.1.0</span>
            <span className="text-[var(--color-fg-4)]">·</span>
            <span>MIT</span>
            <span className="text-[var(--color-fg-4)]">·</span>
            <span>2026</span>
          </div>
          <div className="text-[var(--color-accent)]">find. bind. guard.</div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ heading, links }: { heading: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <p className="mono text-[10.5px] tracking-[0.18em] uppercase text-[var(--color-fg-3)] mb-4">{heading}</p>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <a href={l.href} className="text-[14px] text-[var(--color-fg-2)] hover:text-[var(--color-accent-3)] transition-colors">
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
