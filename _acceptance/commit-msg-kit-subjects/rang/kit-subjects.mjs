// AC-1: every commit subject the kit at KIT_TAG writes by itself passes tools/commit_msg.py.
//   - Each template of KIT_SUBJECTS is found word for word in its file of the installed kit (the source outside the
//     tree), and the sample built from it fits the template (the placeholders replaced, nothing else).
//   - Over every plugin of the install, the scripts that commit with a message they write (any `commit` call with
//     -m, -qm, -am, -F or --message and a quoted or template message, a `git commit -m …` in a string, or
//     commitWip(<dir>, `…`)) are KIT_COMMITTING_SCRIPTS plus KIT_SCRATCH, no other.
//   - Over every markdown file of the install, what it tells an agent to commit (`git commit -m "…"`, commit `…`) is
//     the markdown templates of KIT_SUBJECTS plus KIT_DOC_NOT_SUBJECTS, no other.
//   - tools/commit_msg.py exits 0 on every sample, alone and followed by a body.
// Usage: node kit-subjects.mjs [--root <dir>]

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

import { judgeAll, kitInstall, root, verdict } from "./lib.mjs";
import { KIT_COMMITTING_SCRIPTS, KIT_DOC_NOT_SUBJECTS, KIT_SCRATCH, KIT_SUBJECTS, KIT_TAG } from "./matrix.mjs";

const NAME = "kit-subjects";
const dir = root();
const problems = [];

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
/** The template as a pattern: each <...> or ${...} stands for any text without a line break. */
function pattern(template) {
  const parts = template.split(/(<[^>]+>|\$\{[^}]+\})/);
  return new RegExp(`^${parts.map((p, i) => (i % 2 ? ".+?" : escape(p))).join("")}$`);
}

/** Files of the install under a version folder, skipping dependencies, built bundles and the kit's own tests. */
function files(at, ext) {
  return readdirSync(at).flatMap((n) => {
    const p = join(at, n);
    if (n === "node_modules" || n === "tests" || n === "dist" || n.startsWith(".")) return [];
    return statSync(p).isDirectory() ? files(p, ext) : ext.test(n) ? [p] : [];
  });
}

const sameSet = (a, b) => JSON.stringify([...new Set(a)].sort()) === JSON.stringify([...new Set(b)].sort());
const COMMITS_IN_SCRIPT = [
  /['"]commit['"][^\n]*['"](?:-[a-z]*m|--message|-F)['"],\s*[`'"]/,
  /git commit[^\n]*\s(?:-[a-z]*m|--message|-F)[\s=]/,
  /commitWip\(\s*[^,)]+,\s*`/,
];
const COMMITS_IN_DOC = /git commit -m "([^"]+)"|commit `([^`]+)`/g;

try {
  const kit = kitInstall(dir);
  for (const s of KIT_SUBJECTS) {
    const text = readFileSync(join(kit, s.file), "utf8");
    if (!text.includes(s.template)) problems.push(`${s.file} of the kit does not write "${s.template}"`);
    if (!pattern(s.template).test(s.sample)) problems.push(`the sample "${s.sample}" is not built from "${s.template}"`);
  }

  const versions = readdirSync(kit).map((p) => join(kit, p, "3.0.0")).filter((p) => {
    try {
      return statSync(p).isDirectory();
    } catch {
      return false;
    }
  });
  const scripts = versions.flatMap((v) => files(v, /\.(mjs|cjs|js|sh)$/));
  const committing = scripts.filter((f) => COMMITS_IN_SCRIPT.some((r) => r.test(readFileSync(f, "utf8")))).map((f) => relative(kit, f));
  const known = [...KIT_COMMITTING_SCRIPTS, ...Object.keys(KIT_SCRATCH)];
  if (!sameSet(committing, known)) {
    problems.push(`the kit's scripts that commit are ${JSON.stringify(committing.sort())}, not ${JSON.stringify(known.sort())}`);
  }

  const docs = versions.flatMap((v) => files(v, /\.md$/));
  const told = docs.flatMap((f) => [...readFileSync(f, "utf8").matchAll(COMMITS_IN_DOC)].map((m) => m[1] ?? m[2]));
  const docTemplates = KIT_SUBJECTS.filter((s) => s.file.endsWith(".md")).map((s) => s.template);
  if (!sameSet(told, [...docTemplates, ...Object.keys(KIT_DOC_NOT_SUBJECTS)])) {
    problems.push(`the kit's markdown tells to commit ${JSON.stringify([...new Set(told)].sort())}, not ${JSON.stringify([...docTemplates, ...Object.keys(KIT_DOC_NOT_SUBJECTS)].sort())}`);
  }

  const samples = KIT_SUBJECTS.flatMap((s) => [`${s.sample}\n`, `${s.sample}\n\nBody line.\n`]);
  const codes = judgeAll(dir, samples);
  codes.forEach((c, i) => {
    if (c !== 0) problems.push(`tools/commit_msg.py exits ${c} on "${samples[i].split("\n")[0]}"${i % 2 ? " with a body" : ""}`);
  });
} catch (err) {
  problems.push(err.message);
}

verdict(
  NAME,
  problems,
  `the ${KIT_SUBJECTS.length} subjects the kit ${KIT_TAG} writes (found word for word in its files; ${KIT_COMMITTING_SCRIPTS.length} scripts commit into the repository, ${Object.keys(KIT_SCRATCH).length} into a scratch repository, no other; its markdown tells to commit no other subject) pass tools/commit_msg.py, alone and with a body`,
);
