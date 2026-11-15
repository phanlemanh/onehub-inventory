// Row 1u: every browser test changes the page only through the shared door (tests/e2e/sua-trang.ts), which waits for
// the page to be hydrated first. Red on any call that changes the page without it.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { CHO_PR, KHOA_LOI, quetTep } from "./sua-trang-quet";

const ROOT = join(__dirname, "..");
const FILES = execFileSync(
  "git",
  [
    "ls-files",
    "--cached",
    "--others",
    "--exclude-standard",
    "tests/e2e",
    "tests/e2e-db",
    "tools/e2e_templates",
  ],
  { cwd: ROOT, encoding: "utf8" },
)
  .split("\n")
  .filter((f) => /\.ts$/.test(f));
const read = (f: string) => readFileSync(join(ROOT, f), "utf8");

describe("sua-trang · the browser tests change the page only through the door", () => {
  it("no call outside the door changes the page, but in the files waiting on another pull request", () => {
    const problems = FILES.filter((f) => !CHO_PR.has(f) && !KHOA_LOI.has(f)).flatMap((f) =>
      quetTep(f, read(f)),
    );
    expect(problems).toEqual([]);
  });

  it("every file on the waiting list still waits: it exists and still has calls to move", () => {
    const stale = [...CHO_PR.keys()].filter(
      (f) => !FILES.includes(f) || quetTep(f, read(f)).length === 0,
    );
    expect(stale).toEqual([]);
  });

  it("every locked file still has its call and is still locked by the test named for it", () => {
    const stale = [...KHOA_LOI].filter(
      ([f, lock]) => quetTep(f, read(f)).length === 0 || !read(lock).includes(f),
    );
    expect(stale).toEqual([]);
  });

  it("the root layout sets the hydrated mark the door waits for", () => {
    expect(read("src/app/layout.tsx")).toMatch(/<HydrationMark \/>/);
    expect(read("src/app/hydration-mark.tsx")).toMatch(/setAttribute\("data-hydrated", ""\)/);
  });
});

describe("sua-trang · breaks", () => {
  const f = "tests/e2e/pha.spec.ts";
  const cases: [string, string, string[]][] = [
    [
      "a raw screenshot",
      "await page.screenshot({ path: p });",
      [`sua-trang: ${f}:1 screenshot khong qua cua chung`],
    ],
    [
      "a raw style tag",
      "await page.addStyleTag({ content: c });",
      [`sua-trang: ${f}:1 addStyleTag khong qua cua chung`],
    ],
    [
      "a class removed by a raw evaluate",
      'await el.evaluate((n) => n.classList.remove("invisible"));',
      [`sua-trang: ${f}:1 evaluate doi trang khong qua cua chung`],
    ],
    [
      "a style set on rows by a raw evaluateAll, on a later line",
      'const a = 1;\nawait rows.evaluateAll((rs) => rs.forEach((r) => (r.style.color = "red")));',
      [`sua-trang: ${f}:2 evaluateAll doi trang khong qua cua chung`],
    ],
    [
      "an init script that strips the page before React takes it over",
      "await page.addInitScript(() => { new MutationObserver(() => document.querySelectorAll('b').forEach((b) => b.remove())).observe(document, { childList: true }); });",
      [`sua-trang: ${f}:1 addInitScript doi trang truoc khi gan`],
    ],
    [
      "an init script that adds a style to the head and also strips a body node",
      "await page.addInitScript(() => { const s = document.createElement('style'); document.head.append(s); document.querySelector('main').remove(); });",
      [`sua-trang: ${f}:1 addInitScript doi trang truoc khi gan`],
    ],
  ];
  for (const [name, src, want] of cases) {
    it(`caught: ${name}`, () => {
      expect(quetTep(f, src)).toEqual(want);
    });
  }

  const sound: [string, string][] = [
    [
      "a read-only evaluate",
      "const w = await el.evaluate((n) => n.getBoundingClientRect().width);",
    ],
    ["a comparison, not an assignment", "await el.evaluate((n) => n.textContent === 'x');"],
    ["the door", 'await suaTrang(el, (n) => n.classList.remove("invisible"));'],
    [
      "an init script that adds a style it created to the head",
      'await page.addInitScript(() => { document.addEventListener("DOMContentLoaded", () => { const style = document.createElement("style"); style.textContent = "x"; document.head.append(style); }); });',
    ],
    [
      "an init script that waits for the hydrated mark",
      "await page.addInitScript(() => { const go = () => new MutationObserver(() => document.querySelectorAll('b').forEach((b) => b.remove())).observe(document, { childList: true }); const w = () => document.documentElement.hasAttribute('data-hydrated') ? go() : setTimeout(w, 20); w(); });",
    ],
  ];
  for (const [name, src] of sound) {
    it(`not caught: ${name}`, () => {
      expect(quetTep(f, src)).toEqual([]);
    });
  }

  it("the door file itself may call the raw APIs", () => {
    expect(quetTep("tests/e2e/sua-trang.ts", "await page.screenshot();")).toEqual([]);
  });
});
