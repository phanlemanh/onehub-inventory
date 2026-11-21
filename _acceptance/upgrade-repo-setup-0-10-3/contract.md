---
schema_version: 1
feature: Lên đời bộ setup repo-setup từ 0.10.2 lên 0.10.3 — chính sách gộp lưu cách gộp PR (merge_method, kho này chọn merge), thước đo luồng in ngưỡng mà không đổi mã thoát, AGENTS.md bỏ câu nói về gate; tệp chính sách gộp tay
slug: upgrade-repo-setup-0-10-3
owner:
risk_tier: T3
surfaces: [config, ci]
status: signed-off
approved_by: Phan Le Manh
approved_at: 2026-11-21
---

# Acceptance Contract: upgrade-repo-setup-0-10-3

## Context

Thay đổi đã nằm sẵn trên nhánh `chore/upgrade-repo-setup-0.10.3` của PR #98 (bản nháp). Đó là một commit, `871afebb`, cắt
từ `main` ở `8e0a91c9` (ngay sau PR 97). Commit là đầu ra của `apply.py --target .`, chạy từ tag `repo-setup-v0.10.3` của
phanlemanh/repo-standards (commit `c5581ff1`), cộng một tệp gộp tay. Lần lên đời làm những việc sau:

- **Tạo năm tệp:** `tools/sdlc_gh.py`, `sdlc_jobs.py`, `sdlc_limits.py`, `sdlc_pulls.py`, `sdlc_report.py`.
- **Cập nhật ba tệp:** `tools/sdlc_metrics.py`, `tools/autonomy.py`, `tools/github_setup.py`.
- **Gộp `AGENTS.md`:** bỏ câu «The gate sees both and raises the tier». Câu ấy nói về đường ống tác tử, mà kho này
  không có.
- **Đánh dấu `governance/autonomy.yaml`:** đây là chỗ bản sao của kho chưa bao giờ có hai khối `proof` và
  `required_checks` của bản mẫu, và 0.10.3 thêm khoá `merge_method` ngay sau chúng. Phiên repo-standards gộp tay bằng
  phía 0.10.3 của khối ấy, đổi `merge_method: squash` thành `merge`, vì kho này gộp bằng merge commit và kit cần thế.
- **`.repo-setup.json`:** ghi 0.10.3 cho 90 tệp; 8 tệp mẫu đã xoá vẫn ghi 0.4.0.

`tools/**` và `governance/**` thuộc `risk_tiers.t3_paths`, nên hồ sơ là T3 (`pre-merge-check.sh --hang-pr`: `hang=T3`,
`ly_do=phan-loai`). Hồ sơ chấm sau khi làm, như các hồ sơ lên đời trước. Kit không có luật đòi commit phải sau Cổng 1, và với
T3 lưới trước-gộp chỉ đòi `approved_by`. Vì thế lịch sử giữ nguyên: không force-push, không amend `871afebb`.

Vì sao `merge` mà không `squash`: trước 0.10.3, `github_setup.py` chạy không có tuỳ chọn thì đặt squash. Một lần chạy quên
`--merge-method merge` là đủ đưa kho về squash, mà kit nghiệm thu cần merge commit (AC-5 đo điều này trên nền). Từ 0.10.3,
cách gộp lưu trong chính sách. Lần lên đời tự ghi `squash`, nên kho này phải ghi `merge` ngay trong PR lên đời, như ghi chú
phát hành nói.

Source input: brief của phiên repo-standards (2026-11-21, chủ kho duyệt cho chạy vòng). Mô tả PR #98. CHANGELOG và bản mẫu
của tag `repo-setup-v0.10.3`. Phản biện context sạch ở `gap-probe.md`.

## Hỏi (chỉ chủ kho trả lời, ở Gate 1)

