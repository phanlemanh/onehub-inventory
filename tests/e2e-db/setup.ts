// Fresh scratch database for the browser flow; each test adds its own people so rate limits never meet. The
// register-driven suite (row 1r) gets one test person, signed in once by tests/e2e-db/phien.setup.ts.
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

import { DB_NAME, OUTBOX, SESSION_FILE, TEST_PERSON } from "../../playwright.db.config";
import { scratchDb } from "../db/helpers";
import { claimRunFolder } from "./don-dung-tam";

export default async function setup(): Promise<void> {
  // This run's build folder: owned, dead runs swept, deleted at exit (row 1s, AC-8).
  claimRunFolder("onehub-e2e-db", process.env["E2E_DB_RUN"] ?? `${process.pid}`);
  const db = await scratchDb(DB_NAME.replace(/^dang_nhap_/, ""));
  // The register-driven suite's test person (row 1r): one test company, all four roles, so every screen opens in its
  // normal state and none in «not allowed».
  const company = (
    await db.owner.query<{ id: string }>(
      "insert into companies (name) values ('[Sàn thử phiên]') returning id",
    )
  ).rows[0]!.id;
  const person = (
    await db.owner.query<{ id: string }>(
      "insert into identity.users (email, name) values ($1, '[Tên] Phiên thử') returning id",
      [TEST_PERSON],
    )
  ).rows[0]!.id;
  await db.owner.query(
    "insert into company_members (company_id, user_id, name, roles) values ($1, $2, '[Tên] Phiên thử', $3)",
    [company, person, ["ListAgent", "BuyerAgent", "TeamLead", "CompanyAdmin"]],
  );
  // A few words of the company's own layer (row 7e), so the region cases of «Tuỳ chỉnh của sàn» have rows to read:
  // one label as long as a label may be. Test data only; no other test reads this company's layer.
  for (const [concept, words] of [
    ["LastConfirmedAt", "Lần gần nhất đầu chủ gọi lại chủ nhà xác"],
    ["BedroomsTotal", "Số phòng ngủ"],
    ["LivingArea", "Diện tích thông thuỷ"],
  ])
    await db.owner.query(
      "insert into company_labels (company_id, concept, label) values ($1, $2, $3)",
      [company, concept, words],
    );
  // Three pending units, the part the region cases open (`vao_vung` in design/screens.yaml): two short codes with
  // digits for «lọc đầu cột», one as long as a code may be (80) for «chữ dài». No unit column is added to Bảng hàng.
  for (const code of [
    "A-101",
    "A-102",
    "Căn góc toà Ngọc Lan tầng hai mươi, hướng đông nam, nhìn ra hồ điều hoà — B-2025",
  ])
    await db.owner.query(
      "insert into company_pending_units (company_id, raw_code) values ($1, $2)",
      [company, code],
    );
  await db.owner.end();
  rmSync(SESSION_FILE, { force: true });
  mkdirSync(dirname(OUTBOX), { recursive: true });
  writeFileSync(OUTBOX, "");
}
