---
title: "Declared reversibility: the MCP primitive nobody ships"
date: "2026-07-10"
description: "A model can't tell drop_database from list_tables — and neither can the policy gate in front of it, because no MCP tool declares whether an action can be undone. Today reversibility is inferred from the verb in a tool's name. Here's why that's the wrong layer, and what a one-field fix would change."
tags: ["security", "mcp", "ai agents", "reversibility"]
---

A model can't tell `drop_database` from `list_tables`. Same shape, same call convention, two entries in a flat list. Nothing in the schema says one of them ends the world and the other one reads a page.

Here's the part that gets skipped: **a policy gate in front of the agent can't tell either.** Not reliably. Because no MCP tool actually declares *"this action can't be undone."* Everyone downstream — the model, a runtime guardrail, a human approver skimming a diff — is guessing from the same thing: the verb in the tool's name.

## Guessing works, until it doesn't

We do this guessing ourselves. Our scanner reads the tool name, tokenizes it, and matches a curated list of mutation verbs — `delete`, `drop`, `destroy`, `transfer`, `revoke`, `cancel`. If a tool's name implies mutation and its schema declares no write-class side-effect, we flag it. It's deterministic and it catches a lot.

It also has a failure mode we're honest about: it's a heuristic on a name.

- A cleverly-named destructive tool slips through (`archive_account` reads friendly; it isn't).
- A benign tool gets flagged (`delete_draft` on a scratch buffer isn't a catastrophe).
- A tool that's safe on most inputs turns irreversible on one specific argument, and a name-level scan never sees it.

A runtime gate that keys off the same signal inherits the same blind spots. Two layers, one guess, correlated failures. That's not a great place to put "did we just wire money to the wrong account."

## The fix isn't a smarter guesser

It's a declared signal. MCP tools already declare parameter types, required fields, and enums. Reversibility belongs in exactly the same place:

```
reversible: false   →  a gate can hard-stop for sign-off
reversible: true    →  reads pass, zero friction
```

Once it's declared, three things stop being guesswork:

1. **Detection** gets ground truth instead of name heuristics. The scanner stops inferring "probably destructive" from `drop` and reads the tool's own claim.
2. **Enforcement** gets a deterministic hook. A guardrail can gate every `reversible: false` call behind human approval without an LLM anywhere in the decision path.
3. **Accountability** appears for free. A tool that labels a money-moving action `reversible: true` is now *provably* mislabeling — a fact you can score, not a vibe.

One boolean. It's the missing MCP primitive for safe agent tool use, and almost nothing ships it.

## The honest caveats

Because a security tool you can't argue with isn't worth much:

- **A declared tag is a claim, not a guarantee.** `reversible: true` is exactly the first thing a sloppy or compromised tool would mislabel. So a gate must never *trust* the label — it treats the tag as a hint to verify, not a gate input, and re-checks blast radius at call-time. The tag's real jobs are narrowing the search and catching liars.
- **Reversibility is a spectrum, not a bit.** A refund is "reversible" in a way a wire to an external chain is not. A single boolean is the floor, not the ceiling — but a floor the ecosystem doesn't have yet beats a perfect taxonomy nobody adopts.
- **Nothing forces adoption.** The MCP spec doesn't require a tool to declare its own authority, which is precisely why these gaps accumulate quietly. Until it does, inference is what we've got — so we keep it honest and keep the false-positive classes documented.

## The takeaway

The reason `send_money` looks identical to `check_balance` to everything downstream isn't a model failure. It's a missing field. Detection and enforcement are two ends of the same pipeline, and both are currently reading tea leaves because the tool never said what it does.

We infer it today — deterministically, mapped to OWASP LLM Top 10 / NIST AI RMF / MITRE ATLAS — on every public server on the [leaderboard](https://capframe.ai/leaderboard), and we're honest that inference false-positives. If you want that read pointed at your own tool surface (MCP server or raw OpenAI/Anthropic/LangChain definitions), that's the [Agent Security Audit](https://capframe.ai/#audit) — the same adversarial eye we turned on [our own engine](https://capframe.ai/blog/red-teaming-my-own-engine).
