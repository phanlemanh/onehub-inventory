---
schema_version: 1
feature: "Mỗi màn được kiểm bằng từng vai ở bốn khổ màn hình, vai không được vào thấy đúng Không đủ quyền và không lộ dữ liệu"
slug: kiem-vai-theo-man
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [cli]
screens: [today, inventory, sent, members, sign-in]
status: draft
approved_by:
approved_at:
design_doc: _acceptance/kiem-vai-theo-man/design.md
---

# Acceptance Contract: kiem-vai-theo-man

## Context

Quyết định 0017: bài chấm giao diện hôm nay không đăng nhập theo vai; bộ kiểm chung của hàng 1r mở mọi màn bằng một người
giữ đủ bốn vai. Hàng này khai cửa vào của từng màn trong sổ màn, dựng một cửa đăng nhập theo vai dùng chung, và cho bộ kiểm
trình duyệt đi từng cặp vai × màn: cặp được vào thấy màn thường, cặp bị chặn thấy đúng «Không đủ quyền» và không lộ dữ liệu.
Hàng không dựng màn, không sửa mã sản phẩm. Hạng ghi trên lộ trình là T3 (giám sát giữ T3: hàng nằm trên đường tới hàng 10);
máy suy theo tệp chạm sẽ ra T2 vì không chạm `tools/**`.

Source input: hàng `9b` của `docs/plan/lo-trinh.json`, ô `_acceptance/kiem-vai-theo-man/opportunity.md` (build, Manh Phan,
2026-11-13), quyết định 0017 (`wiki/decisions/0017-actor-surface-coverage-pilot.md`), bảng quyền 9a (`ontology/actions.yaml`,
`src/modules/identity/permissions.ts`), bảng nút 9e (`design/vai-man-nut.md`), bộ kiểm có phiên của 1r
(`playwright.db.config.ts`, `tests/e2e-db/phien.setup.ts`). Luật sản phẩm: không chạm SP-1, SP-3, SP-4 (bài kiểm và một khoá
dữ liệu của sổ màn; phép đo rò rỉ ở AC-6 đo giữa các vai trong một sàn).

## Criteria

- AC-1: Given sổ màn `design/screens.yaml`, When chạy `make check`, Then mỗi màn có `audience` `staff` hay `public` mang khoá
  `vao` (tên một thao tác trong `ontology/actions.yaml`, hoặc `null` = mọi thành viên của sàn), màn `built` không trỏ thao tác
  `planned`; và trên bản sao sổ màn thiếu khoá, trỏ tên lạ, hay màn built trỏ thao tác planned thì kiểm tra đỏ với thông điệp
  ghim `<màn>: <lỗi>`.
- AC-2: Given sổ màn và bốn vai của `ontology/roles.yaml`, When bộ kiểm vai × màn chạy, Then tập cặp nó đi bằng đúng tích (màn
  `built` của nhân viên) × (bốn vai) — hôm nay 5 × 4 = 20 cặp — và mỗi màn ngoài ma trận có lý do viết sẵn (`planned`, `dev`);
  các bước trình duyệt thật sự chạy, đọc từ báo cáo của lượt, bằng đúng tập cặp ấy theo khổ đã chốt (lệch thì đỏ, ghim cặp thừa
  hay thiếu); và trên bản sao sổ màn thêm một màn built của nhân viên, tập cặp tự có thêm bốn cặp của màn ấy (không ai phải
  sửa bài).
- AC-3: Given lượt kiểm có cơ sở dữ liệu của dãy, When lượt bắt đầu, Then MỘT cửa dùng chung tạo sàn mẫu thử với bốn người mỗi
  người đúng một vai cùng một người chứng, đăng nhập mỗi người đúng một lần qua màn đăng nhập thật bằng mã trong hộp thư thử,
  và lưu phiên từng vai; bài kiểm vai × màn chỉ nhận phiên từ cửa ấy — tệp bài của hàng này tự gõ email hay mã đăng nhập thì
  `make check` đỏ với thông điệp ghim `<tệp>: tu dang nhap, dung cua chung`.
