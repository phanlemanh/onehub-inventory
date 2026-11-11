-- Break: the API role may read the accounts table directly.
grant usage on schema identity to quy_hang_app;
grant select on identity.users to quy_hang_app;
