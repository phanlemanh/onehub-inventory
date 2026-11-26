// Every string this tool and its plugin read in a repository's Makefile, its mk/ files and its
// workflows, in one place, and the only module that opens those files. The plugin's reference file
// references/host-strings.json lists the same strings, for the tool that lays a repository's gate
// to hold from its side: a test of the plugin fails when the two differ, and when another module
// opens those files or matches their text itself.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

export const MAKEFILE = "Makefile";
export const MK_FOLDER = "mk";
// Where a repository with no Makefile keeps its commands: the scripts of its package file.
export const PACKAGE_FILE = "package.json";
// The command of the gate, as a package script runs it: the check, in a way that can fail.
export const CHECK_COMMAND = "node tools/design-assembly/check.mjs";
// The names the gate's script is given, the first one free: a script the repository already has
// under a name is never written over.
export const CHECK_SCRIPTS = ["design:check", "design-assembly:check"];
// The gate step this tool installs beside it: the plugin writes it, and reads it whole.
export const GATE_STEP = `${MK_FOLDER}/design-assembly.mk`;

// ---- reads ----
// Each string, as the reference file lists it: what kind of reading it is, the files it is read
// in, and why. A pattern is matched line by line where its flags say so.
const read = (text, flags, kind, files, why) => ({ kind, text, flags, files, why });
export const HOST_READS = {
  "include-mk": read(
    "^-?include mk/\\*\\.mk",
    "m",
    "pattern",
    [MAKEFILE],
    "The Makefile reads every mk file, so the gate step can join make check; without it the guide and adopting stop.",
  ),
  "rule-line": read(
    "^([A-Za-z0-9_.-]+)\\s*::?(?!=)(.*)$",
    "",
    "pattern",
    [MAKEFILE],
    "A line of the Makefile that is a rule: its target and its prerequisites, read to follow what make check runs.",
  ),
  "check-target": read(
    "check",
    "",
    "target",
    [MAKEFILE],
    "The target whose prerequisites, followed down, must reach the gate's list of checks.",
  ),
  "check-runs-this": read(
    "design-assembly",
    "",
    "word",
    [MAKEFILE],
    "A check target that names this tool's target among its prerequisites runs it as well.",
  ),
  "check-targets-word": read(
    "$(CHECK_TARGETS)",
    "",
    "word",
    [MAKEFILE],
    "The prerequisite that says a target runs every check the mk files add.",
  ),
  "gate-joins-check": read(
    "^CHECK_TARGETS \\+= .*\\bdesign-assembly\\b",
    "m",
    "pattern",
    [GATE_STEP],
    "The gate step adds this tool's check to the gate's list of checks.",
  ),
  "gate-runs-check": read(
    "^\\t@?node tools/design-assembly/check\\.mjs$",
    "m",
    "pattern",
    [GATE_STEP],
    "The gate step runs the check in a way that can fail.",
  ),
  "gate-step-file": read(
    GATE_STEP,
    "",
    "file",
    [GATE_STEP],
    "Upgrade compares the whole gate step with the installed plugin's and writes it again when they differ.",
  ),
  "tool-pointer": read(
    "the path a decision row's tool: check names",
    "",
    "substring",
    [MAKEFILE, `${MK_FOLDER}/*.mk`, "package.json"],
    "A decision held by a tool is held only while the gate names that tool: the Makefile, an mk file or a package script; the paths looked for today are listed under known_tools.",
  ),
  "test-in-check-targets": read(
    "test",
    "",
    "variable",
    [`${MK_FOLDER}/*.mk`],
    "On a gate with no shared list of derived targets, the gate step makes the tests wait for the derived files when CHECK_TARGETS holds test.",
  ),
  "derived-targets-defined": read(
    "DERIVED_TARGETS",
    "",
    "variable",
    [`${MK_FOLDER}/*.mk`],
    "The gate step adds its derived target to the shared list, and asks whether a file read before it defined that list.",
  ),
  "derived-files": read(
    "DERIVED_FILES",
    "",
    "variable",
    [`${MK_FOLDER}/*.mk`],
    "The gate step adds the files this tool keeps out of git to the shared list of derived files.",
  ),
  "check-script": read(
    CHECK_SCRIPTS.join(" "),
    "",
    "word",
    [PACKAGE_FILE],
    "Where the repository keeps no Makefile, the gate is a script of its package under the first of these names it does not already use; a ledger row's check-in-gate check names the script it holds.",
  ),
  "script-runs-check": read(
    "^node tools/design-assembly/check\\.mjs$",
    "",
    "pattern",
    [PACKAGE_FILE],
    "The gate's script runs the check and nothing else, so it fails when the check fails.",
  ),
};
// ---- end of reads ----

