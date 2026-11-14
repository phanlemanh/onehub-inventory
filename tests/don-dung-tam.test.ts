// Row 1s (_acceptance/ci-co-postgres, AC-8, E8): build folders of browser runs. Six kinds of folder, liveness read
// from `.chu`, never from the name. The break copy reads liveness from the name and must lose a live run's folder.
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { CACHE_ROOT, OWNER_FILE, sweepDead } from "./e2e-db/don-dung-tam";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const MODULE = join(ROOT, "tests/e2e-db/don-dung-tam.ts");

/** A process id that no longer exists: a child that has already exited. */
function deadPid(): number {
  const r = spawnSync(process.execPath, ["-e", "process.stdout.write(String(process.pid))"], {
    encoding: "utf8",
  });
  const pid = Number(r.stdout);
  expect(pid).toBeGreaterThan(0);
  return pid;
}

let root: string;
let base: string;

function folder(name: string, ownerPid: number | null): string {
  const dir = join(base, name);
  mkdirSync(join(dir, "next"), { recursive: true });
  writeFileSync(join(dir, "next", "build.txt"), "x");
  if (ownerPid !== null) writeFileSync(join(dir, OWNER_FILE), `${ownerPid}\n`);
  return dir;
}

/** The six kinds of the matrix written before the code (evals.yaml, E8), on one fixture. */
function sixKinds() {
  const dead = deadPid();
  return {
    deadOwner: folder(String(dead), dead),
    liveOwner: folder(String(process.pid), process.pid),
    reusedNumber: folder(String(deadPid()), process.pid),
    namedRun: folder("e2e-run-abc", process.pid),
    noOwner: folder(String(deadPid()), null),
  };
}

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), "don-dung-tam-"));
  base = join(root, CACHE_ROOT, "onehub-e2e");
  mkdirSync(base, { recursive: true });
});
afterEach(() => rmSync(root, { recursive: true, force: true }));

describe("don thu muc dung tam (AC-8)", () => {
  it("chi thu muc co chu da chet bi xoa; chu song con nguyen", () => {
    const f = sixKinds();
    const gone = sweepDead(base);
    expect(gone).toEqual([f.deadOwner.split("/").pop()]);
    expect(existsSync(f.deadOwner)).toBe(false);
    for (const kept of [f.liveOwner, f.reusedNumber, f.namedRun, f.noOwner])
      expect(existsSync(join(kept, "next", "build.txt")), `chu song con nguyen: ${kept}`).toBe(
        true,
      );
  });

  it("thu muc cua chinh luot bi xoa khi tien trinh chinh thoat, va co .chu khi luot dang chay", () => {
    const script = [
      `const m = await import(${JSON.stringify(pathToFileURL(MODULE).href)});`,
      `m.claimRunFolder("onehub-e2e", "luot-nay", ${JSON.stringify(root)});`,
      `const fs = await import("node:fs");`,
      `const dir = ${JSON.stringify(join(base, "luot-nay"))};`,
      `process.stdout.write(fs.readFileSync(dir + "/.chu", "utf8").trim() === String(process.pid) ? "co-chu" : "khong-chu");`,
    ].join("\n");
    const out = execFileSync(process.execPath, ["--input-type=module", "-e", script], {
      encoding: "utf8",
    });
    expect(out).toBe("co-chu");
    expect(existsSync(join(base, "luot-nay"))).toBe(false);
  });

  it("luot moi don luot chet cua cung thu muc goc, khong cham thu muc goc khac", () => {
    const dead = deadPid();
    const other = join(root, CACHE_ROOT, "onehub-e2e-db", String(dead));
    mkdirSync(other, { recursive: true });
    writeFileSync(join(other, OWNER_FILE), `${dead}\n`);
    const mine = folder(String(dead), dead);
    expect(sweepDead(base)).toEqual([String(dead)]);
    expect(existsSync(mine)).toBe(false);
    expect(existsSync(other)).toBe(true);
  });

  it("hai cau hinh Playwright khai dung ham don", () => {
    const main = readFileSync(join(ROOT, "playwright.config.ts"), "utf8");
    expect(main).toMatch(/globalSetup:\s*"\.\/tests\/e2e-db\/don-dung-tam\.ts"/);
    const db = readFileSync(join(ROOT, "playwright.db.config.ts"), "utf8");
    expect(db).toMatch(/globalSetup:\s*"\.\/tests\/e2e-db\/setup\.ts"/);
    const setup = readFileSync(join(ROOT, "tests/e2e-db/setup.ts"), "utf8");
    expect(setup).toMatch(/claimRunFolder\("onehub-e2e-db", process\.env\["E2E_DB_RUN"\]/);
    const mod = readFileSync(MODULE, "utf8");
    expect(mod).toMatch(/claimRunFolder\("onehub-e2e", process\.env\["E2E_RUN"\]/);
  });

  it("pha: ban sao doc song chet tu ten thu muc thi mat thu muc cua luot dang song", async () => {
    const copy = join(root, "don-dung-tam-pha.ts");
    const text = readFileSync(MODULE, "utf8");
    const real = "const pid = owner(join(baseDir, name));";
    expect(text).toContain(real);
    writeFileSync(copy, text.replace(real, "const pid = Number(name) || null;"));
    const broken = (await import(pathToFileURL(copy).href)) as { sweepDead: typeof sweepDead };
    const f = sixKinds();
    broken.sweepDead(base);
    const lost = [f.liveOwner, f.reusedNumber, f.namedRun, f.noOwner].filter(
      (d) => !existsSync(join(d, "next", "build.txt")),
    );
    expect(lost.map((d) => `chu song con nguyen: ${d.split("/").pop()}`)).toEqual([
      `chu song con nguyen: ${f.reusedNumber.split("/").pop()}`,
      `chu song con nguyen: ${f.noOwner.split("/").pop()}`,
    ]);
  });
});
