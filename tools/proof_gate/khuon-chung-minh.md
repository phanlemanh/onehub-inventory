# Khuôn tệp chứng minh màn — `_acceptance/<slug>/chung-minh-man.md`

Vòng nào khai màn sản phẩm trong `screens:` của hợp đồng thì chép khuôn này vào hồ sơ, một mục `## Màn <id>` cho mỗi màn.
Lưới (`python3 tools/proof_gate/check.py --root .`, chạy trong `make test`) đọc đúng tên mục, tên cột và giá trị dưới đây —
đừng đổi chữ. Quyết định gốc: `wiki/decisions/0019-measurable-design-system-pilot.md`.

## Máy chọn lối, vòng không khai

Lối của màn suy từ `design/screens.yaml` (cột `family`) và tệp họ `design/patterns/<họ>.md` (mục `## Màn mẫu`):

| Màn                                               | Lối         | Mục phải có                                        |
| ------------------------------------------------- | ----------- | -------------------------------------------------- |
| `family` rỗng, hoặc họ chưa có tệp                | họ mới      | `### Hướng` + `### Khối`                           |
| tệp họ ghi `Màn: chưa có`, hoặc ghi chính màn này | màn mẫu mới | `### Ma trận trạng thái` + `### Khối`              |
| tệp họ ghi một màn khác                           | theo mẫu    | `### Ảnh cạnh màn mẫu` + `### Mặt so` + `### Khối` |

Lưới đòi `### Hướng` từ khi hợp đồng `approved` (hướng được trình ở Cổng Phạm vi), và trọn mục từ khi hợp đồng
`implemented` (trước lượt chấm, tức trước khi trình Cổng Bằng chứng). Đường ảnh tính từ thư mục hồ sơ.

## Quyết định 0023: bốn mục thêm

Kho có `design/so-khoi.yaml` thì quyết định 0023 bật cho mọi hồ sơ còn mở không có tên trong
`tools/proof_gate/chuyen-tiep.yaml` (ba hồ sơ đã qua Cổng Phạm vi lúc hàng 1n gộp — chúng giữ luật cũ).

| Mục                                                | Đòi từ        | Mã khi thiếu                              |
| -------------------------------------------------- | ------------- | ----------------------------------------- |
| `### Từ Quỹ hàng`                                  | `approved`    | `thieu-tu-quy-hang`                       |
| `### Họ`                                           | `approved`    | `thieu-ho`                                |
| nhóm `màn` trong `### Ứng viên ReUI`               | `approved`    | `thieu-ung-vien` (họ mới, màn mẫu mới)    |
| nhóm của mỗi khối `reui`, `ve-tay`                 | `implemented` | `thieu-ung-vien`                          |
| `### Vùng` và cột `Cách` của khối `reui`           | `implemented` | `thieu-vung`, `thieu-cach`, `cat-qua-nua` |
| dòng sổ khối `ho_so: <slug>` cho mỗi khối nhập kho | `implemented` | `nhap-kho-thieu-so`                       |

Bậc `trong-kho` khi ấy là thành phần nhà cung cấp (`src/components/ui/`, `src/components/reui/`) hay một dòng của
`design/so-khoi.yaml` do hồ sơ khác nhập. Khối vòng này vừa tạo hay vừa lấy về ghi `reui` hay `ve-tay`, không ghi `trong-kho`.

## Lối theo mẫu

<!-- <<<KHUON-THEO-MAU -->

