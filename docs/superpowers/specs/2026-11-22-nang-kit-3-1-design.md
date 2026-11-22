# Nâng kit nghiệm thu lên delivery-loop v3.1.0 — design

Ngày: 2026-11-22 · Hồ sơ: `_acceptance/nang-kit-3-1/` · PR #109 (nhánh `chore/upgrade-kit-ref-v3.1.0`)

## Vì sao

Chủ kho ký gói LUẬT «Mặc-ký có phủ quyết cho hàng backend» ngày 22/11/2026. Luật có hiệu lực khi kho chạy bản kit mang
trợ lý quyết định (thẻ `v3.1.0` của `phanlemanh/delivery-loop`) và khối `tro_ly_quyet_dinh` được bật (PR #108). Hồ sơ này
lo vế thứ nhất: phiên Claude Code của kho cài chợ `delivery-loop` ở thẻ `v3.1.0` thay cho `v3.0.0`.

## Thay đổi

Một dòng: `.claude/settings.json`, `extraKnownMarketplaces.delivery-loop.source.ref` từ `v3.0.0` thành `v3.1.0`. Các khoá
plugin, quyền và móc không đổi. Bản 3.1 không đổi tên plugin hay lệnh, nên tài liệu sống và bốn lệnh executor dùng gốc kit
không phải sửa (AC-4 đo).

Không đổi: việc `gate` của CI (`KIT_TAG: v3.0.0` — tệp của người, Hỏi-1), `_acceptance/config.yaml` (PR #108),
`governance/autonomy.yaml` (chủ kho tự sửa).

## Bản 3.1 khác 3.0 ở đâu với kho này

- Lõi `acceptance-gate`: thêm `scripts/tro-ly-quyet-dinh.cjs` (mặc-ký, giữ-quyền, kiểm mẫu, sổ đếm); `can-cu-s1.cjs`,
  `gate-card.js`, `product-map.mjs`, `start-scan.mjs`, `lib/workspace-record.cjs` đổi. `pre-merge-check.sh` không đổi.
- `dispatch`: thêm `chuyen-gop.mjs`, `cua-proof.mjs` (lệnh `dieu-phoi.mjs chuyen`); `gop.mjs` đổi.
- Năm plugin lên `3.1.0`; `diagram-design` giữ `3.0.0`.

Diễn tập lúc thiết kế trên `1410a0f0`: cổng `--recheck-all` của 3.0 và 3.1 cùng thông 72 hồ sơ, 0 vi phạm; trợ lý quyết định
`--dem` thoát 0 và đếm 72 hồ sơ; `product-map --check` của 3.1 thoát 0 trên cây chưa có hồ sơ này.

## Phép đo

Theo khuôn `nang-kit-3-0`: răng ở `_acceptance/nang-kit-3-1/rang/`, kéo kit theo thẻ vào thư mục tạm ngoài kho, đối chiếu
commit với ma trận `matrix.mjs`; mỗi răng có cặp hai chiều trong `two-way.mjs`. Lệnh riêng của hồ sơ khai thẳng trong
`evals.yaml` (không thêm khoá vào `_acceptance/config.yaml`).

| Răng                                  | Tiêu chí | Đo gì                                                        |
| ------------------------------------- | -------- | ------------------------------------------------------------ |
| `settings.mjs`                        | AC-1     | đúng một dòng đổi so với main; plugin bật = chợ ở thẻ        |
| `tag.mjs`                             | AC-2     | thẻ trên GitHub bóc ra `0a93a5b9`; bản của sáu plugin        |
| `tro-ly.mjs`                          | AC-3     | `--dem` thoát 0, đếm = số hồ sơ có hợp đồng, đủ bảy loại câu |
| `product-map.mjs`, `doc-commands.mjs` | AC-4     | bản đồ sản phẩm, bốn executor, lệnh trong tài liệu sống      |
| `gate-control.mjs`                    | AC-5     | 3.0 và 3.1 cho cùng kết quả trên mọi hồ sơ ở merge-base      |
| `gate-branch.mjs`                     | AC-6     | cổng theo `KIT_TAG` của CI trên nhánh: chỉ dừng vì hồ sơ này |

## Câu hỏi cho chủ kho

- Hỏi-1: CI giữ `v3.0.0` trong PR này (khuyên) hay chủ kho đổi `KIT_TAG` trên nhánh trước lượt chấm.
- Hỏi-2: chấm từ bản chép kho bên ngoài vì đợt đang nghỉ (khuyên) hay chờ đợt chạy lại.