- **Hỏi-1: giữ cách gộp tay tệp chính sách của PR, hay đổi sang cách tối thiểu?** PR thay khối bị đánh dấu bằng phía
  0.10.3 của nó. Kết quả là `governance/autonomy.yaml` có thêm đúng ba khoá:
  - `proof:` với `check: ""`, không gọi tên check nào;
  - `required_checks: []`, rỗng;
  - `merge_method: merge`.

  PR cũng thay hai dòng chú thích phía trên `owners` («Reviewers requested by tier…» thành «Deciders by tier…») bằng chữ
  của bản mẫu. Cách tối thiểu chỉ thêm khối `merge_method` và giữ phần còn lại như cũ. AC-5 đo cả hai cách, và chúng cho
  cùng kết quả: cùng hạng cho mọi tệp, cùng CODEOWNERS, cùng mọi bước `github_setup.py` sẽ làm, cùng merge commits.

  Cân hai cách:
  - **Giữ như PR:** vùng ấy khớp bản mẫu, chỉ lệch đúng một dòng (`merge`, bản mẫu ghi `squash`). Đổi lại, tệp luật có
    thêm chú thích nói về đường ống tác tử mà kho không có («the PR pipeline stops running its own reviewer agent»). Đây
    đúng là lý do 0.10.3 bỏ một câu khỏi `AGENTS.md`. Tệp cũng ghi tường minh `required_checks: []`, trong khi ruleset của
    `main` đang đòi `e2e` và `gate`.
  - **Cách tối thiểu:** tệp luật ít dòng hơn và không có chữ nói về đường ống. Nhưng vùng ấy vẫn lệch bản mẫu như từ trước.
  - Hồ sơ không đo được cách nào ít bị đánh dấu hơn ở lần lên đời sau. Vùng lệch của cách tối thiểu đã đi qua lần lên
    đời 0.10.2 mà không bị đánh dấu. Lần này nó bị đánh dấu chỉ vì 0.10.3 thêm khoá ngay cạnh nó.
  - Máy khuyên **giữ như PR**, với lý do yếu: vùng ấy khớp bản mẫu nên dễ đọc khi so với các kho khác. Nếu anh không muốn
    chữ về đường ống hay khoá rỗng trong tệp luật, chọn cách tối thiểu; khi đó phiên repo-standards làm lại commit, hồ sơ
    không tự sửa.

## Criteria

- AC-1: Given nhánh ở HEAD, When chạy `make check`, Then lệnh thoát 0 với các dòng sau, và không có bài bỏ qua nào ngoài
  2 bài:
  - `Test Files  148 passed (148)`;
  - `Tests  2476 passed | 2 skipped (2478)`;
  - `make check passed: upgrade lint typecheck test ontology boundaries coverage-matrix derived-untracked ledgers-check design-assembly design governance`.
- AC-2: Given cây mẫu của repo-setup ở commit `c5581ff1` (bóc từ tag `repo-setup-v0.10.3`, tải theo sha) và nền của PR
  (`git merge-base HEAD origin/main`, hôm nay `8e0a91c9`), When chạy `apply.py --json`, không tuỳ chọn khác, Then:
  - `--dry-run` trên HEAD thoát 0, mọi danh sách hành động rỗng, không tệp nào còn dấu, `removed` đúng là 8 tệp mẫu,
    và `edited` bằng `edited` của nền cộng `AGENTS.md` và tệp chính sách;
  - `--dry-run` trên nền có `created` là năm tệp `sdlc_*` mới, `updated` là ba tệp công cụ, `merged` là `AGENTS.md`,
    `marked` là `governance/autonomy.yaml`, và không gì bị bỏ hay xung đột;
  - chạy thật trên một bản sao tạm của nền thì chỉ đánh dấu tệp chính sách. Mười tệp còn lại nó ghi giống từng byte các
    tệp ở HEAD, kể cả manifest với mọi mã băm. `git status` của bản sao chỉ nêu đúng mười một tệp của lần lên đời.
- AC-3: Given HEAD, cây mẫu và nền, When so tệp, Then:
  - tám tệp công cụ giống từng byte bản mẫu dưới `plugins/repo-setup/presets/_core/team/`, và mã của mỗi tệp bằng mã
    `.repo-setup.json` ghi;
  - `.repo-setup.json` đổi `version` từ `0.10.2` sang `0.10.3` và không khoá đầu nào khác đổi. 90 tệp ghi `0.10.3`; 8
    tệp mẫu đã xoá vẫn ghi `0.4.0`. Mục thêm vào đúng là năm tệp mới, không mục nào bị bỏ. Mã chỉ đổi cho ba tệp cập nhật,
    `AGENTS.md` và tệp chính sách;
  - `AGENTS.md` chỉ đổi đúng một dòng: `  on your own. The gate sees both and raises the tier.` thành `  on your own.`
