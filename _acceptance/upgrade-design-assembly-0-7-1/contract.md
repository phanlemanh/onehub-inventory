---
schema_version: 1
feature: Lên đời công cụ design-assembly từ 0.7.0 lên 0.7.1 và thêm hai hàng cổng decision-sheet, owner-calls, chạy được trên bản sao nông
slug: upgrade-design-assembly-0-7-1
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [config, ci]
status: implemented
approved_by: Phan Le Manh
approved_at: 2026-11-18
design_doc: docs/superpowers/specs/2026-11-18-upgrade-design-assembly-0-7-1-design.md
---

# Acceptance Contract: upgrade-design-assembly-0-7-1

## Context

Thay đổi đã làm sẵn trên nhánh `chore/upgrade-design-assembly-0.7.1` (commit `8d64f79c`, cắt từ `origin/main` ở
`8925e8ff`): `upgrade` từ kho design-assembly ở `ba3af6b` (bản 0.7.1), hai hàng `decision-sheet` và `owner-calls` mà
PR #84 hoãn, chuỗi mẫu của `tests/design-check.test.ts` dựng từ hằng `TAG`, và lý do mới cho mục miễn `owner-calls.mjs`
trong `tests/ci-ban-sao-nong.test.ts`. Chủ kho cho phép từng bước ngày 2026-11-18. Nhánh đổi `tools/**`, nên cổng trước
khi gộp đòi hồ sơ có chữ ký người. Hồ sơ này chấm đúng những gì commit đã làm.

Source input: lời chủ kho ngày 2026-11-18; việc giao của phiên design-assembly (lên đời 0.7.1, thêm hai hàng, chứng ca
bản sao nông); quyết định 0056 và sổ phát hành của kho design-assembly; design doc ở `design_doc`.

## Criteria

- AC-1: Given nhánh ở HEAD, When chạy `make check`, Then lệnh thoát 0, và đầu ra có dòng
  `design-assembly: 19 decisions held by 27 checks, each seen failing on a changed copy` và dòng
  `Tests  2460 passed | 2 skipped (2462)`.
- AC-2: Given một bản sao sâu 1 commit của HEAD, dựng như `db/scripts/ci-thu.sh` dựng nhưng `origin` là một kho
  trung gian có `main` ghim ở `8925e8ff` (thư viện là bản sao APFS của `node_modules` ở đây, không cài gì), When chạy
  `make check` trong bản sao, Then lệnh thoát 0, đầu ra có dòng 19/27 của AC-1 và dòng
  `component manifest: design/component-registry.json is up to date (294 components)`, và sau lệnh chỗ HEAD rời `main` của
  `origin` trong bản sao là `8925e8ff`; cùng cách dựng ấy trên `8925e8ff` thì phép đo đỏ vì cổng không in dòng 19/27.
- AC-3: Given một bản sao như AC-2 chưa chạy lệnh nào, When chạy riêng `make design-assembly`, Then lệnh thoát 0 và đầu ra
  có hai dòng `decision-sheet, debt: a shallow checkout: main and the history back to where this branch left it were
  fetched from origin` và cùng lời ấy cho `owner-calls`, và chỗ HEAD rời `main` vừa lấy là `8925e8ff`; khi `main` của kho
  trung gian ghim ở một commit cũ hơn thì phép đo đỏ vì chỗ rời không phải `8925e8ff`; cùng bản sao mà `tools/design-assembly/owner-calls.mjs` là bản
  của `8925e8ff` (0.7.0) thì lệnh không thoát 0, và cả hai hàng báo `no main branch to compare with`.
- AC-4: Given một bản sao như AC-3, When thêm trang `design/patterns/trang-moi.md` rồi chạy `make design-assembly`, Then
  lệnh không thoát 0 và `owner-calls` báo `pattern:trang-moi: a new kind of screen (trang-moi) is the owner's call`; When
  thay vào đó thêm bài kiểm `tests/the-thu.test.ts` gắn thẻ `decision:khong-co-hang`, Then lệnh không thoát 0 và
  `decision-sheet` báo `decision:khong-co-hang: tests/the-thu.test.ts proves it, and the ledger has no row for it`.
