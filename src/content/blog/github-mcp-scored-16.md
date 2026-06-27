---
title: "The official GitHub MCP server scored 16/100 on our leaderboard. Here's what that actually means."
date: "2026-06-27"
description: "The lowest-scoring official server on the capframe.ai leaderboard is the one from GitHub. Not because it's broken — because it exposes the most write surface, and the MCP protocol has no way to describe any of it. That's the interesting part."
tags: ["security", "mcp", "classifier", "ai-agents", "github"]
---

We run a public security leaderboard for MCP servers at [capframe.ai/leaderboard](https://capframe.ai/leaderboard).
Every server gets scanned by the same deterministic classifier — no LLM in the decision path, same
ten rules every time — and scored on how much authority it hands an AI agent and how much of that
authority is *declared* in a way the agent can actually reason about.

The lowest-scoring official server is the one from GitHub: **16/100**.

Before anyone reaches for the pitchforks: **this is not a vulnerability.** There is no CVE, no exploit,
nothing is leaking. The score is a transparent heuristic (the weights are published on the leaderboard).
It measures one specific thing — and the GitHub server is a near-perfect illustration of why that thing
matters.

## What we actually scanned

The scan is against `@modelcontextprotocol/server-github@2025.4.8`, the official package from the
`@modelcontextprotocol` org. The leaderboard uses the sandbox producer for this one: it pulls the npm
package into a `node:20` container, connects over stdio, performs the real `initialize` handshake, calls
`tools/list`, and classifies whatever the server actually reports. The numbers here are reproducible —
not transcribed from source.

```
total: 34  |  by severity: { critical: 0, high: 8, medium: 26 }
by rule:  { r1: 26, r3: 8 }
```

Zero critical. Eight high, twenty-six medium.

## The eight highs are all one rule — and they point at the protocol, not GitHub

Every single high-severity finding came from **R3**: *tool name implies state mutation, but the schema
declares no side-effects.*

The eight tools:

```
create_pull_request      create_repository       create_or_update_file
create_issue             update_issue            push_files
create_branch            fork_repository
```

Every one of them can change your repositories — permanently, in some cases. And not one of them
declares, in a machine-readable way, that it has a side effect.

This is not a GitHub mistake. `create_pull_request` creates pull requests. Its name is honest. The
problem is what the MCP `tools/list` response *can't say*. It returns three things per tool: a **name**,
a **description**, and an **inputSchema**. That's it. There is no field for "this tool mutates state,"
no field for "this requires auth," no field for "this is irreversible." The wire format has nowhere to
put it.

So to a language model, `get_file_contents` and `create_or_update_file` are indistinguishable in
kind — both are just tools you can call. There is no machine-readable flag saying one is a read and
one is a destructive write. The agent can't scope its own authority. It just calls things.

## The twenty-six mediums: unconstrained string inputs

The R1 findings (medium severity) are straightforward: 26 string parameters across the tool surface
with no `maxLength`, `enum`, or `pattern` constraint. Unbounded string inputs are a prompt-injection
payload surface — an attacker who can inject content into a PR body, issue description, or file path
the agent processes can stuff arbitrary instructions through unconstrained parameters.

This is a solvable design choice, not a protocol gap. The parameters exist; they just don't declare
bounds.

## Why the GitHub server scores lowest

It doesn't score lowest because it's poorly built. It scores lowest because it exposes **the most
write surface** of any official server on the board. Eight high-authority write operations — create,
push, fork, mutate repos — with the same structural invisibility as every other MCP tool. The bigger
the write surface, the worse the capability-hygiene score, assuming the protocol can't express authority.

The smaller official servers score better because they *do* less. `server-memory` and
`server-sequential-thinking` have no money operations, no destructive filesystem writes, no code
execution. They score better because there's less to flag — not because they solved the declaration
problem GitHub also has.

## The actual fix

The right answer isn't "GitHub should patch something." The right answer is two things in parallel:

**1. The protocol should grow a side-effect annotation.** If `tools/list` could carry
`"sideEffects": ["write", "irreversible"]` per tool, agents could reason about authority, clients
could filter before granting access, and the eight R3 findings here would resolve immediately. Until
that happens, every MCP scanner is guessing from names — which is the best available, not the right answer.

**2. Until the protocol catches up, constrain at the boundary.** The agent doesn't need to decide
whether `create_or_update_file` is safe to call — you decide, at issuance time, whether the agent
gets a token that covers it. That's the entire thesis of [capframe bind](https://github.com/euanmcrosson-dotcom/capnagent):
mint a capability token scoped to exactly the tools a task requires, with argument constraints baked in.
The agent can't push to main if the token doesn't cover it. The protocol gap becomes irrelevant because
the enforcement isn't in the protocol.

## The full picture

Same scanner, different servers — the contrast is the point. The
[Damn Vulnerable MCP Server](https://capframe.ai/blog/scanning-the-damn-vulnerable-mcp-server)
got two critical arbitrary-execution findings. The
[Anthropic reference servers](https://capframe.ai/blog/scanning-the-official-mcp-reference-servers)
got zero critical and nine highs that trace to the same protocol gap.
The GitHub server gets zero critical and eight highs, also protocol-gap.

| Server | Purpose | Critical | High | Medium |
|---|---|---|---|---|
| Damn Vulnerable MCP | Built to be broken | **2** | 0 | 10 |
| Anthropic reference servers | Built to be right | 0 | 9 | 20 |
| **GitHub MCP** | Production official | **0** | **8** | **26** |

The scanner discriminates. That's what it has to do before anything else it produces is worth reading.

Reproduce it yourself:

```bash
curl -fsSL capframe.ai/install | sh
capframe install find
capframe find your-mcp-inventory.json --out findings.json --format pretty
```

The full breakdown for the GitHub server — and 87 others, mapped to OWASP-LLM, NIST AI RMF, and
CAST — is public and free: **[capframe.ai/leaderboard](https://capframe.ai/leaderboard)**.
If your server is on it and you want the report PDF, just ask.
