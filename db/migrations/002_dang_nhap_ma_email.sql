-- 002_dang_nhap_ma_email.sql · Đăng nhập bằng mã email và thành viên sàn (hàng 8, quyết định 0021).
-- Danh tính (tài khoản, mã, phiên) ở schema identity: vai API quy_hang_app không có quyền gì trên đó. Thành viên sàn
-- ở public như mọi bảng của công ty, luật theo dòng đúng dạng lọc theo sàn — bộ kiểm cách ly của hàng 7 tự quét nó.
-- «Mọi sàn của một người» không lọc theo một sàn được, nên sáu hàm hẹp dưới đây thuộc vai riêng quy_hang_identity:
-- không đăng nhập được, được vượt luật theo dòng, chỉ đọc hai bảng sàn. Vai API chỉ gọi được hàm, bên trong cửa
-- withCompany. Mã và mã phiên chỉ nằm dạng băm (máy chủ băm, cơ sở dữ liệu không thấy chuỗi rõ).

do $$
begin
  if not exists (select from pg_roles where rolname = 'quy_hang_identity') then
    create role quy_hang_identity nologin nosuperuser nocreatedb nocreaterole bypassrls;
  end if;
end $$;

create schema identity;
revoke all on schema identity from public;

create table identity.users (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique check (email = lower(btrim(email)) and email <> ''),
  name       text not null,
  created_at timestamptz not null default now()
);

-- Một mã đang sống cho mỗi email; xin mã mới thì thay mã cũ.
create table identity.login_codes (
  email           text primary key,
  code_hash       text not null,
  expires_at      timestamptz not null,
  failed_attempts integer not null default 0,
  created_at      timestamptz not null default now()
);

-- Mỗi lần xin mã một dòng (email lạ cũng ghi), để giới hạn đúng cả khi chạy nhiều máy chủ.
create table identity.code_requests (
  email text not null,
  at    timestamptz not null default now()
);
create index code_requests_email_at_idx on identity.code_requests (email, at);

create table identity.sessions (
  token_hash   text primary key,
  user_id      uuid not null references identity.users (id) on delete cascade,
  company_id   uuid references companies (id) on delete set null,
  expires_at   timestamptz not null,
  refreshed_at timestamptz not null default now(),
  created_at   timestamptz not null default now()
);
create index sessions_user_idx on identity.sessions (user_id);

-- Thành viên sàn: ai thuộc sàn nào. Vai, lời mời và quyền ghi cho vai API là việc của hàng 9.
create table company_members (
  company_id uuid not null references companies (id) on delete cascade,
  user_id    uuid not null references identity.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (company_id, user_id)
);
create index company_members_user_idx on company_members (user_id);

alter table company_members enable row level security;
alter table company_members force row level security;
create policy company_members_read on company_members for select
  using (company_id = app.current_company_id());
grant select on company_members to quy_hang_app;

-- Quyền của vai riêng: trọn schema danh tính, và chỉ ĐỌC hai bảng sàn.
grant usage on schema identity to quy_hang_identity;
grant select, insert, update, delete on identity.users, identity.login_codes, identity.code_requests,
  identity.sessions to quy_hang_identity;
grant usage on schema app to quy_hang_identity;
grant select on companies, company_members to quy_hang_identity;

-- 1. Xin mã. Trả 'limited' khi đã xin đủ p_max lần trong cửa sổ (lần bị từ chối không ghi dòng), 'skip' khi email
--    không có tài khoản hay tài khoản không thuộc sàn nào (không gửi thư), 'send' khi đã lưu băm của mã mới.
create function app.login_request_code(p_email text, p_code_hash text, p_ttl_sec integer, p_max integer,
                                       p_window_sec integer)
  returns text
  language plpgsql security definer
  set search_path = pg_catalog, pg_temp
as $$
declare
  v_email text := lower(btrim(p_email));
  v_count integer;
begin
  perform pg_advisory_xact_lock(hashtext('dang-nhap:' || v_email));
  select count(*) into v_count from identity.code_requests r
   where r.email = v_email and r.at > now() - make_interval(secs => p_window_sec);
  if v_count >= p_max then
    return 'limited';
  end if;
  insert into identity.code_requests (email) values (v_email);
  if not exists (select 1 from identity.users u join public.company_members m on m.user_id = u.id
                  where u.email = v_email) then
    return 'skip';
  end if;
  insert into identity.login_codes (email, code_hash, expires_at)
  values (v_email, p_code_hash, now() + make_interval(secs => p_ttl_sec))
  on conflict (email) do update
    set code_hash = excluded.code_hash, expires_at = excluded.expires_at, failed_attempts = 0, created_at = now();
  return 'send';
end $$;

-- 2. Đổi mã lấy phiên. Trả 'invalid' (sai, hết hạn, đã dùng, email lạ — sai đủ p_max_attempts lần thì mã bị xoá),
--    'no-company' (đúng mã nhưng không còn thuộc sàn nào — mã bị dùng, không tạo phiên), hoặc 'ok' kèm số sàn; phiên
--    gắn sàn khi người thuộc đúng một sàn.
create function app.login_verify_code(p_email text, p_code_hash text, p_token_hash text, p_session_ttl_sec integer,
                                      p_max_attempts integer)
  returns table (status text, company_count integer)
  language plpgsql security definer
  set search_path = pg_catalog, pg_temp
