#!/usr/bin/env node
// Break runs of the role × screen suite (roadmap row 9b, AC-8 and AC-11; evals E10, E15). Each break is applied to a
// copy of the working tree in a temporary folder; the suite runs only the role it concerns, at 1440, and must turn red
// with its pinned message. The real tree runs the same roles and must stay green. Lane Postgres: DB_LANE, DB_PORT.
//   DB_LANE=d DB_PORT=5571 node tests/e2e-db/pha-thu-vai-man.mjs
import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const MEMBERS_PAGE = "src/app/(app)/members/page.tsx";
const MEMBERS_SCREEN = "src/app/(app)/members/members-screen.tsx";
const ONTOLOGY = "src/generated/ontology.ts";
const ADMIN_ONLY = (name) =>
  new RegExp(`(name: "${name}",[\\s\\S]*?scope: \\{\\n)(      CompanyAdmin: "company",\\n)`);

/** Each break: the files it changes, the role it runs, and the message the run must print. */
const BREAKS = [
  {
    name: "mo-members",
    role: "TeamLead",
    want: "members × TeamLead @1440: mong Khong du quyen",
    edits: {
      [MEMBERS_PAGE]: (t) =>
        t.replace('allowedScope(session.roles, "listMembers") === null', "false"),
    },
  },
  {
    name: "so-man-mo",
    role: "ListAgent",
    want: "members × ListAgent @1440: mong man thuong",
    edits: { "design/screens.yaml": (t) => t.replace("    vao: listMembers\n", "    vao: null\n") },
  },
  {
    name: "lo-nguoi-chung",
    role: "BuyerAgent",
    want: "members × BuyerAgent @1440: lo nguoi chung",
    edits: {
      [MEMBERS_PAGE]: (t) =>
        t.replace(
          '<PageState kind="forbidden" homeHref="/" />',
          '<><PageState kind="forbidden" homeHref="/" /><p hidden>[Tên] Người chứng</p></>',
        ),
    },
  },
  {
    name: "doi-nut-moi",
    role: "CompanyAdmin",
    want: "members × CompanyAdmin @1440: thieu nut inviteMember",
    also: "members × CompanyAdmin @1440: thay nut readCompany khong co trong o",
    edits: { [MEMBERS_SCREEN]: (t) => t.replace('action="inviteMember"', 'action="readCompany"') },
  },
  {
    name: "nut-lac-man",
    role: "CompanyAdmin",
    want: "members × CompanyAdmin @1440: thay nut saveView khong co trong o",
    edits: {
      [MEMBERS_SCREEN]: (t) =>
        t
          .replace(
            '      action={\n        <PermittedAction action="inviteMember">',
            '      action={\n        <>\n        <PermittedAction action="saveView">\n          <span />\n        </PermittedAction>\n        <PermittedAction action="inviteMember">',
          )
          .replace(
            "          />\n        </PermittedAction>\n      }\n    />",
            "          />\n        </PermittedAction>\n        </>\n      }\n    />",
          ),
    },
  },
  {
    name: "quyen-chua-sinh-bang",
    role: "BuyerAgent",
    want: "members × BuyerAgent @1440: thay nut inviteMember khong co trong o",
    edits: {
      [ONTOLOGY]: (t) =>
        t
          .replace(ADMIN_ONLY("listMembers"), '$1      BuyerAgent: "company",\n$2')
          .replace(ADMIN_ONLY("inviteMember"), '$1      BuyerAgent: "company",\n$2'),
    },
    // With BuyerAgent let in, the register still lists BuyerAgent as blocked from members only if the generated
    // table is not regenerated — the very drift this break shows: the suite reads the committed table.
  },
];

function sh(cmd, args, opts = {}) {
  return spawnSync(cmd, args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024, ...opts });
}

