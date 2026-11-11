# Review findings: so-do-ghi-khong-mat-tang (round 2)

## Trong hợp đồng

(không có)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Machine-local absolute paths (OS account name) committed in the S4 args file**
  Người dùng thấy gì: Tên tài khoản máy của chủ kho nằm trong một tệp ghi chép nội bộ, và tệp đó không chạy lại được trên máy khác. Người dùng cuối không bị ảnh hưởng.
  Căn cứ: Hậu quả nhẹ: chỉ lộ tên tài khoản trong tài liệu nội bộ, không mất hay lộ dữ liệu khách, và sửa sau lúc nào cũng được.
  file: `_acceptance/so-do-ghi-khong-mat-tang/s4-args-r1.json`
  severity: low
  Đề xuất: known-limits

- **E1 claims the chmod 000 case checks the file hash, but the test only compares mtime**
  Người dùng thấy gì: Hồ sơ nghiệm thu ghi rằng ca bị cấm quyền đọc có kiểm tra tệp không đổi bằng dấu băm, nhưng thực tế chỉ kiểm giờ sửa tệp. Lệnh vẫn dừng đúng và không ghi đè, nên người dùng không bị mất dữ liệu.
  Căn cứ: Hậu quả nhẹ: chỉ là lời mô tả bằng chứng chưa khớp bài kiểm, hành vi thật của lệnh đúng, và đổi lại một dòng chữ rất rẻ.
  file: `_acceptance/so-do-ghi-khong-mat-tang/evals.yaml`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 2/2 lỗi rơi vào file không bộ đo nào phủ (_acceptance/so-do-ghi-khong-mat-tang/s4-args-r1.json, _acceptance/so-do-ghi-khong-mat-tang/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
