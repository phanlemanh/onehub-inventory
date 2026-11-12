---
schema_version: 1
feature: Bộ kiểm cách ly bắt cả dạng xem chỉ cấp quyền ghi, sửa hay xoá cho vai của ứng dụng mà không chạy theo quyền người đọc
slug: cach-ly-dang-xem-chi-ghi
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [api, config]
status: signed-off
approved_by: Manh Phan
approved_at: 2026-11-12
design_doc: _acceptance/cach-ly-dang-xem-chi-ghi/design.md
---

# Acceptance Contract: cach-ly-dang-xem-chi-ghi

## Context

Hàng 7a thêm ca `dang-xem-khong-vuot-luat`: mọi dạng xem vai của ứng dụng ĐỌC được phải chạy theo quyền người đọc. Một
dạng xem thường chỉ được cấp quyền thêm, sửa hay xoá lọt ca ấy, và qua nó một sàn xoá được thoả thuận của mọi sàn (đã
thử trên cơ sở dữ liệu nháp, xem design). Chủ kho chọn mở hợp đồng mới cho mục này (Ngoài-1 của hàng 7a). Kèm theo,
giám sát giao dọn cặp phá thử cũ của hàng 9 mà hàng 9a để lại đỏ. Luật chạm: SP-1 — chỉ siết, không nới.

Source input: hàng 7b của `docs/plan/lo-trinh.json`, ô cơ hội `_acceptance/cach-ly-dang-xem-chi-ghi/opportunity.md` đã
quyết «build» bởi Manh Phan; dòng `d-20261112T043105Z-15` trong `_acceptance/cach-ly-truoc-du-lieu-that/decisions.jsonl`.

## Criteria

- AC-1: Given cơ sở dữ liệu đã áp mọi migration, When bộ kiểm cách ly liệt mọi dạng xem ở mọi schema không phải hệ thống
  mà vai của ứng dụng có quyền thêm, sửa (trên bất kỳ cột nào) hay xoá — nhận thẳng, qua PUBLIC hay qua vai mẹ, Then mỗi
  dạng xem ấy chạy theo quyền người đọc và bộ kiểm in đúng một lần dòng `ok dang-xem-ghi-khong-vuot-luat — <n> dạng xem, đối chứng 1`; đối
  chứng trong cùng ca: một dạng xem chạy theo quyền người đọc được cấp thêm, sửa và xoá cho vai thì được đếm đúng 1
  mà không bị nêu.
- AC-2: Given ba bản sao cơ sở dữ liệu, mỗi bản thêm một dạng xem thường trên bảng thoả thuận không cấp quyền đọc — chỉ
  cấp xoá cho vai ở `public`; chỉ cấp sửa một cột cho PUBLIC; chỉ cấp thêm cho vai ở một schema mới — When chạy bộ kiểm
  cách ly trên từng bản, Then mỗi bản đỏ với dòng ghim nêu tên dạng xem và quyền
  (`HỎNG dang-xem-ghi-khong-vuot-luat: public.agreements_xoa DELETE`, `…: public.agreements_sua_ben UPDATE`,
  `…: kho_xem.agreements_them INSERT`), ca 18 `dang-xem-khong-vuot-luat` của hàng 7a vẫn in `ok` trên cả ba bản, và
  bộ chạy in `ok pha-thu-dang-xem-chi-ghi`.
- AC-3 (cross-layer): Given bản sao có dạng xem chỉ cấp xoá ở AC-2 và hai sàn A, B mỗi sàn một thoả thuận, When dưới vai
  của ứng dụng với sàn A (đúng câu của cửa) lệnh xoá đi qua dạng xem ấy, Then thoả thuận của sàn B mất (vai chủ đếm
  1 → 0); trên cùng bản sao với dạng xem ấy đổi sang chạy theo quyền người đọc, cùng lệnh bị từ chối với lỗi
  `permission denied for table agreements` (vai của ứng dụng không có quyền xoá trên bảng) và vai chủ đếm thoả thuận
  của B vẫn 1.
- AC-4: Given bản lành, When chạy bộ chạy cách ly, Then dòng cuối là `cach-ly: 31 ca đạt, vai quy_hang_app`; và trên
  một bản sao thư mục kiểm mà tệp phá `dang-xem-chi-xoa` bị thay bằng `select 1;`, bộ chạy thoát khác 0 và in đúng
  `HỎNG pha-thu-dang-xem-chi-ghi: dang-xem-chi-xoa: bộ kiểm vẫn xanh trên bản phá`.
- AC-5: Given cây sau hàng này, When chạy bộ chạy cách ly trên bản lành, Then 29 ca của hàng 7 và 7a vẫn in `ok` đúng
  một lần mỗi ca, và 29 tên ca cùng 18 dòng ghim của tệp phá cũ — đọc thẳng từ bộ chạy ở commit `d85d815` (hàng 7a
  vào nhánh chính) — có mặt nguyên từng chữ trong bộ chạy mới (không phép đo nào bị nới).
