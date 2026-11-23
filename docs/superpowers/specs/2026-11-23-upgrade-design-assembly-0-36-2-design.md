# Lên đời công cụ design-assembly từ 0.36.1 lên 0.36.2 và chạy lại tiếp nhận

Ngày 2026-11-23. Hồ sơ nghiệm thu: `_acceptance/upgrade-design-assembly-0-36-2/`. Nhánh
`chore/upgrade-design-assembly-0-36-2`, cắt từ `main` ở `25f84709` (PR #111 đã gộp).

## Vì sao

- PR #111 tiếp nhận các kiểm tra sẵn có của kho và ship với một giới hạn đã biết: trang luật cho tác tử
  (`.claude/rules/design-assembly.md`) ghi «Running text is set in `undefined`» và dẫn tới `design/blueprint.json`, tệp
  không có trong kho (Hỏi-1 của hồ sơ `design-assembly-adopt-checks`).
- Bản sửa nằm ở plugin design-assembly 0.36.2 (PR phanlemanh/design-assembly#101, merge `bdf2bcc`): dòng «Type» gọi tên
  thứ nạp phông (bộ nạp phông của Next.js ở `src/app/layout.tsx`) và dẫn tới bảng kiểu. Cùng bản, hai bộ đọc phông ghi thêm
  cách nạp (`via`), tệp (`file`) và tên gói (`specifier`).
- Chủ kho bảo «lên đời plugin trong Inventory và chạy lại tiếp nhận», làm thành việc riêng ngay sau khi PR #111 gộp.

## Thay đổi

Hai commit:

- `b5f48f65` — lệnh `upgrade` của plugin ở `~/dev/design-assembly` (bản 0.36.2), xem trước rồi chạy thật: hai tệp công cụ
  (`adapters/css-fonts.mjs`, `adapters/nextjs-build.mjs`), dấu phiên bản `design/tool-stamp.json` (0.36.2, cây
  `cc732f56`), một dòng nhật ký wiki. Bản xem trước: không mục sổ máy viết nào đổi, không quyết định nào đổi trạng thái,
  cổng xanh. Bước cổng `mk/design-assembly.mk` đã bằng mẫu 0.36.2, không viết lại.
- `326326dc` — trang luật cho tác tử, đúng một dòng «Type» đổi.

Plugin đã cài trên máy vẫn là 0.36.1; lệnh chạy từ mã nguồn plugin ở `bdf2bcc` (plugin.json ghi 0.36.2).

## Chạy lại tiếp nhận: không viết gì

`adopt` 0.36.2 trên nhánh (xem trước) cho: 0 dòng thêm, không tệp nào để viết, một câu hỏi cho người — dòng nguồn phông
`--font-sans` (Inter, nạp từ Google bằng bộ nạp phông). Câu ấy PR #111 đã gạt ra bằng dòng sổ `descope`
(`d-20261123T014845Z-8`): công cụ không viết dòng cho phông nạp từ ngoài kho, giấy phép là lời chủ kho. Không có câu
hỏi mới.

`adopt` chỉ viết trang luật khi nó thêm được một dòng do công cụ giữ (`scripts/adopt.mjs`, nhánh `tooled.length > 0`).
Chạy lại trên kho không thêm dòng nào, nên trang luật **không** được viết lại và dòng sai vẫn còn.

## Cách đưa dòng «Type» đúng vào nhánh (Hỏi-1)

Máy chọn: chạy `adopt` 0.36.2 trên một bản chép của kho đã bỏ dòng `typeface` (hàng sổ và mục kiểm tra), để công cụ tiếp
nhận lại đúng dòng ấy và viết trang luật; lấy trang ấy về nhánh. Trên bản chép, sổ quyết định và `design/theme.json` trở
lại y như trên kho (từng byte), và trang chỉ khác bản cũ ở dòng «Type»:

> Running text is set in the typeface the font loader in src/app/layout.tsx sets as `--font-sans` and headings in
> `var(--font-sans)`, as `src/app/globals.css` sets them today, adopted as found: the gate holds `--font-heading` to it.

Vì đây lệch chữ của lời giao («chạy lại tiếp nhận»), nó lên thẻ Cổng Phạm vi thành Hỏi-1. Lối khác: giữ trang cũ, sửa
plugin để `adopt` viết lại trang luật mỗi lần chạy (0.36.3, kho design-assembly), rồi lên đời lần nữa — thêm một vòng ở
hai kho, dòng sai còn trên `main` tới lúc ấy.

## Hồ sơ đã ký bị đổi tiền đề

Phép đo E7 của hồ sơ `design-assembly-adopt-checks` (`rang/kiem.mjs rules`) ghim đúng một dòng sai đã biết. Trên trang
mới nó đỏ với `rules: 0 lines say undefined, the known defect is one`. Hồ sơ ấy đã ký (`machine-cleared`); không sửa tệp
nào của nó. AC-4 của hồ sơ này nói thẳng tiền đề đổi: phép đo E7 phải đỏ với đúng dòng ấy và không dòng nào khác (nghĩa
là hai luật có số của trang — cỡ chạm 24px, phông tiêu đề — vẫn khớp dữ liệu kiểm tra). Ai ghim lại hồ sơ cũ sẽ gặp E7
đỏ; AC-4 thay chỗ nó.

## Phép đo

Mọi phép đo ở `_acceptance/upgrade-design-assembly-0-36-2/rang/` (`kiem.mjs`, một chế độ cho mỗi tiêu chí; `hai-chieu.mjs`
cho cặp hai chiều). Gốc kho suy từ vị trí tệp đo; dòng xanh in mã HEAD đã đo. Plugin được đọc từ kho nguồn ở commit ghim
(`git archive bdf2bcc`), không đọc bản cài trên máy (bản cài là 0.36.1). Bản chép dùng để phá là bản sao chia đối tượng
với kho, không bao giờ ghi vào kho.

## Ngoài phạm vi

- Sửa plugin (để `adopt` viết lại trang luật khi không thêm dòng) — việc của kho design-assembly.
- Dòng nguồn phông Inter và giấy phép; 16 loại phần tử chưa đo cỡ chạm; ba luật lint bắt hẹp — giữ như PR #111 đã gạt.
- Sửa tệp của hồ sơ đã ký `design-assembly-adopt-checks`.
- Mọi thay đổi giao diện, mã sản phẩm, mô hình dữ liệu hay luật sản phẩm.
