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

// `request.find`: for each rule, the first of the candidate files the lint reads with that rule as
// an error, or null.
// `request.jobs`: for each, the rules that reject each probe beyond those that reject the control
// text, then the same with those rules turned off: the changed copy, which must let them through.
async function run(root, request) {
  const ESLint = await loadLint(root);
  if (!ESLint) return { error: "the repository has no lint installed that this tool can run" };
  const lint = new ESLint({ cwd: root });
  if (request.find) {
    const at = Object.fromEntries(request.find.rules.map((rule) => [rule, null]));
    for (const file of request.find.candidates) {
      if (Object.values(at).every(Boolean)) break;
      const full = path.join(root, file);
      if (await lint.isPathIgnored(full)) continue;
      const config = await lint.calculateConfigForFile(full);
      for (const rule of request.find.rules) {
        if (!at[rule] && severity(config?.rules?.[rule]) === ERROR) at[rule] = file;
      }
    }
    return { at };
  }
  const results = {};
  for (const job of request.jobs) {
    try {
      const [base, ...probes] = await rejected(lint, root, job.at, [job.control, ...job.probes]);
      const fired = probes.map((rules) => rules.filter((rule) => !base.includes(rule)));
      const turnedOff = [...new Set(fired.flat())].sort();
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
      results[job.key] = { error: `the repository's lint failed: ${error.message.split("\n")[0]}` };
    }
  }
  return { results };
}
