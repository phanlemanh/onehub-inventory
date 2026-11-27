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

/** Lines readline can no longer erase: everything before the last line break (it only clears the input line). */
function settledLines(screen: string): string {
  return screen.slice(0, screen.lastIndexOf("\n") + 1);
}

describe("make dat-khoa — câu hỏi khoá còn hiện trên màn", () => {
  it("in câu hỏi trên dòng riêng mà readline không xoá, nhận câu trả lời, không hiện chữ đã dán", async () => {
    const term = fakeTerminal();
    const ask = terminalAsk({ input: term.input, output: term.output });
    const answer = ask("VERCEL_TOKEN (dán rồi Enter): ");
    await new Promise((r) => setImmediate(r));
    expect(settledLines(term.written())).toContain("VERCEL_TOKEN (dán rồi Enter): \n");
    term.input.write("khoa-thu-0000\r");
    expect(await answer).toBe("khoa-thu-0000");
    expect(term.written()).not.toContain("khoa-thu-0000");
  });
});
