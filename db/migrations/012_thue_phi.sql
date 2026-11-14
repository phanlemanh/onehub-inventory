-- 012_thue_phi.sql · Thuế phí của sàn (hàng 19, hồ sơ thue-phi): bảng khoản phí `company_fee_items`, chỉ giữ khoản sàn đã
-- đổi hay đã thêm; khoản không có dòng là mặc định (hai khoản theo luật bật, Phí môi giới 1% bật). Có company_id, luật theo
-- dòng ép buộc như mọi bảng của sàn (SP-1), vai API chỉ đọc, thêm, sửa: không xoá — trả về mặc định hay bỏ khoản là ghi
-- người và lúc ngừng dùng. Luật theo nghĩa (tên không trùng sau khi gấp chữ, tổng các khoản bật tối đa 10%, ít nhất một
-- khoản bật) ở src/modules/company-config/fee-schedule.ts; ở đây giữ khuôn, khoảng, khoản luật cố định, mã cấp một lần
-- và trần năm khoản riêng.

create table company_fee_items (
  id              bigint generated always as identity primary key,
  company_id      uuid not null references companies (id),
  code            text not null check (code ~ '^[a-z][a-z0-9]{0,31}$'),
  kind            text not null check (kind in ('Law', 'Own')),
  name            text check (name = btrim(name) and char_length(name) between 1 and 40),
  rate_bp         integer not null check (rate_bp between 0 and 500),
  included        boolean not null,
  removed         boolean not null default false,
  position        integer not null check (position >= 0),
  changed_by      uuid not null,
  changed_by_name text not null check (char_length(changed_by_name) between 1 and 120),
  changed_at      timestamptz not null default now(),
  retired_by      uuid,
  retired_at      timestamptz,
  -- Thuế thu nhập cá nhân 2% và Lệ phí trước bạ 0,5% theo luật: sàn chỉ bật, tắt.
  constraint company_fee_items_law check (
    kind <> 'Law'
    or (name is null and not removed
        and ((code = 'pit' and rate_bp = 200) or (code = 'registration' and rate_bp = 50)))),
  constraint company_fee_items_own_code check (kind <> 'Own' or code not in ('pit', 'registration')),
  constraint company_fee_items_own_step check (rate_bp % 10 = 0),
  constraint company_fee_items_retired check ((retired_at is null) = (retired_by is null))
);
-- Một dòng đang dùng mỗi khoản.
create unique index company_fee_items_one_live on company_fee_items (company_id, code) where retired_at is null;
-- Mã của khoản sàn thêm cấp một lần, không dùng lại kể cả sau khi bỏ; ba mã mặc định thì trả về mặc định rồi đổi lại được.
create unique index company_fee_items_code_once on company_fee_items (company_id, code)
  where code not in ('pit', 'registration', 'brokerage');

-- Trần năm khoản riêng đang dùng mỗi sàn, giữ cả khi hai lệnh ghi cùng lúc: khoá theo sàn trong giao dịch rồi mới đếm.
-- Phí môi giới không có dòng là khoản mặc định đang dùng, nên cũng được đếm. Hàm chạy bằng quyền người gọi.
create function app.company_fee_items_guard() returns trigger language plpgsql as $f$
declare live integer;
begin
  if new.kind = 'Own' and new.retired_at is null and not new.removed then
    perform pg_advisory_xact_lock(hashtextextended('company_fee_items:' || new.company_id::text, 0));
    select count(*) into live from company_fee_items
      where company_id = new.company_id and kind = 'Own' and retired_at is null and not removed and id <> new.id;
    if new.code <> 'brokerage' and not exists (
         select from company_fee_items
          where company_id = new.company_id and code = 'brokerage' and retired_at is null and id <> new.id) then
      live := live + 1;
    end if;
    if live >= 5 then
      raise exception 'company_fee_items_limit: at most 5 own fee items in use per company';
    end if;
  end if;
  return new;
end $f$;
revoke all on function app.company_fee_items_guard() from public;
create trigger company_fee_items_guard before insert or update on company_fee_items
  for each row execute function app.company_fee_items_guard();

-- Luật theo sàn, như mọi bảng của sàn; vai API đọc, thêm, sửa — không xoá.
alter table company_fee_items enable row level security;
alter table company_fee_items force row level security;
create policy company_fee_items_read on company_fee_items for select
  using (company_id = app.current_company_id());
create policy company_fee_items_insert on company_fee_items for insert
  with check (company_id = app.current_company_id());
create policy company_fee_items_update on company_fee_items for update
  using (company_id = app.current_company_id()) with check (company_id = app.current_company_id());
revoke all on company_fee_items from public;
grant select, insert, update on company_fee_items to quy_hang_app;

-- Bảng quyền (hàng 9a): hai thao tác của hàng này, chép từ ontology/actions.yaml. Đọc cho cả bốn vai; đặt mức chỉ Quản
-- trị sàn (chủ kho duyệt ở Cổng Phạm vi, 2026-11-14).
insert into app.permissions (action, role, scope) values
  ('readFeeSchedule', 'ListAgent', 'company'),
  ('readFeeSchedule', 'BuyerAgent', 'company'),
  ('readFeeSchedule', 'TeamLead', 'company'),
  ('readFeeSchedule', 'CompanyAdmin', 'company'),
  ('setFeeSchedule', 'CompanyAdmin', 'company');

-- Luật thu hẹp đứng cùng luật theo sàn: đọc cần readFeeSchedule; thêm và sửa cần setFeeSchedule, kể cả khi gọi thẳng
-- dưới vai ứng dụng.
create policy company_fee_items_read_by_permission on company_fee_items as restrictive for select
  using (app.allowed('readFeeSchedule') = 'company');
create policy company_fee_items_insert_by_permission on company_fee_items as restrictive for insert
  with check (app.allowed('setFeeSchedule') = 'company');
create policy company_fee_items_update_by_permission on company_fee_items as restrictive for update
  using (app.allowed('setFeeSchedule') = 'company') with check (app.allowed('setFeeSchedule') = 'company');
