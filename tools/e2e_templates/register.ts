// The screen register and role list as the browser suite sees them (roadmap row 1f).
// Read through tools/e2e_templates/register.py, which uses the row 1d reader: one reader, one set of error words.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
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
 * Screens that need a signed-in session and a database: the frame suite runs without either, so it cannot open them.
 * Each names the signed-in browser test that measures its frame and accessibility instead (owner's choice at the
 * evidence gate of row 9: «màn cần đăng nhập: bỏ qua có điều kiện»). A screen is only skipped while that test exists,
 * opens the screen's route and runs axe; otherwise loading the suite fails.
 */
export const SESSION_SCREENS: Readonly<Record<string, string>> = {
  members: "tests/e2e-db/members.spec.ts",
};

/** Why a session screen may not be skipped, or null when its signed-in test measures it. */
export function sessionSuiteProblem(
  screen: Screen,
  root = process.env["SCREENS_ROOT"] ?? REPO_ROOT,
): string | null {
  const file = SESSION_SCREENS[screen.id];
  if (!file) return null;
  const path = join(root, file);
  if (!existsSync(path)) return `man ${screen.id} can dang nhap nhung bai ${file} khong co`;
  const text = readFileSync(path, "utf8");
  if (!text.includes(`"${screen.route}"`))
    return `man ${screen.id} can dang nhap nhung bai ${file} khong mo ${screen.route}`;
  if (!text.includes("AxeBuilder"))
    return `man ${screen.id} can dang nhap nhung bai ${file} khong chay axe`;
  return null;
}

/** Why a screen gets no frame suite, or null when it gets one. A session screen without its test throws. */
export function skipReason(screen: Screen): string | null {
  if (screen.status === "planned") return "planned";
  if (screen.audience === "dev") return "dev";
  const file = SESSION_SCREENS[screen.id];
  if (file) {
    const problem = sessionSuiteProblem(screen);
    if (problem) throw new Error(problem);
    return `can dang nhap — khung va axe do o ${file}`;
  }
  return null;
}
