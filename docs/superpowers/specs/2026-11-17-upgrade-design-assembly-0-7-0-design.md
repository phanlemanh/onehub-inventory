# Lên đời công cụ design-assembly lên bản 0.7.0: sổ thôi đi theo pull request

Ngày 2026-11-17. Hồ sơ nghiệm thu: `_acceptance/upgrade-design-assembly-0-7-0/`.

## Vì sao

- Mục 8.4 trong kế hoạch của kho design-assembly: các bước 8.1–8.3 của plugin phải tới được kho kiểm chứng này bằng
  chính lệnh `upgrade`, không chép tay. Các bước ấy làm sổ thôi gây xung đột ở mỗi pull request: tệp máy sinh ra khỏi
  git, sổ viết tay thành mỗi mục một tệp, và lệnh `affected` nói một thay đổi chạm màn nào.
- Ở kho này, hai pull request cùng thêm một màn hay một khối đều sửa cùng một tệp sổ, nên luôn xung đột. Sổ linh kiện và
  bảng vai × màn × nút do máy viết mà vẫn nằm trong git, nên mỗi lần đổi mã lại kéo theo một khối diff dài.
- Chủ kho cho phép từng bước ngày 2026-11-17 (xem Context của hợp đồng).

## Thay đổi

Một commit, `ec2c4597`, trên nhánh `chore/upgrade-design-assembly-0.7.0`, cắt từ `origin/main` ở `69253032`. Commit đổi
81 tệp; mỗi tệp thuộc đúng một trong 13 nhóm dưới đây (số tệp trong ngoặc, `FILE_GROUPS` ở `rang/matrix.mjs`): công cụ và
dấu (17), bước cổng (1), sổ linh kiện và `.gitignore` (2), sổ màn (11), bảng vai × màn × nút và các bên đọc nó (7), sổ
khối (25), cổng chứng minh màn (7), kỹ năng (1), `design/theme.json` (1), `design/behaviors.md` (1), wiki (6), bài kiểm
thứ tự (1), bài kiểm bản sao nông (1).

- **Công cụ 0.1.0 → 0.7.0:**
  - `upgrade` viết 16 tệp công cụ và dấu phiên bản, không đổi sổ nào, không quyết định nào đổi trạng thái.
  - `mk/design-assembly.mk` được chép tay từ mẫu của plugin, vì `upgrade` không viết bước cổng (giới hạn
    `upgrade-leaves-gate-step` của plugin).
- **Sổ linh kiện ra khỏi git:** `components.mjs --out-of-git`, thêm vào `.gitignore`, `git rm --cached`. Cổng viết lại sổ
  từ mã trước khi kiểm.
- **Sổ màn:** `screen-fragments.mjs --split` tách `design/screens.yaml` thành `design/screens/<id>.yaml` (9 màn) cạnh
  `_shared.yaml`. Bản sao một tệp `design/screens.yaml` ra khỏi git (`--copy`), cho những bên đọc cũ của kho.
- **Bảng vai × màn × nút:** đổi tên `design/vai-man-nut.md` → `design/role-screen-buttons.md`, ra khỏi git. Tệp mới
  `mk/derived.mk` vẽ lại bảng sau `design-derived`, trước `test`, `e2e` và `ci-db`, vì các việc ấy đọc bảng trên một bản
  checkout sạch.
- **Sổ khối thành sổ intake:** đổi tên `design/so-khoi.yaml` → `design/intake.yaml`, khai khoá tiếng Việt bằng dòng `keys`
  (`blocks: khoi`, `need: nhu_cau`, …), tách thành `design/intake/<nhu_cau>.yaml` (23 khối), bản sao ra khỏi git.
- **Bên đọc theo tên mới:**
  - cổng chứng minh màn (`tools/proof_gate/model.py`, `legacy.py`, `check.py`, hai tệp bài kiểm, hai tài liệu) và kỹ năng
    `.claude/skills/inventory-ui`;
  - `legacy.py` lấy ngày của luật sổ khối từ commit cũ nhất thêm bất kỳ đường nào sổ từng có;
  - `model.py` đọc thẳng thư mục mảnh khi bản sao chưa được vẽ, bằng Python thuần (hàng 1q cấm gọi tiến trình con ở đó),
    để quyết định 0023 không tắt lặng lẽ khi cổng chạy riêng trên một checkout sạch. Có bài kiểm mới, đã thấy đỏ trên mã cũ.
- **Bản đồ `affected`** trong `design/theme.json`: `none` kê các đường không phải mã (hồ sơ, tài liệu, wiki, kiến trúc,
  quản trị, evals, `tools/**`, `.claude/**`, `*.md`, trang lộ trình, sổ quyết định). Chủ kho chọn ngày 2026-11-17.
- **`design/behaviors.md`:** bảng luật thành danh sách. Chủ kho chọn.
- **Sửa theo:** sáu liên kết đầu trang wiki trỏ đường mới; hai bài kiểm thứ tự ở `tests/vai-man-nut-sinh.test.ts` nay chờ
  thứ tự theo mã; `tests/ci-ban-sao-nong.test.ts` nêu tên `tools/design-assembly/owner-calls.mjs` (chưa ai gọi) kèm lý do.

Không làm: hai hàng 8.3 (`decision-sheet`, `owner-calls`). Chúng đỏ trên bản sao sâu 1 commit vì cần lịch sử của nhánh
chính, mà hàng 1s của kho này giữ `make check` xanh ở đó. Chủ kho hoãn tới khi plugin 0.7.1 tự lấy lịch sử thiếu.

