---
title: "The MCP security spread: the servers that do the most score the worst"
date: "2026-06-03"
description: "We now grade 84 MCP servers by running them in an ephemeral sandbox and scoring their real tool schemas. A clear pattern fell out: read-only docs servers score in the 90s, while the servers that actually act — scrape, automate, run code — score in the 0s to 40s. Tool surface is attack surface."
tags: ["security", "mcp", "leaderboard", "ai agents"]
---

The [Capframe leaderboard](https://capframe.ai/leaderboard) now grades **84 MCP servers**. Each one is run in an ephemeral Docker sandbox (or handshaked live over HTTP), so we score the server's *actual* `tools/list` — real parameter schemas, not a README. The classifier is deterministic and rule-based: same input, same findings, no LLM in the decision path.

After the latest batch, a pattern was impossible to miss. It's not subtle, and once you see it you can't unsee it.

## The spread

The servers that only *read* score near the top:

| Server | Score | What it does |
|---|---|---|
| `grep.app` | **98** | Code search (read-only) |
| Microsoft Learn | **92** | Docs lookup (read-only) |
| OpenAI Docs | **88** | Docs lookup (read-only) |

The servers that actually *do things* score near the bottom:

| Server | Score | What it does |
|---|---|---|
| A funded scraping startup's server | **0** | Crawl, search, interact with pages |
| `@wonderwhy-er/desktop-commander` | **14** | Run shell commands, edit files |
| The official GitHub MCP server | **16** | Create/update files, manage repos |
| A major CRM's official server | **40** | Read/write CRM records |
| A browser-automation startup's server | **72** | Drive a headless browser |

Same scanner. Same rules. The only variable that moved was **how much the server lets an agent actually do.**

## Why "does more" means "scores worse"

This isn't the scanner being unfair to the useful servers. It's measuring something real: **a tool surface is an attack surface, and a richer surface accumulates more of three specific, boring gaps.**

1. **Unbounded numeric inputs.** A `limit`, `quantity`, or `maxResults` parameter with no `maximum` in the schema. On a read-only docs server there's nothing to bound. On a usage-billed scraper or a booking tool, an agent that's been prompt-injected can drive that number arbitrarily high — runaway spend, runaway quota — and nothing at the tool boundary stops it.

2. **Undeclared side-effects.** A tool named `create_*`, `update_*`, `delete_*`, or `set_*_visibility` that mutates state but declares no side-effect in its schema. A policy layer in front of the agent can't tell it apart from a harmless read, so it can't gate it. Docs servers have none of these. Product servers are full of them.

3. **Code- or command-execution surfaces.** The highest-risk class — a tool that runs shell commands, evaluates code, or drives a browser agent. Sometimes this is the entire point of the server (a shell tool *is* a shell tool), but it's also exactly the tool you most want bounded, and the one most servers ship with no constraint at all.

Docs and search servers expose two or three read-only tools. They have almost nowhere for these gaps to hide, so they score in the 90s. A scraping, automation, or CRM server exposes twenty-plus tools that read, write, spend, and act — and the gaps pile up. That's the spread.

## The honest caveats

A few, because the whole point of a security tool is that you shouldn't trust one that rounds up:

- **A read-only scan can't reproduce an exploit.** We see the tool surface, not what's behind it. A flagged finding is "this schema permits something it probably shouldn't," not "here is a working attack."
- **Code-execution flags need a human read.** The rule keys off the tool's declared behavior, and there's a known false-positive class (a tool that *returns* code is not a tool that *runs* code). Every critical on the board is worth confirming against the live tool description before anyone panics.
- **A high score is not a clean bill of health.** It mostly means a small surface. `grep.app` at 98 isn't "more secure than" a CRM at 40 in any absolute sense — it simply has far less an agent can do, so far less to get wrong.

None of this is a knock on the teams shipping these servers. Most of these gaps are one-line fixes — add a `maximum`, declare a `side_effects`, constrain a callback URL. They're invisible precisely because nothing in the MCP spec forces a tool to declare its own authority, so they accumulate quietly until someone reads the schema the way an attacker would.

## The takeaway

If you're shipping an agent that does real work, your security posture isn't a function of the model — it's a function of your tool surface. The more your agents can *do*, the more that surface is worth a careful read.

That's the read we do — deterministic, reproducible, mapped to OWASP LLM Top 10 / NIST AI RMF / MITRE ATLAS. The leaderboard runs it on public servers for free; if you want it pointed at your own stack (MCP server or raw OpenAI/Anthropic/LangChain tool definitions), that's the [Agent Security Audit](https://capframe.ai/#audit) — and the same adversarial eye we turned on [our own engine](https://capframe.ai/blog/red-teaming-my-own-engine).
