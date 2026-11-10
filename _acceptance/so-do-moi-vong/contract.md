---
schema_version: 1
feature: Mỗi vòng giao diện máy ghi một bản số đo, một lệnh gộp theo tầng, và có mốc đối chứng trước khi dựng nền
slug: so-do-moi-vong
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [cli, docs]
status: implemented
approved_by: Manh Phan
approved_at: 2026-11-11
design_doc: docs/plan/do-he-design/thiet-ke.md
---

# Acceptance Contract: so-do-moi-vong

## Context

Đợt `nen` là đợt chạy thật cho kit (quyết định 0019). Vòng này cho kho ba thứ: mỗi vòng giao diện để lại một bản số đo làm lại
theo tầng, một lệnh gộp các bản đó theo tầng cạnh mốc Quỹ hàng, và một mốc ba agent lập phương án cùng một màn chưa có mẫu, đo
trước khi khung của hàng 1a gộp. Hạng T3 vì lệnh nằm trong `tools/`.

Source input: hàng `1h` của `docs/plan/lo-trinh.json`, ô `_acceptance/so-do-moi-vong/opportunity.md` (chủ kho quyết build ngày
10/11/2026).

## Criteria

- AC-1: Given một hồ sơ có sổ chạy gồm lượt 1 `REJECT`, lượt 2 `BLOCKED`, lượt 3 `PASS`, một dòng `repin-do`, một dòng
  `thuoc-vat` và một dòng `gio-may`, When chạy `ghi --slug <slug> --phan r1=trang-thai-hanh-vi,bo-cuc`, Then
  `so-do-vong.json` ghi 3 lượt chấm, 4 đơn vị làm lại (lượt 1 hai tầng đã khai, lượt 2 và dòng `repin-do` mỗi thứ một đơn vị
  `bai-kiem-ha-tang`), đủ 11 tầng kể cả tầng bằng 0, `chua_phan` rỗng, và chép số vật, thước, nhát, giờ máy từ dòng cuối của
  từng loại; còn lượt có dòng `REJECT` rồi dòng `PASS`, và lượt `PENDING-JUDGMENT`, không tính đơn vị nào.
- AC-2: Given bản số đo đã khai tầng cho lượt 1, When sổ chạy có thêm lượt 4 `REJECT` và chạy lại `ghi` không có `--phan`, Then
  bản mới giữ tầng của lượt 1 và ghi lượt 4 vào `chua_phan`.
- AC-3: Given lệnh `ghi`, When `--phan` gọi một tầng ngoài 11 tầng, hoặc gọi một lượt không có kết quả `REJECT`, Then lệnh thoát
  1, không ghi hay đổi tệp, và thông điệp in đủ 11 tầng hoặc gọi tên lượt sai.
- AC-4: Given một kho mẫu, When chạy `kiem`, Then đỏ và gọi tên hồ sơ kèm đúng lệnh `ghi` cần chạy cho từng ca: vòng giao diện
  `verified` thiếu bản số đo; bản số đo còn `chua_phan`; bản số đo đếm ít lượt hơn sổ chạy hiện tại; vòng giao diện chỉ nhận ra
  nhờ `design-pass.md`; và xanh cho từng ca: vòng không giao diện thiếu bản số đo, vòng giao diện còn `draft` thiếu bản số đo,
  vòng giao diện có bản số đo hợp lệ. Không có danh sách miễn: hồ sơ giao diện nào đã qua chấm cũng bị đòi.
- AC-5: Given kho thật, When chạy `make test`, Then bài vitest của lệnh đo chạy `kiem` và `kiem-moc` trên chính kho và xanh; và
  trên bản sao kho có thêm một hồ sơ giao diện `verified` không có bản số đo thì cùng bài đó đỏ.
- AC-6: Given các bản số đo mẫu, When chạy `gop`, Then khối làm lại có đúng một dòng cho mỗi tầng trong 11 tầng với số đơn vị,
  phần trăm trên mọi đơn vị, phần trăm trên phần có đổi sản phẩm (bỏ `bai-kiem-ha-tang` và `hop-dong-yeu-cau`) và phần trăm Quỹ
  hàng đọc từ `docs/plan/do-he-design/moc-quy-hang.json`; đầu khối ghi số vòng và số lượt chấm trung bình; bản `--json` mang
  cùng số; và tệp mốc Quỹ hàng có đúng 11 khoá tầng, tổng 199, khớp các tỉ lệ 55, 15, 5, 0 mà quyết định 0019 trích.
- AC-7: Given `design/decisions.yaml`, When chạy `gop`, Then khối quyết định có kiểm ghi mỗi tầng của sổ với số có kiểm trên
  tổng, đếm bằng hàm `check_problem` của `tools/design_check.py`, và tổng các tầng bằng đúng tỉ lệ `determinism` mà
  `design_check` in; ở kho mẫu, một quyết định trỏ tới bài kiểm không tồn tại không được tính là có kiểm.
