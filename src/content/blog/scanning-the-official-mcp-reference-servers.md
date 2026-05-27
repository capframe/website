---
title: "We scanned the official MCP reference servers — live. Zero critical, nine high, and a hole in the protocol."
date: "2026-05-27"
description: "Last time we pointed Capframe's Find module at a server built to be broken — 2 critical. This time we ran it live against the official Anthropic MCP reference servers. Same seven rules, opposite verdict: 0 critical. But all nine high-severity findings traced back to one thing the MCP protocol can't express — and that's the interesting part."
tags: ["security", "mcp", "classifier", "ai-agents", "protocol"]
---

The [last post](https://capframe.ai/blog/scanning-the-damn-vulnerable-mcp-server)
pointed Capframe's [Find module](https://github.com/euanmcrosson-dotcom/mcp-recon)
at a server built to be broken — the Damn Vulnerable MCP Server — and it surfaced
two **critical** arbitrary-execution tools sitting at the top of the report where
they belonged.

That answers "does it light up on garbage." The harder question for any scanner
is the inverse: **does it stay quiet on things that are actually fine?** A scanner
that screams critical at everything is exactly as useless as one that screams at
nothing. So I pointed the same seven rules at the canonical "do it right"
implementations — the official MCP reference servers Anthropic ships.

And this time I didn't hand-author the inventory. I ran it **live.**

## Live enumeration, not a transcription

The DVMCP post had one honest weakness: I built the inventory by reading the
challenge source and transcribing the tool signatures by hand. Faithful, but
mine. For the reference servers I used `mcp-recon enumerate` (shipped in v0.0.6),
which does the real thing:

- launches each configured MCP server as a subprocess over stdio,
- performs the actual `initialize` handshake,
- calls `tools/list`,
- and builds the [`inventory.v1`](https://capframe.ai/blog/why-findings-v1) from
  whatever the server actually reports.

No transcription, no interpretation. The tools in the inventory are the tools the
servers themselves declared, on my machine, on a Tuesday.

The config is four servers, exactly as you'd run them:

```json
{
  "mcpServers": {
    "everything":         { "command": "npx", "args": ["-y", "@modelcontextprotocol/server-everything"] },
    "filesystem":         { "command": "npx", "args": ["-y", "@modelcontextprotocol/server-filesystem", "."] },
    "memory":             { "command": "npx", "args": ["-y", "@modelcontextprotocol/server-memory"] },
    "sequentialthinking": { "command": "npx", "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"] }
  }
}
```

```bash
mcp-recon enumerate servers.config.json --out inventory.json
mcp-recon --target inventory.json --out findings.json --pretty
```

```
  ✓ everything — 13 tools
  ✓ filesystem — 14 tools
  ✓ memory — 9 tools
  ✓ sequentialthinking — 1 tools
```

## The numbers

```
total: 29  |  by severity: { critical: 0, high: 9, medium: 20 }
by rule:  { r1: 20, r3: 9 }
```

37 tools enumerated, 29 findings, **zero critical.** Put that next to the
deliberately-broken server, scanned with the identical rule set:

| | tools | critical | high | medium |
|---|---|---|---|---|
| **Damn Vulnerable MCP** (built to be broken) | 10 | **2** | 0 | 10 |
| **Anthropic reference servers** (built to be right) | 37 | **0** | 9 | 20 |

That contrast is the whole point. Same seven deterministic rules, run blind. The
purpose-built target gets two criticals; the canonical implementations get none.
The scanner isn't flagging everything — it's separating the server that runs
arbitrary shell commands from the servers that don't. That's the property a
classifier has to earn before any of its other output is worth reading.

> **An honest aside on that "37."** While doing an honesty sweep of this project,
> I deleted an old writeup that *claimed* these servers exposed "37 tools across
> four servers" — claimed, because at the time I hadn't actually run it. When I
> finally enumerated them for real, it came back 37. The fabricated number
> happened to be right. That's not vindication, it's a coincidence, and a number
> you didn't reproduce isn't evidence even when it's correct. So: 37 tools, live,
> reproducible with the commands above. *That* is why it's in this post.

## The nine highs are all one rule — and it points at the protocol

Every single high-severity finding came from **R3** (*tool name implies a
mutation, but the tool declares no side-effects*):

```
high: write_file, edit_file, create_directory          (filesystem)
      create_entities, create_relations, delete_entities,
      delete_observations, delete_relations             (memory)
      toggle-subscriber-updates                          (everything)
```

These are not bugs in the reference servers. `delete_entities` deletes entities;
its name is honest. So why does a tool doing exactly what it says get flagged
high?

Because of what the MCP protocol *can't say*. `tools/list` returns three things
per tool: a **name**, a **description**, and an **inputSchema**. That's it. There
is no field for "this tool mutates state," no field for "this tool requires auth,"
no field for "this is destructive." I checked the enumerated inventory:

```
tools with declared side_effects: 0 / 37
tools declaring auth_required:    0 / 37
```

Not because Anthropic forgot — because **the wire format has nowhere to put it.**
A server literally cannot tell a client "delete_entities is destructive" through
`tools/list`. The information doesn't exist at the protocol layer.

So R3 does the only thing it can: when a tool's *name* screams mutation
(`delete_`, `write_`, `create_`) and the declaration that would contextualize it
is structurally absent, it raises a flag for a human. On DVMCP that gap let a
real attack hide. On the reference servers it produces nine findings that are
technically correct and operationally "yeah, obviously `delete_entities`
deletes." Same gap, different stakes — and the gap is in the protocol, not the
server.

This is the genuinely interesting result. The reference servers are clean of
critical execution surfaces, and the residual nine highs are a **standing
argument for MCP to carry a capability/side-effect annotation** so clients can
reason about tool authority instead of guessing from names. Until it does, the
guessing is the best a scanner can do — and the constraint has to be applied
somewhere the protocol can't.

Which is the entire thesis of the [Bind module](https://github.com/euanmcrosson-dotcom/capnagent):
if the protocol won't tell your agent that `delete_entities` is destructive, you
don't trust the agent to figure it out — you mint a capability token that simply
doesn't grant it, and deny everything outside the token at the boundary. Find
tells you where the protocol can't vouch for a tool. Bind is how you constrain it
anyway.

## Two findings I had to throw out (the honesty tax)

The first live run produced **31** findings, not 29. I read all 31 — which is the
part nobody enjoys and the only part that matters — and two were wrong:

1. **`toggle-subscriber-updates`** tripped the undeclared-money rule (R5) because
   its description mentioned "subscription." It toggles a notification flag. No
   money moves. R5 was pattern-matching the word, not the behavior.

2. **A "download a gzipped file as a resource" tool** tripped the external-fetch
   rule (R6) on the bare word "download." It reads a local file. No network
   egress.

Both are textbook heuristic false positives: the right word, the wrong meaning.
I tightened both rules test-first — R5 dropped "subscribe/subscription" from its
money vocabulary, R6 now requires a bounded phrase (`download the`, `download
from`, `download http…`) instead of the bare verb — added the regression tests,
and shipped the fix as
[mcp-recon v0.0.7](https://github.com/euanmcrosson-dotcom/mcp-recon/releases).
That's what dropped 31 to a clean 29. (`toggle-subscriber-updates` still shows up
as a high — correctly, via R3 — because "updates" *is* a mutation verb. It lost
the bogus R5 flag, not the legitimate R3 one.)

A heuristic classifier has a false-positive tax. The deal you make is that you
pay it in public: every rule is ~40 lines, every fix is test-locked, and the
numbers in this post regenerate from a tagged release.

## The point

Same scanner, two servers, opposite verdicts — and both verdicts are right. The
broken server gets its two criticals. The reference servers get a clean zero, and
their nine highs aren't a vendor failing, they're the shape of a protocol that
can't yet describe what its own tools do.

Reproduce the whole thing:

```bash
curl -fsSL capframe.ai/install | sh
capframe install find
mcp-recon enumerate your-claude_desktop_config.json --out inventory.json
mcp-recon --target inventory.json --pretty
```

Point it at *your* config — the one your team actually runs — and see which of
your tools the protocol can't vouch for. If something gets past all seven rules,
that's not a gotcha, it's the next rule.
[Open an issue.](https://github.com/euanmcrosson-dotcom/mcp-recon/issues)
