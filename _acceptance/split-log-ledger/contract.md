---
schema_version: 1
feature: Tách sổ log của wiki ra khỏi git (mỗi mục một tệp ở wiki/log/, wiki/log.md vẽ ra); PR 1 trên 2 của bước tách sổ trong nâng cấp repo-setup 0.9.0
slug: split-log-ledger
owner:
risk_tier: T2
surfaces: [wiki, docs, config]
status: draft
design_doc: docs/superpowers/specs/2026-11-19-split-log-ledger-design.md
---

# Acceptance Contract: split-log-ledger

## Context

PR 88 (`3e4f4fbd`) đưa kho lên repo-setup 0.9.0 phần máy chạy: công cụ sổ `tools/ledgers*.py`, `make derived`,
`make split`. Bốn sổ (`log`, `index`, `glossary`, `gen`) vẫn nằm trong git, mỗi sổ một tệp. Chủ kho quyết ngày 19/11:
tách bằng hai PR, sổ `log` trước; `index`, `glossary` và `gen` ở PR sau, mỗi sổ một commit (Out of scope). Quyết định này thay mục «mỗi sổ một PR, PR 2 đến 5» của kế hoạch và của hồ sơ `upgrade-repo-setup-0-9-0` (Hỏi-4). Kế hoạch:
`docs/superpowers/plans/2026-11-18-onehub-upgrade-0.9.0.md` của kho phanlemanh/repo-standards, mục 5 và 6.

Nhánh `chore/split-log-ledger` cắt từ `c79189dd` (main sau PR 90) và đã làm sẵn, như hồ sơ PR 88:
`2e47d841` chạy `make split L=log` (110 dòng mục của `wiki/log.md` thành 110 tệp ở `wiki/log/`, khớp từng chữ; `wiki/log.md`
ra khỏi git, vốn đã có trong `.gitignore`; repo-setup thôi theo dõi `wiki/log.head.md` trong `.repo-setup.json`);
`05acd321` sửa hai chỗ còn dặn ghi tay vào `wiki/log.md` và thêm mục log của việc này bằng `make log`; `c1272ef7` gỡ
hai mục trùng (Hỏi-3); commit sau đó sửa ba phép đo của hồ sơ đã ký mà việc tách làm gãy (Hỏi-2) và thêm hồ sơ này.

Hạng: `_acceptance/config.yaml` suy ra T2 — nhánh không chạm `tools/**`, `ontology/**`, `mk/**`, `Makefile` hay tệp
T3 nào; `.repo-setup.json` và `_acceptance/**` là hạng mặc định. Phiên điều phối giao việc này như T3 vì cả kế hoạch
chạm `tools/**` và `ontology/**` ở PR 2; theo lời chủ kho, cả Cổng Phạm vi và Cổng Bằng chứng vẫn chờ chủ kho ký.

Từ PR 88, `wiki/log.md merge=union` đã cho git tự gộp sổ log. Lợi ích thêm của việc tách: thứ tự mục đúng (bốn mục về
đúng chỗ theo ngày), không có dòng trùng hay lẫn (hai mục trùng do các lần gộp, xem Hỏi-3), và GitHub không còn báo
xung đột ở sổ log (ô báo xung đột của GitHub không dùng `merge=union`).

Source input: lời giao của phiên điều phối ngày 19/11 (theo quyết định của chủ kho); `make split L=log DRY=1` và bản
thật; phép đo «trước» ở `rang/measure.sh` và `rang/measure-before.txt`; phản biện context sạch ở `gap-probe.md`.

## Hỏi (chỉ chủ kho trả lời, ở Gate 1)

Nhánh đã làm theo ngả máy khuyên. Mỗi điểm trả lời khác thì nhánh đổi, và các tiêu chí ghi bên dưới đổi theo, trước
lượt chấm.

- **Hỏi-1 — dòng `wiki/log.md merge=union` trong `.gitattributes`.** Sau khi tách, dòng ấy không còn áp vào tệp nào git
  giữ: không cần nữa. Nhưng dòng ấy đến từ khuôn của repo-setup 0.9.0 (`presets/_core/starter/dot.gitattributes`), và
  `make split` cố ý không đụng `.gitattributes`. Máy khuyên **giữ** (nhánh không đổi `.gitattributes`): bỏ thì kho lệch
  khuôn vì một dòng vô hại, lần nâng repo-setup sau phải gộp ba chiều tệp này; việc đúng là repo-setup bỏ dòng ấy khi
  tách, ghi thành việc của kho repo-standards. Nếu **bỏ**: nhánh xoá dòng ấy và lời chú thích của nó, không tiêu chí nào đổi.
