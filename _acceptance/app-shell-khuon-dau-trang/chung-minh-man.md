# Chứng minh màn — app-shell-khuon-dau-trang

Hợp đồng không khai màn sản phẩm (`screens: []`): vòng này đổi App Shell và khuôn đầu trang bọc mọi màn nội bộ, không
dựng màn nào. Tệp này giữ bảng Khối cho hai tệp thành phần mới của vòng (quyết định 0023, hàng 1q). Ứng viên ReUI chụp
từ trang xem trước công khai của ReUI ngày 17/11/2026 (MCP ReUI trong phiên báo thiếu đăng nhập), đọc bằng
`node tools/reui_catalog/tra.mjs` trên danh mục ghim ngày 2026-11-11.

## Màn app-shell

### Khối

| Khối         | Bậc       | Đã tra                                                                                       | Ứng viên gần nhất                          | Vì sao không dùng                                                                                                                       | Cách                                                                 |
| ------------ | --------- | -------------------------------------------------------------------------------------------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| PageHeader   | trong-kho |                                                                                              |                                            |                                                                                                                                         |                                                                      |
| PlaceCrumb   | ve-tay    | `tools/reui_catalog` «breadcrumb page header», «app shell» (khối loại block)                  | app-shell-16, app-shell-36, app-shell-30   | Đường dẫn của ReUI viết cứng theo trang mẫu; kho cần tên nơi đang mở đọc từ chính cột thứ hai đã có (một nguồn cho cột và đầu trang)        | ghép ChevronRight của lucide vào `PageHeader` có sẵn, đọc mục đang mở của cột thứ hai |
| RailProvider | ve-tay    | `tools/reui_catalog` «sidebar provider collapsible icon rail» (khối loại block)               | app-shell-8, app-shell-14, app-shell-16    | Các khối ReUI cho dải mở rộng thành cột có chữ bằng nút ở thanh trên; chủ kho bảo nút ấy «trùng với thanh gập bên dưới», dải phải đứng yên | bọc SidebarProvider của shadcn với trạng thái mở cố định trên máy tính |

### Ứng viên ReUI

| Cho          | Ứng viên     | Ảnh                                    | Chọn |
| ------------ | ------------ | -------------------------------------- | ---- |
| PlaceCrumb   | app-shell-16 | evidence/ung-vien/app-shell-16-1440.png |      |
| PlaceCrumb   | app-shell-36 | evidence/ung-vien/app-shell-36-1440.png |      |
| PlaceCrumb   | app-shell-30 | evidence/ung-vien/app-shell-30-1440.png |      |
| RailProvider | app-shell-8  | evidence/ung-vien/app-shell-8-1440.png  |      |
| RailProvider | app-shell-14 | evidence/ung-vien/app-shell-14-1440.png |      |
