# 2d · Sửa sau chữ ký

Chủ kho đã ký Cổng Bằng chứng của hàng 2d. Dưới đây là mọi chỗ đổi sau chữ ký, mỗi chỗ có phép của giám sát và được chủ
kho soi ở Cổng Bằng chứng của hàng mang nó.

## Hàng 1u (Dọn nợ của bộ kiểm), 16/11/2026

| Chỗ | Người dùng thấy khác gì | Bài kiểm | Phép |
| --- | --- | --- | --- |
| `tests/e2e-db/dia-ly.spec.ts`: hai ca phá («gỡ chân bảng» ở E6, «thu hẹp cột» ở E11) đổi trang qua cửa chung `suaTrang` (`tests/e2e/sua-trang.ts`) thay vì gọi thẳng; cửa chung chờ trang gắn xong rồi mới đổi | Không. Bài vẫn đổi đúng chỗ ấy, cùng cách, và vẫn chờ cùng thông báo lỗi; chỉ thêm bước chờ trang gắn xong trước khi đổi | Bài của 2d giữ nguyên ý; bộ quét `tests/sua-trang.test.ts` đỏ nếu một trong hai chỗ quay về gọi thẳng. Hồ sơ 2d được ghim lại trên bản có thay đổi này trước khi PR #71 gộp | G-1611-19; trình ở Cổng Bằng chứng hàng 1u, mục «Bài của hàng khác đã đổi» |

## Chấm lại E14 ở lượt ghim lại cuối của hàng 1u, 16/11/2026

Nhánh của hàng 1u đã gộp nhánh chính `7ea2f53` (hàng 19 Thuế phí, hàng 5 Dán từ Excel, PR #72, #73) rồi ghim lại hồ sơ này
trên bản `038f075` (lượt `repin-20261116T070937Z-41988`, 14/14 mục máy đạt). E14 là mục giao diện, lượt máy không chứng
được, nên được chấm lại một lần bằng người chấm giao diện ngữ cảnh sạch (G-1611-26).

- **Kết quả: ĐẠT.** Tám khung ở `_acceptance/don-no-bo-kiem/evidence/2d-E14/` (kèm `facts.json`), chụp trên bản `038f075`
  bằng một lượt trình duyệt tạm, không commit, đăng nhập như một Đầu chủ của một sàn mẫu mới.
- Cột thứ hai vẫn đúng như lúc ký: mỗi dự án một nhóm, không số đếm, «The Sapphire 1» là mục sáng duy nhất, chân bảng
  «36 / 60 dòng»; ở 360 chọn «[MAU] Toà E1» thì ngăn đóng và chân bảng «12 / 60 dòng»; ô lọc Dự án và Toà giữ trọn tên
  khi rê chuột. Màn Đã gửi và Tuỳ chỉnh của sàn không có cây nơi, mục sáng như ảnh trước.
- Khác với lúc ký, đều do hàng khác đã ký: Tuỳ chỉnh của sàn có thêm mục «Thuế phí» (hàng 19); Bảng hàng có thêm cột «Về
  tay» (hàng 19) nên ở 1440 cột «Xác nhận lúc» ra ngoài mép phải và bảng cuộn ngang; thẻ căn ở điện thoại có thêm dòng Về
  tay.
