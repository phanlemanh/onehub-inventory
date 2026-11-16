import { connection } from "next/server";

import { liveHealth } from "@/modules/identity/server";

/**
 * Read-only health of this deploy: `{ ok, commit, env, vai }`. No sign-in, no company table, no address or key; never
 * cached, so a check after a deploy sees the commit that runs now.
 */
export async function GET(): Promise<Response> {
  await connection();
  const health = await liveHealth();
  return Response.json(health, {
    status: health.ok ? 200 : 503,
    headers: { "Cache-Control": "no-store" },
  });
}
