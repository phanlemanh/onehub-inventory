-- 005_thoa_thuan_du_loai.sql · Bảng thoả thuận nhận đủ tám loại của mô hình nghiệp vụ (ontology/entities/Agreement.yaml),
-- hàng 7a, Hỏi-1 chủ kho chọn ngày 2026-11-12. Hai loại thêm — xử lý bằng AI và xác nhận danh mục — Quỹ hàng đã nới
-- ở migration 035 và 040; luật riêng của từng loại ấy thuộc hàng dùng chúng, không ở đây. Số 004 là của hàng 9a.
-- Chỉ thay ràng buộc loại; bảng, luật theo dòng và quyền giữ nguyên.

alter table agreements drop constraint agreements_kind_check;
alter table agreements add constraint agreements_kind_check check (kind in (
  'catalog_source', 'listing_channel', 'lead_source', 'spreadsheet', 'company_partnership', 'company_api',
  'ai_processing', 'catalog_confirmation'));
