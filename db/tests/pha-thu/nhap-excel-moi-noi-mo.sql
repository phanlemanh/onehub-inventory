-- Break of row 11 (nhap-excel, migration 019): the two link rules back to «may create listings at all», as migration
-- 015 had them. The isolation suite must go red on case 26 ("nhap-excel-moi-noi-cua-minh"): a listing agent of company A
-- then links a unit to the listing another agent of A keeps. Run by db/scripts/cach-ly.sh on its own scratch database.
drop policy listing_units_insert_by_permission on listing_units;
create policy listing_units_insert_by_permission on listing_units as restrictive for insert
  with check (app.allowed('createListing') is not null);
drop policy listing_pending_units_insert_by_permission on listing_pending_units;
create policy listing_pending_units_insert_by_permission on listing_pending_units as restrictive for insert
  with check (app.allowed('createListing') is not null);
