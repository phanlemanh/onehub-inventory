import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

// The repository's permission rules: a plain merge runs without a prompt, the
// off-policy merge styles and the two release-side commands still ask, and the
// allow and deny lists stay as they were before the merge prompt was removed.

interface Permissions {
  allow: string[];
  deny: string[];
  ask: string[];
}

const settingsPath = fileURLToPath(new URL("../.claude/settings.json", import.meta.url));

function realPermissions(): Permissions {
  return (JSON.parse(readFileSync(settingsPath, "utf8")) as { permissions: Permissions })
    .permissions;
}

/** Applies one permission rule to a command, following the tool's own pattern syntax. */
function ruleMatches(rule: string, command: string): boolean {
  const source = /^Bash\((.*)\)$/s.exec(rule)?.[1];
  if (source === undefined) return false;
  const pattern = source.endsWith(":*") ? `${source.slice(0, -2)} *` : source;
  const wildcards = pattern.split("*").length - 1;
  const escape = (text: string) => text.replace(/[.+?^${}()|[\]\\]/g, "\\$&");
  // A trailing " *" also matches the bare command, but only when it is the only wildcard.
  const body =
    wildcards === 1 && pattern.endsWith(" *")
      ? `${escape(pattern.slice(0, -2))}( .*)?`
      : pattern.split("*").map(escape).join(".*");
  return new RegExp(`^${body}$`, "s").test(command);
}

const PLAIN_MERGES = [
  "gh pr merge 6 --merge",
  "gh pr merge --merge 6",
  "gh pr merge 6 --repo phanlemanh/onehub-inventory --merge --match-head-commit abc",
  "gh pr merge 6 --merge --delete-branch",
  "gh pr merge 6 -m",
  "gh pr merge 6",
];

const OFF_POLICY_FLAGS = ["--auto", "--admin", "--squash", "--rebase"];

const offPolicyForms = (flag: string) => [
  `gh pr merge ${flag} 6`,
  `gh pr merge 6 ${flag} --repo x/y`,
  `gh pr merge 6 --repo x/y ${flag}`,
  `gh pr merge 6 --merge ${flag}`,
];

const OFF_POLICY_MERGES = OFF_POLICY_FLAGS.flatMap((flag) =>
  offPolicyForms(flag).map((command) => ({ flag, command })),
);

const KEPT_ASKS = [
  { name: "gh pr review", command: "gh pr review 6 --approve" },
  { name: "gh release create", command: "gh release create v1.0.0" },
];

// Copied from commit 84a2d597, the last version before the merge prompt was removed.
const BASE_DENY = [
  "Read(./.env)",
  "Read(./.env.local)",
  "Read(./.env.*.local)",
  "Read(./.env.production)",
  "Read(./.env.staging)",
  "Read(./secrets/**)",
  "Read(./**/*.pem)",
  "Edit(./.github/workflows/**)",
  "Edit(./governance/**)",
  "Bash(git push --force:*)",
  "Bash(git push -f:*)",
  "Bash(git reset --hard:*)",
  "Bash(rm -rf:*)",
  "Bash(git push origin main:*)",
  "Bash(git push origin master:*)",
  "Bash(git push origin HEAD:main:*)",
];

const BASE_ALLOW = [
  "Bash(make check)",
  "Bash(make test)",
  "Bash(make lint)",
  "Bash(make typecheck)",
  "Bash(make format)",
  "Bash(make gen)",
  "Bash(make ontology)",
  "Bash(make e2e)",
  "Bash(make build)",
  "Bash(git status:*)",
  "Bash(git diff:*)",
  "Bash(git log:*)",
  "Bash(git show:*)",
  "Bash(npm run build)",
  "Bash(node tools/kit-root.mjs)",
];

const anyMatch = (rules: string[], command: string) =>
  rules.some((rule) => ruleMatches(rule, command));

/** Names everything in these permissions that breaks the agreed rules. */
function violations(permissions: Permissions): string[] {
  const found: string[] = [];
  if (
    PLAIN_MERGES.some((command) => anyMatch([...permissions.ask, ...permissions.deny], command))
  ) {
    found.push("plain merge still asks");
  }
  for (const flag of OFF_POLICY_FLAGS) {
    if (!offPolicyForms(flag).every((command) => anyMatch(permissions.ask, command))) {
      found.push(`off-policy merge not asked: ${flag}`);
    }
  }
  for (const { name, command } of KEPT_ASKS) {
    if (!anyMatch(permissions.ask, command)) found.push(`kept ask rule missing: ${name}`);
  }
  if (JSON.stringify(permissions.deny) !== JSON.stringify(BASE_DENY))
    found.push("deny list changed");
  if (JSON.stringify(permissions.allow) !== JSON.stringify(BASE_ALLOW))
    found.push("allow list changed");
  return found;
}

