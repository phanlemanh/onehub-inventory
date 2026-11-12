-- Break test, row 7a (Ngoài-1), scratch database only: a new check on agreements that the ontology does not name.
-- tests/db/cach-ly.db.test.ts must name `ràng buộc không có luật trong mô hình: agreements_them_mau`.
alter table agreements add constraint agreements_them_mau check (counterparty <> '');
