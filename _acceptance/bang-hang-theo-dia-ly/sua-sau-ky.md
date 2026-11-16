# 2d · Sửa sau chữ ký

Chủ kho đã ký Cổng Bằng chứng của hàng 2d và hàng đã vào nhánh chính. Sau đó bài «E8 a place keeps the other filters» ở
khổ 1440 đỏ chập chờn trên CI (đợi 3 dòng, nhận 10). Dãy V đo lại và kết luận đây là lỗi sản phẩm có sẵn trên nhánh
chính (V-1611-10). Giám sát mở việc phụ VP5 và cho lối sửa dưới đây (G-1611-52, G-1611-53, G-1611-56).

## Việc phụ VP5 (Bấm nơi sớm làm mất lọc), 16/11/2026

Lỗi chạm AC-5. Bấm một nơi ở cột thứ hai trước khi màn Bảng hàng nhận trang thì trình duyệt mở địa chỉ riêng của mục
(`/inventory?vung=…`), nên các lọc khác của địa chỉ đang mở (ví dụ lọc Trạng thái «Đang bán») bị mất. Màn chỉ tự xử lý
cú bấm khi trang đã chạy và vùng bảng đã báo góc nhìn. Đã dựng lại tại máy bằng cách chặn script: bảng ra 10 dòng thay
vì 3.

| Chỗ | Người dùng thấy khác gì | Bài kiểm | Phép |
| --- | --- | --- | --- |
| Địa chỉ của mục nơi mang các tham số của địa chỉ đang mở, trừ nơi, toà và dự án của ô tìm kiếm, và góc nhìn đã lưu (`src/modules/listings/ui/geo-tree.ts`; trường `keepAddress` và hàm `linkHref` ở `src/components/templates/nav-items.ts`; cột thứ hai vẽ địa chỉ ấy ở `src/components/templates/app-shell/second-column.tsx`) | Có, đúng điều AC-5 đòi: bấm một nơi trước hay sau khi trang nhận xong đều giữ các lọc khác. Mở một nơi khi đang ở góc nhìn đã lưu vẫn rời góc nhìn, như trước. Các mục khác của cột thứ hai («Tất cả hàng», mục trạng thái, góc nhìn đã lưu) không đổi địa chỉ | `src/modules/listings/ui/geo-tree.test.ts` «a place's address (VP5)» (bốn ca, có ca phá «mat loc khac»); `tests/e2e-db/dia-ly.spec.ts` «E8 a press before the page comes alive keeps the other filters» (chặn script rồi bấm S1.03, có ca phá). Bỏ phần sửa thì cả hai đỏ «mat loc khac». Ca E8 ở khổ 1440 chạy lặp 30 lần tại máy, không lần nào đỏ | G-1611-52, G-1611-53 |
| `tests/e2e-db/dia-ly.spec.ts`: E8 bỏ dòng chú thích «chờ trang chạy, vì bấm sớm thì mất lọc» | Không | Như trên | G-1611-52 |

Hồ sơ được ghim lại trên bản có thay đổi này. Hồ sơ `upgrade-design-assembly-tool` cũng ghim các tệp mã ấy nhưng không
được ghim lại; lý do ở `_acceptance/upgrade-design-assembly-tool/sua-sau-ky.md` (H-1611-9).
