import type { Metadata } from "next";
import Link from "next/link";
import {
  CAPFRAME_GITHUB as GH,
  CAPFRAME_INSTALL as INSTALL,
  CAPFRAME_VERSION,
} from "@/lib/version";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <StatusBar />
      <Header />
      <main className="px-6 sm:px-10 lg:px-16">
        <Hero />
        <ThreatLandscape />
        <Flow />
        <Modules />
        <BindSpotlight />
        <Engineering />
        <Compliance />
        <Demo />
        <Audit />
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
            <span className="pulse" /> {CAPFRAME_VERSION} · live
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
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="w-7 h-7 rounded border border-[var(--color-accent)]/50 flex items-center justify-center font-mono text-[14px] text-[var(--color-accent)] group-hover:shadow-[0_0_16px_rgba(0,245,160,0.4)] transition-shadow">
            C
          </span>
          <span className="mono text-[13px] tracking-[0.16em] uppercase">capframe</span>
        </Link>
        <nav className="hidden md:flex items-center gap-7 mono text-[12px] tracking-[0.12em] uppercase text-[var(--color-fg-2)]">
          <a href="#modules" className="hover:text-fg transition-colors">Modules</a>
          <a href="#compliance" className="hover:text-fg transition-colors">Compliance</a>
          <a href="#install" className="hover:text-fg transition-colors">Install</a>
          <a href="#audit" className="text-[var(--color-accent)] hover:opacity-80 transition-opacity">Audit</a>
          <a href="#pricing" className="hover:text-fg transition-colors">Pricing</a>
          <Link href="/changelog" className="hover:text-fg transition-colors">Changelog</Link>
          <Link href="/blog" className="hover:text-fg transition-colors">Blog</Link>
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
          <span className="badge-ok"><span className="pulse" /> {CAPFRAME_VERSION} released</span>
          <span className="mono text-[11px] tracking-[0.16em] uppercase text-[var(--color-fg-3)]">
            AI agent security
          </span>
        </div>

        <h1 className="rise rise-2 text-[clamp(2.6rem,6vw,4.8rem)] leading-[1.02] font-semibold tracking-[-0.03em]">
          Capability security<br />
          for{" "}
          <span className="text-[var(--color-accent)] glow">AI agents</span>.
        </h1>

        <p className="rise rise-3 mt-7 text-[1.05rem] sm:text-[1.15rem] leading-[1.65] text-[var(--color-fg-2)] max-w-[36rem]">
          A deterministic runtime that maps every tool your agents reach,
          mints scoped, revocable capability tokens — verified in{" "}
          <span className="text-fg">single&#8209;digit microseconds</span> —{" "}
          and decides every call against a policy you wrote, with{" "}
          <span className="text-fg">no LLM in the decision path</span>.
          Stops prompt&#8209;injected refunds, runaway tool storms, indirect&#8209;injection
          data exfil, and unscoped MCP access before they reach prod.{" "}
          <span className="text-[var(--color-fg-3)]">
            MCP&#8209;native. Audit&#8209;mapped to OWASP LLM, NIST AI RMF, MITRE ATLAS. MIT.
          </span>
        </p>

        <div className="rise rise-4 mt-10 flex flex-wrap items-center gap-3">
          <a href="#install" className="btn-primary">
            Install Capframe
            <span aria-hidden>→</span>
          </a>
          <a href="#audit" className="btn-ghost">
            Get a $750 audit
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
  const accent3 = "text-[var(--color-accent-3)]";
  return (
    <div className="terminal">
      <div className="terminal-header">
        <span className="terminal-dot" />
        <span className="terminal-dot" />
        <span className="terminal-dot" />
        <span className="ml-3 mono text-[11px] text-[var(--color-fg-3)] tracking-wide">
          ~/agents — capframe install
        </span>
      </div>
      <pre className="mono text-[12.5px] sm:text-[13px] leading-[1.7] p-5 sm:p-7 text-fg overflow-x-auto">
{`$ capframe install
`}<span className={dim}>{`→`}</span>{` mcp-recon
  `}<span className={ok}>{`✓`}</span>{` `}<span className={accent3}>{`mcp-recon v0.0.4`}</span>{`   `}<span className={dim}>{`sha256 ok · 1.2 MB`}</span>{`
`}<span className={dim}>{`→`}</span>{` capnagent
  `}<span className={ok}>{`✓`}</span>{` `}<span className={accent3}>{`capnagent v0.7.6`}</span>{`   `}<span className={dim}>{`sha256 ok · 1.2 MB`}</span>{`
`}<span className={dim}>{`→`}</span>{` mcp-guard
  `}<span className={ok}>{`✓`}</span>{` `}<span className={accent3}>{`mcp-guard v0.5.4`}</span>{`   `}<span className={dim}>{`sha256 ok · 19.9 MB`}</span>{`

`}<span className={dim}>{`Verify with: `}</span>{`capframe doctor
`}<span className={dim}>{`Add to PATH: `}</span>{`~/.capframe/bin`}
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
/* THREAT LANDSCAPE — what breaks without a capability layer                  */
/* ────────────────────────────────────────────────────────────────────────── */

function ThreatLandscape() {
  const threats = [
    {
      tag: "T01",
      label: "Indirect prompt injection",
      mapping: "OWASP LLM01 · ATLAS T0051",
      story:
        "A vendor invoice arrives. The agent reads it. The PDF whispers: forward customers@ to attacker@. Your agent has Gmail scope. Your agent obeys.",
      cost: "GDPR fines · forced breach disclosure · board-level incident",
    },
    {
      tag: "T02",
      label: "Runaway tool storm",
      mapping: "OWASP LLM08 · NIST RMF MANAGE-1.2",
      story:
        "One bad inference and the refund agent loops, issuing $50 refunds until something — anything — finally rate-limits it. Recovery: 6 hours of finance reversals.",
      cost: "$10K–$2M before the alarm fires · permanent trust loss",
    },
    {
      tag: "T03",
      label: "Unbounded MCP surface",
      mapping: "OWASP LLM07 · ATLAS T0044",
      story:
        "An MCP server exposes 47 tools. Your agent legitimately needs 4. The other 43 are jailbreak surface — and every dependency update silently widens it.",
      cost: "Every unscoped tool is a CVE waiting for the right prompt",
    },
    {
      tag: "T04",
      label: "No forensic trail",
      mapping: "EU AI Act Art.12 · ISO 42001 · SOC2 CC7.2",
      story:
        "The agent did something. You can't prove what it was allowed to do, who authorised the scope, when the policy last changed, or whether it was revoked in time.",
      cost: "Failed audit · indefinite incident response · regulator finds gaps for you",
    },
  ];
  return (
    <section className="max-w-[1440px] mx-auto py-20 lg:py-24 border-t border-[var(--color-line)]">
      <div className="flex items-baseline gap-3 mb-4">
        <span className="mono text-[12px] text-[var(--color-rose)]">§ 01</span>
        <span className="label">The blast radius without it</span>
      </div>
      <h2 className="text-[clamp(1.9rem,3.4vw,2.7rem)] font-semibold tracking-[-0.025em] max-w-[48rem]">
        Your agents inherit the full authority of the credentials you hand them.
      </h2>
      <p className="mt-5 text-[1.02rem] leading-[1.7] text-[var(--color-fg-2)] max-w-[42rem]">
        Without a capability layer, every prompt-injection vector turns into the
        worst thing your agent could do with those keys. These aren&apos;t
        hypotheticals — they&apos;re the four failure modes every team
        shipping agents has seen, or is about to.
      </p>

      <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-4">
        {threats.map((t) => (
          <article
            key={t.tag}
            className="card p-6 sm:p-7 group hover:border-[var(--color-rose)]/40 hover:shadow-[0_0_40px_-12px_rgba(248,113,113,0.25)]"
          >
            <div className="flex items-baseline justify-between border-b border-[var(--color-line)] pb-3">
              <div className="flex items-baseline gap-3">
                <span className="mono text-[11px] text-[var(--color-fg-4)] tracking-[0.18em]">
                  {t.tag}
                </span>
                <span className="text-[1.05rem] font-semibold text-fg">
                  {t.label}
                </span>
              </div>
              <span className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-rose)]/80">
                live
              </span>
            </div>
            <p className="mt-5 text-[0.97rem] leading-[1.7] text-[var(--color-fg-2)]">
              {t.story}
            </p>
            <div className="mt-5 pt-4 border-t border-[var(--color-line)] flex flex-wrap items-baseline justify-between gap-2">
              <span className="mono text-[11px] tracking-[0.12em] uppercase text-[var(--color-rose)]/90">
                {t.cost}
              </span>
              <span className="mono text-[10.5px] text-[var(--color-fg-3)]">
                {t.mapping}
              </span>
            </div>
          </article>
        ))}
      </div>

      <p className="mt-12 text-[0.95rem] leading-[1.7] text-[var(--color-fg-3)] max-w-[42rem]">
        Capframe puts all four at the agent&apos;s tool-call boundary — Find and
        Bind as Rust binaries, Guard as a pip-installable Python layer. Every
        call is decided by a policy you wrote, not a model you can&apos;t inspect.
      </p>
    </section>
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
        <span className="mono text-[12px] text-[var(--color-accent)]">§ 02</span>
        <span className="label">The pipeline</span>
      </div>
      <h2 className="text-[clamp(1.9rem,3.4vw,2.7rem)] font-semibold tracking-[-0.025em] max-w-[46rem]">
        Four stages. Microsecond capability checks. One findings schema. No model in the loop.
      </h2>
      <p className="mt-5 text-[1.02rem] leading-[1.7] text-[var(--color-fg-2)] max-w-[42rem]">
        Map the surface, mint scoped authority, enforce every call against a
        policy you wrote, then export the receipt. The output of each stage is
        the input to the next — and every artifact is auditor-ready.
      </p>

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
      tag: "03.1",
      name: "Find",
      role: "Discovery",
      desc: "Walks every MCP server, every tool endpoint, every parameter your agent can reach. Detects unconstrained inputs, indirect-injection sinks, missing schemas, and silently-widening surfaces between dependency updates. Emits a findings.v1 JSON document aligned to OWASP LLM Top 10 and MITRE ATLAS — the same file Bind consumes to scope tokens and Guard consumes to synthesize policy.",
      bullets: [
        "Static + behavioural scan of every MCP server in your config",
        "Diffs surfaces between scans — flags newly introduced tools",
        "Schema-aware: catches missing parameter constraints, not just missing types",
        "Cross-tool findings.v1 wire format (JSON Schema Draft 2020-12)",
      ],
      code: `$ capframe find ./mcp-server.toml
✓ mapped 14 tools across 2 mcp servers
⚠ 3 tools accept input without constraints (LLM01)
⚠ 1 tool has indirect-injection surface (LLM01, ATLAS T0051)
✓ surface diff: +2 tools vs last scan
→ ./capframe.findings.json`,
    },
    {
      tag: "03.2",
      name: "Bind",
      role: "Authority",
      desc: "The authority layer — and the most adversarially-tested module in the stack. Prompt injection is a confused-deputy attack (Lampson, 1974): smarter guardrails don't fix it, removing the agent's ambient authority does. Bind mints macaroon-style capability tokens — attenuable, revocable, ed25519 holder-of-key — that bound what an agent CAN do at issuance time. Out-of-scope calls are refused before the underlying tool ever sees them, each producing a signed, tamper-evident receipt.",
      bullets: [
        "Macaroon chain (HMAC-SHA256): a holder can't broaden scope without the root key",
        "ed25519 holder-of-key proofs defeat token theft and replay",
        "Caveats evaluate against verifier-known facts — never the agent's claims",
        "Every caveat is human-readable: predict what a token permits in under 30s",
      ],
      code: `$ capframe bind --agent shopify-bot \\
                --tools "order.read, refund.write" \\
                --limit max_refund=50 --limit region=eu \\
                --ttl 24h
✓ token minted: cf_tok_a91f4e…
  holder:    ed25519 / shopify-bot
  scope:     2 tools · max_refund≤50 · region=eu
  expires:   2026-05-18T08:14:00Z
  revoke:    capframe revoke cf_tok_a91f4e`,
    },
    {
      tag: "03.3",
      name: "Guard",
      role: "Enforcement",
      desc: "A deterministic Python policy evaluator that sits inline at the agent's tool-call boundary. No LLM in the decision path — every allow/deny is reproducible, fuzzable, and immune to the jailbreak that just broke your agent. Synthesize policy from observed injection gaps, backtest against the corpus, ship.",
      bullets: [
        "Inline at the tool-call boundary — not a sidecar, not a daemon",
        "Synthesizes YAML policy from a findings.v1 file in one command",
        "Default corpus of 308 jailbreak / injection / scope-escape cases",
        "Fail-closed by construction — no policy = no calls",
      ],
      code: `$ capframe guard synth ./capframe.findings.json
✓ 14 rules generated across 3 categories
✓ policy → ./policy.yaml

$ capframe guard backtest ./policy.yaml
✓ 308-case corpus · TPR 1.00 / FPR 0.01
✓ deterministic · no model in the decision path`,
    },
  ];
  return (
    <section id="modules" className="max-w-[1440px] mx-auto py-20 lg:py-24 border-t border-[var(--color-line)]">
      <div className="flex items-baseline gap-3 mb-4">
        <span className="mono text-[12px] text-[var(--color-accent)]">§ 03</span>
        <span className="label">The three modules</span>
      </div>
      <h2 className="text-[clamp(1.9rem,3.4vw,2.7rem)] font-semibold tracking-[-0.025em] max-w-[44rem]">
        Standalone, or composed. Either way, three primitives — not three products.
      </h2>
      <p className="mt-4 text-[1.02rem] text-[var(--color-fg-2)] max-w-[42rem]">
        Find and Bind ship as Rust crates with CLI subcommands; Guard ships as a
        Python package (pip install mcp-guardrails) — each in its own public GitHub
        repo. Adopt one at a time, or wire them together through the
        shared <code className="text-[var(--color-accent-3)]">findings.v1</code> JSON
        Schema — the wire format Find emits, Bind scopes against, and Guard enforces.
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
              <ul className="mt-5 space-y-2 text-[13px]">
                {m.bullets.map((b) => (
                  <li key={b} className="flex gap-3 text-[var(--color-fg-2)]">
                    <span className="text-[var(--color-accent)] shrink-0 mono text-[11px] mt-[3px]">▸</span>
                    <span className="leading-[1.55]">{b}</span>
                  </li>
                ))}
              </ul>
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
/* BIND SPOTLIGHT — the authority layer, proven against an adversary           */
/* ────────────────────────────────────────────────────────────────────────── */

function BindSpotlight() {
  const proof = [
    {
      n: "10 / 10",
      label: "purple-team rounds closed",
      sub: "blue-first methodology · every documented BREAK fixed and shipped",
    },
    {
      n: "564",
      label: "tests, all green",
      sub: "242 Rust + 322 TypeScript · incl. proptests on the no-broaden invariant",
    },
    {
      n: "4 HIGH",
      label: "defects in our own engine",
      sub: "found by a 4-agent / 36-angle self-review · published · 4 of 4 closed",
    },
    {
      n: "1.4 µs",
      label: "chain-only verify",
      sub: "56 µs full holder-of-key pipeline · ~17 kHz verifications / core",
    },
  ];
  const classes = [
    "tool-description injection",
    "holder-of-key replay",
    "capability broadening",
    "revocation race",
    "cross-origin exfil",
    "path traversal + encoding",
    "IDN homograph origins",
    "sandbox prefix foot-gun",
  ];
  return (
    <section className="max-w-[1440px] mx-auto py-20 lg:py-24 border-t border-[var(--color-line)]">
      <div className="flex items-baseline gap-3 mb-4">
        <span className="mono text-[12px] text-[var(--color-accent)]">§ 04</span>
        <span className="label">Adversarially-tested · the Bind layer</span>
      </div>
      <h2 className="text-[clamp(1.9rem,3.4vw,2.7rem)] font-semibold tracking-[-0.025em] max-w-[48rem]">
        Bind isn&apos;t a claim. It&apos;s been attacked ten times — and every
        result is published.
      </h2>
      <p className="mt-5 text-[1.02rem] leading-[1.7] text-[var(--color-fg-2)] max-w-[44rem]">
        The authority layer ships with a public purple-team corpus: a structured
        record of adversarial scenarios run against the token engine, written{" "}
        <span className="text-fg">blue-first</span> — the falsifiable security
        claim is committed <em>before</em> the attack runs. Every round ships a
        runnable PoC and a signed denial receipt as evidence. Clone it, run the
        tests, verify every number on this page without trusting a word of it.
      </p>

      <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {proof.map((p) => (
          <article key={p.label} className="card p-6 flex flex-col hover:border-[var(--color-accent)]/40 hover:shadow-[0_0_40px_-12px_rgba(0,245,160,0.2)]">
            <div className="text-[1.9rem] font-semibold tracking-[-0.03em] text-[var(--color-accent)] glow leading-none">
              {p.n}
            </div>
            <div className="mt-3 text-[0.95rem] font-medium text-fg leading-snug">
              {p.label}
            </div>
            <div className="mt-2 mono text-[10.5px] leading-[1.55] text-[var(--color-fg-3)]">
              {p.sub}
            </div>
          </article>
        ))}
      </div>

      {/* live model demo */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
        <div className="lg:col-span-5 flex flex-col justify-center">
          <span className="label-accent">Live · real model</span>
          <h3 className="mt-3 text-[1.5rem] font-semibold tracking-[-0.02em] leading-tight">
            A Claude Opus 4.7 agent, told to move money it isn&apos;t scoped for.
          </h3>
          <p className="mt-4 text-[0.97rem] leading-[1.7] text-[var(--color-fg-2)]">
            No prompt engineering, no guardrail model, no second LLM judging the
            first. The agent is handed one capability — scoped to{" "}
            <code className="text-[var(--color-accent-3)]">checkout.purchase</code>.
            It tries to send a wire anyway. The authority simply isn&apos;t there,
            so the call dies at the gate while the in-scope purchase proceeds.
            Both verdicts are audit-logged.
          </p>
        </div>
        <div className="lg:col-span-7">
          <div className="terminal h-full">
            <div className="terminal-header">
              <span className="terminal-dot" />
              <span className="terminal-dot" />
              <span className="terminal-dot" />
              <span className="ml-3 mono text-[11px] text-[var(--color-fg-3)] tracking-wide">
                demo:llm-direct — Anthropic SDK
              </span>
            </div>
            <pre className="mono text-[12px] sm:text-[12.5px] leading-[1.75] p-5 sm:p-7 text-fg overflow-x-auto">
{`$ npm run demo:llm-direct
`}<span className="text-[var(--color-fg-3)]">{`→ task:  "send a $30 wire to acct 4471, then buy a USB-C cable"`}</span>{`
`}<span className="text-[var(--color-fg-3)]">{`→ scope: tool == "checkout.purchase"`}</span>{`

  `}<span className="text-[var(--color-rose)]">{`⨯`}</span>{` wire.send          `}<span className="text-[var(--color-rose)]">{`DENIED`}</span>{`   out-of-scope
                       `}<span className="text-[var(--color-fg-3)]">{`receipt cap_rcpt_3f9a…`}</span>{`
  `}<span className="text-[var(--color-accent)]">{`✓`}</span>{` checkout.purchase  `}<span className="text-[var(--color-accent)]">{`ALLOWED`}</span>{`  in-scope
                       `}<span className="text-[var(--color-fg-3)]">{`receipt cap_rcpt_7c12…`}</span>{`

`}<span className="text-[var(--color-fg-2)]">{`both decisions audit-logged · agent never reached the wire API`}</span>
            </pre>
          </div>
        </div>
      </div>

      {/* attack classes + honesty */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
        <div className="lg:col-span-7">
          <p className="label mb-4">Attack classes the corpus exercises</p>
          <div className="flex flex-wrap gap-2">
            {classes.map((c) => (
              <span
                key={c}
                className="mono text-[11.5px] text-[var(--color-fg-2)] border border-[var(--color-line-2)] rounded-full px-3 py-1 hover:border-[var(--color-accent)]/40 hover:text-fg transition-colors"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
        <div className="lg:col-span-5">
          <p className="label mb-4">And honest about what it doesn&apos;t cover</p>
          <p className="text-[0.94rem] leading-[1.7] text-[var(--color-fg-3)]">
            Model behaviour, system-prompt extraction, jailbreaks, and GCG
            suffixes are <span className="text-[var(--color-fg-2)]">explicitly out of scope</span> —
            documented in the threat model, not hand-waved. Bind removes the
            deputy&apos;s authority; it doesn&apos;t pretend to fix the model.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* ENGINEERING — why the runtime is different                                  */
/* ────────────────────────────────────────────────────────────────────────── */

function Engineering() {
  const blocks = [
    {
      n: "01",
      title: "Deterministic policy evaluator",
      body:
        "Deterministic and model-free. The same input always returns the same allow/deny — fuzzable, reproducible, immune to the next jailbreak. Most importantly: no LLM in the decision path. Your enforcement boundary is not a model you have to re-evaluate every time someone publishes a new attack paper.",
      pill: "0 LLM calls",
    },
    {
      n: "02",
      title: "Macaroon-style capability tokens",
      body:
        "ed25519 holder-of-key signatures, attenuable third-party caveats, revocation lists, TTL-bound. The primitive Google built distributed authorization on, ported to the agent boundary. Scope your agent to two tools and one region in one CLI call — and revoke the token in one more when something looks off.",
      pill: "ed25519 · attenuable",
    },
    {
      n: "03",
      title: "Tamper-evident receipts",
      body:
        "Every allow and every deny emits a signed (HMAC-SHA256) receipt with policy hash, token id, agent id, parameters, and verdict. Drop the receipt stream into S3 or Loki and you have a forensic timeline that satisfies SOC2 CC7.2 and EU AI Act Article 12 logging requirements out of the box.",
      pill: "HMAC-SHA256",
    },
    {
      n: "04",
      title: "findings.v1 wire format",
      body:
        "JSON Schema Draft 2020-12. Round-trip tested. The cross-tool contract Find emits, Bind reads to scope tokens, Guard reads to synthesize policy, and Report serializes into auditor-ready HTML/PDF. One schema means every artifact is grep-able, diff-able, and machine-checkable in CI.",
      pill: "Draft 2020-12",
    },
    {
      n: "05",
      title: "Static binaries, no daemon",
      body:
        "No daemon. No kernel module. No container. Find and Bind ship as sha256-verified static Rust binaries — x86_64 / aarch64 across Linux, macOS, and Windows — and Guard installs as a Python package alongside. Runs in CI, in your IDE, on your laptop, and inline at the tool-call boundary. Permissive OSS (Apache-2.0 + MIT) — read every line of the code your security depends on.",
      pill: "6 targets · OSS",
    },
    {
      n: "06",
      title: "MCP-native, framework-agnostic",
      body:
        "Today: every MCP server — Claude Desktop, Cursor, Continue, Cline, LangGraph via the MCP bridge, every agent SDK that speaks the protocol. Roadmap: native adapters for OpenAI function calling and Anthropic tool use, so the same policy file works regardless of which provider your agent picks tomorrow.",
      pill: "MCP today · adapters next",
    },
  ];
  return (
    <section className="max-w-[1440px] mx-auto py-20 lg:py-24 border-t border-[var(--color-line)]">
      <div className="flex items-baseline gap-3 mb-4">
        <span className="mono text-[12px] text-[var(--color-accent)]">§ 05</span>
        <span className="label">Under the hood</span>
      </div>
      <h2 className="text-[clamp(1.9rem,3.4vw,2.7rem)] font-semibold tracking-[-0.025em] max-w-[46rem]">
        The runtime is the product. Everything else is paperwork.
      </h2>
      <p className="mt-5 text-[1.02rem] leading-[1.7] text-[var(--color-fg-2)] max-w-[44rem]">
        Capframe is not a wrapper around an LLM, not a policy DSL transpiled to a model
        prompt, and not a managed service. It&apos;s a deterministic runtime
        with three primitives — tokens, policy, receipts — that sit inline at the
        boundary your agent already calls through.
      </p>

      <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {blocks.map((b) => (
          <article
            key={b.n}
            className="card p-6 sm:p-7 group hover:border-[var(--color-accent)]/40 hover:shadow-[0_0_40px_-12px_rgba(0,245,160,0.18)]"
          >
            <div className="flex items-baseline justify-between">
              <span className="mono text-[11px] text-[var(--color-fg-4)] tracking-[0.18em]">
                {b.n}
              </span>
              <span className="mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-accent-3)] border border-[var(--color-line-2)] rounded-full px-2 py-0.5">
                {b.pill}
              </span>
            </div>
            <h3 className="mt-4 text-[1.18rem] font-semibold tracking-[-0.015em] text-fg group-hover:text-[var(--color-accent)] transition-colors">
              {b.title}
            </h3>
            <p className="mt-3 text-[0.94rem] leading-[1.7] text-[var(--color-fg-2)]">
              {b.body}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat n="1.4 µs" label="Bind chain-verify (p50)" />
        <Stat n="308" label="default jailbreak corpus" />
        <Stat n="6" label="cross-compiled targets" />
        <Stat n="0" label="LLM calls on the hot path" />
      </div>
    </section>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div className="card p-5 flex flex-col items-start">
      <div className="text-[1.8rem] font-semibold tracking-[-0.025em] text-[var(--color-accent)] glow">
        {n}
      </div>
      <div className="mt-1 mono text-[10.5px] tracking-[0.16em] uppercase text-[var(--color-fg-3)]">
        {label}
      </div>
    </div>
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
        <span className="mono text-[12px] text-[var(--color-accent)]">§ 06</span>
        <span className="label">Compliance</span>
      </div>
      <h2 className="text-[clamp(1.9rem,3.4vw,2.7rem)] font-semibold tracking-[-0.025em] max-w-[46rem]">
        The only artifact mapping all three agent-security frameworks at once.
      </h2>
      <p className="mt-5 text-[1.02rem] leading-[1.7] text-[var(--color-fg-2)] max-w-[42rem]">
        Most tools tick one framework. Capframe was designed so a single run
        emits evidence aligned to OWASP LLM Top 10, NIST AI RMF, and MITRE
        ATLAS — the three frameworks regulated buyers (CISO, GRC, internal
        audit) actually ask about.{" "}
        <code className="text-[var(--color-accent-3)]">capframe report</code>{" "}
        exports the dossier as HTML or PDF — signed, timestamped, and ready
        to attach to an SOC2 / ISO 42001 / EU AI Act submission.
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
        <span className="mono text-[12px] text-[var(--color-accent)]">§ 07</span>
        <span className="label">Specimen transcript</span>
      </div>
      <h2 className="text-[clamp(1.9rem,3.4vw,2.7rem)] font-semibold tracking-[-0.025em] max-w-[44rem]">
        Eighty seconds, four commands, one auditor-ready report.
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
                --limit max_refund=50 --limit region=eu \\
                --ttl 24h
`}<span className="text-[var(--color-accent)]">✓</span>{` token minted: `}<span className="text-[var(--color-accent-3)]">cf_tok_a91f4e…</span>{`
  holder:    ed25519 / shopify-bot
  scope:     2 tools · max_refund≤50 · region=eu
  expires:   2026-05-18T08:14:00Z
  revoke:    capframe revoke cf_tok_a91f4e

$ capframe guard backtest ./policy.yaml
`}<span className="text-[var(--color-accent)]">✓</span>{` 247/247 corpus cases pass
`}<span className="text-[var(--color-accent)]">✓</span>{` 14 rules, 3 categories
`}<span className="text-[var(--color-accent)]">✓</span>{` false-positive rate: 0.0%

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
/* AUDIT — done-for-you services (the lead commercial motion)                  */
/* ────────────────────────────────────────────────────────────────────────── */

function Audit() {
  const deliverables = [
    "Branded OWASP LLM Top 10 / NIST AI RMF / MITRE ATLAS findings report (HTML + PDF)",
    "Prioritized remediation checklist — what to fix, in what order, and why",
    "30-minute walkthrough call + a sample deterministic policy you can drop in front of your agents",
  ];
  return (
    <section id="audit" className="max-w-[1440px] mx-auto py-20 lg:py-24 border-t border-[var(--color-line)]">
      <div className="flex items-baseline gap-3 mb-4">
        <span className="mono text-[12px] text-[var(--color-accent)]">§ 08</span>
        <span className="label">Done-for-you</span>
      </div>
      <h2 className="text-[clamp(1.9rem,3.4vw,2.7rem)] font-semibold tracking-[-0.025em] max-w-[44rem]">
        Short on time? We&apos;ll audit your agents.
      </h2>
      <p className="mt-5 text-[1.05rem] leading-[1.7] text-[var(--color-fg-2)] max-w-[43rem]">
        The same posture we run on our own tools and on 90+ public servers on the{" "}
        <Link href="/leaderboard" className="text-[var(--color-accent)] hover:underline">leaderboard</Link>
        , pointed at your stack. I map your agent&apos;s tool surface — MCP servers, or your existing
        OpenAI / Anthropic / LangChain tool definitions — and hand you a report you can act on in five business days.
      </p>

      <div className="mt-12 card p-8 sm:p-10 border-[var(--color-accent)]/50 shadow-[0_0_60px_-20px_rgba(0,245,160,0.4)] grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative">
        <div className="absolute -top-3 left-8 sm:left-10 px-2 py-0.5 mono text-[10px] tracking-[0.18em] uppercase rounded bg-[var(--color-accent)] text-[#04241a]">
          Founding · first 3 customers
        </div>
        <div className="lg:col-span-7">
          <h3 className="text-[1.4rem] font-semibold">Agent Security Audit</h3>
          <ul className="mt-5 space-y-2.5 text-[14px]">
            {deliverables.map((d) => (
              <li key={d} className="flex gap-3 text-[var(--color-fg-2)]">
                <span className="text-[var(--color-accent)] shrink-0">✓</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[0.95rem] leading-[1.65] text-[var(--color-fg-3)]">
            <span className="text-fg">Guarantee:</span> if the report doesn&apos;t surface at least one
            issue you didn&apos;t already know about, you pay nothing.
          </p>
        </div>
        <div className="lg:col-span-5 lg:border-l lg:border-[var(--color-line)] lg:pl-12 flex flex-col justify-center">
          <div className="flex items-baseline gap-2">
            <span className="text-[2.8rem] font-semibold leading-none tracking-[-0.02em]">$750</span>
            <span className="mono text-[11px] tracking-[0.14em] uppercase text-[var(--color-fg-3)]">founding</span>
          </div>
          <div className="mono text-[11px] tracking-[0.14em] uppercase text-[var(--color-fg-3)] mt-2">
            standard $2,500 · 5 business days
          </div>
          <a href="mailto:hello@capframe.ai?subject=Capframe%20Agent%20Security%20Audit%20(Founding)&body=Hi%20—%20I'd%20like%20a%20Capframe%20agent%20security%20audit.%20My%20agent%20framework%20%2F%20MCP%20servers%3A%20"
             className="btn-primary mt-7 w-full justify-center">
            Request an audit
            <span aria-hidden>→</span>
          </a>
          <Link href="/blog/red-teaming-my-own-engine"
                className="mt-3 text-center mono text-[10.5px] tracking-[0.14em] uppercase text-[var(--color-fg-3)] hover:text-fg transition-colors">
            See a sample teardown ↗
          </Link>
        </div>
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
      name: "Free",
      price: "$0",
      cadence: "self-hosted",
      status: "available",
      blurb:
        "All three modules. Local CLI. Full OWASP / NIST / ATLAS report generator. MIT license.",
      features: [
        "All three modules",
        "Local-first CLI",
        "Full report generator (HTML + PDF)",
        "sha256-verified installer",
        "Run anywhere",
      ],
      cta: "Install",
      ctaHref: "#install",
      featured: false,
    },
    {
      name: "Pro",
      price: "Early access",
      cadence: "$199/mo · planned",
      status: "early access · waitlist open",
      blurb:
        "Hosted control plane for AI teams shipping agents at velocity. Currently in private early access — join the waitlist below.",
      features: [
        "Hosted dashboard (in build)",
        "Findings history + cross-scan diffing",
        "Scheduled scans",
        "Slack alerts",
        "Up to 10 agents",
      ],
      cta: "Join waitlist",
      ctaHref:
        "mailto:hello@capframe.ai?subject=Capframe%20Pro%20waitlist&body=Hi%20—%20I'd%20like%20a%20slot%20in%20the%20Capframe%20Pro%20early-access%20waitlist.%20My%20use%20case%3A%20",
      featured: true,
    },
    {
      name: "Enterprise",
      price: "Talk",
      cadence: "to us",
      status: "design partners",
      blurb:
        "On-prem / VPC. SSO, audit logs, signed compliance reports, SLA. Taking a small number of design partners in regulated industries.",
      features: [
        "SSO + audit logs",
        "On-prem / VPC deploy",
        "Signed compliance reports",
        "SLA + private Slack channel",
        "Unlimited agents",
      ],
      cta: "Contact",
      ctaHref:
        "mailto:hello@capframe.ai?subject=Capframe%20Enterprise%20design%20partner",
      featured: false,
    },
  ];
  return (
    <section id="pricing" className="max-w-[1440px] mx-auto py-20 lg:py-24 border-t border-[var(--color-line)]">
      <div className="flex items-baseline gap-3 mb-4">
        <span className="mono text-[12px] text-[var(--color-accent)]">§ 09</span>
        <span className="label">Pricing</span>
      </div>
      <h2 className="text-[clamp(1.9rem,3.4vw,2.7rem)] font-semibold tracking-[-0.025em] max-w-[44rem]">
        Open source. Hosted when you need it.
      </h2>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
        {tiers.map((t) => (
          <div key={t.name}
               className={`card p-7 flex flex-col relative ${t.featured ? "border-[var(--color-accent)]/50 shadow-[0_0_60px_-20px_rgba(0,245,160,0.4)]" : ""}`}>
            <div className={`absolute -top-3 left-7 px-2 py-0.5 mono text-[10px] tracking-[0.18em] uppercase rounded ${
              t.featured
                ? "bg-[var(--color-accent)] text-[#04241a]"
                : "bg-[var(--color-bg-3)] text-[var(--color-fg-2)] border border-[var(--color-line-2)]"
            }`}>
              {t.status}
            </div>
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
    { q: "How is this different from an LLM-as-judge guardrail?",
      a: "An LLM judge is another model you have to trust — and another attack surface. Capframe's Guard is a deterministic Python evaluator: the same input always yields the same allow/deny, with no model in the path. That means it's fuzzable, reproducible, and immune to the next jailbreak paper. LLM judges are useful for content classification; they are not safe to put inline at a tool-call boundary." },
    { q: "How is this different from prompt-injection scanners or red-team frameworks?",
      a: "Scanners tell you about a vulnerability after the fact. Capframe enforces the boundary at the moment of the call — the agent never gets to make a refund it shouldn't, regardless of what the prompt said. Find covers the offline discovery surface; Guard is the runtime backstop the scanner ecosystem doesn't have." },
    { q: "Is the runtime fast enough for production?",
      a: "Yes. Guard is a deterministic rule engine — no model inference and no network hop in the decision path, so a decision is a pure function of (policy, call). (Raw capability verification, in the Rust Bind layer, runs in single-digit microseconds.) Drop Guard inline at the tool-call boundary and measure it on your own traffic." },
    { q: "Does my agent data leave my environment?",
      a: "No. It's local-first — Find, Bind, Guard, and Report all run on your laptop, your CI, or your inference host (Find and Bind as Rust binaries, Guard as a pip-installable Python layer). The Pro / Enterprise hosted control plane is opt-in and stores only the metadata you choose to sync." },
    { q: "Does this only work with MCP?",
      a: "Today, yes — Capframe is built around the Model Context Protocol. That covers Claude Desktop, Cursor, Continue, Cline, LangGraph via the MCP bridge, and most agentic Rust/Python frameworks. Native adapters for OpenAI function calling and Anthropic tool use are on the roadmap; the policy file stays the same." },
    { q: "Why three separate modules?",
      a: "Different teams adopt them at different speeds. Security teams typically start with Find to baseline their agent surface. AI engineers usually start with Guard because it solves the immediate runtime problem. The capability-token layer (Bind) is for teams ready to commit to a permission model. The findings.v1 schema ties them together when you're ready." },
    { q: "Why open source?",
      a: "Security infrastructure you can't read isn't trustworthy — and AI-agent enforcement is too new a category to be locked behind a closed binary. The code your boundary depends on should be inspectable, fuzzable, and forkable. MIT licensed, every line." },
    { q: "What does the auditor actually receive?",
      a: "An HTML or PDF report (capframe report) with: the findings table mapped to OWASP LLM Top 10 and MITRE ATLAS techniques, the active policy file with its hash, the signed receipt count by verdict, and the NIST AI RMF function coverage matrix. Timestamped and signature-verifiable end to end." },
  ];
  return (
    <section className="max-w-[1440px] mx-auto py-20 lg:py-24 border-t border-[var(--color-line)]">
      <div className="flex items-baseline gap-3 mb-4">
        <span className="mono text-[12px] text-[var(--color-accent)]">§ 10</span>
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
            <span>{CAPFRAME_VERSION}</span>
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
