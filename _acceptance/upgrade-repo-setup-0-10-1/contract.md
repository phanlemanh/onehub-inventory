---
schema_version: 1
feature: Lên đời bộ setup repo-setup từ 0.9.0 lên 0.10.1 — ô conventional-commits chấm commit bằng hook commit-msg của chính kho, AGENTS.md thêm mục «What holds these rules»; không luật nào của kho đổi
slug: upgrade-repo-setup-0-10-1
owner:
risk_tier: T2
surfaces: [config, ci, docs]
status: approved
approved_by: Phan Le Manh
approved_at: 2026-11-20
---

# Acceptance Contract: upgrade-repo-setup-0-10-1

## Context

Thay đổi đã làm sẵn trên nhánh `chore/upgrade-repo-setup-0.10.1`, PR #93 (bản nháp), hai commit trên `main` ở `1ad8469f`:
`238099bb` chạy `apply.py` của tag `repo-setup-v0.10.1` (kho phanlemanh/repo-standards), không tuỳ chọn, và đổi ba tệp
(`.github/workflows/pr-title.yml` do công cụ cập nhật, `AGENTS.md` do công cụ gộp, `.repo-setup.json`); `10f4e6fb` ghi một
dòng sổ dưới `wiki/log/`. Lý do làm bây giờ: từ lần lên 0.9.0, job `conventional-commits` đỏ trên mọi PR, vì nó gọi hook
theo id `conventional-pre-commit` mà `.pre-commit-config.yaml` của kho không có (kho dùng hook riêng `tools/commit_msg.py`);
0.10.0 cho job gọi mọi hook commit-msg của chính kho. Hai tệp `pr-title.yml` và `.repo-setup.json` nằm ngoài
`risk_tiers.t1_skip_globs`, không tệp nào thuộc `t3_paths`, nên hồ sơ là T2. Hồ sơ chấm sau khi làm, như hồ sơ
`upgrade-repo-setup-0-9-0`: lên đời là việc tất định, tiêu chí đọc từ tag và mô tả PR, không từ chính cây.

