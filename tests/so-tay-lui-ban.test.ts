// Row lui-ban-luc-xoay-mat-khau (E2, E4, E5): what to do about a rollback after the login role's password is rotated is
// written once, in the section ROTATION_SECTION of docs/van-hanh/xoay-khoa.md, and every other runbook paragraph about
// rolling back points to it instead of restating it. Four rules, each a pure function that returns its findings:
//   oneSection   — exactly one heading `## <ROTATION_SECTION>` in docs/van-hanh/, and it is in xoay-khoa.md
//   everyLine    — the section names every step of STEPS and every rollback line the code can print, read from the
//                  code (rollBack in tools/deploy/len-ban.mjs, the domain check line of tools/deploy/lui-ban.mjs)
//   pointsThere  — outside the section, every paragraph about rolling back, and (outside xoay-khoa.md) every paragraph
//                  that mentions rotating the login role's password, carries the pointer; lui-ban.md, a page about
//                  rolling back, carries it at its entry and on every way to try another deployment
//   noRestating  — outside the section no paragraph gives the reason («mật khẩu cũ»)
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

export const ROTATION_SECTION = "Lùi bản sau khi xoay mật khẩu vai đăng nhập";
const HOME = "xoay-khoa.md";
const ROLLBACK_PAGE = "lui-ban.md";
const NAMED = `«${ROTATION_SECTION}»`;

const ABOUT_ROLLBACK = /lùi|rollback|lui-ban\.md/i;
const ROTATES_LOGIN = (text: string) => /xoay/i.test(text) && /mật khẩu vai đăng nhập/i.test(text);
const OTHER_DEPLOYMENT =
  /một bản cũ hơn|trang Vercel|Instant Rollback|kiem-nhanh-ten-mien ĐỎ|chọn (một )?bản/;
const RUNNING_FINE = /bản đang chạy (không bị|yên)/i;
const REASON = /mật khẩu cũ/i;

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

const inSection = (u: Unit) => u.file === HOME && u.h2 === ROTATION_SECTION;
const head = (u: Unit) => u.text.slice(0, 60);
const hasPointer = (u: Unit) =>
  u.text.includes(NAMED) && (u.file === HOME || u.text.includes(`](${HOME})`));

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

export function everyLine(files: Files, steps: string[], lines: string[]): string[] {
  // Only the table rows of the section count: a line named in a paragraph of the section has no row of its own.
  const section = allUnits(files)
    .filter((u) => inSection(u) && u.text.startsWith("|"))
    .map((u) => u.text)
    .join("\n");
  const out: string[] = [];
  // A step counts when a backtick span starts with its exact name: `kiem-nhanh` or `kiem-nhanh ĐỎ`, never the
  // longer `kiem-nhanh-ten-mien`.
  for (const s of steps)
    if (!new RegExp(`\`${s}[\`\\s]`).test(section)) out.push(`mục ${NAMED} thiếu bước: ${s}`);
  for (const l of lines)
    if (!section.includes(l.normalize("NFC"))) out.push(`mục ${NAMED} thiếu dòng của lệnh: ${l}`);
  return out;
}

type Why = "lùi bản" | "xoay" | "yên" | "mở đầu" | "khi nào dùng" | "bước";

/**
 * The paragraphs pointsThere holds to the pointer rule, each with the rule that applies. lui-ban.md is a page about
 * rolling back: its opening, «Khi nào dùng» and every step of «Các bước» that mentions rolling back must each carry
 * the pointer somewhere (a group), and every other paragraph of it that sends the operator to another deployment
 * carries it itself. In every file, a paragraph that says the running deployment is fine carries it too.
 */
