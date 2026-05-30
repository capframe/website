---
title: "Sandbox-grade scoring: the MCP leaderboard now runs your server before grading it"
date: "2026-05-30"
description: "We upgraded capframe.ai/leaderboard to actually run MCP servers in an ephemeral Docker container instead of reading their READMEs. Four official @modelcontextprotocol/server-* packages dropped from a false-clean score of 100 to 64–98. Here's the diff and the design."
tags: ["security", "mcp", "leaderboard", "sandbox"]
---

When we launched [capframe.ai/leaderboard](https://capframe.ai/leaderboard)
two weeks ago, all four official `@modelcontextprotocol/server-*` npm
packages scored a perfect **100**. That was wrong.

Today they don't.

| Server | Old score | New score | Findings |
|---|---|---|---|
| `@modelcontextprotocol/server-filesystem` | 100 | **64** | 3 high, 12 medium |
| `@modelcontextprotocol/server-memory` | 100 | **78** | 5 high, 1 medium |
| `@modelcontextprotocol/server-everything` | 100 | **84** | 1 high, 6 medium |
| `@modelcontextprotocol/server-sequential-thinking` | 100 | **98** | 1 medium |

Same servers. Same rules. The only thing that changed is we stopped
asking "what does the README claim?" and started asking "what does the
server actually expose when you talk to it?"

That's the upgrade. This post is about why it was overdue, how we
built it, and what it's not yet.

---

## What was wrong with reading the README

The original `mcp-recon producer registry` reads each MCP server's
`README.md` from the npm or PyPI registry, parses it into a tool
inventory, and runs the classifier against names + descriptions.

That gets you a long way. Rule **R3** (excessive agency — name implies
a side effect that isn't declared) fires fine. So does **R5** (tool
naming conflict), **R6** (suspect description), and **R7** (privileged
operation lacking auth gates). For the official MCP servers, none of
those fired because the READMEs are well-written and the names are
benign.

But four of our seven classifier rules need the actual JSON Schema of
each tool's parameters. README parsing can't give you that:

- **R1** flags tools that accept an unconstrained `string` (no
  `enum`, no `pattern`, no `format`, no `maxLength`).
- **R2** flags URL-typed inputs that don't constrain the scheme or
  host (SSRF surface).
- **R4** flags tools accepting a broad object that lets callers pass
  arbitrary structured data through.

Without the schema, those three rules are dark. The official servers
got the maximum score not because they're perfect, but because we
couldn't *see* what made them imperfect.

## What changed

The new `mcp-recon producer sandbox` does what every MCP client does:
it spawns the server over stdio, sends `initialize`, waits for the
response, sends `notifications/initialized`, then sends `tools/list`
and captures the result.

The catch: we don't want to run arbitrary npm packages on our build
runner. So the spawn happens inside an ephemeral Docker container —
`node:20` for npm packages, `python:3.12-slim` for PyPI — with
memory caps, a wall-clock budget, and `--network bridge` so the
container can `npm install` / `pip install` but can't poke the host.

The handshake itself is done by a tiny shim that gets piped into the
container alongside the package install:

```
docker run --rm -i node:20 sh <<'EOF'
  npm install @modelcontextprotocol/server-filesystem@2026.1.14
  node shim.js @modelcontextprotocol/server-filesystem
EOF
```

The shim performs the MCP handshake, captures the `tools/list`
response, and writes it to stdout wrapped in marker lines so any
server logging in the same stream gets ignored.

What comes out the other side is the real, current tool inventory,
parameter schemas included. The classifier runs against *that*.

## What it caught on the four official servers

**`server-filesystem`** — 100 → 64.
Six tools accept paths with no constraint on what `..` traversals
they tolerate or what the filesystem boundary is. Three of those
mutate (write, edit, move). The rest read. R1 fires on all six, R3
fires on the three mutating ones because the name implies a side
effect (`write_file`, `edit_file`, `move_file`) without a declared
authorization scope.

**`server-memory`** — 100 → 78.
Five tools that mutate the memory graph (`create_entities`,
`create_relations`, `delete_entities`, `delete_relations`,
`add_observations`). All five trip R3 — the names announce mutations
the manifest doesn't gate.

**`server-everything`** — 100 → 84.
This is the reference server. Six tools accept unconstrained strings
(R1), and `toggle-subscriber-updates` trips R3.

**`server-sequential-thinking`** — 100 → 98.
One tool. One R1. That's it.

## Two producers, not one

The leaderboard now runs both producers nightly. The registry path
still does what it always did — scan every server in our 50-package
corpus, fast, cheap, broad. The sandbox path is curated: it only
runs against a smaller list of high-value servers because the
container cost adds up.

The interesting design detail: both producers write to the same
output directory using a filename derived from the package handle.
When the sandbox path runs after the registry path, it overwrites
the same slug files with higher-fidelity findings. The aggregator
that builds the leaderboard JSON doesn't have to know about either
producer — it just reads the files that ended up on disk.

That means we can keep expanding the sandbox-scanned set one server
at a time without touching the aggregator. The next batch — PyPI
servers — is queued behind the Python shim landing.

## What it can't tell you

Three things, in increasing order of importance:

1. **Behavioral findings, not architectural ones.** The classifier
   sees the tool surface, not the implementation. It can tell you
   `read_file` accepts an unconstrained path. It can't tell you the
   server resolves that path against the working directory and
   doesn't check for symlinks.
2. **Static rules only.** Today's classifier is seven hand-written
   rules. A model-graded review would catch failure modes the rules
   miss — things like "this tool's description and behavior diverge"
   or "this looks like a CRLF injection sink." That's a follow-up.
3. **It's the *server's* surface, not the *agent's* policy.** A
   server with R3 findings isn't broken; it's a server that needs
   a tighter policy bound to it. The findings tell you what to bind
   against — they're the input to [capnagent](https://github.com/euanmcrosson-dotcom/capnagent),
   not a verdict on the server.

## Try it

The leaderboard is live at
[capframe.ai/leaderboard](https://capframe.ai/leaderboard). Click any
row to expand the per-server findings. The four servers above carry a
`sandbox` source tag now; everything else is still `registry`. That
gap closes one slug at a time.

If you maintain an MCP server and you want it sandbox-scanned, open
an issue at
[github.com/euanmcrosson-dotcom/mcp-recon](https://github.com/euanmcrosson-dotcom/mcp-recon)
with the handle. We'll add it to the next corpus pass.
