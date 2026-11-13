#!/usr/bin/env node
// Reconciliation of the role × screen suite (roadmap row 9b, AC-2): reads Playwright's JSON report, takes the steps the
// role door wrote it must run (annotation `vai-man-mong` of tests/e2e-db/vai.setup.ts, from `pairs()`), takes the
// pair steps that really ran and passed, and fails when the two sets differ — naming every extra or missing step.
//   node tests/e2e-db/vai-man-doi-chieu.mjs <report.json>
import { readFileSync } from "node:fs";

const PAIR_STEP = /^(\S+) × (\S+) @(\d+): (duoc vao|khong du quyen|day ve hom nay)$/;

function walk(suites, visit) {
  for (const suite of suites ?? []) {
    for (const spec of suite.specs ?? []) for (const t of spec.tests ?? []) visit(spec, t);
    walk(suite.suites, visit);
  }
}

function steps(list, out) {
  for (const s of list ?? []) {
    out.push(s);
    steps(s.steps, out);
  }
  return out;
}

export function reconcile(report) {
  let want = null;
  const ran = new Set();
  walk(report.suites, (_spec, t) => {
    for (const r of t.results ?? []) {
      for (const a of [...(t.annotations ?? []), ...(r.annotations ?? [])])
        if (a.type === "vai-man-mong") want = JSON.parse(a.description);
      for (const s of steps(r.steps, [])) if (PAIR_STEP.test(s.title) && !s.error) ran.add(s.title);
    }
  });
  if (!want)
    return {
      ok: false,
      lines: ["doi chieu: khong thay danh sach buoc cua cua dang nhap (vai-man-mong)"],
    };
  const must = new Set(want.steps);
  const lines = [];
  for (const s of [...must].sort()) if (!ran.has(s)) lines.push(`doi chieu: thieu ${s}`);
  for (const s of [...ran].sort()) if (!must.has(s)) lines.push(`doi chieu: thua ${s}`);
  lines.push(`vai x man: ${want.pairs} cap, ${ran.size} buoc`);
  return { ok: lines.length === 1, lines };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const file = process.argv[2];
  if (!file) {
    console.error("cach goi: node tests/e2e-db/vai-man-doi-chieu.mjs <report.json>");
    process.exit(2);
  }
  const { ok, lines } = reconcile(JSON.parse(readFileSync(file, "utf8")));
  for (const l of lines) console.log(l);
  process.exit(ok ? 0 : 1);
}
