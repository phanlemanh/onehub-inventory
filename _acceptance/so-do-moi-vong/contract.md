---
schema_version: 1
feature: Mỗi vòng giao diện máy ghi một bản số đo, một lệnh gộp theo tầng, và có mốc đối chứng trước khi dựng nền
slug: so-do-moi-vong
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [cli, docs]
status: signed-off
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
- Known limits — chọn ở Cổng Bằng chứng 2026-11-11:
  - Ngoài-1: Số đo đầu tiên của hồ sơ khung và giao diện có các tầng làm lại do đoán sau khi vòng đã xong, và chưa có dòng quyết định của chủ kho cho phép. Báo cáo có thể dựa trên một điểm dữ liệu chưa chắc.
  - Ngoài-2: Thẻ chủ kho ký ghi tính năng ghi số đo chính vào mục sẽ không làm, nên người ký có thể đọc nhầm phạm vi.
  - Ngoài-4: Khi một tệp số đo hoặc tệp mốc Quỹ hàng bị hỏng, báo cáo tổng hợp lặng lẽ đếm thiếu hoặc hiện dấu gạch, không cảnh báo.
  - Ngoài-6: Nếu kết quả của một lượt đổi mà số lượt không đổi, lưới vẫn xanh và số tầng làm lại có thể lệch.
  - Ngoài-7: Mỗi lần chạy kiểm thử để lại vài thư mục tạm trên máy, trong đó có một bản sao kho, làm đầy ổ dần.
  - Ngoài-9: Người dùng gõ nhầm hoặc cố ý đưa một tên hồ sơ lạ có thể làm lệnh ghi tệp số đo ra ngoài thư mục nghiệm thu. Đây là công cụ chạy trên máy lập trình viên nên hậu quả nhỏ.
  - Ngoài-10: Một thay đổi về nơi lưu báo cáo độ phủ đi kèm vào vòng này; mỗi lần chạy kiểm thử sẽ để lại thêm một thư mục báo cáo cũ không tự dọn. Người dùng sản phẩm không bị ảnh hưởng.
  - Ngoài-11: Người đo lại mốc theo lời hướng dẫn đầu bảng so sẽ bỏ nhầm một luật đã chốt, nên số Giống/Lệch mới không so được với mốc cũ.
  - Ngoài-12: Chủ kho nhìn thẻ duyệt sẽ thấy tiêu chí chính nằm ở phần 'không làm' và không có ở phần 'sẽ làm', dễ hiểu sai phạm vi khi ký.
  - Ngoài-13: Chủ kho bị hỏi lại một câu đã trả lời và thấy số đếm quyết định cũ trên trang bằng chứng.
  - Ngoài-15: Báo cáo gộp có thể đếm thiếu vòng hoặc để trống cột so với Quỹ hàng mà không cảnh báo, nên người đọc tin nhầm số.
  - Ngoài-16: Một lệnh gõ sai tên hồ sơ có thể ghi tệp số đo ra ngoài thư mục hồ sơ, hoặc đọc tệp ngoài kho, nhưng chỉ khi người chạy tự gõ đường lạ trên máy mình.
  - Ngoài-17: Nếu ai đó viết danh sách giao diện của hồ sơ theo kiểu nhiều dòng, hồ sơ giao diện đó sẽ lọt khỏi lưới kiểm mà không báo gì.
  - Ngoài-19: Bài kiểm dùng dòng dựng sẵn thay vì dòng chép từ sổ chạy thật, nên có thể bỏ sót lệch giữa mẫu và thực tế.
  - Ngoài-20: Nếu một vòng đang đạt sau đó bị chấm lại thành bị từ chối, bản số đo cũ vẫn được coi là còn mới và lưới không báo thiếu tầng làm lại cho vòng đó.
  - Ngoài-21: Một số tệp công khai của kho còn chứa đường dẫn thư mục trên máy của chủ kho, làm lộ tên tài khoản máy. Không lộ khoá hay mật khẩu.
  - Ngoài-23: Dữ liệu mẫu của bài kiểm do người gõ tay chứ không lấy từ khuôn của bộ công cụ, nên nếu khuôn đổi cách viết, bài vẫn xanh trong khi đọc hồ sơ thật có thể sai.
  - Ngoài-24: A round for a mobile screen that has no design-pass file could pass grading without leaving a rework measurement, so that round would be missing from the rework report.
  - Ngoài-25: The first baseline's same-versus-different count (10 vs 11) comes from rules written after the results were seen, so a reader may trust the baseline less than a version fixed in advance. The owner has not yet chosen between this version and the grader's smaller correction (12 vs 9).
  - Ngoài-26: Two baseline plan files cite folders on the owner's own computer that no outside reader of the public repository can open. They also reveal a local home folder name.
  - Ngoài-27: If someone types an odd folder name into the record command, the measurement file could be written outside the acceptance folder. Only the repo owner runs this command on their own machine.
  - Ngoài-28: The automated tests do not cover one of the three statuses that mean the screen frame was already merged. If the check were later broken for that status, a baseline measured too late could pass unnoticed.
  - Ngoài-29: Nếu ai đó gõ nhầm hoặc cố ý gõ tên hồ sơ có dấu đi lên thư mục cha, tệp số đo có thể bị ghi ra ngoài thư mục hồ sơ nghiệm thu.
  - Ngoài-30: Thẻ chủ kho đọc để duyệt kế hoạch ghi việc ghi số đo chính ở mục Sẽ KHÔNG làm, nên bản duyệt có thể bị hiểu sai về phạm vi.
  - Ngoài-31: Nếu bản số đo cũ bị hỏng, chạy lại lệnh ghi sẽ lặng lẽ mất các tầng đã khai trước đó và trông như chưa từng khai.
  - Ngoài-32: Báo cáo gộp có thể bỏ qua một bản số đo hỏng mà không báo, làm số vòng và tỉ lệ làm lại thấp hơn thực tế.
  - Ngoài-33: Bài kiểm chưa chứng minh được số vật, thước, nhát, giờ máy lấy từ dòng cuối, nên nếu sau này lấy nhầm dòng đầu thì có thể không ai biết.
  - Ngoài-34: Báo cáo dạng chữ có thể in lệch cột hoặc sai số so với bản máy đọc mà bài kiểm vẫn xanh.
  - Ngoài-35: Chưa có bài kiểm cho trường hợp khung có mặt nhưng chưa qua cổng, nên lưới có thể chặn nhầm mốc hợp lệ mà không ai thấy.
  - Ngoài-36: Hồ sơ khai kiểu giao diện web hoặc web-ui có thể bị bỏ sót khỏi lưới mà bài kiểm không phát hiện.
