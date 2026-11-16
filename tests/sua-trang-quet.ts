// Row 1u: the static check behind «a test changes the page through the shared door, in the ways it lists». A browser
// test that changes the DOM (a style, a class, a node, an attribute) or takes a screenshot (which hides the caret with an
// inline style) before React has hydrated the page makes React report a hydration mismatch, and the hydration guard
// turns the run red. The door (tests/e2e/sua-trang.ts) waits for the page to be hydrated first. This scanner finds the calls that
// change the page without it in one of the LISTED ways (MUTATION below, and raw screenshots and style tags). It does not
// prove that every way of changing the page goes through the door: a way not on the list passes unseen (open item for
// the second test-suite tightening row).

/** Tokens that change the DOM when they run inside a page callback. */
export const MUTATION =
  /\.style\.[\w-]+\s*=(?!=)|\.style\.setProperty\(|\.style\.cssText\s*=|classList\.(?:add|remove|toggle|replace)\(|\.remove\(\)|\.appendChild\(|\.append\(|\.prepend\(|\.insertAdjacent\w*\(|\.insertBefore\(|\.replaceWith\(|\.replaceChildren\(|\.(?:set|remove|toggle)Attribute\(|\.innerHTML\s*=(?!=)|\.outerHTML\s*=(?!=)|\.textContent\s*=(?!=)/;

/** The door itself: the only file allowed to call the raw page APIs. */
export const DOOR = "tests/e2e/sua-trang.ts";

/** Break tests that change the page before hydration on purpose, to prove the guard sees it. */
export const ON_PURPOSE = new Set(["tests/e2e/gac-hydration-pha.spec.ts"]);

/**
 * Files another open pull request is changing; they move to the door once it is merged (supervisor ruling V-1511-16:
 * row 1u merges only when this list is empty). Empty: PR #66 and PR #70 are merged and their files moved.
 */
export const CHO_PR: ReadonlyMap<string, string> = new Map();

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

/** Calls that put a node into a tree: a detached copy passed to one of them is back in the page. */
const ATTACH =
  /\.(?:append|appendChild|prepend|insertBefore|insertAdjacentElement|replaceWith|replaceChildren|after|before)\(/;

/**
 * The body of a page callback without its changes to detached copies: a node from `cloneNode(…)` or a document from
 * `DOMParser…parseFromString(…)`, held in a variable that is never passed to a call that puts a node into a tree. Such
 * a copy is not in the page, so changing it changes no node React hydrates. A copy that is put back (`el.append(copy)`)
 * keeps its changes counted, and so does every change made on the page itself.
 */
export function ngoaiBanSao(body: string): string {
  let out = body;
  const copies = body.matchAll(
    /(?:const|let)\s+(\w+)\s*=\s*[^;\n]*?(?:\.cloneNode\(|\.parseFromString\()/g,
  );
  for (const m of copies) {
    const name = m[1]!;
    const back = new RegExp(`${ATTACH.source}[^)]*\\b${name}\\b`);
    if (back.test(body)) continue;
    out = out.replace(new RegExp(`\\b${name}\\.[^;\\n]*`, "g"), "");
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
    } else if (MUTATION.test(ngoaiBanSao(body))) site(`${kind} doi trang khong qua cua chung`);
  }
  return out;
}

/** The problems of one file: `sua-trang: <file>:<line> <why>`. */
export function quetTep(file: string, src: string): string[] {
  return viTri(file, src).map((s) => `sua-trang: ${file}:${s.line} ${s.why}`);
}
