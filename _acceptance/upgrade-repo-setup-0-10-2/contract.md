---
schema_version: 1
feature: Lên đời bộ setup repo-setup từ 0.10.1 lên 0.10.2 — job conventional-commits rào đầu ra của hook để tin commit không thành lệnh của runner và không giữ token trong bản checkout; tools/autonomy.py cho phép chính sách gọi tên check gate khi kho không có pr-pipeline.yml
slug: upgrade-repo-setup-0-10-2
owner:
risk_tier: T3
surfaces: [config, ci]
status: verified
approved_by: Phan Le Manh
approved_at: 2026-11-20
---

# Acceptance Contract: upgrade-repo-setup-0-10-2

## Context

Thay đổi đã nằm sẵn trên nhánh `chore/upgrade-repo-setup-0.10.2` của PR #95 (bản nháp). Đó là một commit, `dbe08dca`, cắt
từ `main` ở `f2a49b49` (ngay sau PR 94). Commit là đầu ra nguyên vẹn của `apply.py --target .`, chạy từ tag
`repo-setup-v0.10.2` của phanlemanh/repo-standards (commit `2f8f1415`), không tuỳ chọn nào. Nó đổi bốn tệp:

- `.github/workflows/pr-title.yml`: đầu ra hook được rào bằng một mã ngẫu nhiên qua `::stop-commands::`. Không có mã thì
  job đỏ. `%` trong dòng lỗi được thoát. Bước checkout đặt `persist-credentials: false`.
- `tools/autonomy.py` và `tools/github_setup.py`: `gate` chỉ là check riêng của bộ setup khi kho có
  `.github/workflows/pr-pipeline.yml`. Kho này không có tệp ấy, nên tên `gate` (job của kit trong `ci.yml`) được phép
  đứng trong `required_checks` hay làm `proof.check`.
- `.repo-setup.json`.

`tools/**` thuộc `risk_tiers.t3_paths` nên hồ sơ là T3 (`pre-merge-check.sh --hang-pr`: `hang=T3`,
`ly_do=phan-loai`). Hồ sơ chấm sau khi làm, như các hồ sơ lên đời trước: lên đời là việc tất định, nên tiêu chí đọc từ tag,
từ mô tả PR và từ `main`, không từ chính cây. Kit không có luật đòi commit phải sau Cổng 1. Với T3, lưới trước khi gộp chỉ
đòi `approved_by`, nên lịch sử giữ nguyên, không force-push, không amend `dbe08dca`.

Brief của phiên repo-standards nói rằng job có rào chạy lần đầu trên PR 95. Phép đo AC-7 cho thấy điều đó không đúng. Job
chạy theo `pull_request_target`, tức chạy workflow của nhánh chính. Lượt chạy của PR 95 đã checkout `main`, giữ token và
chạy script cũ không rào. Job của 0.10.2 chỉ chạy trên runner từ sự kiện PR đầu tiên sau khi gộp.

Source input: brief của phiên repo-standards (2026-11-20, chủ kho duyệt cho chạy vòng). Mô tả PR #95. CHANGELOG và bản mẫu
của tag `repo-setup-v0.10.2`. Phản biện context sạch ở `gap-probe.md`.

## Hỏi (chỉ chủ kho trả lời, ở Gate 1)

- **Hỏi-1: đo job có rào trên runner thật sau khi gộp.** Trước khi gộp, runner không thể chạy job này (AC-7). AC-4 và
  AC-5 đo nó bằng thay thế: chạy nguyên văn bước chấm bằng bash như runner gọi, với `gh` giả và pre-commit qua `uvx`.
  Cách runner đọc `::stop-commands::` và bản GNU của `od` thì máy cục bộ không đo được. Rào chỉ hiện trong log khi có
  commit bị từ chối, nên một PR bình thường sẽ không bao giờ cho thấy nó.
  - Máy khuyên **PR thử sau khi gộp**: máy mở một PR từ nhánh tạm, có một commit `update stuff 100%`. Máy đọc job
    `conventional-commits`: log phải có `::stop-commands::` theo sau là 32 chữ số hex và dòng đóng cùng mã; trang PR
    phải có chú thích lỗi `Commit <sha> does not pass …` với `100%` hiện đúng, tức runner đã đọc lại lệnh sau rào. Rồi
    máy đóng PR không gộp và xoá nhánh. Việc này ghi thành một dòng sổ, không phải một tiêu chí, vì hồ sơ ký trước khi
    gộp. Phép thử này không cho thấy được rằng dòng cài trong tin không lọt ra: hook của kho hôm nay không in lại tin,
    nên điều ấy chỉ đo được bằng hook giả (AC-4).
  - Lối khác: không mở PR thử, chấp nhận bằng chứng thay thế, và ghi giới hạn này vào Known limits.

