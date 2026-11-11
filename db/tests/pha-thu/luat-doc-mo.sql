-- Break test (c), scratch database only: the read policy of agreements is open to every row. The isolation suite
-- must fail with `HỎNG chua-dat-san-khong-thay-gi` and `HỎNG luat-doc-ghi-theo-san: agreements`.
drop policy agreements_read on agreements;
create policy agreements_read on agreements for select using (true);
