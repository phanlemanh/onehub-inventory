import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { afterEach, describe, expect, it, vi } from "vitest";

import { AuthConfigError, PRODUCTION_VARS, assertProductionConfig, readAuthConfig } from "./config";

const FULL = {
  NODE_ENV: "production",
  DATABASE_URL: "postgres://app@db.example.test/app",
  AUTH_SECRET: "x".repeat(40),
  RESEND_API_KEY: "re_test_key",
  MAIL_FROM: "OneHub <no-reply@example.test>",
};

afterEach(() => vi.restoreAllMocks());

describe("production configuration", () => {
  it("ban-that-thieu-cau-hinh: each missing variable is named and no code reaches the log", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    const err = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(PRODUCTION_VARS).toEqual(["DATABASE_URL", "AUTH_SECRET", "RESEND_API_KEY", "MAIL_FROM"]);
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
    expect(JSON.parse(String(init.body)).to).toEqual(["nhan-vien@example.test"]);
    const logged = [...log.mock.calls, ...err.mock.calls].flat().join(" ");
    expect(logged).not.toMatch(/\d{6}/);
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

  it("the server start checks production configuration", () => {
    const source = readFileSync(
      fileURLToPath(new URL("../../instrumentation.ts", import.meta.url)),
      "utf8",
    );
    expect(source).toContain("assertProductionConfig(process.env)");
    expect(source).toContain('process.env.NEXT_RUNTIME !== "nodejs"');
  });
});
