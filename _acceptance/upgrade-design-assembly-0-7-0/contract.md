---
schema_version: 1
feature: Lên đời công cụ design-assembly từ 0.1.0 lên 0.7.0 bằng lệnh upgrade — sổ linh kiện, sổ màn và sổ khối thôi đi theo pull request, bảng vai × màn × nút ra khỏi git, bản đồ affected
slug: upgrade-design-assembly-0-7-0
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [config, ci]
status: implemented
approved_by: Phan Le Manh
approved_at: 2026-11-17
design_doc: docs/superpowers/specs/2026-11-17-upgrade-design-assembly-0-7-0-design.md
---

# Acceptance Contract: upgrade-design-assembly-0-7-0

## Context

Thay đổi đã làm sẵn trên nhánh `chore/upgrade-design-assembly-0.7.0` (commit `ec2c4597`, cắt từ `origin/main` ở
`69253032`), theo mục 8.4 trong kế hoạch của kho design-assembly: đưa các bước 8.1–8.3 của plugin (tệp dẫn xuất ra khỏi
git, sổ mỗi mục một tệp, lệnh `affected`) vào kho kiểm chứng này bằng `upgrade`. Chủ kho đã cho phép từng bước ngày
2026-11-17: nhánh riêng cắt từ `origin/main`; đổi tên hai tệp tên tiếng Việt và giữ khoá tiếng Việt qua `keys`; bảng
khuôn hành vi thành danh sách; hoãn hai hàng 8.3; bản đồ `affected` như đề xuất; commit tại chỗ rồi chạy hồ sơ trong
một phiên ở kho này. Nhánh đổi đường dẫn T3 (`tools/**`, `mk/**`), nên cổng trước khi gộp đòi hồ sơ có chữ ký người. Hồ
sơ này chấm đúng những gì commit đã làm.

Source input: lời chủ kho ngày 2026-11-17; mục 8.4 trong kế hoạch của kho design-assembly; bản chạy thử và bằng chứng
của phiên làm 8.4 (ghi chú bàn giao `8.4-reference-upgrade-dry-run.md`); design doc ở `design_doc`.

## Criteria

- AC-1: Given nhánh ở HEAD, When chạy `make check`, Then lệnh thoát 0, và đầu ra có dòng
  `design-assembly: 17 decisions held by 25 checks, each seen failing on a changed copy`, dòng
  `component manifest: design/component-registry.json is up to date (294 components)` và dòng
  `Tests  2460 passed | 2 skipped (2462)` (chỗ rời `main` có 2459 bài; bài mới là bài cổng chứng minh màn đọc thư mục
  mảnh).
- AC-2: Given một bản sao sâu 1 commit của HEAD có `origin`, dựng như `db/scripts/ci-thu.sh` dựng (thư viện là bản sao
  APFS của `node_modules` ở đây, không cài gì), When chạy `make check` trong bản sao, Then lệnh thoát 0, tự viết đủ bốn
  tệp dẫn xuất (đầu ra có ba dòng `derived files: wrote …` của sổ linh kiện, sổ màn và sổ khối, và sau lệnh bốn tệp đều có
  mặt), có hai dòng đếm của AC-1, và git của bản sao không theo dõi tệp dẫn xuất nào; cùng cách dựng ấy trên `69253032`
  thì phép đo đỏ.
- AC-3: Given thư mục `tools/design-assembly/`, `design/tool-stamp.json` và `mk/design-assembly.mk` ở HEAD, When tính mã
  git từ tên và nội dung tệp, Then thư mục có 34 tệp và mã cây `f3d66a61fdcfbdfca103d48c7077bd1c9b95bb73`, dấu phiên bản
  ghi `version` `0.7.0` cùng mã ấy, và `mk/design-assembly.mk` có mã `d67aeb30023e8ce4e0583979387c8078653ff3a3`; và ở
  commit `93daea4` của kho design-assembly (main của plugin lúc chạy upgrade), sổ phát hành ghi cho bản 0.7.0 đúng mã cây
  này, thư mục mẫu công cụ có mã cây này, và mẫu bước cổng có đúng mã của `mk/design-assembly.mk`.
- AC-4: Given cây của HEAD, When kê tệp git theo dõi và luật bỏ qua, Then bốn tệp dẫn xuất (`design/component-registry.json`,
  `design/screens.yaml`, `design/role-screen-buttons.md`, `design/intake.yaml`) không được theo dõi và đều bị
  `.gitignore` bỏ qua; hai tên cũ `design/so-khoi.yaml` và `design/vai-man-nut.md` không còn; `design/screens/` có
  `_shared.yaml` cùng 9 tệp màn và `design/intake/` có `_shared.yaml` cùng 23 tệp khối; và ngoài hồ sơ, tài liệu và wiki,
  không tệp nào nhắc đường cũ trừ `tools/proof_gate/legacy.py` (danh sách đường lịch sử của sổ) và lời chú ở đầu
  `design/intake/_shared.yaml`.
