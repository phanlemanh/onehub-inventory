// Row 1p (dang-nhap-chon-tu-reui), AC-2 and AC-4: re-laying the sign-in screen from ReUI block auth-15 must not change
// a word of the sign-in tests of rows 8 and 1m, nor a sentence the screen already showed. Both tables are written from
// commit 42a231f, before row 1p touched the screen. A later row that changes these tests or sentences on purpose
// updates the table in the same change, and says why in its record.
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { LOGIN_COPY } from "../src/app/login/copy";

const ROOT = join(__dirname, "..");

/** sha256 of each sign-in test file at 42a231f. */
const SIGN_IN_TESTS: Record<string, string> = {
  "tests/e2e-db/login.spec.ts": "b5fe8c6aebe792f8ea30aba238876f44bd1f1424b38634e2aa2fde4b539724f4",
  "tests/e2e-db/va-dang-nhap.spec.ts":
    "46e75fbd081837f04f8af582e8a37d240f73051952cb9740d5169b62b21b77a9",
  "tests/e2e-db/dang-nhap-vai.ts":
    "bf8769be3baee62bdcc3131af198b97f6009cfc7dd242d5062d1e34b6f043849",
  "tests/e2e/account.spec.ts": "219cd58cd0a1399bb3c844860d6f0dd085aee6dbe2a002b1d69a14558178b8a8",
};
const SIGN_IN_TEST_COUNT = 4;

/** Every sentence of the sign-in screen at 42a231f; functions are read with the sample values below. */
const EMAIL = "nhan-vien@example.test";
const SIGN_OUT = "Đăng xuất";
const COPY_AT_42A231F: Record<string, string> = {
  emailLabel: "Email",
  emailHint: "Email bạn dùng ở sàn. Mã sẽ gửi tới hộp thư này.",
  sendCode: "Gửi mã",
  sending: "Đang gửi",
  codeSent: `Nếu ${EMAIL} có tài khoản, mã đã được gửi tới hộp thư này. Mã dùng được 5 phút.`,
  codeHint: "Gõ hoặc dán 6 chữ số trong thư.",
  signingIn: "Đang vào",
  resend: "Gửi mã mới",
  otherEmail: "Dùng email khác",
  codeInvalid: "Mã không đúng hoặc đã hết hạn. Gõ lại, hoặc bấm «Gửi mã mới».",
  rateLimited: "Đã xin mã quá nhiều lần. Thử lại sau 15 phút.",
  noCompany: "Tài khoản chưa thuộc sàn nào. Nhờ quản trị sàn mời bạn.",
  serverError:
    "Chưa gửi được yêu cầu. Máy chủ đang gặp lỗi, phần bạn đã gõ vẫn còn. Bạn bấm «Thử lại» sau ít phút.",
  retry: "Thử lại",
  chooseCompany: "Bạn thuộc nhiều sàn. Chọn sàn để làm việc:",
  account: "Tài khoản",
  switchCompany: "Đổi sàn",
  currentCompany: "Đang làm ở",
  noCurrentCompany: "Chưa chọn sàn",
  signOutFailed: `Chưa đăng xuất được. Bạn vẫn đang đăng nhập trên máy này — kiểm tra mạng rồi bấm «${SIGN_OUT}» lại.`,
  noCompanySession:
    "Tài khoản của bạn không còn thuộc sàn nào. Nhờ quản trị sàn mời lại, hoặc đăng xuất để dùng email khác.",
};
const COPY_KEY_COUNT = 21;

function read(key: string): string | undefined {
  const value: unknown = (LOGIN_COPY as Record<string, unknown>)[key];
  if (typeof value === "string") return value;
  if (typeof value !== "function") return undefined;
  if (key === "codeSent") return (value as (e: string) => string)(EMAIL);
  if (key === "signOutFailed") return (value as (s: string) => string)(SIGN_OUT);
  return undefined;
}

describe("giu-loi-bai-dang-nhap", () => {
  it("the table covers every sign-in test file", () => {
    expect(Object.keys(SIGN_IN_TESTS)).toHaveLength(SIGN_IN_TEST_COUNT);
  });

  for (const [file, hash] of Object.entries(SIGN_IN_TESTS)) {
    it(file, () => {
      const now = createHash("sha256")
        .update(readFileSync(join(ROOT, file)))
        .digest("hex");
      expect(now, `giu-loi-bai-dang-nhap: ${file}`).toBe(hash);
    });
  }
});

describe("giu-cau-copy", () => {
  it("the table covers every sentence of 42a231f", () => {
    expect(Object.keys(COPY_AT_42A231F)).toHaveLength(COPY_KEY_COUNT);
  });

  for (const [key, sentence] of Object.entries(COPY_AT_42A231F)) {
    it(key, () => {
      expect(read(key), `giu-cau-copy: ${key}`).toBe(sentence);
    });
  }
});
