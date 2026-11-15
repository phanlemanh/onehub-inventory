// Row 1u: the static check behind «a test changes the page only through the shared door». A browser test that changes
// the DOM (a style, a class, a node, an attribute) or takes a screenshot (which hides the caret with an inline style)
// before React has hydrated the page makes React report a hydration mismatch, and the hydration guard turns the run
// red. The door (tests/e2e/sua-trang.ts) waits for the page to be hydrated first; this scanner finds every call that
// changes the page without it.

/** Tokens that change the DOM when they run inside a page callback. */
export const MUTATION =
  /\.style\.[\w-]+\s*=(?!=)|\.style\.setProperty\(|\.style\.cssText\s*=|classList\.(?:add|remove|toggle|replace)\(|\.remove\(\)|\.appendChild\(|\.append\(|\.prepend\(|\.insertAdjacent\w*\(|\.insertBefore\(|\.replaceWith\(|\.replaceChildren\(|\.(?:set|remove|toggle)Attribute\(|\.innerHTML\s*=(?!=)|\.outerHTML\s*=(?!=)|\.textContent\s*=(?!=)/;

/** The door itself: the only file allowed to call the raw page APIs. */
export const DOOR = "tests/e2e/sua-trang.ts";

/** Break tests that change the page before hydration on purpose, to prove the guard sees it. */
export const ON_PURPOSE = new Set(["tests/e2e/gac-hydration-pha.spec.ts"]);

/**
 * Files another open pull request is changing; they move to the door once it is merged (supervisor ruling V-1511-16:
 * row 1u merges only when this list is empty). PR #66: lop-rieng.spec.ts, suite.ts. PR #70: phone-list.ts,
 * the-dien-thoai.spec.ts.
 */
export const CHO_PR: ReadonlyMap<string, string> = new Map([
  ["tests/e2e-db/lop-rieng.spec.ts", "#66"],
  ["tools/e2e_templates/suite.ts", "#66"],
  ["tests/e2e/phone-list.ts", "#70"],
  ["tests/e2e/the-dien-thoai.spec.ts", "#70"],
]);

/**
 * The body of an init script without its changes to elements it created itself and to `document.head`: a style added
 * to the head before the page loads changes no node React hydrates.
 */
export function ngoaiPhanTuMoi(body: string): string {
  let out = body.replace(/document\.head\.(?:append|appendChild)\([^)]*\)/g, "");
  for (const m of body.matchAll(/(?:const|let)\s+(\w+)\s*=\s*document\.createElement\(/g)) {
    out = out.replace(new RegExp(`\\b${m[1]}\\.[\\w.]+\\s*=(?!=)|\\b${m[1]}\\.\\w+\\(`, "g"), "");
  }
  return out;
}

/**
 * Files whose words other signed rows lock byte for byte: the sign-in tests (tests/dang-nhap-giu-loi.test.ts, row 8)
 * and the row 9 members tests (tests/thanh-vien-khoa-bai.test.ts). Each has one screenshot outside the door; moving it
 * means unlocking a signed record, which is the owner's call, not this row's.
 */
export const KHOA_LOI: ReadonlyMap<string, string> = new Map([
  ["tests/e2e-db/login.spec.ts", "tests/dang-nhap-giu-loi.test.ts"],
  ["tests/e2e-db/va-dang-nhap.spec.ts", "tests/dang-nhap-giu-loi.test.ts"],
  ["tests/e2e-db/members.spec.ts", "tests/thanh-vien-khoa-bai.test.ts"],
  ["tests/e2e-db/bo-nut-members.spec.ts", "tests/thanh-vien-khoa-bai.test.ts"],
]);

/** The text of the call's argument list, from the `(` at `open` to its matching `)`; strings and comments skipped. */
export function argsAt(src: string, open: number): string {
  let depth = 0;
  for (let i = open; i < src.length; i += 1) {
    const c = src[i];
    if (c === '"' || c === "'" || c === "`") {
      const q = c;
      for (i += 1; i < src.length && src[i] !== q; i += 1) if (src[i] === "\\") i += 1;
      continue;
    }
    if (c === "/" && src[i + 1] === "/") {
      while (i < src.length && src[i] !== "\n") i += 1;
      continue;
    }
    if (c === "(") depth += 1;
    else if (c === ")") {
      depth -= 1;
      if (depth === 0) return src.slice(open, i + 1);
    }
  }
  return src.slice(open);
}

const lineOf = (src: string, at: number) => src.slice(0, at).split("\n").length;

export type Site = { at: number; kind: string; line: number; why: string };

/** Every call in one file that changes the page without the door. */
export function viTri(file: string, src: string): Site[] {
  if (file === DOOR) return [];
  const out: Site[] = [];
  const calls =
    /\.(evaluate|evaluateAll|evaluateHandle|addStyleTag|screenshot|addInitScript)\s*\(/g;
  for (let m = calls.exec(src); m; m = calls.exec(src)) {
    const kind = m[1]!;
    const body = argsAt(src, m.index + m[0].length - 1);
    const line = lineOf(src, m.index);
    const site = (why: string) => out.push({ at: m!.index, kind, line, why });
    if (kind === "addStyleTag" || kind === "screenshot") site(`${kind} khong qua cua chung`);
    else if (kind === "addInitScript") {
      // Runs before the page's own code: a script that changes the page must wait for the hydrated mark itself.
      if (
        MUTATION.test(ngoaiPhanTuMoi(body)) &&
        !/data-hydrated/.test(body) &&
        !ON_PURPOSE.has(file)
      )
        site("addInitScript doi trang truoc khi gan");
    } else if (MUTATION.test(body)) site(`${kind} doi trang khong qua cua chung`);
  }
  return out;
}

/** The problems of one file: `sua-trang: <file>:<line> <why>`; a file waiting on another PR is reported once. */
export function quetTep(file: string, src: string): string[] {
  return viTri(file, src).map((s) => `sua-trang: ${file}:${s.line} ${s.why}`);
}
