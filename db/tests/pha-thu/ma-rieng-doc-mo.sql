-- Break test (row 7d), scratch database only: the company table of own codes gets a read policy open to every
-- company, copied by mistake from the shared catalog next to it. The isolation suite must fail with
-- `HỎNG luat-doc-ghi-theo-san: company_catalog_aliases — luật ma_rieng_doc_mo không đúng dạng cho phép: true`.
create policy ma_rieng_doc_mo on company_catalog_aliases for select using (true);
