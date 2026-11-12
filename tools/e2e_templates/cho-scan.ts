// Reads browser test files for hand-written sheet and banner waits, and a `playwright test --list` output for the
// `@cho` tag (roadmap row 1r, AC-7, AC-8). Pure functions: the unit tests feed them the real files and the real list,
// then a broken copy of the same input.
import { CHO_TESTS } from "./settle";

export interface SpecFile {
  path: string;
  text: string;
}

const SHEET_NAME = /"Mở hoặc đóng thanh bên"|\bSHEET_BUTTON\b|\bOPEN_SHEET\b/;
const BANNER = /getByRole\("alert"\)|screen-banner/;

/** Every place outside the shared waits that opens the sheet or waits for a banner by hand, as `<file>:<line>: <why>`. */
export function waitCopies(files: readonly SpecFile[]): string[] {
  const found: string[] = [];
  for (const { path, text } of files) {
    if (path.endsWith("tools/e2e_templates/settle.ts")) continue;
    const lines = text.split("\n");
    lines.forEach((line, i) => {
      const at = `${path}:${i + 1}`;
      if (/\b(function|const|let)\s+openSheet\b/.test(line))
        found.push(`${at}: ham mo ngan chep tay`);
      // A press on the sheet button: the name and the click in the same statement (up to the `;`, three lines at most).
      if (SHEET_NAME.test(line)) {
        const rest = lines.slice(i, i + 3).join(" ");
        const statement = rest.slice(rest.search(SHEET_NAME)).split(";")[0]!;
        if (/\.click\(/.test(statement)) found.push(`${at}: bam nut mo ngan khong qua openSheet`);
      }
      if (/setOffline\(true\)/.test(line)) {
        for (const next of lines.slice(i + 1, i + 5)) {
          if (BANNER.test(next) && /toBeVisible\(/.test(next) && !/\bshown\(/.test(next)) {
            found.push(`${at}: cho bang tu viet sau khi mat mang`);
            break;
          }
        }
      }
    });
  }
  return found;
}

/**
 * Titles of CHO_TESTS missing from `list`, as `<file> › <title>`. `list` is the output of
 * `playwright test --list --grep @cho`: the grep keeps only tests tagged `@cho`, so a test whose tag was removed is
 * absent from it.
 */
export function untagged(
  list: string,
  wanted: Readonly<Record<string, readonly string[]>> = CHO_TESTS,
): string[] {
  const lines = list.split("\n");
  const missing: string[] = [];
  for (const [file, titles] of Object.entries(wanted)) {
    const name = file.split("/").pop()!;
    for (const title of titles) {
      const tagged = lines.some(
        (l) => l.includes(`› ${name}:`) && l.trimEnd().endsWith(`› ${title}`),
      );
      if (!tagged) missing.push(`${file} › ${title}`);
    }
  }
  return missing;
}

const WAIT_CALL = /\b(openSheet|shown)\(/;
const TEST_START = /\btest\(\s*(["`])((?:(?!\1).)+)\1/g;
const COLOR_SCHEMES = ["light", "dark"];

/**
 * The tests of one file that wait for the sheet or a banner, read from the code: a test whose body calls openSheet()
 * or shown(), or calls a helper of the same file whose body does (as members.spec's navMembers). A title written with
 * `${colorScheme}` stands for its light and dark copies. A body runs from its title to the next test's title.
 */
export function waitingTests({ text }: SpecFile): string[] {
  const helpers = new Set<string>();
  const fn = /(?:async\s+)?function\s+(\w+)\s*\(/g;
  const starts = [...text.matchAll(fn)].map((m) => ({ name: m[1]!, at: m.index! }));
  starts.forEach((s, i) => {
    const body = text
      .slice(s.at, starts[i + 1]?.at ?? text.length)
      .split(/\ntest(?:\.describe)?\(/)[0]!;
    if (s.name !== "openSheet" && WAIT_CALL.test(body)) helpers.add(s.name);
  });
  const helperCall = helpers.size > 0 ? new RegExp(`\\b(${[...helpers].join("|")})\\(`) : null;
  const tests = [...text.matchAll(TEST_START)];
  const found: string[] = [];
  tests.forEach((m, i) => {
    const body = text.slice(m.index!, tests[i + 1]?.index ?? text.length);
    if (!WAIT_CALL.test(body) && !(helperCall && helperCall.test(body))) return;
    const title = m[2]!;
    if (title.includes("${colorScheme}"))
      found.push(...COLOR_SCHEMES.map((c) => title.replace("${colorScheme}", c)));
    else found.push(title);
  });
  return found;
}

/** Tests that wait for the sheet or a banner (read from the code) but are not in `wanted`, as `<file> › <title>`. */
export function unlisted(
  files: readonly SpecFile[],
  wanted: Readonly<Record<string, readonly string[]>> = CHO_TESTS,
): string[] {
  const missing: string[] = [];
  for (const file of files) {
    const listed = new Set(wanted[file.path] ?? []);
    for (const title of waitingTests(file))
      if (!listed.has(title)) missing.push(`${file.path} › ${title}`);
  }
  return missing;
}
