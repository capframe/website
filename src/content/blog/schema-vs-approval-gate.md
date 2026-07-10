---
title: "Your approval gate lives below the agent"
date: "2026-07-10"
description: "The best agent products gate money-moving actions behind human approval, spend limits, and role-based controls — at the infrastructure level. That's the right backstop. But the tool schema is what an injected agent actually reads, and it sits above the gate. Here's the layer nobody audits."
tags: ["security", "mcp", "ai agents", "fintech"]
---

The serious agent products get the hard part right. Money-moving actions are draft-only. Transfers need an initiator and an approver. Cards are scoped to a merchant and a spend limit. None of this is left to the model to self-police — it's enforced at the infrastructure level, below the agent, where a prompt can't reach it.

That's genuinely good design. It's also not the whole surface.

## Two different layers, and only one is guarded

There's the **runtime gate**: the approval workflow, the spend cap, the role check. It sits *below* the agent and fires when a call actually executes.

There's the **tool schema**: the list of tools, their names, their parameters, their descriptions. It sits *above* the agent — it's the menu the model reads to decide what to call. An injected instruction operates entirely at this layer. It never sees your approval workflow; it sees `create_ach_transfer` and `get_account_balances` sitting next to each other as two callable entries.

Teams pour effort into the gate and ship the schema as an afterthought. But the schema is the part an attacker reads.

## What the schema layer leaks

Run a scanner over a well-built financial tool surface — one with excellent runtime controls — and the findings aren't "you're insecure." They're gaps at the layer above the gate:

| Gap | What it looks like | Why the gate doesn't cover it |
|---|---|---|
| **Undeclared side-effects** | `create_transfer` and `get_balance` are schema-indistinguishable | A policy layer can't gate what it can't tell apart from a read |
| **Unbounded amounts** | The `amount` parameter has no `maximum` in the schema | The only bound is the human approver's attention |
| **Injection carriers** | Free-text fields (invoice memos, uploads, lookups) flow into the model's context | The gate checks the *action*, not the *instruction* that chose it |

The realistic attack here isn't "the agent wires the whole treasury" — the gate catches that. It's quieter: an injected instruction drafts many small, legitimate-looking transfers to a saved counterparty, betting that one gets rubber-stamped. Approval fatigue is a real attack surface, and it lives entirely in the space between "the schema let me draft this" and "a human clicked approve."

## Why this matters more than it looks

A runtime gate is a backstop, and backstops are only as strong as the attention behind them. The schema is what determines *how often the backstop gets tested* and *how obviously bad the thing being approved looks.* A schema that clearly declares "this tool moves money, capped at X, to allowlisted destinations" makes both the model's refusal and the human's review dramatically easier. A schema that leaves all of that implicit pushes the entire load onto the one tired person reading the diff.

You can't fix the schema layer with a better gate. They're different problems.

## The honest caveats

- **Good controls are still good.** Draft-only transfers and scoped cards genuinely reduce blast radius, and a schema finding is not a claim that they don't. It's a claim that a second, independent layer is unguarded.
- **A read-only scan sees permission, not exploitation.** "The schema permits an unbounded draft" is not "here is a working theft." It's the surface, read the way an attacker reads it.
- **Some of this is unavoidable today.** MCP doesn't force a tool to declare its own authority (see [declared reversibility](https://capframe.ai/blog/declared-reversibility)), so even a careful team inherits an under-specified schema. The fix is mostly one-line: add a `maximum`, declare a side-effect, constrain a destination.

## The takeaway

If you build agents that move money, you've probably already built the gate. The question worth asking is whether anyone has read your tool *schema* the way an injected agent will — because that's the layer that decides what reaches the gate in the first place, and it's the one that ships un-audited.

That read is deterministic and mapped to OWASP LLM Top 10 / NIST AI RMF / MITRE ATLAS. It's what the [leaderboard](https://capframe.ai/leaderboard) runs on public servers, and what the [Agent Security Audit](https://capframe.ai/#audit) points at your own — the schema, not the gate, plus the specific one-line fixes and the third-party attestation your enterprise customers will ask for.
