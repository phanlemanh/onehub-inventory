import { ESLint } from "eslint";
import { describe, expect, it } from "vitest";

const eslint = new ESLint();

async function errors(body: string) {
  const code = `import { Button } from "@/components/ui/button";\nexport const A = ({ c }: { c: string }) => ${body};\n`;
  const [result] = await eslint.lintText(code, { filePath: "src/app/floor-probe.tsx" });
  return result?.messages.filter((m) => m.severity === 2).map((m) => m.ruleId) ?? [];
}

const BROKEN: Record<string, string> = {
  padding: '<div className="p-[13px]" />',
  radius: '<div className="rounded-[7px]" />',
  height: '<div className="h-[37px]" />',
  width: '<div className="w-[110px]" />',
  tracking: '<div className="tracking-[0.3em]" />',
  shadow: '<div className="shadow-[0_1px_2px_rgb(0,0,0)]" />',
  "inline padding": "<div style={{ padding: 13 }} />",
  "inline font size": "<div style={{ fontSize: 13 }} />",
  "restyled height": '<Button className="h-20">x</Button>',
  "restyled shape": '<Button className="rounded-none">x</Button>',
  "restyled colour": '<Button className="bg-primary">x</Button>',
  "off-scale step": '<div className="h-9.25" />',
  "class from pieces": "<div className={`p-${c}`} />",
};

const ALLOWED: Record<string, string> = {
  "scale values": '<div className="h-10 p-4 text-sm rounded-lg" />',
  "button placement": '<Button className="mt-4 w-full">x</Button>',
  "whole classes": "<div className={`p-4 ${c}`} />",
};

describe("lint floor on screen code", { timeout: 60_000 }, () => {
  for (const [name, body] of Object.entries(BROKEN)) {
    it(`rejects ${name}`, async () => {
      expect(await errors(body)).not.toEqual([]);
    });
  }
  for (const [name, body] of Object.entries(ALLOWED)) {
    it(`allows ${name}`, async () => {
      expect(await errors(body)).toEqual([]);
    });
  }
});
