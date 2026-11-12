-- Break test, row 7a (a new table without rules), scratch database only: a table in public with no company column
-- and no row security, readable by the API role. The suite must fail with
-- `HỎNG vai-api-chi-cham-bang-co-luat: public.bang_tra_cuu_mau`.
create table bang_tra_cuu_mau (id int primary key, ten text not null);
grant select on bang_tra_cuu_mau to quy_hang_app;
