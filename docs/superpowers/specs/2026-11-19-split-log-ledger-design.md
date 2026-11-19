# Tách sổ log của wiki ra khỏi git — thiết kế

Ngày: 2026-11-19 · Hồ sơ: `_acceptance/split-log-ledger/` · PR 1 trên 2 của bước tách sổ (kế hoạch
`docs/superpowers/plans/2026-11-18-onehub-upgrade-0.9.0.md` của kho phanlemanh/repo-standards, mục 5–6).

## Vấn đề

Mọi PR thêm một dòng vào cùng chỗ của `wiki/log.md`. Trong 30 PR gộp gần nhất, 51 trên 70 lần gộp ngược `main` có xung đột
ở một tệp sổ, hầu hết là `wiki/log.md`. Từ PR 88, `merge=union` cho git trên máy tự gộp tệp ấy, nhưng: thứ tự mục lệch
(bốn mục nằm sai chỗ theo ngày), hai mục có hai bản y hệt, và ô báo xung đột của GitHub vẫn đỏ vì nó không dùng
`.gitattributes`.

## Cách làm

Dùng đúng công cụ repo-setup 0.9.0 đã đặt ở PR 88: `make split L=log`. Không viết mã mới.

1. `make split L=log DRY=1`, đọc kết quả: 110 dòng mục trước và sau, khớp từng chữ; bốn mục đổi chỗ.
2. `make split L=log`: mỗi mục một tệp `wiki/log/YYYY-MM-DD-NN-<slug>.md`; `git rm --cached wiki/log.md`; `.gitignore`
   đã có dòng ấy; repo-setup thôi theo dõi `wiki/log.head.md` (đầu sổ nay là của kho). `make derived` vẽ lại
   `wiki/log.md`; mọi bước của `make check`, `build`, `dev` chờ `derived` (dòng 19 của `Makefile`), nên CI và bài
   `tests/khong-o-tim.test.ts` có tệp vẽ trước khi đọc.
3. Sửa hai lời dặn ghi tay còn hiệu lực: sổ tay xoay khoá (`docs/van-hanh/xoay-khoa.md`) và luật 10 của đợt `nen`
   (`docs/plan/dot-nen/LUAT-rieng.md`). `AGENTS.md` và `.claude/skills/*` đã viết cho lúc sau khi tách. Kế hoạch, đặc tả
   và bản đo cũ là bản ghi của ngày ấy, để nguyên.
4. Gỡ bản thừa của hai mục trùng (Hỏi-3 của hợp đồng).
5. Đo các phép đo của hồ sơ đã ký có đọc `wiki/log.md`, trước và sau khi tách, trên cây đã commit. Ba hồ sơ gãy. Lần duyệt
   đầu chọn sửa sau chữ ký (Hỏi-2); sau lượt chấm 1 chủ kho đổi thành để nguyên, ghi Known limits của hợp đồng, vì sửa
   thì chốt trước-gộp đòi ghim lại cả ba hồ sơ, mà hai hồ sơ đã đỏ sẵn trên `main`.

## Lựa chọn

- **`.gitattributes` giữ nguyên** (Hỏi-1). Dòng `merge=union` không còn áp vào tệp nào git giữ, nhưng là của khuôn
  repo-setup; bỏ nó làm kho lệch khuôn. Đề xuất cho repo-setup: `make split L=log` bỏ dòng ấy.
- **E10 của `upgrade-repo-setup-0-9-0` được thay, không sửa.** AC-9 của hồ sơ ấy đúng ở commit đã chấm. Lối
  `status: not-run` + `superseded_by` của kit giữ được mã thoát đã ký mà không viết lại phép đo; AC-3 của hồ sơ này đo
  lại phần còn đúng và bỏ câu «index, glossary, gen là one-file» mà PR 2 sẽ đổi. Ca «ledgers» của two-way dựng ở commit
  đã chấm, nên ca vẫn chứng phép đo.
- **Hai phép đo kia nhắm vào mục mới nhất của `wiki/log/`**, rơi về `wiki/log.md` khi sổ còn một tệp: ý phép đo giữ
  nguyên, mặt đỏ vẫn đỏ.
- **Phép đo của hồ sơ này bền qua PR 2:** AC-3 nhận ba sổ kia ở hình nào cũng được, miễn mỗi sổ một hình và
  `make split DRY=1` không ghi gì; AC-1 so với `c79189dd` cố định và cho phép mục mới từ ngày tách.

## Không chạm giao diện

Không màn, không thành phần, không mã sản phẩm: không có đặc tả UX, không có nghi thức design-pass, không có eval
`ui-check` (dòng `descope` trong sổ quyết định của hồ sơ).

## PR đang mở có sửa `wiki/log.md`

PR 83 (`claude/dieu-chinh-hang-muc-7b7931`, app-shell ReUI Verve) sửa cả `wiki/log.md` lẫn `wiki/index.md`. Khi gộp
ngược `main` sau PR này, nó gặp đúng một xung đột «deleted here, modified there» ở `wiki/log.md`: lấy phần xoá trước
(`git rm wiki/log.md`), rồi thêm từng dòng nó đã thêm bằng `make log m="..."` (`git diff MERGE_HEAD...HEAD -- wiki/log.md`
cho thấy các dòng ấy). `wiki/index.md` vẫn là một tệp tới PR 2.
