---
schema_version: 1
feature: Nâng kit nghiệm thu của phiên từ delivery-loop v3.0.0 lên v3.1.0 — bản mang trợ lý quyết định (mặc-ký có phủ quyết, giữ-quyền, kiểm mẫu) và chuyến gộp
slug: nang-kit-3-1
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [config, tooling]
status: draft
design_doc: docs/superpowers/specs/2026-11-22-nang-kit-3-1-design.md
---

# Acceptance Contract: nang-kit-3-1

## Context

Chủ kho ký gói LUẬT «Mặc-ký có phủ quyết cho hàng backend» ngày 22/11/2026 (`.acceptance-runs/dieu-phoi-nen/LUAT.md`);
luật có hiệu lực khi hai PR được gộp: PR #108 bật khối `tro_ly_quyet_dinh` trong `_acceptance/config.yaml`, và PR #109
— hồ sơ này — nâng chợ `delivery-loop` của phiên từ thẻ `v3.0.0` lên `v3.1.0`. Thẻ `v3.1.0` (đối tượng thẻ `b623358b`, commit
`0a93a5b9`) mang `scripts/tro-ly-quyet-dinh.cjs` của lõi và `chuyen-gop.mjs` của gói điều phối. Nhánh chỉ đổi một dòng
`ref` trong `.claude/settings.json` — đường T3 — nên cổng trước-gộp đòi hồ sơ có chữ ký người. Việc `gate` của CI vẫn kéo
kit theo `KIT_TAG: v3.0.0` (tệp CI của người; Hỏi-1).

