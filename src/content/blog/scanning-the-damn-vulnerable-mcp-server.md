---
title: "We pointed Capframe at the Damn Vulnerable MCP Server (and it found a gap in itself)"
date: "2026-05-27"
description: "Dogfooding the Find module against a purpose-built insecure MCP server. It flagged all 10 tools for unconstrained input — but rated an arbitrary-shell-execution tool identically to a username lookup. Here's the gap that surfaced, the rule we added, and what the scanner still misses."
tags: ["security", "mcp", "dogfooding", "classifier", "ai-agents"]
---

The best way to find out whether a security scanner is any good is to point it
at something that's actually insecure. So I pointed Capframe's
[Find module](https://github.com/euanmcrosson-dotcom/mcp-recon) at the
[Damn Vulnerable MCP Server](https://github.com/harishsg993010/damn-vulnerable-MCP-server)
(DVMCP) — a deliberately-broken MCP server with 10 challenges, the MCP
equivalent of DVWA. Built to be exploited, so scanning it is fair game.

The result was useful in a way I didn't expect: **it found a real gap in
Capframe's own rules.** This post is the honest walk-through.

## Setup

DVMCP's challenges are Python servers. I built a faithful
[`mcp-recon.inventory.v1`](https://capframe.ai/blog/why-findings-v1) from the
actual tool signatures across four challenges — prompt injection (challenge 1),
excessive permissions (3), code execution (8), and remote access (9). Real tool
names, real parameters: `execute_shell_command(command: string)`,
`read_file(filename: string)`, `port_scan(host, port)`, and so on. None declare
side-effects, auth, or input constraints — faithful to a server that's meant to
be wrong.

The inventory is committed at
[`examples/dvmcp.inventory.json`](https://github.com/euanmcrosson-dotcom/mcp-recon/blob/master/examples/dvmcp.inventory.json),
so everything below reproduces with:

    capframe find examples/dvmcp.inventory.json --out findings.json --pretty

## First run: correct, and yet clearly wrong

```
total: 10  |  by severity: { critical: 0, high: 0, medium: 10 }
by rule: { r1: 10 }
```

Every one of the ten tools got flagged for unconstrained string input (rule R1).
That's *correct* — none of them bound their inputs, and an unconstrained string
is a real injection/payload surface.

But look at the severity column: **everything is medium.** Which means the
scanner rated this:

```
execute_shell_command(command: string)   →  medium
```

exactly the same as this:

```
get_user_info(username: string)          →  medium
```

One of those runs arbitrary shell commands on the host. The other looks up a
username. Rating them identically is not a small miss — it's the scanner failing
at the one job that matters most, which is telling you *what to panic about
first.*

## The gap

I went looking for why. Capframe's classifier had six rules (R1–R6): unconstrained
input, missing auth on side-effecting tools, side-effect/name mismatch, unbounded
money params, undeclared-money, and external-fetch surfaces. Reasonable coverage —
except **none of them fire on "this tool executes code."**

Worse, the two rules that *should* have caught it both no-op'd here:

- **R2 (missing auth on side-effecting tool)** gates on *declared* side-effects.
  DVMCP declares none — so R2 had nothing to key on. A tool that doesn't admit
  it has side effects sails straight past the side-effect rule.
- **R3 (name implies a side-effect not declared)** keys on a list of mutation
  verbs (delete, send, refund, …). "execute" wasn't in the list. Neither was
  "exec" or "shell."

So the single most dangerous category in the whole space — arbitrary code
execution — had no dedicated detector, and the adjacent rules were defeated by a
server simply declining to describe itself honestly. Which, of course, is exactly
what a real vulnerable server does.

## The fix: R7

I added a seventh rule. R7 fires **Critical** when a tool's name or description
implies code, shell, or subprocess execution — `execute_`, `shell command`,
`eval(`, `subprocess`, `arbitrary code`, and friends. Crucially, it **ignores
declared side-effects entirely.** The whole lesson from DVMCP is that the
declaration can't be trusted, so R7 keys only on the strongest available signal:
the tool is telling you, in its own name and docstring, that it runs code.

The rule was added test-first — three unit tests (shell tool → critical, code
execution by description, benign tool stays silent) plus an integration test that
locks the DVMCP numbers so this post's figures can't silently drift.

## Second run

```
total: 12  |  by severity: { critical: 2, high: 0, medium: 10 }
critical: [ execute_python_code, execute_shell_command ]
```

Now the two RCE tools sit at the top of the report where they belong, and the
other eight unconstrained-input findings remain as medium. That's an honest
severity picture: *these two will get you owned; the rest are hygiene.*

## What R7 still misses (because a security post without this is marketing)

Dogfooding doesn't stop at one rule. Two things the scanner still under-rates on
DVMCP, both now tracked as work:

1. **Command injection through "safe-looking" parameters.** Challenge 9's
   `network_diagnostic(target, options)` shells out with `options` interpolated
   in. The description says "run comprehensive network diagnostics" — no `execute`
   token — so R7 doesn't fire. Catching this needs taint-style reasoning about
   which string params reach a shell, which a name/description heuristic can't do
   alone.

2. **The "declares nothing" problem in general.** R2 and R3 were both defeated by
   missing declarations. There's a case for a rule that flags *any* tool which
   declares no side-effects at all as "unclassified — review," rather than
   assuming absence means safe. That's a future R8.

Both are now [good-first-issues](https://github.com/euanmcrosson-dotcom/mcp-recon/issues)
if anyone wants them.

## The actual point

A heuristic classifier is a **floor, not a ceiling.** It won't catch everything,
and the moment you claim it does, a server like DVMCP makes you look silly. What
makes it useful is two things:

1. **It's extensible by anyone.** R7 is ~40 lines + four tests. Each rule maps a
   detectable signal to a severity and a set of OWASP/NIST/MITRE IDs. The gap I
   found took an afternoon to close, and the next person's gap will too.

2. **The output is a [shared schema](https://capframe.ai/blog/why-findings-v1).**
   Every finding R7 emits is a `findings.v1` record — same envelope as R1, same
   envelope any other tool could emit. The scanner improving doesn't change the
   contract; it just fills it in better.

The DVMCP scan shipped in [mcp-recon v0.0.5](https://github.com/euanmcrosson-dotcom/mcp-recon/releases),
example inventory and all. Run it yourself:

    curl -fsSL capframe.ai/install | sh
    capframe install find
    capframe find <(curl -s https://raw.githubusercontent.com/euanmcrosson-dotcom/mcp-recon/master/examples/dvmcp.inventory.json) --pretty

If you find a tool surface that gets past all seven rules — and you will — that's
not a gotcha, it's the next rule. [Open an issue.](https://github.com/euanmcrosson-dotcom/mcp-recon/issues)