describe("ruleMatches follows the permission pattern syntax", () => {
  it.each([
    ["Bash(gh pr merge:*)", "gh pr merge 6 --merge", true],
    ["Bash(gh pr merge:*)", "gh pr mergefoo", false],
    ["Bash(gh pr merge *--auto*)", "gh pr merge --auto", true],
    ["Bash(gh pr merge *--auto*)", "gh pr merge 6 --auto -m", true],
    ["Bash(gh pr merge *--auto*)", "gh pr merge 6 --merge", false],
    ["Bash(gh pr merge *--admin *)", "gh pr merge 6 --admin", false],
    ["Read(./.env)", "cat .env", false],
    ["Bash(git status:*)", "git status", true],
  ])("%s against %s is %s", (rule, command, expected) => {
    expect(ruleMatches(rule, command)).toBe(expected);
  });
});

describe("the repository's permission rules", () => {
  it.each(PLAIN_MERGES)("plain merge is not asked or denied: %s", (command) => {
    const { ask, deny } = realPermissions();
    expect(anyMatch(ask, command)).toBe(false);
    expect(anyMatch(deny, command)).toBe(false);
  });

  it.each(OFF_POLICY_MERGES)("off-policy merge asks: $command", ({ command }) => {
    expect(anyMatch(realPermissions().ask, command)).toBe(true);
  });

  it.each(KEPT_ASKS)("kept rule still asks: $name", ({ command }) => {
    expect(anyMatch(realPermissions().ask, command)).toBe(true);
  });

  it("keeps the deny list line for line", () => {
    expect(realPermissions().deny).toEqual(BASE_DENY);
  });

  it("keeps the allow list line for line", () => {
    expect(realPermissions().allow).toEqual(BASE_ALLOW);
  });

  it("has no violations and covers the full matrix", () => {
    expect(PLAIN_MERGES).toHaveLength(6);
    expect(OFF_POLICY_MERGES).toHaveLength(16);
    expect(violations(realPermissions())).toEqual([]);
  });
});

describe("a damaged copy is reported by name", () => {
  const damaged = (change: (permissions: Permissions) => void) => {
    const copy = realPermissions();
    change(copy);
    return violations(copy);
  };
  const drop = (rules: string[], text: string) => {
    const index = rules.findIndex((rule) => rule.includes(text));
    expect(index).toBeGreaterThanOrEqual(0);
    rules.splice(index, 1);
  };

  it("re-adding the old rule that asked for every merge", () => {
    expect(damaged((p) => p.ask.unshift("Bash(gh pr merge:*)"))).toEqual([
      "plain merge still asks",
    ]);
  });

  it.each(OFF_POLICY_FLAGS)("removing the rule for %s", (flag) => {
    expect(damaged((p) => drop(p.ask, flag))).toEqual([`off-policy merge not asked: ${flag}`]);
  });

  it.each(KEPT_ASKS)("removing the kept rule for $name", ({ name }) => {
    expect(damaged((p) => drop(p.ask, name))).toEqual([`kept ask rule missing: ${name}`]);
  });

  it("removing a deny line", () => {
    expect(damaged((p) => void p.deny.pop())).toEqual(["deny list changed"]);
  });

  it("editing a deny line in place", () => {
    expect(
      damaged((p) => {
        p.deny[0] = "Read(./.env.example)";
      }),
    ).toEqual(["deny list changed"]);
  });

  it("adding an allow line", () => {
    expect(damaged((p) => void p.allow.push("Bash(curl:*)"))).toEqual(["allow list changed"]);
  });

  it("removing an allow line", () => {
    expect(damaged((p) => void p.allow.pop())).toEqual(["allow list changed"]);
  });

  it("editing an allow line in place", () => {
    expect(
      damaged((p) => {
        p.allow[0] = "Bash(make test:*)";
      }),
    ).toEqual(["allow list changed"]);
  });
});