- AC-8: Given `docs/plan/do-he-design/moc-*/moc.json`, When chạy `kiem-moc`, Then xanh khi có đúng ba agent với ba tệp phương án
  khác nhau và không rỗng, có bảng so, câu đã gửi trong cả ba tệp bằng câu giao của đề bài cố định, commit có thật, ở commit đó
  hồ sơ `khung-va-giao-dien` chưa có hoặc chưa qua Cổng Bằng chứng và thư mục mốc chưa có; mỗi lần phá một điều kiện trong bản
  sao thì đỏ với thông điệp gọi tên điều kiện đó; trên bản lấy nông thiếu commit thì in `kho nong` và chỉ bỏ ba điều kiện cần
  lịch sử; và `gop` in số giống, giống mang lỗi, lệch, tự đoán của mốc mới nhất.
- AC-9: Given đề bài cố định, ba phương án và bảng so của lần đo đầu, When người chấm đọc chúng, Then ba agent nhận cùng câu giao
  nguyên văn, mỗi dòng của bảng so khớp lựa chọn ghi trong từng phương án, và số đếm cuối bảng khớp các dòng. (judgment)

## Coverage

Quét trục tại chỗ theo khuôn quét hình thái, không gọi skill vì không gian nhỏ và đã kê được hết.

- Trục kết quả một lượt: `PASS` | `PENDING-JUDGMENT` | `REJECT` | `BLOCKED` | dòng `repin-do`. `PASS` và `REJECT` đi AC-1, AC-2;
  `BLOCKED`, `repin-do` đi AC-1; `PENDING-JUDGMENT` tính như qua, nằm trong ca của AC-1 khi kiểm bằng bài vitest. [CE: sổ chạy của
  `_acceptance/go-hoi-khi-gop/run-log.jsonl` và các hồ sơ Quỹ hàng]
- Trục lần ghi: lần đầu | lần sau giữ tầng cũ | đầu vào sai. Lần lượt AC-1, AC-2, AC-3.
- Trục loại hồ sơ: giao diện theo `surfaces` | giao diện theo `design-pass.md` | không giao diện. AC-4.
- Trục trạng thái hồ sơ: `draft`, `approved`, `implemented` không đòi | `verified`, `machine-cleared`, `signed-off`,
  `da-cham-boi-thuc-te` đòi. AC-4 kiểm hai đầu (`draft`, `verified`); bài vitest kê đủ bảy trạng thái.
- Trục tình trạng bản số đo: thiếu | còn chưa phân | cũ hơn sổ chạy | hợp lệ. AC-4.
- Trục khối báo cáo: làm lại theo tầng | quyết định có kiểm theo tầng | mốc ba agent. AC-6, AC-7, AC-8.
- Trục mốc: đủ | thiếu agent | tệp trùng hay rỗng | thiếu bảng so | commit không có | đo sau khi 1a gộp. AC-8, AC-9.
- Trục chỗ chạy lưới: kho mẫu | kho thật trong `make test`. AC-4, AC-5.

## Đường đo

- Thước: thiếu bản số đo ở vòng giao diện thì đỏ · số từ: `round_metrics.py kiem` chạy trong `make test` · bảo đảm bởi: AC-4, AC-5
- Thước: báo cáo tách theo tầng thay cho một tỉ lệ chung · số từ: `round_metrics.py gop` · bảo đảm bởi: AC-6, AC-7
- Thước: ba agent độc lập lập phương án một màn chưa có mẫu và ghi mốc trước khi hàng 1a gộp · số từ:
  `docs/plan/do-he-design/moc-2026-11-11/moc.json` và `round_metrics.py kiem-moc` · bảo đảm bởi: AC-8, AC-9

## Out of scope

- Ghi bản số đo ngược cho hồ sơ đã có, hay đo các vòng ở Quỹ hàng (entry descope trong `decisions.jsonl`).
- Sửa `tools/design_check.py`, Makefile, `mk/` hay `_acceptance/config.yaml`.
- Báo số đo về issue 490 của kit: việc sau 10 vòng.
- Kiểm tầng agent khai có đúng không: lưới chỉ kiểm có khai.
- Đo lại mốc sau đợt nền: việc của hàng sau khi đợt nền xong.

## Notes

- Hạng T3 dù hàng lộ trình ghi T2: `_acceptance/config.yaml` xếp `tools/**` vào T3.
- Mốc đo trên bản kho ở commit `c706223` (đỉnh `main` lúc nhận hàng), khi hồ sơ `khung-va-giao-dien` chưa có ở `main`.
- CI chạy `make check` trên bản lấy nông; `kiem-moc` không đòi lịch sử git ở đó, lịch sử chỉ kiểm ở máy và ở lượt chấm S4.
- Lúc thiết kế, kho không có hồ sơ giao diện nào đã qua chấm, nên lưới không cần danh sách miễn.
