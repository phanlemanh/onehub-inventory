---
schema_version: 1
feature: Mọi thao tác đọc và ghi đều được quyết định từ một bảng quyền theo vai, phạm vi và trạng thái
slug: bang-quyen-theo-vai
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [api, config]
status: approved
design_doc: _acceptance/bang-quyen-theo-vai/design.md
approved_by: Manh Phan
approved_at: 2026-11-12
---

# Acceptance Contract: bang-quyen-theo-vai

## Context

Hàng 9a của lộ trình (quyết định 0016), dựng trên hàng 9 và hàng 1d. Hôm nay kho chưa có bảng quyền: hàng 9 giữ luật «chỉ
Quản trị sàn xem người, mời, đổi vai» ở bốn hàm của cơ sở dữ liệu, và còn hai chỗ rào mỏng — mọi thành viên đọc thẳng
được tên, vai của cả sàn ở bảng thành viên, và thêm, sửa được thoả thuận kết nối ở cơ sở dữ liệu. Vòng này dựng một bảng
quyền trong mô hình nghiệp vụ (`ontology/actions.yaml`), cho API và cơ sở dữ liệu cùng đọc nó, và một bài quét làm đỏ khi
có cửa đọc hay ghi không nằm trong bảng.

Source input: hàng 9a của `docs/plan/lo-trinh.json`, ô `_acceptance/bang-quyen-theo-vai/opportunity.md`, quyết định 0016.
Thiết kế: `_acceptance/bang-quyen-theo-vai/design.md`. Dữ liệu thử: `[Tên]`, `0900 000 0xx`.

Luật sản phẩm chạm: **SP-1** (cách ly giữa sàn — vòng này thêm điều kiện vai vào luật theo dòng của `company_members` và
`agreements`, cách ly theo sàn giữ nguyên; bảng quyền là danh mục dùng chung không có `company_id`). Không chạm SP-3, SP-4.

## Criteria

«Ô» là một cặp thao tác × vai, mang một trong ba giá trị: Toàn sàn, Của tôi, không được. «Thao tác sống» là dòng `live`
của bảng, có ít nhất một cửa trong mã. Bốn vai: Đầu chủ, Đầu khách, Trưởng nhóm, Quản trị sàn.

- **AC-1 — Một bảng quyền trong mô hình nghiệp vụ.** Given `ontology/actions.yaml` · When `make ontology` và `make gen`
  chạy · Then mã sinh mang đủ mọi dòng (thao tác, loại đọc hay ghi, ô của từng vai, trạng thái cho phép, cửa API, cửa cơ
  sở dữ liệu, sống hay nháp); kiểm khuôn đỏ và nêu tên thao tác khi một dòng có vai lạ, phạm vi lạ, dòng sống không có
  cửa, dòng nháp có cửa, hay dòng sống khai trạng thái.
- **AC-2 — Người kiêm nhiều vai được cộng quyền.** Given bảng sinh · When tính phạm vi cho từng thao tác sống với từng
  tổ hợp vai (15 tập con khác rỗng của bốn vai) · Then mỗi kết quả là phạm vi rộng nhất trong các vai ấy, đúng từng ô;
  người không có vai nào ở sàn của phiên không được thao tác nào.
- **AC-3 — API quyết theo bảng.** (cross-layer) Given một sàn có bốn người, mỗi người một vai, một người của sàn khác, và
  một người là Quản trị sàn ở sàn khác nhưng chỉ là Đầu chủ ở sàn này ·
  When mỗi người gọi từng cửa API sống bằng phiên thật · Then ô «không được» nhận `403 forbidden` với cùng một thân lời,
  không ghi gì xuống cơ sở dữ liệu; ô được thì đi tiếp như trước vòng này; số kết quả khớp đếm được bằng đúng số ô API
  của bảng; một ô bị đổi trong bản sao bảng thì bài đỏ, nêu thao tác và vai.
