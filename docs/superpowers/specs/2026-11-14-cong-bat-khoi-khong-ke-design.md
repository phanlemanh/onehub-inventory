# Cổng bắt khối không kê — thiết kế (hàng 1q)

Ngày: 2026-11-14 · Hồ sơ: `_acceptance/cong-bat-khoi-khong-ke/` · Hạng T3 (`tools/**`) · Không có màn.

## 1. Vấn đề

Cổng chứng minh màn (`tools/proof_gate/check.py`, quyết định 0023, hàng 1n) chỉ xét khối mà hồ sơ của vòng TỰ KÊ trong bảng
Khối. Một khối tạo tay mà hồ sơ không kê thì cổng không biết nó có: không đòi ứng viên ReUI, không đòi dòng sổ khối. Giám sát
thấy kẽ này khi rà cổng ngày 2026-11-12; chủ kho quyết «build» ngày 2026-11-13.

Điều kiện bật (ô lộ trình 1q): thành phần mới xuất hiện trong sổ thành phần sinh (`design/component-registry.json`) so với nhánh
chính, nằm ngoài thư mục nhà cung cấp (`src/components/ui`, `src/components/reui`), mà không có trong bảng Khối của hồ sơ nào
đang mở thì `make check` đỏ; ca phá tương ứng đỏ đúng câu.

## 2. Luật mới, một câu

Khi luật 0023 đang bật (kho có `design/so-khoi.yaml`), mỗi TỆP của sổ thành phần nằm ngoài thư mục nhà cung cấp phải được kê ở
ít nhất một trong ba chỗ; không chỗ nào thì lưới đỏ một dòng mã `khoi-khong-ke` gọi tên tệp và các thành phần của nó:

1. **sổ khối** — có dòng mà `tep` là tệp ấy, hay `ten` là một thành phần của tệp ấy (khối đã nhập kho, mọi vòng đã đóng);
2. **danh sách có trước** — tệp có tên trong `tools/proof_gate/thanh-phan-co-truoc.yaml` (khối có từ trước hàng 1q, xem §4);
3. **bảng Khối của một hồ sơ đang mở** — bảng Khối (của một màn hay của khuôn bọc) của hồ sơ trạng thái `draft`, `approved`,
   `implemented` hay `verified` có dòng nêu một thành phần của tệp ấy, ở bậc nào cũng được.

Chỗ 3 là chỗ của vòng đang dựng: vòng kê khối ngay khi tạo nó. Từ `implemented`, luật nhập kho có sẵn của 0023 đòi tiếp dòng sổ
khối cho khối bậc `reui` hay `ve-tay`, nên khi vòng đóng thì khối đã nằm ở chỗ 1. Hồ sơ đã đóng không còn là chỗ kê.

## 3. Vì sao kê theo tệp, không theo tên thành phần

Sổ thành phần hôm nay có một mục cho mỗi tệp. PR #58 (design-assembly, chưa gộp) đổi sang một mục cho mỗi thành phần xuất ra:
`region-header.tsx` thành `RegionTitle`, `RegionToolbar`, `RegionHeader`. Kê theo tên thì sau PR #58 cổng sẽ đòi kê từng thành
phần con, và một hằng số đứng đầu tệp (`LOADING_STEPS_MS` hôm nay) cũng thành «khối». Kê theo tệp đúng với cả hai hình của sổ:
mọi mục đều có trường `file`, một khối là một tệp, và một bảng Khối nêu thành phần nào của tệp cũng là đã kê tệp ấy. Dòng đỏ
nêu tệp một lần, kèm tên các thành phần của nó.

## 4. So với nhánh chính mà không đọc lịch sử git

CI lấy bản sao nông, không có lịch sử. Bài học của hàng 7c và 1s: bài kiểm không đọc lịch sử git. Cổng mới không gọi git.

