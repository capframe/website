---
title: "Scanning the bank an AI agent runs on"
date: "2026-07-10"
description: "Agentic banking shipped in 2026: MCP servers that let an AI agent open a business account, issue cards, and move money — ACH, wire, USDC on multiple chains — from a natural-language prompt. It's the highest-blast-radius tool surface we've looked at. Here's what a scan of that surface actually finds, and why it's an attestation problem, not a gotcha."
tags: ["security", "mcp", "ai agents", "fintech", "leaderboard"]
---

The category that felt like a thought experiment last year is live. There are now MCP servers that let an AI agent open a business bank account, issue virtual and physical cards, and move money — domestic ACH, wire, USDC across several chains — from a single prompt. Any MCP-compatible agent can connect and start calling them.

We [wrote before](https://capframe.ai/blog/the-mcp-security-spread) that the servers which *do the most* score the worst, because a richer tool surface accumulates more gaps. A bank an agent operates is the extreme end of that curve. So we read one the way an attacker would — its published tool surface — and the findings are worth walking through, because they're not the ones people expect.

## What a money-moving surface looks like

Strip a banking MCP down to its tool list and you get two piles. Reads:

`get_account_balances`, `list_transactions`, `get_card_details`, `list_contacts`

And actions that touch money:

`create_ach_transfer`, `create_wire_transfer`, `create_crypto_transaction`, `create_card`

To a human reading a dashboard, those two piles are obviously different. To a model reading a flat `tools/list`, they're eight sibling entries. That gap — between how obvious the risk is to *us* and how invisible it is to the *model* — is the whole story.

## What the scan finds (and what it doesn't)

Here's the part that surprises people: the well-built ones have *good* controls. Transfers are draft-only and need human approval. Cards are merchant-scoped and single-use. Crypto goes only to saved contacts. That's better than most agent products ship, and a scan says so.

The findings live one layer up, in the schema:

1. **Money-movers are schema-indistinguishable from reads.** Nothing marks `create_crypto_transaction` as irreversible authority and `get_usdc_transaction` as a harmless read. A [declared-reversibility](https://capframe.ai/blog/declared-reversibility) tag would fix this; almost none ship it.
2. **No in-schema cap on the amount.** The approval workflow is the backstop, but the schema itself doesn't bound the draft — so the realistic attack is [approval fatigue](https://capframe.ai/blog/schema-vs-approval-gate), not a single dramatic theft.
3. **Free-text fields as injection carriers.** Invoice memos, uploaded documents, contact lookups — attacker-influenced strings that flow into the agent's context and can steer the next tool call.

None of that says "this bank is insecure." It says the tool schema — the layer an injected agent actually reads — is under-specified, and the controls that save you all live below it.

## Why this is an attestation problem

The teams shipping agentic banking tend to be sophisticated — often payments and security engineers who've built rails before. They *have* the controls, and they'll defend the design, correctly. So the value of a scan isn't "we found your bug." It's that a regulated fintech **can't self-attest** to its own tool surface. Its enterprise customers, its SOC 2 auditors, and eventually its regulators will want an independent, deterministic read of what an agent connected to that server can actually do — mapped to a framework, honest about false positives.

That artifact doesn't exist by default. Producing it is most of the job.

## The honest caveats

- **A read-only scan sees the surface, not an exploit.** "The schema permits an unbounded draft" is a permission, not a proof-of-theft. We're explicit about which is which.
- **Good controls are real and we say so.** The point of scanning a well-built bank is precisely that the interesting findings are subtle and schema-level, not "they left the door open."
- **Most fixes are one line.** Add a `maximum`, declare a side-effect, constrain a destination, mark the irreversible tools. The gaps are invisible because nothing in MCP forces a tool to declare its own authority — not because anyone was careless.

## The takeaway

When the tool surface is a bank, "your security is a function of your tool surface, not your model" stops being a slogan and becomes a compliance requirement. The controls matter. The schema above them matters just as much, and it's the part that ships un-read.

We do that read deterministically, mapped to OWASP LLM Top 10 / NIST AI RMF / MITRE ATLAS — free on public servers via the [leaderboard](https://capframe.ai/leaderboard), or pointed at your own stack as the [Agent Security Audit](https://capframe.ai/#audit): the findings, the one-line fixes, and the third-party attestation a bank an agent runs on is going to need.
