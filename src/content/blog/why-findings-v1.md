---
title: "Why we shipped findings.v1 as a public JSON Schema"
date: "2026-05-20"
description: "AI agent security tools each emit findings in their own shape. We think they shouldn't. Here's the wire format we're proposing as a starting point — and why we put it in the repo before writing the scanner."
tags: ["security", "schema", "ai-agents", "interoperability"]
---

When we started [Capframe](https://capframe.ai), the first artifact we
committed wasn't a scanner. It wasn't a runtime sentry. It wasn't even
documentation. It was a JSON Schema named
[`findings.v1.json`](https://capframe.ai/schema).

That feels backwards. Tools usually ship code first and a spec later,
once the shape is forced into existence by integration pain. We did it
the other way around on purpose. This post is the why.

## The gap we're trying to fill

If you ship a SAST (static application security testing) tool today,
you emit [SARIF](https://sarifweb.azurewebsites.net/). It's a
standardised JSON envelope that every code-scanning tool — Semgrep,
CodeQL, Snyk, Bandit — knows how to read and write. Your CI can run
five different scanners and a downstream dashboard can show their
findings in one view, because everyone agreed on the wire format.

If you ship an AI agent security tool today, there is no SARIF. Every
project picks its own shape. We looked at the half-dozen tools in the
space and saw six different envelopes for the same fundamental object:
"here's a thing we found about this tool surface, with a severity, a
category, and some context."

The downstream cost of that fragmentation is real. A buyer running
three of these tools in parallel ends up writing three glue scripts
to normalise findings before they can be ranked, deduped, or routed
to a ticket queue. Every new tool that enters the space pays the same
tax. And the tools themselves can't compose — one tool's discovery
output can't drive another tool's policy synthesizer, because the
schemas don't line up.

We don't think this is a permanent state of affairs. We think one of
the existing tools is going to define the format that wins, the way
SARIF did, and from then on everyone else implements it. We'd rather
that format be designed openly than emerge by accident from whichever
vendor ships first and biggest.

So we wrote one. It's at
[`schemas/findings.v1.json`](https://github.com/capframe/capframe/blob/main/schemas/findings.v1.json)
in the repo and at [capframe.ai/schema](https://capframe.ai/schema)
as a stable URL. MIT-licensed. PRs welcome.

## What's in it

The full schema is short enough to read top-to-bottom. The shape
roughly mirrors SARIF's design intuition (envelope → results, each
result is a flat record with classification metadata) but is much
narrower because the domain is narrower.

A `findings.v1` document is an envelope:

    {
      "schema_version": "capframe.findings.v1",
      "scanned_at":     "2026-05-20T14:32:00Z",
      "scan_id":        "0c81b6d2-7a91-4c52-9c1e-aa8e90e3f6b1",
      "scanner":        { "name": "mcp-recon", "version": "0.0.4" },
      "target":         { "kind": "mcp_server", "name": "shopify-mcp" },
      "tools":          [ ...inventory of discovered tools... ],
      "findings":       [ ...one entry per detected issue... ],
      "summary":        { "total": 6, "by_severity": {...} }
    }

The interesting design decisions live in the four sub-shapes:
`Tool`, `Finding`, `Mappings`, and the closed-set enums.

### `Tool` — a tool surface entry

Each tool gets a record with `name`, optional `description`, optional
`parameters` (a JSON Schema), a closed-set list of declared
`side_effects` (`read` / `write` / `network` / `filesystem` /
`execute` / `money` / `irreversible`), and optional `auth_required` /
`rate_limited` booleans.

We deliberately kept the side-effect taxonomy small. Seven options
is enough to express "this tool moves money" or "this tool can
delete things" without forcing tool authors into a 47-bucket
ontology. The cost is some loss of precision — `database.update`
and `s3.put` both flatten to `write` — but that's a deliberate
tradeoff for adoption ergonomics. A taxonomy nobody uses is worse
than a coarse one everyone uses correctly.

### `Finding` — one detected issue

A `Finding` has an `id` (stable hash for diffing across scans), a
`severity` (`info` / `low` / `medium` / `high` / `critical`), a
`category` from a closed set of 13 issue classes (e.g.
`indirect_injection`, `excessive_agency`, `unconstrained_input`,
`missing_authz`, `secret_exposure`, `ssrf_surface`, …), a `title`,
optional `description` / `tool` / `evidence` / `remediation`, and the
compliance-framework `mappings` discussed below.

The closed-set `category` enum is load-bearing. Every category maps
to a known threat-model class. If your tool surfaces something that
doesn't fit, you can use `other` — but if `other` becomes more than
a single-digit percentage of your output, we want to know about it,
because that's a signal the taxonomy is wrong rather than your
output is.

### `Mappings` — the compliance-framework receipts

This is the part the regulated buyers care about. Each finding can
carry a `mappings` object with three optional arrays:

    "mappings": {
      "owasp_llm":   ["LLM01", "LLM08"],
      "nist_rmf":    ["MEASURE-2.3", "MANAGE-2.2"],
      "mitre_atlas": ["T0051"]
    }

The IDs are regex-validated at the schema level. `owasp_llm` accepts
`^LLM(0[1-9]|10)$` — so `LLM99` is invalid, not because the validator
guesses semantically but because it's not a real OWASP LLM Top 10 ID.
Same for `nist_rmf` (must match
`^(GOVERN|MAP|MEASURE|MANAGE)-[0-9]+(\.[0-9]+)*$`) and `mitre_atlas`
(must be a `T####` or `T####.###`).

That regex enforcement matters. The whole "audit-ready" pitch falls
apart if half the findings reference `LLM6` or `Manage-2` or
`prompt-injection` instead of the real IDs. Schemas without
validation are documentation, not contracts.

### Closed-set everything

Both `severity` and `category` are tight enums with no `additionalProperties`.
Severity is a `info|low|medium|high|critical` ladder. Category is a
13-class enum. `additionalProperties: false` is set on every nested
object. The schema is intentionally rigid.

That's not a fashion choice — it's the whole point of having a
schema. Findings that don't validate against the schema are findings
nobody downstream can reliably route, dedupe, or audit. We'd rather
fail loud at the producer than silently degrade at the consumer.

## Tradeoffs we made

Three design choices we're least sure about, in case any of you
have a better answer:

**1. Flat findings, no nesting.** We considered letting findings
nest (a parent `excessive_agency` finding with child `missing_cap`,
`unbounded_param` findings). Decided against because it complicates
deduplication and reporting, and the cases where nesting would help
seem rare. SARIF's `result.relatedLocations` is the same call — flat
results, with optional references between them. We went a step further
and dropped relations entirely.

**2. `evidence` is a free-form object.** We had a moment of wanting
to schematize the evidence field per category (so a
`secret_exposure` finding has `{ "matched_pattern": ..., "byte_offset": ... }`
and an `indirect_injection` finding has different keys). We backed
off — that's a massive scope expansion, and most consumers won't
read evidence anyway. Today evidence is `{"type": "object"}`. If
this becomes a real problem we'll versionize to `findings.v2`.

**3. No support for differential findings.** A real scanner wants
to emit "this finding is new since the last scan" or "this finding
was previously suppressed." We left that to the consumer:
`first_seen` and `last_seen` are RFC3339 datetimes on each finding,
which is enough to compute the diff externally. Building it into the
schema would have meant building a state model, and we wanted v1 to
stay stateless.

## What we're hoping happens

The honest goal: we want one or two other tools in the space to
either (a) adopt this format as-is, or (b) push back with concrete
proposals for what's missing.

Adoption-as-is is the better outcome for everyone. If three tools
emit `findings.v1.json`, a downstream consumer writes one parser
instead of three, and the format de-facto solidifies.

Pushback is the second-best outcome. If we got something wrong —
the taxonomy is incomplete, the regex patterns are too strict, the
`evidence` shape needs constraint — file an issue and we'll
co-evolve toward `findings.v1.1` or, if it's breaking, `v2`. The
schema is versioned by exact string match in the `schema_version`
field, so we can ship both.

The thing we don't want is silent fragmentation. If you're working
on a tool in this space and you've already picked your own format —
please at least take a look at this one before you let yours
ossify. If we got it right, great. If we got it wrong, even better
— we'd rather find out now than two years and three breaking
changes from now.

## How to engage

- **Read the schema:** [capframe.ai/schema](https://capframe.ai/schema)
- **Read the [example payload](https://github.com/capframe/capframe/blob/main/schemas/findings.example.json)** — a realistic Shopify-MCP inventory with one
  `excessive_agency` finding.
- **Browse the [conformance tests](https://github.com/capframe/capframe/blob/main/crates/capframe-findings/tests/schema.rs)**: five tests today,
  including round-trip validation and explicit rejection of malformed
  framework IDs.
- **Open a PR or an issue:**
  [github.com/capframe/capframe](https://github.com/capframe/capframe) —
  the `findings.v1` schema lives at `schemas/findings.v1.json`. PRs
  welcome.
- **Email us:** [hello@capframe.ai](mailto:hello@capframe.ai) if you'd
  rather discuss before opening anything public.

The schema is MIT-licensed. Implement it in your tool. Bring concrete
disagreements. The format only becomes a standard if more than one
project implements it — until then it's just our wire format with
ambitious naming.
