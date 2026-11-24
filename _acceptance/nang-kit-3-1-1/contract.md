---
schema_version: 1
feature: Nâng kit nghiệm thu từ delivery-loop v3.1.0 lên v3.1.1 — bản vá chữ ký giữ chỗ của lệnh gộp theo lời, ở chợ của phiên và ở việc gate của CI
slug: nang-kit-3-1-1
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [config]
status: signed-off
approved_by: Phan Le Manh
approved_at: 2026-11-24
design_doc: docs/superpowers/specs/2026-11-24-nang-kit-3-1-1-design.md
---

# Acceptance Contract: nang-kit-3-1-1

## Context

Thẻ `v3.1.1` của `phanlemanh/delivery-loop` (commit `1193bc22`) vá `v3.1.0`: lệnh gộp theo lời của gói `dispatch` đọc chữ ký
bằng vị từ của lõi, nên báo cáo mang chữ ký giữ chỗ thôi qua vế chữ ký. Kho này là kho nhận của mốc 3.1.x, đang ghim
`v3.1.0` ở `.claude/settings.json` (từ PR #109) và ở `KIT_TAG` của việc `gate` trong `.github/workflows/ci.yml` (từ PR
#110). Mốc 3.1.1 chỉ tính là «được kho nhận» khi một commit trên nhánh chính kéo kit ở `v3.1.1`. Chủ kho quyết 24/11:
Inventory nhận 3.1.1 trước khi kit mở thêm vòng. `.claude/settings.json` thuộc `t3_paths` nên vòng là T3. `ci.yml` là tệp
của người: máy chỉ áp bản vá một dòng đã giữ trong hồ sơ khi chủ kho cho (Hỏi-1).

Source input: câu giao của phiên giữ đợt chuyển nhà (đề bài `migration/de-bai-inventory-3-1-1.md` của kho kit, 24/11);
ghi chú phát hành `v3.1.1`, mục «Kho tiêu thụ làm gì khi nhận»; tiền lệ `_acceptance/nang-kit-3-1/` và `_acceptance/nang-kit-3-0/`.

## Criteria

- AC-1: Given `.claude/settings.json` ở HEAD và ở `git merge-base HEAD origin/main`, When so hai bản và so với
  `.claude-plugin/marketplace.json` của kit `v3.1.1`, Then hai bản khác nhau đúng một dòng — `"ref": "v3.1.0"` thành
  `"ref": "v3.1.1"` của chợ `delivery-loop` (`github:phanlemanh/delivery-loop`) — và các khoá `…@delivery-loop` đang bật
  đúng bằng tập sáu plugin của chợ ở thẻ ấy.
- AC-2: Given kho `phanlemanh/delivery-loop` trên GitHub, When hỏi thẻ `v3.1.1` (bóc tới commit) và đọc `plugin.json` của
  sáu plugin ở commit ấy, Then thẻ trỏ `1193bc22`, năm plugin mang bản `3.1.1` và `diagram-design` giữ `3.0.0`.
- AC-3 (chờ Hỏi-1): Given `.github/workflows/ci.yml` ở HEAD và ở merge-base, và `_acceptance/nang-kit-3-1-1/ci-kit-tag.patch`,
  When so hai bản, Then chúng khác nhau đúng một dòng — `KIT_TAG: v3.1.0` thành `KIT_TAG: v3.1.1` trong việc `gate` — và áp bản
  vá lên `ci.yml` của merge-base cho đúng `ci.yml` của HEAD. Hỏi-1 trả «không» → trước khi S3 chạy, AC-3 thu về Known limits
  (anh tự đổi sau gộp), E3 khai `status: not-run`, và AC-7 chạy kit theo `KIT_TAG: v3.1.0`; máy sửa hợp đồng và trình lại.
- AC-4: Given một bản kéo kit có thẻ `v3.1.1`, When chạy `kiem-ban-cai.mjs --ref v3.1.1 --root <bản kéo>` lấy từ chính thẻ,
  Then lệnh thoát 0 và dòng cuối là `TỔNG KẾT: ĐẠT 8/8 — v3.1.1 (1193bc22) cài đúng tag`.
- AC-5: Given kit ở hai thẻ `v3.1.0` và `v3.1.1` và `_acceptance/config.yaml` ở HEAD, When liệt tệp đổi dưới `plugins/` giữa
  hai thẻ, đọc các lệnh executor của kho ghép đường vào gốc kit, và đọc khoá `feature_loop.gop_theo_loi_ky`, Then tệp đổi đúng
  chín tệp của bảng ở design doc và không tệp nào dưới `plugins/acceptance-gate/scripts/` hay `plugins/acceptance-gate/lib/`;
  mỗi lệnh executor (bốn lệnh lúc thiết kế: `script.product_map`, `design.floor`, `design.khuon`, `design.ui_check`) chạy một
  tệp dưới `scripts/` hay `lib/` của lõi, có ở `v3.1.1`; và kho không bật `feature_loop.gop_theo_loi_ky` — lối duy nhất bản vá
  đổi hành vi không chạy ở kho này.
- AC-6: Given cây ở `git merge-base HEAD origin/main` (tính lúc chấm) và nhánh ở HEAD, When chạy cổng trước-gộp với
  `--recheck-all` trên merge-base bằng kit `v3.1.0` rồi bằng kit `v3.1.1`, và chạy cổng trên HEAD với `--base origin/main` bằng
  cả hai kit, Then trên merge-base cả hai lượt chạy luật, 0 dòng `VIOLATION`, và thông cùng một tập hồ sơ có số phần tử đúng
  bằng số hồ sơ có `contract.md` ở merge-base (đếm bằng git); trên HEAD hai kit in cùng một tập dòng `OK`/`VIOLATION`.
- AC-7: Given kit theo `KIT_TAG` của việc `gate` trong `ci.yml` ở HEAD và nhánh ở HEAD, When chạy `pre-merge-check.sh .
  --base origin/main` như CI chạy, Then kit chạy là `v3.1.1`, đầu ra có dòng `pre-merge-check: rules ran=<r>` với r > 0, và
  trước chữ ký có ít nhất một dòng `VIOLATION`, mọi dòng đều gọi tên hồ sơ `nang-kit-3-1-1`; sau chữ ký Cổng Bằng chứng cùng
  lệnh 0 dòng `VIOLATION` (đo ở S5 bằng `gate-branch --signed`; CI của PR là chốt).
- AC-8: Given nhánh ở HEAD, When chạy `make check`, Then lệnh thoát 0.
- AC-9: Given mỗi phép đo ở `_acceptance/nang-kit-3-1-1/rang/`, When chạy nó trên vật lành rồi trên một bản sao đã phá đúng
  điều nó canh, Then vật lành cho xanh và bản phá cho đỏ với thông điệp ghim trong `evals.yaml`.

## Coverage

Phủ theo tệp chạm và bên đọc của từng tệp kit đổi; không quét không gian tiêu chí: dòng sổ `descope` «bỏ coverage-scan».

| Tệp hoặc bên đọc | Tiêu chí, hoặc lý do ngoài phạm vi |
| --- | --- |
| `.claude/settings.json` — chợ `delivery-loop` (bên đọc: Claude Code khi mở phiên) | AC-1; máy cài đúng thẻ là Known limit (Hỏi-2) |
| Thẻ `v3.1.1` và sáu `plugin.json` (bên đọc: Claude Code cài chợ theo `ref`) | AC-2 |
| `KIT_TAG` của việc `gate` (bên đọc: CI của mọi PR) | AC-3, AC-7 |
| Bản cài sạch của thẻ — tám mục của `kiem-ban-cai` (bước «kho tiêu thụ làm gì khi nhận») | AC-4 |
| Lõi `acceptance-gate` (`scripts/`, `lib/`): bốn lệnh executor của kho | AC-5 |
| Cổng trước-gộp của kit trên mọi hồ sơ cũ và trên hồ sơ này, khi CI đổi sang `v3.1.1` | AC-6 |
| `dispatch/scripts/gop.mjs`, `dieu-phoi.mjs`, khối `GOP-THEO-LOI-KY` của SKILL, `commands/signoff.md` | AC-5 (kho không bật khoá) |
| Việc `gate` của CI trên chính nhánh này | AC-7 |
| Bộ kiểm của kho | AC-8 |
| Phép đo của hồ sơ | AC-9 |
| Sổ cài plugin của máy (`~/.claude/plugins/`) | Ngoài phạm vi: mức máy, của chủ kho (Hỏi-2) |

## Out of scope

- Cài, gỡ hay cập nhật plugin trên máy; sửa `~/.claude/settings.json`; dọn bản ghi mồ côi của sổ cài.
- Bật `feature_loop.gop_theo_loi_ky` hay khoá nào khác của kit 3.1; sửa `governance/`.
- Ghim lại hồ sơ đã ký bằng kit 3.1.1; sửa kho delivery-loop; nhận các PR kit gộp sau thẻ `v3.1.1`.
- Gộp PR — chỉ khi chủ kho bảo ở phiên này.

## Notes

- Known limits (khai trước): (1) máy này vẫn cài 3.0.0 (sổ máy trỏ chợ ở `v3.0.0`, đo `kiem-ban-cai --may` 24/11), nên phiên
  làm vòng này và mọi phiên trên máy tới khi chủ kho cài lại chạy kit 3.0.0 — hồ sơ đo kit theo thẻ, không đo bản cài (Hỏi-2).
  (2) Phần «sau chữ ký, 0 VIOLATION» của AC-7 chỉ đo được sau Cổng Bằng chứng.
- Phép đo ở `rang/` tự kéo kit theo thẻ vào thư mục tạm ngoài kho và đối chiếu commit với ma trận.
- Known limits — chọn ở Cổng Bằng chứng 2026-11-24:
  - Ngoài-1: Phép kiểm các lệnh chấm của kho không đối chiếu đúng bốn tên đã ghim, nên một lệnh viết theo kiểu lạ có thể bị bỏ sót mà vẫn báo đạt.
  - Ngoài-2: Phía «xanh» của bài hai chiều cho phép so cổng hai bản so một lượt chạy với chính nó, nên bằng chứng phía ấy yếu; phép đo cổng hai bản thật vẫn chạy cả hai bản.
