# Review findings: va-dang-nhap (round 1)

## Trong hợp đồng

Không có finding nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Tier: auth change classified below high (review-change step 10)**
  Người dùng thấy gì: Thay đổi đăng nhập này được hệ thống xếp vào mức rủi ro vừa chứ không phải cao, nên có thể bị duyệt ít chặt hơn mức nó đáng được. Người dùng không thấy khác biệt nào; rủi ro nằm ở việc các thay đổi đăng nhập sau này cũng lọt qua mức duyệt nhẹ.
  Căn cứ: Không ảnh hưởng người dùng ngay, không mất hay lộ dữ liệu, chủ kho đã tự tay duyệt thay đổi này; chỉ cần ghi lại và nhờ chủ kho bổ sung quy tắc phân hạng sau.
  file: `src/modules/identity/next-path.ts`
  severity: high
  Đề xuất: known-limits

- **Product language: concept labels hard-coded in src (AGENTS.md 'Never hard-code a label in src/')**
  Người dùng thấy gì: Câu báo «không còn thuộc sàn nào» đang viết cứng chữ «đăng xuất» và «sàn». Nếu sau này đổi tên các khái niệm này, câu ấy có thể lệch với nút bên cạnh.
  Căn cứ: Hiện tại người dùng thấy đúng chữ như hợp đồng, không mất dữ liệu; chỉ có thể lệch chữ khi đổi tên về sau và sửa lúc đó rẻ.
  file: `src/app/login/copy.ts`
  severity: low
  Đề xuất: known-limits

- **Evidence: make check red locally (not caused by this diff)**
  Người dùng thấy gì: Bộ kiểm tổng báo đỏ trên máy này chỉ vì một tệp tạm của lần nghiệm thu còn sót lại; mã của tính năng không có lỗi. Người dùng không bị ảnh hưởng.
  Căn cứ: Không ảnh hưởng người dùng và không mất dữ liệu; xoá thư mục tạm là hết, trên bản sạch bộ kiểm vẫn xanh.
  file: `.acceptance-runs/va-dang-nhap/acceptance-verify.js`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (assertion âm tính đứng một mình, không có đối chứng dương): clearsCookie(res) luôn trả false, vì Response.headers() của Playwright không bao giờ trả về Set-Cookie**
  Người dùng thấy gì: Khi Đăng xuất lỗi, một bước kiểm xem máy chủ có lỡ xoá phiên không đang không đo được gì. Nếu sau này có lỗi làm người dùng bị đăng xuất ngầm dù được báo vẫn đăng nhập, bài kiểm có thể không báo đúng chỗ.
  Căn cứ: Hành vi cho người dùng hiện không sai và vẫn còn một bước kiểm gián tiếp bắt được phần lớn trường hợp; chỉ là lưới an toàn yếu hơn và sửa bài kiểm sau khá rẻ.
  file: `tests/e2e-db/va-dang-nhap.spec.ts`
  severity: high
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

Không có.

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
