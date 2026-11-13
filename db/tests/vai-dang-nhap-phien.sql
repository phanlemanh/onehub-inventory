-- Hai ca chạy trên một kết nối ĐĂNG NHẬP BẰNG quy_hang_login (hàng 7c, hồ sơ ung-dung-noi-bang-vai-khong-chu; SP-1).
-- Bộ chạy (db/scripts/cach-ly.sh) mở kết nối bằng vai ấy trên cơ sở nháp có dữ liệu của vai-dang-nhap-mau.sql. Đổi vai
-- được hay không là Postgres xét theo vai của PHIÊN, nên ca này không giả được bằng `set role` từ phiên vai chủ.

-- dang-nhap-khong-ve-vai-chu: mọi lối đổi về vai chủ bị từ chối; sau `reset role` không đọc được bảng sàn nào.
do $$
declare chu text; dem bigint;
begin
  select relowner::regrole::text into chu from pg_class where oid = 'public.companies'::regclass;
  begin
    execute format('set role %I', chu);
    reset role;
    raise exception 'HỎNG dang-nhap-khong-ve-vai-chu: set role % không bị từ chối', chu;
  exception when insufficient_privilege then null;
  end;
  begin
    set role quy_hang_identity;
    reset role;
    raise exception 'HỎNG dang-nhap-khong-ve-vai-chu: set role quy_hang_identity không bị từ chối';
  exception when insufficient_privilege then null;
  end;
  begin
    execute format('set session authorization %I', chu);
    reset session authorization;
    raise exception 'HỎNG dang-nhap-khong-ve-vai-chu: set session authorization % không bị từ chối', chu;
  exception when insufficient_privilege then null;
  end;
  set local role quy_hang_app;
  reset role;
  if current_user <> session_user then
    raise exception 'HỎNG dang-nhap-khong-ve-vai-chu: sau reset role vai hiện hành là %, không phải vai của phiên %',
      current_user, session_user;
  end if;
  begin
    select count(*) into dem from public.companies;
    raise exception 'HỎNG dang-nhap-khong-ve-vai-chu: sau reset role vẫn đọc được public.companies';
  exception when insufficient_privilege then null;
  end;
  begin
    select count(*) into dem from public.agreements;
    raise exception 'HỎNG dang-nhap-khong-ve-vai-chu: sau reset role vẫn đọc được public.agreements';
  exception when insufficient_privilege then null;
  end;
  if session_user <> 'quy_hang_login' then
    raise exception 'HỎNG dang-nhap-khong-ve-vai-chu: phiên đăng nhập bằng %, không phải quy_hang_login', session_user;
  end if;
  raise notice 'ok dang-nhap-khong-ve-vai-chu';
end $$;

-- dang-nhap-qua-cua-doc-duoc (đối chứng): đúng hai câu của cửa (SET_ROLE_SQL, SET_CONTEXT_SQL) với sàn A rồi đọc —
-- thấy đúng một thoả thuận, của A.
begin;
set local role quy_hang_app;
prepare dat_san_cua(text, text) as select set_config('app.user_id', $1, true), set_config('app.company_id', $2, true);
execute dat_san_cua('00000000-0000-4000-8000-0000000000a1', '00000000-0000-4000-8000-00000000000a');
do $$
declare n bigint; ben text;
begin
  select count(*), min(counterparty) into n, ben from public.agreements;
  if n <> 1 or ben <> 'thoả thuận sàn A' then
    raise exception 'HỎNG dang-nhap-qua-cua-doc-duoc: thấy % thoả thuận (%), cần đúng 1 của sàn A', n, coalesce(ben, 'không có');
  end if;
  raise notice 'ok dang-nhap-qua-cua-doc-duoc — 1 thoả thuận của sàn A';
end $$;
commit;
