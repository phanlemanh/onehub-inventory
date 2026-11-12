# Bản đồ sản phẩm

> Bản đồ vẽ lại từ hồ sơ của xưởng mỗi lần một người ký một cổng — đừng sửa tay.
> (đọc từ thư mục `_acceptance/` và `.out-of-scope/`)
> Lộ trình: [LO-TRINH.html](LO-TRINH.html)

```mermaid
flowchart TD
  A["Đang cân nhắc cơ hội<br/>4 việc"] --> GD{"Cổng Đáng"}
  GD --> B["Sắp mở vòng<br/>8 việc"]
  GD --> XL["Xếp lại sau<br/>chưa có"]
  GD --> DB["Đã bác từ khám phá<br/>chưa có"]
  B --> CD["Chờ duyệt phạm vi<br/>chưa có"] --> GP{"Cổng Phạm vi"}
  GP --> DL["Đang làm<br/>1 việc"] --> GB{"Cổng Bằng chứng"}
  GB --> DG["Đã giao<br/>1 việc"]
  GB --> CN["Chờ phiên nghiệm thu<br/>25 việc"] --> GG{"Cổng Giá trị"}
  GG --> NT["Đã nghiệm thu giá trị<br/>chưa có"]
```

> **Bốn cổng người** — mỗi cổng là một câu hỏi chỉ người trả lời được:
> **Cổng Đáng** việc này có đáng làm không · **Cổng Phạm vi** bộ tiêu chí
> đã đủ và đúng chưa · **Cổng Bằng chứng** đã làm đúng thứ đã hứa chưa ·
> **Cổng Giá trị** thứ đã giao có ăn thua không.

## Đang cân nhắc cơ hội

- Đầu chủ và Đầu khách mở Bảng hàng trên điện thoại thấy danh sách thẻ căn và chạm thẻ để mở hồ sơ căn (`bang-hang-the-dien-thoai`)
- Cổng chứng minh màn bắt được khối mới mà vòng dựng không kê ra trong hồ sơ (`cong-bat-khoi-khong-ke`)
- Nhân viên sàn đăng nhập bằng mã email trên màn đăng nhập chọn từ ReUI Pro, luồng và luật an toàn giữ nguyên (`dang-nhap-chon-tu-reui`)
- Quản trị sàn xem danh sách người và mời người trên màn Thành viên chọn từ kho và ReUI Pro, quyền và luật mời giữ nguyên (`thanh-vien-chon-tu-reui`)

## Sắp mở vòng

- Đầu chủ đi Bảng hàng theo địa lý: chọn dự án, phân khu, toà ở cột thứ hai của App Shell và lọc các cột địa lý trên bảng (`bang-hang-theo-dia-ly`)
- Bộ kiểm chung sinh từ sổ màn chạy được trên màn cần đăng nhập và không lỡ nhịp khi máy chậm (`bo-kiem-chung-khi-dang-nhap`)
- Bộ kiểm cách ly bắt cả dạng xem chỉ cấp quyền ghi, sửa hay xoá cho vai của ứng dụng mà không chạy theo quyền người đọc (`cach-ly-dang-xem-chi-ghi`)
- CI chạy các bài trình duyệt có đăng nhập trên một Postgres riêng của lượt, để bộ kiểm chung đo được màn cần đăng nhập ngay trên CI (`ci-co-postgres`)
- Đầu khách mở Đã gửi và thấy các link đã gửi trên cùng Lưới với Bảng hàng (`da-gui-tren-luoi`)
- Đầu chủ lưu cách xem Bảng hàng (lọc, sắp xếp, nhóm, cột đang hiện) thành một mục ở cột thứ hai của App Shell và mở lại đúng cách xem ấy (`luu-goc-nhin-cot-hai`)
- Đầu chủ ghim ngăn chi tiết thành một cột cạnh bảng khi làm lâu trên một căn, bỏ ghim thì ngăn nổi lại (`ngan-chi-tiet-ghim-thanh-cot`)
- Ứng dụng nối cơ sở dữ liệu bằng một vai đăng nhập không phải chủ bảng, chỉ là thành viên của vai API, để mã trong cửa có đổi vai cũng không về được vai chủ (`ung-dung-noi-bang-vai-khong-chu`)

## Đang làm

- Đầu chủ bấm một căn và thấy hồ sơ căn cạnh bảng, trên điện thoại thấy thẻ căn (`ho-so-can`)

## Đã giao — chờ phiên nghiệm thu

