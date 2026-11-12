-- Break test (row 2c, E11), scratch database only: the database stops checking a saved view's name. With a server that
-- skips the name rule too, an empty name gets in: tests/db/goc-nhin.db.test.ts must name `server accepted empty name`.
alter table saved_view drop constraint saved_view_name_check;
