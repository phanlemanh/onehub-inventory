// AC-4: every line the old-name sweep of nang-kit-3-0 (AC-8) finds at HEAD is one of the six false keys in
// .claude/settings.json. That record's files are imported, never edited.
import { fileURLToPath } from "node:url";

import { sweep } from "../../nang-kit-3-0/rang/leftover.mjs";
import { cli, repoRoot } from "./kit.mjs";
import { OLD_MARKET, OLD_PLUGINS } from "./matrix.mjs";

const SETTINGS = ".claude/settings.json";
const LINE = /^([^:]+):(\d+):(.*)$/;
// Escapes every regular-expression metacharacter, backslash included.
const escapeRegExp = (s) => s.replace(/[\\^$.*+?()[\]{}|-]/g, "\\$&");
const FALSE_KEY = new RegExp(`^\\s*"([a-z-]+)@${escapeRegExp(OLD_MARKET)}": false,?\\s*$`);

export function judge(lines) {
  const keys = [];
  for (const l of lines) {
    const m = LINE.exec(l);
    const file = m ? m[1] : l;
    if (file !== SETTINGS) return { ok: false, line: `quet-ten-cu: sweep line outside ${SETTINGS}: ${file}` };
    const k = FALSE_KEY.exec(m[3]);
    if (!k || !OLD_PLUGINS.includes(k[1]))
      return { ok: false, line: `quet-ten-cu: sweep line in ${SETTINGS} is not a false key: ${m[3].trim().slice(0, 120)}` };
    keys.push(k[1]);
  }
  const names = [...new Set(keys)].sort();
  if (keys.length !== OLD_PLUGINS.length || names.length !== OLD_PLUGINS.length)
    return { ok: false, line: `quet-ten-cu: sweep finds ${keys.length} false-key lines, want ${OLD_PLUGINS.length}` };
  return {
    ok: true,
    line: `quet-ten-cu: nk30 sweep at HEAD finds ${keys.length} lines, all false keys in ${SETTINGS} for the six old-marketplace plugins`,
  };
}

export async function measure({ root = repoRoot() } = {}) {
  return judge(sweep(root).lines);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await cli(measure);
