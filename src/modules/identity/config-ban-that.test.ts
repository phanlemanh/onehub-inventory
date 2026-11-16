// Row 22, AC-5 / E5: the start-up matrix of a production build. Each blocking case is its own test; the error names the
// variable and why and carries no value (every value holds the marker «moc-bi-mat-»).
import { afterEach, describe, expect, it, vi } from "vitest";

import { AuthConfigError, STARTUP_VARS, assertStartupConfig, readAuthConfig } from "./config";

// The start hook loads the module's server door; outside Next.js its "server-only" guard has nothing to guard.
vi.mock("server-only", () => ({}));

const MARK = "moc-bi-mat-";
const STAGING_URL = "https://moc-bi-mat-app-url.onehub.center";
const PRODUCTION_URL = "https://inventory.onehub.center";

type Env = Record<string, string>;

const STAGING: Env = {
  NODE_ENV: "production",
  APP_ENV: "staging",
  DATABASE_URL: `postgres://quy_hang_login:${MARK}DATABASE_URL@db.example.test:5432/app`,
  AUTH_SECRET: `${MARK}AUTH_SECRET`.padEnd(40, "x"),
  RESEND_API_KEY: `re_${MARK}RESEND_API_KEY`,
  MAIL_FROM: `OneHub <${MARK}mail-from@onehub.center>`,
  APP_URL: STAGING_URL,
};

const PRODUCTION: Env = { ...STAGING, APP_ENV: "production", APP_URL: PRODUCTION_URL };

const FORBIDDEN = ["LOGIN_CODE_OUTBOX", "NEXT_PUBLIC_E2E_BUTTON_RECORD", "MIGRATE_DATABASE_URL"];

/** Starts the server the way Next.js does, with exactly this environment for the variables that matter. */
async function start(env: Env): Promise<void> {
  const { register } = await import("../../instrumentation");
  vi.stubEnv("NEXT_RUNTIME", "nodejs");
  vi.stubEnv("NEXT_PHASE", "");
  for (const name of [...STARTUP_VARS, ...FORBIDDEN, "NODE_ENV"]) vi.stubEnv(name, undefined);
  for (const [name, value] of Object.entries(env)) vi.stubEnv(name, value);
  await register();
}

/** The start refuses: the error is AuthConfigError, names the variable and says why, and carries no value. */
async function expectBlocked(env: Env, name: string, why: RegExp): Promise<void> {
  let caught: unknown = null;
  try {
    await start(env);
  } catch (e) {
    caught = e;
  }
  if (!(caught instanceof AuthConfigError)) throw new Error(`${name}: máy chủ vẫn khởi động`);
  expect(caught.missing).toContain(name);
  expect(caught.message).toContain(name);
  expect(caught.message).toMatch(why);
  expect(caught.message).not.toContain(MARK);
  for (const value of Object.values(env))
    if (value.length > 12) expect(caught.message).not.toContain(value);
}

interface Case {
  name: string;
  env: Env;
  variable: string;
  why: RegExp;
}

const BLOCKING: Case[] = [
  ...STARTUP_VARS.map((name) => {
    const env = { ...STAGING };
    delete env[name];
    return { name: `thiếu ${name}`, env, variable: name, why: /thiếu/ };
  }),
  {
    name: "APP_ENV lạ",
    env: { ...STAGING, APP_ENV: `${MARK}APP_ENV` },
    variable: "APP_ENV",
    why: /staging hoặc production/,
  },
  ...FORBIDDEN.map((name) => ({
    name: `có ${name}`,
    env: { ...STAGING, [name]: `${MARK}${name}` },
    variable: name,
    why: /máy dev/,
  })),
  {
    name: "DATABASE_URL vai postgres",
    env: {
      ...STAGING,
      DATABASE_URL: `postgres://postgres:${MARK}DATABASE_URL@db.example.test/app`,
    },
    variable: "DATABASE_URL",
    why: /vai quy_hang_login/,
  },
  {
    name: "DATABASE_URL vai quy_hang_app",
    env: {
      ...STAGING,
      DATABASE_URL: `postgres://quy_hang_app:${MARK}DATABASE_URL@db.example.test/app`,
    },
    variable: "DATABASE_URL",
    why: /vai quy_hang_login/,
  },
  {
    name: "bản thật APP_URL http",
    env: { ...PRODUCTION, APP_URL: "http://inventory.onehub.center" },
    variable: "APP_URL",
    why: /https/,
  },
  {
    name: "bản thật APP_URL tên miền khác",
    env: { ...PRODUCTION, APP_URL: `https://${MARK}app-url.onehub.center` },
    variable: "APP_URL",
    why: /bản thật phải là https:\/\/inventory\.onehub\.center/,
  },
  {
    name: "MAIL_FROM tên miền lạ",
    env: { ...STAGING, MAIL_FROM: `OneHub <${MARK}mail-from@example.test>` },
    variable: "MAIL_FROM",
    why: /tên miền onehub\.center/,
  },
  {
    name: "MAIL_FROM tên miền đuôi giống xonehub.center",
    env: { ...STAGING, MAIL_FROM: `OneHub <${MARK}mail-from@xonehub.center>` },
    variable: "MAIL_FROM",
    why: /tên miền onehub\.center/,
  },
];