- AC-6 (cross-layer): Given hàm mời người của cơ sở dữ liệu sau hàng 9a, When dưới vai của ứng dụng, với phiên của một
  người chỉ có vai Đầu chủ ở sàn của mình, gọi thẳng hàm mời một email mới, Then lời gọi bị từ chối và số thành viên của
  sàn không đổi; trên bản sao mà hàm mời bỏ đúng phép kiểm quyền, cùng lời gọi thêm được người và cặp phá thử
  `pha-thu-moi-khong-kiem-quan-tri` đỏ với thông điệp ghim `ba-vai-khong-quan-tri: cơ sở dữ liệu cho Đầu chủ mời người`.
- AC-7: Given cây sau hàng này trên Postgres của dãy C, When chạy cả bộ kiểm cơ sở dữ liệu (`tests/db/*.db.test.ts`)
  trong một lệnh không bộ lọc bỏ ca, Then lệnh thoát 0 với 0 ca bị bỏ qua; và `make check` xanh.

## Coverage

Không gian quét tay (dòng `descope` «bỏ coverage-scan» trong sổ). Trục và ô:

| Trục | Ô | AC |
|---|---|---|
| Quyền ghi trên dạng xem | thêm · sửa (cả sửa một cột) · xoá | AC-1, AC-2 |
| Đường nhận quyền | cấp thẳng cho vai · qua PUBLIC · qua vai mẹ (cùng hàm đọc quyền) | AC-1, AC-2 (thẳng, PUBLIC) |
| Schema của dạng xem | `public` · schema mới | AC-2 |
| Kiểu dạng xem | thường (đỏ) · chạy theo người đọc (xanh, đối chứng) · vật chất hoá (không ghi được — ngoài trục) | AC-1, AC-2, AC-3 |
| Kẽ hở thật hay báo động suông | xoá được dòng sàn khác · đối chứng không xoá được | AC-3 |
| Không nới phép đo cũ | 29 ca, 18 dòng ghim của hàng 7, 7a | AC-5 |
| Việc kèm hàng 9 | lớp cơ sở dữ liệu của việc mời · cả bộ kiểm cơ sở dữ liệu xanh | AC-6, AC-7 |

`[CE chưa kiểm chứng]` đường «qua vai mẹ» không có tệp phá riêng: `has_table_privilege` và `has_any_column_privilege`
đã tính quyền thừa kế, và tệp phá `cap-trigger-public` của hàng 7a đã chứng đường PUBLIC cùng họ hàm ấy.

## Đường đo

| Thước của ô cơ hội | Số từ đâu | AC bảo đảm |
|---|---|---|
| Một dạng xem chỉ có quyền ghi, sửa hay xoá mà vượt luật theo dòng thì bộ kiểm cách ly đỏ | dòng `HỎNG dang-xem-ghi-khong-vuot-luat: …` của bộ chạy trên bản phá | AC-1, AC-2 |
| Ca phá dựng đúng dạng xem ấy trên bản sao và đỏ với thông điệp ghim | dòng `ok pha-thu-dang-xem-chi-ghi` và ca phá của bài kiểm cơ sở dữ liệu | AC-2, AC-3, AC-4 |

## Out of scope

- Luật viết lại câu (`CREATE RULE … DO INSTEAD`) gắn trên dạng xem — giữ ngoài phạm vi như hàng 7a.
- Chạy bộ kiểm cách ly trên CI — hàng 1s.
- Ứng dụng nối cơ sở dữ liệu bằng vai không phải chủ bảng — hàng 7c.
- Các ca và cặp phá thử khác của hàng 9 — không đổi.

## Notes

- Không migration. Không viết mã trước khi PR #36 (hàng 9a) vào nhánh chính; khi đó gộp nhánh chính về một lần.
- Việc kèm cần chạm `tests/db/moi-nguoi.db.test.ts` và thêm một dòng `_acceptance/config.yaml` — xin giám sát ở yêu cầu
  C-5. Giám sát từ chối thì AC-6, AC-7 ra khỏi hợp đồng này (thành việc riêng) và Cổng Phạm vi ký lại; chưa có trả lời
  thì không dựng việc 7 của kế hoạch.
- Known limits — chọn ở Cổng Bằng chứng 2026-11-13:
  - Ngoài-1: Bộ kiểm cách ly vẫn xanh với dạng xem chạy theo quyền người đọc mà gắn luật viết lại câu, dù qua luật ấy một sàn xoá được dữ liệu sàn khác (chạm SP-1, chưa có dạng xem nào như vậy).
  - Ngoài-2: Mô tả phép đo E5 ghi 18 dòng ghim của bộ chạy cũ, số thật là 21; phép kiểm đo đủ 21.
  - Ngoài-3: Đối chứng dương của ca 20 chỉ chứng dạng xem đúng không bị nêu, chưa chứng bộ kiểm nhận đủ cả ba quyền thêm, sửa, xoá.
  - Ngoài-4: Đường cấp quyền ghi qua vai cha chưa có bản phá thử riêng; nó được phủ nhờ hàm đọc quyền tính quyền thừa kế.
