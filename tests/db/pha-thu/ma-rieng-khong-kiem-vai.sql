-- Break (row 7d): adding a company code no longer asks the permission table, so a buyer agent can add one.
-- tests/db/danh-muc.db.test.ts must fail with `ma-rieng-theo-vai: Đầu khách thêm được mã riêng`.
drop policy company_catalog_aliases_insert_by_permission on company_catalog_aliases;
