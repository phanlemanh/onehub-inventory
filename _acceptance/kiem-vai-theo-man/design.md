# Thiết kế — Kiểm vai theo màn (hàng 9b)

## Việc cần giải

Quyết định 0017 ghi: bài chấm giao diện hôm nay không đăng nhập theo vai. Bộ kiểm chung của hàng 1r mở mọi màn bằng một
người giữ đủ bốn vai, nên không bài nào biết một Đầu chủ đứng ở màn Thành viên thì thấy gì. Hàng 10 (dữ liệu thật) sẽ cho
mỗi màn một luật vào riêng; trước đó phải có một lưới bắt được ngay khi một cặp vai × màn bị mở nhầm.

Hàng này không dựng màn và không đổi giao diện. Nó thêm:

1. **Cửa vào của từng màn, khai trong sổ màn.** Mỗi màn của nhân viên trong `design/screens.yaml` có thêm khoá `vao`: tên
   thao tác trong bảng quyền mà người phải có để vào màn, hay `null` khi mọi thành viên của sàn đều vào được. Hôm nay chỉ
   màn Thành viên có cửa (`listMembers`); Hôm nay, Bảng hàng, Đã gửi là `null`.
2. **Một cửa đăng nhập theo vai, dùng chung.** Một mô-đun bài kiểm duy nhất tạo một sàn mẫu thử với một người cho mỗi vai
   (và một người chứng không bao giờ đăng nhập), đăng nhập từng người MỘT lần qua màn đăng nhập thật bằng mã trong hộp thư
   thử, rồi lưu phiên trình duyệt của từng vai. Bài nào cần «một vai của sàn mẫu» thì xin phiên ở cửa này, không tự đăng nhập.
3. **Ma trận vai × màn trong trình duyệt.** Bộ kiểm sinh các cặp từ sổ màn và bảng quyền, mở từng cặp bằng phiên của vai ấy:
   cặp được vào thấy màn ở trạng thái thường; cặp bị chặn thấy đúng «Không đủ quyền» và trang không mang dữ liệu của sàn; mục
   dẫn tới màn trên thanh bên hiện hay ẩn theo cùng luật.
4. **Lưới ở `make check`.** Một bài kiểm không cần trình duyệt giữ sổ màn đủ khoá `vao`, tên thao tác có thật, thanh bên khai
   cùng thao tác với sổ màn, và tập cặp bộ kiểm đi bằng đúng tích màn × vai.

## Từ Quỹ hàng

Đã tìm ở `/Users/manhphan/dev/onehub-quy-hang` (commit `1729b11f`): không có Playwright hay bài kiểm trình duyệt nào
(`package.json` của các gói không khai Playwright), không có bài đi vai × màn. Quỹ hàng giữ quyền ở API và cơ sở dữ liệu:
`docs/adr/0006-vai-khu-va-loi-moi.md` mục 5 «Vai đọc lại mỗi lời gọi, không lưu trong phiên», và
`packages/api/src/settings/store.ts:59` trả `forbidden` khi vai không đủ. Giữ: vai đọc lại mỗi lần mở màn (bộ kiểm không
dựa vào vai lưu trong phiên). Bỏ: không có gì để bỏ. Mới ở kho này: lớp trình duyệt, vì Quỹ hàng không có.

## Cách làm

### Cửa vào của màn (`vao`)

- Đặt ở sổ màn vì sổ màn là chỗ máy đọc danh sách màn (`docs/plan/pham-vi-mvp-dot-1.md` N11: «khai danh sách vai và sổ
  màn cho máy đọc»). Không suy từ bảng nút của hàng 9e (`design/vai-man-nut.md`): ở bảng ấy «chặn» nghĩa là vai không có nút
  nào trên màn, không phải không được vào — Quản trị sàn không có thao tác căn nào nên sẽ thành «bị chặn khỏi Bảng hàng»,
  sai nghĩa.
- Giá trị so với vai bằng chính `allowedScope` của mô-đun danh tính (bảng quyền 9a): vai được vào khi `allowedScope([vai],
  vao) !== null`. Không chép luật thứ hai.