```markdown
## Màn <id màn>

### Từ Quỹ hàng

Trang sổ bối cảnh của màn dưới `docs/tri-thuc/wiki/chu-de/`, hay `chưa có trang — <lý do>`. Bốn cột kia không rỗng.

| Trang   | Khối Quỹ hàng đã chọn | Giữ   | Bỏ   | Vì sao   |
| ------- | --------------------- | ----- | ---- | -------- |
| <trang> | <khối bên Quỹ hàng>   | <giữ> | <bỏ> | <vì sao> |

### Họ

Họ là một khoá của `families` trong `design/screens.yaml`, hay `rỗng` (khi đó nêu vì sao). Lối là `họ mới`, `màn mẫu mới`
hay `theo mẫu` — đúng lối máy suy.

| Họ đề xuất | Lối   | Vì sao   |
| ---------- | ----- | -------- |
| <họ>       | <lối> | <vì sao> |

### Ứng viên ReUI

Mỗi nhóm `Cho` hai đến ba ứng viên có thật trong `design/reui-catalog.json`, mỗi ứng viên một ảnh PNG trong hồ sơ, không
hai ảnh trùng; chọn nhiều nhất một. Nhóm `màn` cho màn họ mới hay màn mẫu mới (từ `approved`); một nhóm cho mỗi khối
`reui` hay `ve-tay` ở bảng Khối (từ `implemented`) — khối `reui` là ứng viên được chọn, khối `ve-tay` thì không chọn ai.

| Cho   | Ứng viên        | Ảnh                | Chọn |
| ----- | --------------- | ------------------ | ---- |
| <cho> | <tên khối ReUI> | evidence/<tệp>.png |      |

### Ảnh cạnh màn mẫu

Mỗi khổ trong `## Khổ so` của họ một dòng; ảnh PNG rộng đúng bằng khổ; cùng một bộ dữ liệu cho hai bên.

| Khổ   | Màn này                     | Màn mẫu                         | Dữ liệu          |
| ----- | --------------------------- | ------------------------------- | ---------------- |
| <khổ> | evidence/<id màn>-<khổ>.png | evidence/<id màn mẫu>-<khổ>.png | <tên bộ dữ liệu> |

### Mặt so

Mỗi mặt trong `## Mặt so` của họ ít nhất một dòng. Kết quả là một trong: `giống` · `khác — có lý do` · `khác — vô cớ`.
`giống` chỉ chỗ thấy trên ảnh (`ảnh <khổ>`), không viện tên thành phần. `khác — có lý do` trỏ tệp có thật trong kho,
`decision:<id>` của `design/decisions.yaml`, hay `wiki/decisions/<số>`. `khác — vô cớ` thì phải sửa trước khi trình.

| Mặt   | Kết quả | Căn cứ               |
| ----- | ------- | -------------------- |
| <mặt> | giống   | ảnh <khổ>: <thấy gì> |

### Khối

| Khối       | Bậc       | Đã tra | Ứng viên gần nhất | Vì sao không dùng | Cách |
| ---------- | --------- | ------ | ----------------- | ----------------- | ---- |
| <tên khối> | trong-kho |        |                   |                   |      |

### Vùng

Mỗi khối `reui` ít nhất một dòng; xử lý là `lấy`, `bỏ` hay `thêm`, mỗi dòng một lý do. Cột Cách của khối ấy ghi `chọn khối`,
hay `ghép từ thành phần` khi bỏ quá nửa số vùng gốc (lấy cộng bỏ).

| Khối        | Vùng   | Xử lý | Lý do   |
| ----------- | ------ | ----- | ------- |
| <khối ReUI> | <vùng> | lấy   | <lý do> |
```

<!-- KHUON-THEO-MAU>>> -->

## Lối màn mẫu mới

<!-- <<<KHUON-MAN-MAU-MOI -->

```markdown
## Màn <id màn>

### Từ Quỹ hàng

Trang sổ bối cảnh của màn dưới `docs/tri-thuc/wiki/chu-de/`, hay `chưa có trang — <lý do>`. Bốn cột kia không rỗng.

| Trang   | Khối Quỹ hàng đã chọn | Giữ   | Bỏ   | Vì sao   |
| ------- | --------------------- | ----- | ---- | -------- |
| <trang> | <khối bên Quỹ hàng>   | <giữ> | <bỏ> | <vì sao> |

### Họ

Họ là một khoá của `families` trong `design/screens.yaml`, hay `rỗng` (khi đó nêu vì sao). Lối là `họ mới`, `màn mẫu mới`
hay `theo mẫu` — đúng lối máy suy.

| Họ đề xuất | Lối   | Vì sao   |
| ---------- | ----- | -------- |
| <họ>       | <lối> | <vì sao> |

### Ứng viên ReUI

Mỗi nhóm `Cho` hai đến ba ứng viên có thật trong `design/reui-catalog.json`, mỗi ứng viên một ảnh PNG trong hồ sơ, không
hai ảnh trùng; chọn nhiều nhất một. Nhóm `màn` cho màn họ mới hay màn mẫu mới (từ `approved`); một nhóm cho mỗi khối
`reui` hay `ve-tay` ở bảng Khối (từ `implemented`) — khối `reui` là ứng viên được chọn, khối `ve-tay` thì không chọn ai.

