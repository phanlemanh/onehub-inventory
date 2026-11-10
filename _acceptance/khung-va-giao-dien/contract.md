---
schema_version: 1
feature: Nhân viên sàn mở ứng dụng ở giao diện sáng hoặc tối, luôn biết mình đang ở màn nào và được báo đúng chỗ khi có sự cố
slug: khung-va-giao-dien
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [ui]
status: verified
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-11-10T22:59:17Z
design_doc: _acceptance/khung-va-giao-dien/design.md
---

# Acceptance Contract: khung-va-giao-dien

## Context

Mọi màn của MVP đứng trên một khung chung: thanh bên, tiêu đề màn, trạng thái toàn trang, bộ định dạng số và ngày, luật chọn kênh thông báo, hai giao diện sáng và tối. Hàng này dựng phần đó trước khi có màn nghiệp vụ, để hàng Lưới, màn mẫu và Bảng hàng không phải tự đoán. Người dùng là nhân viên sàn ở bốn vai, trên máy tính và điện thoại.

Source input: hàng 1a của `docs/plan/lo-trinh.json` (mã F1–F5 của `docs/plan/pham-vi-mvp-dot-1.md`), ô cơ hội `_acceptance/khung-va-giao-dien/opportunity.md` do chủ kho quyết «build» ngày 10/11/2026.

## Criteria

- AC-1: Given khung đang mở ở Hôm nay, Bảng hàng hoặc Đã gửi, When nhân viên vào một màn, Then đúng một mục trên thanh bên mang dấu đang chọn (`aria-current="page"`) và là mục của màn đó, trang có đúng một `main` và một `h1` ghi tên màn, và tiêu đề tab là «<tên màn> · OneHub».
- AC-2: Given bất kỳ màn nào của khung, When nhân viên nhấn Tab lần đầu, Then tiêu điểm dừng ở liên kết «Bỏ qua tới nội dung chính», và bấm nó thì tiêu điểm chuyển vào vùng chính.
- AC-3: Given một màn khai nút chính, When màn hiện, Then nút ấy nằm trong đầu màn cạnh `h1` và là nút chính duy nhất ở đó; màn không khai nút chính thì đầu màn không có ô trống nào.
- AC-4: Given danh sách mục điều hướng có mục chỉ dành cho một số vai, When thanh bên của khung dựng cho một vai, Then trên thanh bên chỉ mục không giới hạn vai và mục dành cho vai đó hiện ra, theo đúng thứ tự khai.
- AC-5: Given khổ màn 360 hoặc 414, When nhân viên mở ứng dụng, Then thanh bên ẩn, nút ở thanh trên mở thanh bên dạng tấm phủ, chọn một mục thì chuyển màn và tấm phủ đóng; ở cả bốn khổ 360, 414, 1024, 1440 trang không cuộn ngang.
- AC-6: Given một màn của khung hỏng khi dựng, When nhân viên đang ở màn đó, Then thanh bên vẫn còn, vùng chính nói chuyện gì xảy ra, vì sao và làm gì tiếp, có nút «Thử lại», và bấm «Thử lại» thì màn dựng lại.
- AC-7: Given một địa chỉ không có trong ứng dụng, When nhân viên mở nó, Then trang nói «Không tìm thấy trang», có lối về trang đầu, tiêu đề tab nói không tìm thấy, và trang không mang thanh bên hay nhãn nội bộ.
- AC-8: Given một màn tải chậm, When nhân viên chờ, Then dưới 1 giây không có chỉ báo nào và từ 1 giây có khung chờ trong khung; và Given phiên đăng nhập hết hạn, When khung hiện trạng thái hết phiên, Then trang mời «Đăng nhập lại» bằng liên kết mang địa chỉ hiện tại để quay về đúng chỗ.
- AC-9: Given bảng mẫu viết trước cho giá, diện tích, số đếm, ngày, ngày giờ và số điện thoại, gồm cả ô trống, When bộ định dạng chạy trên từng mẫu, Then mỗi mẫu cho đúng chuỗi đã viết trước theo `Intl` `vi-VN` (ví dụ «4,85 tỷ», «320 triệu», «999.999 ₫», «75,5 m²», «0900 000 001», ô trống «—»), kể cả các mẫu ở mép đổi đơn vị và mép làm tròn, và chọn hàm theo kiểu `display` của trường.
- AC-10: Given sáu trạng thái chuẩn của hàng, When hiện huy hiệu trạng thái, Then mỗi trạng thái có đúng một màu theo bảng màu đã định, chữ lấy từ `label()` kể cả biến thể cho thuê, và huy hiệu đạt kiểm tương phản ở cả sáng lẫn tối.
- AC-11: Given luật kênh thông báo, When một sự việc là lỗi của một trường, kết quả một thao tác, hay sự cố của cả màn, Then sự việc đi đúng kênh tại chỗ, toast (đảo được thì có «Hoàn tác»), băng trên màn; và When mạng mất hoặc một lần lưu hỏng vì mất mạng, Then băng trên màn nói thay đổi chưa lưu được, có «Thử lại», và băng tự đi khi có mạng lại.
- AC-12: Given thiết bị đặt sáng hoặc tối, When nhân viên mở ứng dụng lần đầu, Then giao diện theo thiết bị; When nhân viên chọn Sáng, Tối hoặc Theo thiết bị ở thanh trên, Then giao diện đổi ngay và giữ qua lần tải lại; và mọi màn của khung không có vi phạm axe mức nghiêm trọng ở cả sáng lẫn tối.