## Criteria

- AC-1: Given nhánh ở HEAD, When chạy `make check`, Then lệnh thoát 0 với các dòng sau, và không có bài bỏ qua nào ngoài
  2 bài:
  - `Test Files  148 passed (148)`;
  - `Tests  2476 passed | 2 skipped (2478)`, bằng số của `main` sau PR 94, vì PR không thêm hay bớt bài nào;
  - `make check passed: upgrade lint typecheck test ontology boundaries coverage-matrix derived-untracked ledgers-check design-assembly design governance`.
- AC-2: Given tag `repo-setup-v0.10.2` và nền của PR (`git merge-base HEAD origin/main`, hôm nay `f2a49b49`), When chạy
  `apply.py --json` của tag, không tuỳ chọn khác, Then:
  - `--dry-run` trên HEAD thoát 0, các danh sách hành động `created`, `updated`, `merged`, `marked`, `base_unread`,
    `dropped`, `conflict` đều rỗng, không tệp nào còn dấu, `edited` có 32 tệp và `removed` đúng là 8 tệp mẫu của AC-3;
  - `--dry-run` trên nền có `updated` đúng là `pr-title.yml`, `tools/autonomy.py`, `tools/github_setup.py` và không hành
    động nào khác; `edited` và `removed` giống HEAD;
  - chạy thật trên một bản sao tạm của nền thì thoát 0 và ghi bốn tệp giống từng byte bốn tệp ở HEAD; chạy thử lần nữa
    trên bản sao ấy thì không còn gì để làm.
- AC-3: Given HEAD, tag và nền, When so tệp, Then:
  - `pr-title.yml`, `tools/autonomy.py` và `tools/github_setup.py` giống từng byte bản mẫu dưới
    `plugins/repo-setup/presets/_core/team/` của tag, và sha256 của mỗi tệp bằng mã `.repo-setup.json` ghi;
  - `.repo-setup.json` đổi `version` từ `0.10.1` sang `0.10.2` và không khoá đầu nào khác đổi. Mọi tệp ghi `0.10.2`,
    trừ đúng 8 tệp mẫu đã xoá khỏi cây, vẫn ghi `0.4.0` như ở nền. Mã chỉ đổi cho ba tệp trên, không mục nào thêm hay bỏ;
  - so với nền, `pr-title.yml` giữ nguyên `name`, `on`, `permissions`, danh sách job và job `conventional-title`. Trong
    `conventional-commits`, chỉ bước checkout thêm `with: {persist-credentials: false}` và chỉ `run` của bước chấm đổi.
- AC-4: Given bước chấm của `conventional-commits`, trích nguyên văn từ `pr-title.yml` ở HEAD, chạy bằng
  `bash --noprofile --norc -eo pipefail` như runner gọi, với `gh` giả, pre-commit qua `uvx` thay `pipx run`, trong bản
  checkout sạch của HEAD mà cấu hình pre-commit thêm một hook giả in lại tin commit (đã `git add`), When chấm hai commit
  bị từ chối mà tin mang ba dòng cài sẵn (`::error::planted-subject` sau một dấu xuống dòng `\r` trong tiêu đề,
  `::warning::planted-body`, `::add-mask::planted-mask`), Then:
  - bước thoát 1 và mỗi commit có một rào riêng (`::stop-commands::<mã>` … `::<mã>::`), mỗi mã gồm 32 chữ số hex và
    không lặp lại;
  - ba dòng cài nằm trong rào, và không dòng nào ngoài rào bắt đầu bằng chúng, kể cả phần đứng sau `\r`;
  - ngoài rào, runner chỉ đọc đúng một dòng `::error::Commit <sha> …` cho mỗi commit. Tiêu đề trích trong dòng ấy không
    còn ký tự điều khiển, và `%` thành `%25`;
  - bước chỉ in nguyên đầu ra hook (`cat`) ở một chỗ, trong rào;
  - nhánh «could not run»: một commit bị từ chối mà thân tin có dòng
    `An error has occurred: FatalError: x\r::add-mask::planted-cr` (hook giả in lại nó) làm bước dừng với
    `pre-commit could not run …`. Đầu ra nằm trong đúng một rào đã đóng, và dòng `::error::` trích lời người viết mà
    không còn ký tự điều khiển, nên không đoạn nào sau `\r` bắt đầu bằng `::`;
  - (không được qua) với một `od` giả luôn hỏng, tức không có mã ngẫu nhiên, bước thoát 1, chỉ in dòng
    `What the commit-msg hooks printed could not be shown safely…` và không in gì của đầu ra hook;
  - (không được qua) bước của nền chạy trên cùng đầu vào thì để dòng cài lọt ra ngoài rào.
