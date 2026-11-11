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

/** Why a screen gets no frame suite, or null when it gets one. */
export function skipReason(screen: Screen): string | null {
  if (screen.status === "planned") return "planned";
  if (screen.audience === "dev") return "dev";
  return null;
}
