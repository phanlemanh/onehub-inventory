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

## Đổi công cụ kiểm khung, chủ kho cho

Ba chỗ đổi công cụ, mỗi chỗ có chữ cho của chủ kho. Người dùng không thấy khác gì: đây là cách bộ kiểm mở và đo màn.

| Chỗ | Chữ cho của chủ kho (nguyên văn) |
| --- | --- |
| Khoá tuỳ chọn `vao_vung` trong `design/screens.yaml`, chỉ cho màn họ `grid`, cùng gốc với `route`. Đúng một chỗ đọc ở `tools/e2e_templates/suite.ts`; bộ đọc sổ màn (`tools/e2e_templates/register.py`, `register.ts`) thêm đúng trường này. Màn «Tuỳ chỉnh của sàn» khai `vao_vung: /tuy-chinh-san?phan=can-cho`. Sàn thử chung có ba căn chờ khớp (`tests/e2e-db/setup.ts`): hai mã ngắn có chữ số, một mã 80 ký tự. Không thêm cột nào vào Bảng hàng. | «7e công cụ kiểm: cho» (câu h-20261114T065340Z-56) |
| Bộ chạy ghép trạng thái giả vào đường đã có `?` bằng `&` (`withQuery` trong `tools/e2e_templates/runner.ts`). Màn không khai `vao_vung` vẫn mở đường như cũ. | «7e hai chỗ công cụ kiểm: cho» (câu h-20261114T134021Z-63) |
| Ca «chữ dài» ở màn `tuy-chinh-san`, khổ 1440, là phép ngược có đo (`LONGEST_FITS`, `longestProblem` trong `tools/e2e_templates/recipes.ts`): ô có chữ đúng 80 ký tự phải hiện trọn. Sau đó ô bị thu hẹp để phần bàn phím và đọc khi focus vẫn chạy như cũ. Trần ký tự tăng hay cột hẹp lại làm chữ bị cắt thì phép đỏ (`chu-dai: tuy-chinh-san @1440 chu 80 ky tu bi cat — go dong LONGEST_FITS`), và ca thường áp lại. | «7e hai chỗ công cụ kiểm: cho» (câu h-20261114T134021Z-63) |

Bài tự kiểm (`tools/e2e_templates/e2e-templates.test.ts`, mục «lối vào của bộ vùng»): đối chứng, mở đúng đường, hai ca
phá với câu ghim, ghép tham số, và phép ngược với hai câu ghim. Bài chạy thật: khai thêm khổ 1024 thì phép ngược đỏ đúng
câu.

## Đề xuất lúc chờ chủ kho (lối A của XONG R-1411-12, đã dựng theo mục trên)

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

## Kiểm trên giấy: phần nào làm lối vào của bộ khung (G-1411-50)

Căn cứ đọc mã, không chạy bộ đầy đủ:

- **Lọc đầu cột:** cột đầu phải có chuỗi chứa chữ số, khớp ít nhất 2 dòng mà không phải mọi dòng
  (`pickNeedle` trong `tools/e2e_templates/recipes.ts` bản 2e).
- **Chữ dài:** phải có một ô bị cắt. Lưới không có trần bề rộng cột: mỗi cột nới tới hết chữ khi còn chỗ (`spreadSpareCh`,
  `fullWidthCh` trong `src/components/candidate/column-kind.ts`), nên ô chỉ bị cắt khi tổng chữ đầy đủ của các cột rộng
  hơn vùng. Ở 1440 vùng lưới rộng khoảng 1040 px, tức khoảng 110 ký tự; ở 1024 khoảng 65 ký tự (ảnh `evidence/`).

| Phần | Cột hiện trên màn | Lọc đầu cột | Chữ dài ở 1024 | Chữ dài ở 1440 | Thêm cột vào Bảng hàng của sàn thử chung |
| --- | --- | --- | --- | --- | --- |
| Căn chờ khớp | Mã sàn gõ (tối đa 80), Tình trạng | Đạt với ba mã như «A-101», «A-102», «B-201» | Đạt: mã 80 ký tự bị cắt | Không chắc: cột mã còn khoảng 84 ký tự, mã 80 ký tự vừa | Không |
| Từ điển giá trị | Trường, Chữ sàn viết (40), Giá trị chuẩn | Chỉ đạt khi tên trường có chữ số, tức là trường riêng | Đạt khi giá trị dài, tức là lựa chọn của trường riêng | Đạt khi ba cột cùng dài (khoảng 120 ký tự) | Có, vì cần trường riêng |
| Mẫu nhập | Tên mẫu (60), Số cột | Đạt với «Sheet 2024», «Sheet 2025», «Mẫu tháng» | Đạt: tên 60 ký tự bị cắt | Không: 60 ký tự vừa | Không |
| Nhãn riêng (phần mở đầu) | Khái niệm chuẩn, Chữ của sàn (40) | Không: tên khái niệm không có chữ số | Đạt: nhãn 40 ký tự bị cắt (đã đo) | Không: 40 ký tự vừa (đã đo) | Không |

Kết luận:

- **Căn chờ khớp** là phần ít dữ liệu nhất đo được «lọc đầu cột»: ba căn chờ có mã chứa chữ số, không thêm cột nào vào
  Bảng hàng.
- **«Chữ dài» ở 1440** không phần nào đo chắc chắn mà không có trường riêng, vì mọi chữ sàn nhập đều có trần (40, 60,
  80 ký tự) nhỏ hơn bề rộng vùng ở khổ ấy.
  - Với «Căn chờ khớp» thì sát ngưỡng: mã 80 ký tự cần khoảng 83 ký tự bề rộng, cột có khoảng 84.
  - Đo ở 1024 thì đạt, nhưng con số ở 1440 phải chạy thật mới biết.
- **R khuyên:** `vao_vung: /tuy-chinh-san?phan=can-cho`, cùng ba căn chờ cho sàn thử chung: hai mã ngắn có chữ số và
  một mã 80 ký tự.
  - Khi dựng, chạy thật ca «chữ dài» ở 1440 trước.
  - Còn vừa ô thì dừng, báo G: khi ấy chỉ còn lối đổi luật công cụ cho ca «chữ dài».
