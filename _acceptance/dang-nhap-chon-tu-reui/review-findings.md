## Trong hợp đồng

Không có finding nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **New server-error test hand-writes the shared wait instead of using shown(), so it escapes the CHO_TESTS registry**
  Người dùng thấy gì: Người dùng không thấy gì khác: màn đăng nhập vẫn báo lỗi máy chủ đúng chỗ. Hậu quả chỉ là bài kiểm này có thể chập chờn trên máy chậm mà bộ lặp kiểm không bắt được.
  Căn cứ: Nhẹ: chỉ ảnh hưởng độ ổn định của bài kiểm nội bộ, không mất dữ liệu hay đổi gì người dùng thấy, và sửa sau vẫn rẻ.
  file: `tests/e2e/dang-nhap-khoi.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 — tuyên quét lớp (bốn khổ × sáng/tối) nhưng ca dang-cua-khoi chỉ đo nền sáng**
  Người dùng thấy gì: Dáng của màn đăng nhập (logo, cột không khung, biểu tượng thư, nút rộng) chưa được kiểm tự động ở nền tối, nên nếu nền tối vỡ bố cục thì có thể không ai báo sớm.
  Căn cứ: Nhẹ: bố cục dùng chung một mã cho hai nền nên rủi ro thấp, nếu vỡ thì người dùng chỉ thấy xấu chứ không mất dữ liệu, và bổ sung phép đo sau cũng rẻ.
  file: `tests/e2e/dang-nhap-khoi.spec.ts`
  severity: medium
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
