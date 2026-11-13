---
schema_version: 1
feature: "Mỗi màn được kiểm bằng từng vai ở bốn khổ màn hình, vai không được vào thấy đúng Không đủ quyền và không lộ dữ liệu"
slug: kiem-vai-theo-man
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [cli]
screens: []
status: approved
approved_by: Manh Phan
approved_at: 2026-11-13
design_doc: _acceptance/kiem-vai-theo-man/design.md
---

# Acceptance Contract: kiem-vai-theo-man

## Context

Quyết định 0017: bài chấm giao diện hôm nay không đăng nhập theo vai; bộ kiểm chung của hàng 1r mở mọi màn bằng một người
giữ đủ bốn vai. Hàng này khai cửa vào của từng màn trong sổ màn, dựng một cửa đăng nhập theo vai dùng chung, và cho bộ kiểm
trình duyệt đi từng cặp vai × màn: cặp được vào thấy màn thường, cặp bị chặn thấy đúng «Không đủ quyền» và không lộ dữ liệu.
Giám sát gộp thêm (2026-11-13, tin G-1311-78): sổ màn là MỘT chỗ khai cho mỗi màn — cần quyền gì để vào VÀ có những nút
nào; công cụ sinh bảng Vai × Màn tới cấp nút phủ mọi màn của sổ và khung App Shell; ma trận trình duyệt so nút mỗi vai thấy
với bảng. Hàng không dựng màn. Mã sản phẩm chỉ đổi một chỗ: nút theo quyền mang thêm một dấu đọc được (không đổi hình, không
đổi luật). Hạng T3: chạm `tools/coverage_matrix/buttons.py` và `src/modules/identity/ui/` (hai đường hạng cao, nêu đích danh ở
trang cổng).

Source input: hàng `9b` của `docs/plan/lo-trinh.json`, ô `_acceptance/kiem-vai-theo-man/opportunity.md` (build, Manh Phan,
2026-11-13), quyết định 0017 (`wiki/decisions/0017-actor-surface-coverage-pilot.md`), bảng quyền 9a (`ontology/actions.yaml`,
`src/modules/identity/permissions.ts`), bảng nút 9e (`design/vai-man-nut.md`), bộ kiểm có phiên của 1r
(`playwright.db.config.ts`, `tests/e2e-db/phien.setup.ts`). Luật sản phẩm: không chạm SP-1, SP-3, SP-4 (bài kiểm và một khoá
dữ liệu của sổ màn; phép đo rò rỉ ở AC-6 đo giữa các vai trong một sàn).

## Criteria

- AC-1: Given sổ màn `design/screens.yaml`, When chạy `make check`, Then mỗi màn có `audience` `staff` hay `public` — kể cả
  màn `planned` — mang khoá `vao` (tên một thao tác trong `ontology/actions.yaml`, hoặc `null` = mọi thành viên của sàn) và khoá
  `nut` (danh sách thao tác có nút trên màn, mỗi tên có trong bảng quyền; danh sách rỗng được), cùng `nut_chung` (nút không
  theo quyền, như «Chép đường dẫn»); màn `built` không lấy thao tác `planned` làm `vao`; sổ có khối `khung` khai nút của thanh
  trên App Shell; và trên bản sao sổ màn thiếu khoá, trỏ tên lạ, hay màn built lấy thao tác planned làm `vao` thì kiểm tra đỏ
  với thông điệp ghim `<màn>: <lỗi>`.
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

- AC-9: Given sổ màn và mã, When công cụ sinh bảng Vai × Màn tới cấp nút chạy, Then nó đọc tên thao tác trong thư mục của
  trang VÀ trong đúng các tệp giao diện mô-đun (`src/modules/<m>/ui/`) mà trang (hay khung) thật sự nhập — đi theo tên được
  nhập qua cửa `ui`, qua thành phần trung gian trong `src/components/`, và qua nhập tương đối trong mô-đun; không gán cả mô-đun
  cho màn —, giữ MỌI màn của sổ (cả màn chưa có trang, cả màn chưa tìm thấy tên nào), gộp nút khai với nút tìm thấy: nút khai
  mà chưa thấy trong mã mang dấu «dự kiến»; và trên bản sao, một màn đã dựng mà mã có một thao tác chưa khai trong `nut` — đặt
  thẳng trong trang, trong tệp giao diện mô-đun trang nhập, hay qua một thành phần trung gian — thì `make check` đỏ với thông
  điệp ghim `<màn>: ma co <thao tác> chua khai`; một nút khai mà thao tác không có trong bảng quyền thì đỏ `<màn>: nut <tên>
  khong co trong bang quyen`.
- AC-10: Given bảng sinh ra (`design/vai-man-nut.md`), When đọc bảng, Then có đúng một mục cho mỗi màn của sổ cộng một mục
  khung App Shell (ô tìm ⌘K, đổi sàn, đăng xuất, cách xem đã lưu); mỗi mục có bốn hàng vai, cột «Nút theo quyền» (thao tác,
  phạm vi, dấu «dự kiến») và cột «Nút không theo quyền»; tệp lệch bảng thì `make check` đỏ như hôm nay.
