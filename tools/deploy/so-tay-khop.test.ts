// Row dat-khoa-mot-lenh, E8: the deploy.yml the owner pastes from docs/van-hanh/README.md passes `make deploy` exactly
// the variables tools/deploy/len-ban.mjs requires for that environment (plus the optional bypass secret), each from a
// GitHub environment secret or variable; and the runbook no longer tells anyone to set a variable by hand on Vercel,
// to keep a LOGIN_DATABASE_URL, or to type the login role's password in Supabase's SQL editor.
import { readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { REQUIRED } from "./len-ban.mjs";

const ROOT = resolve(__dirname, "../..");
const RUNBOOK = join(ROOT, "docs", "van-hanh");
const OPTIONAL = ["VERCEL_AUTOMATION_BYPASS_SECRET"];
const JOBS = ["staging", "production"] as const;
const GONE = ["LOGIN_DATABASE_URL", "Environment Variables", "alter role quy_hang_login password"];

/** The fenced yaml block of the README that starts with `name: Deploy`. */
function deployBlock(readme: string): string {
  for (const m of readme.matchAll(/```yaml\n([\s\S]*?)```/g))
    if (/^\s*name: Deploy\s*$/m.test(m[1]!)) return m[1]!;
  return "";
}

/** The env names of the `make deploy ENV=<job>` step, each mapped to where its value comes from. */
function deployEnv(block: string, job: string): Map<string, string> {
  const lines = block.split("\n");
  const at = lines.findIndex((l) => l.trim() === `- run: make deploy ENV=${job}`);
  const out = new Map<string, string>();
  if (at < 0) return out;
  for (const line of lines.slice(at + 1)) {
    if (/^\s*- /.test(line) || /^\s{0,6}\S/.test(line)) break;
    const m = /^\s+([A-Z_]+):\s*\$\{\{\s*(secrets|vars)\.([A-Z_]+)\s*\}\}\s*$/.exec(line);
    if (m) out.set(m[1]!, `${m[2]}.${m[3]}`);
  }
  return out;
}

/** Findings of the block against the names make deploy requires: missing, extra, or not read under its own name. */
export function blockFindings(block: string): string[] {
  const out: string[] = [];
  for (const job of JOBS) {
    const env = deployEnv(block, job);
    const want = new Set<string>([...(REQUIRED as Record<string, string[]>)[job]!, ...OPTIONAL]);
    for (const name of want) if (!env.has(name)) out.push(`khối deploy.yml thiếu ${name} ở ${job}`);
    for (const [name, from] of env) {
      if (!want.has(name)) out.push(`khối deploy.yml thừa ${name} ở ${job}`);
      else if (!from.endsWith(`.${name}`))
        out.push(`khối deploy.yml đọc ${name} từ ${from} ở ${job}`);
    }
  }
  return out;
}

/** "<file>: <phrase>" for each runbook file that still holds a phrase of the old manual steps. */
function oldStepsLeft(): string[] {
  const found: string[] = [];
  for (const f of readdirSync(RUNBOOK)
    .filter((x) => x.endsWith(".md"))
    .sort()) {
    const text = readFileSync(join(RUNBOOK, f), "utf8");
    for (const phrase of GONE) if (text.includes(phrase)) found.push(`${f}: ${phrase}`);
  }
  return found;
}

const README = readFileSync(join(RUNBOOK, "README.md"), "utf8");

describe("E8 · khối deploy.yml của sổ tay khớp biến lệnh đưa bản lên đòi", () => {
  it("E8 · mỗi việc truyền đúng biến lệnh đòi cộng chuỗi bỏ bảo vệ, mỗi biến đọc đúng tên của nó", () => {
    const block = deployBlock(README);
    expect(block).not.toBe("");
    for (const job of JOBS) expect(deployEnv(block, job).size).toBeGreaterThan(5);
    expect(blockFindings(block)).toEqual([]);
  });

  it("E8 · sổ tay không còn việc tay cũ: biến đặt tay trên Vercel, LOGIN_DATABASE_URL, mật khẩu gõ ở SQL Editor", () => {
    expect(oldStepsLeft()).toEqual([]);
  });

  it("E8 · chiều đỏ: bỏ một tên, hay thêm LOGIN_DATABASE_URL, thì hàm so gọi tên đúng chỗ", () => {
    const block = deployBlock(README);
    const without = block.replace(/^\s+AUTH_SECRET: .*\n/m, "");
    expect(blockFindings(without)).toEqual(["khối deploy.yml thiếu AUTH_SECRET ở staging"]);
    const extra = block.replace(
      /(- run: make deploy ENV=production\n( +)env:\n)/,
      (all, _head: string, indent: string) =>
        `${all}${indent}  LOGIN_DATABASE_URL: \${{ secrets.LOGIN_DATABASE_URL }}\n`,
    );
    expect(extra).not.toBe(block);
    expect(blockFindings(extra)).toEqual(["khối deploy.yml thừa LOGIN_DATABASE_URL ở production"]);
  });
});
