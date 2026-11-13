// Row 1s (_acceptance/ci-co-postgres, AC-4, E4): the hand-over count on the two JSON reports of a real `make ci-db`
// run (tests/fixtures/ci-db — copied from the run with fields the count does not read left out, never written by
// hand). Break copies are edits of those very reports, each pinned to its line.
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { GIAO as RUNNER_GIAO } from "../tools/e2e_templates/runner";
import { GIAO, handOver, type PwReport, rows } from "./e2e-db/dem-giao-nhan";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const FIX = join(ROOT, "tests/fixtures/ci-db");
const load = (name: string) =>
  JSON.parse(readFileSync(join(FIX, `${name}.json`), "utf8")) as PwReport;

/** Counted here independently of the count: tests the signed-out run skipped with the hand-over reason. */
function handedIndependently(report: PwReport): number {
  let n = 0;
  const walk = (s: PwReport["suites"][number]) => {
    for (const spec of s.specs ?? [])
      for (const t of spec.tests) {
        const notes = [
          ...(t.annotations ?? []),
          ...(t.results ?? []).flatMap((r) => r.annotations ?? []),
        ];
        if (
          t.status === "skipped" &&
          notes.some((a) => a.type === "skip" && a.description === GIAO)
        )
          n++;
      }
    for (const c of s.suites ?? []) walk(c);
  };
  report.suites.forEach(walk);
  return n;
}

/** Visit every test of a report with its title path; the callback may change it in place. */
function eachTest(
  report: PwReport,
  fn: (
    path: string[],
    t: PwReport["suites"][number]["specs"] extends (infer S)[] | undefined
      ? S extends { tests: (infer T)[] }
        ? T
        : never
      : never,
  ) => void,
): void {
  const walk = (s: PwReport["suites"][number], path: string[]) => {
    for (const spec of s.specs ?? []) for (const t of spec.tests) fn([...path, spec.title], t);
    for (const c of s.suites ?? []) walk(c, [...path, c.title]);
  };
  for (const top of report.suites) walk(top, []);
}