Source input: brief của phiên repo-standards ngày 2026-11-20 (PR #93, hai commit, `make check-quick` đã xanh trên nhánh);
CHANGELOG của repo-setup, mục 0.10.0 và 0.10.1; phản biện context sạch ở `gap-probe.md`.

## Hỏi (chỉ chủ kho trả lời, ở Gate 1)

- **Hỏi-1 — cho máy chạy `apply.py` của tag (AC-2).** Phiên này tải tag về được nhưng bộ phân loại quyền của Claude Code
  chặn chạy mã vừa tải. `apply.py` là công cụ của chính chủ kho; phép đo chạy nó ba lần: hai lần chạy thử (`--dry-run`,
  không ghi gì) trên HEAD và trên nền, một lần chạy thật trên một bản sao tạm của nền (worktree trong thư mục tạm, xoá
  sau khi so). Lần chạy thật là nguồn ngoài cây cho chữ của `AGENTS.md` và `pr-title.yml` (phản biện P1-5). Hồ sơ
  `upgrade-repo-setup-0-9-0` đã chạy cùng loại lệnh. Máy khuyên **cho phép** (thêm quyền cho lệnh `rs0101_apply_again`,
  hoặc chủ kho tự chạy lệnh ấy một lần và dán kết quả). Nếu **không**: bỏ AC-2 bằng một dòng `descope`; AC-3 vẫn chứng
  `pr-title.yml` đúng từng byte bản mẫu của tag, nhưng chữ thêm vào `AGENTS.md` chỉ còn đối chiếu với diff của PR.
- **Hỏi-2 — hệ quả sau khi gộp: `conventional-commits` sẽ đỏ trên PR có commit chữ ký của kit.** Job mới chấm bằng mọi
  hook commit-msg của kho, và hook duy nhất thật sự chấm là `tools/commit_msg.py`; hook này không nhận các tiêu đề kit tự
  viết như `Gate 2 signoff: <slug> — <tên>` và `repin(<slug>): …`. AC-4 đo điều đó: hai tiêu đề mẫu bị từ chối, và trên
  nền từ 2026-11-01 có 13 commit không qua hook (7 `Gate 2 signoff`, 5 `repin`, 1 `wip`). AC-9 đo rằng job không bắt buộc
  (ruleset của `main` chỉ đòi `check`, `e2e`, `gate`), nên không chặn gộp, nhưng đỏ là đỏ thật, kể cả trên PR này nếu anh
  ký Cổng 2 bằng lệnh của kit. PR này không sửa điều đó (sửa là đổi `tools/**`, hạng T3, PR riêng). Máy khuyên **chấp
  nhận** cho PR này và mở việc riêng cho `tools/commit_msg.py` (hoặc cho cách kit đặt tiêu đề).

## Criteria

- AC-1: Given nhánh ở HEAD, When chạy `make check` (như `AGENTS.md` đòi; nó gồm `check-quick` CI chạy mỗi lần đẩy,
  `check-heavy` hôm nay rỗng, và `design-assembly`), Then lệnh thoát 0, đầu ra có dòng `Test Files  148 passed (148)`, dòng
  `Tests  2466 passed | 2 skipped (2468)`, dòng `design-assembly: 19 decisions held by 27 checks, each seen failing on a changed copy`, dòng `no heavy checks` và dòng
  `make check passed: upgrade lint typecheck test ontology boundaries coverage-matrix derived-untracked ledgers-check design-assembly design governance`; không thêm bài bỏ qua nào ngoài 2 bài.
- AC-2: Given HEAD và nền của PR (`git merge-base HEAD origin/main`, hôm nay `1ad8469f`), When chạy `apply.py --json` của
  tag `repo-setup-v0.10.1`, không tuỳ chọn khác, Then với `--dry-run` trên HEAD lệnh thoát 0 và các danh sách `created`,
  `updated`, `merged`, `edited`, `marked`, `base_unread`, `removed`, `dropped`, `conflict` đều rỗng, không tệp nào còn dấu
  (`tools/upgrade_markers.py` thoát 0); với `--dry-run` trên nền, `updated` đúng là `.github/workflows/pr-title.yml`,
  `merged` đúng là `AGENTS.md`, các danh sách còn lại rỗng; và chạy thật trên một bản sao tạm của nền, lệnh thoát 0 và ba
  tệp `pr-title.yml`, `AGENTS.md`, `.repo-setup.json` nó ghi giống từng byte ba tệp ở HEAD (Hỏi-1).
- AC-3: Given HEAD, When so `.github/workflows/pr-title.yml` với bản mẫu
  `plugins/repo-setup/presets/_core/team/dot.github/workflows/pr-title.yml` của tag, Then hai tệp giống từng byte, sha256
  của tệp bằng mã `.repo-setup.json` ghi cho nó; và so với nền của PR, `name`, `on`, `permissions`, danh sách job, job
  `conventional-title` và mọi phần của `conventional-commits` ngoài `run` của bước 2 đều giữ nguyên; `run` ấy đổi và
  không còn chữ `conventional-pre-commit`.
- AC-4: Given khối dò hook và chấm một commit của `run` bước 2 của `conventional-commits`, trích nguyên văn từ
  `pr-title.yml` ở HEAD (từ `own_error=` tới trước phần gọi GitHub; phép đo in sha256 của khối), chạy trong một bản
  checkout sạch của HEAD (worktree mới, không `node_modules`, không venv) với pre-commit qua `uvx` thay `pipx run`, When
  chấm với `.pre-commit-config.yaml` của kho, Then pre-commit chạy đúng tám hook ở stage commit-msg (`check-yaml`,
  `check-json`, `check-toml`, `check-merge-conflict`, `detect-private-key`, `gitleaks`, `lint`, `commit-message`) và với tin
  một dấu chấm chỉ `commit-message` (`tools/commit_msg.py`) trượt; phép dò tìm được hook từ chối; hai commit `238099bb` và
  `10f4e6fb` được nhận (0); tin `update stuff` bị từ chối (1), kể cả khi thân tin có dòng `An error has occurred: …` giống
  lỗi của pre-commit; hai tiêu đề kit tự viết, `Gate 2 signoff: x — [Tên]` và `repin(x): …`, bị từ chối (1); đếm bằng
  `tools/commit_msg.py` trên các commit không phải merge của nền từ 2026-11-01, đúng 7 `Gate 2 signoff`, 5 `repin`, 1 `wip`
  bị từ chối (Hỏi-2); lệnh cũ của nền (`pre-commit run conventional-pre-commit …`) trên commit `238099bb` thoát 1 với dòng
  ``No hook with id `conventional-pre-commit` in stage `commit-msg` ``; và (không được qua) một bản sao không có hook
  commit-msg nào thì phép dò thoát 1 với `No hook of this repository refuses a message at commit-msg`, một bản sao có
  cấu hình pre-commit không đọc được thì thoát 1 với `pre-commit could not run in this repository, so the commits were not
  judged`, không đổ lỗi cho commit.
- AC-5: Given HEAD và nền của PR, When so `AGENTS.md`, Then tệp bỏ đúng ba dòng của hai luật («Never commit secrets or
  `.env`…» và «Follow the page formats… Link to code paths,» cùng dòng tiếp) và thêm đúng các dòng ghi ở
  `rang/matrix.mjs`: hai luật ấy tách thành bốn dòng cùng chữ, và mục `## What holds these rules` ở cuối tệp với bốn gạch
  đầu dòng và câu kết; mọi dòng khác giữ nguyên; và mỗi phép kiểm mục ấy gọi tên có thật trong cây: job `secret-scan` của
  `security.yml`, job `conventional-title` và `conventional-commits` của `pr-title.yml`, `tools/wiki_lint.py` và
  `tools/boundaries.py` trong `make -n check`.
- AC-6: Given HEAD và nền của PR, When so `.repo-setup.json`, Then `version` đổi từ `0.9.0` sang `0.10.1` và không khoá
  đầu nào khác đổi; mọi tệp trong `file_versions` ghi `0.10.1`, trừ đúng 8 tệp mẫu đã xoá khỏi cây từ trước (`src/greet.ts`,
  `src/index.ts`, `src/modules/loyalty/index.ts`, `src/modules/sales/index.ts`, `src/modules/sales/pricing.ts`,
  `tests/greet.test.ts`, `tests/modules.test.ts`, `tsconfig.build.json`) vẫn ghi `0.4.0` như ở nền; mã của `files` chỉ đổi
  cho `pr-title.yml` và `AGENTS.md`; thêm đúng một mục, `wiki/log.head.md`, tệp có trong cây và có đúng mã được ghi; không
  mục nào bị bỏ.
- AC-7: Given HEAD, When kê tệp, Then commit `238099bb` đổi đúng `pr-title.yml`, `.repo-setup.json`, `AGENTS.md`; commit
  `10f4e6fb` đổi đúng `wiki/log/2026-11-20-01-n-ng-repo-setup-t-0-9-0-l-n-0-10-1-b-ng.md`; so với nền, PR không đổi tệp nào
  ngoài bốn tệp ấy, thư mục `_acceptance/upgrade-repo-setup-0-10-1/`, `_acceptance/config.yaml` (chỉ thêm lệnh
  `rs0101_*`), `PRODUCT-MAP.md` và `LO-TRINH.html`; và không tệp đổi nào khớp `risk_tiers.t3_paths`.
- AC-8: Given HEAD, When chạy `rang/two-way.mjs`, Then năm phép đo của AC-3 tới AC-7 xanh trên cây, và mỗi phép đo đỏ với
  lời của nó trên một bản sao hỏng đúng kiểu nó canh: `pr-title.yml` thêm một dòng, `pr-title.yml` của nền, `judge` luôn
  trả 0 (`return 0` thay `return "$code"`), phép dò không còn dừng khi không hook nào chấm, một dòng sau mục kết của
  `AGENTS.md`, `version` `0.10.0`, một commit thêm `src/modules/identity/extra.ts` (vừa ngoài PR vừa là đường T3).
- AC-9: Given kho trên GitHub, When đọc ruleset đang bật của `main`, bảo vệ nhánh kiểu cũ của `main` và cài đặt gộp, Then
  các check bắt buộc đúng là `check`, `e2e`, `gate` (không có `conventional-title` hay `conventional-commits`), bảo vệ nhánh
  kiểu cũ không thêm check nào, và gộp bằng merge commit hoặc rebase được bật, nên job `conventional-commits` đi nhánh chấm
  từng commit mà không chặn gộp.

## Coverage

Phủ theo bốn tệp của hai commit, nối vào nhóm theo cách công cụ báo (mô tả PR: `pr-title.yml` cập nhật, `AGENTS.md` gộp, `.repo-setup.json` bản ghi) cộng dòng sổ. Không quét không gian tiêu chí: lên đời là việc tất định, các nhóm dưới đây là toàn bộ không gian.

| Nhóm | Tệp | Tiêu chí |
| --- | --- | --- |
| `updated` của công cụ | `.github/workflows/pr-title.yml` | AC-2; AC-3 (đúng bản mẫu, chỉ bước 2 đổi); AC-4 (logic mới chạy được, lỗi cũ có thật) |
| `merged` của công cụ | `AGENTS.md` | AC-2; AC-5 |
| Bản ghi của lần lên đời | `.repo-setup.json` | AC-2; AC-6 |
| Dòng sổ | `wiki/log/2026-11-20-01-…md` | AC-7; AC-1 (`ledgers-check`, `wiki_lint` trong `make check`) |
| Cả cây | — | AC-1; AC-7 (không tệp ngoài, không T3); AC-8 (mỗi phép đo có ca đỏ) |
| Kho trên GitHub (ruleset, cài đặt gộp) | — | AC-9 |
| Job `conventional-commits` trên GitHub | — | Ngoài phép đo trên máy: job chạy từ nhánh chính (`pull_request_target`), chỉ có hiệu lực sau khi gộp; AC-4 đo khối chấm của nó trong bản checkout sạch, AC-9 đo nó đi nhánh nào. Lượt đầu trên runner chỉ quan sát được sau khi gộp (Notes) |
| `e2e`, `e2e-db` | — | Không đo ở đây: PR không đổi mã, giao diện hay CSDL; hai job chạy trên CI khi PR rời bản nháp |

## Out of scope

- Sửa `tools/commit_msg.py` (hay cách kit đặt tiêu đề commit) để nhận `Gate 2 signoff:` và `repin(…)`: Hỏi-2, PR riêng.
- Đổi `_acceptance/config.yaml` ngoài việc thêm lệnh `rs0101_*`: không đụng `risk_tiers`, `t1_skip_globs`, `signoff`.
- Đổi `governance/`, ruleset của `main` hay workflow nào khác ngoài thứ công cụ đã ghi.
- Rời bản nháp, gộp PR, hay chạy `e2e`/`e2e-db` trên máy: việc của chủ kho và của CI.
- Sửa tệp của lần lên đời: nếu phép đo thấy sai, hồ sơ báo, không sửa.
- Nhận các luật mới của repo-setup mà kho chưa nhận (các mục «Out of scope» của hồ sơ `upgrade-repo-setup-0-9-0`).

## Notes

- `tools/autonomy.py --base origin/main` xếp PR ở hạng `high` (`pr-title.yml` và `AGENTS.md` là đường được bảo vệ): người
  gộp là code owner. Hạng của kit (T2) và hạng của `governance/` là hai trục khác nhau.
- Mô tả PR nói «mọi tệp ghi 0.10.1»; thật ra 85 trên 93 tệp, 8 tệp mẫu đã xoá giữ `0.4.0` như trên `main` (công cụ giữ
  phiên bản cũ cho tệp không còn trong kế hoạch). AC-6 ghim đúng điều đó.
- Clone này không cài hook git (`.git/hooks` chỉ có mẫu); tiêu đề commit của hồ sơ được kiểm bằng `tools/commit_msg.py`
  trước khi commit.
- Rủi ro chưa đo được trên máy, chỉ thấy ở lượt đầu của job trên runner sau khi gộp (PR kế tiếp): pre-commit phải dựng
  môi trường cho tám hook (gồm `gitleaks`, ngôn ngữ Go) trong một checkout sạch của nhánh chính; dựng hỏng thì job báo
  «could not run» (đỏ, đúng lý do). Riêng `pipx` hỏng mà không in dòng `An error has occurred:` thì `judge` coi là «từ
  chối» và đổ lỗi cho commit: đó là thiết kế của repo-setup, hồ sơ này ghi lại, không sửa. Việc cần nhìn ở PR kế: log
  của job có lời của `judge`, không còn `conventional-pre-commit`.
- Gửi lại repo-setup (không sửa ở đây): job in nguyên đầu ra hook bằng `cat` trong một workflow `pull_request_target`;
  `tools/commit_msg.py` không in lại tin, nhưng một hook khác in lại tin commit thì dòng `::…::` trong tin đi vào luồng
  lệnh của runner. `AGENTS.md` nối mục «What holds these rules» sau khối `next dev` tự viết lại; mục ấy nói «không máy
  nào canh các luật khác», trong khi `make check` có canh nhãn hard-code.
- `wiki/log.head.md` nay có trong `files` của `.repo-setup.json`: tag có bản mẫu `presets/_core/starter/wiki/log.head.md.tmpl`;
  lần lên đời sau, một sửa tay vào tệp ấy sẽ đi đường gộp ba chiều như mọi tệp của công cụ.
- `make check` thay `make check-quick` cho AC-1 vì `AGENTS.md` đòi nó; con số 2466 đọc từ lượt chạy trên nhánh, không so
  với nền bằng một lượt riêng (PR không đổi mã hay bài kiểm nào, AC-7 đo điều đó).
