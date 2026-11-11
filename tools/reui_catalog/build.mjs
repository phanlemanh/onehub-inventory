#!/usr/bin/env node
// Regenerate, check or re-pin the ReUI catalog.
//   node tools/reui_catalog/build.mjs                    regenerate design/reui-catalog.json from the pinned snapshot (no network)
//   node tools/reui_catalog/build.mjs --check            verify pin, regeneration, findability and forbidden text (no network)
//   node tools/reui_catalog/build.mjs --refresh          download a new snapshot from reui.io and re-pin (network)
//   node tools/reui_catalog/build.mjs --refresh --from <dir>   re-pin from llms-full.txt and llms.txt in <dir> (no network)
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

import {
  CATALOG_PATH,
  CATALOG_REL,
  CatalogError,
  MAX_CATALOG_BYTES,
  PIN_PATH,
  ROOT,
  SNAPSHOT_DIR,
  SOURCES,
  TOP_N,
  catalogObject,
  checkFindable,
  checkHashes,
  exists,
  formatCatalog,
  loadIndex,
  parseSources,
  pinDate,
  readJson,
  readSnapshot,
  scanCatalog,
  scanSnapshot,
  sha256,
  sourcesFromTexts,
} from "./catalog.mjs";

const fail = (lines) => {
  for (const l of [lines].flat()) console.error(l);
  process.exit(1);
};

async function render(texts, pin) {
  const parsed = parseSources(sourcesFromTexts(texts));
  const text = await formatCatalog(catalogObject(pin, parsed), ROOT);
  const bytes = Buffer.byteLength(text);
  if (bytes > MAX_CATALOG_BYTES) {
    throw new CatalogError(`catalog too large: ${bytes} bytes > ${MAX_CATALOG_BYTES}`);
  }
  return { text, parsed };
}

async function regenerate() {
  const texts = readSnapshot();
  const pin = readJson(PIN_PATH);
  const errors = [...checkHashes(texts, pin), ...scanSnapshot(texts)];
  if (errors.length) fail(errors);
  const { text, parsed } = await render(texts, pin);
  const old = exists(CATALOG_PATH) ? readFileSync(CATALOG_PATH, "utf8") : null;
  if (old !== text) writeFileSync(CATALOG_PATH, text);
  const total = parsed.counts.block + parsed.counts.component + parsed.counts.example;
  console.log(
    `${old === text ? "unchanged" : "wrote"} ${CATALOG_REL} (${total} items, pinned ${pinDate(pin)})`,
  );
}

async function check() {
  const errors = [];
  const ok = [];
  const texts = readSnapshot();
  const pin = readJson(PIN_PATH);
  const hashErrors = checkHashes(texts, pin);
  errors.push(...hashErrors);
  if (!hashErrors.length) ok.push("snapshot hashes match pin");
  const snapErrors = scanSnapshot(texts);
  errors.push(...snapErrors);

  let catalog = null;
  if (!exists(CATALOG_PATH)) errors.push(`missing ${CATALOG_REL}`);
  else {
    const committed = readFileSync(CATALOG_PATH, "utf8");
    try {
      const { text } = await render(texts, pin);
      if (text === committed) ok.push("catalog identical to regenerated");
      else errors.push("catalog differs from regenerated: run node tools/reui_catalog/build.mjs");
    } catch (e) {
      if (!(e instanceof CatalogError)) throw e;
      errors.push(e.message);
    }
    catalog = JSON.parse(committed);
  }

  if (catalog) {
    const forbidden = scanCatalog(catalog);
    errors.push(...forbidden);
    const index = loadIndex(catalog);
    const declared = Object.values(catalog.counts ?? {}).reduce((a, b) => a + b, 0);
    if (declared !== index.items.length) {
      errors.push(`counts declare ${declared} items, catalog has ${index.items.length}`);
    }
    const f = checkFindable(index);
    errors.push(...f.errors);
    ok.push(`findable by name: ${f.byName}/${f.total}`);
    ok.push(`findable by title: ${f.byTitle}/${f.total} within top ${TOP_N}`);
    ok.push(`forbidden: ${forbidden.length + snapErrors.length}`);
  }
  for (const l of ok) console.log(l);
  if (errors.length) fail(errors);
}

async function refresh(fromDir) {
  const texts = {};
  for (const s of SOURCES) {
    if (fromDir) texts[s.file] = readFileSync(join(resolve(fromDir), s.file), "utf8");
    else {
      const res = await fetch(s.url);
      if (!res.ok) fail(`download failed: ${s.url} ${res.status}`);
      texts[s.file] = await res.text();
    }
  }
  const forbidden = scanSnapshot(texts);
  if (forbidden.length) fail(["refusing to pin a source with forbidden text:", ...forbidden]);
  const pin = {
    fetched_at: new Date().toISOString(),
    files: SOURCES.map((s) => ({
      file: s.file,
      url: s.url,
      bytes: Buffer.byteLength(texts[s.file]),
      sha256: sha256(texts[s.file]),
    })),
  };
  const { text, parsed } = await render(texts, pin); // throws before anything is written

  const before = new Set();
  if (exists(CATALOG_PATH)) {
    for (const it of loadIndex(readJson(CATALOG_PATH)).items) before.add(it.name);
  }
  const after = new Set(loadIndex(JSON.parse(text)).items.map((it) => it.name));

  mkdirSync(SNAPSHOT_DIR, { recursive: true });
  for (const s of SOURCES) writeFileSync(join(SNAPSHOT_DIR, s.file), texts[s.file]);
  writeFileSync(PIN_PATH, `${JSON.stringify(pin, null, 2)}\n`);
  writeFileSync(CATALOG_PATH, text);

  for (const n of [...after].filter((n) => !before.has(n)).sort()) console.log(`added: ${n}`);
  for (const n of [...before].filter((n) => !after.has(n)).sort()) console.log(`removed: ${n}`);
  const c = parsed.counts;
  console.log(
    `pinned ${pinDate(pin)}: ${c.block} blocks, ${c.component} components, ${c.example} examples`,
  );
}

const args = process.argv.slice(2);
try {
  if (args.includes("--refresh")) {
    const i = args.indexOf("--from");
    await refresh(i >= 0 ? args[i + 1] : null);
  } else if (args.includes("--check")) await check();
  else await regenerate();
} catch (e) {
  if (e instanceof CatalogError) fail(e.message);
  throw e;
}
