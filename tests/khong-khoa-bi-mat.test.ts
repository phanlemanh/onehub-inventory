// Row 22, AC-10 (E11): no secret in a tracked file, and .env.example lists the variables of the deploy targets.
// The scan reads every file `git ls-files` names. Fake keys in this file are built from pieces, so the file itself
// never matches a pattern.
import { execFileSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative } from "node:path";

import { describe, expect, it } from "vitest";

import { tempDir } from "./support/temp-dir";

const ROOT = join(__dirname, "..");

/** Larger files are generated or media, not configuration; none holds a key a person typed. */
const MAX_BYTES = 2_000_000;

/** Lockfiles hold only package names, versions and integrity hashes, and are rewritten by npm, not by a person. */
const SKIPPED = new Set(["package-lock.json"]);

/** The only Postgres password a tracked file may hold: the one every disposable lane container uses. */
const LOCAL_PASSWORD = "local-only";

/**
 * Password shapes that are not a password: a `<placeholder>` in documentation, and a `${VAR}` / `$VAR` read from the
 * environment at run time.
 */
const NOT_A_PASSWORD = [/^<[^<>]+>$/, /^\$\{[^}]+\}$/, /^\$[A-Z_][A-Z0-9_]*$/];

interface Pattern {
  name: string;
  regex: RegExp;
}

