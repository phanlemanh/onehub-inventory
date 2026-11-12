import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { afterEach, describe, expect, it, vi } from "vitest";

import { AuthConfigError, PRODUCTION_VARS, assertProductionConfig, readAuthConfig } from "./config";

// The start hook loads the module's server door; outside Next.js its "server-only" guard has nothing to guard.
vi.mock("server-only", () => ({}));

const FULL = {
  NODE_ENV: "production",
  DATABASE_URL: "postgres://app@db.example.test/app",
  AUTH_SECRET: "x".repeat(40),
  RESEND_API_KEY: "re_test_key",
  MAIL_FROM: "OneHub <no-reply@example.test>",
  APP_URL: "https://app.example.test",
};

/** What the production invite sender hands Resend for one invitation, as the whole JSON body. */
async function sentInvitePayload(env: Record<string, string>, origin: string): Promise<string> {
  const fetchMock = vi.fn(async () => new Response("{}", { status: 200 }));
  const config = readAuthConfig(env, fetchMock as unknown as typeof fetch);
  await config.inviteSender({
    email: "moi@example.test",
    companyName: "[Sàn A]",
    inviterName: "[Tên] P",
    roles: ["ListAgent"],
    origin,
  });
  expect(fetchMock).toHaveBeenCalledTimes(1);
  const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
  expect(url).toBe("https://api.resend.com/emails");
  return String(init.body);
}