describe("phep dem giao nhan tren bao cao that (AC-4)", () => {
  const out = load("khong-phien");
  const inn = load("co-phien");

  it("ly do giao trung voi bo kiem chung", () => {
    expect(GIAO).toBe(RUNNER_GIAO);
  });

  it("doi chung duong: giao N · nhan N · roi 0 · do nham 0, N = so bai skip ly do giao dem doc lap", () => {
    const n = handedIndependently(out);
    expect(n).toBeGreaterThan(0);
    const c = handOver(out, inn);
    expect(c).toEqual({ giao: n, nhan: n, roi: [], doNham: [] });
  });

  it("pha 1: bo mot bai nhan khoi luot co phien → 'roi: <kho> <duong ten>'", () => {
    const handed = rows(out).find((r) => r.outcome === "skipped" && r.skipReasons.includes(GIAO))!;
    const want = `${handed.project.replace(/^co-phien-/, "")} ${handed.path.join(" › ")}`;
    const broken = structuredClone(inn);
    let removed = 0;
    const strip = (s: PwReport["suites"][number], path: string[]) => {
      for (const spec of s.specs ?? []) {
        const full = [...path, spec.title].join(" › ");
        const before = spec.tests.length;
        spec.tests = spec.tests.filter(
          (t) =>
            !(full === handed.path.join(" › ") && t.projectName === `co-phien-${handed.project}`),
        );
        removed += before - spec.tests.length;
      }
      for (const c of s.suites ?? []) strip(c, [...path, c.title]);
    };
    for (const top of broken.suites) strip(top, []);
    expect(removed).toBe(1);
    expect(handOver(out, broken).roi).toEqual([`roi: ${want}`]);
  });

  it("pha 2: doi bai nhan ay thanh bi bo qua → 'roi: <kho> <duong ten>'", () => {
    const handed = rows(out).find((r) => r.outcome === "skipped" && r.skipReasons.includes(GIAO))!;
    const broken = structuredClone(inn);
    let changed = 0;
    eachTest(broken, (path, t) => {
      if (
        path.join(" › ") === handed.path.join(" › ") &&
        t.projectName === `co-phien-${handed.project}`
      ) {
        t.status = "skipped";
        for (const r of t.results ?? []) r.status = "skipped";
        changed++;
      }
    });
    expect(changed).toBe(1);
    expect(handOver(out, broken).roi).toEqual([
      `roi: ${handed.project} ${handed.path.join(" › ")}`,
    ]);
  });

  it("pha 3: mot bai cua man da giao bao dat o luot khong phien → 'do nham trang dang nhap: …'", () => {
    const handed = rows(out).find((r) => r.outcome === "skipped" && r.skipReasons.includes(GIAO))!;
    const broken = structuredClone(out);
    eachTest(broken, (path, t) => {
      if (path.join(" › ") === handed.path.join(" › ") && t.projectName === handed.project) {
        t.status = "expected";
        t.annotations = [];
        t.results = [{ status: "passed", annotations: [] }];
      }
    });
    const c = handOver(broken, inn);
    expect(c.doNham).toEqual([
      `do nham trang dang nhap: ${handed.project} ${handed.path.join(" › ")}`,
    ]);
    expect(c.giao).toBe(handedIndependently(out) - 1);
  });

  it("pha 4: luot khong phien khong giao bai nao → giao 0, va lenh in dong ghim, ma 1", () => {
    const broken = structuredClone(out);
    eachTest(broken, (_p, t) => {
      t.annotations = (t.annotations ?? []).filter((a) => a.description !== GIAO);
      for (const r of t.results ?? [])
        r.annotations = (r.annotations ?? []).filter((a) => a.description !== GIAO);
    });
    expect(handOver(broken, inn).giao).toBe(0);
    const dir = mkdtempSync(join(tmpdir(), "dem-giao-nhan-"));
    try {
      writeFileSync(join(dir, "khong-phien.json"), JSON.stringify(broken));
      writeFileSync(join(dir, "co-phien.json"), JSON.stringify(inn));
      const r = spawnSync(process.execPath, [join(ROOT, "tests/e2e-db/dem-giao-nhan.ts"), dir], {
        cwd: ROOT,
        encoding: "utf8",
      });
      expect(r.stdout).toMatch(/^giao: 0 — luot khong phien khong giao bai nao$/m);
      expect(r.status).toBe(1);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("pha 5: moi bai cua mot tep spec bi bo qua → 'tep khong co bai dat: <tep>', ma 1", () => {
    const broken = structuredClone(inn);
    const top = broken.suites.find((s) => s.title === "goc-nhin.spec.ts")!;
    const skipAll = (s: PwReport["suites"][number]) => {
      for (const spec of s.specs ?? [])
        for (const t of spec.tests) {
          t.status = "skipped";
          for (const r of t.results ?? []) r.status = "skipped";
        }
      for (const c of s.suites ?? []) skipAll(c);
    };
    skipAll(top);
    const dir = mkdtempSync(join(tmpdir(), "dem-giao-nhan-"));
    try {
      writeFileSync(join(dir, "khong-phien.json"), JSON.stringify(out));
      writeFileSync(join(dir, "co-phien.json"), JSON.stringify(broken));
      const r = spawnSync(process.execPath, [join(ROOT, "tests/e2e-db/dem-giao-nhan.ts"), dir], {
        cwd: ROOT,
        encoding: "utf8",
      });
      expect(r.stdout).toMatch(/^tep khong co bai dat: tests\/e2e-db\/goc-nhin\.spec\.ts$/m);
      expect(r.stdout).toMatch(/^giao: \d+ · nhan: \d+ · roi: 0 · do nham: 0$/m);
      expect(r.status).toBe(1);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("doi chung: lenh tren hai bao cao lanh in dong tong va ma 0", () => {
    const dir = mkdtempSync(join(tmpdir(), "dem-giao-nhan-"));
    try {
      writeFileSync(join(dir, "khong-phien.json"), JSON.stringify(out));
      writeFileSync(join(dir, "co-phien.json"), JSON.stringify(inn));
      const r = spawnSync(process.execPath, [join(ROOT, "tests/e2e-db/dem-giao-nhan.ts"), dir], {
        cwd: ROOT,
        encoding: "utf8",
      });
      const n = handedIndependently(out);
      expect(r.stdout).toMatch(new RegExp(`^giao: ${n} · nhan: ${n} · roi: 0 · do nham: 0$`, "m"));
      expect(r.status).toBe(0);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