- **AC-4 — Cơ sở dữ liệu quyết theo bảng.** (cross-layer) Given cùng sàn ấy, gọi thẳng dưới vai API qua cửa
  `withCompany`, bỏ qua API · When mỗi người gọi từng cửa cơ sở dữ liệu sống (hàm, đọc bảng, thêm, sửa bảng) · Then kết
  quả khớp từng ô của bảng, theo vai ở sàn của phiên chứ không theo vai ở sàn khác; số kết quả khớp bằng số ô cơ sở
  dữ liệu; bản quyền chép trong cơ sở dữ liệu khớp từng dòng với bảng, lệch thì đỏ nêu thao tác và vai.
- **AC-5 — Cửa ngoài bảng thì đỏ.** Given bài quét liệt mọi route của `/api/v1` và mọi quyền của vai API trong cơ sở dữ
  liệu · When thêm một route ghi, một hàm ghi cấp cho vai API, hay một quyền thêm, sửa, xoá trên một bảng mà không thêm
  dòng vào bảng quyền · Then bài đỏ và nêu tên cửa; cửa khai trong bảng mà không có thật cũng đỏ; danh sách miễn chỉ có cửa
  danh tính trước khi chọn sàn và hàm đọc ngữ cảnh phiên, mỗi cửa một lý do.
- **AC-6 — Quản trị người đi qua bảng, hành vi không đổi.** (cross-layer) Given hàng 9 đã chạy · When Quản trị sàn xem
  người, mời, đổi vai, và ba vai còn lại thử làm điều ấy · Then kết quả y như trước vòng này (Quản trị sàn làm được, ba vai
  kia bị từ chối, sàn luôn còn một quản trị); các hàm ấy hỏi bảng thay vì kiểm vai Quản trị sàn tự viết; luật của thực thể
  Thành viên trỏ bảng quyền; bài kiểm hàng 9 và bài trình duyệt Thành viên vẫn xanh.
- **AC-7 — Bảng thành viên không lộ người cho vai không được xem.** (cross-layer) Given sàn có bốn người · When Đầu chủ,
  Đầu khách, Trưởng nhóm đọc thẳng bảng thành viên dưới vai API · Then mỗi người chỉ thấy dòng của chính mình; Quản trị sàn
  thấy mọi dòng của sàn mình; không ai thấy dòng của sàn khác.
- **AC-8 — Thoả thuận kết nối chỉ Quản trị sàn thêm, sửa.** (cross-layer) Given sàn có bốn người · When từng người thêm
  và sửa một thoả thuận dưới vai API · Then chỉ Quản trị sàn ghi được; ba vai kia bị luật theo dòng từ chối, không dòng nào
  đổi; ai đọc được thoả thuận theo ô `readAgreements` của bảng; sàn khác vẫn không ghi được dòng của sàn này.
- **AC-9 — Cách ly giữ nguyên, ghi lại điều đang đúng.** Given vòng xong · When chạy bộ kiểm cách ly và đọc migration
  004, bảng thuật ngữ, trang thực thể Thành viên, sổ wiki · Then bộ kiểm cách ly xanh; bảng quyền không có `company_id`,
  vai API chỉ đọc được nó; hàm tra quyền chạy bằng quyền người gọi, `search_path` cố định, không thêm hàm vượt luật theo dòng; bảng thuật ngữ có «Thao tác» và
  «Phạm vi»; sổ wiki có dòng của hàng này.

## Coverage

Quét bằng morphological-scan (preset test-matrix cộng risk-premortem). Chân sản phẩm: quyết định 0016, `ontology/roles.yaml`,
migration 001–003, các route `/api/v1`. Chân ngành: [NGÀNH: OWASP Authorization Cheat Sheet — từ chối mặc định, kiểm ở mọi
lớp, một chỗ định nghĩa quyền], [NGÀNH: Postgres row level security — luật theo dòng gọi hàm `security definer`].

