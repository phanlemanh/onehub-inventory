-- Break of row 11 (nhap-excel): the delete rule on listings widened to every listing of the company when undoImport
-- allows it — no import, no version check. The isolation suite must go red on the restrictive-policy allow-list
-- ("listings_delete_by_permission"). Run by tests/db/nhap-excel.db.test.ts on its own scratch database, never on real data.
drop policy listings_delete_by_permission on listings;
create policy listings_delete_by_permission on listings as restrictive for delete
  using (app.allowed('undoImport') = 'company');
