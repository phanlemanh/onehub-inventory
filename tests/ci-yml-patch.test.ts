// Row 1s (_acceptance/ci-co-postgres, AC-9, E9): the workflow patch the owner allowed to apply. It applies cleanly to
// the workflow at HEAD, only adds lines, adds exactly one job with the agreed service and steps, leaves every other
// job byte for byte, and db/scripts/ci-thu.sh reads its values from this very file.
import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { afterAll, beforeAll, describe, expect, it } from "vitest";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PATCH = join(ROOT, "_acceptance/ci-co-postgres/ci-yml.patch");
const WORKFLOW = ".github/workflows/ci.yml";
const CI_THU = join(ROOT, "db/scripts/ci-thu.sh");

let dir: string;
let before: string;
let after: string;

/** The workflow as it was before the patch: the patch reversed when it is already in, else the file itself. */
function original(): string {
  const now = readFileSync(join(ROOT, WORKFLOW), "utf8");
  const d = mkdtempSync(join(tmpdir(), "ci-yml-goc-"));
  try {
    mkdirSync(join(d, ".github/workflows"), { recursive: true });
    writeFileSync(join(d, WORKFLOW), now);
    const r = spawnSync("git", ["apply", "-R", "--check", PATCH], { cwd: d });
    if (r.status !== 0) return now;
    execFileSync("git", ["apply", "-R", PATCH], { cwd: d });
    return readFileSync(join(d, WORKFLOW), "utf8");
  } finally {
    rmSync(d, { recursive: true, force: true });
  }
}

beforeAll(() => {
  dir = mkdtempSync(join(tmpdir(), "ci-yml-"));
  mkdirSync(join(dir, ".github/workflows"), { recursive: true });
  before = original();
  writeFileSync(join(dir, WORKFLOW), before);
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

describe("ban va workflow (AC-9)", () => {
  it("ap sach len workflow truoc ban va", () => {
    const r = spawnSync("git", ["apply", "--check", PATCH], { cwd: dir, encoding: "utf8" });
    expect(r.stderr).toBe("");
    expect(r.status).toBe(0);
    execFileSync("git", ["apply", PATCH], { cwd: dir });
    after = readFileSync(join(dir, WORKFLOW), "utf8");
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

  it("dung mot job moi; cac job cu giong het (bo job moi ra thi bang tep cu)", () => {
    const jobsOf = (t: string) =>
      t
        .split("\n")
        .filter((l) => /^ {2}[a-z0-9-]+:$/.test(l))
        .map((l) => l.trim().slice(0, -1));
    expect(jobsOf(after).filter((j) => !jobsOf(before).includes(j))).toEqual(["e2e-db"]);
    const block = job(after, "e2e-db");
    const added = readFileSync(PATCH, "utf8")
      .split("\n")
      .filter((l) => l.startsWith("+") && !l.startsWith("+++"))
      .map((l) => l.slice(1));
    // The added lines form one block in one hunk: taking that block out gives the old file back.
    const rebuilt = after.replace(`${added.join("\n")}\n`, "");
    expect(rebuilt).toBe(before);
    expect(block).not.toBe("");
  });

  it("job moi: tran, dich vu postgres:16, mat khau, cong, cac buoc", () => {
    const block = job(after, "e2e-db");
    expect(block).toMatch(/^ {4}timeout-minutes: 40$/m);
    expect(block).toMatch(/^ {8}image: postgres:16$/m);
    expect(block).toMatch(/^ {10}POSTGRES_PASSWORD: local-only$/m);
    expect(block).toMatch(/^ {10}- 5432:5432$/m);
    const steps = block
      .split("\n")
      .filter((l) => /^ {6}- (uses|run):/.test(l))
      .map((l) => l.trim());
    expect(steps).toEqual([
      "- uses: actions/checkout@v7",
      "- uses: actions/setup-node@v7",
      "- run: npm ci",
      "- run: npx playwright install --with-deps chromium",
      "- run: make ci-db",
    ]);
    expect(block).toMatch(/^ {10}node-version-file: \.nvmrc$/m);
    // The checkout stays shallow, as in the other jobs (no fetch-depth).
    expect(block).not.toMatch(/fetch-depth/);
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
