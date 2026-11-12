# Thiết kế: bộ kiểm chung chạy được khi cần đăng nhập, và không lỡ nhịp khi máy chậm (hàng 1r)

Ngày: 2026-11-12 · Hạng T3 (chạm `tools/e2e_templates/`) · Dãy H của đợt nen.

## Vấn đề

1. Bộ kiểm chung sinh từ sổ màn (hàng 1f) mở mỗi màn khi chưa đăng nhập, trên máy không có cơ sở dữ liệu. Màn Thành viên
   (hàng 9) đẩy người chưa đăng nhập về trang đăng nhập, nên chủ kho cho nó «bỏ qua có điều kiện»: màn được bỏ nếu khai tên
   một bài trình duyệt có đăng nhập đang đo khung và axe của nó (`SESSION_SCREENS` trong `tools/e2e_templates/register.ts`).
   Hàng 10 nối dữ liệu thật: mọi màn sẽ cần đăng nhập, danh sách bỏ qua sẽ dài ra bằng cả sổ, và bộ kiểm chung thành vỏ rỗng.
2. Hàng 1o trượt cổng hai lần vì bài kiểm lỡ nhịp trên máy chậm: bài đếm ngay sau khi bấm mở ngăn trên điện thoại; bài chờ
   băng báo mất mạng hết 5 giây mặc định ở khổ 1024. Bản sửa của 1o (chờ ngăn hiện, chờ hết chuyển động) nằm chép ở ba tệp
   (`tests/e2e/frame.spec.ts`, `tests/e2e/app-shell.spec.ts`, `tests/e2e-db/members.spec.ts`) — mục ngoài hợp đồng «hàm mở
   ngăn bị chép nguyên» của hồ sơ 1o.

## Cách làm

### A. Một phiên thử cho lượt có cơ sở dữ liệu

- `tests/e2e-db/setup.ts` (khâu chuẩn bị chung của lượt có cơ sở dữ liệu) thêm một sàn thử và một người thử
  `[Tên] Phiên thử` mang đủ bốn vai (`ListAgent`, `BuyerAgent`, `TeamLead`, `CompanyAdmin`), địa chỉ thư thuộc lượt chạy.
- Một dự án Playwright mới `phien` trong `playwright.db.config.ts` chạy `tests/e2e-db/phien.setup.ts`: đăng nhập MỘT lần qua
  màn đăng nhập thật (mã lấy từ hộp thư thử của lượt, như các bài hàng 8, 9), lưu trạng thái trình duyệt vào tệp của lượt
  chạy. Không có đường tắt tạo phiên trong mã sản phẩm: phiên thử đi đúng cửa người dùng đi.
- Bộ kiểm chung trong lượt có cơ sở dữ liệu (`tests/e2e-db/screens.spec.ts`, dự án phụ thuộc `phien`) mở mọi màn bằng phiên
  ấy. Các bài cũ của hàng 8, 9, 1m tự đăng nhập như trước, không đổi.
- Đủ bốn vai để mọi màn mở ở trạng thái thường, không rơi vào «không đủ quyền». Đi từng cặp vai × màn là hàng 9b
  (`kiem-vai-theo-man`), cần bảng quyền của hàng 9a; hàng này không dựng ma trận vai, dòng «Vai × Màn» vẫn in «chờ bảng quyền».

### B. Một bộ dựng bài, hai lượt chạy

- Phần dựng bài đang nằm trong `tests/e2e/screens/screens.spec.ts` dời sang `tools/e2e_templates/suite.ts`, nhận một tham
  số chế độ: `khong-phien` (lượt không cơ sở dữ liệu — `make e2e`, CI) hay `co-phien` (lượt có cơ sở dữ liệu). Hai tệp kiểm
  chỉ gọi nó: `tests/e2e/screens/screens.spec.ts` và `tests/e2e-db/screens.spec.ts`. Công thức, ca phá, bản chạy chậm và
  vùng hiệu chuẩn giữ nguyên lời; vùng hiệu chuẩn chỉ chạy ở lượt không phiên (một lần là đủ).
- Màn nào cần đăng nhập không khai tay nữa: người chạy (`runner.ts`) mở màn rồi nhìn đường địa chỉ.
  - Lượt có phiên: màn bị đẩy về trang đăng nhập là ĐỎ, thông điệp ghim `<màn>: phien-thu — bi day ve dang nhap`. Ca phá:
    xoá cookie phiên trước khi mở, chính hàm kiểm ấy phải đỏ đúng thông điệp.
  - Lượt không phiên: màn bị đẩy về trang đăng nhập được giao sang lượt có phiên, bỏ qua có tên
    `can dang nhap — do o luot co phien`. Không bỏ im lặng: lý do hiện trong báo cáo của Playwright.
