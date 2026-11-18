---
schema_version: 1
feature: Lên đời bộ setup repo-setup từ 0.4.0 lên 0.9.0, phần máy chạy (CI xếp tầng, sổ ngoài git, đường nâng cấp); luật của kho giữ nguyên, trừ hai điểm chủ kho đồng ý ở Gate 1 (Hỏi-2, Hỏi-3)
slug: upgrade-repo-setup-0-9-0
owner:
risk_tier: T3
surfaces: [config, ci]
status: approved
approved_by: Phan Le Manh
approved_at: 2026-11-18
---

# Acceptance Contract: upgrade-repo-setup-0-9-0

## Context

Thay đổi đã làm sẵn trên nhánh `chore/upgrade-repo-setup-0.9.0`, PR #88, ba commit cắt từ `origin/main` ở `bd32d73e`, cộng một lần gộp nhánh chính:
`a9acfe77` đổi tên `mk/derived.mk` thành `mk/design-role-table.mk` (commit này mang luôn `mk/derived.mk` mới của
repo-setup, nên đứng riêng không dựng được; cả PR thì dựng được), và `fd53ac96` chạy `apply.py` của tag
`repo-setup-v0.9.0` (gộp ba chiều từ 0.4.0) rồi gỡ 12 tệp bị đánh dấu; `0deb79be`, sau Gate 1, đưa `e2e-db` ra khỏi
`needs` của `check` theo câu trả lời của chủ kho cho Hỏi-1; `2109c27d` gộp nhánh chính ở `47d52b06` (PR #87 lên bộ kit delivery-loop
v3.0.0: job `gate` và plugin trong `.claude/settings.json`), gộp tự động, không xung đột dòng. Kho dựng từ 0.4.0 và chưa nâng lần nào; 0.7.0 đến
0.9.0 mang đường nâng cấp, sổ ngoài git và CI xếp tầng. Nhánh đổi `tools/**`, `mk/**`, `Makefile`, `.claude/settings.json`,
`.gitleaks.toml` và workflow, nên là T3 và cổng trước khi gộp đòi hồ sơ có chữ ký người. Hồ sơ này chấm đúng những gì hai
commit đã làm.

Source input: lời chủ kho ngày 2026-11-18 («Làm PR 0 và PR 1», «Viết hồ sơ T3»); kế hoạch
`docs/superpowers/plans/2026-11-18-onehub-upgrade-0.9.0.md` của kho phanlemanh/repo-standards (PR 1 của kế hoạch ấy, dựng từ
một lần chạy thử trên bản sao); CHANGELOG của repo-setup, mục 0.6.0 đến 0.9.0; phản biện context sạch ở `gap-probe.md`.

## Hỏi (chỉ chủ kho trả lời, ở Gate 1)

Kế hoạch (mục 8, câu 3 và 4) để ba điểm này cho chủ kho; lời «Làm PR 0 và PR 1» không trả lời riêng từng điểm. Nhánh đã
làm theo ngả máy khuyên. Mỗi điểm trả lời khác thì nhánh đổi và các tiêu chí ghi bên dưới đổi theo, trước lượt chấm.