const pattern = (id) => new RegExp(HOST_READS[id].text, HOST_READS[id].flags);

const readText = (root, file) =>
  existsSync(path.join(root, file)) ? readFileSync(path.join(root, file), "utf8") : null;

// The repository's Makefile, or null.
export const readMakefile = (root) => readText(root, MAKEFILE);
// The gate step as the repository holds it, or null.
export const readGateStep = (root) => readText(root, GATE_STEP);

// Whether the Makefile reads every mk file.
export const joinsMkFiles = (makefile) =>
  typeof makefile === "string" && pattern("include-mk").test(makefile);

// Whether `make check` runs CHECK_TARGETS (or design-assembly itself), directly or through the
// targets it depends on: a gate may write `check: check-quick check-heavy` and
// `check-quick: $(CHECK_TARGETS)`. Only prerequisites count, not a comment after `##` or `#`.
export function checkReachesTargets(makefile) {
  const prerequisites = new Map();
  for (const line of String(makefile ?? "").split("\n")) {
    const rule = pattern("rule-line").exec(line);
    if (!rule) continue;
    const words = rule[2]
      .split("#")[0]
      .split(/\s+/)
      .filter((word) => word && word !== "|");
    prerequisites.set(rule[1], [...(prerequisites.get(rule[1]) ?? []), ...words]);
  }
  const seen = new Set();
  const queue = [HOST_READS["check-target"].text];
  while (queue.length > 0) {
    const target = queue.shift();
    if (seen.has(target)) continue;
    seen.add(target);
    for (const word of prerequisites.get(target) ?? []) {
      if (
        [HOST_READS["check-targets-word"].text, HOST_READS["check-runs-this"].text].includes(word)
      )
        return true;
      queue.push(word);
    }
  }
  return false;
}

// Why the gate step does not run this tool's check in make check, or null.
export function gateStepProblem(gate, makefile) {
  if (gate === null || gate === undefined) {
    return `${GATE_STEP} is missing, so make check does not run this`;
  }
  if (!pattern("gate-joins-check").test(gate)) {
    return `${GATE_STEP} does not add design-assembly to CHECK_TARGETS`;
  }
  if (!pattern("gate-runs-check").test(gate)) {
    return `${GATE_STEP} does not run the check, or runs it in a way that cannot fail`;
  }
  // The gate itself must still run what the included files add to it.
  if (!checkReachesTargets(makefile ?? "")) {
    return "the Makefile's check target no longer runs CHECK_TARGETS, so make check does not run this";
  }
  return null;
}

// The package file, or null.
export const readPackage = (root) => readText(root, PACKAGE_FILE);

const scriptsOf = (text) => {
  try {
    const scripts = JSON.parse(text ?? "null")?.scripts;
    return scripts !== null && typeof scripts === "object" && !Array.isArray(scripts)
      ? scripts
      : {};
  } catch {
    return null;
  }
};

// Why the gate's script does not run this tool's check, or null: `pkg` is the text of the
// package file, `name` the script the check-in-gate check names.
export function scriptGateProblem(pkg, name) {
  const scripts = scriptsOf(pkg);
  if (pkg === null || pkg === undefined)
    return `${PACKAGE_FILE} is missing, so no script runs this`;
  if (scripts === null) return `${PACKAGE_FILE} cannot be read, so no script runs this`;
  if (typeof scripts[name] !== "string")
    return `${PACKAGE_FILE} has no script ${name}, so nothing runs this`;
  if (!pattern("script-runs-check").test(scripts[name].trim())) {
    return `the script ${name} of ${PACKAGE_FILE} does not run the check alone, or runs it in a way that cannot fail`;
  }
  return null;
}

// The package file with the gate's script changed so that it cannot fail.
export function scriptThatCannotFail(pkg, name) {
  const data = JSON.parse(pkg);
  return JSON.stringify({
    ...data,
    scripts: { ...data.scripts, [name]: `${CHECK_COMMAND} || true` },
  });
}

