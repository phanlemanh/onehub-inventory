---
schema_version: 1
feature: Tắt đích danh sáu plugin của chợ cũ ở mức kho, để phiên Claude Code mở ở kho này chỉ nạp bản 3.0.0 của chợ delivery-loop dù máy bật bản cũ ở mức người dùng
slug: tat-plugin-cho-cu
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [config]
status: signed-off
approved_by: Phan Le Manh
approved_at: 2026-11-18
design_doc: docs/superpowers/specs/2026-11-18-tat-plugin-cho-cu-design.md
---

# Acceptance Contract: tat-plugin-cho-cu

## Context

Sau PR #87 (`47d52b06`), `.claude/settings.json` bật sáu plugin `…@delivery-loop` ghim `v3.0.0` nhưng không tắt plugin của
chợ cũ `acceptance-gate-kit`. Máy của chủ kho bật `acceptance-gate`, `feature-loop`, `diagram-design` của chợ cũ ở mức người
dùng, nên phiên ở kho này nạp hai bản (đo 18/11: 2.38.1 cạnh 3.0.0, 2.7.1 cạnh 3.0.0). Vòng thêm khoá tắt, không đụng cài
đặt mức người dùng. Nhánh cắt từ `origin/main` ở `47d52b06`. Design doc ở `design_doc`.

Phép thử phiên thật: `claude -p "ok" --output-format stream-json --verbose --max-turns 1` chạy từ gốc cây đang xét, đọc tới
sự kiện `type: system`, `subtype: init` rồi dừng; trường `plugins` (tên, `source`, `version`) và `slash_commands`.

## Criteria

- AC-1: Given `.claude/settings.json` ở HEAD và ở `git merge-base HEAD origin/main`, When so hai tệp, Then `enabledPlugins`
  ở HEAD bằng đúng bản ở merge-base cộng sáu khoá `false`: `acceptance-gate`, `feature-loop`, `diagram-design`, `dieu-phoi`,
  `road-map`, `tri-thuc`, mỗi khoá thêm `@acceptance-gate-kit`; mọi khoá khác của tệp (`permissions`, `hooks`,
  `extraKnownMarketplaces`, `$schema`) giống hệt merge-base.
- AC-2: Given máy chạy thước có ít nhất một khoá `…@acceptance-gate-kit: true` trong `enabledPlugins` mức người dùng, When
  chạy phép thử phiên thật trên một worktree tạm ở merge-base, Then thước phiên của AC-3 cho ĐỎ với thông điệp ghim «phien:
  two versions of» (đối chứng dương), và `slash_commands` có `acceptance-gate:cat-luot`. Máy không bật plugin chợ cũ ở mức
  người dùng thì thước thoát 3 «không đối chứng được», không bao giờ thoát 0.
- AC-3: Given cùng tiền đề máy như AC-2, When chạy phép thử phiên thật từ gốc worktree của nhánh ở HEAD, Then mỗi tên plugin
  kit (`acceptance-gate`, `feature-loop`, `diagram-design`, `roadmap`, `knowledge`, `dispatch`, `road-map`, `tri-thuc`,
  `dieu-phoi`) xuất hiện nhiều nhất một lần; đủ sáu plugin `…@delivery-loop`, mỗi cái `version` `3.0.0`; không `source` nào
  kết thúc `@acceptance-gate-kit`; `slash_commands` không có `acceptance-gate:cat-luot` và có `acceptance-gate:scope-slice`
  cùng `feature-loop:feature-loop`.
- AC-4: Given cây ở HEAD, When chạy hàm quét `sweep` của `_acceptance/nang-kit-3-0/rang/leftover.mjs` (chỉ nhập, không sửa
  tệp của hồ sơ ấy), Then mọi dòng nó bắt ở HEAD là một dòng `"<plugin>@acceptance-gate-kit": false` trong
  `.claude/settings.json`, đúng sáu dòng, đúng sáu plugin của AC-1 — không dòng nào ở tệp khác. Đo trên commit đã có đủ hồ sơ,
  design doc, plan và dòng `wiki/log.md` của vòng. (Theo Hỏi-1; chủ kho chọn lối khác thì tiêu chí này đổi trước khi duyệt.)
