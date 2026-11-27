// make dat-khoa asks for keys without echo. The question must stay on screen: readline clears the current line when a
// question starts, so a question written before that was erased and the owner saw an empty terminal (2026-11-28).
import { PassThrough } from "node:stream";

import { describe, expect, it } from "vitest";

import { terminalAsk } from "./dat-khoa.mjs";

function fakeTerminal() {
  const input = Object.assign(new PassThrough(), { isTTY: true, setRawMode: () => input });
  const output = Object.assign(new PassThrough(), { isTTY: true, columns: 80, rows: 24 });
  let written = "";
  output.on("data", (chunk: Buffer) => {
    written += chunk.toString("utf8");
  });
  return { input, output, written: () => written };
}

/** What the person still sees on the last line: the text after the last "clear to end of screen". */
function visibleAfterLastClear(screen: string): string {
  const parts = screen.split("\x1b[0J");
  return parts[parts.length - 1] ?? "";
}

describe("make dat-khoa — câu hỏi khoá còn hiện trên màn", () => {
  it("in câu hỏi sau khi readline xoá dòng, nhận câu trả lời, không hiện chữ đã dán", async () => {
    const term = fakeTerminal();
    const ask = terminalAsk({ input: term.input, output: term.output });
    const answer = ask("VERCEL_TOKEN (dán rồi Enter): ");
    await new Promise((r) => setImmediate(r));
    expect(visibleAfterLastClear(term.written())).toContain("VERCEL_TOKEN (dán rồi Enter): ");
    term.input.write("khoa-thu-0000\r");
    expect(await answer).toBe("khoa-thu-0000");
    expect(term.written()).not.toContain("khoa-thu-0000");
  });
});
