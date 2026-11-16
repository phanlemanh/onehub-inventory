# Lên đời design-assembly · Sửa sau chữ ký

## Việc phụ VP5 (Bấm nơi sớm làm mất lọc), 16/11/2026

Việc phụ VP5 sửa một lỗi sản phẩm của hàng 2d (`_acceptance/bang-hang-theo-dia-ly/sua-sau-ky.md`). Nó đổi mã nằm trong
vùng hồ sơ này ghim: `src/components/templates/nav-items.ts`, `nav-menu.tsx`, `app-shell/second-column.tsx`,
`src/modules/listings/ui/geo-tree.ts` và bài của tệp ấy.

| Chỗ | Người dùng thấy khác gì | Bài kiểm | Phép |
| --- | --- | --- | --- |
| Mục nơi của cột thứ hai mang các lọc của địa chỉ đang mở (xem hồ sơ 2d) | Không, với mọi điều hồ sơ này kiểm: công cụ design-assembly và sổ thành phần không đổi | Hồ sơ KHÔNG được ghim lại, vì hai lý do bên dưới | G-1611-53, H-1611-9 |

Vì sao không ghim lại (giám sát phán H-1611-9, rút phán quyết «ghim hai hồ sơ» của G-1611-53):

1. Hồ sơ đã cũ sẵn trên nhánh chính `ecfc16e`, sau khi hàng 1u gộp, trước thay đổi này. Lưới trước gộp so theo
   `--base` nên không tính nó vào thay đổi của VP5.
2. Phép đo «nhánh chỉ đổi tệp của lần lên đời» (`rang/branch-changes.mjs`, nằm dưới E6, E7, E8, E11, E12) chỉ chạy
   được trên nhánh của PR #72. Trên mọi nhánh khác nó đỏ; trên nhánh chính nó xanh. Lượt ghim lại thử ngày 16/11
   (`repin-20261116T112807Z-92230`) đỏ đúng năm eval ấy với lời «changed outside the upgrade and this record», không
   phải vì lỗi của VP5. Giám sát ghi việc này cho hàng siết bộ kiểm lần hai.