- AC-5: Given bước chấm của HEAD và bước chấm của nền, chạy như AC-4 nhưng với hook thật của kho, mỗi lượt một commit,
  When chấm sáu tin của `ANSWERS` trong `rang/matrix.mjs`, Then:
  - hai bước trả cùng một kết quả, đúng như ma trận ghi: commit `dbe08dca` và một tiêu đề `Gate 2 signoff:` được nhận
    (0); `update stuff`, `wip(dan-tu-excel): …` và một tin bị từ chối có thân giống lỗi của pre-commit bị từ chối (1); một
    tin đúng khuôn có thân cài `::warning::` được nhận. Hook thật không in lại tin, nên ca có thân giống lỗi không đi nhánh
    «could not run»: nhánh ấy đo ở AC-4;
  - khi kho chỉ squash, cả hai thoát 0 mà không chấm gì;
  - (không được qua) với bản sao không có hook commit-msg nào, cả hai dừng với
    `No hook of this repository refuses a message at commit-msg`;
  - (không được qua) với bản sao có cấu hình không đọc được, cả hai dừng với `pre-commit could not run …` mà không đổ
    lỗi cho commit nào, và ở HEAD đầu ra của pre-commit nằm trong một rào.
- AC-6: Given `pr-title.yml` ở HEAD và ở nền, When đọc job `conventional-commits`, Then:
  - job checkout đúng một lần, với `persist-credentials: false`, nên token không còn trong `.git/config` của bản
    checkout; ở nền bước ấy không có `with`, tức để mặc định giữ token;
  - script của bước chấm không viết lệnh `git` nào cần token đã lưu. Commit và cài đặt gộp đọc bằng `gh`, với
    `GH_TOKEN` từ `env` của bước. pre-commit chỉ chạy `git` cục bộ, và lấy repo hook qua URL công khai vào cache riêng;
  - không job nào khác của tệp checkout kho.
  Giới hạn đã biết, có từ nền và không đổi ở đây: `GH_TOKEN` nằm trong `env` của cả bước, nên pre-commit và mọi hook
  đều thừa hưởng nó (quyền `contents: read`, hook lấy từ nhánh nền). Hồ sơ ghi lại và gửi về repo-setup, không sửa.
- AC-7: Given lượt chạy `44709236514`, job `136196394717` trên GitHub, When đọc thông tin và log của lượt ấy, Then:
  - đó là lượt «PR title» sớm nhất của `dbe08dca`, lần thử 1;
  - sự kiện là `pull_request_target`, đầu là `dbe08dca` và tệp là `pr-title.yml`;
  - log có `persist-credentials: true` và `git checkout … -B main refs/remotes/origin/main`, có `own_error=` nhưng không có
    `show_hook_output` hay `stop-commands`. Nghĩa là runner đã chạy job của nền, và job của 0.10.2 chưa từng chạy trên
    runner (Hỏi-1).