/** A copy of the working tree: HEAD checked out, then every changed or new file of the working tree on top. */
function workingCopy() {
  // Inside the repository, under dist/ (ignored by git; not under node_modules, where Node will not strip types): Node
  // and the dev server find the packages by walking up to the repository's own node_modules, so the copy needs no
  // install and no link (a linked node_modules sends the dev server's build folder outside the copy).
  const base = join(ROOT, "dist", "pha-thu-vai-man");
  mkdirSync(base, { recursive: true });
  const dir = mkdtempSync(join(base, "ban-sao-"));
  rmSync(dir, { recursive: true, force: true });
  const add = sh("git", ["-C", ROOT, "worktree", "add", "--detach", dir, "HEAD"]);
  if (add.status !== 0) throw new Error(`khong tao duoc ban sao: ${add.stderr}`);
  const changed = sh("git", ["-C", ROOT, "ls-files", "-m", "-o", "--exclude-standard"])
    .stdout.split("\n")
    .filter(Boolean);
  for (const rel of changed)
    if (existsSync(join(ROOT, rel))) cpSync(join(ROOT, rel), join(dir, rel), { recursive: true });
  // The copy's dev server compiles with the repository as its root, the folder holding both the copy and the packages:
  // Turbopack resolves nothing outside its root. Only the copy's config changes.
  const config = join(dir, "next.config.ts");
  const text = readFileSync(config, "utf8");
  const rooted = text.replace(
    'allowedDevOrigins: ["127.0.0.1"],',
    `allowedDevOrigins: ["127.0.0.1"],\n  turbopack: { root: ${JSON.stringify(ROOT)} },`,
  );
  if (rooted === text) throw new Error("khong dat duoc goc dung cho ban sao");
  writeFileSync(config, rooted);
  return dir;
}

/**
 * The copy's dev server port, fixed for this run: the database config's own pick hashes the folder and may land on a
 * port browsers refuse (4045 was hit); 4300–4599 holds none.
 */
const ENV = { ...process.env, E2E_DB_PORT: String(4300 + (process.pid % 300)) };

function run(dir, role) {
  const r = sh(
    "npx",
    [
      "playwright",
      "test",
      "-c",
      "playwright.db.config.ts",
      "tests/e2e-db/vai.setup.ts",
      "tests/e2e-db/vai-man.spec.ts",
      "--project=vai",
      "--project=vai-1440",
      "--grep",
      `dang nhap bon vai|vai ${role}$`,
      "--reporter=line",
    ],
    { cwd: dir, env: ENV },
  );
  return { status: r.status, out: `${r.stdout}${r.stderr}` };
}

const lines = [];
let ok = true;
const dir = workingCopy();
try {
  for (const b of BREAKS) {
    const saved = {};
    for (const [rel, edit] of Object.entries(b.edits)) {
      const before = readFileSync(join(dir, rel), "utf8");
      const after = edit(before);
      if (after === before) {
        lines.push(`pha ${b.name}: ban pha khong doi duoc ${rel}`);
        ok = false;
      }
      saved[rel] = before;
      writeFileSync(join(dir, rel), after);
    }
    const r = run(dir, b.role);
    for (const [rel, before] of Object.entries(saved)) writeFileSync(join(dir, rel), before);
    const hit = r.out.includes(b.want) && (!b.also || r.out.includes(b.also));
    if (r.status !== 0 && hit)
      lines.push(`pha ${b.name}: do — ${b.want}${b.also ? ` · ${b.also}` : ""}`);
    else {
      ok = false;
      lines.push(
        `pha ${b.name}: ${r.status === 0 ? "XANH (phai do)" : "do sai thong diep"} — mong ${b.want}`,
      );
      console.error(r.out.split("\n").slice(-40).join("\n"));
    }
  }
  const roles = [...new Set(BREAKS.map((b) => b.role))];
  const base = sh(
    "npx",
    [
      "playwright",
      "test",
      "-c",
      "playwright.db.config.ts",
      "tests/e2e-db/vai.setup.ts",
      "tests/e2e-db/vai-man.spec.ts",
      "--project=vai",
      "--project=vai-1440",
      "--grep",
      `dang nhap bon vai|vai (${roles.join("|")})$`,
      "--reporter=line",
    ],
    { cwd: dir, env: ENV },
  );
  if (base.status === 0) lines.push(`cay goc: xanh (${roles.join(", ")} @1440)`);
  else {
    ok = false;
    lines.push("cay goc: DO");
    console.error(`${base.stdout}${base.stderr}`.split("\n").slice(-40).join("\n"));
  }
} finally {
  sh("git", ["-C", ROOT, "worktree", "remove", "--force", dir]);
}
for (const l of lines) console.log(l);
process.exit(ok ? 0 : 1);
