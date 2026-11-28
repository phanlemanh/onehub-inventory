-- 016_nhap_excel_dau_chu.sql · Trưởng nhóm thấy tên các Đầu chủ để chọn người giữ căn khi nhập hộ (hàng 11, hồ sơ
-- nhap-excel; chủ kho chốt «Cho thấy (lối A)» ngày 2026-11-17, dòng sổ d-20261117T064233Z-63; giám sát G-1711-42).
-- Hàm đặc quyền thứ 11 của danh sách ca 19 bộ cách ly: chỉ mã người và tên, chỉ thành viên có vai Đầu chủ, chỉ của sàn
-- đang chọn, chỉ khi bảng quyền cho importListings toàn sàn — không email, không số điện thoại. Vai khác gọi thì rỗng.
create function app.import_list_agents()
  returns table (user_id uuid, name text)
  language plpgsql stable security definer
  set search_path = pg_catalog, pg_temp
as $$
declare
  v_company uuid := app.current_company_id();
begin
  if v_company is null or app.allowed('importListings') is distinct from 'company' then
    return;
  end if;
  return query
    select m.user_id, m.name
      from public.company_members m
     where m.company_id = v_company and 'ListAgent' = any (m.roles)
     order by m.name, m.user_id;
end $$;
alter function app.import_list_agents() owner to quy_hang_identity;
revoke all on function app.import_list_agents() from public;
do $$
declare r text;
begin
  foreach r in array array['anon', 'authenticated', 'service_role'] loop
    if exists (select from pg_roles where rolname = r) then
      execute format('revoke all on function app.import_list_agents() from %I', r);
    end if;
  end loop;
end $$;
grant execute on function app.import_list_agents() to quy_hang_app;