- AC-4: Given tệp mà `apply.py` của tag để lại khi đánh dấu, trên một bản sao tạm của nền, When so với
  `governance/autonomy.yaml` ở HEAD, Then:
  - tệp ở HEAD bằng đúng tệp bị đánh dấu, với khối bị đánh dấu thay bằng phía 0.10.3 của nó, và trong phía ấy chỉ một
    dòng đổi: `merge_method: squash` thành `merge_method: merge`;
  - đọc dạng YAML, chính sách ở HEAD bằng chính sách ở nền cộng đúng ba khoá: `proof: {check: ""}`,
    `required_checks: []`, `merge_method: merge`. Không khoá nào khác khác đi;
  - (không được qua) tệp ghi `merge_method: squash` của bản mẫu, hay tệp thiếu khối `proof`, đều bị báo.
- AC-5: Given ba cây, mỗi cây đọc bằng công cụ của chính nó (nền; HEAD; bản sao của HEAD với chính sách theo cách tối thiểu),
  When đọc những gì sau đây (`github_setup.py main` chạy với `gh` giả):
  - hạng của mọi tệp git theo dõi ở HEAD, và hạng chung của chúng;
  - hạng của một tệp bài kiểm bị xoá, và hạng của một lần bot nâng phụ thuộc;
  - `proof`, lỗi của chính sách, khối CODEOWNERS;
  - mọi bước `github_setup.py main` sẽ làm;

  Then:
  - mọi thứ trên giống nhau ở cả ba cây, trừ bước gộp. Khối CODEOWNERS đúng là `.github/CODEOWNERS` đã commit, mọi bước
    khác (môi trường, ruleset và check bắt buộc của nó) giống nhau, và chính sách không có lỗi nào;
  - chạy không tuỳ chọn, nền sẽ đặt `squash-only merges`, còn HEAD và cách tối thiểu đặt `merge commits only`;
  - (không được qua) một chính sách dời một đường sang `low` thì bị báo là đổi hạng; một `.github/CODEOWNERS` lệch với
    chính sách thì bị báo.
- AC-6: Given các bản sao tạm của HEAD (chính sách thật không đổi), When chạy `github_setup.py` qua `main` với `gh` giả,
  Then:
  - không tuỳ chọn, hoặc `--merge-method merge`: đặt `merge commits only` (`allow_merge_commit=true`, hai cài đặt kia
    `false`);
  - `--merge-method squash` bị từ chối với mã thoát 2, và lời từ chối nói lựa chọn nằm ở `governance/autonomy.yaml`;
  - (không được qua) với `merge_method: rebase`, `autonomy.py --check-codeowners` thoát 1 và gọi tên nó. `github_setup.py`
    dừng với mã thoát 1, chỉ mới hỏi `gh` tên kho; không hạng nào của mọi tệp git theo dõi đổi;
  - chính sách không có khoá (như trước 0.10.3): không tuỳ chọn thì để nguyên cài đặt gộp; `--merge-method squash` đặt
    squash cho lần chạy ấy.
- AC-7: Given kho thật trên GitHub, When chạy `python3 tools/github_setup.py` ở chế độ dry run (đọc GitHub, không đổi gì;
  `--apply` không bao giờ chạy ở đây), Then:
  - lệnh thoát 0, nói «Dry run», và bước gộp là `merge commits only, delete merged branches`;
  - ruleset nó sẽ đặt đòi `check, secret-scan, conventional-title, conventional-commits`;
  - `--merge-method squash` thoát 2 với lời «says merge_method: merge, and --merge-method asks for squash»;
  - hôm nay kho có đúng một ruleset, tên «main». Ruleset ấy đòi `check`, `e2e`, `gate`, và luật pull request của nó không
    đòi code owner duyệt. `github_setup.py` tìm ruleset theo tên của chính nó («repo-setup: protect default branch») và
    không thấy. PR này không đổi gì trong số đó; hồ sơ ghi lại cho chủ kho (Notes).
