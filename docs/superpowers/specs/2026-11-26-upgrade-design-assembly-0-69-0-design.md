# Lên đời công cụ design-assembly từ 0.36.1 lên 0.69.0, chỉ phần máy

Ngày 2026-11-26. Hồ sơ nghiệm thu: `_acceptance/upgrade-design-assembly-0-69-0/`. PR #120, nhánh
`chore/upgrade-design-assembly-0-69-0`, cắt từ `main` ở `1ea13196`. Thay PR #115 (nâng lên 0.36.2, đã đóng).

## Vì sao

- Chủ kho hỏi bản design-assembly mới nhất và cách dùng nó hiệu quả với kho này, rồi chọn «Nâng lên 0.69.0» (2026-11-26).
  Máy đang chạy plugin 0.69.0; kho còn giữ công cụ 0.36.1 từ PR #107, chậm khoảng ba mươi bản.
- Bản mới thêm ba phép kiểm dưới hàng `ledger-shapes`:
  - **choose-first**: cổng đỏ khi một nhánh thêm tệp thành phần mà sổ nhận khối không có dòng nào. Đây là máy giữ luật
    của chủ kho «chọn từ ReUI trước, vẽ tay sau cùng».
  - **taken-down**: cổng đỏ khi mã dùng một khối của nguồn ngoài chưa được nhận vào sổ.
  - **floating-parts**: bài trình duyệt `tests/e2e/floating-parts.spec.ts` mở phần nổi (menu, hộp bật lên) của khối nguồn
    ngoài.
- Lần này **chỉ phần máy**: không nhận quyết định thiết kế mới nào, không đổi hàng sổ hay bảng màu, không trả lời bốn câu
  màu đang chờ chủ kho.

## Thay đổi

Hai commit trên nhánh:

- `7174ab43` (31 tệp):
  - 25 tệp công cụ trong `tools/design-assembly/`: 7 tệp mới, 18 tệp sửa. Thư mục có 51 tệp, mã cây `0f6ddbdf`, đúng mã sổ
    phát hành của plugin ghi cho 0.69.0;
  - `mk/design-assembly.mk`, viết lại bằng mẫu 0.69.0 (mã `a9af3d80`). Dòng `.PHONY` mất đi chỉ là dòng cũ thiếu mục
    `design-exports`: mọi đích cũ còn nguyên, nên `mk/design-role-table.mk` vẫn gọi được `design-derived`;
  - `design/theme.json`, thêm ba phép kiểm mới;
  - `design/tool-stamp.json`, ghi `0.69.0`;
  - `tests/e2e/floating-parts.spec.ts`, bài mới;
  - hai chỗ sửa để cổng của kho xanh với bản mới (mục dưới).
- `78124335`: một dòng nhật ký wiki ở `wiki/log/`.

### Hai chỗ sửa của kho

1. **Lint.** `eslint.config.js` tắt `react-hooks/rules-of-hooks` cho riêng `tools/design-assembly/**`. Công cụ là mã Node
   không có React; `contract.mjs` có hàm `useClashes` nên luật báo nhầm là hook. Không sửa tay tệp công cụ (lần lên đời sau
   viết đè) và không tắt luật ở nơi khác.
2. **Bản sao nông.** `tests/ci-ban-sao-nong.test.ts` cấm mọi bài CI chạy đọc lịch sử git, trừ các tệp ghi trong
   `FALLS_BACK` kèm cách lùi. `choose-first.mjs` đọc tệp ở chỗ nhánh rời `main` (`git show`), qua `branchBase` của
   `owner-calls.mjs`. Hàm này đã có trong danh sách, và trên bản sao nông nó tự lấy `main` từ `origin`. Thêm
   `choose-first.mjs` vào danh sách kèm lý do ấy; AC-5 chứng nó trên một bản sao sâu 1 commit.

## Đã thấy trước khi làm

- Bản xem trước của `upgrade` lần đầu dừng: bản sao `design/screens.yaml` trên máy đã cũ so với `design/screens`. Viết lại
  bằng `make design-derived` (tệp ngoài git) thì bản xem trước báo cổng xanh, không mục sổ nào mất, không quyết định nào
  đổi trạng thái.
- Sau khi nâng: cổng nói `22 decisions held by 33 checks` (trước là 30 phép kiểm), độ xác định 57/69 như trước, 294 linh
  kiện, `make check` 2663 bài đạt, 2 bỏ qua.
- Trên PR, mọi kiểm xanh trừ `gate`: nhánh đổi `tools/**` và `mk/**`, nên cổng trước khi gộp đòi hồ sơ này.

## Cách đo

Theo khuôn hồ sơ `upgrade-design-assembly-0-33-0`: bộ phép đo ở `_acceptance/upgrade-design-assembly-0-69-0/rang/`, ma
trận viết trước ở `rang/matrix.mjs`, mỗi phép đo có cặp hai chiều (`two-way.mjs`, `shallow-two-way.mjs`) với thông điệp ghim.

- Cây công cụ, dấu và bước cổng bằng bản 0.69.0 của plugin trong bộ nhớ đệm trên máy.
- Mọi quyết định giữ trạng thái: công cụ 0.36.1 trên sổ ở chỗ nhánh rời `main`, so với công cụ ở HEAD trên sổ ở HEAD. Công
  cụ cũ không đọc được ba phép kiểm mới của `design/theme.json`, nên mỗi bên đọc sổ của chính nó.
- Bản sao nông: `make design-assembly` xanh; riêng `choose-first`, chạy trước mọi thứ trên bản sao mới, tự lấy `main` và
  đọc được chỗ nhánh rời.
- Hai chỗ sửa của kho: lint có tầm đúng một thư mục; `choose-first` đỏ thật khi thêm tệp thành phần không có dòng nhận khối.

## Ngoài phạm vi

- Hành vi các lệnh của plugin, và sửa kho design-assembly.
- Bốn câu màu đang chờ chủ kho, ba sổ còn thiếu (`/design-assembly:adopt`), sáu quyết định chưa có phép kiểm.
- Ghim ReUI làm nguồn ngoài: `taken-down` và `floating-parts` chưa giữ khối nào cho tới khi có hồ sơ conform.
- Ghim lại hay sửa các hồ sơ đã ký trước.
