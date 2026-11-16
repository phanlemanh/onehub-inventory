// The lint adapter for ESLint: where a repository keeps its configuration, how a ledger row points
// at one of its rules, how an exception to a rule is written, and how to run the repository's own
// lint on a text. The lint is the one the repository installed: this plugin brings none.
import { createRequire } from "node:module";
import path from "node:path";
import { pathToFileURL } from "node:url";

export const adapter = {
  id: "eslint",
  kind: "lint",
  names: ["eslint"],
  // A ledger row that a lint rule holds points at it as `eslint:<rule>`.
  prefix: "eslint",
  configFiles: ["eslint.config.js", "eslint.config.mjs", "eslint.config.ts"],
  // An exception written in the source, from its first word to the end of its line.
  exception: /eslint-disable[^\n]*/g,
  // Ways to make an exception without a reason: to every rule on the next line, to one rule on the
  // next line, and to every rule in the whole file.
  exceptionsWithoutReason: (rules) => [
    "// eslint-disable-next-line",
    ...rules.map((rule) => `// eslint-disable-next-line ${rule}`),
    "/* eslint-disable */",
  ],
  run,
};

const ERROR = 2;
const severity = (setting) => {
  const level = Array.isArray(setting) ? setting[0] : setting;
  return { off: 0, warn: 1, error: 2 }[level] ?? level;
};

// The repository's lint, from its own packages. Null when it has none.
async function loadLint(root) {
  try {
    const require = createRequire(path.join(root, "package.json"));
    return (await import(pathToFileURL(require.resolve("eslint")).href)).ESLint;
  } catch {
    return null;
  }
}

// What the lint rejects in each text, as the rules that report an error on it, linted as if it
// were the file `at`.
async function rejected(lint, root, at, texts) {
  const found = [];
  for (const text of texts) {
    const [result] = await lint.lintText(text, { filePath: path.join(root, at) });
    found.push(
      [
        ...new Set(
          result.messages
            .filter((message) => message.severity === ERROR && message.ruleId)
            .map((message) => message.ruleId),
        ),
      ].sort(),
    );
  }
  return found;
}

// What a lint that threw is reported as: the first line of what it said.
const failed = (error) =>
  `the repository's lint failed: ${String(error?.message ?? error).split("\n")[0]}`;

// For each rule, the first of the candidate files the lint reads with that rule as an error, or
// null.
async function firstErrors(lint, root, { rules, candidates }) {
  const at = Object.fromEntries(rules.map((rule) => [rule, null]));
  for (const file of candidates) {
    if (Object.values(at).every(Boolean)) break;
    const full = path.join(root, file);
    if (await lint.isPathIgnored(full)) continue;
    const config = await lint.calculateConfigForFile(full);
    for (const rule of rules) {
      if (!at[rule] && severity(config?.rules?.[rule]) === ERROR) at[rule] = file;
    }
  }
  return at;
}

// `request.find`: what `firstErrors` answers, or `{ error }` when the lint throws, as it does on a
// configuration it cannot read.
// `request.jobs`: for each, the rules that reject each probe beyond those that reject the control
// text, then the same with the job's rule turned off: the changed copy, which must let them
// through. A job without a rule turns off every rule that rejected a probe.
async function run(root, request) {
  const ESLint = await loadLint(root);
  if (!ESLint) return { error: "the repository has no lint installed that this tool can run" };
  let lint;
  try {
    lint = new ESLint({ cwd: root });
    if (request.find) return { at: await firstErrors(lint, root, request.find) };
  } catch (error) {
    return { error: failed(error) };
  }
  const results = {};
  for (const job of request.jobs) {
    try {
      const [base, ...probes] = await rejected(lint, root, job.at, [job.control, ...job.probes]);
      const fired = probes.map((rules) => rules.filter((rule) => !base.includes(rule)));
      const turnedOff = job.rule ? [job.rule] : [...new Set(fired.flat())].sort();
      const changed = new ESLint({
        cwd: root,
        overrideConfig: { rules: Object.fromEntries(turnedOff.map((rule) => [rule, "off"])) },
      });
      const [offBase, ...offProbes] = await rejected(changed, root, job.at, [
        job.control,
        ...job.probes,
      ]);
      const off = offProbes.map((rules) => rules.filter((rule) => !offBase.includes(rule)));
      results[job.key] = { fired, off, turnedOff };
    } catch (error) {
      results[job.key] = { error: failed(error) };
    }
  }
  return { results };
}
