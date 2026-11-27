-- Break test (row 3h), scratch database only: the unit links of every company may be read and changed by anyone, as if
-- the read and update policies of listing_units had been written open. The isolation suite must fail with
-- `HỎNG gia-tri-rieng-theo-san: sàn B gắn được`.
drop policy listing_units_read on listing_units;
create policy listing_units_read on listing_units for select using (true);
drop policy listing_units_update on listing_units;
create policy listing_units_update on listing_units for update using (true) with check (true);
