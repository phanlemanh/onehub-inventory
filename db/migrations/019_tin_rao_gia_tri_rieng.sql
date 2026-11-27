-- 019_tin_rao_gia_tri_rieng.sql · Tin rao giữ giá trị riêng (hàng 3h, hồ sơ tin-rao-giu-gia-tri-rieng): lần chào của sàn
-- giữ bản riêng của năm thuộc tính căn — Diện tích, Tầng, Phòng ngủ, Hướng, Loại hình (tên RESO như của Unit) — mỗi giá
-- trị nhớ nguồn: 'Typed' (sàn gõ) hay 'File' (nhập từ tệp). Không có giá trị riêng thì màn hiện giá trị danh mục chung; thứ
-- tự thắng Typed › File › danh mục, đọc ở một hàm thuần (src/modules/listings/unit-attributes.ts). Danh mục chung
-- (`catalog_units`) không đổi: sàn không có quyền ghi bảng ấy. Bảng `listings` đã ép cách ly theo dòng và luật thu hẹp
-- theo `updateListing` (013), nên cột mới thuộc sàn ngay, không thêm chính sách. Thêm quyền đổi `upi` của `listing_units`
-- cho lệnh «Gắn sang căn khác»: chỉ mục `listing_units_one_open` vẫn chặn căn đã có lần chào đang mở.

alter table listings
  add column living_area              numeric check (living_area > 0),
  add column living_area_source       text check (living_area_source in ('Typed', 'File')),
  add column floor                    text check (floor ~ '^(0|[1-9][0-9]*)[A-Z]?$'),
  add column floor_source             text check (floor_source in ('Typed', 'File')),
  add column bedrooms_total           integer check (bedrooms_total >= 0),
  add column bedrooms_total_source    text check (bedrooms_total_source in ('Typed', 'File')),
  add column direction_faces          text check (direction_faces in
                                        ('Bắc', 'Nam', 'Đông', 'Tây', 'Đông Bắc', 'Đông Nam', 'Tây Bắc', 'Tây Nam')),
  add column direction_faces_source   text check (direction_faces_source in ('Typed', 'File')),
  add column property_sub_type        text check (property_sub_type in
                                        ('Condominium', 'Townhouse', 'Single Family Residence', 'Unimproved Land')),
  add column property_sub_type_source text check (property_sub_type_source in ('Typed', 'File')),
  -- Một giá trị riêng luôn có nguồn, và nguồn không đứng một mình.
  add constraint listings_living_area_sourced check ((living_area is null) = (living_area_source is null)),
  add constraint listings_floor_sourced check ((floor is null) = (floor_source is null)),
  add constraint listings_bedrooms_total_sourced check ((bedrooms_total is null) = (bedrooms_total_source is null)),
  add constraint listings_direction_faces_sourced check ((direction_faces is null) = (direction_faces_source is null)),
  add constraint listings_property_sub_type_sourced
    check ((property_sub_type is null) = (property_sub_type_source is null));

-- «Gắn sang căn khác» (AC-10): vai ứng dụng đổi được căn mà lần chào trỏ tới; trigger và chỉ mục của 013 giữ luật một căn
-- một lần chào đang mở. Không thêm, không xoá dòng.
grant update (upi) on listing_units to quy_hang_app;
