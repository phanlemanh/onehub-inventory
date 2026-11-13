-- Break test (row 2c, E8), scratch database only: the update policy that keeps each person to their own saved views is
-- gone, and so is the read one an update also needs. With a save-changes statement that leaves out the saver, another
-- member overwrites the view: tests/db/goc-nhin.db.test.ts must name `saved view overwritten by another member`.
drop policy saved_view_own_update on saved_view;
drop policy saved_view_own_read on saved_view;
