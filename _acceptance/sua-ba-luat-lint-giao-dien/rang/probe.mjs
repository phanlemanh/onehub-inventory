#!/usr/bin/env node
// Probes the repository's real ESLint configuration with the kinds of text the design-assembly tool uses to
// check that a UI lint rule holds its decision. Each probe is linted as a screen file of the tree at --root.
//
//   node probe.mjs [--root <dir>] [E1|E2|E3|E4|all]
//
// Prints the tree it measures, then one line per probe. A probe that the rule lets through prints
// "<E> LỌT: <label>" and the command exits 1. A control the rule rejects prints "<E> SAI ĐỐI CHỨNG: <label>".
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const rootAt = args.indexOf("--root");
const ROOT = path.resolve(rootAt === -1 ? path.join(HERE, "../../..") : args[rootAt + 1]);
const which = args.filter((a, i) => !a.startsWith("--") && args[i - 1] !== "--root")[0] ?? "all";

// ESLint is taken from the repository the script lives in; the configuration from the tree being measured.
const require = createRequire(path.join(HERE, "../../../package.json"));
const { ESLint } = await import(pathToFileURL(require.resolve("eslint")).href);
const eslint = new ESLint({ cwd: ROOT });
const SCREEN = path.join(ROOT, "src/app/(app)/probe-sua-ba-luat.tsx");

const CONTROL = "export const Control = () => <div className=\"p-3 gap-2\" />;\n";
const BUTTON = 'import { Button } from "@/components/ui/button";\n';
const CN = 'import { cn } from "@/lib/utils";\n';
const CLSX = 'import { clsx } from "clsx";\n';
const CVA = 'import { cva } from "class-variance-authority";\n';
const INLINE = 'export const A = () => <div style={{ color: "red" }} />;\n';

// [label, text, rule that must report, how many reports of that rule (null = at least one)]
const CASES = {
  E1: {
    rule: "onehub-ui/no-off-scale-spacing",
    probes: [
      ['<div className="p-[13px]" />', 'export const A = () => <div className="p-[13px]" />;\n'],
      ['<div className="gap-[7px]" />', 'export const A = () => <div className="gap-[7px]" />;\n'],
      ['<div className="md:-mt-[3px]" />', 'export const A = () => <div className="md:-mt-[3px]" />;\n'],
      // Sizing utilities, the other half of the rule's list.
      ['<div className="w-[200px]" />', 'export const A = () => <div className="w-[200px]" />;\n'],
      ['<div className="h-[37px]" />', 'export const A = () => <div className="h-[37px]" />;\n'],
      ['<div className="size-[18px]" />', 'export const A = () => <div className="size-[18px]" />;\n'],
      ['<div className="min-w-[10rem]" />', 'export const A = () => <div className="min-w-[10rem]" />;\n'],
      ['<div className="lg:max-h-[50vh]" />', 'export const A = () => <div className="lg:max-h-[50vh]" />;\n'],
    ],
    controls: [["on-scale steps p-3 gap-2", CONTROL]],
  },
  E2: {
    rule: "onehub-ui/no-partial-class",
    probes: [
      ['<div className={"text-" + tone} />', 'export const A = ({ tone }: { tone: string }) => <div className={"text-" + tone} />;\n'],
      ['<Button className={"text-" + tone}>', `${BUTTON}export const A = ({ tone }: { tone: string }) => <Button className={"text-" + tone}>a</Button>;\n`],
      ['cn("p-4", tone + "-500")', `${CN}export const c = (tone: string) => cn("p-4", tone + "-500");\n`],
      ['ok ? "p-4" : "text-" + tone', 'export const A = ({ ok, tone }: { ok: boolean; tone: string }) => <p className={ok ? "p-4" : "text-" + tone} />;\n'],
      ['on && "bg-" + tone', 'export const A = ({ on, tone }: { on: boolean; tone: string }) => <p className={on && "bg-" + tone} />;\n'],
      ['a || "bg-" + tone', 'export const A = ({ a, tone }: { a: string; tone: string }) => <p className={a || "bg-" + tone} />;\n'],
      ['className={tone + "-500"}', 'export const A = ({ tone }: { tone: string }) => <p className={tone + "-500"} />;\n'],
      ['clsx("p-4", "text-" + tone)', `${CLSX}export const c = (tone: string) => clsx("p-4", "text-" + tone);\n`],
      ['cva("text-" + tone)', `${CVA}export const c = (tone: string) => cva("text-" + tone);\n`],
    ],
    controls: [
      ['"p-4 " + x', 'export const A = ({ x }: { x: string }) => <p className={"p-4 " + x} />;\n'],
      ['x + " p-4"', 'export const A = ({ x }: { x: string }) => <p className={x + " p-4"} />;\n'],
    ],
  },
  E3: {
    rule: "onehub-ui/require-disable-reason",
    probes: [
      ["// eslint-disable-next-line shadcn/no-arbitrary-values", `// eslint-disable-next-line shadcn/no-arbitrary-values\n${CONTROL}`],
      ["// eslint-disable-next-line no-restricted-imports", `// eslint-disable-next-line no-restricted-imports\n${CONTROL}`],
      ["// eslint-disable-next-line shadcn/no-restyle", `// eslint-disable-next-line shadcn/no-restyle\n${CONTROL}`],
      ["// eslint-disable-next-line shadcn/no-inline-styles", `// eslint-disable-next-line shadcn/no-inline-styles\n${CONTROL}`],
      ["// eslint-disable-next-line react-hooks/exhaustive-deps", `// eslint-disable-next-line react-hooks/exhaustive-deps\n${CONTROL}`],
    ],
    controls: [["the same exception with -- and a reason", `// eslint-disable-next-line shadcn/no-inline-styles -- a printed invoice\n${CONTROL}`]],
  },
  E4: {
    rule: "onehub-ui/require-disable-reason",
    count: 1,
    probes: [
      ["/* eslint-disable */", `/* eslint-disable */\n${CONTROL}`],
      ["// eslint-disable-line (bare)", "export const a = 1; // eslint-disable-line\n"],
      ["// eslint-disable-line no-console", "export const a = 1; // eslint-disable-line no-console\n"],
      ["/* eslint-disable onehub-ui/require-disable-reason */", `/* eslint-disable onehub-ui/require-disable-reason */\n${CONTROL}`],
    ],
    controls: [
      ["/* eslint-disable -- generated file */", `/* eslint-disable -- generated file */\n${CONTROL}`],
      ["// eslint-disable-line no-console -- a script's own output", "export const a = 1; // eslint-disable-line no-console -- a script's own output\n"],
    ],
  },
};

