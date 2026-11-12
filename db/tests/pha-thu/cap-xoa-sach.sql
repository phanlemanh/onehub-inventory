-- Break test, row 7a (Ngoài-6, 20), scratch database only: the API role may empty the agreements table, which row
-- security does not stop. The suite must fail with `HỎNG vai-api-khong-quyen-nguy-hiem: public.agreements TRUNCATE`.
grant truncate on agreements to quy_hang_app;
