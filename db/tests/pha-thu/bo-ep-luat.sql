-- Break test (a), applied after the migrations on a scratch database only: agreements stops forcing row level
-- security. The isolation suite must fail with `HỎNG moi-bang-cong-ty-ep-luat-theo-dong: agreements`.
alter table agreements no force row level security;
