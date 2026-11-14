-- Break test (row 7e), scratch database only: the custom field table stops forcing row level security, as if migration
-- 010 had left the line out. The isolation suite must fail with `HỎNG moi-bang-cong-ty-ep-luat-theo-dong: company_fields`.
alter table company_fields no force row level security;
