-- Dữ liệu mẫu cho tệp phiên vai-dang-nhap-phien.sql (hàng 7c), ghi bằng vai chủ trên cơ sở nháp riêng của bước phiên:
-- hai sàn A, B, mỗi sàn một thoả thuận. Mã cố định để tệp phiên đặt sàn A bằng đúng câu của cửa.
insert into companies (id, name) values
  ('00000000-0000-4000-8000-00000000000a', '[Sàn A]'),
  ('00000000-0000-4000-8000-00000000000b', '[Sàn B]');
insert into agreements (company_id, kind, direction, counterparty, data_classes, valid_from, approved_by) values
  ('00000000-0000-4000-8000-00000000000a', 'spreadsheet', 'inbound', 'thoả thuận sàn A', '{catalog}', now(), '[Tên]'),
  ('00000000-0000-4000-8000-00000000000b', 'spreadsheet', 'inbound', 'thoả thuận sàn B', '{catalog}', now(), '[Tên]');
