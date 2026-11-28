// Row 3h (tin-rao-giu-gia-tri-rieng, AC-7): reads the unit attributes that imports made before the row kept as written,
// and gives each listing of those imports the file's values as own values from a file, where it has none yet
// (rereadImportValues of the imports module). Run once after the release; a second run changes nothing.
//
// Two connections, never printed: the database owner only lists which imports are not read yet; every read and write of
// an import runs through withCompany on the app's login role, as the person who imported (SP-1). On a lane: DB=<database> with DB_PORT (the login role signs in with the lane's
// password after `make db-login`). On a hosted database: MIGRATE_DATABASE_URL and DATABASE_URL from the owner's shell.
//
//   make tin-rao-doc-lai DB=onehub_dev        (DB_PORT, default 5560)
//   MIGRATE_DATABASE_URL=… DATABASE_URL=… make tin-rao-doc-lai
import pg from "pg";

import { asImporter, rereadImportValues } from "../../src/modules/imports/reread";

async function main() {
  const db = process.argv[2];
  const hostedOwner = process.env["MIGRATE_DATABASE_URL"];
  const hostedLogin = process.env["DATABASE_URL"];
  if (hostedOwner ? !hostedLogin : !db || !/^[a-z0-9_]+$/.test(db))
    throw new Error(
      "cách dùng: doc-lai-tep.ts <cơ sở dữ liệu> (chữ thường, số, _), hoặc MIGRATE_DATABASE_URL cùng DATABASE_URL",
    );
  const port = process.env["DB_PORT"] ?? "5560";
  const lane = (who: string) => `postgres://${who}:local-only@127.0.0.1:${port}/${db}`;
  const owner = new pg.Client({ connectionString: hostedOwner ?? lane("postgres") });
  const login = new pg.Pool({
    connectionString: hostedOwner ? hostedLogin : lane("quy_hang_login"),
    max: 2,
  });
  await owner.connect();
  try {
    const s = await rereadImportValues(owner, asImporter(login));
    console.log(
      `đọc lại ${s.imports} lần nhập: ${s.listingsSet} tin nhận giá trị từ tệp, ${s.typedKept} tin sàn đã gõ giữ nguyên, ` +
        `${s.lockedKept} tin đã khoá giữ nguyên; ${s.cellsRead} ô đọc được, ${s.cellsUnread} ô giữ nguyên văn` +
        (s.refused ? `; ${s.refused} lần nhập để nguyên vì người nhập không còn quyền xem` : ""),
    );
  } finally {
    await owner.end();
    await login.end();
  }
}

main().catch((err) => {
  console.error("doc-lai-tep:", err instanceof Error ? err.message : err);
  process.exit(1);
});