/** Every link in a text, parsed. */
function links(text: string): URL[] {
  return (text.match(/https?:\/\/[^\s"\\]+/g) ?? []).map((l) => new URL(l));
}

afterEach(() => vi.restoreAllMocks());

describe("production configuration", () => {
  it("ban-that-thieu-cau-hinh: each missing variable is named and no code reaches the log", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    const err = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(PRODUCTION_VARS).toEqual([
      "DATABASE_URL",
      "AUTH_SECRET",
      "RESEND_API_KEY",
      "MAIL_FROM",
      "APP_URL",
    ]);
    for (const name of PRODUCTION_VARS) {
      const env = { ...FULL, [name]: "" };
      expect(() => assertProductionConfig(env), name).toThrow(AuthConfigError);
      expect(() => assertProductionConfig(env), name).toThrow(name);
      expect(() => readAuthConfig(env), name).toThrow(name);
    }
    // Positive control: complete production config sends through Resend, once, to the asking email.
    const fetchMock = vi.fn(async () => new Response("{}", { status: 200 }));
    const config = readAuthConfig(FULL, fetchMock as unknown as typeof fetch);
    await config.sender({ email: "nhan-vien@example.test", code: "123456" });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://api.resend.com/emails");
    const sentBody = JSON.parse(String(init.body)) as {
      to: string[];
      subject: string;
      text: string;
    };
    expect(sentBody.to).toEqual(["nhan-vien@example.test"]);
    // The code travels in the mail itself: subject and text, exactly once in the text.
    expect(sentBody.subject).toContain("123456");
    expect(sentBody.text.match(/\b\d{6}\b/g)).toEqual(["123456"]);
    const logged = [...log.mock.calls, ...err.mock.calls].flat().join(" ");
    expect(logged).not.toMatch(/\d{6}/);
  });

  it("thu-moi-khong-theo-ten-may-chu", async () => {
    const own = await sentInvitePayload(FULL, "https://app.example.test");
    const ownLinks = links(JSON.parse(own).text as string);
    expect(
      ownLinks.some((u) => u.origin === "https://app.example.test" && u.pathname === "/login"),
    ).toBe(true);
    // A request carrying a forged host: the mail still links to the configured address and never names that host.
    const forged = await sentInvitePayload(FULL, "https://ke-gian.test");
    if (forged.includes("ke-gian.test"))
      throw new Error("thu-moi-khong-theo-ten-may-chu: thư theo tên máy chủ của yêu cầu");
    expect(forged).toContain("https://app.example.test/login");
  });

  it("thu-moi-duong-con", async () => {
    const payload = await sentInvitePayload(
      { ...FULL, APP_URL: "https://app.example.test/onehub/" },
      "https://ke-gian.test",
    );
    const found = links(JSON.parse(payload).text as string);
    expect(found.map((u) => u.href)).toContain("https://app.example.test/onehub/login");
  });

  it("dia-chi-goc-sai-khuon", async () => {
    const bad = [
      "app.example.test",
      "http://app.example.test",
      "ftp://app.example.test",
      "https://u:p@app.example.test",
      "https://app.example.test/?a=1",
      "https://app.example.test/#h",
    ];
    for (const value of bad) {
      let caught: unknown = null;
      try {
        assertProductionConfig({ ...FULL, APP_URL: value });
      } catch (e) {
        caught = e;
      }
      if (!(caught instanceof AuthConfigError))
        throw new Error(`dia-chi-goc-sai-khuon: ${value} được nhận`);
      const told = `${caught.message} ${String((caught as Error & { cause?: unknown }).cause ?? "")}`;
      expect(caught.message, value).toContain("APP_URL");
      expect(told, value).not.toContain(value);
      expect(told, value).not.toContain(value.replace(/^[a-z]+:\/\//, ""));
      expect(told, value).not.toContain("u:p");
    }
    // Positive control: a plain https address and one with a sub-path are taken.
    expect(() => assertProductionConfig(FULL)).not.toThrow();
    expect(() =>
      assertProductionConfig({ ...FULL, APP_URL: "https://app.example.test/onehub/" }),
    ).not.toThrow();
  });

  it("may-dev-theo-cau-hinh", async () => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    const dir = mkdtempSync(join(tmpdir(), "thu-moi-"));
    const mail = {
      email: "moi@example.test",
      companyName: "[Sàn A]",
      inviterName: "[Tên] P",
      roles: ["ListAgent" as const],
      origin: "http://127.0.0.1:3485",
    };
    const sentText = async (env: Record<string, string>): Promise<string> => {
      const outbox = join(dir, `${Object.keys(env).length}.jsonl`);
      await readAuthConfig({
        NODE_ENV: "development",
        LOGIN_CODE_OUTBOX: outbox,
        ...env,
      }).inviteSender(mail);
      const line = readFileSync(outbox, "utf8").trim().split("\n").at(-1) as string;
      return (JSON.parse(line) as { text: string }).text;
    };
    // No APP_URL: the request's origin, as row 9.
    const plain = await sentText({});
    expect(links(plain).map((u) => u.href)).toContain("http://127.0.0.1:3485/login");
    // APP_URL set: it wins over the request's origin.
    const configured = await sentText({ APP_URL: "http://127.0.0.1:3470" });
    expect(links(configured).map((u) => u.href)).toContain("http://127.0.0.1:3470/login");
    expect(configured).not.toContain("3485");
  });

  it("thu-ma-khong-co-duong", async () => {
    const fetchMock = vi.fn(async () => new Response("{}", { status: 200 }));
    const config = readAuthConfig(FULL, fetchMock as unknown as typeof fetch);
    await config.sender({ email: "a@example.test", code: "123456" });
    const body = JSON.parse(
      String((fetchMock.mock.calls[0] as unknown as [string, RequestInit])[1].body),
    ) as Record<string, unknown>;
    const { from: _from, ...rest } = body;
    const payload = JSON.stringify(rest);
    expect(payload).toContain("123456");
    if (/https?:\/\//.test(payload)) throw new Error("thu-ma-khong-co-duong: thư mã có đường");
  });

  it("env-mau-co-dia-chi-goc", () => {
    const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
    const example = readFileSync(join(root, ".env.example"), "utf8");
    if (!/^#?\s*APP_URL=https:\/\/example\.test\s*$/m.test(example))
      throw new Error("env-mau-co-dia-chi-goc: thiếu APP_URL");
    expect(example).toMatch(/^#.*APP_URL.*bắt buộc ở bản thật/m);
    for (const found of example.match(/https?:\/\/[^\s>]+/g) ?? []) {
      const host = new URL(found).hostname;
      expect(host.endsWith(".test") || host === "resend.com" || host === "dd.reso.org", found).toBe(
        true,
      );
    }
  });

  it("a failed Resend call throws without the code", async () => {
    const fetchMock = vi.fn(async () => new Response("no", { status: 500 }));
    const config = readAuthConfig(FULL, fetchMock as unknown as typeof fetch);
    await expect(config.sender({ email: "a@example.test", code: "654321" })).rejects.toThrow(
      /Resend 500/,
    );
    await expect(config.sender({ email: "a@example.test", code: "654321" })).rejects.not.toThrow(
      /654321/,
    );
  });

  it("a development machine prints the code and may run without a database", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    const config = readAuthConfig({ NODE_ENV: "development" });
    expect(config.databaseUrl).toBeNull();
    expect(config.production).toBe(false);
    await config.sender({ email: "a@example.test", code: "111222" });
    expect(log.mock.calls.flat().join(" ")).toContain("111222");
  });

  it("the server start refuses production without its configuration", async () => {
    const { register } = await import("../../instrumentation");
    vi.stubEnv("NEXT_RUNTIME", "nodejs");
    vi.stubEnv("NEXT_PHASE", "");
    vi.stubEnv("NODE_ENV", "production");
    for (const [name, value] of Object.entries(FULL)) vi.stubEnv(name, value);
    // Positive control: complete production configuration starts.
    await expect(register()).resolves.toBeUndefined();
    for (const name of PRODUCTION_VARS) {
      vi.stubEnv(name, "");
      await expect(register(), name).rejects.toThrow(name);
      vi.stubEnv(name, FULL[name]);
    }
    // A malformed address stops the start too (row 9d): production takes https only.
    vi.stubEnv("APP_URL", "http://app.example.test");
    await expect(register()).rejects.toThrow("APP_URL");
    vi.stubEnv("APP_URL", FULL.APP_URL);
    // A development server starts without any of it.
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("RESEND_API_KEY", "");
    await expect(register()).resolves.toBeUndefined();
    vi.unstubAllEnvs();
  });
});
