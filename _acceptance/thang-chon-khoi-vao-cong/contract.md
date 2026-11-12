---
schema_version: 1
feature: Vòng dựng màn đi đúng thang kho, kho kết hợp ReUI Pro, tạo tay; thứ mới nhập kho được bày cho chủ kho chọn ở Cổng Phạm vi và có một dòng trong sổ khối
slug: thang-chon-khoi-vao-cong
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [cli, docs]
status: signed-off
approved_by: Manh Phan
approved_at: 2026-11-11
design_doc: _acceptance/thang-chon-khoi-vao-cong/design.md
---

# Acceptance Contract: thang-chon-khoi-vao-cong

## Context

Quyết định 0023 «Chọn trước, tạo sau — kho lớn dần» chốt thang ba bậc (lắp ghép từ kho · kho kết hợp ReUI Pro · tạo tay), luật
ba tầng «giữ nguyên hình» và sổ nhập kho. Cổng chứng minh màn của hàng 1c (`tools/proof_gate/`) chưa khớp: bậc «trong kho» tra
sổ thành phần tự sinh nên khối tạo trong vòng tự thành «trong kho», cổng không đòi ứng viên ReUI, không đòi lý do từng vùng,
không đòi đọc Quỹ hàng hay khai họ màn, và khuôn bọc như App Shell bị đòi chứng minh cho cả các màn nó bọc. Hàng này sửa cổng,
tạo sổ khối `design/so-khoi.yaml` và sửa luật giao diện `.claude/skills/inventory-ui/SKILL.md`. Hạng T3 vì chạm `tools/**`.

Source input: hàng `1n` của `docs/plan/lo-trinh.json`, ô `_acceptance/thang-chon-khoi-vao-cong/opportunity.md`, quyết định
`wiki/decisions/0023-chon-truoc-tao-sau.md`.

Trong bài dưới, «kho mẫu» là kho dựng trong thư mục tạm như ở `tools/proof_gate/proof-gate.test.ts`, có thêm
`design/so-khoi.yaml` và `docs/tri-thuc/wiki/chu-de/`; «lưới» là `python3 tools/proof_gate/check.py --root <kho>`; «hồ sơ luật
0023» là hồ sơ còn mở không có tên trong `tools/proof_gate/chuyen-tiep.yaml`, trong kho có `design/so-khoi.yaml`; «khối nhập kho» là dòng bảng Khối bậc `reui` hay
`ve-tay`.

## Criteria

- AC-1: Given kho mẫu với ma trận viết trước: hai loại hồ sơ (có tên trong `chuyen-tiep.yaml` · không có) × năm trạng thái
  (`draft`, `approved`, `implemented`, `verified`, `signed-off`), mỗi hồ sơ khai một màn Lưới với tệp chứng minh lành theo
  luật 1c mà thiếu mọi mục của luật 0023, When chạy lưới, Then đỏ đúng ba ô (không có tên × `approved`, `implemented`,
  `verified`) với mã của luật 0023, các ô khác im; cùng kho mà không có `design/so-khoi.yaml` thì mọi ô theo luật 1c; tệp
  bài của hàng 1c `tools/proof_gate/proof-gate.test.ts` giữ đúng băm git `0f59c79f8582471005018f1f7323ee2baf0037b4` và vẫn
  đạt; một ma trận viết trước trạng thái (`approved`, `implemented`) × tám mục (Từ Quỹ hàng, Họ, nhóm ứng viên `màn`, nhóm
  ứng viên khối, Vùng, Cách, dòng sổ, Từ Quỹ hàng của khuôn bọc) ghim từng ô đỏ kèm mã hay im; và bài kiểm ghim danh sách chuyển tiếp của
  kho thật là tập con của `app-shell-chon-tu-reui`, `moi-nguoi-gan-vai`, `va-dang-nhap`, mỗi tên kèm lý do không rỗng.
