-- Break test (row 2c), scratch database only: the saved view table stops forcing row level security, as if migration
-- 009 had left the line out. The isolation suite must fail with
-- `HỎNG moi-bang-cong-ty-ep-luat-theo-dong: saved_view`.
alter table saved_view no force row level security;
