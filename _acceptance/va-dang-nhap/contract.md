---
schema_version: 1
feature: Sau khi đăng nhập người dùng không bao giờ bị đưa sang trang ngoài, bấm Đăng xuất mà lỗi thì được báo rõ, và người không còn thuộc sàn nào có lối thoát khỏi màn chọn sàn
slug: va-dang-nhap
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [ui, api]
screens: [sign-in, today]
status: verified
approved_by: Manh Phan
approved_at: 2026-11-11
design_doc: docs/superpowers/specs/2026-11-11-va-dang-nhap-design.md
---

# Acceptance Contract: va-dang-nhap

## Context

Hàng 1m của lộ trình, dựng trên hàng 8 (đăng nhập bằng mã qua email). Ở Cổng Bằng chứng của hàng 8 chủ kho chọn mở
hợp đồng mới cho Ngoài-1 đến Ngoài-4: đường «trở về trang» sau đăng nhập lọt được sang trang ngoài khi lẫn tab hay
xuống dòng; Đăng xuất lỗi mạng hay máy chủ bị nuốt và người bị đưa ngược vào ứng dụng; người hết sàn mà còn phiên kẹt
ở màn chọn sàn trống. Hàng này vá đúng ba lỗ ấy, không thêm bảng, không thêm migration, không đổi cách đăng nhập. Luật
sản phẩm: không chạm SP-1 (không truy vấn mới, không trình điều khiển mới); SP-3, SP-4 không liên quan.

Source input: ô cơ hội `_acceptance/va-dang-nhap/opportunity.md` (quyết «build» bởi Manh Phan), sổ hàng 8
`_acceptance/dang-nhap-ma-email/decisions.jsonl` dòng 18–21.

## Criteria

- AC-1: Given ma trận viết trước gồm 14 dạng lách (địa chỉ tuyệt đối, giao thức khác, hai gạch, gạch ngược ở đầu hay
  giữa, tab, xuống dòng, về đầu dòng, ký tự điều khiển khác, khoảng trắng đầu, khoảng trắng Unicode, đường chuẩn hoá ra
  hai gạch, giá trị không phải chuỗi hay rỗng) và 4 dạng hợp lệ, When kiểm đường trở về đọc từng dạng, Then mỗi dạng lách
  cho về trang Hôm nay, mỗi dạng hợp lệ giữ nguyên, và với MỌI dạng, kết quả đọc theo luật địa chỉ của trình duyệt luôn
  ở đúng trang của ứng dụng; số ca bằng số dạng.
- AC-2: Given người đã đăng nhập và có sàn, hoặc người đang đăng nhập, When mở `/login` với đường trở về mang tab hay
  xuống dòng trước `//` của một trang lạ, Then trình duyệt dừng ở trang của ứng dụng (trang Hôm nay), không bao giờ ở
  trang lạ — khi máy chủ chuyển hướng, khi trình duyệt chuyển trang sau khi gõ mã, và sau bước chọn sàn của người
  nhiều sàn. (cross-layer)
- AC-3: Given người đã đăng nhập đang ở một trang của ứng dụng, When bấm «Đăng xuất» mà mạng đứt hoặc máy chủ trả lỗi,
  Then người ở nguyên trang ấy, thấy câu «Chưa đăng xuất được. Bạn vẫn đang đăng nhập trên máy này — kiểm tra mạng rồi
  bấm «Đăng xuất» lại.», phiên vẫn sống ở máy chủ, và bấm «Đăng xuất» lại khi mạng đã về thì thoát được. (cross-layer)
- AC-4: Given người đã đăng nhập, When bấm «Đăng xuất» và máy chủ xoá phiên được, Then người về `/login` bước nhập
  email, phiên bị xoá ở máy chủ và gửi lại cookie cũ thì máy chủ coi như chưa đăng nhập (như hàng 8). (cross-layer)
- AC-5: Given người đã đăng nhập rồi bị gỡ khỏi mọi sàn mà phiên còn, When mở `/login`, Then màn không hiện danh sách sàn
  rỗng mà hiện câu «Tài khoản của bạn không còn thuộc sàn nào. Nhờ quản trị sàn mời lại, hoặc đăng xuất để dùng email
  khác.» cùng nút «Đăng xuất»; bấm nút thì phiên bị xoá ở máy chủ và màn về bước nhập email. (cross-layer)
- AC-6: Given màn ở trạng thái hết sàn khi còn phiên, When bấm «Đăng xuất» mà mạng đứt hoặc máy chủ trả lỗi, Then người
  ở lại trạng thái ấy, thấy cùng câu «Chưa đăng xuất được…» như AC-3, phiên vẫn sống ở máy chủ, và nút bấm lại
  được. (cross-layer)