## Đã thấy trước khi làm (bản chạy thử)

- `make check` thoát 0, 2460 bài (chỗ rời main 2459), 17 quyết định giữ bằng 25 lệnh kiểm (trước là 20). Cũng xanh trên
  một bản sao sạch sâu 1 commit có `origin`, dựng như `db/scripts/ci-thu.sh`.
- Audit của plugin trước và sau: một dòng khác, «7 of 7 ledger files» thành «8 of 8».
- `affected` trên 30 lần gộp gần nhất: 4 lần thu hẹp, 0 lần thiếu màn đã khai.
- Hai nhánh mỗi nhánh thêm một mảnh màn và một mảnh khối gộp sạch.

Lượt dựng hồ sơ đo lại và nói rõ hơn một điều: 4 lần «thu hẹp» đều là những lần gộp chỉ đổi tệp không chạm màn, nên ra
**không màn nào**. 26 lần còn lại ra mọi màn; chưa lần nào ra một phần màn. Bản đồ hôm nay thu hẹp được việc ghi chép,
chưa thu hẹp được việc đổi mã.

## Đo thế nào

Hồ sơ chấm kết quả commit để lại, không chấm cách `upgrade` chạy (bài kiểm của lệnh nằm ở kho design-assembly). Mười tiêu
chí, mỗi tiêu chí một phép đo trong `rang/`, và mỗi phép đo có cặp hai chiều: xanh trên kho, đỏ với thông điệp ghim trên
bản phá (`measures-two-way.mjs`; `shallow-two-way.mjs` cho phép đo bản sao nông, vì nó chạy `make check`).

- **AC-1, cổng của kho:** `make check` xanh, với dòng 25 lệnh kiểm, dòng sổ linh kiện khớp mã và dòng 2460 bài.
- **AC-2, bản sao sạch:** `make check` trên bản sao sâu 1 commit có `origin` tự vẽ đủ bốn tệp dẫn xuất và không theo dõi
  tệp nào. Thư viện là bản sao APFS của `node_modules` ở đây (`cp -c`), không cài gì. Phía đỏ: cùng cách dựng trên
  `69253032`.
- **AC-3, đúng bản:** mã cây của thư mục công cụ, dấu phiên bản và mã tệp bước cổng bằng những gì plugin ghi và có ở commit
  `93daea4` của nó (sổ phát hành, thư mục mẫu, mẫu bước cổng).
- **AC-4, ra khỏi git:** bốn tệp dẫn xuất không được theo dõi và bị bỏ qua; hai tên cũ không còn; thư mục mảnh đủ số tệp;
  không bên đọc nào của kho nhắc đường cũ, trừ danh sách lịch sử của `legacy.py` và lời chú của sổ.
- **AC-5, không mất dữ liệu:** dữ liệu YAML của hai thư mục mảnh bằng dữ liệu của hai sổ một tệp ở `69253032`, so theo khoá.
- **AC-6, hết xung đột:** gộp thử bằng `git merge-tree` trong một bản clone chung đối tượng, không đụng kho. Đối chứng trên
  sổ một tệp phải xung đột.
- **AC-7, `affected`:** công cụ 0.7.0 và bản đồ của HEAD chạy trên 30 lần gộp, mỗi lần ở đúng cây của nó.
- **AC-8, cổng chứng minh màn:** cổng xanh và đếm 23 khối khi chỉ có thư mục mảnh; `model.py` cũ chỉ đổi tên thì đếm 0 —
  đúng kiểu tắt lặng mà bản sửa chặn. Ngày luật trên kho thật là ngày thêm `design/so-khoi.yaml`.
- **AC-9, audit:** audit của plugin, lấy ra từ commit ghim bằng `git archive`, chạy trên kho ở `69253032` và ở HEAD; hai đầu
  ra khác đúng một dòng.
- **AC-10, phạm vi:** commit đổi đúng 81 tệp, mỗi tệp trong đúng một nhóm việc; cả nhánh không đổi gì ngoài chúng và tệp của hồ sơ. Sau khi gộp, phép đo chỉ
  so commit và nói ra như vậy, không xanh suông.

## Luật lựa chọn

- Lỗi lượt chấm tìm ra trong thư mục công cụ không sửa tay trên nhánh (AC-3 ghim mã cây của bản 0.7.0) và không sửa ở
  kho plugin: vòng dừng và trình chủ kho, vì ra bản plugin mới là việc ngoài kho này. Lỗi ở phép đo của hồ sơ thì sửa
  trong `rang/`.
- Hồ sơ không sửa hồ sơ đã ký nào. Phép đo cây công cụ ghim bản 0.1.0 của hồ sơ `upgrade-design-assembly-tool` sẽ đỏ nếu
  bị ghim lại sau khi gộp; AC-3 thay chỗ nó.

## Nền hạ tầng lúc mở vòng

`make check` xanh. `npm run build` và `make e2e` đỏ vì `node_modules` ở đây là bản sao của checkout chính, mang Next
16.4.2, trong khi lockfile ở `69253032` đòi 16.4.6. Next từ chối chạy bản có lỗ hổng đã biết. Không phải lỗi của commit;
sửa bằng `make setup`, việc cài gói chờ chủ kho cho phép.
