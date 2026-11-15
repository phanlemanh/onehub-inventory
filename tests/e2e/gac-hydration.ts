// Hydration guard (row 1u, AC-4 and AC-5): a browser run is red when React reports that the server's HTML did not match
// the page it built. The dev server forwards browser errors to its own output (Next.js `browserDebugInfoInTerminal`,
// on by default), and Playwright hands that output to every reporter; this reporter counts the warnings there and in
// each test's own output, names the tests running when each one arrived, and turns the run red. Mounted in both
// Playwright configurations, so it guards every test, including tests that import `test` straight from Playwright.
import type { FullResult, Reporter, TestCase } from "@playwright/test/reporter";

/** The warnings this guard catches, written before the guard (evals.yaml of row 1u). */
export const MAU_HYDRATION = [/Hydration failed/, /hydrated but some attributes/];

export function demCanhBao(text: string): number {
  return text.split("\n").filter((line) => MAU_HYDRATION.some((m) => m.test(line))).length;
}

export default class GacHydration implements Reporter {
  private readonly running = new Set<TestCase>();
  private readonly hits: string[] = [];

  onTestBegin(test: TestCase): void {
    this.running.add(test);
  }

  onTestEnd(test: TestCase): void {
    this.running.delete(test);
  }

  onStdOut(chunk: string | Buffer, test?: TestCase): void {
    this.read(chunk, test);
  }

  onStdErr(chunk: string | Buffer, test?: TestCase): void {
    this.read(chunk, test);
  }

  private read(chunk: string | Buffer, test?: TestCase): void {
    const n = demCanhBao(chunk.toString());
    if (n === 0) return;
    const who = test ? [test] : [...this.running];
    const names =
      who.map((t) => t.titlePath().filter(Boolean).slice(1).join(" › ")).join(" | ") ||
      "(khong bai nao)";
    for (let i = 0; i < n; i += 1) this.hits.push(names);
  }

  onEnd(result: FullResult): Promise<{ status?: FullResult["status"] } | undefined> {
    if (this.hits.length === 0) {
      process.stdout.write("gac-hydration: 0 canh bao\n");
      return Promise.resolve(undefined);
    }
    const names = [...new Set(this.hits)].join(" ; ");
    process.stdout.write(`gac-hydration: ${this.hits.length} canh bao, bai: ${names}\n`);
    return Promise.resolve({ status: result.status === "interrupted" ? "interrupted" : "failed" });
  }

  printsToStdio(): boolean {
    return false;
  }
}
