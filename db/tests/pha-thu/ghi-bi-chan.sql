-- Break test, row 7a (Ngoài-30), scratch database only: the API role loses the right to add agreements, so no
-- company can write its own rows. The isolation suite must fail with `HỎNG a-ghi-duoc-dong-cua-minh`.
revoke insert on agreements from quy_hang_app;