- **Hỏi-2 — sửa sau chữ ký ba hồ sơ mà việc tách làm gãy phép đo.** Đo trước và sau khi tách (cây đã commit), ba hồ sơ
  đã ký đỏ vì `wiki/log.md` ra khỏi git: `don-no-bo-kiem` E6 (bản sao phá chèn vào `wiki/log.md`, nay không ai quét),
  `tat-plugin-cho-cu` E7 (`tpc_two_way`, ca «E4 red (a)», cùng lý do), `upgrade-repo-setup-0-9-0` E10 (AC-9 nói sổ
  log là `one-file`) và ca «ledgers» của E12 của hồ sơ ấy (bản lành dựng ở HEAD). Máy khuyên **sửa trong PR này**, mỗi
  hồ sơ một mục `sua-sau-ky.md` theo nếp của kho: hai phép đo đầu nhắm vào mục mới nhất của `wiki/log/`; E10 khai
  `status: not-run` + `superseded_by: split-log-ledger#AC-3` (lối của kit cho eval mất vật đo vì một việc đã ký) và AC-3
  dưới đây đo lại những gì còn đúng; ca «ledgers» dựng ở `702e71dd`, commit đã chấm của hồ sơ ấy. Nếu **không**: bỏ
  commit sửa, ba hồ sơ đỏ ở lượt ghim lại kế tiếp của chúng, AC-3 và AC-5 rời hợp đồng, ghi vào Known limits.
- **Hỏi-3 — hai mục trùng của sổ log.** `wiki/log.md` ở `c79189dd` có 110 dòng mục nhưng chỉ 108 mục khác nhau: mục
  2026-11-11 «Recorded the reuse ladder…» và mục 2026-11-13 «Hỏi đầu chủ và Báo sai thông tin căn…» mỗi mục có hai bản
  y hệt, di chứng của các lần gộp. `make split` giữ cả hai bản. Máy khuyên **gỡ bản thừa** (commit `c1272ef7`, hai tệp,
  đảo được bằng `git revert`). Nếu **giữ**: bỏ commit ấy, AC-1 đổi thành «110 dòng, mỗi dòng đúng số lần như trước».

- **Hỏi-4 — xác nhận: hai PR thay cho bốn.** Phiên điều phối chuyển lời chủ kho ngày 19/11: tách bằng hai PR, sổ `log`
  trước, `index`, `glossary` và `gen` ở PR 2, mỗi sổ một commit. Kế hoạch và Out of scope của `upgrade-repo-setup-0-9-0`
  còn ghi «mỗi sổ một PR, PR 2 đến 5». Máy khuyên **xác nhận** để sổ quyết định có lời của chủ kho; AC-3 viết để bền qua
  PR 2 dù PR ấy tách một hay ba sổ. Nếu **không** (quay về bốn PR): hồ sơ này không đổi, chỉ Out of scope đổi chữ.

## Criteria

- AC-1: Given HEAD, When hỏi hình sổ log, vẽ `wiki/log.md` bằng `make wiki-derived` và so với `wiki/log.md` của `c79189dd`,
  Then sổ log là `fragments`; `wiki/log.md` không nằm trong git và bị `.gitignore` bỏ qua; `make ledgers-check` và
  `make derived-untracked` thoát 0; mỗi mục trong 108 mục khác nhau của `c79189dd` (110 dòng) có mặt đúng một lần, khớp
  từng chữ; mọi mục khác đều mang ngày 2026-11-19 trở về sau; các mục xếp mới trước cũ theo ngày; phần đầu sổ (front
  matter, tiêu đề, lời dặn) vẽ ra giống từng chữ bản ở `c79189dd`, `wiki/log.head.md` nằm trong git và `.repo-setup.json`
  thôi giữ nó; và trên bản sao thiếu một mục, có một mục hai lần, có `wiki/log.md` trong git, có một mục mới mang ngày
  trước khi tách, vẽ cũ trước mới, đầu sổ lệch một chữ, hay `.repo-setup.json` còn giữ `wiki/log.head.md`, phép đo đỏ
  gọi đúng lỗi ấy.
