---
schema_version: 1
feature: Nâng kit nghiệm thu của kho từ v2.38.1 lên v3.0.0 của kho mới delivery-loop — CI kéo kit 3.0 theo thẻ, phiên Claude Code bật chợ mới, kit-root chỉ đọc bản cài của chợ mới
slug: nang-kit-3-0
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [config, ci, tooling]
status: approved
approved_by: Phan Le Manh
approved_at: 2026-11-18
design_doc: docs/superpowers/specs/2026-11-18-nang-kit-3-0-design.md
---

# Acceptance Contract: nang-kit-3-0

## Context

Kit nghiệm thu dời sang kho công khai `phanlemanh/delivery-loop`; thẻ `v3.0.0` cắt 18/11/2026 trên `c16d25db`. Ba plugin
và mười hai lệnh đổi tên, không có bí danh tên cũ. Kho này đang trỏ kit cũ ở bốn chỗ: việc `gate` của CI, chợ và khoá
plugin của phiên, công cụ `kit-root`, trang gốc tri thức; và còn hai chỗ gọi lệnh cũ ngoài bản vá đã diễn tập. Nhánh cắt
từ `origin/main` ở `8925e8ff`. Diễn tập trên `8925e8ff` cho thấy đổi engine không làm hồ sơ nào đỏ; nhánh chạm đường T3
(`tools/**`, `.claude/settings.json`), nên cổng trước-gộp đòi hồ sơ có chữ ký người — hồ sơ này.

Source input: câu giao của phiên giữ đợt «Chuyển nhà» (18/11/2026); bản vá diễn tập `inventory-cai-3-0.patch` của kho
delivery-loop; CHANGELOG 3.0.0 và `migration/chay-thu-phien/bang-ten.json` của kit ở thẻ `v3.0.0`; design doc ở `design_doc`.

## Criteria

- AC-1: Given `.github/workflows/ci.yml` ở HEAD, When đọc việc `gate` và chạy đúng bước «Fetch the kit by tag» của nó vào
  một thư mục tạm, Then `KIT_TAG` là `v3.0.0`, nguồn là `https://github.com/phanlemanh/delivery-loop`, commit kéo về là
  `c16d25db`, và `CLAUDE_PLUGIN_ROOT` trỏ `<kit>/plugins/acceptance-gate` — thư mục có `scripts/pre-merge-check.sh` và
  `scripts/product-map.mjs`; ngoài ba dòng ấy việc `gate` không đổi so với `origin/main`.
- AC-2: Given kit 3.0 kéo theo thẻ (gốc `plugins/acceptance-gate`) và nhánh ở HEAD, When chạy
  `pre-merge-check.sh . --base origin/main` như CI chạy, Then đầu ra có dòng `pre-merge-check: rules ran=`, và dòng
  `VIOLATION` nếu có thì chỉ đúng một dòng, gọi tên hồ sơ `nang-kit-3-0` với một trong hai lý do vòng đời của chính hồ sơ
  này — `status=implemented but no evidence-report.md` (lúc chấm, báo cáo chưa ghi) hoặc `hạng T3 chưa có chữ ký người —
  code t3_paths phải có người ký` (đã chấm, chưa ký); mọi dòng `VIOLATION` khác — kể cả dòng gọi tên hồ sơ này với lý do
  khác — là đỏ. Phần «sau chữ ký, cùng lệnh 0 `VIOLATION`» đo ở S5 trước khi trình PR (Known limit 2).
- AC-3: Given hai worktree tạm — `8925e8ff` (mốc diễn tập) và `git merge-base HEAD origin/main` tính lúc chấm — When chạy
  cổng trước-gộp với `--recheck-all` trên mỗi worktree bằng kit `v2.38.1` (`phanlemanh/acceptance-gate-kit`) và bằng kit
  `v3.0.0`, Then cả bốn lượt 0 dòng `VIOLATION`, và trên mỗi worktree hai bản kit OK cùng một tập hồ sơ (số không ghim; diễn
  tập trên `8925e8ff`: 57).