- AC-8: Given thước đo luồng (`tools/sdlc_metrics.py` và năm tệp mới), When đo, Then:
  - không tệp nào nhắc `_acceptance`;
  - chạy trong cây này với GitHub giả và một dòng ngưỡng bị ép thành «over», ở bốn dạng (trang, `--json`, `--split`,
    `--split --json`): mỗi dạng thoát 0, bằng mã thoát khi không có gì vượt ngưỡng. Mỗi dạng hiện đúng dòng bị ép (dòng
    bảng `| 9 of 20 (45%) | more than 20% | over |`, hay `"verdict": "over"`), và lần chạy không vượt ngưỡng thì không
    hiện;
  - một audit hook gắn trước khi nạp công cụ ghi mọi tệp được mở: không tệp nào dưới `_acceptance/`, và không tệp nào mở
    để ghi khi không có `--write`;
  - với `--write`, trên một bản sao tạm: chỉ ghi trang của tuần dưới `wiki/metrics/` và nhiều nhất là `wiki/index.md`, và
    vẫn thoát 0;
  - không workflow, `Makefile`, tệp `mk/`, `package.json`, cấu hình pre-commit hay `.claude/settings.json` nào chạy nó.

  Giới hạn: cửa sổ GitHub giả là rỗng, nên phần đọc PR và lượt chạy chạy trên danh sách rỗng. Việc chúng không đọc hồ sơ
  dựa vào ý đầu: không tệp công cụ nào nhắc `_acceptance`.
- AC-9: Given diff của PR so với nền, When đo `change-set`, Then:
  - `871afebb` giữ nguyên: cha của nó là nền, nó đổi đúng mười một tệp của lần lên đời, và nó nằm trong HEAD;
  - ngoài mười một tệp ấy, PR chỉ đổi thư mục hồ sơ này, `_acceptance/config.yaml` (chỉ thêm dòng `    rs0103_<tên>: …`,
    không bỏ dòng nào), `PRODUCT-MAP.md` và `LO-TRINH.html`;
  - PR không chạm `.github/`, `.pre-commit-config.yaml`, `tools/commit_msg.py`, và trong `governance/` chỉ chạm tệp chính
    sách;
  - `tools/autonomy.py` và `governance/autonomy.yaml` khớp `t3_paths` của config ở nền, và
    `tools/autonomy.py --base <nền> --head HEAD` xếp PR ở hạng `high`;
  - HEAD gộp vào `origin/main` hôm nay mà không xung đột (`git merge-tree`);
  - mọi commit không phải merge của PR qua `tools/commit_msg.py` của nền.
- AC-10: Given `rang/two-way.mjs`, When chạy `node --test`, Then 19 bài đạt:
  - sáu phép đo xanh trên cây: `template-same`, `resolution`, `policy-same`, `merge-method`, `flow`, `change-set`;
  - mười ba bài phá, với mười sáu bản phá, mỗi bản đỏ đúng lời của điều nó canh:
    - `template-same`: một công cụ mới lệch bản mẫu;
    - `apply-again`: một công cụ khác thứ tag ghi;
    - `resolution`: `merge_method: squash` của bản mẫu; khối `proof` bị bỏ;
    - `policy-same`: một đường dời sang `low`; `.github/CODEOWNERS` lệch chính sách;
    - `merge-method`: tuỳ chọn khác không bị từ chối; giá trị lạ không còn dừng; chính sách không khoá thì đặt squash;
      phép kiểm codeowners thôi đọc `merge_method`;
    - `flow`: vượt ngưỡng làm đổi mã thoát, ở bản trang và ở `--split`; một tệp nhắc `_acceptance`;
    - `change-set`: một tệp `governance/` khác; một commit sai luật; một dòng config lạ.

  `real-run` đọc kho thật trên GitHub nên không có bản phá.

## Coverage

Phủ theo mười một tệp của commit lên đời, mỗi tệp nối vào nhóm mà công cụ báo, cộng bốn điều brief đòi đo. Không quét không
gian tiêu chí: lên đời là việc tất định.