- AC-2: Given hồ sơ luật 0023 `implemented`, When bảng Khối ghi bậc `trong-kho` cho một khối mà sổ khối ghi chính hồ sơ ấy
  nhập (`trong-kho-tu-vong`), cho một khối có trong sổ thành phần dưới `src/components/candidate/` hay `templates/` mà chưa có
  dòng sổ khối (`trong-kho-chua-nhap`), hay cho tên không có ở đâu (`khoi-khong-co`), Then lưới đỏ gọi tên khối với đúng mã;
  đối chứng: thành phần dưới `src/components/ui/` hay `reui/`, và khối có dòng sổ do hồ sơ khác nhập, thì im; hồ sơ chuyển
  tiếp ghi `trong-kho` cho khối chỉ có trong sổ thành phần thì im như luật 1c.
- AC-3: Given hồ sơ luật 0023, When một nhóm ứng viên ReUI bắt buộc (nhóm `màn` cho màn họ mới hay màn mẫu mới từ `approved`;
  nhóm của mỗi khối nhập kho từ `implemented`) vắng, có dưới hai hay trên ba ứng viên, ứng viên không có trong danh mục ReUI,
  ảnh không có, không phải PNG hay hai ứng viên một ảnh trùng byte, chọn hơn một, khối `reui` không phải ứng viên được chọn,
  hay khối `ve-tay` mà có ứng viên được chọn, Then lưới đỏ với mã riêng cho từng ca; màn theo mẫu không bị đòi nhóm `màn`.
- AC-4: Given hồ sơ luật 0023 `implemented` có khối bậc `reui`, When bảng Vùng không có dòng nào cho khối ấy, một dòng xử lý
  khác `lấy`, `bỏ`, `thêm`, một dòng thiếu lý do, cột `Cách` của khối trống hay lạ, hay số vùng `bỏ` lớn hơn nửa số vùng
  `lấy` cộng `bỏ` mà `Cách` ghi `chọn khối`, Then lưới đỏ với mã riêng (`cat-qua-nua` cho ca cuối); cùng số vùng ấy mà ghi
  `ghép từ thành phần` thì im, và bỏ đúng một nửa với `chọn khối` thì im.
- AC-5: Given `design/so-khoi.yaml`, When hai dòng cùng `nhu_cau`, hai dòng cùng `ten`, một dòng thiếu khoá, `nguon` không
  phải `tao-tay` hay tên trong danh mục ReUI, `tep` không có, `duyet` không phải ngày hay khác ngày `approved_at` của hồ sơ
  nhập, `ho_so` không có, hay bảng Khối của hồ sơ nhập không có dòng chứng từ, Then lưới đỏ gọi tên dòng sổ với mã riêng; và
  khi hồ sơ luật 0023 `implemented` có khối nhập kho mà sổ không có dòng `ho_so` trỏ về nó, lưới đỏ `nhap-kho-thieu-so`;
  sổ của kho thật đọc được và lưới xanh trên nó.
- AC-6: Given hồ sơ luật 0023 từ `approved`, When một màn thiếu mục Từ Quỹ hàng, một trong bốn cột Khối Quỹ hàng đã chọn,
  Giữ, Bỏ, Vì sao rỗng, hay cột Trang trỏ tệp không có dưới `docs/tri-thuc/wiki/chu-de/` hoặc ghi «chưa có trang» mà không lý
  do, Then lưới đỏ với mã riêng; trang có thật, và «chưa có trang — <lý do>», thì im.
- AC-7: Given hồ sơ luật 0023 từ `approved`, When một màn thiếu mục Họ, họ đề xuất khác cột `family` của màn trong
  `design/screens.yaml`, lối ghi khác lối máy suy, hay họ `rỗng` mà không vì sao, Then lưới đỏ với `thieu-ho`,
  `ho-lech-so-man`, `loi-lech`, `ho-rong-thieu-ly-do`; ma trận ba lối × họ khớp thì im.
- AC-8: Given hợp đồng khai `khuon_boc: app-shell` và `screens` ba màn, When tệp chứng minh không có mục khuôn ở `implemented`,
  Then lưới đỏ `thieu-chung-minh-khuon` và không đòi `## Màn` cho ba màn được bọc; `khuon_boc` mang id không có trong
  `tools/proof_gate/khuon-boc.yaml` thì đỏ `khuon-boc-la` và vẫn bị đòi chứng minh từng màn; ở hồ sơ chuyển tiếp mục khuôn chỉ cần bảng
  Khối; ở hồ sơ luật 0023 mục khuôn còn đòi Từ Quỹ hàng, nhóm ứng viên của khuôn (trừ khi sổ khối có khuôn ấy do hồ sơ khác
  nhập) và mọi luật khối; cùng hợp đồng không khai `khuon_boc` thì vẫn bị đòi chứng minh từng màn như 1c.