- AC-11: Given phiên của một vai và một màn được vào, When mở màn, Then mỗi nút theo quyền đang hiện mang dấu thao tác; dấu
  nằm trong vùng khung App Shell (thanh trên, cột thứ hai) được so với mục `khung` của bảng, dấu còn lại so với mục của màn;
  mỗi dấu nằm trong ô của vai ấy (không vai nào thấy nút ngoài ô của mình); tập nút `mo_san` thấy được bằng đúng bảng viết
  sẵn cho từng cặp (từ sổ màn ∩ ô của vai, kể cả cặp được vào mà không có ô, như Bảng hàng × Quản trị sàn); dấu là một thuộc
  tính gắn lên chính phần tử nút, không thêm phần tử nào vào trang; và trên bản sao cây, (a) đổi nút «Mời người» sang một thao
  tác khác mà không sinh lại bảng → members × CompanyAdmin @1440 đỏ `thieu nut inviteMember` và `thay nut <thao tác> khong co
  trong o`; (b) đặt một nút lưu cách xem vào thân màn Thành viên → đỏ `members × CompanyAdmin @1440: thay nut saveView khong co
  trong o`; (c) cho Quản trị sàn quyền lưu cách xem trong bảng quyền mà không sinh lại bảng → đỏ `<khung hay inventory> ×
  CompanyAdmin @1440: thay nut saveView khong co trong o`.

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
| Cấp | vào màn · nút theo quyền · nút không theo quyền | AC-4…AC-7, AC-9…AC-11 |
| Chỗ nút sống | thư mục trang · giao diện mô-đun · khung App Shell | AC-9, AC-10 |
| Hướng phép đo | xanh trên cây lành · đỏ trên bản phá | AC-1, AC-3, AC-7 (`make check`), AC-8 (trình duyệt) |

Core: built × mọi vai × được vào (AC-4) · built × vai bị chặn (AC-5, AC-6) · thanh bên (AC-7) · khai sổ (AC-1, AC-2) · cửa
đăng nhập (AC-3) · phá thử (AC-8) · khai nút và sinh bảng mọi màn (AC-9, AC-10) · so nút trong trình duyệt (AC-11). Later: người chưa đăng nhập × màn nhân viên (hôm nay Hôm nay, Bảng hàng, Đã gửi mở cho người
chưa đăng nhập với dữ liệu mẫu — hàng 10 đóng); người giữ nhiều vai (cộng quyền đã đo ở 9a và `tests/nav-roles.test.tsx`);
đổi vai giữa phiên (`members.spec.ts` của hàng 9). Never: phiên giả không qua màn đăng nhập.

## Đường đo

- «Bộ kiểm trình duyệt đi đủ mọi cặp vai và màn trong sổ»: số cặp bộ kiểm đi so với tích màn × vai từ sổ — dòng `vai x man:
  <n> cap` của lượt có phiên · AC-2 bảo đảm.
- «Gỡ chặn một cặp không được vào thì bộ kiểm đỏ»: ba bản phá thử đỏ đúng thông điệp, cây gốc xanh · AC-8 bảo đảm.

## Vai × Màn

Hàng này không dựng hay đổi màn nào, nên không khai `screens` (cổng chứng minh màn chỉ áp cho hàng dựng màn). Nó đo mọi cặp
vai × màn của sổ trong trình duyệt; kỳ vọng hôm nay ở mục «Kỳ vọng vai × màn» dưới đây, sinh từ `vao` của sổ màn và bảng
quyền 9a.

## Kỳ vọng vai × màn

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
- Gắn kiểm quyền cho nút đang nối tay trong thành phần của hàng 4, 3b, 3e (nút chưa đi qua nút theo quyền) — để hàng 10 và
  từng hàng ấy; bảng sẽ hiện chúng ở cột «Nút không theo quyền» hay không hiện cho tới khi chúng đi qua nút theo quyền.
- Thêm thao tác mới vào ontology cho màn Đã gửi — ghi nợ; hôm nay Đã gửi khai `nut: []`.
- Đổi luật vào hay ô quyền nào của bảng quyền — hàng này chỉ khai và đo; ô quyền đổi ở hàng của nghiệp vụ ấy.
- Chạy trên CI — hàng 1s đưa Postgres vào CI; trước đó bộ chạy ở máy dãy.

## Notes

- Ngoài-1 (bản mẫu dưới một vai): thêm vào `playwright.db.config.ts` một dự án `ban-mau` phụ thuộc dự án `vai`, mở
  `/proto/<slug>` với `storageState: phienCuaVai("ListAgent")` (hay vai hàng ấy cần) và chụp ảnh; thanh trên khi ấy có tên sàn
  `[Sàn mẫu thử vai]` thay vì «Đăng nhập». Lệnh chụp của từng hàng gọi đúng dự án ấy. Đề nghị giám sát giao như một việc phụ.
- Hỏi-2 (chỗ đặt luật vào màn): bản nháp theo khuyến nghị — khoá `vao` trong sổ màn. Nếu chủ kho chọn lối khác, AC-1 và AC-7
  đổi nguồn đọc, các AC còn lại giữ nguyên.
- Hạng T3: chạm `tools/coverage_matrix/buttons.py` (công cụ sinh bảng) và `src/modules/identity/ui/permitted-action.tsx` (thêm
  dấu thao tác, không đổi hình hay luật).
- Bảng hiện ra một điều chủ kho nên thấy: Quản trị sàn không có ô nào trên Bảng hàng (không lưu cách xem, không thao tác căn
  nào), và `viewListings` không cho Quản trị sàn — khi hàng 10 đặt `vao: viewListings` cho Bảng hàng, Quản trị sàn sẽ bị chặn
  khỏi Bảng hàng nếu bảng quyền giữ nguyên.