- AC-5: Given thư mục `tools/design-assembly/`, `design/tool-stamp.json` và `mk/design-assembly.mk` ở HEAD, When tính mã
  git từ tên và nội dung tệp, Then thư mục có 34 tệp và mã cây `2da4cc56de55b9805b50baf46731151f12428f63`, dấu phiên bản
  ghi `version` `0.7.1` cùng mã ấy, và `mk/design-assembly.mk` có mã `d67aeb30023e8ce4e0583979387c8078653ff3a3`; và ở
  commit `ba3af6b` của kho design-assembly, sổ phát hành ghi cho bản 0.7.1 đúng mã cây này, thư mục mẫu công cụ có mã cây
  này, và mẫu bước cổng có đúng mã của `mk/design-assembly.mk`.
- AC-6: Given `design/decisions.yaml` và `design/theme.json` ở HEAD, và hai tệp cùng tên của kho design-assembly ở
  `ba3af6b`, When đọc hai hàng `decision-sheet`, `owner-calls` và hai mục cùng tên trong `checks`, Then hai hàng bằng
  nhau mọi trường, hai mục bằng nhau trừ khoá `blueprint` mà kho này không có (không có `design/blueprint.json`), và
  ngoài hai hàng, hai mục ấy thì HEAD không khác `8925e8ff` ở hai tệp.
- AC-7: Given HEAD, When chạy `tests/ci-ban-sao-nong.test.ts` và `tests/design-check.test.ts`, Then mọi bài đạt, và
  `tests/design-check.test.ts` không còn chuỗi nào khớp thẻ `decision:<id>` mà bộ đọc của `decision-sheet` đọc; cùng tệp
  ở `8925e8ff` đặt vào một bản sao như AC-3 thì `decision-sheet` đỏ, gọi tên `decision:a`, `decision:other` và
  `decision:a-b`.
- AC-8: Given commit `8d64f79c` và cha `8925e8ff`, When kê tệp commit đổi, Then đúng 6 tệp của ma trận; và từ chỗ nhánh
  rời `origin/main` tới HEAD, nhánh không đổi tệp nào ngoài 6 tệp ấy và tệp của chính hồ sơ này, kê tên từng tệp trong ma
  trận: thư mục `_acceptance/upgrade-design-assembly-0-7-1/`, `_acceptance/config.yaml`,
  `docs/superpowers/specs/2026-11-18-upgrade-design-assembly-0-7-1-design.md`,
  `docs/superpowers/plans/2026-11-18-upgrade-design-assembly-0-7-1.md`, `wiki/log.md`, `PRODUCT-MAP.md` và `LO-TRINH.html`.
  Khi nhánh đã vào `origin/main`, phép đo chỉ so commit và nói đúng điều đó.
- AC-9: Given HEAD và Docker trên máy, When chạy `bash db/scripts/ci-thu.sh`, Then lệnh thoát 0 và dòng cuối có
  `check xanh`, `pha bo-phien do`, `pha vai-chu do` và `pha may-chu-chu do`.

## Coverage

Phủ theo 6 tệp của commit và từng bên đọc bị đổi. Không quét không gian tiêu chí: dòng sổ `descope` «bỏ coverage-scan».

| Tệp của commit, hoặc bên đọc | Tiêu chí, hoặc lý do ngoài phạm vi |
| --- | --- |
| `tools/design-assembly/owner-calls.mjs` (công cụ 0.7.1) | AC-5; AC-3 (lấy `main` trên bản sao nông); AC-4 |
| `design/tool-stamp.json` | AC-5 |
| `mk/design-assembly.mk` (không đổi, đã bằng mẫu 0.7.1) | AC-5; AC-8 (không nằm trong 6 tệp) |
| `design/decisions.yaml`, hai hàng | AC-6; AC-1 (19 quyết định); AC-4 |
| `design/theme.json`, hai khai báo | AC-6; AC-1 (27 phép kiểm); AC-4 |
| `tests/design-check.test.ts`, chuỗi mẫu | AC-7; AC-1 |
| `tests/ci-ban-sao-nong.test.ts`, lý do miễn | AC-7; AC-8 |
| `make check` trên bản sao nông, CI và `ci-thu.sh` | AC-2; AC-9 |
| Hai hàng chạy riêng trên bản sao nông | AC-3; AC-4 |
| Cách lệnh `upgrade` chạy | Ngoài phạm vi: lệnh nằm ở plugin, có bài kiểm ở kho design-assembly |
| `main` trên GitHub làm gốc so | Ngoài phạm vi của phép đo trên máy: job CI của PR chứng nó |

