---
title: "Capability tokens for AI agents, the macaroon way"
date: "2026-05-26"
description: "Most agent-permission systems check an ACL at the tool-call boundary. Capframe hands the agent a token that encodes what it's allowed to do — macaroon-style, attenuable without phoning home, bound to a key so a stolen token is useless. Here's the construction and where it stops working."
tags: ["security", "capabilities", "macaroons", "ai-agents", "cryptography"]
---

The [first post](https://capframe.ai/blog/why-findings-v1) was about *finding*
what an agent's tools can do. This one is about the next question: once you know
the tool surface, how do you actually constrain what the agent is allowed to do
with it?

Capframe's answer is the **Bind** module ([capnagent](https://github.com/euanmcrosson-dotcom/capnagent)),
and the answer is capability tokens — specifically, a macaroon-style
construction. This post explains why, how the crypto works, and the two places
it honestly doesn't help.

## The default answer, and why it's awkward for agents

The obvious way to scope an agent is an ACL checked at the tool-call boundary:
when the agent calls `order.refund`, a gate looks up "is this agent allowed to
refund, and up to how much?" against a central policy. This is how most things
work, and for most things it's fine.

For agents it has three rough edges:

1. **The check is central.** Every tool call round-trips to a policy service
   that holds the full permission table. That service is a bottleneck and a
   single point of compromise, and it has to be reachable from wherever the
   agent runs.

2. **The LLM influences what's requested.** If the authority is "look up what
   this agent is allowed to do," then an indirect-injection-controlled agent can
   at least *try* every tool and see what sticks. The blast radius is "whatever
   the central policy happens to allow this agent," which is usually broad
   because nobody scopes ACLs tightly (see: every AWS IAM policy ever).

3. **Delegation is painful.** Agent A wants to hand a narrower slice of its
   authority to sub-agent B, or to a tool that composes other tools. With a
   central ACL, that means writing new policy rows and round-tripping again.

Capabilities invert the model. Instead of the boundary asking "is this agent
allowed?", the agent **carries** a token that *is* the authority. Possession of
a valid, sufficiently-narrow token is the permission. No central lookup on the
hot path.

## Macaroons: attenuation you can't undo

The construction Capframe uses is a [macaroon](https://research.google/pubs/pub41892/)
(Birgisson et al., 2014). The mechanism is one clever HMAC trick:

A token starts as an HMAC of an identifier under a root key only the issuer
holds:

```
sig_0 = HMAC(root_key, identifier)
```

Every **caveat** (a restriction like `max_refund <= 50`) is added by chaining:

```
sig_1 = HMAC(sig_0, "max_refund <= 50")
sig_2 = HMAC(sig_1, "region == \"eu\"")
```

The final signature travels with the token. Here's the property that makes it
useful for agents: **anyone holding the token can add a caveat — because adding
one just means HMAC-ing the current signature with the new restriction — but
nobody can remove a caveat without recomputing the chain, which needs the root
key they don't have.**

So authority only ever *narrows* as a token is passed around. Agent A can take
its token, append `tool in ["order.read"]`, and hand the result to sub-agent B.
B now has a strictly smaller capability, and it got there **without contacting
the issuer.** The verifier later replays the whole chain against the root key;
if any caveat was tampered with or removed, the final signature won't match.

In capnagent the API mirrors the original paper:

```rust
let cap = Issuer::from_key(secret)
    .issue("shopify-bot")
    .caveat("tool in [\"order.read\", \"refund.write\"]")
    .caveat("max_refund <= 50")
    .caveat("region == \"eu\"")
    .build();

let token = cap.serialize(); // base64url, travels with the agent
```

Verification is offline: given the root key, the verifier re-derives the chain
and checks each caveat against the call context. No phone-home.

## The caveat DSL, and a float that tried to sneak through

Caveats are predicate strings evaluated against the tool call: `tool in [...]`,
`max_refund <= 50`, `region == "eu"`. The evaluator is deliberately tiny and
deterministic — no LLM in the decision path, the same property the
[whole platform](https://capframe.ai) is built on.

One detail worth sharing because it bit us. Consider a caveat `amount <= 50`
guarding a refund. An attacker-controlled agent submits:

```json
{ "amount": 50.000000000000001 }
```

Sixteen digits past the decimal — which, parsed naively into an `f64`, collapses
to a bit-identical `50.0` and slips past `amount <= 50`. The fix was to parse
JSON numbers with `arbitrary_precision` so the evaluator sees the *original
source text* of the number, not a lossy float. An integer-domain caveat now
rejects a float-syntactic argument outright rather than rounding it into
compliance.

It's a small thing, but it's the kind of thing that separates "a policy DSL" from
"a policy DSL you'd actually trust at a money boundary." Determinism is only
worth anything if the evaluation is also exact.

## Holder-of-key: because possession is too much power

Pure capabilities have an obvious failure mode: if the token *is* the authority,
a stolen token is stolen authority. Agents leak things — into logs, into prompt
context, into error messages.

So capnagent binds each token to an ed25519 keypair (DPoP-style holder-of-key).
The capability carries the agent's public key, folded into the HMAC chain so it
can't be swapped. Every *use* of the token must carry a signature over a
per-call challenge, made with the corresponding private key:

```
challenge = H(token_id || tool || args || nonce || timestamp)
proof     = ed25519_sign(agent_priv_key, challenge)
```

The verifier checks the proof against the public key bound into the token. Now a
leaked token is inert — without the private key (which lives wherever the agent
runtime keeps its secrets, never in prompt context), an attacker can't produce a
valid proof for any call. Token theft stops being game-over.

## Every deny is evidence

There's a compliance angle that falls out for free. When the verifier rejects a
call — wrong tool, over the cap, expired, bad proof — it emits a **signed denial
receipt** (HMAC-SHA256): what was attempted, which caveat failed, when. Tamper-
evident, and mapped to OWASP LLM Top 10 / NIST AI RMF / MITRE ATLAS so it drops
straight into the [findings.v1](https://capframe.ai/blog/why-findings-v1)
pipeline.

The pitch to a compliance reviewer isn't "trust us, the agent is constrained."
It's "here is a cryptographically-signed log of every time the agent tried to
exceed its authority and was stopped." Allow *or* deny, you get a receipt.

## Where this honestly doesn't help

Two concessions, because a security post without them is marketing.

**1. It doesn't stop the agent from doing an authorized-but-dumb thing.** If the
agent holds a cap that legitimately allows `order.refund` up to $50, and an
indirect-injection attack convinces it to refund $50 to the wrong person, the
capability system is working as designed — the call was within scope. Capabilities
bound the blast radius; they don't make the agent wise. The narrower the cap at
issue time, the smaller the damage, which means **scope-at-issue-time is the
load-bearing decision** — and that's a human/tooling problem, not a crypto one.
(This is why Capframe ships *Find* first: the scope should come from scanning the
real tool surface, not from a developer guessing.)

**2. The issuer's root key is the crown jewel.** Everything reduces to "only the
issuer holds the root key." In a single-tenant local deployment that's
tractable. In a hosted multi-tenant setting it's the hard problem — KMS with an
n-of-m quorum is the obvious answer, but it's genuinely the thing I'd want a
second opinion on before building. If you've shipped issuer-key management for a
capability system at scale, I want to hear how you did it.

## Try it / argue with it

- Bind module source: [github.com/euanmcrosson-dotcom/capnagent](https://github.com/euanmcrosson-dotcom/capnagent)
- It's the `capframe bind` subcommand once you
  [install the umbrella CLI](https://capframe.ai): `curl -fsSL capframe.ai/install | sh`
- The whole thing is MIT-licensed.

If you think macaroons are the wrong primitive here — or that holder-of-key is
overkill, or that the caveat DSL should be a real expression language instead of
a handful of operators — [open an issue](https://github.com/euanmcrosson-dotcom/capnagent/issues).
The capability model only gets better with people poking holes in it, and I'd
rather find the holes now.
