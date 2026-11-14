---
schema_version: 1
feature: Cổng chứng minh màn bắt được khối mới mà vòng dựng không kê ra trong hồ sơ
slug: cong-bat-khoi-khong-ke
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [cli, docs]
screens: []
status: approved
approved_by: Manh Phan
approved_at: 2026-11-14
design_doc: docs/superpowers/specs/2026-11-14-cong-bat-khoi-khong-ke-design.md
---

# Acceptance Contract: cong-bat-khoi-khong-ke

## Context

Cổng chứng minh màn của hàng 1n (`tools/proof_gate/`, quyết định 0023) chỉ xét khối mà hồ sơ của vòng tự kê trong bảng Khối;
khối tạo tay mà không kê thì cổng im lặng. Hàng này làm cổng bắt được thứ mới ấy: mỗi tệp của sổ thành phần sinh
(`design/component-registry.json`) nằm ngoài thư mục nhà cung cấp phải có chỗ kê — sổ khối, danh sách có trước của hàng này, hay
bảng Khối của một hồ sơ đang mở. «So với nhánh chính» làm bằng tệp cố định, không đọc lịch sử git. Hạng T3 vì chạm `tools/**`.
Hàng không có màn (`screens: []`).

Source input: hàng `1q` của `docs/plan/lo-trinh.json`, ô `_acceptance/cong-bat-khoi-khong-ke/opportunity.md`, quyết định
`wiki/decisions/0023-chon-truoc-tao-sau.md`.

Trong bài dưới, «kho mẫu» là kho dựng trong thư mục tạm như ở `tools/proof_gate/proof-gate-0023.test.ts` (không có `.git`);
«lưới» là `python3 tools/proof_gate/check.py --root <kho>`; «tệp tự làm» là tệp có mục trong sổ thành phần mà đường không bắt đầu
bằng `src/components/ui/` hay `src/components/reui/`; «danh sách có trước» là `tools/proof_gate/thanh-phan-co-truoc.yaml`;
«hồ sơ đang mở» là hồ sơ trạng thái `draft`, `approved`, `implemented` hay `verified`.

## Criteria

- AC-1: Given kho mẫu có sổ khối và một tệp tự làm `src/components/candidate/khoi-moi.tsx` (thành phần `KhoiMoi`) không có ở sổ
  khối, danh sách có trước hay bảng Khối nào, When chạy lưới, Then lưới thoát 1 với đúng một dòng mã `khoi-khong-ke`, dòng ấy nêu
  đường tệp và tên `KhoiMoi` và câu ghim «chưa kê ở sổ khối, danh sách có trước hay bảng Khối của hồ sơ đang mở nào»; đối chứng
  dương trên CÙNG kho, mỗi lần đặt riêng một chỗ: dòng sổ khối có `tep` là tệp ấy · dòng sổ khối có `ten: KhoiMoi` · tệp có tên
  trong danh sách có trước của kho mẫu · bảng Khối của một hồ sơ `draft` có dòng `KhoiMoi` → lưới không còn dòng `khoi-khong-ke`;
  trên CÙNG kho đỏ thêm một tệp dưới `src/components/ui/` và một dưới `src/components/reui/` không ở chỗ nào → vẫn đúng một
  dòng `khoi-khong-ke` (nêu `khoi-moi.tsx`), không dòng nào nêu tệp nhà cung cấp; tệp lồng
  `src/components/templates/x/khoi-long.tsx` không ở chỗ nào → có dòng `khoi-khong-ke` nêu đúng đường lồng ấy; cùng kho mà không
  có `design/so-khoi.yaml` → im.
- AC-2: Given kho mẫu với ma trận viết trước sáu trạng thái hồ sơ (`draft`, `approved`, `implemented`, `verified`, `signed-off`,
  `machine-cleared`), mỗi ô một kho chỉ có một chỗ kê là bảng Khối của hồ sơ trạng thái ấy, When chạy lưới trên từng kho, Then
  bài khẳng định số ô bằng 6, bốn trạng thái mở không có dòng `khoi-khong-ke`, hai trạng thái đóng có đúng một dòng
  `khoi-khong-ke` nêu tệp ấy; cùng ma trận với bảng Khối của mục khuôn bọc (`## Khuôn app-shell`) cho kết quả y hệt.