| Cho   | Ứng viên        | Ảnh                | Chọn |
| ----- | --------------- | ------------------ | ---- |
| <cho> | <tên khối ReUI> | evidence/<tệp>.png |      |

### Ma trận trạng thái

Mỗi trạng thái của `design/states.md` một dòng. Kết quả `đạt` thì căn cứ là tệp bài kiểm có thật; `không áp` thì nêu lý do.

| Trạng thái   | Kết quả | Căn cứ         |
| ------------ | ------- | -------------- |
| <trạng thái> | đạt     | <tệp bài kiểm> |

### Khối

| Khối       | Bậc       | Đã tra | Ứng viên gần nhất | Vì sao không dùng | Cách |
| ---------- | --------- | ------ | ----------------- | ----------------- | ---- |
| <tên khối> | trong-kho |        |                   |                   |      |

### Vùng

Mỗi khối `reui` ít nhất một dòng; xử lý là `lấy`, `bỏ` hay `thêm`, mỗi dòng một lý do. Cột Cách của khối ấy ghi `chọn khối`,
hay `ghép từ thành phần` khi bỏ quá nửa số vùng gốc (lấy cộng bỏ).

| Khối        | Vùng   | Xử lý | Lý do   |
| ----------- | ------ | ----- | ------- |
| <khối ReUI> | <vùng> | lấy   | <lý do> |
```

<!-- KHUON-MAN-MAU-MOI>>> -->

Khi màn đạt đủ ma trận, cùng vòng ấy đổi dòng `Màn: chưa có` của tệp họ thành `Màn: <id màn>`.

## Lối họ mới

<!-- <<<KHUON-HO-MOI -->

```markdown
## Màn <id màn>

### Từ Quỹ hàng

Trang sổ bối cảnh của màn dưới `docs/tri-thuc/wiki/chu-de/`, hay `chưa có trang — <lý do>`. Bốn cột kia không rỗng.

| Trang   | Khối Quỹ hàng đã chọn | Giữ   | Bỏ   | Vì sao   |
| ------- | --------------------- | ----- | ---- | -------- |
| <trang> | <khối bên Quỹ hàng>   | <giữ> | <bỏ> | <vì sao> |

### Họ

Họ là một khoá của `families` trong `design/screens.yaml`, hay `rỗng` (khi đó nêu vì sao). Lối là `họ mới`, `màn mẫu mới`
hay `theo mẫu` — đúng lối máy suy.

| Họ đề xuất | Lối   | Vì sao   |
| ---------- | ----- | -------- |
| <họ>       | <lối> | <vì sao> |

### Ứng viên ReUI

Mỗi nhóm `Cho` hai đến ba ứng viên có thật trong `design/reui-catalog.json`, mỗi ứng viên một ảnh PNG trong hồ sơ, không
hai ảnh trùng; chọn nhiều nhất một. Nhóm `màn` cho màn họ mới hay màn mẫu mới (từ `approved`); một nhóm cho mỗi khối
`reui` hay `ve-tay` ở bảng Khối (từ `implemented`) — khối `reui` là ứng viên được chọn, khối `ve-tay` thì không chọn ai.

| Cho   | Ứng viên        | Ảnh                | Chọn |
| ----- | --------------- | ------------------ | ---- |
| <cho> | <tên khối ReUI> | evidence/<tệp>.png |      |

### Hướng

Hai đến ba hướng thật sự khác nhau, mỗi hướng một ảnh riêng; đánh dấu `x` ở đúng một hướng được chọn.

| Hướng     | Ảnh                           | Động cơ   | Đánh đổi  | Chọn |
| --------- | ----------------------------- | --------- | --------- | ---- |
| <hướng 1> | evidence/<id màn>-huong-1.png | <một câu> | <một câu> | x    |
| <hướng 2> | evidence/<id màn>-huong-2.png | <một câu> | <một câu> |      |

### Khối

| Khối       | Bậc       | Đã tra | Ứng viên gần nhất | Vì sao không dùng | Cách |
| ---------- | --------- | ------ | ----------------- | ----------------- | ---- |
| <tên khối> | trong-kho |        |                   |                   |      |

### Vùng