«So với nhánh chính» được làm bằng một tệp cố định: `tools/proof_gate/thanh-phan-co-truoc.yaml` kê đúng các tệp của sổ thành
phần ngoài thư mục nhà cung cấp mà nhánh chính đã có lúc hàng 1q dựng và chưa có ở chỗ 1 (sổ khối). Mỗi dòng có `tep`, `ten`
(các thành phần lúc ghi) và `ly_do`. Danh sách này không lớn thêm: bài kiểm của hàng ghim đúng tập tệp của nó, nên thêm một
tệp vào danh sách là sửa bài kiểm trong `tools/**` (hạng T3, chủ kho duyệt). Thứ mới từ sau hàng 1q đi chỗ 1 hay chỗ 3.

Hôm nay (nhánh chính `01c11df`) danh sách gồm 12 tệp: `action-permission.tsx`, `column-filter-cell.tsx`, `region-header.tsx`,
`region-state.tsx` (thư mục `candidate`), và `app-shell.tsx`, `app-shell/place-change.tsx`, `app-shell/second-column.tsx`,
`nav-menu.tsx`, `page-skeleton.tsx`, `page-state.tsx`, `screen-banner.tsx`, `theme.tsx` (thư mục `templates`). Lúc gộp, máy
tính lại danh sách trên nhánh chính mới nhất; tệp nào thêm vào nhánh chính sau `01c11df` mà không có ở chỗ 1 thì KHÔNG vào danh
sách — đó là đúng loại kẽ hàng này đóng, máy báo G tên tệp và hàng thêm nó.

## 5. Không làm đỏ oan các nhánh đang mở

