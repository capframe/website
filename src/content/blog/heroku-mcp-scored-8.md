---
title: "Heroku's official MCP server scored 8/100. This one actually runs code."
date: "2026-06-12"
description: "Salesforce's official Heroku MCP server scored 8/100 on our leaderboard — the lowest we've seen from a major vendor. Two of its 33 tools are arbitrary execution: a SQL console (pg_psql) and a shell with network + filesystem access (deploy_one_off_dyno). Not a CVE — a capability-hygiene gap, and a vivid one. Here's the honest risk model."
tags: ["security", "mcp", "ai-agents", "capability-hygiene", "leaderboard"]
---

We run a [public security leaderboard for MCP servers](https://capframe.ai/leaderboard): we read the
tool surface a server exposes and score how much authority it hands an AI agent — and how much of that
authority is *declared* in a way the agent can reason about.

Salesforce's official Heroku MCP server scored
[**8/100**](https://capframe.ai/leaderboard/npm-heroku-mcp-server-1-2-2), the lowest we've seen from a
major vendor.

Before the pitchforks: **this is not a vulnerability.** No CVE, no exploit, nothing is leaking. The
score is a transparent heuristic (the weights are published right on the leaderboard). It measures one
thing — and Heroku is a vivid illustration of it.

## Most low scores are undeclared writes. This one is worse.

Most low-scoring servers expose *writes* with no declared side-effects. The official GitHub MCP server
(16/100) was a good example — `create_repository`, `create_or_update_file`, all high-authority, none
flagged. Heroku goes further. Two of its 33 tools are **arbitrary execution**:

- `pg_psql` — *"Execute SQL queries: analyze, debug, modify schema, manage data."* A free-form SQL
  string. That's a database console.
- `deploy_one_off_dyno` — in Heroku's own words, *"Run code/commands in Heroku one-off dyno with
  network and filesystem access."* That's a shell.

## The honest risk model

Both tools require *your* Heroku API token. This is **not** unauthenticated remote code execution —
nobody can run code on your dynos from the outside, and it would be dishonest to imply otherwise.

The risk is subtler, and for anyone wiring agents into their infrastructure, more relevant. An agent
you've connected to Heroku holds, in its toolset, an arbitrary-SQL tool and an arbitrary-command tool.
A prompt injection — a poisoned issue it reads, a malicious page it scrapes — can steer it into calling
them. And nothing in the schema declares that `deploy_one_off_dyno` is destructive, or bounds what
`command` can contain, so the agent has no way to scope its own authority. To the model, `pg_info` (a
read) and `pg_psql` (run any SQL) are just two tools.

## This isn't a Heroku problem

We've scanned roughly 80 MCP servers. The majority expose write, money, or irreversible actions with no
declared side-effects and no limits. Heroku just exposes two of the sharpest — a SQL console and a
shell — so it lands near the bottom. The official servers aren't exceptions; they tend to expose the
*most* surface.

The fix isn't a patch. It's **capability hygiene**: declare side-effects per tool, bound the inputs,
and scope what the agent is actually allowed to call — gating the execution tools behind an explicit,
narrow capability. Find the surface, bind the authority, guard the calls. That's the entire reason
Capframe exists.

The full breakdown for Heroku — mapped to OWASP-LLM and NIST AI RMF — is public and free:
[capframe.ai/leaderboard/npm-heroku-mcp-server-1-2-2](https://capframe.ai/leaderboard/npm-heroku-mcp-server-1-2-2).
If your server's on [the board](https://capframe.ai/leaderboard) and you'd like the report, just ask.
