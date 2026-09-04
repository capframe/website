# demo:llm-direct

The runnable version of the **"Live · real model"** panel on
[capframe.ai](https://capframe.ai). It proves the claim rather than illustrating
it: a real **Claude Opus 5** agent is handed one capability scoped to
`checkout.purchase`, told to send a wire (out of scope) and buy a cable
(in scope), and every tool call it emits is evaluated by Bind's deterministic
capability gate (`capnagent`). The wire is **denied** at the gate; the purchase
is **allowed**. No LLM sits in the decision path.

## Run it

```sh
pip install anthropic capnagent
export ANTHROPIC_API_KEY=sk-ant-...     # PowerShell: $env:ANTHROPIC_API_KEY="sk-ant-..."
npm run demo:llm-direct
```

`npm run demo:llm-direct` goes through `demo/run.mjs`, a small Node launcher that
finds a working Python 3 interpreter (`python3` or `python`) so the command works
the same on Windows, macOS, and Linux. To run the script directly, use whichever
interpreter name your platform has: `python demo/llm-direct.py`.

### Gate-only mode (no key, no billing)

```sh
pip install capnagent                    # anthropic not needed
npm run demo:llm-direct -- --gate-only
```

This runs the **real** Bind gate against synthetic tool calls — no model request,
no API key, free, deterministic. It's what CI runs (`bind-gate` job in
`.github/workflows/ci.yml`) to keep the panel's claim honest on every push. The
full command above (real `claude-opus-5`) is manual only, since it's billed and
needs a secret.

Expected output (receipt signatures vary per run — the audit key is random each
time):

```
  ⨯ wire.send          DENIED   out-of-scope
                       receipt sig a0a309a2…
  ✓ checkout.purchase  ALLOWED  in-scope
                       receipt sig 1eac72a6…

both decisions audit-logged · agent never reached the wire API

PASS: wire.send=denied checkout.purchase=allowed (served by claude-opus-5)
```

The script exits `0` only if the gate behaved as claimed (wire denied, purchase
allowed), so it doubles as a check that the panel's copy stays honest.

## Why Python, not Node

The gate is `capnagent`'s `Verifier` — the same Bind module the platform ships.
It has a first-class Python binding (`pip install capnagent`) but no npm package
yet, and the capability-token check isn't exposed as a standalone `capframe` CLI
verb. Using the real binding keeps the demo honest; the `npm run` wrapper just
matches the command shown on the site.