- AC-2: Given một bản checkout mới của HEAD, When đọc kế hoạch của `make check-quick` (tầng nhẹ CI chạy ở mọi lần đẩy),
  Then bản checkout chưa có `wiki/log.md`; `make check-quick` vẽ sổ log trước khi chạy bài kiểm; và sau `make derived`,
  `tests/khong-o-tim.test.ts` (bài đọc `wiki/log.md`) đạt; trên bản sao mà các bước của `check` thôi chờ `derived`,
  phép đo đỏ `make check-quick does not draw the wiki log`.
- AC-3: Given HEAD, When hỏi hình bốn sổ và chạy `make split L=<sổ> DRY=1` cho từng sổ, Then sổ log là `fragments`, ba sổ
  còn lại mỗi sổ một hình (`one-file` hay `fragments`), cả bốn lệnh thoát 0 mà không ghi tệp nào (so `git status` và
  nội dung bốn tệp sổ, kể cả tệp `.gitignore` che; bản sao mà `make split` ghi vào `wiki/log.md` thì đỏ);
  `mk/design-role-table.mk` giống từng byte `mk/derived.mk` của `bd32d73e`; `make -n test` vẫn chạy
  `tools/coverage_matrix/buttons.py`. AC này đứng thay `upgrade-repo-setup-0-9-0/E10` (AC-9 của hồ sơ ấy), trừ câu
  «index, glossary, gen là one-file» mà PR 2 sẽ đổi.
- AC-4: Given HEAD, When đọc `docs/van-hanh/xoay-khoa.md`, `docs/plan/dot-nen/LUAT-rieng.md` và mọi tệp `.md` git giữ
  ngoài `wiki/log/`, `_acceptance/`, `docs/superpowers/` và `docs/plan/do-he-design/` (bản ghi của việc đã qua), Then hai
  tệp đầu không còn lời dặn cũ và có `make log m=`; không tệp nào có câu dặn ghi hay thêm một dòng vào `wiki/log.md`
  bằng tay, tiếng Việt hay tiếng Anh (lời dặn cho AI như `.claude/skills/*` viết bằng tiếng Anh); trên `c79189dd` phép đo
  đỏ ở `docs/van-hanh/xoay-khoa.md`, và một câu «Append a line to `wiki/log.md`» trong một skill làm nó đỏ.
- AC-5: Given HEAD và câu trả lời «đồng ý» cho Hỏi-2, When chạy `so_quyet_dinh` của `don-no-bo-kiem`, ca «E4 red» của
  `tat-plugin-cho-cu/rang/two-way.mjs` và ca «ledgers» của `upgrade-repo-setup-0-9-0/rang/two-way.mjs`, Then cả ba đạt; E10
  của `upgrade-repo-setup-0-9-0` khai `status: not-run` và `superseded_by: split-log-ledger#AC-3`; mỗi hồ sơ trong ba hồ sơ có
  một mục `sua-sau-ky.md` cho việc này; trên bản sao mà `so-quyet-dinh.mjs` lại nhắm vào `wiki/log.md`, hay E10 mất lời khai,
  phép đo đỏ.
- AC-6: Given lượt CI mới nhất trên đầu nhánh của PR, When đọc các job, Then `quick`, `e2e` và `check` kết thúc `success`;
  phép đo in kết luận của `e2e-db` và `gate` (`gate` chờ chữ ký của hồ sơ này, `e2e-db` không chặn gộp).
- AC-7: Given HEAD, When tìm mọi tệp git giữ không phải `.md` có nhắc `wiki/log.md` (trừ `wiki/log/`, hồ sơ này, và tệp
  dữ liệu của các lượt cũ: `s4-args*.json`, `run-log.jsonl`, `decisions.jsonl`, `card.html`, `evidence-page.html`), Then
  mỗi tệp có trong bảng `READERS` của `rang/matrix.mjs` kèm lý do nó vẫn đúng sau khi tách (24 tệp hôm nay: công cụ sổ,
  tệp bỏ qua, bài kiểm chờ `derived`, eval phán đoán đọc tệp vẽ, ba phép đo đã sửa ở AC-5, danh sách tệp đổi của commit
  cũ); một tệp mới đọc `wiki/log.md` mà chưa cân thì phép đo đỏ gọi tên tệp ấy.

## Coverage

