import { unstable_doesMiddlewareMatch } from "next/experimental/testing/server";
// The installed Next names the matcher helper unstable_doesMiddlewareMatch; the docs already call it ...ProxyMatch.
import { afterEach, describe, expect, it, vi } from "vitest";

import { config, proxy } from "./proxy";

afterEach(() => vi.unstubAllEnvs());

describe("proxy for prototype pages (decision 0043)", () => {
  it("runs on /proto and every path under it", () => {
    for (const url of ["/proto", "/proto/permitted-actions", "/proto/a/b"])
      expect(unstable_doesMiddlewareMatch({ config, url }), url).toBe(true);
  });

  it("runs on no other path", () => {
    for (const url of [
      "/",
      "/inventory",
      "/inventory?role=ListAgent",
      "/api/v1/health",
      "/login",
      "/prototype",
      "/x/proto",
    ])
      expect(unstable_doesMiddlewareMatch({ config, url }), url).toBe(false);
  });

  it("answers a real 404 in a production build", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(proxy()?.status).toBe(404);
  });

  it("lets the page through on a development machine", () => {
    vi.stubEnv("NODE_ENV", "development");
    expect(proxy()).toBeUndefined();
  });
});
