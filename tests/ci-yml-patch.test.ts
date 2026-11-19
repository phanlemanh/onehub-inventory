// Row 1s (_acceptance/ci-co-postgres, AC-9, E9): the workflow patch the owner allowed to apply. It only adds lines, its
// job runs in the workflow with the agreed service, ceiling and steps, and db/scripts/ci-thu.sh reads its values from this
// very file. Since repo-setup 0.9.0 (tiered CI) the workflow is laid out again, so the patch no longer applies to it as a
// diff: what the patch agreed is checked on the job itself, and the job sits in the heavy tier, behind `quick`. `check`
// does not wait for it (owner, 2026-11-18): a run that reaches its ceiling does not hold a merge.
import { execFileSync, spawnSync } from "node:child_process";
import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { tempDir } from "./support/temp-dir";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PATCH = join(ROOT, "_acceptance/ci-co-postgres/ci-yml.patch");
const WORKFLOW = ".github/workflows/ci.yml";
const CI_THU = join(ROOT, "db/scripts/ci-thu.sh");

let dir: string;
let workflow: string;

beforeAll(() => {
  dir = tempDir("ci-yml-");
  workflow = readFileSync(join(ROOT, WORKFLOW), "utf8");
});
afterAll(() => rmSync(dir, { recursive: true, force: true }));

/** Lines a patch removes or changes. */
function removed(patch: string): string[] {
  return patch.split("\n").filter((l) => l.startsWith("-") && !l.startsWith("--- "));
}

/** The block of one job: from `  <name>:` to the next line at job indentation. */
function job(text: string, name: string): string {
  const lines = text.split("\n");
  const start = lines.indexOf(`  ${name}:`);
  if (start < 0) return "";
  let end = start + 1;
  while (end < lines.length && !/^ {2}\S/.test(lines[end]!) && !/^\S/.test(lines[end]!)) end++;
  return lines.slice(start, end).join("\n");
}

/** The `uses:` and `run:` of each step of a job, in order, whether or not the step also has `name:` or `if:`. */
function steps(block: string): string[] {
  return block
    .split("\n")
    .map((l) => /^ {6}- (uses|run): (.+)$/.exec(l) ?? /^ {8}(uses|run): (.+)$/.exec(l))
    .filter((m): m is RegExpExecArray => m !== null)
    .map((m) => `- ${m[1]}: ${m[2]}`);
}

/** The value of the first added line of the patch that matches, as ci-thu.sh reads it. */
function agreed(pattern: RegExp): string {
  const line = readFileSync(PATCH, "utf8")
    .split("\n")
    .find((l) => l.startsWith("+") && pattern.test(l.slice(1)));
  return line ? (pattern.exec(line.slice(1))?.[1] ?? "") : "";
}

/** Whether `want` appears in `have` in the same order, other items allowed in between. */
function inOrder(have: string[], want: string[]): boolean {
  let i = 0;
  for (const item of have) if (item === want[i]) i++;
  return i === want.length;
}

const AGREED_STEPS = [
  "- uses: actions/checkout@v7",
  "- uses: actions/setup-node@v7",
  "- run: npm ci",
  "- run: npx playwright install --with-deps chromium",
  "- run: make ci-db",
];