## Out of scope

- Hành vi của lệnh `upgrade`, `status`, `audit` hay `decide` của plugin.
- Sửa `tools/design-assembly/` bằng tay, hay sửa kho design-assembly: lỗi tìm ra ở đó là việc của plugin.
- Lời «debt:» đặt trước một ghi chú báo thành công (`check.mjs` dòng 1177): cách in của plugin. Đã ghi ở tệp
  `0.7.1-inventory-plugin-findings.md` của thư mục ghi chú chung và gửi về phiên giao việc (dòng sổ cuối của S1).
- Bộ đọc thẻ của `decision-sheet` đọc cả chuỗi trong dữ liệu mẫu: giới hạn `decision-sheet-reads-tags-in-test-data` đã
  ghi ở plugin; kho này chỉ tránh nó ở một tệp.
- Ghim lại các hồ sơ đã ký trước (`upgrade-design-assembly-0-7-0` và các hồ sơ design-assembly trước đó), hay sửa phép
  đo đã ghim theo bản cũ của chúng.
- Mọi thay đổi giao diện, mã sản phẩm, mô hình dữ liệu hay luật sản phẩm.

## Notes

- Các con số của tiêu chí (19 và 27, 2460 bài, 294 linh kiện, 34 tệp, mã cây, 6 tệp) đọc từ kết quả commit đã có: lên đời
  là việc tất định, và hồ sơ này chấm sau khi làm. Ma trận ở `rang/matrix.mjs`.
- Các phép đo nằm ở `rang/`, chạy ở lượt chấm và lượt ghim lại, không chạy trong `make check`. Commit được ghim theo mã,
  nên AC-5, AC-6 và phần commit của AC-8 đọc như nhau trước và sau khi gộp.
- AC-5 và AC-6 đọc kho design-assembly trên máy (`~/design-assembly`, hoặc thư mục trong biến `DESIGN_ASSEMBLY_REPO`) ở
  commit ghim `ba3af6b`. Máy không có kho ấy thì hai phép đo đỏ với lời «cannot read», không xanh suông.
- Trong `make check`, hai hàng không in lời «fetched»: cổng chứng minh màn (`tools/proof_gate/legacy.py`) chạy trước trong
  vitest và đã lấy cả lịch sử cùng `origin/main`. AC-3 đo đường lấy của 0.7.1 bằng cách chạy riêng cổng design-assembly.
- Bản sao của AC-2, AC-3, AC-4 và AC-7 lấy `origin` là một kho trung gian chia đối tượng với kho này, có `main` ghim ở
  `8925e8ff`. Nhánh `main` trên máy nằm ở `ea774a0f`, chậm 16 commit; lấy nó làm gốc so thì hai hàng so gộp cả commit lên
  0.7.0. `ci-thu.sh` (AC-9) dựng bản sao theo cách của nó, `origin` là kho này, nên gốc so ở đó là `main` trên máy; hồ sơ
  không đổi `ci-thu.sh`. Trên CI, job `check` và job `gate` của PR so với main trên GitHub.
- Cây công cụ chỉ được canh bằng AC-5 ở lượt chấm và lượt ghim lại của hồ sơ này, không bằng `make check`. Phép đo cây
  công cụ của hồ sơ 0.7.0 (E4, ghim 0.7.0) sẽ đỏ nếu ai ghim lại hồ sơ ấy sau khi gộp; hồ sơ này không sửa hồ sơ đã ký
  (Hỏi-2 trên thẻ Cổng Phạm vi).
- Lỗi lượt chấm tìm ra trong `tools/design-assembly/` không sửa tay trên nhánh và không sửa ở kho plugin: vòng dừng và
  trình chủ kho.
- Nền hạ tầng lúc mở vòng (`duong-nen.md`): `make check` và `npm run build` xanh; `make e2e` đỏ 436 bài. Máy chủ e2e đọc
  `DATABASE_URL` từ tệp môi trường của máy, trỏ vào Postgres `onehub-inventory-db-main` đang chạy, nên đòi đăng nhập ở
  những bài viết cho chế độ không cơ sở dữ liệu. Cùng bài `tests/e2e/account.spec.ts` với `DATABASE_URL` trống thì 4/4 đạt.
  Đây không phải lỗi của commit; cách gỡ là Hỏi-3 trên thẻ Cổng Phạm vi.
