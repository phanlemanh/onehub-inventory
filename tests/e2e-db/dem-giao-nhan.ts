// Hand-over count between the two runs of the register-driven suite (row 1s, _acceptance/ci-co-postgres AC-4; Ngoài-4
// of row 1r), and passed tests per file. Reads the JSON reports `make ci-db` writes into one folder:
//   khong-phien.json — signed-out run (main configuration), co-phien.json — signed-in run (playwright.db.config.ts),
//   bai-db.json      — database tests (vitest), optional: absent when the step did not run.
//
//   node tests/e2e-db/dem-giao-nhan.ts <folder> [--tep-bai <list>]
//
// Every test file of the repo (`tests/e2e-db/*.spec.ts`, and `tests/db/*.db.test.ts` when bai-db.json is there) must
// have at least one passed test. By default the files are the ones on disk — the only form `make ci-db` and CI use.
// `--tep-bai <list>` (one repo-relative path per line) replaces that listing; it exists so tests/dem-giao-nhan.test.ts
// can run the command on its stored reports with the files those reports came from, not the files of today's tree.
//
// A test the signed-out run skipped with the hand-over reason is «giao». Each one must have, in the signed-in run, a
// test with the same title path in project `co-phien-<size>` that passed — the slowed copy (`cham › …`, only at the
// slow size of the signed-out run) is received by the normal test of the same size. And no test of a handed screen may
// pass in the signed-out run: passing there means it measured the sign-in page. Prints
//   giao: <N> · nhan: <N> · roi: 0 · do nham: 0
// and exits 0, or names every `roi: <size> <path>` / `do nham trang dang nhap: <size> <path>` and exits 1.
// Plain Node (types stripped): no imports outside node:.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, dirname, join, relative } from "node:path";

/** Same text as GIAO in tools/e2e_templates/runner.ts (tests/dem-giao-nhan.test.ts keeps them equal). */
export const GIAO = "can dang nhap — do o luot co phien";
const SIGNED_IN_PREFIX = "co-phien-";
const SLOW = "cham";

interface PwResult {
  status?: string;
  annotations?: { type: string; description?: string }[];
}
interface PwTest {
  projectName: string;
  status?: string;
  annotations?: { type: string; description?: string }[];
  results?: PwResult[];
}
interface PwSpec {
  title: string;
  file?: string;
  tests: PwTest[];
}
interface PwSuite {
  title: string;
  file?: string;
  specs?: PwSpec[];
  suites?: PwSuite[];
}
export interface PwReport {
  suites: PwSuite[];
}

export interface Row {
  file: string;
  project: string;
  /** Titles below the file, describe blocks then the test. */
  path: string[];
  /** passed | skipped | failed */
  outcome: "passed" | "skipped" | "failed";
  skipReasons: string[];
}

function outcomeOf(t: PwTest): Row["outcome"] {
  const last = t.results?.[t.results.length - 1];
  if (t.status === "skipped" || last?.status === "skipped") return "skipped";
  if (last?.status === "passed" && (t.status === "expected" || t.status === "flaky"))
    return "passed";
  return "failed";
}

/** Every test of a Playwright JSON report, one row per test and project. */
export function rows(report: PwReport): Row[] {
  const out: Row[] = [];
  const walk = (suite: PwSuite, file: string, path: string[]) => {
    for (const spec of suite.specs ?? []) {
      for (const t of spec.tests) {
        const notes = [
          ...(t.annotations ?? []),
          ...(t.results ?? []).flatMap((r) => r.annotations ?? []),
        ];
        out.push({
          // The spec file the run entered, not where the test is defined (the shared suite lives in tools/).
          file,
          project: t.projectName,
          path: [...path, spec.title],
          outcome: outcomeOf(t),
          skipReasons: notes.filter((a) => a.type === "skip").map((a) => a.description ?? ""),
        });
      }
    }
    for (const child of suite.suites ?? []) walk(child, file, [...path, child.title]);
  };
  // The top suites are files: their title is the file path, not part of a test's path.
  for (const top of report.suites) walk(top, top.file ?? top.title, []);
  return out;
}

const size = (project: string) => project.replace(/^co-phien-/, "");
const normal = (path: string[]) => (path[0] === SLOW ? path.slice(1) : path);
const key = (project: string, path: string[]) => `${size(project)} ${normal(path).join(" › ")}`;
/** The screen of a path: its first title `man <id>` once the slowed copy's prefix is removed. */
const screenOf = (path: string[]) => {
  const first = normal(path)[0] ?? "";
  return first.startsWith("man ") ? first : null;
};

export interface Count {
  giao: number;
  nhan: number;
  roi: string[];
  doNham: string[];
}