- AC-3: Given hai hình sổ thành phần lấy từ đầu ra THẬT của bộ sinh sổ — `design/component-registry.json` của kho (một mục mỗi
  tệp, có `parts`) và bản sao từng byte của sổ trên đầu nhánh PR #58 (`a7e2c81`, một mục mỗi thành phần), ghi ở
  `tools/proof_gate/fixtures/so-thanh-phan-pr58.json` kèm băm — When bộ đọc của cổng đọc từng hình, Then tệp
  `src/components/candidate/region-header.tsx` cho ra đúng tập thành phần của nó trong hình ấy (hình hôm nay có `RegionHeader`;
  hình PR #58 có `RegionTitle`, `RegionToolbar`, `RegionHeader`); và trên kho mẫu mang mỗi hình, một tệp tự làm có hai thành phần
  `KhoiA`, `KhoiB`: bảng Khối của hồ sơ đang mở nêu chỉ `KhoiB` → không dòng `khoi-khong-ke`; không bảng nào nêu → đúng MỘT dòng
  cho tệp ấy, có cả `KhoiA` và `KhoiB`.
- AC-4: Given kho mẫu của AC-1 (ca đỏ và một ca đối chứng), When chạy lưới với biến `PATH` chỉ trỏ tới một thư mục có duy nhất
  `python3`, Then mã thoát và các dòng ra trùng từng byte với lượt chạy `PATH` thường — luật không cần git; và trong
  `tools/proof_gate/check.py`, `tools/proof_gate/model.py` không có lời gọi tiến trình con mới ngoài các chỗ đã có của `legacy.py`.
- AC-5: Given kho thật, When chạy lưới, Then lưới thoát 0; tập `tep` của danh sách có trước bằng đúng tập ghim trong bài kiểm
  của hàng; mỗi `tep` còn trong sổ thành phần, nằm ngoài thư mục nhà cung cấp, không có dòng sổ khối, và mỗi dòng có `ly_do`
  không rỗng; danh sách có trước của kho mẫu thiếu `tep` hay thiếu `ly_do` → lưới thoát 1 với mã `doc-loi` nêu tên tệp
  danh sách.
- AC-6: Given kho mẫu ở ba ca — một tệp chưa kê có hai thành phần (hình PR #58), hai tệp chưa kê, và đã kê — When chạy
  `check.py --report --json`, Then khoá `khoi_khong_ke` đếm TỆP: bằng 1, 2 và 0; và `tools/proof_gate/khuon-chung-minh.md` có câu nói mọi tệp mới trong `src/components` ngoài
  thư mục nhà cung cấp phải có dòng trong bảng Khối (khớp chuỗi «ngoài thư mục nhà cung cấp»).
- AC-7: Given bài kiểm cũ của cổng, When chạy `config:executors.test.proof_gate`, Then mọi bài của
  `tools/proof_gate/proof-gate.test.ts` (băm git `0f59c79f8582471005018f1f7323ee2baf0037b4`, ghim ở bài của hàng 1n) và của
  `tools/proof_gate/proof-gate-0023.test.ts` đều đạt, và bài ghim băm của tệp 1c vẫn đạt.

## Coverage

Quét trục tại chỗ theo khuôn quét hình thái (không gọi skill: không gian kê hết được từ câu điều kiện bật của ô 1q).

- Trục chỗ kê: sổ khối theo `tep` | sổ khối theo `ten` | danh sách có trước | bảng Khối của màn | bảng Khối của khuôn bọc |
  không ở đâu. AC-1, AC-2.
- Trục trạng thái hồ sơ giữ bảng Khối: 4 mở | 2 đóng. AC-2.
- Trục nơi tệp: tự làm (`candidate`, `templates`) | nhà cung cấp (`ui`, `reui`). AC-1.
- Trục công tắc 0023: có sổ khối | không. AC-1.
- Trục hình sổ thành phần: một mục mỗi tệp | một mục mỗi thành phần. AC-3.
- Trục môi trường: có git | không git, bản sao nông. AC-4.
- Trục kho: kho mẫu | kho thật | danh sách có trước sai khuôn. AC-5.
- Trục đầu ra: dòng lỗi | số cho kit | khuôn cho tác tử dựng màn. AC-1, AC-6.
- Trục không vỡ cũ: bài 1c | bài 0023. AC-7.
- Ngoài máy (người soi): khối nằm ngoài `src/components` (sổ thành phần không quét); vòng kê tên khối mà không thật dùng.

## Đường đo

- Thước: tệp tự làm mới mà không kê ở đâu thì `make check` đỏ · số từ: lưới trong `make test` · bảo đảm bởi: AC-1, AC-2, AC-3
- Thước: ca phá tương ứng đỏ đúng câu · số từ: bài kiểm của hàng (câu ghim) · bảo đảm bởi: AC-1
- Thước: CI bản sao nông không đọc lịch sử git · số từ: bài chạy không có git · bảo đảm bởi: AC-4
- Thước cho kit (số tệp chưa kê) · số từ: `check.py --report --json`, khoá `khoi_khong_ke` · bảo đảm bởi: AC-6

## Out of scope

- Khối tạo tay nằm ngoài `src/components` (vd `src/modules/*/ui`) — sổ thành phần không quét chỗ ấy; đổi phạm vi quét là việc
  của bộ sinh sổ, một hàng riêng.
- Ghi dòng sổ khối cho mười hai tệp có trước (`design/so-khoi.yaml` nằm ngoài vùng của hàng) — theo câu Hỏi-1 ở Cổng Phạm vi.
- Sửa `tools/proof_gate/proof-gate.test.ts`, `design/component-registry.json`, bộ sinh sổ thành phần, `Makefile`, `mk/`.
- So hình khối với ReUI hay hiểu nghĩa khối — người soi ở cổng của vòng màn.

## Notes

- Hạng T3 theo `risk_tiers.t3_paths` (`tools/**`). Tệp sẽ sửa hay thêm: mục 6 của thiết kế.
- Đơn vị kê là tệp, không là tên thành phần, để đúng với cả sổ hôm nay và sổ của PR #58 (mục 3 của thiết kế).
- Thành phần mới thêm vào một tệp ĐÃ kê (tệp có trước, hay tệp của một khối đã nhập kho) — theo câu Hỏi-2 ở Cổng Phạm vi;
  bản nháp theo khuyến nghị: tệp đã kê thì cả tệp đã kê (cổng không bắt).
- Lời hứa «trước khi gộp, máy chạy lưới mới trên đầu mỗi nhánh đang mở và báo giám sát» là bước gộp của kế hoạch, không phải
  tiêu chí: đầu nhánh đổi tới phút gộp, bằng chứng nằm trong tin BÁO G.
- Danh sách có trước tính lúc gộp trên nhánh chính mới nhất, chỉ gồm tệp đã có ở `01c11df` mà chưa có ở sổ khối; tệp thêm vào
  nhánh chính sau đó mà không kê thì không vào danh sách — máy báo giám sát.