as $$
declare
  v_email text := lower(btrim(p_email));
  v_code  identity.login_codes;
  v_user  uuid;
  v_count integer;
  v_only  uuid;
begin
  select * into v_code from identity.login_codes c where c.email = v_email for update;
  if not found then
    return query select 'invalid'::text, 0;
    return;
  end if;
  if v_code.expires_at <= now() then
    delete from identity.login_codes c where c.email = v_email;
    return query select 'invalid'::text, 0;
    return;
  end if;
  if v_code.code_hash <> p_code_hash then
    update identity.login_codes c set failed_attempts = c.failed_attempts + 1 where c.email = v_email;
    delete from identity.login_codes c where c.email = v_email and c.failed_attempts >= p_max_attempts;
    return query select 'invalid'::text, 0;
    return;
  end if;
  delete from identity.login_codes c where c.email = v_email;
  select u.id into v_user from identity.users u where u.email = v_email;
  select count(*), (array_agg(m.company_id))[1] into v_count, v_only
    from public.company_members m where m.user_id = v_user;
  if v_user is null or v_count = 0 then
    return query select 'no-company'::text, 0;
    return;
  end if;
  insert into identity.sessions (token_hash, user_id, company_id, expires_at)
  values (p_token_hash, v_user, case when v_count = 1 then v_only end,
          now() + make_interval(secs => p_session_ttl_sec));
  return query select 'ok'::text, v_count;
end $$;

-- 3. Đọc phiên: không có hay quá hạn thì không trả dòng nào (phiên quá hạn bị xoá). Sàn của phiên được kiểm lại là
--    thành viên — không còn thì phiên mất sàn. Dùng lại sau hơn p_refresh_after_sec giây thì hạn dời về now + p_ttl_sec.
create function app.session_read(p_token_hash text, p_ttl_sec integer, p_refresh_after_sec integer)
  returns table (user_id uuid, email text, name text, company_id uuid, company_name text, company_count integer,
                 expires_at timestamptz)
  language plpgsql security definer
  set search_path = pg_catalog, pg_temp
as $$
declare
  v_s identity.sessions;
begin
  select * into v_s from identity.sessions s where s.token_hash = p_token_hash for update;
  if not found then
    return;
  end if;
  if v_s.expires_at <= now() then
    delete from identity.sessions s where s.token_hash = p_token_hash;
    return;
  end if;
  if v_s.company_id is not null and not exists (
       select 1 from public.company_members m where m.company_id = v_s.company_id and m.user_id = v_s.user_id) then
    update identity.sessions s set company_id = null where s.token_hash = p_token_hash;
    v_s.company_id := null;
  end if;
  if v_s.refreshed_at < now() - make_interval(secs => p_refresh_after_sec) then
    update identity.sessions s set expires_at = now() + make_interval(secs => p_ttl_sec), refreshed_at = now()
     where s.token_hash = p_token_hash
    returning s.expires_at into v_s.expires_at;
  end if;
  return query
    select u.id, u.email, u.name, v_s.company_id, c.name,
           (select count(*)::integer from public.company_members m where m.user_id = u.id),
           v_s.expires_at
      from identity.users u
      left join public.companies c on c.id = v_s.company_id
     where u.id = v_s.user_id;
end $$;

-- 4. Các sàn của người đang giữ phiên (phiên còn hạn), theo tên.
create function app.session_companies(p_token_hash text)
  returns table (id uuid, name text)
  language sql stable security definer
  set search_path = pg_catalog, pg_temp
as $$
  select c.id, c.name
    from identity.sessions s
    join public.company_members m on m.user_id = s.user_id
    join public.companies c on c.id = m.company_id
   where s.token_hash = p_token_hash and s.expires_at > now()
   order by c.name, c.id;
$$;

-- 5. Chọn sàn cho phiên: chỉ khi phiên còn hạn và người là thành viên của sàn ấy.
create function app.session_set_company(p_token_hash text, p_company_id uuid)
  returns boolean
  language plpgsql security definer
  set search_path = pg_catalog, pg_temp
as $$
begin
  update identity.sessions s set company_id = p_company_id
   where s.token_hash = p_token_hash and s.expires_at > now()
     and exists (select 1 from public.company_members m where m.user_id = s.user_id and m.company_id = p_company_id);
  return found;
end $$;

-- 6. Kết thúc phiên.
create function app.session_end(p_token_hash text)
  returns void
  language sql security definer
  set search_path = pg_catalog, pg_temp
as $$
  delete from identity.sessions s where s.token_hash = p_token_hash;
$$;

alter function app.login_request_code(text, text, integer, integer, integer) owner to quy_hang_identity;
alter function app.login_verify_code(text, text, text, integer, integer) owner to quy_hang_identity;
alter function app.session_read(text, integer, integer) owner to quy_hang_identity;
alter function app.session_companies(text) owner to quy_hang_identity;
alter function app.session_set_company(text, uuid) owner to quy_hang_identity;
alter function app.session_end(text) owner to quy_hang_identity;

revoke all on function app.login_request_code(text, text, integer, integer, integer),
  app.login_verify_code(text, text, text, integer, integer), app.session_read(text, integer, integer),
  app.session_companies(text), app.session_set_company(text, uuid), app.session_end(text) from public;
grant execute on function app.login_request_code(text, text, integer, integer, integer),
  app.login_verify_code(text, text, text, integer, integer), app.session_read(text, integer, integer),
  app.session_companies(text), app.session_set_company(text, uuid), app.session_end(text) to quy_hang_app;