const STARTING: { name: string; env: Env }[] = [
  { name: "đủ và đúng: bản thử", env: STAGING },
  { name: "đủ và đúng: bản thật", env: PRODUCTION },
  { name: "MAIL_FROM onehub.center", env: { ...STAGING, MAIL_FROM: `${MARK}a@onehub.center` } },
  {
    name: "MAIL_FROM tên miền con",
    env: { ...PRODUCTION, MAIL_FROM: `OneHub <${MARK}a@thu.onehub.center>` },
  },
];

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("cấu hình khởi động bản dựng thật (AC-5)", () => {
  it("ma trận đủ ca: sáu biến bắt buộc", () => {
    expect([...STARTUP_VARS].sort()).toEqual(
      ["APP_ENV", "APP_URL", "AUTH_SECRET", "DATABASE_URL", "MAIL_FROM", "RESEND_API_KEY"].sort(),
    );
    expect(BLOCKING).toHaveLength(6 + 1 + 3 + 2 + 2 + 2);
  });

  for (const c of BLOCKING)
    it(`chặn: ${c.name}`, async () => {
      await expectBlocked(c.env, c.variable, c.why);
    });

  for (const c of STARTING)
    it(`khởi động: ${c.name}`, async () => {
      await expect(start(c.env)).resolves.toBeUndefined();
    });

  it("NODE_ENV=development: không ca nào chặn", async () => {
    for (const c of [...BLOCKING, ...STARTING]) {
      const env = { ...c.env, NODE_ENV: "development" };
      await expect(start(env), c.name).resolves.toBeUndefined();
      expect(() => assertStartupConfig(env), c.name).not.toThrow();
    }
  });
});

/** Every link in a text, parsed. */
function links(text: string): string[] {
  return text.match(/https?:\/\/[^\s"\\]+/g) ?? [];
}

/** The bodies a production build sends Resend for one sign-in code and one invitation, to a fake fetch. */
async function sentBodies(env: Env): Promise<string[]> {
  const fetchMock = vi.fn(async () => new Response("{}", { status: 200 }));
  assertStartupConfig(env);
  const config = readAuthConfig(env, fetchMock as unknown as typeof fetch);
  await config.sender({ email: "nhan-vien@example.test", code: "123456" });
  await config.inviteSender({
    email: "moi@example.test",
    companyName: "[Công ty A]",
    inviterName: "[Tên] P",
    roles: ["ListAgent"],
    origin: "https://ke-gian.test",
  });
  expect(fetchMock).toHaveBeenCalledTimes(2);
  return fetchMock.mock.calls.map((call) => {
    const [url, init] = call as unknown as [string, RequestInit];
    expect(url).toBe("https://api.resend.com/emails");
    // The sender address is not a link of the mail; only subject and text are read.
    const body = JSON.parse(String(init.body)) as { subject: string; text: string };
    return `${body.subject}\n${body.text}`;
  });
}

describe("đường trong thư theo APP_URL (AC-5)", () => {
  for (const [name, env] of [
    ["bản thử", STAGING],
    ["bản thật", PRODUCTION],
  ] as const)
    it(`đường trong thư theo APP_URL: ${name}`, async () => {
      const [codeMail, inviteMail] = await sentBodies(env);
      const found = [...links(codeMail as string), ...links(inviteMail as string)];
      expect(found.length).toBeGreaterThan(0);
      for (const link of found)
        if (!link.startsWith(`${env.APP_URL}/`))
          throw new Error(`đường trong thư theo APP_URL: ${link} không bắt đầu bằng APP_URL`);
    });
});
