-- Break test (row 3h), scratch database only: a role the permission table gives no updateListing may change a listing
-- and move its unit link, as if the two narrowing update rules of 013 had been written open. The isolation suite must
-- fail with `HỎNG gia-tri-rieng-cung-san: quản trị sàn sửa được`.
drop policy listings_update_by_permission on listings;
create policy listings_update_by_permission on listings as restrictive for update using (true) with check (true);
drop policy listing_units_update_by_permission on listing_units;
create policy listing_units_update_by_permission on listing_units as restrictive for update using (true) with check (true);
