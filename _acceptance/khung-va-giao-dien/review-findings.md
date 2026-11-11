# Review findings: khung-va-giao-dien (round 2)

## Trong hợp đồng

(không có)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Records: invariant-touch scan does not cover HEAD**
  Người dùng thấy gì: Người dùng không thấy gì khác. Chỉ là bản ghi kiểm tra luật chạm chưa tính commit cuối, nhưng kết quả kiểm lại vẫn là không có chỗ nào chạm luật sản phẩm.
  Căn cứ: Không ảnh hưởng người dùng và không mất dữ liệu, kết quả kiểm lại vẫn đúng nên để nguyên, chỉ ghi vết.
  file: `_acceptance/khung-va-giao-dien/luat-cham.json`
  severity: low
  Đề xuất: wont-fix

- **Personal data / portability: machine-local absolute paths committed**
  Người dùng thấy gì: Người dùng cuối không bị ảnh hưởng. Tên tài khoản máy của người làm lộ trong kho mã, và các tệp tham số này không chạy lại được trên máy khác.
  Căn cứ: Hậu quả nhẹ, chỉ lộ tên máy cục bộ trong tài liệu nội bộ, không làm mất dữ liệu khách; ghi vào hạn chế đã biết là đủ.
  file: `_acceptance/khung-va-giao-dien/s4-args.json`
  severity: low
  Đề xuất: known-limits

- **Domain (ADR-0016): role filter takes a single role, but roles add up**
  Người dùng thấy gì: Khi một nhân viên giữ hai vai cùng lúc, thanh bên có thể thiếu các mục của vai thứ hai. Hiện chưa gặp vì chưa có vai thật nào được nối vào.
  Căn cứ: Chưa gây hại ngay vì chưa có dữ liệu vai thật, và ẩn mục chỉ là tiện lợi chứ không phải quyền truy cập; xử lý đúng chỗ khi hàng 1d nối vai thật thì rẻ.
  file: `src/components/templates/nav-menu.tsx`
  severity: low
  Đề xuất: new-contract

- **Design: save-failed banner and its retry outlive the screen that made them**
  Người dùng thấy gì: Sau khi lưu hỏng do mất mạng, nếu nhân viên sang màn khác thì băng báo vẫn còn và nút «Thử lại» gửi lại việc của màn cũ mà họ không còn nhìn thấy.
  Căn cứ: Không mất dữ liệu và vẫn do người bấm gửi, nhưng có thể gây bối rối; hiện chưa có biểu mẫu thật nên ghi hạn chế và sửa khi có màn lưu đầu tiên.
  file: `src/components/templates/screen-banner.tsx`
  severity: low
  Đề xuất: known-limits

- **Retrying from the save-failed banner skips what the caller does after a save, and online failures are silently lost (r1)**
  Người dùng thấy gì: Sau khi mất mạng rồi bấm «Thử lại» và lưu được, người dùng không thấy thông báo thành công và không có nút «Hoàn tác». Nếu lần thử lại gặp lỗi khác thì băng báo mất mạng vẫn nằm đó dù mạng đã có lại.
  Căn cứ: Không mất dữ liệu đã nhập, người dùng tự tải lại hoặc lưu lại được; lỗi nằm ở màn mẫu chưa có màn nghiệp vụ thật nào dùng, sửa sau không đắt.
  file: `src/components/templates/screen-banner.tsx`
  severity: high
  Đề xuất: known-limits

- **formatByKind shows the raw English code for status fields (and boolean/select/person) (r1)**
  Người dùng thấy gì: Nếu một ô trạng thái hay ô đúng/sai đi qua bộ định dạng chung, người dùng sẽ thấy mã tiếng Anh như «Active» hoặc «true» thay vì chữ tiếng Việt.
  Căn cứ: Hiện chưa có màn nào đưa các trường này qua bộ định dạng, nên chưa ai nhìn thấy; hàng Lưới sẽ xử lý các kiểu này nên ghi lại để hàng đó nhớ.
  file: `src/lib/format/index.ts`
  severity: medium
  Đề xuất: known-limits

- **SaveDemo does not handle errors that saveWithBanner rethrows; non-offline save failures give no feedback (r1)**
  Người dùng thấy gì: Trên trang mẫu chỉ có ở bản phát triển, nếu lưu hỏng khi vẫn có mạng thì người dùng không thấy báo gì và không biết là chưa lưu.
  Căn cứ: Chỉ ảnh hưởng trang mẫu của người phát triển, không tới nhân viên sàn; nhưng màn thật sao chép theo thì cần lưu ý nên ghi vào hạn chế đã biết.
  file: `src/app/(app)/proto/[slug]/frame-showcase.tsx`
  severity: low
  Đề xuất: known-limits

- **Assertion âm-tính-một-mình: nửa 'không có nhãn nội bộ' của trang không tìm thấy không có đối chứng dương, thông điệp chỉ ghim phần đầu (r1)**
  Người dùng thấy gì: Bài kiểm tra có thể vẫn xanh dù trang không tìm thấy lộ nhãn nội bộ, nên một lỗi lộ nhãn sau này có thể lọt qua mà không ai biết.
  Căn cứ: Sản phẩm hiện đúng, chỉ phần kiểm tra yếu hơn lời hứa; sửa bài kiểm tra rẻ nhưng không ảnh hưởng người dùng ngay.
  file: `tests/e2e/frame.spec.ts`
  severity: high
  Đề xuất: known-limits

- **Assertion âm-tính-một-mình: 'không có khung chờ trước 1 giây' dùng toBeHidden tự thử lại, không phải phép đo tại 500 ms, và không có đối chứng (r1)**
  Người dùng thấy gì: Bài kiểm tra không chứng minh chắc rằng khung chờ chỉ hiện sau 1 giây, nên nếu sau này nó hiện sớm hoặc muộn thì có thể không bị phát hiện.
  Căn cứ: Hành vi thật đang đúng, rủi ro chỉ là hỏng âm thầm về sau; người dùng tối đa thấy khung chờ chớp sớm, không mất dữ liệu.
  file: `tests/e2e/frame.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Tuyên quét LỚP nhưng một ô trùng: ở khổ máy tính, màn thứ 9 'sidebar expanded' trùng màn /inventory, nên 18 lượt chỉ là 8 trạng thái khác nhau (r1)**
  Người dùng thấy gì: Bài quét trên máy tính đếm 18 lượt nhưng thực chất chỉ có 8 trạng thái khác nhau, nên độ phủ nhìn lớn hơn thật một chút.
  Căn cứ: Chỉ là số đếm hơi đẹp hơn thực tế, không ảnh hưởng người dùng; sửa không đáng công.
  file: `tests/e2e/frame.spec.ts`
  severity: low
  Đề xuất: wont-fix

⚠ Cụm ngoài vùng phủ: 2/4 lỗi rơi vào file không bộ đo nào phủ (_acceptance/khung-va-giao-dien/luat-cham.json, _acceptance/khung-va-giao-dien/s4-args.json) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