- Nhân viên sàn làm việc trong một App Shell chọn từ ReUI Pro, giữ đủ thanh bên theo vai, băng báo và các trạng thái toàn trang đang có (`app-shell-chon-tu-reui`)
- Đầu chủ mở Bảng hàng và thấy các căn của sàn trên Lưới, đủ trạng thái màn, ở bốn khổ màn hình (`bang-hang-ban-doc`)
- Đầu chủ dùng Bảng hàng bằng tay như Sheet: đi giữa các ô bằng phím mũi tên, bôi một vùng ô rồi chép sang Zalo hay Excel, bấm tiêu đề để sắp xếp, lọc từng cột, nhóm dòng theo toà, ẩn hiện cột (`bang-hang-dung-tay-nhu-sheet`)
- Mọi thao tác đọc và ghi đều được quyết định từ một bảng quyền theo vai, phạm vi và trạng thái (`bang-quyen-theo-vai`)
- Mỗi màn trong sổ có sẵn bộ bài kiểm trạng thái sinh ra từ sổ, kèm bài phá thử chứng minh bài kiểm đỏ được (`bo-bai-kiem-tu-so-man`)
- Mỗi sàn chỉ đọc và ghi được dữ liệu của mình, mọi truy vấn đi qua một cửa (`cach-ly-moi-san`)
- Bộ kiểm cách ly giữa các sàn bắt thêm tám kẽ hở đã nêu ở hàng 7 trước khi nối dữ liệu thật (`cach-ly-truoc-du-lieu-that`)
- Vòng dựng màn phải chứng minh giải được và đồng nhất với màn mẫu trước khi trình, rời khỏi thang Trong kho, ReUI, Vẽ tay thì phải nêu căn cứ (`cong-chung-minh-man-mau`)
- Nhân viên sàn nhập mã gửi qua email và vào đúng sàn của mình (`dang-nhap-ma-email`)
- Danh mục căn dùng chung lưu cùng cách với onehub-invest: có cấp phân khu dưới dự án, tầng lưu theo RESO, toà · trục · căn có khoá riêng, mã căn gốc giữ làm bí danh (`danh-muc-can-nhu-onehub-invest`)
- Agent tra được danh mục ReUI Pro ngay trong kho theo phiên bản đã ghim, không phụ thuộc kết nối ngoài (`danh-muc-reui`)
- Ghim lại danh mục ReUI từ nguồn đã đổi cách ghi tiêu đề mục thì máy dừng và gọi tên nhóm bị mất thay vì lặng lẽ bỏ cả nhóm, và phép chặn mã hay khoá phủ đủ các dạng đã kê (`danh-muc-reui-doc-chac`)
- `du-lieu-mau`
- Hồ sơ cạnh bảng, lọc rỗng, chờ tải, lỗi, lưu và hoàn tác chỉ có một cách dựng, màn chỉ khai mình cần gì (`hanh-vi-trong-luoi-khung`)
- `khai-lien-ket-chao-can`
- Mọi màn và mọi vai được khai cho máy đọc, màn chưa khai hay hợp đồng thiếu vai thì kiểm tra báo đỏ (`khai-vai-va-man`)
- Nhân viên sàn mở ứng dụng ở giao diện sáng hoặc tối, luôn biết mình đang ở màn nào và được báo đúng chỗ khi có sự cố (`khung-va-giao-dien`)
- Mọi vùng dữ liệu dùng chung Lưới, ô theo kiểu, đầu vùng và đủ trạng thái (`luoi-va-o-theo-kieu`)
- Quản trị sàn mời người vào sàn và gán một trong bốn vai (`moi-nguoi-gan-vai`)
- Lệnh ghi số đo của một vòng không bao giờ lặng lẽ bỏ tầng đã khai: bản số đo cũ đọc không được thì lệnh dừng và nói rõ, không ghi đè (`so-do-ghi-khong-mat-tang`)
- Mỗi vòng giao diện máy ghi một bản số đo, một lệnh gộp theo tầng, và có mốc đối chứng trước khi dựng nền (`so-do-moi-vong`)
- Vòng dựng màn đi đúng thang kho, kho kết hợp ReUI Pro, tạo tay; thứ mới nhập kho được bày cho chủ kho chọn ở Cổng Phạm vi và có một dòng trong sổ khối (`thang-chon-khoi-vao-cong`)
- Một nhân viên giữ nhiều vai cùng lúc thấy đủ mục điều hướng của mọi vai mình giữ (`thanh-ben-nhieu-vai`)
- Thư mời dẫn người được mời tới đúng trang đăng nhập của sản phẩm, lấy từ cấu hình chứ không từ yêu cầu gửi tới (`thu-moi-dia-chi-tu-cau-hinh`)
- Sau khi đăng nhập người dùng không bao giờ bị đưa sang trang ngoài, bấm Đăng xuất mà lỗi thì được báo rõ, và người không còn thuộc sàn nào có lối thoát khỏi màn chọn sàn (`va-dang-nhap`)

## Đã giao

- `go-hoi-khi-gop`
