-- Break of row 11 (nhap-excel, migration 018): the link of a listing to a pending unit back on the pending unit's id
-- alone, as migration 015 had it. The isolation suite must go red on case 25 ("nhap-excel-can-cho-theo-san"): a listing
-- of company A then points at a pending unit of company B. Run by db/scripts/cach-ly.sh on its own scratch database.
alter table listing_pending_units drop constraint listing_pending_units_pending_company;
alter table listing_pending_units add constraint listing_pending_units_pending_unit_id_fkey
  foreign key (pending_unit_id) references company_pending_units (id);
