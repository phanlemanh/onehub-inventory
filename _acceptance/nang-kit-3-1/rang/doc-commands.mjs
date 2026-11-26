// AC-4: every /<plugin>:<command> and every kit path the living docs name exists in kit 3.1.
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { cli, fetchKit, repoRoot } from "./kit.mjs";
import { DOC_COUNTS, DOC_FILES, NEW_KIT } from "./matrix.mjs";

const COMMAND = /(?<![\w.:/])\/([a-z][a-z0-9-]*):([a-z][a-z0-9-]*)/g;
const KIT_PATH = /plugins\/acceptance-gate\/[\w./-]+\.md/g;

export function commandExists(kitDir, plugin, command) {
  const p = join(kitDir, "plugins", plugin);
  return existsSync(join(p, "commands", `${command}.md`)) || existsSync(join(p, "skills", command, "SKILL.md"));
}

export function judge(texts, kitDir) {
  const mentions = [];
  let paths = 0;
  for (const text of texts) {
    for (const m of text.matchAll(COMMAND)) {
      mentions.push(m[0]);
      if (!commandExists(kitDir, m[1], m[2])) return { ok: false, line: `doc-commands: ${m[0]} not in kit ${NEW_KIT.tag}` };
    }
    for (const m of text.matchAll(KIT_PATH)) {
      paths += 1;
      if (!existsSync(join(kitDir, m[0]))) return { ok: false, line: `doc-commands: ${m[0]} not in kit ${NEW_KIT.tag}` };
    }
  }
  const distinct = new Set(mentions).size;
  const got = { mentions: mentions.length, distinct, paths };
  const counted = `${got.mentions} command mentions (${got.distinct} distinct) and ${got.paths} kit path in ${texts.length} files`;
  if (JSON.stringify(got) !== JSON.stringify(DOC_COUNTS))
    return { ok: false, line: `doc-commands: ${counted}, want ${JSON.stringify(DOC_COUNTS)}` };
  return { ok: true, line: `doc-commands: ${counted}, all found in kit ${NEW_KIT.tag}` };
}

export async function measure({ root = repoRoot(), texts } = {}) {
  const docs = texts ?? DOC_FILES.map((f) => readFileSync(join(root, f), "utf8"));
  return judge(docs, fetchKit(NEW_KIT));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await cli(measure);
