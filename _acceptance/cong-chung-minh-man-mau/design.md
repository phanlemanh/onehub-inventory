# Cổng chứng minh màn mẫu — thiết kế

Hàng `1c` của lộ trình (`docs/plan/lo-trinh.json`), ô `_acceptance/cong-chung-minh-man-mau/opportunity.md` (chủ kho quyết
build ngày 10/11/2026). Căn cứ: quyết định `wiki/decisions/0019-measurable-design-system-pilot.md`.

## 1. Bài toán

Ở Quỹ hàng, cổng ba lối chấm «đồng nhất» theo tên thành phần: màn Liên hệ dùng cùng DataGrid nên được ghi là khớp Bảng hàng,
rồi bản kiểm sau đó đếm ra 43 chỗ khác, 25 chỗ vô cớ. Thang Trong kho → ReUI → Vẽ tay được trình như thực đơn, rơi bậc
không để lại căn cứ. Quyết định 0019 tách ba việc cổng đã gộp:

1. **Họ màn và màn mẫu** — người quyết một lần mỗi họ; họ có một câu triết lý; màn chỉ thành màn mẫu khi đạt đủ ma trận
   trạng thái (`design/states.md`).
2. **Thang** — rơi xuống bậc dưới phải nêu đã tra gì, ứng viên gần nhất, vì sao không dùng.
3. **Trình ở cổng** — màn thuộc họ đã có: một bản thật cạnh màn mẫu, cùng dữ liệu, kèm bảng từng chỗ khác có lý do hay
   không. Họ mới: hai đến ba hướng thật sự khác nhau.

Hàng này giao **cơ chế đỏ được** cho ba việc ấy, và **giá trị của họ đầu tiên** (Lưới). Kho giữ giá trị, kit giữ cơ chế
chung (bản đồ khuôn `design/patterns/`); lưới riêng của kho chỉ giữ phần kit chưa có: chứng minh màn theo họ.

## 2. Ba lối — máy suy, không để vòng tự khai

Lỗi gốc của cổng cũ là vòng tự khai «khớp». Lối của mỗi màn vì vậy do máy suy từ sổ màn và bản đồ khuôn:

| Màn (theo `design/screens.yaml`) | Lối | Vòng phải chứng minh |
| --- | --- | --- |
| `family` null, hoặc họ chưa có tệp `design/patterns/<họ>.md` | **họ mới** | 2–3 hướng có ảnh khác nhau, mỗi hướng một câu động cơ và một câu đánh đổi, đúng một hướng được chọn |
| họ có tệp, tệp ghi `Màn: chưa có` | **màn mẫu mới** | đủ ma trận trạng thái: mỗi trạng thái của `design/states.md` là «đạt» kèm tệp bài kiểm có thật, hoặc «không áp» kèm lý do |
| họ có tệp, tệp ghi `Màn: <id của chính màn này>` | **màn mẫu mới** | như trên: sửa màn mẫu thì chứng lại đủ ma trận |
| họ có tệp, tệp ghi `Màn: <id khác>` | **theo mẫu** | ảnh cạnh màn mẫu ở mọi khổ so, cùng nhãn dữ liệu; bảng mặt so đủ mọi mặt của họ; không còn chỗ lệch vô cớ |

Tệp họ ghi `Màn: <id>` chỉ hợp lệ khi có ít nhất một tệp chứng minh (hồ sơ mở hay đã đóng) chứng đủ ma trận cho màn ấy;
vòng dựng màn mẫu đầu tiên tự lật `Màn: chưa có` thành `Màn: <id>` trong chính PR của nó, cùng lúc với tệp chứng minh đủ
ma trận.

Mọi lối cùng chứng thang (bảng Khối phải có mặt và có ít nhất một dòng): mỗi khối dựng màn một dòng với bậc; khối «trong kho» phải có tên trong
`design/component-registry.json`; khối ReUI phải có tên trong `design/reui-catalog.json`; rơi khỏi «trong kho» phải có đã
tra, ứng viên gần nhất (tên có thật trong kho hay danh mục) và vì sao không dùng.

## 3. Vật

- `design/patterns/luoi.md` — họ Lưới theo khuôn tệp bản đồ của kit (tám khoá lõi), cộng bốn mục thân do lưới của kho đọc:
  `## Triết lý` (một câu: Lưới thay Sheet và Excel cho Đầu chủ), `## Màn mẫu` (`Màn: chưa có` — màn thật đầu tiên của họ dựng
  thành màn mẫu), `## Khổ so` (360, 414, 1024, 1440 — bốn khổ của `design/states.md`), `## Mặt so` (12 mặt, rút từ 12 mục của bản kiểm Bảng hàng – Liên hệ ở Quỹ hàng).
  `mau_dang_chay.tep` của kit trỏ bản mẫu Lưới đang chạy (`src/app/(app)/proto/[slug]/grid-showcase.tsx`): đó là mẫu của
  **khuôn** DataRegion, khác với màn mẫu của **họ** — màn mẫu phải là màn thật trong sổ màn.
