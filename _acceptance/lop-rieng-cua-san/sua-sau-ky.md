# 7e · Sửa sau chữ ký

Chủ kho ký Cổng Bằng chứng ngày 14/11/2026. Khi gộp nhánh chính (1s, 3b, 3e), bộ kiểm màn theo sổ lần đầu đo màn «Tuỳ
chỉnh của sàn» bằng đủ các ca của họ Lưới, và bài trình duyệt của 7e va với cửa đăng nhập theo vai của 9b. Dưới đây là
mọi chỗ đổi sau chữ ký, theo phép của giám sát (G-1411-48, XONG R-1411-10, XONG R-1411-11, XONG R-1411-12).

## Đã đổi, giám sát cho

| Chỗ | Người dùng thấy khác gì | Ảnh | Phép |
| --- | --- | --- | --- |
| Tiêu đề lớn của màn là «Tuỳ chỉnh của sàn» (lấy từ bảng nhãn); tên phần ở khung vùng và cột thứ hai (`src/modules/company-config/ui/layer-screen.tsx`) | Có: trước là tên phần («Trường riêng») | `sua-sau-ky/tieu-de-truoc-1440.png`, `tieu-de-sau-1440.png`, cùng hai ảnh 360 | XONG R-1411-10 (A) |
| Trạng thái trống có nút «Tải lại» như Bảng hàng (`layer-screen.tsx`, `ui/copy.ts`) | Có: trước chỉ có câu | `sua-sau-ky/trong-truoc-1440.png`, `trong-sau-1440.png`, cùng hai ảnh 360 | XONG R-1411-11 (3) |
| Màn nhận `?state=` như Bảng hàng, chỉ ngoài bản chạy thật; «Thử lại» và «Tải lại» xoá trạng thái giả (`layer-screen.tsx`, `ui/copy.ts`, `src/app/(app)/tuy-chinh-san/page.tsx`) | Không | — | G-1411-48 (2), XONG R-1411-10 |
| Sàn thử của bộ kiểm màn có ba nhãn riêng, một nhãn dài 40 ký tự (`tests/e2e-db/setup.ts`) | Không (dữ liệu thử) | — | XONG R-1411-10 (B) |
| Bài trình duyệt của 7e dựng sàn A, B riêng, chỉ dùng hàm đăng nhập chung (`tests/e2e-db/lop-rieng.spec.ts`) | Không | — | G-1411-48 (1) |

Ba nhãn của sàn thử đổi tiêu đề ba cột (Xác nhận lúc, Phòng ngủ, Diện tích) trên Bảng hàng của sàn thử ấy; không thêm
cột nào.

## Chờ chủ kho phê — đổi luật công cụ (lối A của XONG R-1411-12)

Vì sao: bộ khung vùng lưới chỉ mở đúng đường của màn trong sổ màn (`tools/e2e_templates/suite.ts`, dòng gọi
`gridSuite(screen.id, screen.route, base)`). Màn «Tuỳ chỉnh của sàn» mở vào phần «Nhãn riêng» (chủ kho đã duyệt):
cột đầu là tên khái niệm chuẩn, không có chữ số, chữ riêng dài nhất 40 ký tự vừa ô ở khổ rộng. Hai ca «lọc đầu cột» (bản
2e) và «chữ dài» ở 1024, 1440 vì thế không có gì để đo trên phần này, dù có dữ liệu. Phần «Trường riêng» đo được cả hai.

Đề xuất, chưa dựng:

1. **Khoá mới trong `design/screens.yaml`:** `vao_vung` (tuỳ chọn, chỉ cho màn họ `grid`) — đường mà bộ khung vùng lưới
   mở vào, cùng gốc với `route` của màn. Màn 7e khai `vao_vung: /tuy-chinh-san?phan=truong`. Màn không khai giữ nguyên
   như hôm nay.
2. **Đúng một chỗ đọc:** dòng gọi `gridSuite` trong `tools/e2e_templates/suite.ts` đổi đối số đường thành
   `screen.vao_vung ?? screen.route`. Các ca khung (tiêu đề, cuộn ngang, lỗi trình duyệt, trợ năng) vẫn mở `route`.
   Bộ đọc sổ màn (`tools/e2e_templates/bridge` hay chỗ tương đương đang đọc `route`) thêm trường này, không đổi trường
   khác.
3. **Bài tự kiểm sẽ thêm** (trong `tools/e2e_templates/e2e-templates.test.ts`, trên sổ màn giả như các ca hiện có):
   - màn không khai `vao_vung` → danh sách ca vùng y như trước (đối chứng);
   - màn khai `vao_vung` cùng gốc `route` → ca vùng mở đúng đường ấy;
   - pha: khai `vao_vung` không bắt đầu bằng `route` của màn → đỏ với câu ghim `<màn>: vao_vung ngoai man`;
   - pha: khai `vao_vung` ở màn không thuộc họ `grid` → đỏ với câu ghim `<màn>: vao_vung chi cho ho grid`.
4. **Dữ liệu thử cho phần «Trường riêng»:** ca vùng chạy bằng phiên thử chung của bộ khung, nên dữ liệu phải nằm ở sàn
   thử chung (`tests/e2e-db/setup.ts`). Trường riêng đang dùng nào cũng thành một cột trên Bảng hàng của sàn ấy, nên
   **không có lối nào thêm trường mà tránh được cột thêm trên Bảng hàng của sàn thử chung**. Lối tránh duy nhất là
   không dùng trường riêng: thay `vao_vung` bằng phần khác không chạm Bảng hàng — `/tuy-chinh-san?phan=mau` (mẫu nhập)
   với ba mẫu thử tên có chữ số («Sheet 2024», «Sheet 2025», «Mẫu tháng»: «lọc đầu cột» tìm được «202» khớp hai dòng)
   và một mẫu có tên dài; nhưng tên mẫu tối đa 60 ký tự, ở 1440 hai cột vẫn có thể vừa nên «chữ dài» chưa chắc đo được.
   R khuyên: `vao_vung` vào «Trường riêng» với ba trường thử (hai tên có chữ số, một trường «chọn một» khoảng 25 lựa
   chọn để ô «Lựa chọn» bị cắt thật ở 1440), và G soát trước bài «vừa 8 cột» của hàng nào dùng sàn thử chung; nếu có
   thì dùng lối «Mẫu nhập» và chấp nhận rủi ro «chữ dài» ở khổ rộng.
