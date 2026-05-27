---
title: "We scanned 16 popular MCP servers. Three ship arbitrary code execution — and our own scanner was wrong in both directions."
date: "2026-05-27"
description: "After the lab extremes — a server built to be broken (2 critical) and the official reference servers (0 critical) — we pointed Capframe at the messy middle: 16 MCP servers people actually npm-install. 111 tools, live. Three expose arbitrary JavaScript execution. Getting there meant fixing a false-positive class AND a false-negative class in our own classifier, both shipped."
tags: ["security", "mcp", "classifier", "ai-agents", "dogfooding"]
---

The last two posts were the extremes. We scanned the
[Damn Vulnerable MCP Server](https://capframe.ai/blog/scanning-the-damn-vulnerable-mcp-server)
— built to be broken — and it lit up with two criticals. We scanned the
[official Anthropic reference servers](https://capframe.ai/blog/scanning-the-official-mcp-reference-servers)
— built to be right — and it came back zero critical. Lab conditions, both ends
of the spectrum.

The real world is the messy middle: the third-party MCP servers people actually
`npm install` into Cursor, Claude Desktop, and Cline. So I built a config of 16
well-known ones and ran `mcp-recon enumerate` against all of them, live.

The short version: **three of them hand an agent arbitrary code execution.** The
longer, more useful version is that getting an honest answer meant fixing my own
scanner — which turned out to be wrong in *both* directions on real-world data.

## The set, and what even connected

Sixteen servers: the four Anthropic reference servers, the Python `uvx` trio
(`fetch`, `git`, `time`), and a spread of popular third-party ones — Playwright,
Puppeteer, Context7, GitHub, GitLab, Slack, Google Maps, Postgres, Brave Search.

```bash
mcp-recon enumerate popular-servers.config.json --out inventory.json
mcp-recon --target inventory.json --out findings.json --pretty
```

**12 of 16 connected and enumerated — 111 tools.** The four that didn't
(`brave-search`, `gitlab`, `google-maps`, `slack`) all exit at startup without
their API keys, which is itself a clean signal: they refuse to even describe
themselves unauthenticated.

One result worth flagging on its own: **GitHub's server enumerated all 26 of its
tools with no token supplied.** It validates credentials when you *call* a tool,
not when you *list* them — so the full attack surface is discoverable before any
auth. Enumerability is not authorization, and a recon tool gets to see everything
the protocol will advertise.

| Server | Tools | | Server | Tools |
|---|---|---|---|---|
| github | 26 | | memory | 9 |
| playwright | 23 | | puppeteer | 7 |
| filesystem | 14 | | context7 | 2 |
| everything | 13 | | time | 2 |
| git | 12 | | fetch / postgres / seq-thinking | 1 each |

## The numbers

```
total: 109  |  by severity: { critical: 3, high: 19, medium: 87 }
by rule:  { r1: 86, r3: 19, r6: 1, r7: 3 }
```

Most of it (86 × R1) is hygiene: unconstrained string parameters, a real but
low-stakes injection surface. The 19 highs are all one rule — more on that below.
The three you triage first are the criticals.

## The three criticals: arbitrary JavaScript, in tools you've installed

All three are browser-automation execution surfaces:

```
puppeteer_evaluate       (Puppeteer)   "Execute JavaScript in the browser console"
browser_evaluate         (Playwright)  "Evaluate JavaScript expression on page or element"
browser_run_code_unsafe  (Playwright)  "Run a Playwright code snippet. Unsafe: executes
                                         arbitrary JavaScript in the page context."
```

To be fair to these projects: this is *documented, intentional* functionality —
running JavaScript is how you script a browser, and one of them is honest enough
to put `unsafe` right in the name. This is not a vulnerability report.

It's a **capability** report. Each of these tools, handed to an agent, is
arbitrary code execution in the browser's context. Wire one to an agent that also
ingests untrusted web content — which is the entire point of a browser tool — and
a hostile page can carry instructions that drive `browser_evaluate` to exfiltrate
session tokens, pivot to internal URLs, or scrape whatever the browser can see.
That's the LLM08 excessive-agency pattern at maximum authority, and it's the thing
a scan exists to push to the top of the report. It did.

## The part where my own scanner was wrong

A scanner only earns the right to flag `browser_run_code_unsafe` by being correct
about everything else. Scanning 111 real-world tools proved mine wasn't — in both
directions. Both bugs had the same root cause: **matching keywords by substring
instead of by meaning.**

**False positives (fixed in [v0.0.8](https://github.com/euanmcrosson-dotcom/mcp-recon/releases)).**
The first run had 119 findings. Twelve were wrong:

- `get_issue`, `list_issues`, `search_issues` — flagged as **mutations**, because
  the rule matched the verb `"issue"` inside the noun `"issues"`. These are reads.
- `max_length` — flagged as an unbounded **money/quota** value, because it matched
  the fragment `"max"`. It's a content-length cap.
- `browser_resize`, `browser_tabs`, `browser_take_screenshot` — flagged as
  **external-fetch** surfaces, because `"browse"` is a substring of `"browser"`.

**A false negative (fixed in [v0.0.9](https://github.com/euanmcrosson-dotcom/mcp-recon/releases)).**
This one mattered more. The scanner caught `puppeteer_evaluate` — but only because
its description starts with the verb "Execute." It **missed** `browser_evaluate`
and `browser_run_code_unsafe`, the latter of which literally says *"executes
arbitrary JavaScript."* A security scanner that misses a tool with `unsafe` in its
name has no business existing.

The fix for both was the same: stop matching bare substrings. Tool names are now
tokenized on separators and camelCase and matched as whole tokens (so `issue`
≠ `issues`, `set` ≠ `reset`, `browse` ≠ `browser`), and R7 learned the
JavaScript-evaluation vocabulary it was missing. Six regression tests for the
false positives, two for the false negative — all written test-first, all locking
these exact tool names so the numbers in this post can't silently drift. That's
what moved 119 → 107 → a true **109 with three criticals.**

A scanner that cries wolf on `get_issue` while sleeping through
`browser_run_code_unsafe` is worse than no scanner — it teaches you to ignore it.
The only way I know to earn back the trust is to find both failures on real data,
fix them in public, and pin them with tests.

## The 19 highs are the same protocol gap as last time

Every one of the 19 high-severity findings is **R3**: the tool's name implies a
mutation (`write_file`, `delete_entities`, `create_repository`, `create_issue`,
`git_create_branch`, …) but it declares no side-effects. Spread across six
independent servers — filesystem, memory, git, github, the everything server, and
Playwright.

This is the exact finding from the reference-server post, now confirmed across a
dozen unrelated third-party servers: **0 of 111 tools declare a single
side-effect.** Not negligence — the MCP `tools/list` response has no field for it.
The wire format cannot say "`delete_entities` is destructive," so a scanner is left
inferring authority from names, and an *agent* is left guessing entirely.

That gap is the whole reason [Bind](https://github.com/euanmcrosson-dotcom/capnagent)
exists. If the protocol won't tell your agent that `browser_run_code_unsafe` is
arbitrary execution, you don't hope the model figures it out — you mint a
capability token that never grants it, and deny everything outside the token at
the boundary.

## The point

The messy middle looks like this: a long tail of input hygiene, a consistent layer
of undeclared-mutation findings that trace straight back to a protocol gap, and a
small number of genuine criticals you cannot afford to miss. Three popular servers
ship arbitrary code execution — correctly, by design — and the job of a scanner is
to surface those three above the other hundred-and-six without crying wolf and
without falling asleep.

Run it against the config your team actually uses:

```bash
curl -fsSL capframe.ai/install | sh
capframe install find
mcp-recon enumerate your-claude_desktop_config.json --out inventory.json
mcp-recon --target inventory.json --pretty
```

If a tool gets past the rules — a false positive *or* a false negative — that's
not a gotcha, it's the next test.
[Open an issue.](https://github.com/euanmcrosson-dotcom/mcp-recon/issues)
