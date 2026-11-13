// Row 1s (_acceptance/ci-co-postgres, AC-3, E3): the real db/scripts/ci-db.sh, run in a scratch folder where psql,
// npx, the isolation runner and the count are fakes that fail on demand. The matrix of red steps is written before the
// code (evals.yaml).
import { spawnSync } from "node:child_process";
import { chmodSync, copyFileSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { afterAll, beforeAll, describe, expect, it } from "vitest";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const STEPS = ["chuan-bi", "cach-ly", "bai-db", "co-phien", "khong-phien", "dem"];
const ENV_OF: Record<string, string> = {
  "chuan-bi": "FAIL_CHUAN_BI",
  "cach-ly": "FAIL_CACH_LY",
  "bai-db": "FAIL_BAI_DB",
  "co-phien": "FAIL_CO_PHIEN",
  "khong-phien": "FAIL_KHONG_PHIEN",
  dem: "FAIL_DEM",
};

let dir: string;

function exe(path: string, body: string): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `#!/usr/bin/env bash\n${body}\n`);
  chmodSync(path, 0o755);
}

/** A copy of the repository's shape with the real ci-db.sh and fakes around it. */
function world(realCount = false): string {
  const d = mkdtempSync(join(tmpdir(), "ci-db-"));
  mkdirSync(join(d, "db/scripts"), { recursive: true });
  copyFileSync(join(ROOT, "db/scripts/ci-db.sh"), join(d, "db/scripts/ci-db.sh"));
  exe(join(d, "db/scripts/migrate.sh"), 'echo "xong — 0 migration mới"');
  exe(join(d, "db/scripts/cach-ly.sh"), 'echo "cach-ly gia"; exit "${FAIL_CACH_LY:-0}"');
  exe(
    join(d, "bin/psql"),
    '[ "${FAIL_CHUAN_BI:-0}" != 0 ] && { echo "psql: connection refused" >&2; exit 2; }\necho "vai nối: quy_hang_login"',
  );
  exe(
    join(d, "bin/npx"),
    [
      'case "$*" in',
      '  *vitest*) exit "${FAIL_BAI_DB:-0}" ;;',
      '  *playwright.db.config.ts*) exit "${FAIL_CO_PHIEN:-0}" ;;',
      '  *playwright*) exit "${FAIL_KHONG_PHIEN:-0}" ;;',
      "esac",
      "exit 9",
    ].join("\n"),
  );
  mkdirSync(join(d, "tests/e2e-db"), { recursive: true });
  if (realCount)
    copyFileSync(
      join(ROOT, "tests/e2e-db/dem-giao-nhan.ts"),
      join(d, "tests/e2e-db/dem-giao-nhan.ts"),
    );
  else
    writeFileSync(
      join(d, "tests/e2e-db/dem-giao-nhan.ts"),
      'process.exit(Number(process.env["FAIL_DEM"] ?? 0));\n',
    );
  return d;
}

function run(d: string, env: Record<string, string> = {}, args: string[] = []) {
  const out = join(d, "out");
  const r = spawnSync("bash", [join(d, "db/scripts/ci-db.sh"), ...args], {
    cwd: d,
    encoding: "utf8",
    env: {
      ...process.env,
      PATH: `${join(d, "bin")}:${process.env["PATH"]}`,
      CI_DB_OUT: out,
      CI_DB_DOI: "1",
      CI_DB_CONTAINER: "",
      BUOC: "",
      ...env,
    },
  });
  const text = `${r.stdout}${r.stderr}`;
  return { code: r.status, text, last: text.trim().split("\n").pop() ?? "" };
}

const stepLines = (text: string) =>
  text.split("\n").filter((l) => /^ci-db: \S+ (đạt|HỎNG) \(mã/.test(l));

beforeAll(() => {
  dir = world();
});
afterAll(() => rmSync(dir, { recursive: true, force: true }));

describe("make ci-db: sau buoc, thu tu co dinh (AC-3)", () => {
  it("doi chung: moi lenh xanh → sau dong 'dat' dung thu tu, '6/6 bước đạt', ma 0", () => {
    const r = run(dir);
    expect(stepLines(r.text)).toEqual(
      STEPS.map((s) =>
        expect.stringMatching(new RegExp(`^ci-db: ${s} đạt \\(mã 0, \\d+ giây\\)$`)),
      ),
    );
    expect(r.last).toBe("ci-db: 6/6 bước đạt");
    expect(r.code).toBe(0);
  });

  it("chuan-bi do → dung ngay, '0/6 bước đạt — HỎNG: chuan-bi'", () => {
    const r = run(dir, { FAIL_CHUAN_BI: "1" });
    expect(stepLines(r.text)).toEqual([expect.stringMatching(/^ci-db: chuan-bi HỎNG \(mã \d+, /)]);
    expect(r.last).toBe("ci-db: 0/6 bước đạt — HỎNG: chuan-bi");
    expect(r.code).toBe(1);
  });

  for (const step of STEPS.slice(1)) {
    it(`${step} do mot minh → cac buoc sau van chay, '5/6', dung ten buoc`, () => {
      const r = run(dir, { [ENV_OF[step]!]: "1" });
      expect(stepLines(r.text)).toHaveLength(6);
      expect(stepLines(r.text).filter((l) => l.includes("HỎNG"))).toEqual([
        expect.stringMatching(new RegExp(`^ci-db: ${step} HỎNG`)),
      ]);
      expect(r.last).toBe(`ci-db: 5/6 bước đạt — HỎNG: ${step}`);
      expect(r.code).toBe(1);
    });
  }

  it("cach-ly va dem do → 'HỎNG: cach-ly dem' dung thu tu", () => {
    const r = run(dir, { FAIL_CACH_LY: "1", FAIL_DEM: "1" });
    expect(r.last).toBe("ci-db: 4/6 bước đạt — HỎNG: cach-ly dem");
  });

  it("BUOC ba buoc → dung ba dong, '3/3'", () => {
    const r = run(dir, { BUOC: "dem co-phien khong-phien" });
    expect(stepLines(r.text).map((l) => l.split(" ")[1])).toEqual([
      "co-phien",
      "khong-phien",
      "dem",
    ]);
    expect(r.last).toBe("ci-db: 3/3 bước đạt");
  });

  it("buoc la → ma 2, khong chay gi", () => {
    const r = run(dir, {}, ["khong-co"]);
    expect(r.code).toBe(2);
    expect(stepLines(r.text)).toEqual([]);
  });

  it("dem voi bao cao vang → 'ci-db: dem HỎNG' kem 'thieu bao cao:'", () => {
    const d = world(true);
    try {
      const r = run(d, {}, ["dem"]);
      expect(r.text).toMatch(/^thieu bao cao: .*khong-phien\.json$/m);
      expect(stepLines(r.text)).toEqual([expect.stringMatching(/^ci-db: dem HỎNG/)]);
      expect(r.last).toBe("ci-db: 0/1 bước đạt — HỎNG: dem");
    } finally {
      rmSync(d, { recursive: true, force: true });
    }
  });
});
