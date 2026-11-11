-- Break test (b, second form), scratch database only: the insert policy of agreements also accepts rows where the
-- session company is only the partner. The isolation suite must fail with `HỎNG luat-doc-ghi-theo-san: agreements`.
drop policy agreements_insert on agreements;
create policy agreements_insert on agreements for insert
  with check (company_id = app.current_company_id() or counterparty_company_id = app.current_company_id());
