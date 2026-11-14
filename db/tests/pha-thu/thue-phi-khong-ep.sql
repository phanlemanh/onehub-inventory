-- Break test (row 19), scratch database only: the fee item table stops forcing row level security, as if migration
-- 012 had left the line out. The isolation suite must fail with `HỎNG moi-bang-cong-ty-ep-luat-theo-dong: company_fee_items`.
alter table company_fee_items no force row level security;
