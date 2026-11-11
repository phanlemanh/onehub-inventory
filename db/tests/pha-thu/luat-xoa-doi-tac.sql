-- Break test (b, fourth form), scratch database only: agreements gets a delete policy that also accepts the partner
-- column. The isolation suite must fail with `HỎNG luat-doc-ghi-theo-san: agreements`.
create policy agreements_delete on agreements for delete
  using (company_id = app.current_company_id() or counterparty_company_id = app.current_company_id());