- `SESSION_SCREENS` và `sessionSuiteProblem` gỡ khỏi `register.ts`: danh sách bỏ qua vì cần đăng nhập về rỗng. Lượt có phiên
  in một dòng `bo qua can dang nhap: 0`.
- Màn dành cho người chưa đăng nhập (màn Đăng nhập đẩy người đã đăng nhập sang trang khác) khai trong một danh sách nhỏ
  `SIGNED_OUT_SCREENS` của `register.ts`, có lý do; lượt có phiên bỏ nó có tên, lượt không phiên đo nó như hôm nay. Màn trong
  danh sách mà không đẩy người đã đăng nhập đi thì đỏ (danh sách không được thành chỗ giấu màn).

### C. Chờ hiện hẳn rồi mới đo

- `tools/e2e_templates/settle.ts` (mới) giữ hai hàm dùng chung:
  - `openSheet(page)` — bấm nút mở thanh bên cho tới khi ngăn hiện (lượt bấm trước khi trang sẵn sàng không làm gì), rồi
    chờ mọi chuyển động trên trang dừng. Thông điệp ghim khi hết giờ: `ngan khong mo`, `ngan chua dung`.
  - `shown(locator, name)` — chờ phần tử hiện và chuyển động của nó dừng, với hạn đủ cho máy giảm tốc bốn lần (20 giây thay
    cho 5 giây mặc định). Thông điệp ghim: `<name>: khong hien`, `<name>: chua dung`.
- Ba bản chép của hàm mở ngăn (frame, app-shell, members) và bài băng báo mất mạng (frame: bài mất mạng, bài axe 18 lượt) gọi
  hai hàm này. Không đổi điều bài đo.
- Mỗi hàm có cặp ca hai chiều trong `tests/e2e/settle.spec.ts` (thư mục bài của `make e2e`, trên trang bản mẫu): ngăn
  thật → xanh; ngăn bị gắn chuyển động không dừng → đỏ `ngan chua dung`; nút mở bị gỡ → đỏ `ngan khong mo`; băng báo không
  bao giờ hiện → đỏ `khong hien`.

### D. Lặp hai mươi lần dưới máy giảm tốc

- Lệnh đo `kiem_chung_lap` (dòng mới trong `_acceptance/config.yaml`): chạy các bài chờ ngăn và băng báo của
  `tests/e2e/frame.spec.ts`, `tests/e2e/app-shell.spec.ts`, `tests/e2e/settle.spec.ts` với `E2E_CPU_THROTTLE=4`
  (bộ hãm đã có của hàng 1f, tự chứng hãm có tác dụng) và `--repeat-each=20` ở khổ 360 và 1024 — hai khổ 1o đã trượt.
- Tập bài mang thẻ `@cho` có danh sách tên viết trước (`CHO_TESTS` trong `tools/e2e_templates/settle.ts`); bài kiểm đơn vị đòi
  mọi tên trong danh sách mang thẻ, gỡ thẻ khỏi một bài thì đỏ gọi tên bài ấy.
- Lệnh `kiem_chung_lap_phien` làm tương tự cho bài mở ngăn của `tests/e2e-db/members.spec.ts` trên Postgres dãy H.

## Hàng này thay một quyết định của chủ kho ở hàng 9

Ngày 2026-11-11, ở Cổng Bằng chứng của hàng 9, chủ kho chọn «màn cần đăng nhập: bỏ qua có điều kiện»: bộ kiểm chung bỏ qua
màn Thành viên, miễn có một bài đăng nhập khác đang đo khung và trợ năng của nó. Hàng 1r THAY cơ chế ấy bằng cơ chế mạnh hơn:
màn cần đăng nhập được bộ kiểm chung đo thật bằng một phiên thử, không còn bỏ qua. Duyệt phạm vi và kế hoạch của hàng này là
duyệt việc thay (giám sát cho thay, trả lời H-1211-6).

Ba ca kiểm cũ của cơ chế ấy và ca thay chúng:

| Ca cũ (hàng 9) | Ca thay (hàng 1r) |
|---|---|
| Màn cần đăng nhập không có bài trong bộ kiểm chung khi bài đăng nhập của nó đo khung và axe | Lượt có phiên: màn Thành viên có đủ bốn bài khung và bốn ca phá của hàng 1f, xanh ở bốn khổ (AC-2) |
| Bài đăng nhập khai cho màn không mở đường của màn thì đỏ | Lượt có phiên: màn bị đẩy về trang đăng nhập thì đỏ, ca phá xoá phiên chứng điều ấy (AC-1) |
| Bài đăng nhập khai cho màn không chạy axe thì đỏ | Lượt không phiên: màn bị đẩy về trang đăng nhập được giao sang lượt có phiên bằng tên, không bài nào xanh trên trang đăng nhập (AC-4); danh sách bỏ qua vì cần đăng nhập không còn (AC-3) |

Bài đăng nhập riêng của màn Thành viên (`tests/e2e-db/members.spec.ts`) vẫn giữ nguyên các bài axe của nó; chỉ thôi làm
«người gánh hộ» cho bộ kiểm chung. Không ca phá nào của hàng 1f bị đụng (AC-9).

### E. Lượt có cơ sở dữ liệu chạy trọn

- Khâu chuẩn bị chung đổi (thêm sàn thử, người thử) nên mọi bài cũ của hàng 8, 9, 1m, 1o trong `tests/e2e-db/` chạy lại
  trọn ở lệnh `kiem_chung_db_tron`, số bài so với nhánh chính.

## Lựa chọn và căn cứ

| Lựa chọn | Nguồn căn cứ |
|---|---|
| Phiên thử qua màn đăng nhập thật, lưu trạng thái trình duyệt, một lần mỗi lượt | Một lối sống: tạo phiên bằng mã sản phẩm phải mở đường tắt trong mô-đun danh tính (hạng T3, ngoài ranh giới); bài hàng 8, 9 đã đi cửa này |
| Đủ bốn vai, không ma trận vai | Mục tiêu: đề bài 1r «chỉ cần MỘT phiên thử… không dựng ma trận vai» |
| Nhận màn cần đăng nhập bằng đường địa chỉ, không khai tay | Một lối sống: khai trong `design/screens.yaml` là tệp ngoài ranh giới; khai tay trong `register.ts` lặp lại đúng danh sách hàng này phải gỡ |
| Lượt có phiên chạy ở máy dãy và lượt chấm, không ở CI | Chỉ người có — Hỏi-1 |
| Hàm chờ dùng chung ở `tools/e2e_templates/settle.ts` | Mục tiêu: lộ trình «các bài chờ ngăn hay băng báo hiện hẳn rồi mới đo», và mục ngoài hợp đồng «hàm mở ngăn bị chép nguyên» của 1o |
| Ca kiểm đơn vị của cơ chế «bỏ qua có điều kiện» (hàng 9) thay bằng ca của cơ chế mới | Giám sát cho thay (H-1211-6); chủ kho duyệt ở Cổng Phạm vi |

## Hỏi chủ kho

**Hỏi-1 — Lượt có đăng nhập chạy ở đâu?** CI hôm nay không có Postgres và tệp CI là của chủ kho.
- Khuyến nghị: chạy ở máy dãy và ở mỗi lượt chấm, như mọi bài đăng nhập hiện nay; lượt không phiên trên CI giao màn cần đăng
  nhập sang lượt có phiên bằng tên. Thêm một hàng lộ trình «CI có Postgres» phải xong trước hàng 10 (chủ kho sửa tệp CI).
- Lối khác: chủ kho thêm Postgres vào việc e2e của CI ngay trong hàng này. Giá: một commit của chủ kho vào tệp CI, CI chậm
  thêm vài phút mỗi lần chạy; đổi lại CI đo được mọi màn ngay khi hàng 10 gộp.

## Trạng thái và rủi ro

- Lượt có phiên dài hơn: năm màn × tám bài × bốn khổ, cộng bản chạy chậm ở khổ 1440. Ước 6–10 phút trên máy dãy.
- Phiên thử hết hạn giữa lượt: thời hạn phiên của hàng 8 dài hơn một lượt chạy; nếu hết, ca chính đỏ đúng thông điệp
  `phien-thu`, không đỏ mờ.
- Luật sản phẩm: không chạm SP-1, SP-3, SP-4 (chỉ sửa bài kiểm và công cụ kiểm; `pg.Client` trong bài kiểm nằm ngoài phạm vi
  dấu hiệu `src/**`, `db/**`).