| Nhóm | Tệp hay nơi | Tiêu chí |
| --- | --- | --- |
| `created`, `updated` của công cụ | tám tệp `tools/` | AC-2; AC-3 (đúng bản mẫu) |
| `merged` | `AGENTS.md` | AC-2; AC-3 (một câu) |
| `marked`, gộp tay | `governance/autonomy.yaml` | AC-4 (đúng phía 0.10.3, một dòng đổi); AC-5 (không gì đổi ngoài cách gộp); Hỏi-1 |
| Bản ghi của lần lên đời | `.repo-setup.json` | AC-2; AC-3 |
| Cách gộp lưu trong chính sách | `github_setup.py`, `autonomy.py` | AC-5; AC-6 (đọc, từ chối, hỏng); AC-7 (kho thật, dry run) |
| Thước đo luồng | `sdlc_*` | AC-3; AC-8 (không đọc hồ sơ, ngưỡng không đổi mã thoát) |
| Cả cây | — | AC-1; AC-9; AC-10 |
| `--apply` trên kho thật | — | Không đo: nó đổi cài đặt GitHub, là việc của chủ kho (Notes) |
| `e2e`, `e2e-db` | — | Không đo ở đây: PR không đổi mã, giao diện hay CSDL; CI chạy khi PR rời bản nháp |

## Out of scope

- Gọi tên `e2e` hay `gate` dưới `required_checks`, hay làm khớp ruleset của `main` với danh sách mà `github_setup.py` sẽ
  đặt: quyết định của chủ kho, việc riêng (AC-7 chỉ ghi lại chỗ lệch).
- Chạy `github_setup.py --apply`: nó đổi cài đặt của kho trên GitHub.
- Sửa commit `871afebb`, viết lại lịch sử hay force-push. Nếu chủ kho chọn cách tối thiểu ở Hỏi-1, phiên repo-standards
  làm lại; hồ sơ không tự sửa.
- Thêm bài kiểm vào `tests/` cho các công cụ của repo-setup: bài kiểm của chúng nằm ở repo-standards. Hồ sơ đo hành vi
  bằng các phép đo của mình.
- Chạy thước đo luồng trên dữ liệu GitHub thật (khoảng 2.200 lần gọi API cho 11 ngày, theo ghi chú phát hành).
- Đổi danh sách `high` của chính sách (bản mẫu khuyên không đặt đường sản phẩm ở đó, kho này có đặt): lần lên đời không
  đụng tới nó.
- Rời bản nháp, gộp PR, hay chạy `e2e`/`e2e-db` trên máy: đó là việc của chủ kho và của CI.

## Notes

- `tools/autonomy.py --base <nền> --head HEAD` xếp PR ở hạng `high` (AC-9). Nhưng luật pull request của ruleset «main»
  không đòi code owner duyệt (AC-7). Vì thế GitHub không bắt buộc code owner cho PR này, và việc gộp vẫn là quyết định
  của anh. Điều này có từ trước PR, và PR không đổi nó.
- 0.10.3 ghi `merge_method` là «chưa chạy trên kho thật», tức `--apply`. AC-7 chạy dry run trên kho thật; `--apply` vẫn
  chưa chạy. Đọc mã của `github_setup.py`, một lần `--apply` hôm nay sẽ làm theo thứ tự sau:
  - đặt cách gộp (PATCH cài đặt kho);
  - ghi hai môi trường `staging` và `production` (PUT);
  - vì không có ruleset nào mang tên của nó, tạo thêm một ruleset thứ hai, đòi `check`, `secret-scan`,
    `conventional-title`, `conventional-commits`, bên cạnh ruleset «main» đang đòi `check`, `e2e`, `gate`.

  Trước khi chạy `--apply`, anh nên quyết chỗ lệch này. Đó là việc riêng, không thuộc PR này.
- Ghi chú phát hành nói thước đo luồng tính «late red» khác đi: một màu đỏ của bản nháp được đếm riêng. Con số có thể
  giảm trên kho này; đó là sửa cách đếm, không phải kho đổi.
- Cây mẫu của repo-setup tải theo sha `c5581ff1`, sau khi bóc tag và đòi tag vẫn trỏ về sha ấy. Cache chỉ dùng khi mang
  dấu của sha ấy.
- Clone này không cài hook git, nên tiêu đề commit của hồ sơ được kiểm bằng `tools/commit_msg.py` của nền (AC-9).
