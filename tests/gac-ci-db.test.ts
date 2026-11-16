// Row 1u: the database job's browser runs (db/scripts/ci-db.sh, steps co-phien and khong-phien) name their reporters on
// the command line, which replaces the configuration's reporters — so each must name the hydration guard itself, or a
// hydration warning there leaves the run green. Red when a playwright run of the script drops it.
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const ROOT = join(__dirname, "..");
const SCRIPT = readFileSync(join(ROOT, "db/scripts/ci-db.sh"), "utf8");

/** One problem per playwright run of the step that does not mount the guard: `gac-ci-db: buoc <step> thieu phep gac`. */
export function thieuPhepGac(src: string): string[] {
  const guard = /^GAC_HYDRATION=(\S+)$/m.exec(src)?.[1];
  const out: string[] = [];
  if (!guard || !existsSync(join(ROOT, guard)))
    out.push("gac-ci-db: GAC_HYDRATION khong tro tep phep gac");
  const joined = src.replace(/\\\n\s*/g, " ");
  for (const m of joined.matchAll(/^\s*(co-phien|khong-phien)\)\n(.*?)\n\s*;;/gms)) {
    const runs = m[2]!.split("\n").filter((l) => /npx playwright test/.test(l));
    if (runs.length === 0 || runs.some((l) => !/--reporter="?[^"\s]*\$GAC_HYDRATION/.test(l)))
      out.push(`gac-ci-db: buoc ${m[1]} thieu phep gac`);
  }
  if (!/^\s*co-phien\)/m.test(src) || !/^\s*khong-phien\)/m.test(src))
    out.push("gac-ci-db: khong thay buoc co-phien hay khong-phien");
  return out;
}

describe("gac-ci-db · the database job's browser runs mount the hydration guard", () => {
  it("both browser steps of ci-db.sh name the guard among their reporters", () => {
    expect(thieuPhepGac(SCRIPT)).toEqual([]);
  });

  it("break: a copy whose co-phien run names only list and json is caught", () => {
    const copy = SCRIPT.replace(
      /(-c playwright\.db\.config\.ts \\\n\s*)--reporter="list,json,\$GAC_HYDRATION"/,
      "$1--reporter=list,json",
    );
    expect(copy).not.toBe(SCRIPT);
    expect(thieuPhepGac(copy)).toEqual(["gac-ci-db: buoc co-phien thieu phep gac"]);
  });

  it("break: a copy whose khong-phien run names only list and json is caught", () => {
    const copy = SCRIPT.replace(
      /(--grep-invert "\(\^\| \)cham\( \|\$\)" )--reporter="list,json,\$GAC_HYDRATION"/,
      "$1--reporter=list,json",
    );
    expect(copy).not.toBe(SCRIPT);
    expect(thieuPhepGac(copy)).toEqual(["gac-ci-db: buoc khong-phien thieu phep gac"]);
  });

  it("break: a copy whose guard path points nowhere is caught", () => {
    const copy = SCRIPT.replace(/^GAC_HYDRATION=.*$/m, "GAC_HYDRATION=./tests/e2e/khong-co.ts");
    expect(thieuPhepGac(copy)).toEqual(["gac-ci-db: GAC_HYDRATION khong tro tep phep gac"]);
  });
});