- AC-5: Given cây ở HEAD, When chạy `nk30_settings` của hồ sơ `nang-kit-3-0`, Then thoát 0 (bên đọc khác của cùng tệp vẫn
  xanh: khoá tắt không phải khoá bật).
- AC-6: Given nhánh ở HEAD, When chạy `make check`, Then thoát 0.
- AC-7: Given mỗi phép đo `tpc_*` của hồ sơ, When chạy nó trên vật lành rồi trên một bản sao đã phá đúng điều nó canh, Then vật
  lành xanh và bản phá đỏ với thông điệp ghim trong `evals.yaml`.

## Coverage

Phủ theo tệp chạm và bên đọc; không quét không gian tiêu chí: dòng sổ `descope` «bỏ coverage-scan».

| Tệp hoặc bên đọc | Tiêu chí |
| --- | --- |
| `.claude/settings.json` — hình của tệp | AC-1 |
| Claude Code khi mở phiên ở kho này (bên đọc chính) — trục cây: merge-base, HEAD | AC-2 (đối chứng dương), AC-3 |
| Trục trạng thái cài của máy: plugin chợ cũ trùng tên bản mới (acceptance-gate, feature-loop, diagram-design) · khác tên bản mới (dieu-phoi, road-map, tri-thuc) · không bật gì | AC-3 (đếm tên và kiểm `source`; ca phá (a) và (e) của E3), AC-2 (máy không bật gì: thoát 3) |
| `nk30_leftover` của hồ sơ `nang-kit-3-0` (bên đọc quét tên cũ) | AC-4 |
| `nk30_settings` của hồ sơ `nang-kit-3-0` (bên đọc hình chợ) | AC-5 |
| Bộ kiểm của kho | AC-6 |
| Phép đo của hồ sơ | AC-7 |

## Out of scope

- Sửa `~/.claude/settings.json` hay bất cứ cài đặt mức người dùng nào; gỡ plugin chợ cũ khỏi máy.
- Sửa tệp trong `_acceptance/nang-kit-3-0/` (theo khuyến nghị của Hỏi-1); sửa `.github/workflows/`, `governance/`.
- Chạy phép thử phiên thật trong CI.

## Notes

- Known limits (khai trước): (1) AC-2 và AC-3 phụ thuộc cài đặt của MÁY chạy thước — không chạy được trong CI; chúng là eval
  chạy tại máy, có tiền đề tự kiểm và đối chứng dương để không xanh giả trên máy không bật plugin chợ cũ. (2) Mỗi lần chạy
  AC-2 hay AC-3 gọi model một lượt (câu «ok», `--max-turns 1`) và cần máy đã đăng nhập Claude Code. (3) Theo khuyến nghị
  Hỏi-1: chạy lại `nk30_leftover` của hồ sơ `nang-kit-3-0` sẽ đỏ (6 dòng khoá tắt) cho tới vòng sửa thước ấy; AC-4 đo chính
  quan hệ đó.
- Sau khi gộp: đo lại phép thử phiên thật một lần trên checkout chính ở `main`, ghi kết quả vào mô tả PR.
- Known limits — chọn ở Cổng Bằng chứng 2026-11-19:
  - Ngoài-1: Nhật ký wiki có một dòng trống thừa sau mục mới, nên mục ấy hiển thị lệch nhẹ so với các mục khác.
  - Ngoài-2: Nếu tệp cài đặt cá nhân của máy bị hỏng, phép thử phiên báo «máy không bật bản cũ» thay vì nêu lỗi đọc tệp; nó không bao giờ báo đạt nhầm.
  - Ngoài-3: Bộ kiểm hai chiều chỉ thử một plugin cũ cho mỗi nhóm, nên một bản thước sau hẹp hơn có thể lọt qua mà bộ kiểm không báo.
