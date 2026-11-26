# Lên đời công cụ design-assembly lên bản 0.7.1: hai hàng cổng chạy được trên bản sao nông

Ngày 2026-11-18. Hồ sơ nghiệm thu: `_acceptance/upgrade-design-assembly-0-7-1/`.

## Vì sao

- PR #84 lên đời kho lên 0.7.0 nhưng hoãn hai hàng `decision-sheet` và `owner-calls` (bước 8.3 của plugin). Trên bản
  sao sâu 1 commit, hai phép kiểm ấy không tìm ra nhánh chính để so và đỏ. Kho này có luật riêng: `make check` phải xanh
  trên bản sao nông như CI dựng.
- Plugin 0.7.1 (quyết định 0056 của kho design-assembly) sửa điều đó: gặp bản sao nông, `owner-calls.mjs` tự lấy `main`
  (không có thì `master`) từ `origin`, đào sâu lịch sử tới chỗ nhánh rời `main`, rồi mới so.
- Chủ kho cho phép từng bước ngày 2026-11-18: tạo nhánh từ `origin/main`, chạy `upgrade`, thêm hai hàng cùng hai sửa
  kèm theo, commit tại chỗ, mở hồ sơ này.

## Thay đổi

Một commit, `8d64f79c`, trên nhánh `chore/upgrade-design-assembly-0.7.1`, cắt từ `origin/main` ở `8925e8ff`. Commit đổi
6 tệp:

- **Công cụ 0.7.0 → 0.7.1:** `upgrade` chỉ đổi `tools/design-assembly/owner-calls.mjs` (+160/−26) và
  `design/tool-stamp.json` (`0.7.1`, cây `2da4cc56`). `mk/design-assembly.mk` đã bằng mẫu của 0.7.1, không phải chép tay.
- **Hai hàng sổ quyết định:** `design/decisions.yaml` thêm hai hàng `decision-sheet` và `owner-calls`, chép nguyên văn từ
  `design/decisions.yaml` của kho design-assembly ở `ba3af6b`.
- **Hai khai báo phép kiểm:** `design/theme.json` thêm hai mục vào `checks`, chép từ kho design-assembly, bỏ khoá
  `blueprint` vì kho này không có `design/blueprint.json`.
- **Chuỗi mẫu trong bài kiểm sổ quyết định:** `tests/design-check.test.ts` có ba chuỗi mẫu `decision:a`, `decision:other`,
  `decision:a-b`. Bộ đọc bài kiểm có gắn thẻ của `decision-sheet` coi chúng là thẻ thật và đỏ. Ba chuỗi nay dựng từ hằng
  `TAG`, nên tệp không còn chứa thẻ nào mà bài kiểm vẫn chạy trên đúng các chuỗi ấy. Plugin đã ghi giới hạn này là
  `decision-sheet-reads-tags-in-test-data`.
- **Lý do miễn trong bài kiểm bản sao nông:** `tests/ci-ban-sao-nong.test.ts` giữ mục miễn cho `owner-calls.mjs`, chỉ đổi
  lý do cho đúng hiện trạng: ở bản sao nông nó tự lấy `main` từ `origin`.

## Đã thấy trước khi làm (bản chạy thử)

- Trên một bản sao tạm của nhánh, `upgrade` viết 3 tệp, cổng báo «19 decisions held by 27 checks, each seen failing on a
  changed copy» sau khi thêm hai hàng và sửa chuỗi mẫu.
- `make check` trên nhánh: thoát 0, 2460 bài đạt, 2 bỏ qua.
- `bash db/scripts/ci-thu.sh` trên `8d64f79c`: «ci-thu: xanh 21.1 phút · check xanh · pha bo-phien do · pha vai-chu do ·
  pha may-chu-chu do».
- **Trong `make check`, hai hàng không phải tự lấy `main`.** Cổng chứng minh màn (`tools/proof_gate/legacy.py`) chạy trong
  vitest, trước cổng design-assembly. Gặp bản sao nông, nó chạy `git fetch --unshallow origin`, lệnh ấy mang về cả
  `origin/main`. Hai hàng vẫn so với `origin/main`, chỉ là không in lời «fetched». Đường lấy lịch sử của 0.7.1 chỉ chạy
  khi cổng design-assembly chạy một mình, vì thế hồ sơ đo riêng ca ấy.