- AC-4: Given kit 3.0 kéo theo thẻ và nhánh ở HEAD, When chạy `product-map.mjs --root . --check` của kit 3.0, và ghép gốc
  `<kit>/plugins/acceptance-gate` vào mọi lệnh executor của `_acceptance/config.yaml` có `CLAUDE_PLUGIN_ROOT` hay
  `kit-root` (bốn lệnh: `script.product_map`, `design.floor`, `design.khuon`, `design.ui_check`), Then `product-map` thoát 0
  và mọi tệp script các lệnh ấy gọi đều có thật dưới gốc 3.0.
- AC-5: Given `tools/kit-root.mjs` ở HEAD, When gọi `installEntries` với sổ cài chỉ có khoá
  `acceptance-gate@acceptance-gate-kit`, chỉ có khoá `acceptance-gate@delivery-loop`, có cả hai, hay không có `plugins`,
  và chạy `node tools/kit-root.mjs` với các sổ ấy qua `PLUGIN_REGISTRY`, Then `installEntries` trả lần lượt `[]`, các bản
  cài của chợ mới, các bản cài của chợ mới, `[]`; dòng lệnh in rỗng khi sổ chỉ có bản cài chợ cũ, in đúng đường bản cài
  chợ mới khi có (kể cả khi sổ còn bản cài chợ cũ), và bản cài `project` cho checkout này thắng bản cài `user`; ba ca mới
  trong `tests/kit-root.test.ts` đỏ trên `origin/main` và xanh ở HEAD.
- AC-6: Given `.claude/settings.json` ở HEAD và `.claude-plugin/marketplace.json` của kit 3.0, When so hai tệp, Then chợ
  khai là đúng tên chợ của kit (`delivery-loop`, repo `phanlemanh/delivery-loop`) và ghim `ref` bằng đúng `KIT_TAG` của việc
  `gate` trong `ci.yml` (`v3.0.0`, Hỏi-3); các khoá `…@delivery-loop` bật đúng
  bằng tập plugin của chợ (sáu); không còn khoá `…@acceptance-gate-kit`; `superpowers@claude-plugins-official`, `permissions`
  và `hooks` không đổi so với `origin/main`.
- AC-7: Given `docs/tri-thuc/TRI-THUC.md`, `docs/plan/dot-nen/README.md` và `_acceptance/config.yaml` ở HEAD, When đọc mọi
  lệnh `/<plugin>:<lệnh>` và mọi đường khuôn của kit trong chúng, Then mỗi lệnh có tệp lệnh hay skill tương ứng trong kit
  3.0 và mỗi đường có thật trong kit 3.0.
- AC-8: Given cây ở HEAD, When quét tên kit cũ — `acceptance-gate-kit`; `road-map`/`tri-thuc`/`dieu-phoi` theo sau bởi
  `@`, hay sau `/` và trước `:` (lệnh); `road-map`/`dieu-phoi` giữa hai dấu `/` (đường); hoặc ba tên ấy đứng riêng trong dấu
  backtick — ở mọi tệp theo dõi trừ đúng danh sách loại: `_acceptance/**` (riêng `_acceptance/config.yaml` có quét),
  `wiki/decisions/**`, `docs/tri-thuc/raw/**`, `docs/superpowers/specs/2026-11-18-nang-kit-3-0-design.md`,
  `docs/superpowers/plans/2026-11-18-nang-kit-3-0.md`, và hai tệp gọi tên khoá cũ để chối nó (`tools/kit-root.mjs`,
  `tests/kit-root.test.ts` — hành vi chối do AC-5 canh), Then không còn dòng nào; cùng phép quét trên `8925e8ff` (mốc cố
  định) ra đúng 14 dòng ở 5 tệp (`.claude/settings.json`, `ci.yml`, `docs/plan/dot-nen/README.md`,
  `docs/tri-thuc/TRI-THUC.md`, `_acceptance/config.yaml`). Tiền tố tin commit `tri-thuc: ` của
  `tools/commit_msg.py` không thuộc phép quét: kit 3.0 vẫn tự commit trang tri thức bằng nó.