export function checkedUnits(files: Files): { unit: Unit; why: Why }[] {
  const out: { unit: Unit; why: Why }[] = [];
  for (const u of allUnits(files)) {
    if (inSection(u)) continue;
    if (u.file === ROLLBACK_PAGE) {
      if (!u.h2) out.push({ unit: u, why: "mở đầu" });
      else if (u.h2 === "Khi nào dùng") out.push({ unit: u, why: "khi nào dùng" });
      else if (u.h2 === "Các bước" && ABOUT_ROLLBACK.test(u.text))
        out.push({ unit: u, why: "bước" });
      else if (OTHER_DEPLOYMENT.test(u.text)) out.push({ unit: u, why: "lùi bản" });
      else if (RUNNING_FINE.test(u.text)) out.push({ unit: u, why: "yên" });
      else if (ROTATES_LOGIN(u.text)) out.push({ unit: u, why: "xoay" });
      continue;
    }
    if (ABOUT_ROLLBACK.test(u.text)) out.push({ unit: u, why: "lùi bản" });
    else if (RUNNING_FINE.test(u.text)) out.push({ unit: u, why: "yên" });
    else if (u.file !== HOME && ROTATES_LOGIN(u.text)) out.push({ unit: u, why: "xoay" });
  }
  return out;
}

const KIND: Record<"lùi bản" | "xoay" | "yên", string> = {
  "lùi bản": "nói về lùi bản",
  xoay: "nhắc xoay mật khẩu vai đăng nhập",
  yên: "nói bản đang chạy yên",
};

export function pointsThere(files: Files): string[] {
  const out: string[] = [];
  const checked = checkedUnits(files);
  for (const why of ["mở đầu", "khi nào dùng"] as const) {
    const group = checked.filter((c) => c.why === why).map((c) => c.unit);
    if (group.length && !group.some(hasPointer)) {
      out.push(
        `${ROLLBACK_PAGE}: ${why === "mở đầu" ? "đoạn mở đầu" : "«Khi nào dùng»"} không trỏ mục ${NAMED}`,
      );
    }
  }
  const steps = [...new Set(checked.filter((c) => c.why === "bước").map((c) => c.unit.h3))];
  for (const h3 of steps) {
    const group = checked.filter((c) => c.why === "bước" && c.unit.h3 === h3).map((c) => c.unit);
    if (!group.some(hasPointer))
      out.push(`${ROLLBACK_PAGE}: bước «${h3}» nói về lùi bản mà không trỏ mục ${NAMED}`);
  }
  for (const { unit, why } of checked) {
    if (why === "mở đầu" || why === "khi nào dùng" || why === "bước" || hasPointer(unit)) continue;
    out.push(`${unit.file}: đoạn ${KIND[why]} không trỏ mục ${NAMED}: "${head(unit)}"`);
  }
  return out;
}

