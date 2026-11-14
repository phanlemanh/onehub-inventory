#!/usr/bin/env node
// Row 2e (bo-o-tim-cua-vung), E18 — AC-9: every test line this row REMOVED that spoke of the region search box has a row
// in the old → new table (doi-bai-kiem.md), and every row points at a test that exists in the tree.
//
//   node _acceptance/bo-o-tim-cua-vung/rang/doi-bai-kiem.mjs --root . [--base <commit>] [--table <file>] [--self-test]
//
// The removed lines come from `git diff -U0 <base>` over tests/** and tools/e2e_templates/** (base: the merge-base with
// origin/main). A line counts when it holds one of the seven marks written below. Rows are matched by file and the
// line's text (trimmed), as many rows as removed copies. Exit 0 and one count line when every line has its row and every
// row's new case exists; exit 1 with the first problem otherwise. --self-test also runs the two breaks on a copy of the
// table: one row removed, one row pointed at a case that does not exist; each must fail with its pinned message.
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

/** Written before the check: what makes a removed test line one about the region search box (7 marks). */
const MARKS = [
  /searchbox/,
  /Gõ để tìm/,
  /Tìm trong vùng/,
  /Tìm không ra/,
  /tim-khong-ra/,
  /NO_SEARCH_CASE/,
  // The view's search text as code: a `query` key, property or prop (not a word in a sentence).
  /\bquery\s*[:=?]|\.query\b|"query"/,
];
const SCOPES = ["tests", "tools/e2e_templates"];

function arg(name, fallback) {
  const i = process.argv.indexOf(name);
  return i > 0 ? process.argv[i + 1] : fallback;
}

const git = (root, ...args) => execFileSync("git", ["-C", root, ...args], { encoding: "utf8" });

/** The removed lines with a mark, as {file, line (in the base), text (trimmed)}. */
export function removedLines(root, base) {
  const out = git(root, "diff", "-U0", "--no-color", base, "--", ...SCOPES);
  const found = [];
  let file = null;
  let at = 0;
  for (const raw of out.split("\n")) {
    if (raw.startsWith("--- ")) {
      file = raw.startsWith("--- a/") ? raw.slice(6) : null;
      continue;
    }
    if (raw.startsWith("+++ ")) continue;
    const hunk = /^@@ -(\d+)(?:,\d+)? \+/.exec(raw);
    if (hunk) {
      at = Number(hunk[1]);
      continue;
    }
    if (raw.startsWith("-") && file) {
      const text = raw.slice(1);
      if (MARKS.some((m) => m.test(text))) found.push({ file, line: at, text: text.trim() });
      at += 1;
    }
  }
  return found;
}

/** Cell text without its code fence: `x` or `` x ``. */
const unfence = (cell) => {
  const t = cell.trim();
  const m = /^(`+)\s?([\s\S]*?)\s?\1$/.exec(t);
  return m ? m[2] : t;
};

/** The table rows: | Tệp cũ | Dòng cũ | Ca cũ | Tệp mới | Ca mới | Khẳng định mới |. */
export function tableRows(text) {
  return text
    .split("\n")
    .filter((l) => l.startsWith("| ") && !/^\| (Tệp cũ|-)/.test(l))
    .map((l) => {
      const cells = l
        .slice(1, -1)
        .split(/(?<!\\)\|/)
        .map((c) => c.replace(/\\\|/g, "|"));
      return {
        oldFile: unfence(cells[0] ?? ""),
        oldLine: unfence(cells[1] ?? ""),
        newFile: unfence(cells[3] ?? ""),
        newCase: unfence(cells[4] ?? ""),
      };
    });
}

/** The first problem, or null: a removed line without its row, or a row whose new case is not in the tree. */
export function problem(root, lines, rows) {
  const left = new Map();
  for (const r of rows) {
    const k = `${r.oldFile}\u0000${r.oldLine}`;
    left.set(k, (left.get(k) ?? 0) + 1);
  }
  for (const l of lines) {
    const k = `${l.file}\u0000${l.text}`;
    const n = left.get(k) ?? 0;
    if (n === 0) return `doi-bai-kiem: thieu hang cho dong bo: ${l.file}:${l.line}`;
    left.set(k, n - 1);
  }
  for (const r of rows) {
    const path = join(root, r.newFile);
    if (!r.newFile || !existsSync(path)) return `doi-bai-kiem: tep moi khong co: ${r.newFile}`;
    if (!r.newCase || !readFileSync(path, "utf8").includes(r.newCase))
      return `doi-bai-kiem: ca khong co: ${r.newCase}`;
  }
  return null;
}

function run(root, base, tablePath) {
  const lines = removedLines(root, base);
  const rows = tableRows(readFileSync(tablePath, "utf8"));
  return { lines, rows, problem: problem(root, lines, rows) };
}

function main() {
  const root = resolve(arg("--root", "."));
  const base = arg("--base", git(root, "merge-base", "HEAD", "origin/main").trim());
  const tablePath = resolve(root, arg("--table", "_acceptance/bo-o-tim-cua-vung/doi-bai-kiem.md"));
  const result = run(root, base, tablePath);
  if (result.problem) {
    console.error(result.problem);
    process.exit(1);
  }
  console.log(
    `doi-bai-kiem: ${result.lines.length} dong bo co hang (${result.rows.length} hang, ${MARKS.length} dau hieu), moi ca moi co that`,
  );
  if (!process.argv.includes("--self-test")) return;
  const dir = mkdtempSync(join(tmpdir(), "doi-bai-kiem-"));
  const table = readFileSync(tablePath, "utf8").split("\n");
  const firstRow = table.findIndex((l) => l.startsWith("| ") && !/^\| (Tệp cũ|-)/.test(l));
  const first = tableRows(table[firstRow])[0];
  const breaks = [
    {
      name: "xoa mot hang",
      lines: table.filter((_, i) => i !== firstRow),
      want: /^doi-bai-kiem: thieu hang cho dong bo: /,
    },
    {
      name: "tro toi ca khong co",
      lines: table.map((l, i) =>
        i === firstRow ? l.split(first.newCase).join("ca-khong-co-zzz") : l,
      ),
      want: /^doi-bai-kiem: ca khong co: ca-khong-co-zzz$/,
    },
  ];
  for (const brk of breaks) {
    const copy = join(dir, `${brk.name.replace(/ /g, "-")}.md`);
    writeFileSync(copy, brk.lines.join("\n"));
    const got = run(root, base, copy).problem;
    if (!got || !brk.want.test(got)) {
      console.error(`doi-bai-kiem: ca pha "${brk.name}" khong do dung thong diep (nhan: ${got})`);
      process.exit(1);
    }
    console.log(`ca pha "${brk.name}": do — ${got}`);
  }
}

main();