- `make design-assembly` chạy riêng trên bản sao nông: thoát 0, hai lời «decision-sheet, debt: a shallow checkout: main
  and the history back to where this branch left it were fetched from origin» và cùng lời ấy cho `owner-calls`. Cùng bản
  sao với `owner-calls.mjs` của 0.7.0: thoát 2, hai hàng báo «no main branch to compare with».
- Thêm `design/patterns/trang-moi.md` vào bản sao nông: `owner-calls` đỏ với «pattern:trang-moi: a new kind of screen
  (trang-moi) is the owner's call». Thêm một bài kiểm gắn thẻ `decision:khong-co-hang`: `decision-sheet` đỏ với «the
  ledger has no row for it».

## Đo thế nào

Mọi phép đo của hồ sơ nằm ở `rang/`, chạy qua lệnh khai trong `_acceptance/config.yaml`. Dữ liệu chung nằm ở
`rang/matrix.mjs`: mã commit, mã cây, các dòng ghim. Mỗi phép đo có cặp hai chiều, xanh trên vật lành và đỏ với thông
điệp ghim trên bản phá.

- **Bản sao nông** dựng như `db/scripts/ci-thu.sh`: kho mới, lấy đúng một commit, `node_modules` là bản sao APFS
  (`cp -c`), không cài gì. Mỗi ca một bản sao mới, vì lần chạy đầu đã lấy `main` về. Khác ci-thu ở một điểm: `origin` là
  một kho trung gian chia đối tượng với kho này, có `main` ghim ở `8925e8ff`. Nhánh `main` trên máy nằm ở `ea774a0f`, chậm
  16 commit; lấy nó làm gốc so thì hai hàng so gộp cả commit lên 0.7.0. Mỗi phép đo kiểm chỗ HEAD rời `main` của bản sao
  là `8925e8ff`, và đỏ khi `main` của kho trung gian ghim ở một commit cũ hơn.
- **Bản sao nông, `make check`:** xanh, in dòng 19/27 và số bài. Chiều đỏ: cùng cách dựng trên `8925e8ff`, cổng in 17/25.
- **Bản sao nông, `make design-assembly` riêng:** xanh, in hai lời «fetched». Chiều đỏ: thay `owner-calls.mjs` bằng bản
  của 0.7.0.
- **Hai hàng bắt được trên bản sao nông:** trang mẫu mới làm `owner-calls` đỏ, thẻ không có hàng làm `decision-sheet` đỏ.
  Bản sao không đổi gì thì cả hai xanh.
- **Cây công cụ, dấu phiên bản và bước cổng** bằng bản 0.7.1 mà sổ phát hành của plugin ghi ở `ba3af6b`.
- **Hai hàng và hai khai báo** bằng khai báo của kho design-assembly ở `ba3af6b`, trừ khoá `blueprint`.
- **Chuỗi mẫu:** tệp bài kiểm không còn chứa thẻ, hai bài kiểm xanh. Chiều đỏ: bản của tệp ở `8925e8ff` làm
  `decision-sheet` đỏ, gọi tên ba chuỗi.
- **Danh sách tệp** của commit và của cả nhánh.
- **`ci-thu.sh`** chạy trọn, có Postgres và ba bản phá của chính nó.

## Luật lựa chọn

- Phép đo ở `rang/` của hồ sơ, không thêm gì vào `tools/` hay `mk/`. Đây là cách hồ sơ 0.7.0 đã làm.
- Lượt chấm tìm ra lỗi trong `tools/design-assembly/` thì không sửa tay trên nhánh và không sửa ở kho plugin. Vòng dừng,
  trình chủ kho, và báo phiên đã giao việc như một lỗi của plugin.
- Hồ sơ không sửa hồ sơ đã ký nào. Phép đo cây công cụ của hồ sơ 0.7.0 ghim bản 0.7.0, sẽ đỏ nếu ai ghim lại hồ sơ ấy
  sau khi nhánh này gộp. AC-5 của hồ sơ này thay chỗ nó.
- Bản chép workflow chấm đặt trong `dist/`, vì ESLint và Prettier bỏ qua thư mục ấy (bài học lượt 1 của hồ sơ 0.7.0).

## Nền hạ tầng lúc mở vòng

Xem `_acceptance/upgrade-design-assembly-0-7-1/duong-nen.md`.
