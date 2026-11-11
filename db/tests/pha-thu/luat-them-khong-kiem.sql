-- Break test (b), scratch database only: the insert policy of agreements checks nothing. The isolation suite must
-- fail with `HỎNG a-khong-them-dong-ten-b` and `HỎNG luat-doc-ghi-theo-san: agreements`.
drop policy agreements_insert on agreements;
create policy agreements_insert on agreements for insert with check (true);