- AC-8: Given một bản sao tạm của HEAD (không đụng `governance/autonomy.yaml` thật), When thêm vào chính sách của bản sao,
  Then:
  - với `required_checks: [gate]`: `tools/autonomy.py --check-codeowners` thoát 0, và ruleset mà `github_setup.py`
    sẽ ghi đòi `gate` đúng một lần. Ruleset đọc qua chính `main` của `github_setup.py`, với `gh` giả, nên cách `main`
    nối `own_checks` cũng được đo;
  - với `proof: {check: gate}`: `--check-codeowners` thoát 0, `--files` báo `proof` là `gate`, và ruleset đòi `gate`
    đúng một lần. Gọi tên ở cả hai chỗ thì vẫn đúng một lần;
  - (không được qua) khi bản sao có `.github/workflows/pr-pipeline.yml`, cả hai cách gọi tên trên bị từ chối, và lời từ
    chối gọi tên `gate`;
  - (không được qua) `check` và `secret-scan` vẫn bị từ chối, và công cụ của nền từ chối `gate`;
  - chính sách thật không có tên `gate`, và kho không có `pr-pipeline.yml`.
- AC-9: Given diff của PR so với nền, When đo `change-set`, Then:
  - `dbe08dca` giữ nguyên: cha của nó là nền, nó đổi đúng bốn tệp, và nó nằm trong HEAD;
  - ngoài bốn tệp ấy, PR chỉ đổi thư mục hồ sơ này, `_acceptance/config.yaml`, `PRODUCT-MAP.md` và `LO-TRINH.html`.
    Với `_acceptance/config.yaml`, PR chỉ thêm dòng `    rs0102_<tên>: …` và không bỏ dòng nào;
  - PR không chạm `governance/`, `.pre-commit-config.yaml` hay `tools/commit_msg.py`;
  - `tools/autonomy.py` và `tools/github_setup.py` khớp `t3_paths` của config ở nền (không phải của PR);
  - mọi commit không phải merge của PR qua `tools/commit_msg.py` của nền.
- AC-10: Given `rang/two-way.mjs`, When chạy `node --test`, Then 24 bài đạt:
  - bảy phép đo xanh trên cây: `template-same`, `fence`, `judged`, `credentials`, `runner`, `policy`, `change-set`;
  - mười bảy bài phá (mười chín bản phá), mỗi bản đỏ đúng lời của điều nó canh:
    - `template-same`: `autonomy.py` lệch bản mẫu;
    - `apply-again`: `.repo-setup.json` ghi `0.10.1`;
    - `fence`: workflow của nền; rào không mở; mã cố định cho mọi lần gọi; dòng đóng không mang mã; tiêu đề trích không
      qua `quoted`; dòng «could not run» trích không qua `quoted`; in đầu ra khi không có mã;
    - `judged`: bước chấm luôn trả 0; bước cho commit bị từ chối đi qua (`exit 0` thay `exit "$failed"`);
    - `credentials`: checkout giữ token; bước chạy `git fetch`;
    - `runner`: một lượt chạy không phải `pull_request_target`;
    - `policy`: `gate` vẫn là check riêng khi không có pipeline; `main` của `github_setup.py` bỏ `own`;
    - `change-set`: config thêm một dòng không phải lệnh `rs0102_*`; một tệp `governance/`; một commit không qua luật
      của nền.

## Coverage

Phủ theo bốn tệp của commit lên đời, mỗi tệp nối vào nhóm mà công cụ báo. Không quét không gian tiêu chí: lên đời là việc tất
định, và các nhóm dưới đây là toàn bộ không gian.

| Nhóm | Tệp hay nơi | Tiêu chí |
| --- | --- | --- |
| `updated` của công cụ | `.github/workflows/pr-title.yml` | AC-2; AC-3 (đúng bản mẫu, chỉ checkout và bước chấm đổi); AC-4 (rào); AC-5 (chấm không đổi); AC-6 (token) |
| `updated` của công cụ | `tools/autonomy.py`, `tools/github_setup.py` | AC-2; AC-3; AC-8 (chính sách gọi tên `gate`) |
| Bản ghi của lần lên đời | `.repo-setup.json` | AC-2; AC-3 |
| Cả cây | — | AC-1; AC-9 (không tệp ngoài, lịch sử giữ, hạng T3); AC-10 (mỗi phép đo có ca đỏ) |
| Job trên GitHub trước khi gộp | lượt chạy của PR 95 | AC-7 (job của nền chạy, không phải job mới) |
| Job trên GitHub sau khi gộp | — | Không đo được trong hồ sơ: Hỏi-1 |
| `e2e`, `e2e-db` | — | Không đo ở đây: PR không đổi mã, giao diện hay CSDL; CI chạy khi PR rời bản nháp |

