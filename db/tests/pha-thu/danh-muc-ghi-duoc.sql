-- Break test (row 7d), scratch database only: the API role gets INSERT on a shared catalog table.
-- The isolation suite must fail with `HỎNG vai-api-chi-cham-bang-co-luat: public.catalog_units — vai ghi được danh mục chung`.
grant insert on catalog_units to quy_hang_app;