- AC-5: Given `design/screens.yaml` và `design/so-khoi.yaml` ở `69253032`, When đọc dữ liệu YAML của hai thư mục mảnh ở
  HEAD, Then mỗi thư mục giữ đúng dữ liệu sổ cũ: cùng tập mục theo khoá (`id` của màn, `nhu_cau` của khối), từng mục bằng
  nhau mọi trường, mỗi mục ở tệp mang tên khoá của nó, và `_shared.yaml` bằng các khoá khác của sổ cũ — sổ khối có thêm
  đúng khoá `keys`, trong đó `blocks` là `khoi`.
- AC-6: Given HEAD, When hai nhánh cắt từ HEAD mỗi nhánh thêm một màn và một khối với mã khác nhau, Then hai nhánh gộp
  sạch; và cùng hai việc thêm ấy trên sổ một tệp ở `69253032` thì xung đột đúng ở `design/screens.yaml` và
  `design/so-khoi.yaml`.
- AC-7: Given lệnh `affected` của bản 0.7.0 và bản đồ `affected` trong `design/theme.json` ở HEAD, When chạy trên 30 lần
  gộp gần nhất của `main` tính từ `69253032`, mỗi lần gộp với tệp nó đổi, Then 26 lần ra mọi màn, 0 lần ra một phần màn,
  4 lần ra không màn nào, và 0 lần thiếu một màn mà hồ sơ của chính lần gộp ấy khai trong `screens:`.
- AC-8: Given một bản sao của kho ở HEAD không có hai bản sao một tệp (`design/intake.yaml`, `design/screens.yaml`),
  When chạy cổng chứng minh màn (`tools/proof_gate/check.py`), Then cổng thoát 0, in
  `proof-gate: mọi màn đang mở đã chứng minh đúng lối`, và báo cáo `--report --json` đếm `nhap_kho` 23 — quyết định 0023
  vẫn bật khi chỉ có thư mục mảnh; còn với `model.py` của `69253032` chỉ đổi tên sổ, cổng đếm 0. Và trên kho ở HEAD,
  bộ đọc lịch sử của cổng (`legacy.py`) lấy ngày của luật sổ khối là `2026-11-12`, ngày của commit `1edac3b0` thêm
  `design/so-khoi.yaml`, không phải ngày đổi tên.
- AC-9: Given lệnh audit của plugin (`scripts/inventory.mjs` lấy ra từ commit `93daea4`), When chạy trên kho ở `69253032`
  và trên kho ở HEAD, Then hai đầu ra khác nhau đúng một dòng:
  `contract: 7 of 7 ledger file(s) have the one shape every reader relies on` thành
  `contract: 8 of 8 ledger file(s) have the one shape every reader relies on`.
- AC-10: Given commit `ec2c4597` và cha `69253032`, When kê tệp commit đổi (không gộp đổi tên), Then đúng 81 tệp ma trận
  kê, mỗi tệp thuộc đúng một trong 13 nhóm việc của bảng Coverage và số tệp từng nhóm đúng như ma trận ghi; và từ chỗ rời `main` tới HEAD, nhánh không đổi tệp nào ngoài 81 tệp ấy và tệp của chính hồ sơ này (thư mục hồ sơ,
  `_acceptance/config.yaml`, design doc, kế hoạch, `wiki/log.md`, bản đồ sản phẩm, trang lộ trình). Khi nhánh đã vào
  `origin/main`, phép đo chỉ so commit và nói đúng điều đó.

## Coverage

Phủ theo 13 nhóm việc của commit (design doc, mục «Thay đổi»): mỗi tệp trong 81 tệp thuộc đúng một nhóm (`FILE_GROUPS` ở
`rang/matrix.mjs`, đo bằng AC-10), và từng bên đọc thứ bị đổi. Không quét không gian tiêu chí: dòng sổ `descope` «bỏ
coverage-scan».

| Nhóm việc (số tệp), hoặc bên đọc | Tiêu chí, hoặc lý do ngoài phạm vi |
| --- | --- |
| Công cụ 0.7.0 và dấu phiên bản (17) | AC-3 |
| Bước cổng chép tay từ mẫu của plugin (1) | AC-3 |
| Nguồn của mã cây ghim: sổ phát hành và mẫu của plugin | AC-3 |
| Sổ linh kiện ra khỏi git, `.gitignore` (2) | AC-4; AC-1 và AC-2 (cổng viết lại sổ từ mã ở mỗi lần chạy, rồi in dòng khớp mã) |
| Sổ màn tách mảnh, bản sao ra khỏi git (11) | AC-4, AC-5, AC-6 |
| Bảng vai × màn × nút đổi tên, ra khỏi git, `mk/derived.mk` vẽ lại, các bên đọc bảng (7) | AC-4; AC-2 (bản sao sạch có bảng sau `make check`); AC-1 (bài kiểm của bảng) |
| Sổ khối đổi tên thành sổ intake, khai `keys`, tách mảnh, bản sao ra khỏi git (25) | AC-4, AC-5, AC-6 |
| Bên đọc của cổng chứng minh màn (7): đọc thẳng thư mục mảnh, ngày luật từ mọi đường sổ từng có | AC-8; AC-1 (bài kiểm mới); AC-4 (không còn đường cũ) |
| Kỹ năng `inventory-ui` (1) | AC-4 (không còn đường cũ); AC-1 (bài kiểm đọc kỹ năng) |
| Bản đồ `affected` và hình dạng sổ trong `design/theme.json` (1) | AC-7; AC-9 (audit thấy 8 sổ một hình dạng) |
| Bảng luật của `design/behaviors.md` thành danh sách (1) | AC-10; AC-1 (`make check` đọc tệp) |
| Sáu liên kết đầu trang wiki (6), hai bài kiểm thứ tự (1), tên `owner-calls.mjs` trong bài kiểm bản sao nông (1) | AC-10; AC-1 |
| Hai hàng 8.3 (`decision-sheet`, `owner-calls`) | Ngoài phạm vi: chủ kho hoãn (dòng sổ `descope`, Hỏi-2) |
| Lời văn lịch sử trong thân trang wiki, hồ sơ và tài liệu cũ còn tên cũ | Ngoài phạm vi: ghi chép lịch sử, không phải bên đọc |
| Cách lệnh upgrade chạy | Ngoài phạm vi: lệnh nằm ở plugin, có bài kiểm ở kho design-assembly |

