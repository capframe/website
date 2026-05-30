---
title: "How a Critical became a documented false positive: R7 on code generators"
date: "2026-05-30"
description: "While expanding the capframe HTTP corpus, our R7 classifier rule flagged two Critical findings on OpenZeppelin's Cairo MCP server. Both were wrong. Here's how we caught it before publishing, what the fix looks like, and why the discipline matters more than the rule."
tags: ["security", "mcp", "leaderboard", "classifier", "disclosure"]
---

While [expanding the HTTP corpus](https://github.com/euanmcrosson-dotcom/mcp-recon/pull/52)
this morning we found something that looked like real news: the
[OpenZeppelin Cairo Contracts MCP server](https://mcp.openzeppelin.com/contracts/cairo/mcp)
emitted **two Critical findings** under R7 (code/command execution surface)
while its three sibling endpoints — Solidity, Stellar, Stylus — scored a
clean 100.

OpenZeppelin is one of the most respected names in smart-contract security.
"One of their four MCP servers has two Criticals" is a hell of a story.

It was also wrong, and we caught it before it shipped.

## What R7 saw

The two tools that triggered R7 were `cairo-account` and `cairo-multisig`.
Here's the actual description of `cairo-account` as returned by the
server's `tools/list`:

> Make a custom smart contract that represents an account that can be
> deployed and interacted with other contracts, and can be extended to
> implement custom logic. An account is a special type of contract that
> is used to **validate and execute transactions**.
>
> **Returns the source code of the generated contract, formatted in a
> Markdown code block. Does not write to disk.**

R7's [token-matching code](https://github.com/euanmcrosson-dotcom/mcp-recon/blob/master/crates/mcp-recon-core/src/classifier.rs)
checks the tool's name + description for execution-implying phrases like
`execute `, `run python`, `shell command`, `eval(`, etc. The word
`execute` appears in `execute transactions` — and R7 fired Critical.

The problem is that the tool **does not execute anything**. It generates
Cairo source code and returns it as Markdown. The verb `execute` is
describing what the generated contract will do later, after the user
deploys it themselves. The description literally disclaims any host-side
effect ("Does not write to disk").

This is a false positive of a class we hadn't seen before today:
**descriptions that mention execution semantics of the artefact the tool
returns, not the tool itself.** Code generators, source-rendering tools,
contract scaffolders, and most "show me how to do X" reference servers
all fall into it.

## How we caught it

Before this turned into a blog post saying "OpenZeppelin Cairo has two
Criticals," we did the thing we always do when new corpus entries land:
read the findings before publishing. The Cairo result jumped out for two
reasons:

1. **Three sibling endpoints scored 100.** If the rule were truly catching
   something real, you'd expect the bug to be a uniform misuse across the
   Cairo/Solidity/Stellar/Stylus family. It wasn't — only the Cairo one
   tripped.
2. **The descriptions** for the offending tools end with explicit
   disclaimers ("Returns the source code…", "Does not write to disk").
   Those are not the words a tool with execution side effects would use.

The combination was enough to look at R7 directly rather than at the
server.

## What the fix looks like

[mcp-recon PR #53](https://github.com/euanmcrosson-dotcom/mcp-recon/pull/53)
adds a small set of phrases that, when present in the description,
suppress R7 even if an execution-token matched:

```rust
const NON_EXECUTION_DISCLAIMERS: &[&str] = &[
    "returns the source code",
    "returns the generated",
    "does not write to disk",
    "returns a markdown code block",
    "formatted in a markdown code block",
];
```

A few constraints we kept:

- **Description-only suppression.** A tool named `exec` with no description
  still fires R7. The new phrases all describe what a tool *returns*, and
  authors can't easily mislabel a tool's return shape — but they can rename
  it. So we trust the rule on names and only look for disclaimer phrases
  in the description.
- **Conservative phrase list.** Every phrase in `NON_EXECUTION_DISCLAIMERS`
  is specific enough that a real execution tool would not say it. "Returns
  the source code" is not something `bash_exec` ever advertises.

E2E verification across the corpus, before vs after the fix:

| corpus | R7 fires before | R7 fires after | servers affected |
|---|---|---|---|
| 48 npm + PyPI (static manifest) | unchanged | unchanged | 0 |
| 14 npm + PyPI (Docker sandbox) | unchanged | unchanged | 0 |
| 24 HTTP endpoints | 4 (3 legit + Cairo's 2) | 4 (3 legit only) | 1 |

The fix only affects the Cairo case. Nothing on the broader leaderboard
changes.

## Why the discipline matters more than the rule

It would be easy to write the audit story as "we have seven rules, here's
what they catch." The honest story is "we have seven rules, here's what
they catch, and here's what they get wrong, and here's the change that
made them get less wrong."

The same pattern shows up across our other modules:

- [mcp-guard 0.5.7](https://github.com/euanmcrosson-dotcom/mcp-guard)
  closed a type-confusion bypass in its own policy evaluator after we
  built an adversarial pytest harness against it. The harness now runs
  15/15 live compliance against Sonnet-4 with a false-positive control
  ("the legit €47.50 call is allowed").
- [mcp-recon 0.0.12](https://github.com/euanmcrosson-dotcom/mcp-recon)
  fixed a Find→Bind handoff that was emitting unparseable caveats for
  tool names with control characters, because the Rust Debug formatter
  and the capnagent DSL parser disagreed about what counts as a string.

Each of these started the same way: scan our own stack, find a thing the
rule got wrong, ship the fix with a regression test. The R7 false positive
on OpenZeppelin Cairo is the same shape, surfaced earlier — before the
finding hit a blog post or a leaderboard refresh that would have required
a retraction.

## What it doesn't mean

There are a few things this disclosure is **not**:

- **It is not a security finding against OpenZeppelin.** Their Cairo MCP
  is operating as designed. The scores 3 of their 4 sibling endpoints
  earned (100/100) reflect well-shaped tool surfaces; the Cairo variant
  earned the same after the fix.
- **It is not a claim that R7 is good now.** SpaceMolt's `find_route`
  tool still fires R7 because its description says *"execute those hops
  with `jump()` from anywhere in the entrance system."* That's borderline.
  No disclaimer phrase fires. We left it alone for now — the rule's
  current behaviour there is defensible — but it's the next refinement
  candidate.
- **It is not a "we never publish false positives" claim.** It is a "we
  read our own data before publishing" claim. Real audit discipline
  catches more than zero things.

## Take it for what it is

The corpus is public. The classifier is public. The findings are public.
The fix is public. The leaderboard at [capframe.ai/leaderboard](/leaderboard)
will refresh on the next cron run and the Cairo line will show 0 Criticals
where it previously showed 2.

If you find another false positive — yours or someone else's — open an
issue on [mcp-recon](https://github.com/euanmcrosson-dotcom/mcp-recon)
and we'll work through it.
