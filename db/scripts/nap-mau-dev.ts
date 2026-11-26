// Fills a developer's own database on this lane's Postgres with the sample inventory, for clicking through the app
// locally: the company «[Sàn thử local]», the person dev@example.test with all four roles there, and every sample
// listing (loadDevSample, tests/db/can-mau.ts). The database must already be migrated. Connects as the owner; refuses
// when the company already has listings. Test data only — never point it at a database that holds real data.
//
//   make db-sample DB=onehub_dev            (DB_PORT, default 5560)
//   DB_PORT=5560 npx tsx db/scripts/nap-mau-dev.ts onehub_dev
import pg from "pg";

import { loadDevSample } from "../../tests/db/can-mau";

const COMPANY = "[Sàn thử local]";
const EMAIL = "dev@example.test";
const PERSON = "[Tên] Dev local";

async function main() {
  const db = process.argv[2];
  if (!db || !/^[a-z0-9_]+$/.test(db))
    throw new Error("cách dùng: nap-mau-dev.ts <cơ sở dữ liệu> (chữ thường, số, _)");
  const port = process.env["DB_PORT"] ?? "5560";
  const owner = new pg.Client({
    connectionString: `postgres://postgres:local-only@127.0.0.1:${port}/${db}`,
  });
  await owner.connect();
  try {
    const { count } = await loadDevSample(owner, {
      companyName: COMPANY,
      email: EMAIL,
      personName: PERSON,
    });
    console.log(`đã nạp ${count} tin mẫu vào ${COMPANY} (${db})`);
    console.log(`đăng nhập: ${EMAIL} — mã đăng nhập nằm ở LOGIN_CODE_OUTBOX`);
  } finally {
    await owner.end();
  }
}

main().catch((err) => {
  console.error("nap-mau-dev:", err instanceof Error ? err.message : err);
  process.exit(1);
});
