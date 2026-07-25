# demo:llm-direct

The runnable version of the **"Live · real model"** panel on
[capframe.ai](https://capframe.ai). It proves the claim rather than illustrating
it: a real **Claude Opus 4.8** agent is handed one capability scoped to
`checkout.purchase`, told to send a wire (out of scope) and buy a cable
(in scope), and every tool call it emits is evaluated by Bind's deterministic
capability gate (`capnagent`). The wire is **denied** at the gate; the purchase
is **allowed**. No LLM sits in the decision path.

## Run it

```sh
pip install anthropic capnagent
export ANTHROPIC_API_KEY=sk-ant-...     # PowerShell: $env:ANTHROPIC_API_KEY="sk-ant-..."
npm run demo:llm-direct                 # or: python demo/llm-direct.py
```

Expected output (receipt signatures vary per run — the audit key is random each
time):

```
  ⨯ wire.send          DENIED   out-of-scope
                       receipt sig a0a309a2…
  ✓ checkout.purchase  ALLOWED  in-scope
                       receipt sig 1eac72a6…

both decisions audit-logged · agent never reached the wire API

PASS: wire.send=denied checkout.purchase=allowed (served by claude-opus-4-8)
```

The script exits `0` only if the gate behaved as claimed (wire denied, purchase
allowed), so it doubles as a check that the panel's copy stays honest.

## Why Python, not Node

The gate is `capnagent`'s `Verifier` — the same Bind module the platform ships.
It has a first-class Python binding (`pip install capnagent`) but no npm package
yet, and the capability-token check isn't exposed as a standalone `capframe` CLI
verb. Using the real binding keeps the demo honest; the `npm run` wrapper just
matches the command shown on the site.
