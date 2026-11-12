-- Break test, row 7a (Ngoài-1), scratch database only: the agreements table accepts a kind the ontology does not
-- have. tests/db/cach-ly.db.test.ts must name `bảng nhận, mô hình không có: loai_thua`.
alter table agreements drop constraint agreements_kind_check;
alter table agreements add constraint agreements_kind_check check (kind in (
  'catalog_source', 'listing_channel', 'lead_source', 'spreadsheet', 'company_partnership', 'company_api',
  'ai_processing', 'catalog_confirmation', 'loai_thua'));
