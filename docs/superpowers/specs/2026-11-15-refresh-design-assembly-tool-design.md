# Chép lại công cụ design-assembly từ plugin

## Vì sao

Hồ sơ nghiệm thu `adopt-design-assembly` (PR #58) tìm ra sổ linh kiện ghi trùng chín linh kiện bộ lọc: mỗi linh kiện một
mục đủ thông tin ở tệp định nghĩa nó, và một mục rỗng ở tệp gom xuất lại nó. Người hay máy tra một linh kiện như vậy
nhận hai câu trả lời. Chủ kho chọn «mở hợp đồng mới» cho mục đó ở Cổng Bằng chứng ngày 2026-11-15. Plugin
design-assembly đã sửa bộ đọc linh kiện (PR 2 của kho đó); việc này chép bản đã sửa sang đây.

## Thay đổi, đã làm trên nhánh `chore/refresh-design-assembly-tool`

1. **Chép cả thư mục công cụ** `tools/design-assembly/` từ plugin ở commit `feea58d`: năm tệp khác bản đang có
   (`components.mjs` là bản sửa ghi trùng; `check.mjs`, `contract.mjs`, `screen-ledger.mjs` và tệp mới
   `screen-actions.mjs` là phần «sổ màn nối với mô hình nghiệp vụ» của plugin). Sau khi chép, 27 tệp của thư mục
   giống bản của plugin từng byte.
2. **Sinh lại sổ linh kiện** bằng công cụ mới: 298 mục còn 289, mỗi tên một mục.
3. Một dòng ở nhật ký wiki.

Không đổi sổ quyết định, dữ liệu lệnh kiểm, sổ màn hay sổ token. Lệnh kiểm design-assembly vẫn giữ 17 quyết định bằng
20 lệnh kiểm.

## Lựa chọn

- **Chép cả thư mục, không chỉ tệp sửa ghi trùng.** Chép một tệp thì công cụ ở đây thành bản trộn hai phiên bản của
  plugin, và lần so với plugin sau này không còn nói được «giống» hay «khác». Phần đọc sổ màn nối với mô hình nghiệp vụ
  đi kèm không chạy ở kho này: nó chỉ chạy khi dữ liệu lệnh kiểm khai một phép kiểm loại `screen-actions`, và kho này
  chưa khai. Đây là lựa chọn chủ kho có thể bác (câu hỏi ở Cổng Phạm vi).
- **«Khớp plugin» đo bằng mã cây git ghim sẵn.** CI và máy khác không có kho plugin để so trực tiếp. Git đặt cho một
  thư mục một mã tính từ tên và nội dung mọi tệp trong nó; phép đo tính mã ấy từ thư mục công cụ ở đây và so với mã mà
  chính kho plugin cho thư mục công cụ của nó ở commit `feea58d`. Ai có kho plugin kiểm lại giá trị ghim bằng một lệnh:
  `git rev-parse feea58d:plugins/design-assembly/templates/tools/design-assembly`.
- **«Không mất linh kiện nào» đo bằng cách chạy công cụ cũ và mới trên cùng mã nguồn.** Công cụ cũ lấy từ commit nhánh
  được cắt ra (`0861fdc`), chạy trên một bản dựng tạm; hai bên phải cho cùng một bộ tên, và công cụ cũ phải được thấy
  ghi trùng đúng chín tên ấy. So như vậy không vỡ khi `main` thêm hay bớt linh kiện về sau.

## Phép đo mới của hồ sơ

Ở `_acceptance/refresh-design-assembly-tool/rang/`, chạy qua lệnh khai trong `_acceptance/config.yaml`:

- `register-names-once.mjs` — mỗi tên một mục; chín linh kiện bộ lọc nằm ở tệp định nghĩa; công cụ mới không làm mất
  hay thêm tên nào so với công cụ cũ;
- `tool-tree.mjs` — thư mục công cụ có đúng mã cây git của bản plugin;
- `only-register-changed.mjs` — trong các sổ thiết kế, nhánh chỉ đổi sổ linh kiện; dữ liệu lệnh kiểm không khai phép
  kiểm `screen-actions`;
- `measures-two-way.mjs` — mỗi phép đo trên xanh trên kho, đỏ với thông điệp ghim trên bản bị phá; kèm lệnh kiểm sổ
  của chính công cụ mới, đỏ khi sổ thiếu một mục.

## Không làm

- Không bật phép kiểm «sổ màn nối với mô hình nghiệp vụ» ở kho này: đó là một việc riêng, cần kho khai màn hiện gì và
  mở bằng thao tác nào.
- Không sửa các giới hạn đã ghi ở hồ sơ `adopt-design-assembly`.
- Không đổi giao diện, mã sản phẩm, mô hình dữ liệu hay luật sản phẩm.

## Giới hạn biết trước

Mã cây ghim theo một phiên bản của plugin. Lần chép công cụ sau sẽ làm phép đo `tool-tree.mjs` của hồ sơ này đỏ khi
hồ sơ bị kéo ra ghim lại; lúc đó phép đo này được thay bằng phép đo của hồ sơ mới.

Sau khi gộp, không phép kiểm thường trực nào giữ thư mục công cụ còn khớp plugin: các phép đo của hồ sơ không chạy trong
`make check`. Đây là một câu hỏi cho chủ kho ở Cổng Phạm vi.
