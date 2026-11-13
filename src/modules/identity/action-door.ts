// The shared action door (row 2c, K-23): an API handler of another module asks here who is calling and whether the
// permission table lets them run one action, before it touches any data. Closed by default: no session, an expired
// one, no company chosen, a company the person is not a member of, an action the table does not know, or any error
// while reading — each gives a fixed code, never a context. The database checks again on its own (app.allowed).
import { readSession } from "./login";
import { actionSpec, type ActionName, type Scope } from "./permissions";
import { requireAction } from "./require-action";
import type { DbPool } from "./with-company";

export type DoorError = "unauthenticated" | "forbidden" | "server-error";

/** What a handler gets when the door opens: the pool, the context for withCompany, and the scope of its cell. */
export interface OpenedDoor {
  pool: DbPool;
  ctx: { userId: string; companyId: string };
  scope: Scope;
}

/**
 * Opens the door for `action` to the person behind `token`. `getPool` is resolved per call: null means the database
 * is not configured here (a development machine without DATABASE_URL).
 */
export async function openDoor(
  getPool: () => DbPool | null,
  token: string | undefined,
  action: ActionName,
): Promise<OpenedDoor | DoorError> {
  try {
    if (!actionSpec(action)) return "forbidden";
    const pool = getPool();
    if (!pool) return "server-error";
    const session = await readSession({ pool }, token);
    if (!session?.company) return "unauthenticated";
    const ctx = { userId: session.userId, companyId: session.company.id };
    const scope = await requireAction({ pool }, ctx, action);
    if (scope === null) return "forbidden";
    return { pool, ctx, scope };
  } catch (err) {
    console.error("[cua-thao-tac] lỗi máy chủ:", err instanceof Error ? err.message : "không rõ");
    return "server-error";
  }
}

/** True when the door did not open. */
export function isDoorError(r: OpenedDoor | DoorError): r is DoorError {
  return typeof r === "string";
}