## Coverage

Thước đối chiếu: năm mã F1–F5 của `docs/plan/pham-vi-mvp-dot-1.md`, các dòng «Phiên hết hạn», «Mất mạng khi lưu», «Chờ tải», «Lỗi» của `design/states.md`, và các dòng «Kênh thông báo», «Giao diện», «Điều hướng điện thoại», «Phản hồi theo độ trễ» của `design/behaviors.md`.

- Trục phần của F1: mục đang chọn (AC-1) | lối nhảy (AC-2) | tiêu đề tab (AC-1) | nút chính trên đầu màn (AC-3) | điều hướng theo vai (AC-4) | thanh bên thu gọn trên điện thoại (AC-5).
- Trục trạng thái toàn trang F2: lỗi (AC-6) | không tìm thấy (AC-7) | chờ tải (AC-8) | phiên hết hạn (AC-8).
- Trục kiểu hiển thị F3: `money` | `area` | `count` | `date` | `datetime` | `phone` (AC-9) | `status` (AC-10). Kiểu `person`, `text`, `boolean`, `select` không định dạng số nên để Lưới ở hàng 1b.
- Trục kênh F4: tại chỗ | toast | băng trên màn | mất mạng | lưu hỏng khi mất mạng (AC-11).
- Trục giao diện F5: theo thiết bị | sáng | tối | nhớ qua tải lại (AC-12).
- Trục khổ: 360 | 414 | 1024 | 1440 — mọi bài trình duyệt chạy ở cả bốn khổ.
- Ô «giữ phần đang nhập khi phiên hết hạn» không có AC: chưa có biểu mẫu nào; xem Out of scope.

## Out of scope

