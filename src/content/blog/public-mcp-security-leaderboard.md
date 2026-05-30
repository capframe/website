---
title: "We built a public security leaderboard for 48 MCP servers. The official GitHub server ties for worst."
date: "2026-05-30"
description: "capframe.ai/leaderboard ranks every MCP server we can find against deterministic security rules. 4 Critical and 23 High findings across the ecosystem. Updated daily. The score formula is public and the rules are open-source. Here's what it found, how we built it, and what's wrong with it."
tags: ["security", "mcp", "leaderboard", "ecosystem", "ai-agents"]
---

We just shipped a public security leaderboard for the entire MCP
server ecosystem at **[capframe.ai/leaderboard](https://capframe.ai/leaderboard)**.

It ranks 48 MCP servers — the official `@modelcontextprotocol/*` scope
plus 36 well-known community packages from npm and PyPI — against
deterministic security rules. The score formula is public. The rules
are open-source. The data refreshes every day at 07:00 UTC.

The short version: **4 Critical and 23 High findings across the
ecosystem**, distributed across 11 servers. The worst score (68/100)
is a tie between
[`@modelcontextprotocol/server-github`](https://www.npmjs.com/package/@modelcontextprotocol/server-github)
and [`mcp-server-mssql`](https://pypi.org/project/mcp-server-mssql/).
The official GitHub MCP server is one of the riskiest things in the
catalogue.

Here's what the leaderboard is, what it caught, and what it can't tell
you yet.

## The scores, in one table

48 servers ranked. 37 of them score a clean 100 (no findings on the
name/description rules — see caveats below). The 11 with findings:

| Score | Server | Tools | Findings |
|------:|---|------:|---|
| **68** | `npm:@modelcontextprotocol/server-github` | 26 | 8 High |
| **68** | `pypi:mcp-server-mssql` | 21 | 2 Critical + 3 High |
| **80** | `npm:obsidian-mcp` | 12 | 5 High |
| 90 | `pypi:mcp-server-mysql` | 3 | 1 Critical |
| 90 | `pypi:mcp-server-sqlite` | 3 | 1 Critical |
| 92 | `npm:@modelcontextprotocol/server-redis` | 5 | 2 High |
| 92 | `pypi:mcp-server-redis` | 5 | 2 High |
| 94 | `npm:firecrawl-mcp` | 4 | 3 Medium |
| 94 | `pypi:mcp-server-git` | 12 | 1 High + 1 Medium |
| 96 | `npm:@gongrzhe/server-gmail-autoauth-mcp` | 6 | 1 High |
| 96 | other gongrzhe entries | … | … |

The full ranking — with last-scan timestamps and per-row severity
breakdowns — lives at
[capframe.ai/leaderboard](https://capframe.ai/leaderboard).

## What "Critical" and "High" actually mean here

The rules that fire are the same ones in `findings.v1.json` —
[open-source schema, open-source code](https://github.com/euanmcrosson-dotcom/mcp-recon).
For this leaderboard we run the **static-manifest path**: every entry
in the corpus is graded by reading its npm or PyPI metadata + README,
parsing the tool surface out of common documentation patterns
(markdown tables, sub-headings, numbered lists), and running the
deterministic classifier across the result. No package is installed.
No code is executed. The grading is read-only.

In static-manifest mode, the rules that *can* fire are:

- **R3** — Tool name implies a side effect that's not declared. Fires
  on names like `create_repository`, `delete_branch`, `update_file`,
  `merge_pull_request` when the package doesn't tell us those mutate
  state.
- **R5** — Description mentions money but the side-effects don't.
- **R6** — Description implies external fetch / web URLs. Indirect
  prompt injection surface.
- **R7** — Name or description implies code or command execution.
  This is the one that scored the two Criticals on `mcp-server-mssql`
  — exposed `execute_query` + `execute_proc` against a SQL server.

The rules that *can't* fire in static mode are R1/R2/R4, which need
each tool's full parameter schema. Those wait for the
[sandbox producer](https://github.com/euanmcrosson-dotcom/mcp-recon/blob/master/docs/SANDBOX-PRODUCER.md)
to ship — that's where we install + run each server in an ephemeral
microVM and capture the live `tools/list` response. Doc + scaffold are
already in the repo; the provider wiring is the next phase.

## Score formula

```
score = 100 − (10·critical + 4·high + 2·medium + 1·low)   clamped [0, 100]
```

A perfect server with zero findings is 100. One Critical drops you to
90. Ten Criticals (or any weighted combination summing to 100+) clamps
you at 0. Info findings don't affect the score.

The weights are emitted in the leaderboard JSON itself, so any
consumer can compute their own composite without reading source.

## Why `server-github` ties for worst

It's not because the server is badly written. It's because of what
the server *does*. The official GitHub MCP server exposes 26 tools,
and a lot of them mutate state: `create_or_update_file`,
`push_files`, `create_repository`, `create_issue`,
`create_pull_request`, `update_pull_request`, etc. R3 fires on every
mutation tool whose declared side-effects don't include the
corresponding flag.

That's not a bug-find. It's the rule doing its job: making it
**visible at a glance** that an agent given access to this server can
do real damage. The next layer — Capframe Bind, which wraps each
tool with a capability token and an explicit allow-list of side
effects — is where the operator opts in to specific mutations. The
leaderboard's job is to surface the surface.

`mcp-server-mssql` ties for worst because it ships R7 Criticals:
`execute_query` and `execute_proc` are arbitrary SQL by name alone.
That's also fair — anyone deploying this to an MCP-using agent needs
to know what they're giving away.

## How it stays fresh

Every day at 07:00 UTC:

1. A GitHub Actions workflow in `capframe/capframe` checks out
   `mcp-recon` and the aggregator binary, builds both, and runs the
   producer over a curated corpus of npm + PyPI MCP packages.
2. Each package's `latest` version is resolved live from its registry
   at scan time. Versions in the corpus are *suggestions*; the cron
   re-resolves so the leaderboard tracks current releases, not
   snapshots.
3. The aggregator emits a `capframe.leaderboard.v1` JSON document
   ranking the servers by score.
4. A bot account commits the refreshed JSON back into the website
   repo. Vercel auto-deploys.
5. At 07:30 UTC a Vercel Cron route revalidates the page so any ISR
   layer bumps on the same cadence as the data.

No manual step. The whole pipeline is in
[`docs/leaderboard-pipeline.md`](https://github.com/capframe/website/blob/main/docs/leaderboard-pipeline.md).

## What this won't tell you

The leaderboard is honest about its scope. Things it can't see:

- **Runtime behaviour.** R1/R2/R4 (parameter-schema rules) don't fire
  in static mode because we don't have the schemas. A package that
  takes an unbounded numeric parameter for refund amount doesn't get
  flagged here. The sandbox producer will close this.
- **Bad implementations.** If `read_file` actually calls `os.system`
  internally because the maintainer cut a corner, this leaderboard
  doesn't know. Runtime tracing belongs to
  [Capframe Guard](https://capframe.ai#guard), not Find.
- **Servers that aren't published.** If your MCP server lives in a
  private repo and not on npm or PyPI, it's not on the leaderboard.
  Open an issue if you want yours included; we can graft a custom
  corpus entry.
- **Severity calibration.** A server that exposes
  `create_or_update_file` is graded the same whether it sits behind
  capability tokens (good) or is wired to a Slack bot anyone can DM
  (bad). The leaderboard grades the *surface*, not the *deployment*.

## How to read your score

If you maintain a server on the list and it's not at 100, look at the
per-row breakdown on the leaderboard page. The full
`findings.v2.json` for every server is committed alongside the daily
sample — you can grep it for the exact tool names that tripped the
rules.

If the rules are wrong about your server — say, `delete_user` does
not actually delete anything because the server requires explicit
confirmation — the right fix is to declare the side-effects accurately
in your tool definitions. Both R3 and R7 stop firing on tools whose
declared side-effects match what their name implies. The schema is in
[`findings.v1.json`](https://github.com/capframe/capframe/blob/main/schemas/findings.v1.json).

## What's next

Three things in the next month:

1. **Sandbox producer** — install + run each server in an ephemeral
   microVM, capture `tools/list` live, fire every rule. Design is in
   [`docs/SANDBOX-PRODUCER.md`](https://github.com/euanmcrosson-dotcom/mcp-recon/blob/master/docs/SANDBOX-PRODUCER.md);
   provider integration is the next build.
2. **Bigger corpus** — we're at 48; the npm + PyPI MCP universe is
   already in the hundreds and growing. Open a PR adding your
   favourite.
3. **Per-server detail pages** — click a row, see every finding with
   the tool name + rule that fired. Today the leaderboard is summary
   only; the underlying data already supports the detail view.

The leaderboard exists because *deterministic*, *open-source*, *daily*
security signal on the agent-tool ecosystem is the prerequisite for
anyone — operators, founders, auditors — to make sane choices about
which MCP servers they ship into production. We don't have to wait for
an industry body to mint it. The schema is open, the scoring is
public, the corpus is in a repo, and the page updates itself.

If something on the leaderboard surprises you, [file an issue](https://github.com/capframe/capframe/issues).
If you want your server on it, [file an issue](https://github.com/capframe/capframe/issues).
If you think the rules are wrong, [file an issue](https://github.com/capframe/capframe/issues).

[**capframe.ai/leaderboard**](https://capframe.ai/leaderboard)