## Out of scope

- Gọi tên `gate` (hay `e2e`) trong `governance/autonomy.yaml`: quyết định của chủ kho, việc riêng. AC-8 chỉ đo trên bản
  sao rằng chính sách nay nhận tên ấy.
- Thêm bài kiểm vào `tests/` cho `own_checks`: hai tệp là của repo-setup và bài kiểm của chúng nằm ở repo-standards
  (`tests/seams.sh` 51a, `tests/run.sh` 44d). Một bài kiểm riêng ở đây sẽ thành tệp mà lần lên đời sau phải gộp. Hồ sơ đo
  hành vi bằng `policy.mjs` và `fence.mjs`.
- Hai khoảng hở đã biết của 0.10.2, giữ nguyên ở đây: job đọc tối đa 250 commit của một PR, và các công cụ nó cài
  (`pipx run pre-commit`) không ghim phiên bản.
- Sửa tệp của lần lên đời, viết lại lịch sử, force-push hay amend `dbe08dca`. Nếu phép đo thấy sai, hồ sơ báo chứ không
  sửa.
- Đổi `_acceptance/config.yaml` ngoài việc thêm lệnh `rs0102_*`, hay đổi `.github/workflows/` và `governance/`.
- Rời bản nháp, gộp PR, hay chạy `e2e`/`e2e-db` trên máy: đó là việc của chủ kho và của CI.

## Notes

- `tools/autonomy.py --base origin/main` xếp PR ở hạng `high`, vì `tools/**` và `.github/**` là đường được bảo vệ, nên người
  gộp là code owner. Hạng của kit (T3) và hạng của `governance/` là hai trục khác nhau. Nguồn: lệnh ấy, chạy khi viết hồ
  sơ; không phép đo nào ghim nó.
- Ruleset của `main` hôm nay đòi `check`, `e2e`, `gate` (nguồn: `gh api repos/…/rules/branches/main`, đọc khi viết hồ
  sơ), trong khi chính sách không gọi tên `e2e` hay `gate`. Theo docstring của `github_setup.py`, lệnh ấy dừng chứ không bỏ
  một check bắt buộc mà chính sách không gọi tên. Từ 0.10.2, chính sách gọi tên `gate` được (AC-8). Điều này có từ trước
  PR này, và PR không đổi nó.
- Cây mẫu của repo-setup tải theo sha `2f8f1415`, sau khi bóc tag `repo-setup-v0.10.2` và đòi tag vẫn trỏ về đúng sha
  ấy. Cache chỉ được dùng khi mang dấu của sha ấy.
- AC-4 và AC-5 chạy trên macOS, với `od` và `head` của BSD. Runner dùng bản của GNU. Theo phản biện, với 16 byte cả hai
  bản đều cho 32 chữ số hex; hồ sơ chưa đo điều đó trên Ubuntu (Hỏi-1).
- Hook giả của AC-4 thay cho một hook thật in lại tin commit. `tools/commit_msg.py` không in lại tin, nên với cấu hình
  của kho hôm nay, đầu ra hook không chứa dòng nào của người viết PR. Rào canh cho ngày có một hook như thế. pre-commit
  luôn in thêm dấu xuống dòng ở cuối, nên ca đầu ra không có dấu xuống dòng ở cuối không được đo.
- Gửi lại repo-setup, không sửa ở đây: `GH_TOKEN` đặt ở `env` của cả bước chấm, nên mọi hook thừa hưởng token (AC-6).
- E9 (`change-set`) đọc các commit đã có. Lượt chấm chạy nó trên đầu cuối của PR. Các commit sau lượt chấm (thẻ Cổng 2,
  chữ ký) do lưới trước-gộp và job `conventional-commits` canh.
- Clone này không cài hook git (`.git/hooks` chỉ có mẫu), nên tiêu đề commit của hồ sơ được kiểm bằng
  `tools/commit_msg.py` của nền (AC-9).