Phủ theo tệp đổi so với `c79189dd`, nhóm theo việc. Không quét không gian tiêu chí: tách sổ là việc tất định của
`make split`, các nhóm dưới đây là toàn bộ thay đổi.

| Nhóm | Tệp | Tiêu chí |
| --- | --- | --- |
| Sổ log: `wiki/log.md` ra khỏi git, mục thành tệp ở `wiki/log/` (110 do `make split`, trừ 2 bản trùng, cộng 1 mục mới) | 1 xoá, 109 thêm | AC-1; AC-2; AC-3 |
| `.repo-setup.json`: bỏ `wiki/log.head.md` khỏi danh sách repo-setup theo dõi (do `make split`) | 1 | AC-1 |
| Hai lời dặn ghi tay (`docs/van-hanh/xoay-khoa.md`, `docs/plan/dot-nen/LUAT-rieng.md`) | 2 | AC-4 |
| Ba phép đo của hồ sơ đã ký, E10 của `upgrade-repo-setup-0-9-0`, ba `sua-sau-ky.md` (Hỏi-2) | 7 | AC-5; AC-3 |
| Hồ sơ này, các lệnh `sll_*` trong `_acceptance/config.yaml`, design doc | — | AC-1 đến AC-7 qua E7 |
| CI trên PR | — | AC-6 |
| Bên đọc `wiki/log.md` không đổi (công cụ, tệp bỏ qua, bài kiểm, eval của hồ sơ cũ) | 0 đổi, 24 cân | AC-7; AC-2; AC-5 |
| `.gitattributes` (Hỏi-1: giữ) | 0 | Không đổi; diff |

## Out of scope

- Tách `index`, `glossary` và `gen`: PR 2 của kế hoạch, mỗi sổ một commit.
- Sửa `tools/ledgers*.py` hay khuôn của repo-setup (bỏ dòng `merge=union` khi tách, xem Hỏi-1): việc của kho phanlemanh/repo-standards.
- Gộp ngược `main` vào PR 83 và các PR khác đang sửa `wiki/log.md`: mỗi PR tự làm theo đoạn chỉ dẫn ở mô tả PR này.
- Ba ca đã đỏ trên `main` trước khi tách: «E1 red» của `tpc_two_way`, «rules-kept» của `rs090_two_way`, và «change-set»
  của `rs090_two_way` (đỏ ở mọi nhánh chưa vào `origin/main`). Ghi ở `sua-sau-ky.md` của hai hồ sơ, không sửa ở đây.
- Sửa các kế hoạch và đặc tả cũ ở `docs/superpowers/` và `docs/plan/do-he-design/` còn nhắc `wiki/log.md`: bản ghi lịch sử.
- Chép luật 10 mới vào `LUAT.md` của đợt `nen` nếu đợt ấy còn chạy (tệp ấy nằm ngoài kho).
- Mọi thay đổi giao diện, mã sản phẩm, mô hình dữ liệu hay luật sản phẩm.

## Notes

- Các con số (110 dòng, 108 mục, bốn mục đổi chỗ) đọc từ kết quả `make split` thật; tách sổ là việc tất định, hồ sơ chấm
  sau khi làm như hồ sơ `upgrade-repo-setup-0-9-0`.
- Các phép đo nằm ở `rang/`, chạy ở lượt chấm và lượt ghim lại, không chạy trong `make check`; mặt đỏ của từng phép đo ở
  `rang/two-way.mjs`. AC-6 đọc GitHub bằng `gh`; máy không đăng nhập thì phép đo đỏ với lời «cannot read».
- Phép đo «trước» của mục 6 kế hoạch: `rang/measure.sh` (đường dẫn kho viết cứng, chạy ở bản checkout chính) và kết quả
  `rang/measure-before.txt`, chép từ phiên điều phối. Trong 30 PR gộp gần nhất (PR 55 đến PR 91): 78 lần gộp ngược main
  vào nhánh PR, 70 lần xung đột, 51 lần xung đột ở một tệp sổ, trên 23 trong 30 PR; `wiki/index.md` xung đột 5 lần. Đo
  bằng `git merge-tree --write-tree` với `GIT_ATTR_SOURCE` đặt về nhánh lúc đó, vì `merge=union` chỉ có từ PR 88.
- Phép đo «sau» đếm lại cùng cách khi đủ PR gộp sau PR 2.
- Đo các phép đo của hồ sơ đã ký trước và sau khi tách (`rang/do-cu-truoc-sau.md`).