- Không dựng trang đăng nhập; nút «Đăng nhập lại» trỏ tới đường đăng nhập mà hàng 8 của dãy N sẽ dựng.
- Không giữ phần đang nhập khi phiên hết hạn: chưa có biểu mẫu nào; việc này đi cùng màn có biểu mẫu đầu tiên.
- Không nối lời gọi bị từ chối vì hết phiên (mã 401) vào trạng thái hết phiên: kho chưa có lớp gọi `/api/v1` nào; hàng này dựng trạng thái và đường quay về, việc nối đi cùng lời gọi API đầu tiên.
- Không khai bảng mục theo vai thật: bảng ấy đến từ sổ vai và màn của hàng 1d; hàng này chỉ dựng cách lọc.
- Không thêm lint cấm gọi thẳng `Intl` ngoài bộ định dạng: lint nằm trong `tools/`, hạng T3, ngoài vùng của hàng.
- Không thêm dòng `check:` vào `design/decisions.yaml`: tệp được bảo vệ, gửi yêu cầu sửa tệp riêng.
- Không có thanh dưới trên điện thoại, không đổi sàn trong ứng dụng, không menu tài khoản (N6).
- Không dựng ô theo kiểu của Lưới; hàng 1b dùng bộ định dạng này.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Đường đăng nhập giả định là `/login?next=<địa chỉ>`; hàng 8 đặt tên khác thì đổi một hằng trong `src/components/templates/frame-copy.ts`.
- Mọi câu chữ của khung (câu lỗi, nút, băng, lối nhảy, tên giao diện) nằm trong một tệp `src/components/templates/frame-copy.ts`; tên màn vẫn đi qua `label()`.
- Bảng màu sáu trạng thái lấy từ Quỹ hàng, `apps/web/src/lib/mau-trang-thai.ts` ở commit `e89c6ab8`.
- Bài trình duyệt chạy trên `next dev`; trang lỗi được kích bằng bản mẫu `/proto/khung-va-giao-dien`, chỉ có ở bản phát triển.
- Ngoài-2 (máy định tuyến 2026-11-10, đề xuất S4 known-limits): Người dùng cuối không bị ảnh hưởng. Tên tài khoản máy của người làm lộ trong kho mã, và các tệp tham số này không chạy lại được trên máy khác. — `_acceptance/khung-va-giao-dien/s4-args.json`
- Ngoài-4 (máy định tuyến 2026-11-10, đề xuất S4 known-limits): Sau khi lưu hỏng do mất mạng, nếu nhân viên sang màn khác thì băng báo vẫn còn và nút «Thử lại» gửi lại việc của màn cũ mà họ không còn nhìn thấy. — `src/components/templates/screen-banner.tsx`
- Ngoài-5 (máy định tuyến 2026-11-10, đề xuất S4 known-limits): Sau khi mất mạng rồi bấm «Thử lại» và lưu được, người dùng không thấy thông báo thành công và không có nút «Hoàn tác». Nếu lần thử lại gặp lỗi khác thì băng báo mất mạng vẫn nằm đó dù mạng đã có lại. — `src/components/templates/screen-banner.tsx`
- Ngoài-6 (máy định tuyến 2026-11-10, đề xuất S4 known-limits): Nếu một ô trạng thái hay ô đúng/sai đi qua bộ định dạng chung, người dùng sẽ thấy mã tiếng Anh như «Active» hoặc «true» thay vì chữ tiếng Việt. — `src/lib/format/index.ts`
- Ngoài-7 (máy định tuyến 2026-11-10, đề xuất S4 known-limits): Trên trang mẫu chỉ có ở bản phát triển, nếu lưu hỏng khi vẫn có mạng thì người dùng không thấy báo gì và không biết là chưa lưu. — `src/app/(app)/proto/[slug]/frame-showcase.tsx`
- Ngoài-8 (máy định tuyến 2026-11-10, đề xuất S4 known-limits): Bài kiểm tra có thể vẫn xanh dù trang không tìm thấy lộ nhãn nội bộ, nên một lỗi lộ nhãn sau này có thể lọt qua mà không ai biết. — `tests/e2e/frame.spec.ts`
- Ngoài-9 (máy định tuyến 2026-11-10, đề xuất S4 known-limits): Bài kiểm tra không chứng minh chắc rằng khung chờ chỉ hiện sau 1 giây, nên nếu sau này nó hiện sớm hoặc muộn thì có thể không bị phát hiện. — `tests/e2e/frame.spec.ts`