- Trang Thành viên và thanh bên hôm nay mỗi chỗ tự gọi `listMembers`. Hàng này không sửa mã trang; bài `make check` buộc thanh
  bên khai cùng thao tác với sổ màn, và bộ kiểm trình duyệt buộc trang làm đúng điều sổ khai. Đưa trang và thanh bên về đọc
  thẳng từ sổ màn là việc của hàng 10 (ghi ở Ngoài hợp đồng).

**Hỏi-2 — luật vào màn đặt ở đâu.** Sau hàng này luật «Thành viên chỉ cho Quản trị sàn» có mặt ở ba chỗ: trang, thanh bên,
sổ màn. AGENTS.md đòi mỗi luật một chỗ và quan hệ nghiệp vụ mới vào `ontology/` qua người duyệt. Ba lối:

- **Sổ màn (khuyên):** khoá `vao` trong `design/screens.yaml`; bài `make check` buộc thanh bên khớp sổ, bộ trình duyệt buộc
  trang khớp sổ; hàng 10 cho trang và thanh bên đọc thẳng từ sổ để còn một chỗ. Được: hàng này xong không đụng mã sản phẩm
  hay ontology. Mất: tới hàng 10 vẫn còn ba chỗ khai, có lưới giữ khớp.
- **Ontology:** thêm quan hệ màn → thao tác vào `ontology/` (cần chủ kho soi), sinh kiểu, trang và thanh bên đọc từ đó.
  Được: đúng luật «quan hệ mới vào ontology» ngay. Mất: hàng thành đổi ontology và sửa mã sản phẩm, dài hơn, chạm vùng hàng 10.
- **Thanh bên làm nguồn:** dùng thao tác khai trên mục thanh bên (đã có) làm kỳ vọng, không thêm khoá. Được: không thêm chỗ
  khai nào. Mất: màn không có mục thanh bên (Đăng nhập, hồ sơ sau này) không khai được cửa vào.

### Cửa đăng nhập theo vai

- Một dự án chuẩn bị của Playwright (`vai`) trong cấu hình có cơ sở dữ liệu, chạy trước các dự án ma trận. Nó tạo sàn
  `[Sàn mẫu thử vai]`, bốn người `[Tên] Đầu chủ`… mỗi người đúng MỘT vai, một người chứng `[Tên] Người chứng` giữ vai
  Đầu chủ nhưng không đăng nhập, đăng nhập bốn người qua `/login` và lưu bốn tệp phiên ngoài kho.
- Mô-đun cửa `tests/e2e-db/dang-nhap-vai.ts` xuất: danh sách vai, `phienCuaVai(vai)` (đường tệp phiên), `dangNhapBangMa(page,
  email)` (các bước đăng nhập), và `NGUOI_CHUNG` (tên, email phải không bao giờ lộ). Bài của 9b chỉ dùng `test.use({
  storageState: phienCuaVai(vai) })`. Bài kiểm `make check` đỏ khi một tệp bài của 9b tự gõ email hay mã đăng nhập.
- Các bài cũ (`phien.setup.ts` của 1r, `members.spec.ts` của 9) giữ cách đăng nhập của mình; chuyển sang cửa chung là việc
  riêng, không sửa tệp của hàng khác trong hàng này.

### Ma trận trong trình duyệt

- Cặp = màn đo × vai. Màn đo là màn `built` của nhân viên trong sổ. Hôm nay: Hôm nay, Bảng hàng, Đã gửi, Thành viên, Đăng
  nhập — 5 màn × 4 vai = 20 cặp. Màn ngoài ma trận phải có lý do viết sẵn: `planned` (chưa có trang — Liên hệ) và `dev`
  (bản mẫu, không có ở bản thật).
- Màn Đăng nhập với người đã đăng nhập: trang đẩy về Hôm nay. Đó là kỳ vọng của cả bốn cặp.
- Cặp được vào: trang không có `[data-slot="page-state"][data-kind="forbidden"]`, tiêu đề `h1` là tên màn lấy từ
  `ontology/labels.yaml` qua sổ màn. Màn Thành viên với Quản trị sàn còn phải hiện người chứng (đối chứng dương cho phép đo
  rò rỉ, cùng sàn, cùng lượt).
- Ma trận được đăng ký bằng cách lặp đầu ra hàm sinh cặp; sau lượt, một bước đối chiếu đọc báo cáo JSON của Playwright và so
  tập bước thật sự chạy với tập cặp (lệch thì đỏ).
