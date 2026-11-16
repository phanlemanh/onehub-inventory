-- Break file of row 10 (bang-hang-du-lieu-that): the listings table without forced row level security, as if migration
-- 013 had left the line out. The isolation suite must fail with `HỎNG moi-bang-cong-ty-ep-luat-theo-dong: listings`.
alter table listings no force row level security;
