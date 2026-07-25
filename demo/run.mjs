// Cross-platform launcher for `npm run demo:llm-direct`.
// Finds a working Python 3 interpreter (python3 or python), then runs
// demo/llm-direct.py, passing through any extra args (e.g. --gate-only).
// Exits with the Python process's own exit code.
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const script = fileURLToPath(new URL("./llm-direct.py", import.meta.url));
const passthrough = process.argv.slice(2);

const runs = (cmd) => spawnSync(cmd, ["--version"], { stdio: "ignore" }).status === 0;
const hasBind = (cmd) =>
  spawnSync(cmd, ["-c", "import capnagent"], { stdio: "ignore" }).status === 0;

const candidates = ["python3", "python"];
// `python3` and `python` can be different installs (e.g. only one has the
// deps), so prefer whichever can import the Bind module; else any python3.
const python =
  candidates.find(hasBind) || candidates.find(runs);
if (!python) {
  console.error(
    "No Python 3 interpreter found (tried `python3`, `python`).\n" +
      "Install Python 3.8+ and the deps:  pip install anthropic capnagent",
  );
  process.exit(127);
}

const res = spawnSync(python, [script, ...passthrough], { stdio: "inherit" });
process.exit(res.status ?? 1);
