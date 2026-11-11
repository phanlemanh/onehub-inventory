#!/usr/bin/env node
// Look up the pinned ReUI catalog without the network.
//   node tools/reui_catalog/tra.mjs <words…> [--loai block|component|example] [--so <n>] [--json]
// Exit 0 with results, 1 when nothing matches, 2 on a usage error.
import { CATALOG_PATH, KINDS, TOP_N, loadIndex, pinDate, readJson, search } from "./catalog.mjs";

const args = process.argv.slice(2);
const words = [];
let kind = null;
let limit = TOP_N;
let json = false;
for (let i = 0; i < args.length; i += 1) {
  const a = args[i];
  if (a === "--loai") kind = args[++i];
  else if (a === "--so") limit = Number(args[++i]);
  else if (a === "--json") json = true;
  else words.push(a);
}
const query = words.join(" ").trim();
if (!query || (kind && !KINDS.includes(kind)) || !Number.isInteger(limit) || limit < 1) {
  console.error(
    `usage: node tools/reui_catalog/tra.mjs <words…> [--loai ${KINDS.join("|")}] [--so <n>] [--json]`,
  );
  process.exit(2);
}

const catalog = readJson(CATALOG_PATH);
const index = loadIndex(catalog);
const date = pinDate(catalog.pin);
const found = search(index, query, { limit, kind });

if (json) {
  console.log(
    JSON.stringify(
      {
        pinned: date,
        query,
        kind,
        results: found,
      },
      null,
      2,
    ),
  );
  process.exit(found.length ? 0 : 1);
}

console.log(`ReUI catalog pinned ${date}`);
if (!found.length) {
  console.log(`không có mục nào khớp «${query}» trong danh mục ReUI ghim ngày ${date}`);
  process.exit(1);
}
for (const it of found) {
  const where = it.group ? `${it.group}: ${it.category}` : it.category;
  console.log(`${it.install} · ${it.kind} · ${where} · ${it.title} · ${it.url}`);
}