- AC-9: Given kho thật, When chạy `make test`, Then bài «kho thật» chạy lưới trên chính kho và xanh; trên bản sao kho thêm một
  hồ sơ `implemented` khai màn `inventory` với tệp chứng minh lành theo luật 1c thì cùng bài thấy đỏ ở mã của luật 0023; và
  khuôn `tools/proof_gate/khuon-chung-minh.md` điền theo cách một tác tử điền cho bốn lối (họ mới, màn mẫu mới, theo mẫu, khuôn
  bọc) ở hồ sơ luật 0023 `implemented`, kèm dòng sổ khối, qua lưới xanh; đổi tên một mục mới thì đỏ; và kho thật có
  `design/so-khoi.yaml`.
- AC-10: Given `.claude/skills/inventory-ui/SKILL.md` và `tools/proof_gate/khuon-chung-minh.md`, When một tác tử dựng màn đọc
  chúng, Then nó biết thang ba bậc và đi từ trên xuống, luật ba tầng giữ nguyên hình (dòng «Adapting a ReUI block changes its
  data, text and props only» không còn), phải ghi sổ khối khi nhập kho, đọc tài liệu Quỹ hàng theo thứ tự nào, mục mới nào
  cần lúc nào, và lối khuôn bọc; các dòng trỏ lệnh, khuôn, tệp chứng minh và danh mục ReUI của hàng 1c, 1g còn nguyên.
  (judgment)

## Coverage

Quét trục tại chỗ theo khuôn quét hình thái (không gọi skill: không gian kê hết được từ bảy điều của lời giao và quyết định
0023).

- Trục điều của lời giao: 1 trong kho tự vòng (AC-2) | 2 ứng viên kèm ảnh (AC-3) | 3 vùng và cách (AC-4) | 4 sổ khối (AC-5) |
  5 Từ Quỹ hàng (AC-6) | 6 họ màn (AC-7) | 7 khuôn bọc (AC-8).
- Trục lớp luật: chuyển tiếp | luật 0023 | đã đóng. AC-1 (ma trận), AC-2 và AC-8 (chuyển tiếp ở luật riêng).
- Trục trạng thái hồ sơ: `draft` | `approved` | `implemented` | `verified` | đã đóng. AC-1; mục từ `approved` ở AC-3, AC-6, AC-7.
- Trục bậc khối: thành phần nhà cung cấp | khối trong sổ do hồ sơ khác nhập | trong sổ do chính vòng | chỉ trong sổ thành phần |
  không ở đâu | `reui` | `ve-tay`. AC-2, AC-3, AC-4, AC-5.
- Trục lối màn: họ mới | màn mẫu mới | theo mẫu | khuôn bọc. AC-3 (nhóm `màn`), AC-7, AC-8, AC-9.
- Trục ba lối của 1c giữ nguyên: mọi bài cũ. AC-1.
- Trục chỗ chạy: kho mẫu | kho thật trong `make test` | khuôn điền. AC-1–AC-8, AC-9.
- Trục người đọc: tác tử dựng màn (skill, khuôn). AC-10.
- Ngoài máy (người soi): ảnh đúng khối, vùng đủ, nghĩa nhu cầu trùng dưới hai khoá, nội dung trang Quỹ hàng, vòng màn khai
  khuôn bọc để né. Ghi ở Notes, không thành tiêu chí.

## Đường đo