/** The fixed head of the reason the quick check gives when health answers `ok` other than true. */
export function notOkReason(kiemNhanh: string): string {
  const m = /body\.ok !== true\)[^`]*`([^`]*)`/.exec(kiemNhanh);
  return m ? m[1]!.split(/\$\{|\(/)[0]!.trim() : "";
}

/**
 * The reason the section names for a deployment that cannot connect is the one the quick check really prints.
 * health.ts sets `ok` to `vai === "dat"`, so a deployment that cannot connect answers `ok: false` and the check
 * stops at its `ok` line; its later `vai nối chưa đạt` line is never reached against the real server.
 */
export function rotationReason(files: Files, kiemNhanh: string): string[] {
  const section = allUnits(files)
    .filter(inSection)
    .map((u) => u.text)
    .join("\n");
  const out: string[] = [];
  if (section.includes("vai nối chưa đạt"))
    out.push(
      `mục ${NAMED} nêu lý do kiểm nhanh mà máy không in khi bản không nối được: vai nối chưa đạt`,
    );
  const reason = notOkReason(kiemNhanh);
  if (!reason || !section.includes(reason))
    out.push(
      `mục ${NAMED} thiếu lý do kiểm nhanh khi bản không nối được: ${reason || "(không rút được từ mã)"}`,
    );
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

const files = readRunbooks();
const lenBan = readFileSync(LEN_BAN, "utf8");
const kiemNhanh = readFileSync(join(ROOT, "tools", "deploy", "kiem-nhanh.mjs"), "utf8");
const health = readFileSync(join(ROOT, "src", "modules", "identity", "health.ts"), "utf8");
const luiBan = readFileSync(LUI_BAN, "utf8");
let steps: string[] = [];

beforeAll(async () => {
  const mod = (await import(pathToFileURL(LEN_BAN).href)) as { STEPS: Record<string, string[]> };
  steps = [...new Set(Object.values(mod.STEPS).flat())];
});

/** xoay-khoa.md cut at the section: the text up to and including its heading, the section body, and what follows. */
function sectionSplit(raw: string): [string, string] {
  const at = raw.indexOf(`## ${ROTATION_SECTION}`);
  expect(at).toBeGreaterThanOrEqual(0);
  const end = raw.indexOf("\n## ", at + 1);
  return [raw.slice(0, at), raw.slice(at, end < 0 ? undefined : end)];
}
function rest(raw: string): string {
  const at = raw.indexOf(`## ${ROTATION_SECTION}`);
  const end = raw.indexOf("\n## ", at + 1);
  return end < 0 ? "" : raw.slice(end);
}

/** `files` with the section's name taken out of the stretch of `file` from `from` to the next `##` or `###` heading. */
function unpointed(files: Files, file: string, from: string): Files {
  const raw = files[file]!;
  const at = raw.indexOf(from);
  expect(at, `${file} có đoạn ${from}`).toBeGreaterThanOrEqual(0);
  // The stretch ends at the next heading of level two or three, so one step is broken, not the steps after it.
  const ends = ["\n## ", "\n### "].map((h) => raw.indexOf(h, at + 1)).filter((i) => i >= 0);
  const block = raw.slice(at, ends.length ? Math.min(...ends) : undefined);
  const name = new RegExp(NAMED.replace(/ /g, "\\s+"), "g");
  const cut = block.replace(name, "«mục khác»");
  expect(cut, `đoạn ${from} của ${file} có câu trỏ để bỏ`).not.toEqual(block);
  return { ...files, [file]: raw.replace(block, cut) };
}

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
  it("nội dung thật: mục kể mọi bước và mọi dòng lùi bản", () => {
    expect(everyLine(files, steps, rollbackLines(lenBan, luiBan))).toEqual([]);
  });
  it("bỏ một dòng khỏi mục → đỏ", () => {
    const line = "lùi bản DỪNG — không đọc được mã bản mới";
    const copy = { ...files, [HOME]: files[HOME]!.replaceAll(line, "lùi bản DỪNG — (bỏ)") };
    expect(copy[HOME]).not.toEqual(files[HOME]);
    expect(everyLine(copy, steps, rollbackLines(lenBan, luiBan))).toEqual([
      `mục ${NAMED} thiếu dòng của lệnh: ${line}`,
    ]);
  });
  it("bảng bỏ bước kiem-nhanh mà giữ kiem-nhanh-ten-mien → đỏ", () => {
    const [before, after] = sectionSplit(files[HOME]!);
    const copy = {
      ...files,
      [HOME]: before + after.replaceAll("`kiem-nhanh`", "kiểm nhanh") + rest(files[HOME]!),
    };
    expect(copy[HOME]).not.toEqual(files[HOME]);
    expect(copy[HOME]!.includes("`kiem-nhanh-ten-mien ĐỎ`")).toBe(true);
    expect(everyLine(copy, steps, rollbackLines(lenBan, luiBan))).toEqual([
      `mục ${NAMED} thiếu bước: kiem-nhanh`,
    ]);
  });
  it("một dòng chỉ còn ở đoạn văn của mục, không có hàng bảng → đỏ", () => {
    const [before, after] = sectionSplit(files[HOME]!);
    const line = "đã lùi về bản trước";
    const rows = after
      .split("\n")
      .map((l) => (l.startsWith("|") ? l.replaceAll(line, "(bỏ)") : l))
      .join("\n");
    const copy = {
      ...files,
      [HOME]: `${before}${rows}\nLệnh có thể in \`${line}\`.\n${rest(files[HOME]!)}`,
    };
    expect(everyLine(copy, steps, rollbackLines(lenBan, luiBan))).toEqual([
      `mục ${NAMED} thiếu dòng của lệnh: ${line}`,
    ]);
  });
  it("mã in thêm một dòng lùi bản → đỏ tới khi mục kể nó", () => {
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
  it("nội dung thật: mục nêu đúng lý do máy in", () => {
    expect(rotationReason(files, kiemNhanh)).toEqual([]);
  });
  it("mục nêu «vai nối chưa đạt» thay cho lý do thật → đỏ", () => {
    const copy = {
      ...files,
      [HOME]: files[HOME]!.replaceAll("sức khoẻ ok khác true", "vai nối chưa đạt"),
    };
    expect(copy[HOME]).not.toEqual(files[HOME]);
    expect(rotationReason(copy, kiemNhanh)).toEqual([
      `mục ${NAMED} nêu lý do kiểm nhanh mà máy không in khi bản không nối được: vai nối chưa đạt`,
      `mục ${NAMED} thiếu lý do kiểm nhanh khi bản không nối được: sức khoẻ ok khác true`,
    ]);
  });
});

describe("E4 · nội dung thật", () => {
  it("mọi đoạn về lùi bản ngoài mục trỏ tới mục", () => {
    expect(pointsThere(files)).toEqual([]);
  });
});

describe("E4 · phủ đủ chỗ", () => {
  it("thước xét hai mươi ba chỗ mà hàng trước để sót hay vừa sửa", () => {
    const checked = checkedUnits(files).map((c) => c.unit);
    const places: [string, string, (u: Unit) => boolean][] = [
      [
        "dua-ban-len.md",
        "bước 3 Đỏ thì",
        (u) => u.h3.startsWith("3.") && u.text.startsWith("- **Đỏ thì:**"),
      ],
      [
        "dua-ban-len.md",
        "bước 5 Đỏ thì",
        (u) => u.h3.startsWith("5.") && u.text.startsWith("- **Đỏ thì:**"),
      ],
      [
        "dua-ban-len.md",
        "bước 6 Đỏ thì",
        (u) => u.h3.startsWith("6.") && u.text.startsWith("- **Đỏ thì:**"),
      ],
      [
        "dua-ban-len.md",
        "đoạn mở đầu «Đỏ thì làm gì»",
        (u) => u.h2 === "Đỏ thì làm gì" && !u.text.startsWith("|"),
      ],
      ["dua-ban-len.md", "hàng gan-ten-mien", (u) => u.text.startsWith("| `gan-ten-mien`")],
      [ROLLBACK_PAGE, "đoạn mở đầu", (u) => u.h2 === ""],
      [ROLLBACK_PAGE, "«Khi nào dùng»", (u) => u.h2 === "Khi nào dùng"],
      [
        ROLLBACK_PAGE,
        "bước 4 Đỏ thì",
        (u) => u.h3.startsWith("4.") && u.text.startsWith("- **Đỏ thì:**"),
      ],
      [
        ROLLBACK_PAGE,
        "bước 5 Đỏ thì",
        (u) => u.h3.startsWith("5.") && u.text.startsWith("- **Đỏ thì:**"),
      ],
      [
        ROLLBACK_PAGE,
        "hàng kiem-nhanh-ten-mien ĐỎ",
        (u) => u.text.includes("kiem-nhanh-ten-mien ĐỎ") && u.text.startsWith("|"),
      ],
      [
        ROLLBACK_PAGE,
        "hàng Instant Rollback",
        (u) => u.text.startsWith("| Lệnh không chạy được ở máy nào"),
      ],
      [HOME, "bước 3 Đỏ thì", (u) => u.h3.startsWith("3.") && u.text.startsWith("- **Đỏ thì:**")],
      [HOME, "«Đỏ thì làm gì» dòng hai", (u) => u.h2 === "Đỏ thì làm gì" && /lùi/i.test(u.text)],
      ["README.md", "hàng make rollback", (u) => u.text.startsWith("| `make rollback")],
      [
        "README.md",
        "việc 13 Đỏ thì",
        (u) => /lui-ban\.md/.test(u.text) && u.text.startsWith("- **Đỏ thì:**"),
      ],
      [
        ROLLBACK_PAGE,
        "bước 1 Đỏ thì",
        (u) => u.h3.startsWith("1.") && u.text.startsWith("- **Đỏ thì:**"),
      ],
      [
        ROLLBACK_PAGE,
        "bước 3 Đạt khi",
        (u) => u.h3.startsWith("3.") && u.text.startsWith("- **Đạt khi:**"),
      ],
      [
        ROLLBACK_PAGE,
        "bước 6 Đỏ thì",
        (u) => u.h3.startsWith("6.") && u.text.startsWith("- **Đỏ thì:**"),
      ],
      [
        ROLLBACK_PAGE,
        "hàng DỪNG chưa nêu bản",
        (u) => u.text.startsWith("| `rollback <ENV>: DỪNG — chưa nêu bản"),
      ],
      [
        ROLLBACK_PAGE,
        "hàng DỪNG tên miền đã ở bản",
        (u) => u.text.startsWith("| `rollback <ENV>: DỪNG — tên miền đã ở bản"),
      ],
      [
        "dua-ban-len.md",
        "hàng vai-dang-nhap thứ nhất",
        (u) => u.text.startsWith("| `vai-dang-nhap`") && u.text.includes("does not exist"),
      ],
      [
        "dua-ban-len.md",
        "hàng vai-dang-nhap thứ hai",
        (u) => u.text.startsWith("| `vai-dang-nhap`") && u.text.includes("(dòng khác)"),
      ],
      [HOME, "bước 4 Đỏ thì", (u) => u.h3.startsWith("4.") && u.text.startsWith("- **Đỏ thì:**")],
    ];
    const missing = places
      .filter(([f, , h]) => !checked.some((u) => u.file === f && h(u)))
      .map(([f, l]) => `${f} ${l}`);
    expect(missing).toEqual([]);
  });
});

describe("E4 · chiều đỏ", () => {
  it("bỏ câu trỏ ở «Đỏ thì» bước 6 của sổ đưa bản lên → đỏ", () => {
    const copy = unpointed(files, "dua-ban-len.md", "### 6.");
    const step6 = units("dua-ban-len.md", copy["dua-ban-len.md"]!).find(
      (u) => u.h3.startsWith("6.") && u.text.startsWith("- **Đỏ thì:**"),
    )!;
    expect(pointsThere(copy)).toEqual([
      `dua-ban-len.md: đoạn nói về lùi bản không trỏ mục ${NAMED}: "${step6.text.slice(0, 60)}"`,
    ]);
  });
  it("bỏ câu trỏ ở đoạn mở đầu sổ lùi bản → đỏ", () => {
    const copy = unpointed(files, ROLLBACK_PAGE, "# Lùi bản");
    expect(pointsThere(copy)).toEqual([`${ROLLBACK_PAGE}: đoạn mở đầu không trỏ mục ${NAMED}`]);
  });
  it("bỏ câu trỏ ở hàng Instant Rollback của sổ lùi bản → đỏ", () => {
    const copy = unpointed(files, ROLLBACK_PAGE, "| Lệnh không chạy được ở máy nào");
    const row = units(ROLLBACK_PAGE, copy[ROLLBACK_PAGE]!).find((u) =>
      u.text.startsWith("| Lệnh không chạy được"),
    )!;
    expect(pointsThere(copy)).toEqual([
      `${ROLLBACK_PAGE}: đoạn nói về lùi bản không trỏ mục ${NAMED}: "${row.text.slice(0, 60)}"`,
    ]);
  });
  it("bỏ câu trỏ ở bước 3 của sổ lùi bản → đỏ ở mức bước", () => {
    const copy = unpointed(files, ROLLBACK_PAGE, "### 3.");
    const h3 = units(ROLLBACK_PAGE, copy[ROLLBACK_PAGE]!).find((u) => u.h3.startsWith("3."))!.h3;
    expect(pointsThere(copy)).toEqual([
      `${ROLLBACK_PAGE}: bước «${h3}» nói về lùi bản mà không trỏ mục ${NAMED}`,
    ]);
  });
  it("bỏ câu trỏ ở hàng vai-dang-nhap của sổ đưa bản lên → đỏ vì nói bản đang chạy yên", () => {
    const raw = files["dua-ban-len.md"]!;
    const line = raw
      .split("\n")
      .find((l) => l.startsWith("| `vai-dang-nhap`") && l.includes("does not exist"))!;
    const name = new RegExp(NAMED.replace(/ /g, "\\s+"), "g");
    const cut = line.replace(name, "«mục khác»");
    expect(cut).not.toEqual(line);
    const copy = { ...files, "dua-ban-len.md": raw.replace(line, cut) };
    const row = units("dua-ban-len.md", copy["dua-ban-len.md"]!).find((u) =>
      u.text.includes("does not exist"),
    )!;
    expect(pointsThere(copy)).toEqual([
      `dua-ban-len.md: đoạn nói bản đang chạy yên không trỏ mục ${NAMED}: "${row.text.slice(0, 60)}"`,
    ]);
  });
  it("một tệp sổ tay mới có câu lùi bản không trỏ → đỏ", () => {
    expect(pointsThere({ ...files, "moi.md": "# Mới\n\nLỗi thì lùi bản ngay.\n" })).toEqual([
      `moi.md: đoạn nói về lùi bản không trỏ mục ${NAMED}: "Lỗi thì lùi bản ngay."`,
    ]);
  });
});

describe("E5 · nội dung thật", () => {
  it("ngoài mục không đoạn nào kể lại lý do, và câu nhắc xoay đều trỏ", () => {
    expect(noRestating(files)).toEqual([]);
    expect(pointsThere(files).filter((m) => m.includes("nhắc xoay"))).toEqual([]);
  });
  it("đối chứng dương: lý do có nằm trong mục", () => {
    const section = allUnits(files).filter(inSection);
    expect(section.some((u) => REASON.test(u.text))).toBe(true);
  });
});

describe("E5 · chiều đỏ", () => {
  it("kể lại lý do trong «Khi nào dùng» của sổ lùi bản → đỏ", () => {
    const copy = broken(
      files,
      ROLLBACK_PAGE,
      "## Khi nào dùng\n\n",
      "## Khi nào dùng\n\n- Lùi không cứu được: bản cũ giữ mật khẩu cũ.\n",
    );
    expect(noRestating(copy)).toEqual([
      `${ROLLBACK_PAGE}: đoạn kể lại lý do ngoài mục: "- Lùi không cứu được: bản cũ giữ mật khẩu cũ."`,
    ]);
  });
  it("nhắc xoay mật khẩu vai đăng nhập ở sổ đưa bản lên mà không trỏ → đỏ", () => {
    const copy = broken(
      files,
      "dua-ban-len.md",
      "### 5. Theo dõi bản thật\n\n",
      "### 5. Theo dõi bản thật\n\nVừa xoay mật khẩu vai đăng nhập thì chờ.\n\n",
    );
    expect(pointsThere(copy)).toEqual([
      `dua-ban-len.md: đoạn nhắc xoay mật khẩu vai đăng nhập không trỏ mục ${NAMED}: "Vừa xoay mật khẩu vai đăng nhập thì chờ."`,
    ]);
  });
});
