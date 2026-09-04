#!/usr/bin/env python3
"""Tests for the parts of demo/llm-direct.py a real run does not exercise.

The refusal branch only fires when the model declines. On the verified billed
run (2026-09-04, claude-opus-5) it complied and emitted both tool calls, so
that branch has never executed in production — which makes it exactly the code
most likely to be wrong when it finally matters. It is tested here against
synthetic responses rather than by hoping for a refusal in the wild.

No pytest: the CI job for this demo installs capnagent and nothing else.

    python demo/test_llm_direct.py     # exit 0 = all good
"""
from __future__ import annotations

import importlib.util
import pathlib
import sys

_SRC = pathlib.Path(__file__).with_name("llm-direct.py")
_spec = importlib.util.spec_from_file_location("llm_direct", _SRC)
llm_direct = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(llm_direct)

refusal_message = llm_direct.refusal_message


class FakeResponse:
    """Duck-types the fields of an anthropic Message this code path reads."""

    def __init__(self, stop_reason, stop_details=None):
        self.stop_reason = stop_reason
        self.stop_details = stop_details
        self.content = []


class FakeStopDetails:
    def __init__(self, category=None):
        self.type = "refusal"
        self.category = category


def test_refusal_is_reported_and_not_blamed_on_the_gate():
    msg = refusal_message(FakeResponse("refusal"))
    assert msg is not None, "a refusal must produce a message"
    # The whole point: a refusal must not read as the gate failing.
    assert "not a gate failure" in msg, msg
    assert "--gate-only" in msg, "should route the operator to the key-free check"


def test_refusal_category_is_surfaced_when_present():
    msg = refusal_message(FakeResponse("refusal", FakeStopDetails("cyber")))
    assert "category: cyber" in msg, msg


def test_refusal_without_stop_details_does_not_crash():
    # stop_details is documented as populated only on refusal, but an older or
    # partial SDK may leave it None. Reading it must not raise.
    msg = refusal_message(FakeResponse("refusal", None))
    assert msg is not None and "category" not in msg, msg


def test_refusal_with_null_category_omits_the_suffix():
    msg = refusal_message(FakeResponse("refusal", FakeStopDetails(None)))
    assert "category" not in msg, msg


def test_normal_stops_are_not_treated_as_refusals():
    # The happy paths the billed run actually took. A false positive here would
    # abort a working demo.
    for reason in ("end_turn", "tool_use", "max_tokens", "stop_sequence", None):
        assert refusal_message(FakeResponse(reason)) is None, f"{reason} is not a refusal"


def test_missing_stop_reason_attribute_is_not_a_refusal():
    class Bare:
        pass

    assert refusal_message(Bare()) is None


def test_gate_still_denies_out_of_scope_and_allows_in_scope():
    """Guards the claim the homepage panel makes, at unit level."""
    gate = llm_direct.build_gate()
    _, wire_kind, _ = gate("wire_send", {"amount": 30, "account": "4471"})
    _, buy_kind, _ = gate("checkout_purchase", {"item": "USB-C cable"})
    assert wire_kind == "denied", f"wire.send must be denied, got {wire_kind}"
    assert buy_kind == "allowed", f"checkout.purchase must be allowed, got {buy_kind}"


def main() -> int:
    tests = [v for k, v in sorted(globals().items()) if k.startswith("test_") and callable(v)]
    failures = []
    for t in tests:
        try:
            t()
            print(f"  ok    {t.__name__}")
        except AssertionError as e:
            print(f"  FAIL  {t.__name__}: {e}")
            failures.append(t.__name__)
        except Exception as e:  # noqa: BLE001 - a crash is a failure too
            print(f"  ERROR {t.__name__}: {type(e).__name__}: {e}")
            failures.append(t.__name__)

    if failures:
        print(f"\n{len(failures)} of {len(tests)} failed: {', '.join(failures)}", file=sys.stderr)
        return 1
    print(f"\nall {len(tests)} passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