const PATTERNS: Pattern[] = [
  // Vercel tokens have no prefix: catch a literal value given to VERCEL_TOKEN or to the CLI's --token.
  { name: "Vercel token", regex: /\bVERCEL_TOKEN["']?\s*[=:]\s*["']?[A-Za-z0-9]{20,}/ },
  { name: "Vercel token", regex: /--token[=\s]+["']?[A-Za-z0-9]{24,}/ },
  // Supabase anon and service_role keys, and any other signed JWT: three base64url parts, header and payload JSON.
  {
    name: "JWT (Supabase key)",
    regex: /\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/,
  },
  { name: "Supabase personal token", regex: /\bsbp_[A-Za-z0-9]{20,}/ },
  { name: "Supabase secret key", regex: /\bsb_secret_[A-Za-z0-9_-]{16,}/ },
  { name: "Supabase publishable key", regex: /\bsb_publishable_[A-Za-z0-9_-]{16,}/ },
  // Resend: re_ then a long mixed-case run with a digit, so identifiers like re_render_once do not match.
  { name: "Resend key", regex: /\bre_(?=[A-Za-z0-9_]*\d)(?=[A-Za-z0-9_]*[A-Z])[A-Za-z0-9_]{24,}/ },
  // A JWT or session signing secret given a literal value of real length (24+). Short test values such as
  // "e2e-only-secret" and "x".repeat(40) do not match.
  {
    name: "JWT signing secret",
    regex: /\b(?:AUTH|JWT|SUPABASE_JWT|NEXTAUTH)_SECRET["']?\s*[=:]\s*["']?[A-Za-z0-9+/=_.-]{24,}/,
  },
];

const POSTGRES_URL = /postgres(?:ql)?:\/\/[^:/\s@"'`]+:([^@\s"'`]+)@/g;

interface Finding {
  file: string;
  line: number;
  pattern: string;
}

function isBinary(buffer: Buffer): boolean {
  return buffer.subarray(0, 8000).includes(0);
}

/** Every secret found in `files` (paths relative to `root`), with file and 1-based line number. */
function scan(root: string, files: string[]): Finding[] {
  const findings: Finding[] = [];
  for (const file of files) {
    if (SKIPPED.has(file.split("/").pop() ?? "")) continue;
    const path = join(root, file);
    if (!existsSync(path) || !statSync(path).isFile() || statSync(path).size > MAX_BYTES) continue;
    const buffer = readFileSync(path);
    if (isBinary(buffer)) continue;
    buffer
      .toString("utf8")
      .split("\n")
      .forEach((text, index) => {
        const line = index + 1;
        for (const { name, regex } of PATTERNS)
          if (regex.test(text)) findings.push({ file, line, pattern: name });
        for (const match of text.matchAll(POSTGRES_URL)) {
          const password = match[1] ?? "";
          if (password === LOCAL_PASSWORD || NOT_A_PASSWORD.some((p) => p.test(password))) continue;
          findings.push({
            file,
            line,
            pattern: "Postgres URL with a password other than local-only",
          });
        }
      });
  }
  return findings;
}

function trackedFiles(): string[] {
  return execFileSync("git", ["ls-files", "-z"], { cwd: ROOT, encoding: "utf8" })
    .split("\0")
    .filter(Boolean);
}

function filesUnder(dir: string): string[] {
  return readdirSync(dir, { recursive: true, encoding: "utf8" }).filter((f) =>
    statSync(join(dir, f)).isFile(),
  );
}

function report(findings: Finding[]): string {
  return findings.map((f) => `${f.file}:${f.line} — ${f.pattern}`).join("\n");
}

describe("no secret in a tracked file (AC-10)", () => {
  it("no tracked file matches a secret pattern", () => {
    const files = trackedFiles();
    expect(files.length).toBeGreaterThan(100);
    const findings = scan(ROOT, files);
    expect(findings, `secrets in tracked files:\n${report(findings)}`).toEqual([]);
  });

  it("a fake key added to a copy of a tracked file is reported with its file and line", () => {
    const dir = tempDir("khoa-bi-mat-");
    const source = ".env.example";
    const copy = join(dir, "nested", source);
    mkdirSync(dirname(copy), { recursive: true });
    copyFileSync(join(ROOT, source), copy);
    const lines = readFileSync(copy, "utf8").split("\n");
    const fakes: [string, string][] = [
      ["Resend key", "RESEND_API_KEY=" + "re" + "_Ab3dEf9h_" + "Q".repeat(24)],
      ["Supabase personal token", "sb" + "p_" + "0123456789abcdef0123456789abcdef01234567"],
      ["Supabase secret key", "sb" + "_secret_" + "Zx9".repeat(8)],
      [
        "JWT (Supabase key)",
        "ey" + "J" + "hbGciOiJIUzI1NiJ9." + "ey" + "J" + "yb2xlIjoic2VydmljZSJ9." + "s".repeat(20),
      ],
      ["Vercel token", "VERCEL_" + "TOKEN=" + "A1b2C3d4".repeat(3)],
      ["JWT signing secret", "AUTH_" + "SECRET=" + "k9".repeat(16)],
      [
        "Postgres URL with a password other than local-only",
        "postgres" + "://postgres:hunter2" + "@db.example.test/x",
      ],
    ];
    for (const [pattern, fake] of fakes) {
      const written = [...lines, fake].join("\n");
      writeFileSync(copy, written);
      const findings = scan(dir, filesUnder(dir));
      expect(findings, report(findings)).toEqual([
        { file: relative(dir, copy), line: lines.length + 1, pattern },
      ]);
    }
  });

  it("the allowed Postgres passwords are not reported", () => {
    const dir = tempDir("khoa-bi-mat-cho-phep-");
    writeFileSync(
      join(dir, "urls.txt"),
      [
        "postgres" + "://postgres:local-only@127.0.0.1:5432/postgres",
        "postgres" + "://user:<password>@db.example.test/x",
        "postgresql" + "://user:${PGPASSWORD}@db.example.test/x",
        "postgres" + "://app@db.example.test/x",
      ].join("\n"),
    );
    expect(scan(dir, ["urls.txt"])).toEqual([]);
  });
});

describe(".env.example lists the variables of row 22", () => {
  const VARIABLES = [
    "APP_ENV",
    "MIGRATE_DATABASE_URL",
    "LOGIN_DATABASE_URL",
    "VERCEL_TOKEN",
    "VERCEL_ORG_ID",
    "VERCEL_PROJECT_ID",
  ];
  const text = readFileSync(join(ROOT, ".env.example"), "utf8");

  it.each(VARIABLES)("%s is listed with an empty or example.test value", (name) => {
    const values = [...text.matchAll(new RegExp(`^(?:#\\s*)?${name}=(.*)$`, "gm"))].map((m) =>
      (m[1] ?? "").trim(),
    );
    expect(values.length, `${name} missing from .env.example`).toBeGreaterThan(0);
    for (const value of values) {
      // APP_ENV's development value names the environment, it is not a secret; the file has always set it.
      const safe =
        value === "" ||
        value.includes("example.test") ||
        (name === "APP_ENV" && value === "development");
      expect(safe, `${name}=${value} in .env.example`).toBe(true);
    }
  });
});