- **Hỏi-1 — `e2e-db` chặn gộp.** Đã trả lời: **tách** (chủ kho, 2026-11-18, sau lượt đầu của PR #88). Lúc duyệt, máy
  khuyên đồng ý dựa trên một lượt `main` xanh; lượt đầu của PR thấy `e2e-db` chạm trần 40 phút, và trên `main` 2 trong 4 lượt
  gần nhất cũng chạm trần. `check` nay chờ `quick` và `e2e`; `e2e-db` chạy và báo như hôm nay, không chặn gộp. Dòng sổ
  `revisit` ghi lời chủ kho.
- **Hỏi-2 — mục miễn trong `.gitleaks.toml`** (tệp hạng cao, nó có thể che bí mật thật). Mục miễn hẹp: chỉ giá trị 64 ký tự
  hex, chỉ trong `_acceptance/*/s4-args*.json`. Máy khuyên **đồng ý**: không có nó, `secret-scan` mới đỏ trên mọi PR vì 12
  báo nhầm. Nếu **không**: bỏ mục miễn, `secret-scan` đỏ tới khi có cách khác (vd. `.gitleaksignore` theo vân tay), AC-6
  đổi theo.
- **Hỏi-3 — viết lại bài AC-9 mà hồ sơ đã ký `ci-co-postgres` chạy.** Hợp đồng cũ của AC-9 nói «bản vá áp sạch lên
  `ci.yml` ở HEAD, các job khác giữ nguyên từng byte»; điều đó không thể đúng với CI xếp tầng. Bài mới giữ ảnh, mật khẩu,
  cổng, trần và các bước đã chốt, đặt `e2e-db` ở tầng nặng. Tệp của hồ sơ `ci-co-postgres` không đổi. Hệ quả: E9 của hồ sơ
  ấy (`ci_db_kiem`) vẫn thoát 0 nếu có người ghim lại, nhưng `expected` của nó («`git apply --check` thành công») không còn
  là điều bài đo. Máy khuyên **đồng ý**, và coi AC-8 của hồ sơ này là chỗ đo nay thay cho AC-9 cũ. Nếu **không**: phải chọn
  giữa sửa hồ sơ `ci-co-postgres` bằng một dòng `revisit` của nó, hay không lên CI xếp tầng.

## Criteria

- AC-1: Given nhánh ở HEAD, When chạy `make check` rồi `npm run build`, Then cả hai thoát 0; đầu ra của `make check` có dòng
  `make check passed: upgrade lint typecheck test ontology boundaries coverage-matrix derived-untracked ledgers-check design-assembly design governance`,
  dòng `Tests  2464 passed | 2 skipped (2466)` (PR #87 thêm 3 bài), dòng
  `design-assembly: 19 decisions held by 27 checks, each seen failing on a changed copy` và dòng `no heavy checks`.
- AC-2: Given HEAD, When chạy `apply.py --dry-run --json` của tag `repo-setup-v0.9.0`, Then lệnh thoát 0, `.repo-setup.json`
  ghi `version` `0.9.0`, và các danh sách `created`, `updated`, `merged`, `marked`, `conflict` đều rỗng; cùng lệnh ấy trên
  `bd32d73e` thoát 1, với 12 tệp `marked` và `conflict` là đúng `mk/derived.mk`.
- AC-3: Given HEAD và nhánh chính lúc gộp (`47d52b06`), When so các tệp luật, Then `governance/autonomy.yaml`, `tools/ontology_actions.py`,
  `tools/boundaries.py` và `ontology/relations.yaml` giống từng byte; `.github/CODEOWNERS` khác đúng một dòng, dòng chú thích
  thứ ba; trong `.claude/settings.json`, `permissions`, `enabledPlugins`, `extraKnownMarketplaces` và hai hook `PreToolUse`,
  `Stop` giống hệt, và `hooks` chỉ thêm `SessionStart` chạy `make -s derived`; và ruleset `main` trên GitHub vẫn bắt buộc
  đúng `check`, `e2e`, `gate` với `strict` tắt.
- AC-4: Given `.github/workflows/ci.yml` ở HEAD, When đọc các job, Then có đúng năm job `quick`, `e2e`, `e2e-db`, `check`,
  `gate`; `quick` chạy `make check-quick` rồi `make build`; `e2e` và `e2e-db` có `needs: quick`, bỏ qua khi PR là bản nháp,
  và mỗi job một khoá dùng lại `heavy-ok-<tên job>-`; `check` có `needs: [quick, e2e]` (Hỏi-1: tách), `if: always()` và
  chạy `tools/ci_verdict.py`; job `gate` giống từng byte job ấy ở nhánh chính lúc gộp (`47d52b06`); và When đưa `tools/ci_verdict.py` đủ 16 tổ hợp
  của hai job `check` chờ, mỗi job một trong `success`, `skipped`, `failure`, `cancelled`, Then đúng một tổ hợp (cả hai
  `success`) thoát 0 và 15 tổ hợp còn lại thoát 1, mỗi job không `success` được gọi tên trên một dòng của nó, dòng của job `failure` có
  `failed`, dòng của job `cancelled` có `cancelled`, dòng của job bị bỏ qua khi mọi job khác đã `success` có
  `the pull request is a draft`, và dòng của job bị bỏ qua khi có job khác không `success` có
  `a tier it waits for did not pass` (luật `ci_verdict.py` tự ghi; lời này sửa ở Cổng Phạm vi, xem sổ quyết định).
- AC-5: Given lượt CI của PR #88 trên commit `2109c27d` (lần gộp nhánh chính), When đọc các job, Then `quick`, `e2e` và `check` kết thúc
  `success`, và `e2e-db` có chạy và báo một kết quả, phép đo in kết quả ấy; và Given lượt CI mới nhất của PR #88 trên một
  commit sau `2109c27d` mà mọi tệp nó khác `2109c27d` đều khớp `HEAVY_NOT_INPUTS` (`docs/** wiki/** *.md _acceptance/**`),
  When đọc lượt ấy, Then phép đo in sha của commit ấy, và `e2e` kết thúc `success` mà không chạy lại, tóm tắt của job nói
  `not run again: same inputs as run`; không có lượt nào như thế thì phép đo đỏ với lời riêng.
- AC-6: Given HEAD, When chạy `gitleaks git` trên mọi commit với `.gitleaks.toml` của HEAD (Hỏi-2), Then không có phát hiện
  nào; cùng lệnh ấy với `.gitleaks.toml` của `bd32d73e` thì có đúng 22 phát hiện (12 trước PR #87, 10 từ hồ sơ `nang-kit-3-0` của nó), đều
  `generic-api-key` và đều trong
  `_acceptance/*/s4-args*.json`; và một tệp ngoài `_acceptance/` chứa một giá trị 64 ký tự hex cạnh tên `keys.test.ts` vẫn bị
  bắt; và job `secret-scan` của PR #88 kết thúc `success`.
- AC-7: Given HEAD, When đọc các đích tiên quyết của `check` trong `make -pn check`, Then chúng là `check-quick`,
  `check-heavy`, `design-assembly`, và `node tools/design-assembly/check.mjs` thoát 0 với dòng 19/27 của AC-1; cùng tệp
  `Makefile` mà bỏ chữ `design-assembly` khỏi dòng `check:` trong một bản sao thì `check.mjs` không thoát 0 và báo
  `checks-in-gate: the Makefile's check target no longer runs CHECK_TARGETS`.
- AC-8: Given HEAD, When chạy `tests/ci-yml-patch.test.ts` (Hỏi-3), `tests/ci-ban-sao-nong.test.ts` và
  `tests/coverage-matrix.test.ts`, Then mọi bài đạt; và trên một bản sao, đổi ảnh Postgres của `e2e-db` thành `postgres:15`,
  hay thêm `e2e-db` vào `needs` của `check`, thì `tests/ci-yml-patch.test.ts` có bài đỏ; bỏ `coverage-matrix` khỏi
  `CHECK_TARGETS` thì `tests/coverage-matrix.test.ts` có bài đỏ; và thêm một dòng gọi `git log` vào một tệp mới dưới `tools/`
  thì `tests/ci-ban-sao-nong.test.ts` có bài đỏ gọi tên tệp ấy.
- AC-9: Given HEAD, When hỏi hình của bốn sổ bằng `tools/ledgers.py shape`, Then `log`, `index`, `glossary` và `gen` đều là
  `one-file`, và `make split L=<sổ> DRY=1` của từng sổ thoát 0 mà không ghi tệp nào; `mk/design-role-table.mk` giống từng
  byte `mk/derived.mk` của `bd32d73e`, và `make -n test` vẫn chạy `tools/coverage_matrix/buttons.py`.
- AC-10: Given `bd32d73e`, `fd53ac96`, `0deb79be`, HEAD và báo cáo `apply.py --dry-run --json` của tag `repo-setup-v0.9.0` trên
  `bd32d73e`, When kê tệp đổi từ `bd32d73e` tới `fd53ac96`, Then mỗi tệp thuộc đúng một nhóm của bảng Coverage và số tệp của
  từng nhóm bằng số ghi trong bảng (46 tệp); nhóm của một tệp đọc từ báo cáo của `apply.py` hay danh sách sửa tay, không từ
  chính diff; commit `0deb79be` chỉ đổi `.github/workflows/ci.yml` và `tests/ci-yml-patch.test.ts`; và so với nhánh
  chính lúc gộp (`47d52b06`), ngoài 46 tệp và hai tệp ấy PR không đổi tệp nào ngoài thư mục `_acceptance/upgrade-repo-setup-0-9-0/`,
  `_acceptance/config.yaml`, `PRODUCT-MAP.md` và `LO-TRINH.html`. Khi nhánh đã vào `origin/main`, phép đo chỉ so commit và
  nói đúng điều đó.

## Coverage

Phủ theo 46 tệp của hai commit, nối vào nhóm theo báo cáo `apply.py --dry-run --json` của tag `repo-setup-v0.9.0` trên
`bd32d73e` (14 created, 11 updated, 6 merged, 12 marked, 1 conflict) cộng danh sách sửa tay. Không quét không gian tiêu
chí: lên đời là việc tất định, các nhóm dưới đây là toàn bộ không gian.

| Nhóm | Số tệp | Tiêu chí |
| --- | --- | --- |
| `.repo-setup.json` (bản ghi của lần lên đời) | 1 | AC-2 |
| `created` của báo cáo (`tools/ci_inputs.py`, `tools/ci_verdict.py`, công cụ sổ, `mk/upgrade.mk`, tệp đầu sổ) | 14 | AC-2; AC-4 (hai công cụ CI); AC-9 (công cụ sổ); AC-1 |
| `conflict` của báo cáo, ghi sau khi đổi tên: `mk/derived.mk` (nên «15 tệp mới» sau đổi tên, 14 trước) | 1 | AC-9; AC-2 |
| `updated` của báo cáo, trừ `governance/autonomy.yaml` (giữ bản cũ) | 10 | AC-3 (`CODEOWNERS`); AC-2; AC-1 |
| `merged` của báo cáo (`security.yml`, `.pre-commit-config.yaml`, `.gitignore`, `.gitattributes`, …) | 6 | AC-6; AC-2; AC-1 |
| `marked` của báo cáo, trừ `tools/ontology_actions.py`, `tools/boundaries.py`, `ontology/relations.yaml` (giữ bản cũ) | 9 | AC-4 (`ci.yml`); AC-3 (`settings.json`); AC-7 (`Makefile`); AC-2; AC-1 |
| Sửa tay: `.gitleaks.toml`, `mk/design-role-table.mk`, ba bài kiểm | 5 | AC-6; AC-9; AC-8 |
| Bốn tệp có trong báo cáo mà không đổi | 0 | AC-3 |
| Sau Gate 1, commit `0deb79be` (Hỏi-1: tách): `ci.yml`, `tests/ci-yml-patch.test.ts`, ngoài 46 tệp | 2 | AC-4; AC-5; AC-8; AC-10 |
| `pr-title.yml` (`conventional-commits`), `release.yml` (trong `updated`) | — | AC-10; job `conventional-commits` chạy từ workflow của nhánh chính (`pull_request_target`), nên chỉ có hiệu lực sau khi gộp |
| `e2e`, `e2e-db` trên máy | — | Ngoài phạm vi của phép đo trên máy: cần trình duyệt và Postgres; AC-5 đọc chúng trên CI |

## Out of scope

- Tách bốn sổ (`make split` thật): mỗi sổ một PR riêng, PR 2 đến 5 của kế hoạch.
- Đổi ruleset `main` (bỏ `e2e` khỏi danh sách bắt buộc, khoá cách gộp): PR 6 của kế hoạch, chủ kho quyết.
- Mở PR ở dạng bản nháp, nơi phần lớn lợi ích của CI xếp tầng tới: PR 7 của kế hoạch.
- Nhận các luật mới của repo-setup: ba luật ontology (105 câu trả lời còn mở), `autonomy.yaml` theo 0.6.0, bỏ `deny`/`ask` của
  `settings.json`, thêm `LO-TRINH.html` vào `HEAVY_NOT_INPUTS`. Mỗi luật một quyết định, PR 8 trở đi.
- Lên design-assembly 0.7.2 (phanlemanh/design-assembly#38) và gỡ chữ `design-assembly` khỏi dòng `check:`.
- Xung đột với PR #87 (kit sang delivery-loop v3.0.0), PR nào gộp sau thì gộp ngược một lần.
- Mọi thay đổi giao diện, mã sản phẩm, mô hình dữ liệu hay luật sản phẩm.
- Sửa tệp của một hồ sơ đã ký (`_acceptance/<slug khác>/`), hay ghim lại phép đo của nó. Bài kiểm mà E9 của `ci-co-postgres`
  chạy thì đổi: xem Hỏi-3.

## Notes

- Các con số của tiêu chí (2464 bài, 19 và 27, 46 tệp, 12 tệp đánh dấu, 22 phát hiện) đọc từ kết quả commit đã có: lên đời
  là việc tất định, và hồ sơ này chấm sau khi làm, như hồ sơ `upgrade-design-assembly-0-7-1`. Riêng nhóm của 46 tệp đọc từ
  báo cáo của `apply.py`, một nguồn khác diff. Ma trận ở `rang/matrix.mjs`.
- Các phép đo nằm ở `rang/`, chạy ở lượt chấm và lượt ghim lại, không chạy trong `make check`. Mỗi phép đo có mặt đỏ của nó
  trong `rang/two-way.mjs`.
- AC-2 và AC-10 đọc `apply.py` của tag `repo-setup-v0.9.0`, tải từ kho phanlemanh/repo-standards (hoặc thư mục trong biến
  `REPO_SETUP_PLUGIN`). Máy không đọc được thì phép đo đỏ với lời «cannot read», không xanh suông.
- AC-3 và AC-5 đọc GitHub bằng `gh`. Máy không đăng nhập `gh` thì hai phép đo đỏ với lời «cannot read».
- AC-5 đọc lượt trên `2109c27d`: commit đầu của `ci.yml` đã quyết trên nhánh chính mới. Lượt trên `fd53ac96` chạm trần ở
  `e2e-db`; lượt trên `0deb79be` bị thay khi nhánh chính có PR #87. Nó chỉ chấm
  được sau khi một commit chỉ đổi tệp khớp `HEAVY_NOT_INPUTS` được đẩy và CI của nó chạy xong: GitHub chạy
  lượt cho commit cuối của mỗi lần đẩy, nên commit ấy phải là đầu nhánh lúc đẩy. `LO-TRINH.html` không khớp
  `HEAVY_NOT_INPUTS`, nên nếu nó đổi thì đổi ở commit sau commit được đo.
- Từ PR #87, ô `gate` chạy bộ kit delivery-loop v3.0.0; hồ sơ này viết theo khuôn 2.38.1, và `pre-merge-check` của v3.0.0
  nhận nó (đã chạy ở máy trên cây gộp: chỉ đòi hồ sơ lên `implemented`).
- Chỉ dòng `check:` của `Makefile` mang chữ `design-assembly`; bản 0.7.2 của công cụ lần theo `check-quick`, và chữ ấy gỡ ở PR
  lên đời công cụ.
- Lỗi lượt chấm tìm ra trong các tệp của repo-setup không sửa tay trên nhánh rồi chấm lại im lặng: vòng dừng và trình chủ
  kho.
