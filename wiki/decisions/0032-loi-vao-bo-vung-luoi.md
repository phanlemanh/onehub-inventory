---
type: decision
title: Lối vào của bộ vùng lưới khai trong sổ màn
links:
  [
    design/screens.yaml,
    tools/e2e_templates/suite.ts,
    tools/e2e_templates/register.py,
    tools/e2e_templates/runner.ts,
    tools/e2e_templates/recipes.ts,
    tests/e2e-db/setup.ts,
    _acceptance/lop-rieng-cua-san/sua-sau-ky.md,
  ]
sources:
  [
    _acceptance/lop-rieng-cua-san/sua-sau-ky.md,
    "chủ kho, câu h-20261114T065340Z-56: «7e công cụ kiểm: cho», 2026-11-14",
    "chủ kho, câu h-20261114T134021Z-63: «7e hai chỗ công cụ kiểm: cho», 2026-11-14",
  ]
---

# 0032 Lối vào của bộ vùng lưới khai trong sổ màn

## Status

Accepted, 2026-11-14, ở hàng 7e (lớp riêng của sàn), sau chữ ký Cổng Bằng chứng. Chủ kho cho hai lần: khoá `vao_vung`,
rồi cách ghép tham số và phép ngược của ca «chữ dài».

## Context

Bộ kiểm màn theo sổ (`tools/e2e_templates/suite.ts`) chạy các ca vùng của mọi màn họ Lưới trên đường gốc của màn. Màn
«Tuỳ chỉnh của sàn» có năm phần, chọn ở cột thứ hai bằng `?phan=`. Phần mở đầu «Nhãn riêng» không đo được hai ca:

- «lọc đầu cột» cần cột đầu có chữ số;
- «chữ dài» cần một ô bị cắt.

Đổi phần mở đầu của màn để chiều bộ kiểm là bẻ sản phẩm theo công cụ, nên giám sát không cho. Dùng phần «Trường riêng»
thì phải thêm cột vào Bảng hàng của sàn thử chung. Ở khổ 1440, chữ dài nhất mà sàn được gõ ở mọi phần (40, 60, 80 ký tự)
đều vừa ô.

## Decision

- Sổ màn có khoá tuỳ chọn `vao_vung`, chỉ cho màn họ `grid`, cùng gốc với `route`. Ca vùng mở đường ấy, còn ca khung vẫn
  mở `route`. Màn không khai thì như cũ. Bộ đọc sổ màn đỏ với `<màn>: vao_vung ngoai man` hay
  `<màn>: vao_vung chi cho ho grid`.
- Màn «Tuỳ chỉnh của sàn» khai `vao_vung: /tuy-chinh-san?phan=can-cho`. Sàn thử chung có ba căn chờ khớp: hai mã ngắn
  có chữ số, một mã 80 ký tự.
- Bộ chạy ghép trạng thái giả vào đường đã có `?` bằng `&` (`withQuery`).
- Ở màn và khổ mà chữ dài nhất sàn được nhập vẫn vừa ô, ca «chữ dài» đo phép ngược: ô có chữ đúng bằng trần phải hiện
  trọn (`LONGEST_FITS` trong `recipes.ts`, khai màn, khổ, trần và lý do). Sau đó ô bị thu hẹp để phần bàn phím và đọc
  khi focus vẫn chạy. Trần tăng hay cột hẹp lại làm chữ bị cắt thì phép đỏ, và phải gỡ dòng khai để ca thường áp lại.

Lối khác đã cân:

- dòng miễn cho ca «tìm» và ca «chữ dài»: giám sát không cho, vì miễn là bỏ phép kiểm;
- đổi phần mở đầu thành «Trường riêng»: bẻ sản phẩm theo công cụ.

## Consequences

- Màn họ Lưới nhiều phần (hàng 19 Thuế phí, các phần cài đặt sau) khai `vao_vung` vào phần có dữ liệu đo được, không đổi
  phần mở đầu của màn.
- Một dòng `LONGEST_FITS` là lời khai có đo, không phải miễn. Bảng đó phải ngắn, và mỗi dòng có lý do trỏ tới trần thật
  trong cơ sở dữ liệu.
