-- Break test (c, third form), scratch database only: the read policy of agreements compares the company column the
-- wrong way. The isolation suite must fail with `HỎNG luat-doc-ghi-theo-san: agreements`.
drop policy agreements_read on agreements;
create policy agreements_read on agreements for select using (company_id <> app.current_company_id());
