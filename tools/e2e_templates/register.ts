// The screen register and role list as the browser suite sees them (roadmap row 1f).
// Read through tools/e2e_templates/register.py, which uses the row 1d reader: one reader, one set of error words.
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

export type Audience = "staff" | "public" | "dev";
export type Status = "built" | "planned";

export interface Screen {
  id: string;
  route: string;
  title: string | null;
  title_text: string | null;
  family: string | null;
  audience: Audience;
  status: Status;
}

export interface Role {
  name: string;
  label: string | null;
}

export interface Register {
  roles: Role[];
  screens: Screen[];
}

export const REPO_ROOT = fileURLToPath(new URL("../..", import.meta.url));
const BRIDGE = fileURLToPath(new URL("./register.py", import.meta.url));

/** Thrown when the register or role list is wrong; the message carries the row 1d reader's lines verbatim. */
export class RegisterError extends Error {
  constructor(readonly problems: string[]) {
    super(`so man sai:\n${problems.join("\n")}`);
    this.name = "RegisterError";
  }
}

/** Read the register under `root` (default: SCREENS_ROOT, else the repo). A wrong register throws. */
export function loadRegister(root = process.env["SCREENS_ROOT"] ?? REPO_ROOT): Register {
  const out = execFileSync("python3", [BRIDGE, "--root", root], {
    encoding: "utf8",
    timeout: 30_000,
  });
  const data = JSON.parse(out) as Register & { errors: string[] };
  if (data.errors.length > 0) throw new RegisterError(data.errors);
  return { roles: data.roles, screens: data.screens };
}

/**
 * The two runs of the register-driven suite (roadmap row 1r). `khong-phien`: no database, nobody signed in (`make e2e`,
 * CI). `co-phien`: this lane's Postgres and one test session holding all four roles (`playwright.db.config.ts`).
 * Which screens need a session is not written anywhere: the runner sees it when a screen sends the browser to the
 * sign-in page. That replaces the owner's row 9 choice «màn cần đăng nhập: bỏ qua có điều kiện».
 */
export type Mode = "khong-phien" | "co-phien";

/**
 * Screens made for people who are not signed in: they send a signed-in person elsewhere, so the signed-in run cannot
 * measure them; the signed-out run does. Each has its reason, and the signed-in run proves each one really sends a
 * signed-in person away, so the list cannot hide a screen.
 */
export const SIGNED_OUT_SCREENS: Readonly<Record<string, string>> = {
  "sign-in": "cho nguoi chua dang nhap",
};

/** What is wrong with the signed-out list against this register: unknown screens and empty reasons. */
export function signedOutProblems(
  register: Register,
  list: Readonly<Record<string, string>> = SIGNED_OUT_SCREENS,
): string[] {
  const ids = new Set(register.screens.map((s) => s.id));
  const problems: string[] = [];
  for (const [id, why] of Object.entries(list)) {
    if (!ids.has(id)) problems.push(`man la trong danh sach nguoi chua dang nhap: ${id}`);
    if (why.trim() === "") problems.push(`ly do rong trong danh sach nguoi chua dang nhap: ${id}`);
  }
  return problems;
}

/** Why a screen gets no frame suite in this run, or null when it gets one. */
export function skipReason(screen: Screen, mode: Mode = "khong-phien"): string | null {
  if (screen.status === "planned") return "planned";
  if (screen.audience === "dev") return "dev";
  if (mode === "co-phien" && SIGNED_OUT_SCREENS[screen.id]) return SIGNED_OUT_SCREENS[screen.id]!;
  return null;
}