- AC-4: Given phiên của một vai và một màn mà `allowedScope([vai], vao)` cho vào, When mở màn, Then trang ở trạng thái thường:
  không có khối «Không đủ quyền», tiêu đề `h1` là tên màn trong sổ; màn Đăng nhập thì đẩy người đã đăng nhập về Hôm nay.
- AC-5: Given phiên của một vai và một màn mà bảng quyền không cho vào, When mở màn, Then trang có đúng một khối «Không đủ
  quyền» (tiêu đề «Không đủ quyền», đường về Hôm nay), ở mọi khổ mà Hỏi-1 chốt.
- AC-6: Given sàn mẫu có người chứng không đăng nhập, When một vai bị chặn mở màn, Then HTML trang và mọi phản hồi mạng lúc tải
  (ghi được ít nhất một) không chứa tên hay email của người chứng; và trên cùng sàn, cùng lượt, Quản trị sàn mở màn Thành viên
  thì CÙNG hai đường đo ấy thấy người chứng — trên trang và trong ít nhất một phản hồi (đối chứng dương).
- AC-7: Given một màn có mục trên thanh bên, When mỗi vai mở ứng dụng ở khổ 1440 và ở khổ 360 (ngăn điều hướng), Then mục dẫn
  tới màn ấy hiện khi vai được vào và vắng khi vai bị chặn; và `make check` đỏ với thông điệp ghim `<màn>: thanh ben khai <a>, so man khai <b>` khi thanh bên khai
  thao tác khác sổ màn.
- AC-8: Given ba bản phá thử trên bản sao cây — trang Thành viên bỏ kiểm `listMembers`; sổ màn khai `vao: null` cho Thành
  viên; khối «Không đủ quyền» in tên người chứng — When chạy cặp liên quan ở khổ 1440, Then mỗi bản đỏ với đúng thông điệp
  ghim `members × <vai> @1440: <mong gì>` và cây gốc chạy cùng cặp thì xanh.

## Coverage

Quét bằng skill `morphological-scan` (preset test-matrix, chế độ máy tự trả lời).

Chân sản phẩm: sổ màn `[SUY-TỪ-REPO: design/screens.yaml]`, bảng quyền `[SUY-TỪ-REPO: ontology/actions.yaml]`, cửa trang
Thành viên `[SUY-TỪ-REPO: src/app/(app)/members/page.tsx]`, thanh bên `[SUY-TỪ-REPO: src/app/(app)/nav.ts]`, khối Không đủ
quyền `[SUY-TỪ-REPO: src/components/templates/page-state.tsx]`, cấu hình có phiên `[SUY-TỪ-REPO: playwright.db.config.ts]`.
Chân ngành: đăng nhập một lần ở dự án chuẩn bị rồi lưu trạng thái trình duyệt theo vai `[NGÀNH: Playwright — Authentication,
multiple signed in roles]`; kiểm quyền theo ma trận vai × tài nguyên gồm đường bị từ chối `[NGÀNH: OWASP WSTG — Testing for
Bypassing Authorization Schema]`.

| Trục | Giá trị | Thước CE |
|---|---|---|
| Vai | Đầu chủ · Đầu khách · Trưởng nhóm · Quản trị sàn (mỗi người một vai) | `ontology/roles.yaml` |
| Màn | built nhân viên (5) · planned (Liên hệ) · dev (bản mẫu) | sổ màn |
| Kỳ vọng | được vào · bị chặn · đẩy đi (Đăng nhập) | `vao` + `allowedScope` |
| Lớp thấy | khối trên trang · thanh bên · HTML và mạng | AC-4…AC-7 |
| Khổ | 360 · 414 · 1024 · 1440 | Hỏi-1 |
| Hướng phép đo | xanh trên cây lành · đỏ trên bản phá | AC-1, AC-3, AC-7 (`make check`), AC-8 (trình duyệt) |

Core: built × mọi vai × được vào (AC-4) · built × vai bị chặn (AC-5, AC-6) · thanh bên (AC-7) · khai sổ (AC-1, AC-2) · cửa
đăng nhập (AC-3) · phá thử (AC-8). Later: người chưa đăng nhập × màn nhân viên (hôm nay Hôm nay, Bảng hàng, Đã gửi mở cho người
chưa đăng nhập với dữ liệu mẫu — hàng 10 đóng); người giữ nhiều vai (cộng quyền đã đo ở 9a và `tests/nav-roles.test.tsx`);
đổi vai giữa phiên (`members.spec.ts` của hàng 9). Never: phiên giả không qua màn đăng nhập.

