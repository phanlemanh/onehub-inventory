-- Hàng 11 (nhap-excel): vai «của mình» chỉ gắn căn (căn của danh mục hay căn chờ khớp) vào lần chào chính mình giữ, và
-- danh sách Đầu chủ trả đúng người gọi cho vai ấy. Ma trận vai × cửa của bảng quyền (tests/db/bang-quyen.db.test.ts)
-- đo được hai chỗ lệch, khớp mục ngoài hợp đồng #10 của hàng 11. Chạy hai lần không đổi gì thêm.

-- 1. Thêm mối nối căn: toàn sàn, hay của mình khi lần chào là của chính người thêm (cùng luật với thêm lần chào, 015).
drop policy if exists listing_units_insert_by_permission on listing_units;
create policy listing_units_insert_by_permission on listing_units as restrictive for insert
  with check (app.allowed('createListing') = 'company'
              or (app.allowed('createListing') = 'own'
                  and exists (select from listings l
                               where l.id = listing_units.listing_id
                                 and (l.list_agent_user_id)::text = current_setting('app.user_id', true))));
drop policy if exists listing_pending_units_insert_by_permission on listing_pending_units;
create policy listing_pending_units_insert_by_permission on listing_pending_units as restrictive for insert
  with check (app.allowed('createListing') = 'company'
              or (app.allowed('createListing') = 'own'
                  and exists (select from listings l
                               where l.id = listing_pending_units.listing_id
                                 and (l.list_agent_user_id)::text = current_setting('app.user_id', true))));

-- 2. Danh sách Đầu chủ để chọn người giữ căn: toàn sàn thì mọi Đầu chủ của sàn; của mình thì chỉ chính người gọi khi
-- người ấy là Đầu chủ; vai khác thì rỗng. Vẫn chỉ mã người và tên (lối A của chủ kho, d-20261117T064233Z-63).
create or replace function app.import_list_agents()
  returns table (user_id uuid, name text)
  language plpgsql stable security definer
  set search_path = pg_catalog, pg_temp
as $$
declare
  v_company uuid := app.current_company_id();
  v_scope text := app.allowed('importListings');
  v_user text := current_setting('app.user_id', true);
begin
  if v_company is null or v_scope is null then
    return;
  end if;
  return query
    select m.user_id, m.name
      from public.company_members m
     where m.company_id = v_company and 'ListAgent' = any (m.roles)
       and (v_scope = 'company' or (v_scope = 'own' and (m.user_id)::text = v_user))
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