- Trục lớp giữ luật: hàm thuần | API | cơ sở dữ liệu (hàm, đọc bảng, ghi bảng) [thước CE: 0016 «API, cơ sở dữ liệu và
  màn hình cùng đọc từ bảng»] → AC-2 | AC-3 | AC-4, AC-7, AC-8. Màn: Later (hàng 19a).
- Trục người gọi: một vai × bốn | nhiều vai (15 tổ hợp) | không vai ở sàn của phiên | người sàn khác [thước CE: 0016 «cộng
  quyền» + bộ kiểm cách ly hàng 7] → AC-3, AC-4 | AC-2 | AC-2 | AC-3, AC-7, AC-8.
- Trục thao tác: đọc | ghi; sống | nháp | miễn [thước CE: lời giao hàng 9a «thêm một thao tác ghi không có dòng thì đỏ»]
  → AC-3, AC-4 | AC-1 | AC-5.
- Trục loại cửa: route API | hàm cơ sở dữ liệu | quyền trên bảng [thước CE: các loại quyền Postgres cấp được cho vai API] →
  AC-5.
- Trục phạm vi: Toàn sàn | Của tôi | không được | Nhóm [thước CE: 0016 «MVP dùng Của tôi và Toàn sàn»] → AC-2, AC-7 | AC-7
  | AC-3, AC-4 | Never ở MVP.
- Trục trạng thái bản ghi: không phụ thuộc | phụ thuộc [CE chưa kiểm chứng — chưa thao tác sống nào phụ thuộc trạng thái]
  → AC-1 (khai, chặn dòng sống khai trạng thái) | Later (hàng đầu tiên có thao tác theo trạng thái).
- Trục chỗ hở đã có: quản trị người | đọc bảng thành viên | ghi thoả thuận → AC-6 | AC-7 | AC-8.
- [GIẢ ĐỊNH] Cửa API của sản phẩm chỉ nằm dưới `src/app/api/v1/**/route.ts` (AGENTS.md: `/api/v1` là đường ghi duy nhất).

## Đường đo

Ô cơ hội có ngưỡng «bài kiểm gọi từng thao tác bằng từng vai ở API và cơ sở dữ liệu, khớp đủ 100% ô của bảng; thêm một
thao tác ghi không có dòng thì bài đỏ»:

- Số ô khớp ở API và cơ sở dữ liệu: bài kiểm in số ô khớp trên số ô của bảng → AC-3, AC-4.
- Đỏ khi thêm cửa ngoài bảng: cặp phá thử của bài quét → AC-5.

## Out of scope

- Màn «Vai nào làm được gì» và nhật ký quản trị (hàng 19a). Vòng này không dựng màn nào.
- Thi hành trạng thái bản ghi ở API và cơ sở dữ liệu: hàng đầu tiên mở thao tác theo trạng thái.
- Chốt từng ô của năm dòng nháp Bảng hàng: hàng mở cửa của dòng ấy (hàng 10 trở đi).
- Phạm vi Nhóm; sàn tự thu hẹp quyền trong khuôn (0016, chờ sàn thứ hai).
- Bộ kiểm trình duyệt đăng nhập theo từng vai (hàng 9b); khoá người, bàn giao, xoá dữ liệu cá nhân (hàng 18a, 18b).

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Đổi ontology — chủ kho soi: thêm `ontology/actions.yaml` (bảng quyền, 7 dòng sống, 5 dòng nháp, danh sách miễn); bộ sinh
  của kho mang thêm phạm vi, cửa và trạng thái sống hay nháp; luật `company-admin-manages-people` của thực thể Thành viên
  trỏ bảng; bảng thuật ngữ thêm «Thao tác» và «Phạm vi». Tệp ngoài ranh giới dãy N đã xin giám sát (N-8).
- Migration mới `004_bang_quyen_theo_vai.sql`; số đổi nếu `origin/main` đã có 004 lúc gộp.
- Không có ngưỡng nghiệm thu giá trị riêng: chủ kho dời nghiệm thu tới cuối lộ trình.