- AC-7: Given ba lỗ đã vá, When chạy lại bài kiểm của hàng 8 (cơ sở dữ liệu và trình duyệt), bộ kiểm cách ly, bài quét
  một cửa, bài rào hành vi và `make check`, Then tất cả xanh: đăng nhập một sàn, nhiều sàn, mã sai, quá giới hạn, chưa
  thuộc sàn và đăng xuất thành công hoạt động như trước.
- AC-8: Given trạng thái hết sàn khi còn phiên và câu báo đăng xuất lỗi, ở bốn khổ 360, 414, 1024, 1440, sáng và tối,
  When người nhìn màn, Then câu và nút đọc được, không cuộn ngang ở 360, nút bận chỉ bị khoá (không đổi chữ, không biểu
  tượng quay), và kiểm tra khả năng tiếp cận (axe) không có lỗi.

## Coverage

Không gọi skill quét hình thái (dòng sổ «bỏ coverage-scan»); trục dựng tay từ ba lỗ hàng 8 đã gọi tên. Chân sản phẩm: sổ quyết định hàng 8
(Ngoài-1 đến Ngoài-4), `design/behaviors.md` «Kênh thông báo». Chân ngành: [NGÀNH: OWASP Unvalidated Redirects and
Forwards Cheat Sheet — chỉ cho đường tương đối, kiểm bằng danh sách cho phép], [NGÀNH: WHATWG URL Standard — bộ đọc bỏ
tab, LF, CR và khoảng trắng đầu], [NGÀNH: OWASP Session Management — đăng xuất phải kết thúc phiên ở máy chủ].

- Trục dạng đường trở về: 14 dạng lách | 4 dạng hợp lệ [thước CE: WHATWG URL §basic URL parser + OWASP] → AC-1.
- Trục chỗ đọc đường trở về: máy chủ chuyển hướng (đã đăng nhập) | trình duyệt chuyển trang sau gõ mã | bước chọn sàn
  → AC-2 (cả ba, trên trình duyệt), AC-1 (hàm chung).
- Trục kết quả đăng xuất: được | mạng đứt | máy chủ lỗi thật | bấm lại sau lỗi → AC-4, AC-3/AC-6, AC-3/AC-6, AC-3.
- Trục chỗ có nút Đăng xuất: menu tài khoản của khung | màn hết sàn khi còn phiên → AC-3/AC-4, AC-5/AC-6.
- Trục trạng thái người ở màn đăng nhập: chưa phiên | phiên một sàn | phiên nhiều sàn | phiên hết sàn → AC-7 (ba cái
  đầu, bài hàng 8), AC-5.
- Trục lớp: hàm thuần | đường `/api/v1/auth` | màn | khung → AC-1, AC-3/AC-4/AC-5 (phiên ở máy chủ), AC-5/AC-6/AC-8,
  AC-3.
- Ô bỏ có tên: thu mọi phiên khi khoá người (hàng N8); đổi sàn lỗi mạng (Ngoài-6 hàng 8, giới hạn đã biết).

## Vai × Màn

Đăng nhập và Đăng xuất là của mọi vai; hàng này không quyết vai nào vào màn nào.

| Màn | Đầu chủ | Đầu khách | Trưởng nhóm | Quản trị sàn |
|---|---|---|---|---|
| sign-in | được — mọi vai cùng một màn đăng nhập | được — mọi vai cùng một màn đăng nhập | được — mọi vai cùng một màn đăng nhập | được — mọi vai cùng một màn đăng nhập |
| today | được — nút Đăng xuất trên khung, như mọi vai | được — nút Đăng xuất trên khung, như mọi vai | được — nút Đăng xuất trên khung, như mọi vai | được — nút Đăng xuất trên khung, như mọi vai |

## Out of scope

- Thu mọi phiên của người khi khoá người hay gỡ khỏi sàn (hàng N8).
- Đổi sàn lỗi mạng làm menu kẹt (Ngoài-6 của hàng 8, đã ghi giới hạn đã biết).
- Báo «email không hợp lệ» thay vì lỗi máy chủ (Ngoài-11 của hàng 8, giới hạn đã biết).
- Bắt đăng nhập ở các màn dữ liệu mẫu (hàng N5); mời người, vai, bảng quyền (hàng 9, 9a).
- Chạy bài kiểm có cơ sở dữ liệu trên CI: cần job có Postgres ở `.github/workflows/`, việc của người.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Ô cơ hội không khai ngưỡng nghiệm thu và chủ kho dời nghiệm thu giá trị tới cuối lộ trình; hàng này không có mục
  Đường đo.
- Tệp chạm ngoài ranh giới giao, giám sát đã duyệt (R-1111-15): menu tài khoản của khung, chỉ phần Đăng xuất. Tệp chạm
  trong mô-đun danh tính (hàng 9 giữ mô-đun): chỉ `src/modules/identity/next-path.ts`.
- Bài kiểm có cơ sở dữ liệu chạy trên Postgres của dãy R (cổng 5565), ba lệnh riêng thêm vào cấu hình nghiệm thu.
