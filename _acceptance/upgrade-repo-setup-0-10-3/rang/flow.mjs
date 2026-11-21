// AC-8: the flow measure reads no file of the feature loop, and a number over its threshold changes
// no exit code.
//   - No file of FLOW_TOOLS names `_acceptance`.
//   - Run in this tree with GitHub stood in for (fetch returns a window with nothing in it) and one
//     threshold line forced over, in four forms (page, --json, --split, --split --json): each exits 0,
//     as with nothing over, and shows the forced line (the table row, or "verdict": "over"), which
//     the run with nothing over does not. An audit hook set before the tools are imported records
//     every file opened: none under _acceptance/, none opened to write.
//   - With --write, in a throwaway copy: it writes only the week's page under wiki/metrics/ and at
//     most wiki/index.md, and still exits 0.
//   - Nothing runs it by itself: no workflow, Makefile, mk/ file, package.json, pre-commit config or
//     .claude/settings.json names sdlc_metrics.
//   Limit: the stand-in window is empty, so the parts that read pull requests and runs run on
//   empty lists; that they read no dossier rests on the first check (no tool names _acceptance).
//   Python runs with -B, so it writes no bytecode cache of its own.
// Usage: node flow.mjs [--root <dir>]

import { existsSync, readdirSync, readFileSync, realpathSync } from "node:fs";
import { join, relative } from "node:path";

import { root, run, verdict, worktree } from "./lib.mjs";
import { FLOW_TOOLS } from "./matrix.mjs";

const NAME = "flow";
const dir = root();
const problems = [];

const HARNESS = `
import contextlib, io, json, os, sys
opened = []
def hook(ev, args):
    if ev == "open" and isinstance(args[0], (str, bytes)):
        mode, flags = args[1], args[2] if len(args) > 2 else 0
        writes = (isinstance(mode, str) and any(c in mode for c in "wax+")) or bool((flags or 0) & (os.O_WRONLY | os.O_RDWR | os.O_CREAT))
        opened.append([os.fsdecode(args[0]), writes])
sys.addaudithook(hook)
sys.path.insert(0, "tools")
import sdlc_metrics as m, sdlc_limits as L
m.fetch = lambda days: {"since": "2026-11-14", "days": days, "repo": "o/r", "default_branch": "main",
    "merged": [], "closed": [], "opened": [], "deployments": [], "runs": "not read: stand-in"}
real = m.metrics
force = sys.argv[1] == "over"
def metrics(raw, window, agents):
    out = real(raw, window, agents)
    if force:
        out["thresholds"] = [L.row(L.LATE_RED, 9, 20, L.LATE_RED_MAX)]
    return out
m.metrics = metrics
result = {}
for argv in json.loads(sys.argv[2]):
    buf = io.StringIO()
    with contextlib.redirect_stdout(buf):
        code = m.main(argv)
    text = buf.getvalue()
    result[" ".join(argv) or "page"] = {"code": code, "row": "| 9 of 20 (45%) | more than 20% | over |" in text, "json": '"verdict": "over"' in text}
print(json.dumps({"runs": result, "opened": opened}))
`;

try {
  for (const f of FLOW_TOOLS) {
    if (readFileSync(join(dir, f), "utf8").includes("_acceptance")) problems.push(`${f} names _acceptance`);
  }
  const FORMS = [[], ["--json"], ["--split", "2026-11-18"], ["--split", "2026-11-18", "--json"]];
  const views = {};
  for (const mode of ["over", "within"]) {
    const r = run("python3", ["-I", "-B", "-c", HARNESS, mode, JSON.stringify(FORMS)], { cwd: dir });
    if (r.code !== 0) throw new Error(`the flow measure cannot run: ${r.err.trim().split("\n").pop()}`);
    views[mode] = JSON.parse(r.out);
  }
  for (const [form, v] of Object.entries(views.over.runs)) {
    const w = views.within.runs[form];
    if (v.code !== 0) problems.push(`with a number over its threshold, the ${form} exits ${v.code}`);
    if (v.code !== w.code) problems.push(`the ${form} exits otherwise when a number is over its threshold`);
    const said = form.includes("--json") ? "json" : "row";
    if (!v[said]) problems.push(`the ${form} does not show the line over its threshold`);
    if (w[said]) problems.push(`the ${form} shows a line over its threshold when none is`);
  }
  for (const [path, writes] of [...views.over.opened, ...views.within.opened]) {
    if (path.includes("_acceptance")) problems.push(`the flow measure opens ${path}`);
    if (writes) problems.push(`the flow measure opens ${path} to write without --write`);
  }
  // --write, in a throwaway copy: it writes the week's page under wiki/metrics/ and at most
  // wiki/index.md, nothing else.
  const wt = worktree(dir, "HEAD");
  try {
    const r = run("python3", ["-I", "-B", "-c", HARNESS, "over", JSON.stringify([["--write"]])], { cwd: wt.dir });
    if (r.code !== 0) throw new Error(`the flow measure cannot run with --write: ${r.err.trim().split("\n").pop()}`);
    const v = JSON.parse(r.out);
    if (v.runs["--write"].code !== 0) problems.push(`with --write and a number over its threshold the tool exits ${v.runs["--write"].code}`);
    const at = realpathSync(wt.dir);
    const written = v.opened.filter(([, w]) => w).map(([p]) => relative(at, realpathSync(p)));
    const stray = written.filter((p) => !/^wiki\/metrics\/\d{4}-W\d{2}\.md$/.test(p) && p !== "wiki/index.md");
    if (written.length === 0) problems.push("with --write the tool writes nothing");
    if (stray.length > 0) problems.push(`with --write the tool writes ${JSON.stringify(stray)}`);
    if (v.opened.some(([p]) => p.includes("_acceptance"))) problems.push("with --write the tool opens a file under _acceptance/");
  } finally {
    wt.remove();
  }
  const callers = [".github/workflows", "mk"].flatMap((d) => (existsSync(join(dir, d)) ? readdirSync(join(dir, d)).map((f) => join(d, f)) : []));
  for (const f of [...callers, "Makefile", "package.json", ".pre-commit-config.yaml", ".claude/settings.json"].filter((x) => existsSync(join(dir, x)))) {
    if (readFileSync(join(dir, f), "utf8").includes("sdlc_metrics")) problems.push(`${f} runs the flow measure`);
  }
} catch (err) {
  problems.push(err.message);
}

verdict(
  NAME,
  problems,
  "the flow measure names no _acceptance file and opens none; in four forms it exits 0 with a number over its threshold as without one and shows that line only when it is over; it writes nothing without --write, and with it only the week's page and the wiki index; nothing runs it by itself",
);