Source input: câu giao của phiên trợ lý quyết định (22/11/2026); tiền lệ `_acceptance/nang-kit-3-0/` (PR #87); design doc ở
`design_doc`.

## Criteria

- AC-1: Given `.claude/settings.json` ở HEAD và ở `git merge-base HEAD origin/main`, When so hai bản và so với
  `.claude-plugin/marketplace.json` của kit `v3.1.0`, Then hai bản khác nhau đúng một dòng — `"ref": "v3.0.0"` thành
  `"ref": "v3.1.0"` của chợ `delivery-loop` (`github:phanlemanh/delivery-loop`) — và các khoá `…@delivery-loop` đang bật
  đúng bằng tập sáu plugin của chợ ở thẻ ấy.
- AC-2: Given kho `phanlemanh/delivery-loop` trên GitHub, When hỏi thẻ `v3.1.0` (bóc tới commit) và đọc `plugin.json` của
  sáu plugin ở commit ấy, Then thẻ trỏ `0a93a5b9`, năm plugin mang bản `3.1.0` và `diagram-design` giữ `3.0.0`.
- AC-3: Given kit kéo theo thẻ `v3.1.0` và cây ở HEAD, When chạy `node <kit>/plugins/acceptance-gate/scripts/tro-ly-quyet-dinh.cjs
  --root . --dem`, Then lệnh thoát 0, dòng đầu đếm đúng số hồ sơ có `contract.md` dưới `_acceptance/`, và có một dòng đếm cho
  mỗi loại câu của danh mục đóng (bảy loại); cùng lệnh không có ở kit `v3.0.0`.
- AC-4: Given kit `v3.1.0` và cây ở HEAD, When chạy `product-map.mjs --root . --check` của kit, ghép gốc
  `<kit>/plugins/acceptance-gate` vào bốn lệnh executor của `_acceptance/config.yaml` dùng gốc kit (`script.product_map`,
  `design.floor`, `design.khuon`, `design.ui_check`), và đọc mọi lệnh `/<plugin>:<lệnh>` cùng đường khuôn kit trong
  `docs/tri-thuc/TRI-THUC.md`, `docs/plan/dot-nen/README.md`, `_acceptance/config.yaml`, Then `product-map` thoát 0, bốn tệp
  script có thật dưới gốc 3.1, và 4 lần nhắc lệnh (3 lệnh khác nhau) cùng 1 đường khuôn đều có trong kit 3.1.
- AC-5: Given cây ở `git merge-base HEAD origin/main` (tính lúc chấm), When chạy cổng trước-gộp với `--recheck-all` bằng
  kit `v3.0.0` rồi bằng kit `v3.1.0`, Then cả hai lượt 0 dòng `VIOLATION` và thông cùng một tập hồ sơ (số không ghim; lúc
  thiết kế trên `1410a0f0`: 72).
- AC-6: Given kit theo `KIT_TAG` của việc `gate` trong `.github/workflows/ci.yml` (lúc thiết kế: `v3.0.0`) và nhánh ở HEAD,
  When chạy `pre-merge-check.sh . --base origin/main` như CI chạy, Then đầu ra có dòng `pre-merge-check: rules ran=` và mọi dòng
  `VIOLATION` (nếu có) đều gọi tên hồ sơ `nang-kit-3-1`; sau chữ ký Cổng Bằng chứng cùng lệnh 0 dòng `VIOLATION` (đo ở S5 bằng
  `gate-branch --signed`, ghi vào mô tả PR; CI của PR là chốt).
- AC-7: Given nhánh ở HEAD, When chạy `make check`, Then lệnh thoát 0.
- AC-8: Given mỗi phép đo ở `_acceptance/nang-kit-3-1/rang/`, When chạy nó trên vật lành rồi trên một bản sao đã phá đúng điều
  nó canh, Then vật lành cho xanh và bản phá cho đỏ với thông điệp ghim trong `evals.yaml`.

## Coverage

Phủ theo tệp chạm và bên đọc của từng tệp; không quét không gian tiêu chí: dòng sổ `descope` «bỏ coverage-scan».

| Tệp hoặc bên đọc | Tiêu chí, hoặc lý do ngoài phạm vi |
| --- | --- |
| `.claude/settings.json` — chợ `delivery-loop` (bên đọc: Claude Code khi mở phiên) | AC-1; nạp phiên thật là Known limit |
| Thẻ `v3.1.0` của kho kit (bên đọc: Claude Code cài chợ theo `ref`) | AC-2 |
| Trợ lý quyết định của kit 3.1 đọc hồ sơ của kho (bên đọc: bước thiết kế khi bật mặc-ký) | AC-3 |
| `product-map`, bốn lệnh executor và tài liệu sống gọi lệnh kit (bên đọc: `make check`, lượt chấm, người đọc) | AC-4 |
| Cổng trước-gộp của kit trên hồ sơ cũ khi CI đổi sang 3.1 | AC-5 |
| Việc `gate` của CI trên chính nhánh này | AC-6 |
| Bộ kiểm của kho | AC-7 |
| Phép đo của hồ sơ | AC-8 |
| Khối `tro_ly_quyet_dinh` trong `_acceptance/config.yaml`, `governance/autonomy.yaml`, `KIT_TAG` của `ci.yml` | Ngoài phạm vi: PR #108, tệp của chủ kho, Hỏi-1 |

## Out of scope

- Bật mặc-ký (khối `tro_ly_quyet_dinh` — PR #108); sửa `governance/autonomy.yaml` (chủ kho tự sửa, LUẬT 22/11 điểm 6).
- Sửa `.github/workflows/` — kể cả `KIT_TAG` của việc `gate` (Hỏi-1).
- Cài, gỡ hay cập nhật plugin trên máy; ghim lại hồ sơ đã ký bằng kit 3.1; sửa kho delivery-loop.
- Mở PR mới hay gộp PR #109 — nút gộp của chủ kho.

## Notes

- Known limits (khai trước): (1) phiên nạp đủ sáu plugin bản 3.1 sau khi gộp chưa đo ở kho này — máy đang cài 3.0.0 trong
  bộ nhớ đệm plugin; Claude Code cập nhật chợ khi mở phiên mới. (2) Phần «sau chữ ký, 0 VIOLATION» của AC-6 chỉ đo được sau
  Cổng Bằng chứng. (3) Theo khuyến nghị Hỏi-1, tới khi chủ kho đổi `KIT_TAG`, CI chạy cổng bản 3.0 còn phiên chạy 3.1; AC-5 đo
  hai bản cho cùng kết quả trên mọi hồ sơ lúc chấm.
- Phép đo ở `rang/` tự kéo kit theo thẻ vào thư mục tạm ngoài kho và đối chiếu commit với ma trận; không dựa vào bản cài
  trên máy.
