import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { ESLint } from "eslint";
import { describe, expect, it } from "vitest";

function run(decisions: string, setup: (root: string) => void = () => {}) {
  const root = mkdtempSync(join(tmpdir(), "design-check-"));
  mkdirSync(join(root, "design"));
  mkdirSync(join(root, "tests"));
  mkdirSync(join(root, "tools"));
  mkdirSync(join(root, "_acceptance"));
  writeFileSync(join(root, "tests/a.test.ts"), "// decision:a\n");
  writeFileSync(join(root, "README.md"), "");
  writeFileSync(join(root, "tools/t.py"), "");
  writeFileSync(join(root, "Makefile"), "x:\n\tpython3 tools/t.py\n");
  writeFileSync(join(root, "design/decisions.yaml"), `decisions:\n${decisions}`);
  setup(root);
  return spawnSync("python3", ["tools/design_check.py", "--root", root], { encoding: "utf8" });
}

const row = (check: string, id = "a") =>
  `  - { id: ${id}, layer: x, kind: closed, source: s, check: '${check}' }\n`;

const UI_PATHS = [
  "src/app/x.tsx",
  "src/components/candidate/x.tsx",
  "src/components/templates/x.tsx",
  "src/components/ui/x.tsx",
];

async function isOn(rule: string, override?: ESLint.Options["overrideConfig"]) {
  const eslint = new ESLint(override ? { overrideConfig: override } : {});
  for (const path of UI_PATHS) {
    const config = await eslint.calculateConfigForFile(path);
    const level = config.rules?.[rule]?.[0];
    if (level === 2 || level === "error") return true;
  }
  return false;
}

describe("determinism ledger", () => {
  it("reports automatic checks over all decisions", () => {
    const result = run(
      "  - { id: a, layer: x, kind: closed, source: s, check: 'test:tests/a.test.ts' }\n" +
        "  - { id: b, layer: x, kind: formula, source: s }\n",
    );
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("1/2 = 50%");
  });

  it("rejects a check that does not exist", () => {
    const result = run("  - { id: a, layer: x, kind: closed, source: s, check: 'test:nope.ts' }\n");
    expect(result.status).toBe(1);
    expect(result.stdout).toContain("no such file");
  });

  it("rejects a judgment that claims an automatic check", () => {
    const result = run(
      "  - { id: a, layer: x, kind: judgment, source: s, check: 'test:tests/a.test.ts' }\n",
    );
    expect(result.status).toBe(1);
  });

  it("does not count a tool that make never runs", () => {
    const result = run(row("tool:README.md"));
    expect(result.status).toBe(1);
    expect(result.stdout).toContain("not run by make");
  });

  it("counts a tool that make runs", () => {
    expect(run(row("tool:tools/t.py")).stdout).toContain("1/1 = 100%");
  });

  it("does not count a test that does not name its decision", () => {
    const result = run(row("test:tests/a.test.ts", "other"));
    expect(result.status).toBe(1);
    expect(result.stdout).toContain("decision:other");
  });

  it("does not take a longer decision id for this one", () => {
    const setup = (root: string) => writeFileSync(join(root, "tests/a.test.ts"), "decision:a-b\n");
    expect(run(row("test:tests/a.test.ts"), setup).status).toBe(1);
  });

  it("does not count browser tests outside the kit's suite", () => {
    const result = run(row("e2e:tests/a.test.ts"));
    expect(result.status).toBe(1);
    expect(result.stdout).toContain("suite_keys");
  });

  it("counts browser tests inside the kit's suite", () => {
    const setup = (root: string) =>
      writeFileSync(join(root, "_acceptance/config.yaml"), "    - executors.script.e2e\n");
    expect(run(row("e2e:tests/a.test.ts"), setup).status).toBe(0);
  });

  it("rejects a key it does not know", () => {
    const result = run("  - { id: a, layer: x, kind: closed, source: index, server, ui }\n");
    expect(result.status).toBe(1);
    expect(result.stdout).toContain("unknown key");
  });

  it("reads the real ledger without PyYAML", () => {
    const result = spawnSync("python3", ["-S", "tools/design_check.py"], { encoding: "utf8" });
    expect(result.stderr).toBe("");
    expect(result.status).toBe(0);
  });

  it("has every lint rule in the ledger switched on", { timeout: 60_000 }, async () => {
    const ledger = readFileSync("design/decisions.yaml", "utf8");
    const rules = [...ledger.matchAll(/check: "eslint:([\w/-]+)"/g)].map((m) => m[1] as string);
    expect(rules.length).toBeGreaterThan(5);
    for (const rule of rules) expect(await isOn(rule), rule).toBe(true);
  });

  it("notices a lint rule that is switched off", { timeout: 60_000 }, async () => {
    const rule = "onehub-ui/no-raw-table";
    expect(await isOn(rule, { files: ["src/**"], rules: { [rule]: "off" } })).toBe(false);
  });

  describe("display keys", () => {
    const collect = (entity: string, spec: string) =>
      spawnSync(
        "python3",
        [
          "-c",
          `import sys; sys.path.insert(0, "tools"); from design_codegen import collect_display as c; print(c({"${entity}": {"properties": {"p": ${spec}}}}))`,
        ],
        { encoding: "utf8" },
      );

    it("requires a display key on an entity shown on a screen", () => {
      const result = collect("Listing", '{"type": "integer"}');
      expect(result.status).toBe(1);
      expect(result.stderr).toContain("Listing.p: needs a display kind");
    });

    it("accepts an explicit none and leaves it out of the table", () => {
      expect(collect("Listing", '{"display": "none"}').stdout).toContain("{}");
    });

    it("does not require the key elsewhere", () => {
      expect(collect("Company", '{"type": "string"}').status).toBe(0);
    });
  });
});