export function handOver(signedOut: PwReport, signedIn: PwReport): Count {
  const out = rows(signedOut);
  const inRows = rows(signedIn).filter((r) => r.project.startsWith(SIGNED_IN_PREFIX));
  const passedIn = new Set(
    inRows.filter((r) => r.outcome === "passed").map((r) => key(r.project, r.path)),
  );
  const handed = out.filter((r) => r.outcome === "skipped" && r.skipReasons.includes(GIAO));
  const roi = handed
    .filter((r) => !passedIn.has(key(r.project, r.path)))
    .map((r) => `roi: ${key(r.project, r.path)}`);
  const screens = new Set(
    handed.map((r) => screenOf(r.path)).filter((s): s is string => s !== null),
  );
  const doNham = out
    .filter((r) => r.outcome === "passed" && screens.has(screenOf(r.path) ?? ""))
    .map((r) => `do nham trang dang nhap: ${key(r.project, r.path)}`);
  return { giao: handed.length, nhan: handed.length - roi.length, roi, doNham };
}

/**
 * Test files matching `re` directly under `dir`, repo-relative and sorted: the files on disk under `root`, or, when
 * `list` is given, the entries of that list instead.
 */
export function testFiles(root: string, dir: string, re: RegExp, list?: string[]): string[] {
  const all = list
    ? list.filter((p) => dirname(p) === dir && re.test(basename(p)))
    : readdirSync(join(root, dir))
        .filter((f) => re.test(f))
        .map((f) => join(dir, f));
  return [...new Set(all)].sort();
}

/** Files of `files` with no passed test in `passed`. */
export function filesWithoutPass(files: string[], passed: Map<string, number>): string[] {
  return files.filter((f) => (passed.get(f) ?? 0) === 0);
}

interface VitestReport {
  testResults: { name: string; assertionResults: { status: string }[] }[];
}

function main(folder: string, list?: string[]): number {
  const root = process.cwd();
  const need = ["khong-phien.json", "co-phien.json"].filter((f) => !existsSync(join(folder, f)));
  if (need.length > 0) {
    for (const f of need) console.log(`thieu bao cao: ${join(folder, f)}`);
    return 1;
  }
  const read = <T>(f: string) => JSON.parse(readFileSync(join(folder, f), "utf8")) as T;
  const signedIn = read<PwReport>("co-phien.json");
  const c = handOver(read<PwReport>("khong-phien.json"), signedIn);
  let red = false;

  // Passed tests per file, from the reports — a name in a log does not prove a file ran.
  const perSpec = new Map<string, number>();
  for (const r of rows(signedIn)) {
    const f = join("tests/e2e-db", r.file.replace(/^.*tests\/e2e-db\//, ""));
    perSpec.set(f, (perSpec.get(f) ?? 0) + (r.outcome === "passed" ? 1 : 0));
  }
  const perDb = new Map<string, number>();
  const dbReport = join(folder, "bai-db.json");
  if (existsSync(dbReport)) {
    for (const t of read<VitestReport>("bai-db.json").testResults) {
      const f = relative(root, t.name);
      perDb.set(f, t.assertionResults.filter((a) => a.status === "passed").length);
    }
  } else {
    console.log("bai-db: khong co bao cao (buoc khong chay)");
  }
  const groups: [string, RegExp, Map<string, number>][] = [
    ["tests/e2e-db", /\.spec\.ts$/, perSpec],
  ];
  if (existsSync(dbReport)) groups.unshift(["tests/db", /\.db\.test\.ts$/, perDb]);
  for (const [dir, re, m] of groups) {
    const files = testFiles(root, dir, re, list);
    for (const f of files) console.log(`tep: ${f} dat ${m.get(f) ?? 0}`);
    for (const f of filesWithoutPass(files, m)) {
      console.log(`tep khong co bai dat: ${f}`);
      red = true;
    }
  }

  for (const line of [...c.roi, ...c.doNham]) console.log(line);
  if (c.giao === 0) {
    console.log("giao: 0 — luot khong phien khong giao bai nao");
    return 1;
  }
  console.log(
    `giao: ${c.giao} · nhan: ${c.nhan} · roi: ${c.roi.length} · do nham: ${c.doNham.length}`,
  );
  return red || c.roi.length > 0 || c.doNham.length > 0 ? 1 : 0;
}

if (process.argv[1] && /dem-giao-nhan\.ts$/.test(process.argv[1])) {
  const [folder, flag, listFile, ...rest] = process.argv.slice(2);
  if (!folder || (flag !== undefined && (flag !== "--tep-bai" || !listFile)) || rest.length > 0) {
    console.error(
      "cach dung: node tests/e2e-db/dem-giao-nhan.ts <thu muc bao cao> [--tep-bai <danh sach tep>]",
    );
    process.exit(2);
  }
  const list = listFile
    ? readFileSync(listFile, "utf8")
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l !== "")
    : undefined;
  process.exit(main(folder, list));
}
