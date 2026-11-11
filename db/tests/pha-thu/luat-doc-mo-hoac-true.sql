-- Break test (c, second form), scratch database only: the read policy of agreements names the company but adds
-- `or true`. The isolation suite must fail with `HỎNG chua-dat-san-khong-thay-gi: agreements` and
-- `HỎNG luat-doc-ghi-theo-san: agreements`.
drop policy agreements_read on agreements;
create policy agreements_read on agreements for select using (company_id = app.current_company_id() or true);