describe("ban va workflow (AC-9)", () => {
  it("job e2e-db cua workflow mang dung anh, mat khau, cong, tran va lenh cua ban va", () => {
    const block = job(workflow, "e2e-db");
    expect(block).not.toBe("");
    const image = agreed(/^ +image: *(\S+) *$/);
    const password = agreed(/^ +POSTGRES_PASSWORD: *(\S+) *$/);
    const ceiling = agreed(/^ +timeout-minutes: *(\d+) *$/);
    expect([image, password, ceiling]).toEqual(["postgres:16", "local-only", "40"]);
    expect(block).toMatch(new RegExp(`^ {8}image: ${image.replace(".", "\\.")}$`, "m"));
    expect(block).toMatch(new RegExp(`^ {10}POSTGRES_PASSWORD: ${password}$`, "m"));
    expect(block).toMatch(/^ {10}- 5432:5432$/m);
    expect(block).toMatch(new RegExp(`^ {4}timeout-minutes: ${ceiling}$`, "m"));
  });

  it("pha: ban sao ban va sua mot dong cu thi phep loc bat dung dong", () => {
    const edited = readFileSync(PATCH, "utf8").replace(
      "\n       - run: make e2e\n",
      "\n-      - run: make e2e\n+      - run: make e2e-nhanh\n",
    );
    expect(edited).not.toBe(readFileSync(PATCH, "utf8"));
    expect(removed(edited)).toEqual(["-      - run: make e2e"]);
  });

  it("ban va chi them dong", () => {
    const body = readFileSync(PATCH, "utf8")
      .split("\n")
      .filter((l) => !l.startsWith("--- ") && !l.startsWith("+++ "));
    expect(removed(readFileSync(PATCH, "utf8"))).toEqual([]);
    expect(body.filter((l) => l.startsWith("+")).length).toBeGreaterThan(10);
  });

  it("job e2e-db o tang nang: sau quick, bo qua o ban nhap; o tong check khong cho no (chu kho quyet)", () => {
    const block = job(workflow, "e2e-db");
    expect(block).toMatch(/^ {4}needs: quick$/m);
    expect(block).toMatch(
      /^ {4}if: github\.event_name != 'pull_request' \|\| !github\.event\.pull_request\.draft$/m,
    );
    expect(job(workflow, "check")).toMatch(/^ {4}needs: \[quick, e2e\]$/m);
  });

  it("job e2e-db: cac buoc da chot theo dung thu tu, checkout van nong", () => {
    const block = job(workflow, "e2e-db");
    expect(inOrder(steps(block), AGREED_STEPS)).toBe(true);
    expect(block).toMatch(/^ {10}node-version-file: \.nvmrc$/m);
    // The checkout stays shallow, as in the other jobs (no fetch-depth).
    expect(block).not.toMatch(/fetch-depth/);
  });

  it("pha: bo buoc make ci-db khoi job thi phep so thu tu bat duoc", () => {
    const block = job(workflow, "e2e-db").replace("run: make ci-db", "run: make e2e");
    expect(inOrder(steps(block), AGREED_STEPS)).toBe(false);
  });
});

describe("ci-thu doc chinh ban va (AC-9, AC-5)", () => {
  const chiDoc = (patch: string) =>
    execFileSync("bash", [CI_THU, "--chi-doc", patch], { encoding: "utf8" });

  it("in anh, mat khau, cong, lenh, tran doc tu tep", () => {
    expect(chiDoc(PATCH)).toBe(
      [
        "postgres: postgres:16 (tu ban va)",
        "mat khau: local-only",
        "cong trong container: 5432",
        "lenh: make ci-db",
        "tran 40 phut",
        "",
      ].join("\n"),
    );
  });

  it("ban sao ban va doi anh thanh postgres:17 thi in postgres:17", () => {
    const copy = join(dir, "ban-va-17.patch");
    writeFileSync(
      copy,
      readFileSync(PATCH, "utf8").replace("image: postgres:16", "image: postgres:17"),
    );
    expect(chiDoc(copy)).toMatch(/^postgres: postgres:17 \(tu ban va\)$/m);
  });

  it("bien tran: 2,5 phut voi tran 3 do; 1,9 phut KHONG do (doi chung)", () => {
    const copy = join(dir, "ban-va-tran-3.patch");
    writeFileSync(
      copy,
      readFileSync(PATCH, "utf8").replace("timeout-minutes: 40", "timeout-minutes: 3"),
    );
    const red = spawnSync("bash", [CI_THU, "--kiem-tran", "2.5", copy], { encoding: "utf8" });
    expect(red.status).toBe(1);
    expect(red.stdout.trim()).toBe("vuot 2/3 tran: 2.5 / 3");
    const green = spawnSync("bash", [CI_THU, "--kiem-tran", "1.9", copy], { encoding: "utf8" });
    expect(green.status).toBe(0);
    expect(green.stdout.trim()).toBe("duoi 2/3 tran: 1.9 / 3");
  });

  it("ban va thieu mot gia tri thi ci-thu tu choi, ma 2", () => {
    const copy = join(dir, "ban-va-thieu.patch");
    writeFileSync(copy, readFileSync(PATCH, "utf8").replace(/^\+ +image: .*\n/m, ""));
    const r = spawnSync("bash", [CI_THU, "--chi-doc", copy], { encoding: "utf8" });
    expect(r.status).toBe(2);
    expect(r.stderr).toMatch(/bản vá thiếu: image/);
  });
});
