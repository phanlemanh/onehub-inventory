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