async function reports(text, rule) {
  const [result] = await eslint.lintText(text, { filePath: SCREEN });
  return result.messages.filter((m) => m.ruleId === rule);
}

console.log(`probe: root ${ROOT}`);
let failed = 0;
const fail = (line) => {
  failed++;
  console.log(line);
};

// AC-4, the processor's side effects: it lifts the suppression of the reason rule only, and fixes still apply.
async function e4SideEffects() {
  const before = await reports(INLINE, "shadcn/no-inline-styles");
  if (before.length === 0) return fail("E4 SAI ĐỐI CHỨNG: tiền đề — shadcn/no-inline-styles không báo style={{…}}");
  const after = await reports(`// eslint-disable-next-line shadcn/no-inline-styles -- a printed invoice\n${INLINE}`, "shadcn/no-inline-styles");
  if (after.length === 0) console.log("E4 đối chứng đúng: other rules stay suppressed");
  else fail(`E4 SAI ĐỐI CHỨNG: other rules stay suppressed (shadcn/no-inline-styles báo ${after.length} lần)`);
  const fixer = new ESLint({ cwd: ROOT, fix: true });
  const [fixed] = await fixer.lintText("// eslint-disable-next-line no-console -- not needed\nexport const a = 1;\n", { filePath: SCREEN });
  if (typeof fixed.output === "string" && !fixed.output.includes("eslint-disable")) console.log("E4 chặn: autofix still runs on screen files");
  else fail("E4 LỌT: autofix stops on screen files");
}
for (const id of which === "all" ? Object.keys(CASES) : [which]) {
  const c = CASES[id];
  if (!c) {
    console.error(`probe: no case ${id}`);
    process.exit(2);
  }
  for (const [label, text] of c.probes) {
    const got = await reports(text, c.rule);
    const ok = c.count ? got.length === c.count : got.length > 0;
    if (ok) console.log(`${id} chặn: ${label}`);
    else fail(`${id} LỌT: ${label} (${c.rule} báo ${got.length} lần)`);
  }
  for (const [label, text] of c.controls) {
    const got = await reports(text, c.rule);
    if (got.length === 0) console.log(`${id} đối chứng đúng: ${label}`);
    else fail(`${id} SAI ĐỐI CHỨNG: ${label} (${c.rule} báo ${got.length} lần)`);
  }
  if (id === "E4") await e4SideEffects();
}
process.exit(failed ? 1 : 0);