- Thước: khối tạo trong chính vòng mà ghi «trong kho» thì đỏ · số từ: lưới trong `make test` · bảo đảm bởi: AC-2, AC-9
- Thước: màn hay khối mới nhập kho thiếu ứng viên ReUI kèm ảnh thì đỏ · số từ: lưới · bảo đảm bởi: AC-3
- Thước: khối ReUI thiếu dòng lý do vùng, hay cắt quá nửa mà ghi «chọn khối», thì đỏ · số từ: lưới · bảo đảm bởi: AC-4
- Thước: hai dòng sổ khối cùng khoá `nhu_cau` thì đỏ · số từ: lưới · bảo đảm bởi: AC-5
- Thước: hai khoá `nhu_cau` khác nhau mà cùng một nhu cầu thật · số từ: không có — người soi ở Cổng Phạm vi
- Thước: hồ sơ màn thiếu mục «Từ Quỹ hàng» hay thiếu họ của màn thì đỏ · số từ: lưới · bảo đảm bởi: AC-6, AC-7
- Thước cho kit (số khối nhập kho, số hồ sơ chuyển tiếp) · số từ: `check.py --report --json` · bảo đảm bởi: AC-1

## Out of scope

- In tệp chứng minh và ảnh ứng viên lên thẻ cổng của kit (mục chờ KH2, KH3 của kit).
- So ảnh với khối ReUI thật, so vùng với mã khối, hiểu nghĩa nhu cầu — người soi ở cổng.
- Đọc diff `design/screens.yaml` so với nhánh chính; cổng đòi mục Họ cho mọi màn của hồ sơ luật 0023.
- Ghi dòng sổ khối cho thứ đã có (khuôn Lưới, App Shell, đăng nhập, Thành viên) — các hàng 2, 1o, 1p, 9c nhập khi tới lượt.
- Sửa `design/screens.yaml`, `mk/`, `Makefile`, hồ sơ của hàng khác, hay lời tiêu chí đã ký của hàng 1c.

## Notes

- Hạng T3 theo `risk_tiers.t3_paths` (`tools/**`).
- Người soi ở Cổng Phạm vi của mỗi vòng màn, máy không đo: ảnh ứng viên có đúng là khối ReUI mang tên ấy; danh sách vùng có đủ
  vùng thật của khối; nhu cầu con có dùng lời giải của kho; hai khoá `nhu_cau` khác nhau có cùng một nhu cầu thật; trang Quỹ
  hàng có đúng màn và lý do giữ bỏ có hợp lý; một vòng dựng màn có khai `khuon_boc` để né.
- Khuôn bọc: chỉ id có trong `tools/proof_gate/khuon-boc.yaml` (mở bằng `app-shell`); thêm id là sửa `tools/**`, hạng T3.
- Chuyển tiếp: `chuyen-tiep.yaml` kê ba hồ sơ đã qua Cổng Phạm vi (1o, 9, 1m) — chúng giữ luật 1c. Hàng 2 (`bang-hang-ban-doc`,
  `draft`) chịu luật 0023 từ khi qua Cổng Phạm vi. Bảng chuyển tiếp ở mục 11 của thiết kế; giám sát nhận bản BÁO.
- Known limits — chọn ở Cổng Bằng chứng 2026-11-12:
  - Ngoài-1: Một hồ sơ có thể trỏ tới ảnh ứng viên nằm ở nơi khác trên máy mà cổng vẫn cho qua.
  - Ngoài-2: Một vòng có thể cài nguyên một khối ReUI lớn vào thư mục nhà cung cấp rồi ghi là đã có trong kho, nên cổng không đòi ứng viên, lý do vùng hay dòng sổ cho khối đó.
  - Ngoài-3: Báo cáo số đo gửi về kit đếm thiếu các vòng dựng có dùng khuôn bọc như App Shell.
  - Ngoài-4: Hồ sơ có thể dẫn tới ảnh ứng viên ở ngoài thư mục của vòng mà cổng vẫn xanh, nên ảnh có thể không đi kèm hồ sơ khi người khác mở lại.
  - Ngoài-5: Một bài kiểm về việc cổng đọc được sổ khối của kho thật không báo đỏ được; bài kho thật khác vẫn đỏ khi sổ hỏng.
  - Ngoài-6: Bảng thử mục nào bị đòi lúc nào chỉ ghim hai nấc hồ sơ (đã duyệt phạm vi, đã dựng), chưa ghim cả năm nấc.
