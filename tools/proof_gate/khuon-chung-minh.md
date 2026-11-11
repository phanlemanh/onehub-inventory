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

## Lối theo mẫu

<!-- <<<KHUON-THEO-MAU -->

```markdown
## Màn <id màn>

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

| Khối       | Bậc       | Đã tra | Ứng viên gần nhất | Vì sao không dùng |
| ---------- | --------- | ------ | ----------------- | ----------------- |
| <tên khối> | trong-kho |        |                   |                   |
```

<!-- KHUON-THEO-MAU>>> -->

## Lối màn mẫu mới

<!-- <<<KHUON-MAN-MAU-MOI -->

```markdown
## Màn <id màn>

### Ma trận trạng thái

Mỗi trạng thái của `design/states.md` một dòng. Kết quả `đạt` thì căn cứ là tệp bài kiểm có thật; `không áp` thì nêu lý do.

| Trạng thái   | Kết quả | Căn cứ         |
| ------------ | ------- | -------------- |
| <trạng thái> | đạt     | <tệp bài kiểm> |

### Khối

| Khối       | Bậc       | Đã tra | Ứng viên gần nhất | Vì sao không dùng |
| ---------- | --------- | ------ | ----------------- | ----------------- |
| <tên khối> | trong-kho |        |                   |                   |
```

<!-- KHUON-MAN-MAU-MOI>>> -->

Khi màn đạt đủ ma trận, cùng vòng ấy đổi dòng `Màn: chưa có` của tệp họ thành `Màn: <id màn>`.

## Lối họ mới

<!-- <<<KHUON-HO-MOI -->

```markdown
## Màn <id màn>

### Hướng

Hai đến ba hướng thật sự khác nhau, mỗi hướng một ảnh riêng; đánh dấu `x` ở đúng một hướng được chọn.

| Hướng     | Ảnh                           | Động cơ   | Đánh đổi  | Chọn |
| --------- | ----------------------------- | --------- | --------- | ---- |
| <hướng 1> | evidence/<id màn>-huong-1.png | <một câu> | <một câu> | x    |
| <hướng 2> | evidence/<id màn>-huong-2.png | <một câu> | <một câu> |      |

### Khối

| Khối       | Bậc       | Đã tra | Ứng viên gần nhất | Vì sao không dùng |
| ---------- | --------- | ------ | ----------------- | ----------------- |
| <tên khối> | trong-kho |        |                   |                   |
```

<!-- KHUON-HO-MOI>>> -->

## Thang Trong kho → ReUI → Vẽ tay

Bậc là một trong `trong-kho` · `reui` · `ve-tay`. `trong-kho`: tên có trong `design/component-registry.json`. `reui`: tên
có trong `design/reui-catalog.json` (tra tại máy bằng `tools/reui_catalog`). Rơi khỏi `trong-kho` thì ghi đủ ba cột: đã tra
gì, ứng viên gần nhất (tên có thật trong kho hay danh mục), vì sao không dùng được.

## Căn cứ

Một ô căn cứ (`khác — có lý do`, `đạt`) cần ít nhất một tham chiếu, và mọi tham chiếu trong ô phải có thật: đường tệp
trong kho (bắt đầu bằng một thư mục gốc của kho, hay có đuôi tệp; thư mục không tính), `decision:<id>` của
`design/decisions.yaml`, hay `wiki/decisions/<số>` · `ADR-<số>`. Lời thường có dấu «/» (đọc/ghi) và đường web không tính là
tham chiếu.