// Where the gate is, for a repository: `{ kind: "make" }` when the Makefile reads every mk file;
// `{ kind: "script", name, have }` when the repository keeps no Makefile and has a package file,
// `name` being the script the gate is or will be, and `have` whether it is already there as the
// gate needs it; or `{ problem }`. A repository that has a Makefile is read as it always was.
export function gateHost(root) {
  const makefile = readMakefile(root);
  if (joinsMkFiles(makefile)) return { kind: "make" };
  const problem = "the Makefile does not include mk/*.mk, so the checks could not join make check";
  if (makefile !== null) return { problem };
  const pkg = readPackage(root);
  if (pkg === null) return { problem };
  const scripts = scriptsOf(pkg);
  if (scripts === null)
    return { problem: `${PACKAGE_FILE} cannot be read, so no script can hold the gate` };
  const mine = CHECK_SCRIPTS.find(
    (name) => typeof scripts[name] === "string" && scripts[name].trim() === CHECK_COMMAND,
  );
  if (mine) return { kind: "script", name: mine, have: true };
  const free = CHECK_SCRIPTS.find((name) => scripts[name] === undefined);
  const taken = CHECK_SCRIPTS.filter((name) => scripts[name] !== undefined);
  if (!free) {
    return {
      problem: `the repository keeps no Makefile, and its ${PACKAGE_FILE} already has scripts named ${CHECK_SCRIPTS.join(" and ")} that run something else, so the gate has no name to take: rename one, then adopt again`,
    };
  }
  return { kind: "script", name: free, have: false, taken };
}

// The package file with the gate's script added, keeping the file as it is written: its indent,
// the order of its keys and its last line. Null when it cannot be read.
export function withCheckScript(pkg, name) {
  const scripts = scriptsOf(pkg);
  if (scripts === null) return null;
  const line = `"${name}": "${CHECK_COMMAND}"`;
  // Written in place where the scripts are a block of one entry per line: the line goes first.
  const open = /("scripts"\s*:\s*\{)(\r?\n)([ \t]+)(?=")/.exec(pkg);
  if (open) {
    const at = open.index + open[1].length;
    const text = `${pkg.slice(0, at)}${open[2]}${open[3]}${line},${pkg.slice(at)}`;
    if (scriptsOf(text)?.[name] === CHECK_COMMAND) return text;
  }
  // Elsewhere the scripts are written in as text too, with the file's own line ending and indent:
  // in place of empty scripts, or as the last key of the file. Only a file that none of this
  // reaches is written again whole.
  const eol = pkg.includes("\r\n") ? "\r\n" : "\n";
  const indent = /\n([ \t]+)"/.exec(pkg)?.[1] ?? "  ";
  const block = (at) => `{${eol}${at}${indent}${line}${eol}${at}}`;
  const tries = [
    pkg.replace(/("scripts"\s*:\s*)\{\s*\}/, (_, key) => `${key}${block(indent)}`),
    pkg.replace(
      /(\S)(\s*)\}(\s*)$/,
      (_, last, space, after) =>
        `${last},${eol}${indent}"scripts": ${block(indent)}${space}}${after}`,
    ),
  ];
  for (const text of tries) {
    if (text !== pkg && scriptsOf(text)?.[name] === CHECK_COMMAND) return text;
  }
  const data = JSON.parse(pkg);
  const end = pkg.endsWith("\n") ? eol : "";
  return `${JSON.stringify({ ...data, scripts: { ...data.scripts, [name]: CHECK_COMMAND } }, null, indent)}${end}`;
}

// The gate step changed so that its check cannot fail: what the check of the gate is seen failing on.
export const gateStepThatCannotFail = (gate) =>
  String(gate ?? "").replace(/^\t@?node /m, "\t-@node ");

// Whether the gate runs a tool: the Makefile, an included mk file or a package script names it.
// `gate`, when given, is the gate step to read in place of the one on disk.
export function toolInGate(root, tool, gate = undefined) {
  const folder = path.join(root, MK_FOLDER);
  const mk = existsSync(folder) ? readdirSync(folder).sort() : [];
  const files = [
    ...new Set([MAKEFILE, "package.json", ...mk.map((name) => `${MK_FOLDER}/${name}`), GATE_STEP]),
  ];
  const textOf = (file) =>
    file === GATE_STEP && typeof gate === "string" ? gate : readText(root, file);
  return files.some((file) => (textOf(file) ?? "").includes(tool));
}