- `tools/proof_gate/` — lưới chứng minh màn, Python thư viện chuẩn (cùng nếp `tools/coverage_matrix/`, dùng lại bộ đọc YAML
  và đường màn của nó):
  - `check.py --root .` — đỏ (thoát 1) khi một hồ sơ còn mở có màn chưa chứng minh; mỗi dòng lỗi
    `<hồ sơ> · <màn> · <mã>: <câu>`.
  - `check.py --report [--json]` — số đo cho kit (số vòng theo lối, chỗ lệch có lý do / vô cớ, số lần rơi bậc), không bao
    giờ đỏ.
  - `khuon-chung-minh.md` — khuôn tệp chứng minh mà vòng chép vào hồ sơ.
  - `proof-gate.test.ts` — bài vitest: ma trận ca trên kho mẫu dựng trong thư mục tạm, hai ca phát lại Liên hệ, và kho thật.
  - `fixtures/lien-he-quy-hang/` — bản phát lại ca Liên hệ (chỉ loại lệch và mặt, không chép dữ liệu người).
- `.claude/skills/inventory-ui/SKILL.md` — mục «Prove the screen before you present it»: ba lối, khuôn tệp, thang, lệnh.
  Giữ nguyên dòng tra danh mục ReUI của hàng 1g.

## 4. Tệp chứng minh — `_acceptance/<slug>/chung-minh-man.md`

Mỗi màn một mục `## Màn <id>`; trong mục, các bảng theo lối:

- `### Ảnh cạnh màn mẫu` — `| Khổ | Màn này | Màn mẫu | Dữ liệu |`. Ảnh là PNG trong hồ sơ; bề ngang ảnh (đọc từ đầu tệp PNG)
  bằng khổ; hai ảnh một khổ không trùng byte; nhãn dữ liệu không rỗng (một cột nên hai bên cùng một dữ liệu). Đủ mọi khổ
  trong `## Khổ so` của họ.
- `### Mặt so` — `| Mặt | Kết quả | Căn cứ |`. Đủ mọi mặt của họ. `giống` phải chỉ chỗ thấy trên ảnh (`ảnh 1440`…); căn cứ chỉ
  gồm tên thành phần thì gắn cờ **chấm theo tên thành phần**. `khác — có lý do` cần căn cứ trỏ tệp có thật hay mã quyết định
  có thật (`design/decisions.yaml`, `wiki/decisions/NNNN`). `khác — vô cớ` thì đỏ, đếm số chỗ.
- `### Khối` — `| Khối | Bậc | Đã tra | Ứng viên gần nhất | Vì sao không dùng |`, bậc `trong-kho` · `reui` · `ve-tay`.
- `### Hướng` (họ mới) — `| Hướng | Ảnh | Động cơ | Đánh đổi | Chọn |`.
- `### Ma trận trạng thái` (màn mẫu mới) — `| Trạng thái | Kết quả | Căn cứ |`.

## 5. Khi nào lưới đòi

Hồ sơ còn mở (`draft` · `approved` · `implemented` · `verified`) có `screens` chứa ít nhất một màn không phải `dev`:

| Trạng thái | Đòi |
| --- | --- |
| `draft` | chưa đòi (vòng còn đang soạn) |
| `approved` | bảng `Hướng` của màn họ mới — hướng được trình ở Cổng Phạm vi, đã duyệt thì phải có |
| `implemented`, `verified` | trọn tệp chứng minh — có trước lượt chấm, tức trước khi trình Cổng Bằng chứng |
| đã đóng | không đòi; báo cáo đếm riêng «trước cổng» |

Lưới chạy trong `make test` qua bài «kho thật» của `proof-gate.test.ts` (nên nằm trong `make check` và CI) — không thêm tệp
`mk/`, vì `mk/` nằm ngoài vùng của hàng; cách này đỏ được như một đích `make` riêng, đã có bài đối chứng.

## 6. Ca Liên hệ phát lại

Hai bản phát lại, cùng màn `contacts` của họ Lưới với màn mẫu `inventory`:

1. **Lời của cổng cũ** — mọi mặt `giống`, căn cứ «cùng DataGrid», không ảnh → đỏ, mỗi mặt gắn cờ chấm theo tên thành phần,
   cộng thiếu ảnh.
2. **Bảng thật của bản kiểm** — 43 dòng xếp vào 12 mặt, 18 có lý do, 25 vô cớ → đỏ, «25 chỗ lệch vô cớ».

Hai bản ghim nguồn: đầu tệp ghi kho, commit đủ 40 ký tự và đường bản kiểm ở Quỹ hàng
(`docs/plan/dong-nhat-bang-hang-lien-he.md`, commit `fed33adc2c13231c3a8ab9432a8cb2b82c0bb0d4`); mỗi mã L mang mục gốc (§1–§12)
của bản kiểm, và loại LD/VC chép đúng cột «Loại» của dòng ấy.

## 7. Không làm

- In tệp chứng minh lên thẻ cổng của kit (mục chờ KH2, KH3 của kit) — người mở tệp và ảnh trong hồ sơ.
- Chụp ảnh tự động: vòng dựng màn tự chụp bằng Playwright như hôm nay; lưới chỉ kiểm vật.
- Gán họ cho màn Hôm nay và các màn khác (`design/screens.yaml` ngoài vùng; mỗi màn gán khi vòng của nó tới).
- So ảnh từng điểm ảnh: bảng mặt so do vòng lập, người soi ở cổng; máy chỉ chặn bảng thiếu, giống không chỉ ảnh, lệch vô cớ.
- Chép bộ mã cổng ba lối của Quỹ hàng (0019 «Không chọn»).

## 8. Đặc tả UX

Bỏ: vòng không dựng màn nào — sổ quyết định có dòng `bỏ đặc-tả-UX`.
