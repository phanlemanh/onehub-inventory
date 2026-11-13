-- A saved view keeps four things, not five: the search text is no longer part of it (owner's ruling 2026-11-13, relayed
-- by the batch supervisor in G-1311-10: searching moves to the top bar). 009 was committed before the ruling, so the
-- shape changes here; rows already stored lose their search text and keep the rest. Row 2c, number granted in K-1311-6.
alter table saved_view drop constraint saved_view_view_check;

update saved_view set view = view - 'query' where view ? 'query';

alter table saved_view add constraint saved_view_view_check check (
  jsonb_typeof(view) = 'object'
  and view ?& array['filters', 'sort', 'grouped', 'hidden']
  and view - array['filters', 'sort', 'grouped', 'hidden'] = '{}'::jsonb
  and jsonb_typeof(view -> 'filters') = 'object'
  and jsonb_typeof(view -> 'sort') = 'array'
  and jsonb_typeof(view -> 'grouped') = 'boolean'
  and jsonb_typeof(view -> 'hidden') = 'array'
);