## Đường đo

- «Bộ kiểm trình duyệt đi đủ mọi cặp vai và màn trong sổ»: số cặp bộ kiểm đi so với tích màn × vai từ sổ — dòng `vai x man:
  <n> cap` của lượt có phiên · AC-2 bảo đảm.
- «Gỡ chặn một cặp không được vào thì bộ kiểm đỏ»: ba bản phá thử đỏ đúng thông điệp, cây gốc xanh · AC-8 bảo đảm.

## Vai × Màn

Kỳ vọng hôm nay, sinh từ `vao` của sổ màn và bảng quyền 9a; bộ kiểm đi đúng các ô này.

| Màn | Đầu chủ | Đầu khách | Trưởng nhóm | Quản trị sàn |
|---|---|---|---|---|
| today | được — thấy Hôm nay | được — thấy Hôm nay | được — thấy Hôm nay | được — thấy Hôm nay |
| inventory | được — thấy Bảng hàng | được — thấy Bảng hàng | được — thấy Bảng hàng | được — thấy Bảng hàng |
| sent | được — thấy Đã gửi | được — thấy Đã gửi | được — thấy Đã gửi | được — thấy Đã gửi |
| members | chặn — Không đủ quyền, không lộ người | chặn — Không đủ quyền, không lộ người | chặn — Không đủ quyền, không lộ người | được — thấy người chứng |
| sign-in | được — đẩy về Hôm nay | được — đẩy về Hôm nay | được — đẩy về Hôm nay | được — đẩy về Hôm nay |

## Out of scope

- Bản mẫu (`/proto/**`) và lệnh chụp ảnh của các hàng khác chạy dưới một vai đã đăng nhập — ngoài hợp đồng; cách làm ghi ở
  Notes (Ngoài-1). Hàng này chỉ dựng cửa đăng nhập sao cho việc ấy dùng lại được.
- Sửa trang Thành viên và thanh bên để đọc thẳng `vao` từ sổ màn — hàng 10.
- Đưa `phien.setup.ts` của 1r và `members.spec.ts` của 9 về cửa đăng nhập chung — việc riêng, không sửa tệp bài của hàng khác.
- Kiểm tới cấp NÚT: hàng này kiểm tới cấp MÀN (vào được hay bị chặn). Bảng nút theo vai (`design/vai-man-nut.md`, hàng 9e) hôm
  nay chỉ có 2 màn vì nút của Bảng hàng, hồ sơ căn, Đã gửi nằm trong thành phần dùng chung mà công cụ quét không đi theo, và
  hầu hết thao tác ghi còn `planned`. Khi bảng có màn, ma trận của hàng này mở rộng sang nút rẻ (cùng lần mở trang) — việc
  riêng, giám sát quyết ai làm.
- Chạy trên CI — hàng 1s đưa Postgres vào CI; trước đó bộ chạy ở máy dãy.

## Notes

- Ngoài-1 (bản mẫu dưới một vai): thêm vào `playwright.db.config.ts` một dự án `ban-mau` phụ thuộc dự án `vai`, mở
  `/proto/<slug>` với `storageState: phienCuaVai("ListAgent")` (hay vai hàng ấy cần) và chụp ảnh; thanh trên khi ấy có tên sàn
  `[Sàn mẫu thử vai]` thay vì «Đăng nhập». Lệnh chụp của từng hàng gọi đúng dự án ấy. Đề nghị giám sát giao như một việc phụ.
- Hỏi-2 (chỗ đặt luật vào màn): bản nháp theo khuyến nghị — khoá `vao` trong sổ màn. Nếu chủ kho chọn lối khác, AC-1 và AC-7
  đổi nguồn đọc, các AC còn lại giữ nguyên.
- Hạng: lộ trình và giám sát ghi T3; tệp chạm (`tests/**`, `design/screens.yaml`, `playwright.db.config.ts`) cho máy suy T2.
