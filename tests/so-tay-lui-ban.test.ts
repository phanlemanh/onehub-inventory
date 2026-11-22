// Row lui-ban-luc-xoay-mat-khau (E2, E4, E5): what to do about a rollback after the login role's password is rotated is
// written once, in the section ROTATION_SECTION of docs/van-hanh/xoay-khoa.md, and every runbook that talks about rolling
// back, about the running deployment being fine, or about rotating that password opens with one banner that says the
// section wins over every such sentence of the runbook. Pure functions, each returning its findings:
//   oneSection     — exactly one heading `## <ROTATION_SECTION>` in docs/van-hanh/, and it is in xoay-khoa.md
//   everyLine      — the «Dòng» cell (first column) of the section's table rows names every step of STEPS and every
//                    rollback line the code can print (rollBack in tools/deploy/len-ban.mjs, the domain check line of
//                    tools/deploy/lui-ban.mjs); a line named in another column or a paragraph does not count
//   rotationReason — the rows for the two lines that land on a deployment built before the rotation name the reason the
//                    quick check really prints for a deployment that cannot connect, read from tools/deploy/kiem-nhanh.mjs
//   banners        — every runbook that needs it opens with the banner, right under its title
//   noRestating    — outside the section no paragraph gives the reason («mật khẩu cũ»)
// The red cases run each rule on an in-memory copy of the real runbooks and the real code with one thing broken, and pin
// the exact message.
import { readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { beforeAll, describe, expect, it } from "vitest";

const ROOT = resolve(__dirname, "..");
const RUNBOOK = join(ROOT, "docs", "van-hanh");
const LEN_BAN = join(ROOT, "tools", "deploy", "len-ban.mjs");
const LUI_BAN = join(ROOT, "tools", "deploy", "lui-ban.mjs");
const KIEM_NHANH = join(ROOT, "tools", "deploy", "kiem-nhanh.mjs");
const HEALTH = join(ROOT, "src", "modules", "identity", "health.ts");

export const ROTATION_SECTION = "Lùi bản sau khi xoay mật khẩu vai đăng nhập";
const HOME = "xoay-khoa.md";
const NAMED = `«${ROTATION_SECTION}»`;

/** The paragraphs that make a runbook need the banner. */
const ABOUT_ROLLBACK = /lùi|rollback|lui-ban\.md/i;
const RUNNING_FINE = /bản đang chạy (không bị|yên)/i;
const ROTATES_LOGIN = (text: string) => /xoay/i.test(text) && /mật khẩu vai đăng nhập/i.test(text);
const REASON = /mật khẩu cũ/i;

/** The rows whose deployment was built before the rotation, keyed by a fixed part of their «Dòng» cell. */
const LANDS_ON_OLD = ["lùi bản ĐỎ — tên miền đã về bản", "rollback <ENV>: kiem-nhanh-ten-mien ĐỎ"];

type Files = Record<string, string>;
type Unit = { file: string; h2: string; h3: string; text: string };

/** Paragraphs, list items (with their continuation lines) and table rows of a markdown page; headings and code skipped. */
export function units(file: string, text: string): Unit[] {
  const out: Unit[] = [];
  let h2 = "";
  let h3 = "";
  let current: string[] | null = null;
  let fence = false;
  const flush = () => {
    if (current?.length)
      out.push({ file, h2, h3, text: current.join(" ").replace(/\s+/g, " ").trim() });
    current = null;
  };
  for (const line of text.normalize("NFC").split("\n")) {
    if (/^\s*```/.test(line)) {
      flush();
      fence = !fence;
      continue;
    }
    if (fence) continue;
    const heading = /^(#{1,6})\s+(.*)$/.exec(line);
    if (heading) {
      flush();
      if (heading[1] === "#") h2 = h3 = "";
      if (heading[1] === "##") [h2, h3] = [heading[2]!.trim(), ""];
      if (heading[1] === "###") h3 = heading[2]!.trim();
      continue;
    }
    if (!line.trim()) {
      flush();
      continue;
    }
    if (/^\s*\|/.test(line)) {
      flush();
      if (!/^\s*\|[\s|:-]+\|\s*$/.test(line))
        out.push({ file, h2, h3, text: line.replace(/\s+/g, " ").trim() });
      continue;
    }
    if (/^\s*([-*]|\d+\.)\s/.test(line)) {
      flush();
      current = [line];
      continue;
    }
    (current ??= []).push(line);
  }
  flush();
  return out;
}

function allUnits(files: Files): Unit[] {
  return Object.keys(files)
    .sort()
    .flatMap((f) => units(f, files[f]!));
}

export function oneSection(files: Files): string[] {
  const at = Object.keys(files)
    .sort((a, b) => (a === HOME ? -1 : b === HOME ? 1 : a.localeCompare(b)))
    .flatMap((f) =>
      files[f]!.split("\n")
        .filter((l) => l.trim() === `## ${ROTATION_SECTION}`)
        .map(() => f),
    );
  if (at.length === 1 && at[0] === HOME) return [];
  return [`mục ${NAMED} phải có đúng một chỗ, ở ${HOME}: thấy ${at.length} (${at.join(", ")})`];
}

/** The fixed head of every literal line `say(…)` or `stop(…)` prints in `body`, cut at the first `${`, `(` or `,`. */
export function printedHeads(body: string): string[] {
  const heads: string[] = [];
  for (const m of body.matchAll(/\b(?:say|stop)\(\s*(["`])([\s\S]*?)\1/g)) {
    const cut = m[2]!
      .split(/\$\{|\(|,/)[0]!
      .replace(/[\s—]+$/, "")
      .trim();
    if (cut && !heads.includes(cut)) heads.push(cut);
  }
  return heads;
}

/** The body of `async function rollBack(` in the deploy command's source, up to the closing brace at column 0. */
export function rollBackBody(source: string): string {
  const at = source.indexOf("async function rollBack(");
  if (at < 0) return "";
  const end = source.indexOf("\n}\n", at);
  return source.slice(at, end < 0 ? undefined : end);
}

export function rollbackLines(lenBan: string, luiBan: string): string[] {
  return [
    ...printedHeads(rollBackBody(lenBan)),
    ...printedHeads(luiBan).filter((h) => h.startsWith("kiem-nhanh-ten-mien")),
  ];
}

const inSection = (u: Unit) => u.file === HOME && u.h2 === ROTATION_SECTION;
const head = (u: Unit) => u.text.slice(0, 60);

/** The cells of a table row, trimmed. */
function cells(row: string): string[] {
  return row
    .trim()
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((c) => c.trim());
}

/** The table rows of the section, each as its «Dòng» cell and its whole text. */
function sectionRows(files: Files): { line: string; text: string }[] {
  return allUnits(files)
    .filter((u) => inSection(u) && u.text.startsWith("|"))
    .map((u) => ({ line: cells(u.text)[0] ?? "", text: u.text }))
    .filter((r) => r.line !== "Dòng");
}

export function everyLine(files: Files, steps: string[], lines: string[]): string[] {
  const dong = sectionRows(files)
    .map((r) => r.line)
    .join("\n");
  const out: string[] = [];
  // A step counts when a backtick span starts with its exact name: `kiem-nhanh` or `kiem-nhanh ĐỎ`, never the
  // longer `kiem-nhanh-ten-mien`.
  for (const s of steps)
    if (!new RegExp(`\`${s}[\`\\s]`).test(dong)) out.push(`mục ${NAMED} thiếu bước: ${s}`);
  for (const l of lines)
    if (!dong.includes(l.normalize("NFC"))) out.push(`mục ${NAMED} thiếu dòng của lệnh: ${l}`);
  return out;
}

/** The fixed head of the reason the quick check gives when health answers `ok` other than true. */
export function notOkReason(kiemNhanh: string): string {
  const m = /body\.ok !== true\)[^`]*`([^`]*)`/.exec(kiemNhanh);
  return m ? m[1]!.split(/\$\{|\(/)[0]!.trim() : "";
}

/**
 * The two rows whose deployment was built before the rotation name the reason the quick check really prints for it.
 * health.ts sets `ok` to `vai === "dat"`, so a deployment that cannot connect answers `ok: false` and the check stops
 * at its `ok` line; its later `vai nối chưa đạt` line is never reached against the real server.
 */
export function rotationReason(files: Files, kiemNhanh: string): string[] {
  const reason = notOkReason(kiemNhanh) || "(không rút được từ mã)";
  const rows = sectionRows(files);
  const out: string[] = [];
  if (
    allUnits(files)
      .filter(inSection)
      .some((u) => u.text.includes("vai nối chưa đạt"))
  )
    out.push(
      `mục ${NAMED} nêu lý do kiểm nhanh mà máy không in khi bản không nối được: vai nối chưa đạt`,
    );
  for (const key of LANDS_ON_OLD) {
    const row = rows.find((r) => r.line.includes(key));
    if (!row || !row.text.includes(reason))
      out.push(`hàng «${key}» không nêu lý do kiểm nhanh máy in cho bản không nối được: ${reason}`);
  }
  return out;
}

/** The runbooks that must open with the banner: those with a paragraph about rolling back, about the running
 *  deployment being fine, or about rotating the login role's password (outside the section itself). */
export function needBanner(files: Files): string[] {
  return Object.keys(files)
    .sort()
    .filter((f) =>
      units(f, files[f]!).some(
        (u) =>
          !inSection(u) &&
          (ABOUT_ROLLBACK.test(u.text) || RUNNING_FINE.test(u.text) || ROTATES_LOGIN(u.text)),
      ),
    );
}

/** The first paragraph under the title is a quote that names the section, says it wins, and links it from another file. */
export function banners(files: Files): string[] {
  const out: string[] = [];
  for (const f of needBanner(files)) {
    const first = units(f, files[f]!)[0];
    const ok =
      !!first &&
      first.h2 === "" &&
      first.text.startsWith(">") &&
      first.text.includes(NAMED) &&
      /thắng/.test(first.text) &&
      (f === HOME || first.text.includes(`](${HOME})`));
    if (!ok) out.push(`${f}: thiếu dòng chặn ngay dưới tiêu đề trỏ mục ${NAMED}`);
  }
  return out;
}

export function noRestating(files: Files): string[] {
  return allUnits(files)
    .filter((u) => !inSection(u) && REASON.test(u.text))
    .map((u) => `${u.file}: đoạn kể lại lý do ngoài mục: "${head(u)}"`);
}

function readRunbooks(): Files {
  const files: Files = {};
  for (const f of readdirSync(RUNBOOK).filter((n) => n.endsWith(".md")))
    files[f] = readFileSync(join(RUNBOOK, f), "utf8");
  return files;
}

/** A copy of `files` with `from` replaced by `to` in `file`; fails when `from` is not there, so a red case never breaks nothing. */
function broken(files: Files, file: string, from: string, to: string): Files {
  expect(files[file], `${file} có mặt`).toBeDefined();
  expect(files[file]!.includes(from), `bản sao ${file} chứa đoạn cần phá`).toBe(true);
  return { ...files, [file]: files[file]!.replace(from, to) };
}

/** The banner block of a runbook: from its first `> ` line to the blank line after it. */
function bannerOf(raw: string): string {
  const at = raw.indexOf("\n> ");
  expect(at, "có dòng chặn").toBeGreaterThan(0);
  const end = raw.indexOf("\n\n", at + 1);
  return raw.slice(at + 1, end);
}

/** The table row of the section whose «Dòng» cell contains `key`, as written in the file. */
function rowOf(raw: string, key: string): string {
  const row = raw.split("\n").find((l) => l.startsWith("|") && cells(l)[0]?.includes(key));
  expect(row, `hàng ${key}`).toBeDefined();
  return row!;
}

const files = readRunbooks();
const lenBan = readFileSync(LEN_BAN, "utf8");
const luiBan = readFileSync(LUI_BAN, "utf8");
const kiemNhanh = readFileSync(KIEM_NHANH, "utf8");
const health = readFileSync(HEALTH, "utf8");
let steps: string[] = [];

beforeAll(async () => {
  const mod = (await import(pathToFileURL(LEN_BAN).href)) as { STEPS: Record<string, string[]> };
  steps = [...new Set(Object.values(mod.STEPS).flat())];
});

describe("E2 · đọc được mã", () => {
  it("rút được mọi dòng lùi bản của rollBack và dòng kiểm của make rollback", () => {
    const lines = rollbackLines(lenBan, luiBan);
    expect(lines).toEqual([
      "lùi bản ĐỎ — không đọc được danh sách bản của Vercel",
      "lùi bản DỪNG — không đọc được bản tên miền trỏ tới trước khi gắn",
      "lùi bản DỪNG — không đọc được mã bản mới",
      "lùi bản DỪNG — trước khi gắn",
      "lùi bản ĐỎ — vercel rollback lỗi",
      "lùi bản ĐỎ — tên miền chưa về bản",
      "lùi bản ĐỎ — tên miền đã về bản",
      "đã lùi về bản trước",
      "kiem-nhanh-ten-mien ĐỎ",
    ]);
    expect(new Set(lines).size).toBe(lines.length);
    expect(steps).toHaveLength(10);
  });
});

describe("E2 · một chỗ", () => {
  it("nội dung thật: đúng một mục, ở sổ xoay khoá", () => {
    expect(oneSection(files)).toEqual([]);
  });
  it("chép tiêu đề sang sổ đưa bản lên → đỏ", () => {
    const copy = {
      ...files,
      "dua-ban-len.md": `${files["dua-ban-len.md"]}\n## ${ROTATION_SECTION}\n`,
    };
    expect(oneSection(copy)).toEqual([
      `mục ${NAMED} phải có đúng một chỗ, ở ${HOME}: thấy 2 (${HOME}, dua-ban-len.md)`,
    ]);
  });
});

describe("E2 · đủ dòng", () => {
  it("nội dung thật: ô «Dòng» của bảng kể mọi bước và mọi dòng lùi bản", () => {
    expect(everyLine(files, steps, rollbackLines(lenBan, luiBan))).toEqual([]);
  });
  it("xoá hẳn hàng «tên miền đã về bản» → đỏ, dù chuỗi ấy còn ở cột khác", () => {
    const row = rowOf(files[HOME]!, "lùi bản ĐỎ — tên miền đã về bản");
    const copy = broken(files, HOME, `${row}\n`, "");
    expect(copy[HOME]!.includes("lùi bản ĐỎ — tên miền đã về bản")).toBe(true);
    expect(everyLine(copy, steps, rollbackLines(lenBan, luiBan))).toEqual([
      `mục ${NAMED} thiếu dòng của lệnh: lùi bản ĐỎ — tên miền đã về bản`,
    ]);
  });
  it("bỏ `kiem-nhanh` khỏi ô «Dòng» của hàng các bước sau vai-dang-nhap → đỏ", () => {
    const row = rowOf(files[HOME]!, "`cach-ly`");
    const copy = broken(files, HOME, row, row.replace(", `kiem-nhanh`", ""));
    expect(everyLine(copy, steps, rollbackLines(lenBan, luiBan))).toEqual([
      `mục ${NAMED} thiếu bước: kiem-nhanh`,
    ]);
  });
  it("mã in thêm một dòng lùi bản → đỏ tới khi bảng kể nó", () => {
    const body = rollBackBody(lenBan);
    const more = lenBan.replace(
      body,
      body.replace(
        'say("đã lùi về bản trước");',
        'say("đã lùi về bản trước");\n  say("lùi bản ĐỎ — dòng thử");',
      ),
    );
    expect(more).not.toEqual(lenBan);
    expect(everyLine(files, steps, rollbackLines(more, luiBan))).toEqual([
      `mục ${NAMED} thiếu dòng của lệnh: lùi bản ĐỎ — dòng thử`,
    ]);
  });
});

describe("E2 · lý do kiểm nhanh", () => {
  it("tiền đề: sức khoẻ chỉ ok khi vai đạt, nên bản không nối được trả ok khác true", () => {
    expect(health).toMatch(/ok:\s*vai === "dat"/);
    expect(notOkReason(kiemNhanh)).toBe("sức khoẻ ok khác true");
  });
  it("nội dung thật: hai hàng nêu đúng lý do máy in", () => {
    expect(rotationReason(files, kiemNhanh)).toEqual([]);
  });
  it("hàng «tên miền đã về bản» nêu lý do khác → đỏ, dù hàng make rollback vẫn đúng", () => {
    const row = rowOf(files[HOME]!, "lùi bản ĐỎ — tên miền đã về bản");
    const copy = broken(files, HOME, row, row.replace("sức khoẻ ok khác true", "vai: chưa rõ"));
    expect(rotationReason(copy, kiemNhanh)).toEqual([
      "hàng «lùi bản ĐỎ — tên miền đã về bản» không nêu lý do kiểm nhanh máy in cho bản không nối được: sức khoẻ ok khác true",
    ]);
  });
  it("mục nêu «vai nối chưa đạt» thay cho lý do thật → đỏ", () => {
    const copy = {
      ...files,
      [HOME]: files[HOME]!.replaceAll("sức khoẻ ok khác true", "vai nối chưa đạt"),
    };
    expect(copy[HOME]).not.toEqual(files[HOME]);
    expect(rotationReason(copy, kiemNhanh)).toEqual([
      `mục ${NAMED} nêu lý do kiểm nhanh mà máy không in khi bản không nối được: vai nối chưa đạt`,
      "hàng «lùi bản ĐỎ — tên miền đã về bản» không nêu lý do kiểm nhanh máy in cho bản không nối được: sức khoẻ ok khác true",
      "hàng «rollback <ENV>: kiem-nhanh-ten-mien ĐỎ» không nêu lý do kiểm nhanh máy in cho bản không nối được: sức khoẻ ok khác true",
    ]);
  });
});

describe("E4 · nội dung thật", () => {
  it("mọi sổ cần dòng chặn đều mở đầu bằng nó", () => {
    expect(banners(files)).toEqual([]);
  });
});

describe("E4 · sổ phải có dòng chặn", () => {
  it("thước xét đúng bốn sổ nói về lùi bản, không xanh vì xét thiếu sổ", () => {
    expect(needBanner(files)).toEqual([
      "README.md",
      "dua-ban-len.md",
      "lui-ban.md",
      "xoay-khoa.md",
    ]);
  });
});

describe("E4 · chiều đỏ", () => {
  const missing = (f: string) => `${f}: thiếu dòng chặn ngay dưới tiêu đề trỏ mục ${NAMED}`;
  it("bỏ dòng chặn của sổ đưa bản lên → đỏ", () => {
    const b = bannerOf(files["dua-ban-len.md"]!);
    expect(banners(broken(files, "dua-ban-len.md", `${b}\n\n`, ""))).toEqual([
      missing("dua-ban-len.md"),
    ]);
  });
  it("dời dòng chặn của sổ lùi bản xuống sau đoạn mở đầu → đỏ", () => {
    const raw = files["lui-ban.md"]!;
    const b = bannerOf(raw);
    const without = raw.replace(`${b}\n\n`, "");
    const at = without.indexOf("\n\n", without.indexOf("\n\n") + 2);
    const moved = `${without.slice(0, at)}\n\n${b}${without.slice(at)}`;
    expect(banners({ ...files, "lui-ban.md": moved })).toEqual([missing("lui-ban.md")]);
  });
  it("dòng chặn của mục lục mất liên kết sổ xoay khoá → đỏ", () => {
    const b = bannerOf(files["README.md"]!);
    const copy = broken(
      files,
      "README.md",
      b,
      b.replace("[xoay-khoa.md](xoay-khoa.md)", "sổ xoay khoá"),
    );
    expect(banners(copy)).toEqual([missing("README.md")]);
  });
  it("dòng chặn của sổ đưa bản lên mất chữ «thắng» → đỏ", () => {
    const b = bannerOf(files["dua-ban-len.md"]!);
    const copy = broken(files, "dua-ban-len.md", b, b.replace("thắng", "bổ sung"));
    expect(banners(copy)).toEqual([missing("dua-ban-len.md")]);
  });
  it("một sổ mới có câu lùi bản mà không dòng chặn → đỏ", () => {
    expect(banners({ ...files, "moi.md": "# Mới\n\nLỗi thì lùi bản ngay.\n" })).toEqual([
      missing("moi.md"),
    ]);
  });
});

describe("E5 · nội dung thật", () => {
  it("ngoài mục không đoạn nào kể lại lý do", () => {
    expect(noRestating(files)).toEqual([]);
  });
  it("đối chứng dương: lý do có nằm trong mục", () => {
    expect(
      allUnits(files)
        .filter(inSection)
        .some((u) => REASON.test(u.text)),
    ).toBe(true);
  });
});

describe("E5 · chiều đỏ", () => {
  it("kể lại lý do trong «Khi nào dùng» của sổ lùi bản → đỏ", () => {
    const copy = broken(
      files,
      "lui-ban.md",
      "## Khi nào dùng\n\n",
      "## Khi nào dùng\n\n- Lùi không cứu được: bản cũ giữ mật khẩu cũ.\n",
    );
    expect(noRestating(copy)).toEqual([
      `lui-ban.md: đoạn kể lại lý do ngoài mục: "- Lùi không cứu được: bản cũ giữ mật khẩu cũ."`,
    ]);
  });
});
