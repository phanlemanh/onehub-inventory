-- Break test (row 2c, E8), scratch database only: the saved view table forgets that a view is its saver's — the read
-- policy that keeps each person to their own rows is gone. With a list that also leaves out the saver, another member
-- of the company sees the view: tests/db/goc-nhin.db.test.ts must name `saved view visible to another member`.
drop policy saved_view_own_read on saved_view;