## Out of scope

- Hai hàng 8.3 của plugin, `decision-sheet` và `owner-calls`: chủ kho hoãn vì chúng đỏ trên bản sao nông, mà hàng 1s của
  kho này giữ `make check` xanh ở đó. Bản plugin 0.7.1 sửa trước, rồi một lần lên đời sau thêm hai hàng.
- Đo 30 pull request kế tiếp cho dòng 1 của «xong khi» ở bước 8 của plugin.
- Bậc M1 của kit trên một worktree mới cho tới khi có lệnh vẽ sổ linh kiện: việc của kit. `.worktreeinclude` có thể chở
  các tệp dẫn xuất; việc đó do chủ kho quyết.
- Giới hạn đã biết: một bài kiểm chạy riêng bằng trình chạy của nó (không qua `make`) không có các tệp dẫn xuất.
- Hành vi của lệnh `upgrade`, `status` hay `audit` của plugin.
- Ghim lại các hồ sơ đã ký trước (`upgrade-design-assembly-tool`, `refresh-design-assembly-tool`, `adopt-design-assembly`),
  hay sửa phép đo đã ghim theo bản cũ của chúng.
- Mọi thay đổi giao diện, mã sản phẩm, mô hình dữ liệu hay luật sản phẩm.

## Notes

- Các con số của tiêu chí (17 và 25, 294 linh kiện, 2460 bài, 34 tệp, mã cây, 9 và 23 mục, 26/0/4/0, 81 tệp) đọc từ kết
  quả commit đã có: lên đời là việc tất định, và hồ sơ này chấm sau khi làm. Ma trận ở `rang/matrix.mjs`.
- Các phép đo nằm ở `rang/`, chạy ở lượt chấm và lượt ghim lại, không chạy trong `make check`. Commit được ghim theo mã,
  nên AC-3, AC-5, AC-6, AC-7, AC-9 và phần commit của AC-10 đọc như nhau trước và sau khi gộp.
- AC-3 và AC-9 đọc kho design-assembly trên máy (`~/design-assembly`, hoặc thư mục trong biến `DESIGN_ASSEMBLY_REPO`) ở
  commit ghim `93daea4`. Máy không có kho ấy thì hai phép đo đỏ với lời «cannot read» hay «cannot take», không xanh suông.
- Dòng sổ linh kiện «up to date» của AC-1 là lời cổng in sau khi chính nó viết lại sổ từ mã, nên nó không đỏ được vì sổ
  cũ; nó chỉ chứng rằng cổng đã chạy bước ấy. Việc sổ không còn trong git và bị bỏ qua đo ở AC-4; mỗi lệnh kiểm của công
  cụ tự thấy mình đỏ trên một bản đổi (dòng «each seen failing on a changed copy» của AC-1).
- Lỗi lượt chấm tìm ra trong `tools/design-assembly/` không sửa tay trên nhánh và không sửa ở kho plugin: vòng dừng và
  trình chủ kho.
- AC-9 chạy audit trên kho ở HEAD với các tệp dẫn xuất đã vẽ; chưa vẽ thì phép đo đỏ và gọi tên tệp thiếu.
- Phép đo cây công cụ của hồ sơ `upgrade-design-assembly-tool` (E2, ghim bản 0.1.0) sẽ đỏ nếu ai ghim lại hồ sơ ấy sau khi
  nhánh này gộp. Hồ sơ này không sửa hồ sơ đã ký; AC-3 thay chỗ phép đo ấy.
- Nền hạ tầng lúc mở vòng: `make check` xanh, còn `npm run build` và `make e2e` đỏ vì `node_modules` ở đây là bản sao của
  checkout chính với Next 16.4.2, trong khi lockfile ở `69253032` đòi 16.4.6 (`duong-nen.md`). Đây không phải lỗi của
  commit; sửa bằng `make setup`, việc cần chủ kho cho phép cài gói.
