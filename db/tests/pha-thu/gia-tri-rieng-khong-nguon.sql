-- Break test (row 3h), scratch database only: a listing's own area may stand without its source, as if migration 019 had
-- left the constraint out. The isolation suite must fail with `HỎNG gia-tri-rieng-theo-san: câu chạy được`.
alter table listings drop constraint listings_living_area_sourced;