- Danh sách có trước chỉ chụp nhánh chính. Khối mà một nhánh đang mở tự thêm thì phải nằm trong bảng Khối của hồ sơ nhánh ấy (chỗ 3) — lời giao nói các hàng đang mở đều đã kê khối mới.
- Luật chỉ bật khi kho có sổ khối, nên kho mẫu của hàng 1c và mọi nhánh trước 0023 không đổi.
- Trước khi gộp, máy chạy lưới mới trên đầu mỗi nhánh đang mở có PR (hôm nay: 7e PR #53, PR #58, PR #59) và BÁO G từng dòng đỏ
  sẽ có: tệp, nhánh, câu sửa (kê vào bảng Khối của hồ sơ, hoặc dòng sổ khối). Không nhánh nào bị chặn mà không được báo trước.
  Đo lúc thiết kế (2026-11-14 ~13:10Z): tệp tự làm trong sổ thành phần của nhánh 7e và của nhánh PR #58 đều là tập con của nhánh
  chính — không nhánh nào đang mở sẽ đỏ.
- PR #58 đổi hình sổ thành phần: kê theo tệp (§3) nên cổng đọc được cả hai hình mà không phải sửa lại.

## 6. Tệp sẽ sửa hay thêm (đích danh, cho chữ duyệt Phạm vi và kế hoạch)

| Tệp                                                 | Sửa gì                                                                                                                                                       |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `tools/proof_gate/model.py`                         | Đọc thêm danh sách có trước (tên tệp, bộ đọc, lỗi khi dòng thiếu `tep` hay `ly_do`); nhớ mọi thành phần của mỗi tệp trong sổ thành phần (cả hai hình sổ).    |
| `tools/proof_gate/check.py`                         | Thêm luật `khoi-khong-ke` (§2) chạy khi sổ khối có mặt; đếm số tệp đỏ vào `--report --json` dưới khoá `khoi_khong_ke`; dòng chú thích đầu tệp thêm một đoạn. |
| `tools/proof_gate/thanh-phan-co-truoc.yaml`         | Tệp MỚI: danh sách có trước (§4), mười hai dòng hôm nay, mỗi dòng có lý do.                                                                                  |
| `tools/proof_gate/proof-gate-1q.test.ts`            | Tệp bài MỚI của hàng: các ca ở §7.                                                                                                                           |
| `tools/proof_gate/fixtures/so-thanh-phan-pr58.json` | Tệp MỚI: bản sao từng byte sổ thành phần trên đầu nhánh PR #58 (`a7e2c81`), để bài đọc hình sổ mới bằng đầu ra thật của bộ sinh, không dựng tay.             |
| `tools/proof_gate/proof-gate-0023.test.ts`          | CHỈ khi lưới mới làm đỏ kho mẫu của bài cũ: kê thành phần mẫu vào bảng Khối hay danh sách có trước của kho mẫu, không đổi kỳ vọng nào của bài cũ.            |
| `tools/proof_gate/khuon-chung-minh.md`              | Thêm một câu dưới mục Khối: mọi tệp mới trong `src/components` ngoài thư mục nhà cung cấp phải có dòng trong bảng Khối.                                      |

Không sửa: `tools/proof_gate/proof-gate.test.ts` (băm ghim của hàng 1c), `design/so-khoi.yaml`, `design/component-registry.json`,
`tools/design_registry.mjs`, `Makefile`, `mk/`, `.github/`, `governance/`.

Ngoài `tools/`: `wiki/log.md` (một dòng), trang quyết định mới trong `wiki/decisions/` (cách so với nhánh chính bằng danh sách cố
định), các tệp sinh (`PRODUCT-MAP.md`, `LO-TRINH.html`) bằng máy.

## 7. Ca kiểm (kho mẫu trong thư mục tạm, không git)

- Ca chính: tệp ngoài nhà cung cấp không ở chỗ nào → đỏ `khoi-khong-ke` với câu ghim; từng chỗ 1, 2, 3 đặt riêng → im; tệp nhà
  cung cấp → im; kho không có sổ khối → im.
- Ma trận viết trước: 6 trạng thái (`draft`, `approved`, `implemented`, `verified`, `signed-off`, `machine-cleared`) × chỗ kê
  là bảng Khối của hồ sơ ấy → bốn trạng thái mở im, hai trạng thái đóng đỏ.
- Hai hình sổ: một mục mỗi tệp (hôm nay) và một mục mỗi thành phần (PR #58); tệp hai thành phần, bảng Khối nêu một → im; không nêu
  → đúng một dòng đỏ nêu tệp, có cả hai tên.
- Không git: chạy lưới với `PATH` chỉ có `python3` → cùng kết quả.
- Kho thật: lưới xanh; tập tệp của danh sách có trước bằng đúng tập ghim; mỗi tệp còn trong sổ thành phần và không có ở sổ khối.
- Danh sách có trước sai khuôn (thiếu `tep`, thiếu `ly_do`) → `doc-loi`.

## 7b. Thành phần mới trong một tệp đã kê (Hỏi-2)

Kê theo tệp có một kẽ: thêm thành phần mới vào một tệp đã kê (có trước, hay của khối đã nhập kho) thì cổng không bắt. Hai lối:

- **A (khuyên): tệp đã kê thì cả tệp đã kê.** Quy ước «khối mới là tệp mới» ghi vào khuôn chứng minh. Thêm phần con vào tệp của
  một khối là sửa khối ấy. Không phải sửa danh sách có trước khi PR #58 gộp.
- **B: kê theo cặp tệp và tên.** Danh sách có trước ghi cả tên. Tên mới trong tệp đã kê mà không có ở bảng Khối của hồ sơ đang mở
  thì đỏ. Giá: PR #58 (279 mục, nhiều tên mới trong tệp có sẵn) đỏ khi gộp sau 1q; phải tính lại danh sách có trước ở PR ấy, sửa
  `tools/**` hạng T3, hoặc PR ấy kê hàng chục tên.

## 8. Ngoài phạm vi

- Khối tạo tay nằm ngoài `src/components` (vd `src/modules/*/ui`): sổ thành phần không quét chỗ ấy nên cổng không thấy. Mở hàng
  riêng nếu chủ kho muốn (đổi phạm vi quét của sổ thành phần là việc của bộ sinh sổ, không phải của cổng).
- Bù dòng sổ khối cho mười hai tệp có trước — xem câu hỏi Hỏi-1.
- So hình khối với ReUI, hiểu nghĩa khối — người soi ở cổng của vòng màn.