- Cặp bị chặn: đúng một khối «Không đủ quyền» (`data-kind="forbidden"`, tiêu đề «Không đủ quyền», có đường về Hôm nay);
  HTML trang và mọi phản hồi mạng lúc tải (kể cả luồng dữ liệu của máy chủ React) không chứa tên hay email của người chứng.
- Thanh bên: ở 1440 và ở 360 (mở ngăn điều hướng) mục dẫn tới màn hiện với cặp được vào, không có với cặp bị chặn.
- Đường ghi phản hồi mạng có đối chứng dương: ở cặp Quản trị sàn × Thành viên chính đường ấy phải bắt được tên người chứng;
  ở cặp bị chặn, tập phản hồi ghi được rỗng thì đỏ.
- Tên bài và thông điệp ghim dạng `<màn> × <vai> @<khổ>: mong <kỳ vọng>, thấy <điều thấy>` để lượt đỏ nói ngay cặp nào.

### Khổ màn hình và thời gian chạy (câu Hỏi-1)

Bộ bài có cơ sở dữ liệu chạy một worker, máy đang tải cao. Hai lối:

- **B (khuyên):** đủ 20 cặp ở khổ 1440; ở ba khổ 360, 414, 1024 chỉ đi các cặp bị chặn (hôm nay 3) — vì cặp được vào ở bốn
  khổ đã có bộ kiểm chung 1r đo khung và trợ năng bằng phiên đủ vai, còn khác biệt theo vai trên màn được vào nằm ở nút (9e).
  20 + 3 × 3 = 29 lần mở trang cộng một lần mở cho thanh bên của Quản trị sàn ở 360, 4 + 4 = 8 bài, ước 1–1,5 phút trên máy rảnh.
- **A:** đủ 20 cặp ở cả bốn khổ: 80 lần mở trang, 16 bài, ước 3–4 phút.

Cả hai đều cộng một bài chuẩn bị (bốn lần đăng nhập, ước 20–30 giây). Không tăng thời gian chờ để che bài chậm, không sửa bài
có sẵn. Ảnh «Không đủ quyền» chỉ chụp ở 1440 và 360 cho trang bằng chứng.

### Gỡ chặn thì đỏ

Ba bản phá thử, chạy trên bản sao cây (worktree tạm), mỗi bản chạy đúng cặp liên quan ở khổ 1440:

1. Mở màn Thành viên cho mọi vai (bỏ dòng kiểm `listMembers` của trang) → đỏ `members × TeamLead @1440: mong Không đủ quyền`.
2. Khai `vao: null` cho Thành viên trong sổ màn (sổ nói mở, trang vẫn chặn) → đỏ `members × ListAgent @1440: mong màn thường`.
3. Cho khối «Không đủ quyền» in tên người chứng → đỏ `members × BuyerAgent @1440: lộ người chứng`.

Bài `make check` có cặp phá riêng trên bản sao sổ màn (khoá `vao` thiếu, tên thao tác lạ, thanh bên lệch).

## Ranh giới với hàng khác

- 1r: một phiên đủ vai, đo khung từng màn. 9b: từng vai, đo được vào hay bị chặn. Không sửa `tools/e2e_templates/`.
- 1s (PR #48): đưa Postgres vào CI. Khi 1s gộp, bộ 9b chạy trên CI cùng các bài có cơ sở dữ liệu; trước đó chỉ chạy ở máy dãy.
- 9e: bảng nút theo vai. 9b không kiểm nút.
- 10: luật vào cho Bảng hàng, Đã gửi theo dữ liệu thật; khi 10 đổi `vao` trong sổ, ma trận tự đổi kỳ vọng.

## Luật sản phẩm

Đã đọc `PRODUCT-INVARIANTS.md` (3 luật). Hàng chỉ thêm bài kiểm và một khoá dữ liệu trong sổ màn; không truy vấn cơ sở dữ
liệu ngoài bài kiểm (bài chuẩn bị dùng vai chủ của cơ sở dữ liệu tạm như `tests/e2e-db/setup.ts` đã làm — không nằm trong
`src/**` nên không chạm dấu hiệu SP-1). Phép đo «không lộ dữ liệu» gần SP-1 (giữa vai trong một sàn, không giữa hai sàn).
Không chạm SP-3, SP-4.
