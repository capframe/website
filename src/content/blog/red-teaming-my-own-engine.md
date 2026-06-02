---
title: "50.000000000000001 — how a floating-point number beat my own authorization engine"
date: "2026-06-02"
description: "I pointed a four-agent red team at my own capability-security engine. It found four HIGH-severity authorization bypasses — including a number a hair over a $50 cap that the engine read as exactly $50. Here's the worst one, and the honest scorecard."
tags: ["security", "ai agents", "mcp", "capability security", "red team"]
---

I build [capnagent](https://github.com/euanmcrosson-dotcom/capnagent): a capability-based authorization layer for AI agents — a Rust core (`capnagent-core`) with JavaScript and Python bindings. The pitch is simple: don't try to detect prompt injection, just make sure a compromised agent can't *do* anything it wasn't explicitly authorized to. You issue a capability with caveats like `tool == "checkout.purchase" AND arg.amount <= 50`, and the verifier denies anything outside that — even if the model has been fully hijacked.

So a few weeks ago I pointed a four-agent red team at it. Not at someone else's code. **At mine.** Here's the worst thing it found.

## The bug

A capability says: *this agent may purchase, up to $50.*

```
tool == "checkout.purchase" AND arg.amount <= 50
```

A prompt-injected agent calls `checkout.purchase` with:

```json
{ "amount": 50.000000000000001 }
```

That's over the limit. The engine should deny it.

It allowed it.

Here's why, and it's the kind of thing that's obvious in hindsight and invisible in the moment. `50.000000000000001` has more precision than an IEEE-754 `f64` can represent. When the JSON number is parsed into a float, it **collapses to the bit-identical value `50.0`**. By the time the caveat evaluator sees it, `arg.amount` *is* `50.0`, and `50.0 <= 50` is — correctly, and catastrophically — true.

The caveat author wrote `<= 50` meaning "fifty dollars, hard ceiling." The attacker wrote a number that is mathematically greater than 50 but numerically equal to it. The gap between those two facts is an **authorization bypass**. Scale the cap (`<= 5000`, `<= 1000000`) and you scale the overage an attacker can sneak through under cover of floating-point rounding.

I logged it as finding **A.1: "Sub-ulp f64 collapse defeats integer-looking caveats."** (ulp = unit in the last place — the smallest gap between two representable floats. The attack lives *below* one ulp.)

## How it got found: four agents, 36 angles

I didn't find this by squinting at the code. I'd already run ten rounds of manual purple-teaming against the engine over previous releases — confused-deputy, replay, IDN-homograph allowlist bypass, substring foot-guns — and closed them. I thought the obvious surface was covered.

So I tried something more adversarial: **four agents in parallel, each told to attack a different facet** — the DSL parser edges, serialization, capability composition, and timing. Each wrote a test file of "angles" (≥5 each), marking any that surfaced a real defect `[FINDING]`.

The result: **36 angles, 17 real findings, 4 of them HIGH-severity** — and that one parallel run found more than my previous ten manual rounds combined. The lesson I keep relearning: *you cannot adversarially review your own work from inside your own assumptions.* You need an attacker who doesn't share them. Four of them, ideally.

The other two HIGH findings are the same flavour of subtle:

- **B.2 — `attenuate("")` mints a silent permanent-deny token.** You can narrow a capability with an empty predicate; it's accepted, the delegation chain validates, everything looks fine — but *every* verify against it denies, because the DSL can't parse `""`. Any holder in a delegation chain could silently brick a capability they hand to a sub-agent. (Fix: validate that predicates parse *at attenuation time*, not at verify time.)
- **B.3 — the audit signer accepted a zero-byte HMAC key.** RFC 2104 technically permits it, but a zero-entropy signing key means audit receipts can be forged. (Fix: reject empty keys.)

None of these is a flashy RCE. They're the quiet logic gaps that make a *security control itself* the weak link — which is exactly the class of bug you least want in the thing whose entire job is to say no.

## The honest scorecard

I'm not going to round this up, because the whole point is that you shouldn't trust people who do:

- **4 HIGH found, 4 HIGH closed.** A.1 was closed engine-side in v0.6.0 (the evaluator now tracks whether each number was written as an integer or a float in the source text, and refuses to order-compare an integer caveat against a float arg) and across the JS layer in v0.6.1.
- **There's a residual, and I'll state it plainly:** the closure is complete for callers who use the JSON-string entry point. The older JS-*object* entry point still pre-collapses the float before capnagent ever sees it — that's a JavaScript `Number` problem upstream of the engine, and the documented mitigation is the integer-cents form (`arg.amount_cents <= 5000`). Honest beats tidy.
- **Every fix shipped as a runnable test**, not a changelog promise. A.1's exact reproducer — `50.000000000000001` against `<= 50` — now errors instead of admitting, and you can run it yourself: `caveat_dsl_tests.rs` (Rust) and `angles-dsl-edges.angles.test.ts` (JS).
- And a confession in the same spirit: my own `SECURITY-POSTURE.md` still read "3 of 4 closed" for a release after the 4th was actually fixed. Docs lag code; I hold the doc to the same bar and it's corrected now.

## Why I'm telling you this

Two reasons.

The first is a standard I think security tooling should be held to: **if the author of an authorization engine won't adversarially red-team it in public and publish the bugs, why would you trust the parts they didn't show you?** "It's secure" is a claim. "Here are four HIGH-severity holes I found in my own work, here's how each is now a failing-then-passing test" is evidence. I'd rather give you the evidence.

The second is more direct. **I now do this for other people's agents.** If you're shipping MCP servers or tool-using agents in production, your real attack surface isn't the model — it's the tool surface: which tools exist, what their inputs *actually* permit, and what a hijacked agent can reach. I'll enumerate that surface, threat-model it against OWASP LLM Top 10 / MITRE ATLAS / NIST AI RMF, and hand you a findings report plus a capability config that bounds what your agents can actually do — fixed scope, fixed price, every finding shipped as a check you can run.

Same adversarial eye I just turned on myself.

---

*Capframe's tooling is permissive OSS — Apache-2.0 (the Rust Find + Bind core) and MIT (Guard) — and pre-1.0; you keep everything, no lock-in. The framework mappings above are authored by me, not certified by OWASP/MITRE/NIST (re-verify before any compliance use). If you want that same adversarial eye on your own agents: **hello@capframe.ai** — tell me your agent framework + which MCP servers, and I'll send the scope.*