Mỗi khối `reui` ít nhất một dòng; xử lý là `lấy`, `bỏ` hay `thêm`, mỗi dòng một lý do. Cột Cách của khối ấy ghi `chọn khối`,
hay `ghép từ thành phần` khi bỏ quá nửa số vùng gốc (lấy cộng bỏ).

| Khối        | Vùng   | Xử lý | Lý do   |
| ----------- | ------ | ----- | ------- |
| <khối ReUI> | <vùng> | lấy   | <lý do> |
```

<!-- KHUON-HO-MOI>>> -->

## Lối khuôn bọc

Hợp đồng khai `khuon_boc: <id>`, với `<id>` có trong `tools/proof_gate/khuon-boc.yaml` (mở bằng `app-shell`), thì các màn
trong `screens:` là màn được bọc (để có bảng Vai × Màn), không phải màn được dựng. Tệp chứng minh có một mục
`## Khuôn <id>` thay cho `## Màn` của từng màn; id lạ thì đỏ `khuon-boc-la` và vẫn đòi từng màn. Mục khuôn cần bảng Khối từ
`implemented`; dưới quyết định 0023 thêm Từ Quỹ hàng và nhóm ứng viên `Cho = <id>` từ `approved` (trừ khi sổ khối đã có
khuôn ấy do hồ sơ khác nhập), cùng mọi luật khối.

<!-- <<<KHUON-BOC -->

```markdown
## Khuôn <id khuôn>

### Từ Quỹ hàng

| Trang   | Khối Quỹ hàng đã chọn | Giữ   | Bỏ   | Vì sao   |
| ------- | --------------------- | ----- | ---- | -------- |
| <trang> | <khối bên Quỹ hàng>   | <giữ> | <bỏ> | <vì sao> |

### Ứng viên ReUI

| Cho   | Ứng viên        | Ảnh                | Chọn |
| ----- | --------------- | ------------------ | ---- |
| <cho> | <tên khối ReUI> | evidence/<tệp>.png |      |

### Khối

| Khối       | Bậc       | Đã tra | Ứng viên gần nhất | Vì sao không dùng | Cách |
| ---------- | --------- | ------ | ----------------- | ----------------- | ---- |
| <tên khối> | trong-kho |        |                   |                   |      |

### Vùng

| Khối        | Vùng   | Xử lý | Lý do   |
| ----------- | ------ | ----- | ------- |
| <khối ReUI> | <vùng> | lấy   | <lý do> |
```

<!-- KHUON-BOC>>> -->

## Thang ba bậc (quyết định 0023)

Đi từ trên xuống, chỉ xuống bậc khi bậc trên không đáp ứng việc của người dùng hay luật sản phẩm («trông chưa đẹp», «ghép tay
nhanh hơn» không phải lý do): (1) lắp ghép từ kho — `trong-kho`; (2) kho kết hợp ReUI Pro — phần thiếu ghi `reui`;
(3) tạo tay — `ve-tay`. Thứ vào bằng bậc 2 hay 3 nhập kho bằng một dòng `design/so-khoi.yaml` sau khi chủ kho duyệt Cổng
Phạm vi; lần sau gặp cùng nhu cầu là bậc 1.

Bậc là một trong `trong-kho` · `reui` · `ve-tay`. `trong-kho`: tên có trong `design/component-registry.json` (luật 1c), hay
— dưới quyết định 0023 — thành phần nhà cung cấp hoặc dòng sổ khối do hồ sơ khác nhập. `reui`: tên có trong
`design/reui-catalog.json` (tra tại máy bằng `tools/reui_catalog`). Rơi khỏi `trong-kho` thì ghi đủ ba cột: đã tra gì, ứng
viên gần nhất (tên có thật trong kho hay danh mục), vì sao không dùng được.

## Căn cứ

Một ô căn cứ (`khác — có lý do`, `đạt`) cần ít nhất một tham chiếu, và mọi tham chiếu trong ô phải có thật: đường tệp
trong kho (bắt đầu bằng một thư mục gốc của kho, hay có đuôi tệp; thư mục không tính), `decision:<id>` của
`design/decisions.yaml`, hay `wiki/decisions/<số>` · `ADR-<số>`. Lời thường có dấu «/» (đọc/ghi) và đường web không tính là
tham chiếu.