- AC-9: Given nhánh ở HEAD, When chạy `make check`, Then lệnh thoát 0 (bộ kiểm đơn vị, `tsc --noEmit`, lint không đỏ thêm
  so với `origin/main`).
- AC-10: Given mỗi phép đo `nk30_*` của hồ sơ, When chạy nó trên vật lành rồi trên một bản sao đã phá đúng điều nó canh,
  Then vật lành cho xanh và bản phá cho đỏ với thông điệp ghim trong `evals.yaml`.

## Coverage

Phủ theo tệp chạm và bên đọc của từng tệp; không quét không gian tiêu chí: dòng sổ `descope` «bỏ coverage-scan».

| Tệp hoặc bên đọc | Tiêu chí, hoặc lý do ngoài phạm vi |
| --- | --- |
| `.github/workflows/ci.yml` — việc `gate` (bên đọc: CI của mọi PR) | AC-1, AC-2 |
| Engine cổng đổi 2.38.1 → 3.0.0 trên hồ sơ cũ, kể cả hồ sơ vào `main` sau `8925e8ff` | AC-3, AC-4 |
| Bốn lệnh executor nối script sau gốc kit (`config.yaml` dòng 42, 141, 142, 144) | AC-4 |
| `tools/kit-root.mjs`, `.d.mts`, `tests/kit-root.test.ts` (bên đọc: bốn lệnh executor của `config.yaml`) | AC-5 |
| `.claude/settings.json` (bên đọc: Claude Code khi mở phiên) | AC-6; nạp phiên thật là Known limit |
| `docs/tri-thuc/TRI-THUC.md`, `docs/plan/dot-nen/README.md`, chú thích `dieu_phoi.goi_dot` | AC-7, AC-8 |
| Tên cũ còn sót ở tệp sống | AC-8 |
| Tiền tố tin commit `tri-thuc: ` trong `tools/commit_msg.py` | Giữ nguyên: kit 3.0 vẫn commit bằng nó (`tri-thuc-ghi.mjs`); AC-8 khai loại trừ |
| Bộ kiểm của kho | AC-9 |
| Phép đo của hồ sơ | AC-10 |
| Ba design doc cũ nhắc tên đợt `dieu-phoi-nen`; tên khoá `dieu_phoi`, `tri_thuc` | Ngoài phạm vi: tên đợt là dữ liệu, kit 3.0 vẫn đọc hai khoá (dòng sổ `descope`) |

## Out of scope

- Cài, gỡ hay bật plugin và chợ trên máy (bước 2.4 của bảng bước) — chủ kho làm.
- Mở PR, đẩy lên `main`, gộp PR; sửa kho khác (delivery-loop, Quỹ hàng).
- Đổi tên khoá cấu hình `dieu_phoi`, `tri_thuc`; sửa design doc, hồ sơ hay trang quyết định cũ còn tên cũ.
- Ghim lại hồ sơ đã ký bằng kit 3.0.

## Notes

- Known limits (khai trước): (1) phiên nạp đủ 6 plugin của chợ `delivery-loop` chưa đo ở kho này — máy chưa cài chợ mới;
  (2) phần «sau chữ ký, 0 VIOLATION» của AC-2 chỉ đo được sau Cổng Bằng chứng: máy chạy lại `nk30_gate_branch` ở S5,
  đòi 0 dòng `VIOLATION`, ghi kết quả vào mô tả PR; CI của PR là chốt.
- Phép đo ở `rang/` tự kéo kit theo thẻ vào thư mục tạm ngoài kho; không dựa vào `kit-root` vì máy chưa có chợ mới.
- Thời điểm gộp đã chốt: sau vòng `upgrade-design-assembly-0-7-1` và PR #83; khi đó `main` đi tiếp thì gộp `main` vào nhánh
  (commit gộp, không rebase) rồi chạy lại cổng.
