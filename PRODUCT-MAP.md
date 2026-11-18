# Bản đồ sản phẩm

> Bản đồ vẽ lại từ hồ sơ của xưởng mỗi lần một người ký một cổng — đừng sửa tay.
> (đọc từ thư mục `_acceptance/` và `.out-of-scope/`)
> Lộ trình: [LO-TRINH.html](LO-TRINH.html)

```mermaid
flowchart TD
  A["Đang cân nhắc cơ hội<br/>chưa có"] --> GD{"Cổng Đáng"}
  GD --> B["Sắp mở vòng<br/>9 việc"]
  GD --> XL["Xếp lại sau<br/>chưa có"]
  GD --> DB["Đã bác từ khám phá<br/>chưa có"]
  B --> CD["Chờ duyệt phạm vi<br/>chưa có"] --> GP{"Cổng Phạm vi"}
  GP --> DL["Đang làm<br/>chưa có"] --> GB{"Cổng Bằng chứng"}
  GB --> DG["Đã giao<br/>8 việc"]
  GB --> CN["Chờ phiên nghiệm thu<br/>52 việc"] --> GG{"Cổng Giá trị"}
  GG --> NT["Đã nghiệm thu giá trị<br/>chưa có"]
```

> **Bốn cổng người** — mỗi cổng là một câu hỏi chỉ người trả lời được:
> **Cổng Đáng** việc này có đáng làm không · **Cổng Phạm vi** bộ tiêu chí
> đã đủ và đúng chưa · **Cổng Bằng chứng** đã làm đúng thứ đã hứa chưa ·
> **Cổng Giá trị** thứ đã giao có ăn thua không.

## Sắp mở vòng

- Đầu chủ tải ảnh lên hồ sơ căn, đổi ảnh bìa, gỡ ảnh và thấy căn thành Sẵn sàng bán khi đủ điều kiện (`anh-va-san-sang-ban`)
- Đầu chủ mở hồ sơ căn và thấy lịch sử của căn: tạo lần chào, đổi giá, đổi trạng thái, đổi thông tin, xác nhận với chủ nhà, mỗi việc kèm vai người làm và lúc làm (`lich-su-cua-can`)
- Quản trị sàn đổi mức Thuế phí mà Về tay của các giá đã đặt trước đó không đổi, và trên căn thấy được con số tính theo mức nào (`lich-su-muc-thue-phi`)
- Đầu chủ và Đầu khách mở màn Liên hệ và thấy liên hệ của sàn trên Lưới, thêm, sửa, gỡ được liên hệ và gộp được hai liên hệ trùng, theo quyền của vai (`lien-he-tren-luoi`)
- Đầu chủ nạp tệp Excel hay Sheet đang dùng, ghép cột, tên cột, giá trị và mã căn của mình vào chuẩn ngay ở màn xem trước, áp vào bảng và hoàn tác được; lần sau cùng dạng tệp không phải ghép lại (`nhap-excel`)
- Đầu chủ ghi và mở số chủ nhà trên hồ sơ căn, và gỡ được chủ nhà ghi nhầm khỏi căn (`so-chu-nha`)
- Đầu chủ đổi giá và đổi trạng thái ngay trong hồ sơ căn trên điện thoại, theo cùng luật với sửa trên ô của Bảng hàng (`sua-nhanh-tren-dien-thoai`)
- Đầu chủ sửa được thông tin của căn ngoài giá và trạng thái — pháp lý, nội thất, tài chính, tình trạng sử dụng — ngay trong sản phẩm, không phải nhập lại tệp (`sua-thong-tin-can`)
- Đầu chủ gõ mã căn để thêm căn, hoặc tạo căn tay khi danh mục chưa có (`them-can`)

## Đã giao — chờ phiên nghiệm thu

- Nhân viên sàn làm việc trong một App Shell chọn từ ReUI Pro, giữ đủ thanh bên theo vai, băng báo và các trạng thái toàn trang đang có (`app-shell-chon-tu-reui`)
- Đầu chủ mở Bảng hàng và thấy các căn của sàn trên Lưới, đủ trạng thái màn, ở bốn khổ màn hình (`bang-hang-ban-doc`)
- Đầu chủ đăng nhập và thấy, sửa được hàng thật của sàn mình trên Bảng hàng (`bang-hang-du-lieu-that`)
- Đầu chủ dùng Bảng hàng bằng tay như Sheet: đi giữa các ô bằng phím mũi tên, bôi một vùng ô rồi chép sang Zalo hay Excel, bấm tiêu đề để sắp xếp, lọc từng cột, nhóm dòng theo toà, ẩn hiện cột (`bang-hang-dung-tay-nhu-sheet`)
- Đầu chủ và Đầu khách mở Bảng hàng trên điện thoại thấy danh sách thẻ căn và chạm thẻ để mở hồ sơ căn (`bang-hang-the-dien-thoai`)
- Đầu chủ đi Bảng hàng theo địa lý: chọn dự án, phân khu, toà ở cột thứ hai của App Shell và lọc các cột địa lý trên bảng (`bang-hang-theo-dia-ly`)
- Mọi thao tác đọc và ghi đều được quyết định từ một bảng quyền theo vai, phạm vi và trạng thái (`bang-quyen-theo-vai`)
- Mỗi màn trong sổ có sẵn bộ bài kiểm trạng thái sinh ra từ sổ, kèm bài phá thử chứng minh bài kiểm đỏ được (`bo-bai-kiem-tu-so-man`)
- Bộ kiểm chung sinh từ sổ màn chạy được trên màn cần đăng nhập và không lỡ nhịp khi máy chậm (`bo-kiem-chung-khi-dang-nhap`)
- Người dùng ở vai nào cũng thấy bộ nút thêm, sửa, gỡ đặt cùng một chỗ trên mọi màn và chỉ thấy nút mình được dùng theo bảng quyền (`bo-nut-theo-quyen`)
- Đầu chủ và Đầu khách lọc mọi bảng họ Lưới chỉ bằng cách gõ vào ô lọc dưới tiêu đề cột như ở Sheet; ô «Gõ để tìm» của vùng không còn trên màn nào của họ Lưới — Bảng hàng, Đã gửi, sau này Liên hệ; tìm thì dùng ô ⌘K ở thanh trên của App Shell (hàng 3f) (`bo-o-tim-cua-vung`)
- Bộ kiểm cách ly bắt cả dạng xem chỉ cấp quyền ghi, sửa hay xoá cho vai của ứng dụng mà không chạy theo quyền người đọc (`cach-ly-dang-xem-chi-ghi`)
- Mỗi sàn chỉ đọc và ghi được dữ liệu của mình, mọi truy vấn đi qua một cửa (`cach-ly-moi-san`)
- Bộ kiểm cách ly giữa các sàn bắt thêm tám kẽ hở đã nêu ở hàng 7 trước khi nối dữ liệu thật (`cach-ly-truoc-du-lieu-that`)
- CI chạy các bài trình duyệt có đăng nhập trên một Postgres riêng của lượt, để bộ kiểm chung đo được màn cần đăng nhập ngay trên CI (`ci-co-postgres`)
- Cổng chứng minh màn bắt được khối mới mà vòng dựng không kê ra trong hồ sơ (`cong-bat-khoi-khong-ke`)
- Vòng dựng màn phải chứng minh giải được và đồng nhất với màn mẫu trước khi trình, rời khỏi thang Trong kho, ReUI, Vẽ tay thì phải nêu căn cứ (`cong-chung-minh-man-mau`)
- Đầu khách mở Đã gửi và thấy các link đã gửi trên cùng Lưới với Bảng hàng (`da-gui-tren-luoi`)
- Đầu chủ dán một vùng từ Excel vào bảng và thấy trước những ô sẽ đổi (`dan-tu-excel`)
- Nhân viên sàn đăng nhập bằng mã email trên màn đăng nhập chọn từ ReUI Pro, luồng và luật an toàn giữ nguyên (`dang-nhap-chon-tu-reui`)
- Nhân viên sàn nhập mã gửi qua email và vào đúng sàn của mình (`dang-nhap-ma-email`)
- Danh mục căn dùng chung lưu cùng cách với onehub-invest: có cấp phân khu dưới dự án, tầng lưu theo RESO, toà · trục · căn có khoá riêng, mã căn gốc giữ làm bí danh (`danh-muc-can-nhu-onehub-invest`)
- Agent tra được danh mục ReUI Pro ngay trong kho theo phiên bản đã ghim, không phụ thuộc kết nối ngoài (`danh-muc-reui`)
- Ghim lại danh mục ReUI từ nguồn đã đổi cách ghi tiêu đề mục thì máy dừng và gọi tên nhóm bị mất thay vì lặng lẽ bỏ cả nhóm, và phép chặn mã hay khoá phủ đủ các dạng đã kê (`danh-muc-reui-doc-chac`)
- Bộ kiểm của kho hết bốn nợ làm hàng khác đỏ oan: cổng mạng bị cấm, cảnh báo dựng trang lệch, việc Release đỏ sau mỗi lần gộp, và hai trang quyết định trùng số (`don-no-bo-kiem`)
- `du-lieu-mau`
- Hồ sơ cạnh bảng, lọc rỗng, chờ tải, lỗi, lưu và hoàn tác chỉ có một cách dựng, màn chỉ khai mình cần gì (`hanh-vi-trong-luoi-khung`)
- Đầu chủ bấm một căn và thấy hồ sơ căn cạnh bảng, trên điện thoại thấy thẻ căn (`ho-so-can`)
- Đầu chủ mở hồ sơ căn và đọc đủ thông tin của căn và của lần chào (`ho-so-du-thong-tin`)
- Đầu khách bấm «Hỏi đầu chủ» trên hồ sơ căn để mở bảng chia sẻ của máy với tin soạn sẵn cho người giữ căn, và bấm «Báo sai thông tin căn» để soạn tin nêu trường sai cùng giá trị đúng; người tự bấm gửi (`hoi-dau-chu-bao-sai`)
- `khai-lien-ket-chao-can`
- Mọi màn và mọi vai được khai cho máy đọc, màn chưa khai hay hợp đồng thiếu vai thì kiểm tra báo đỏ (`khai-vai-va-man`)
- Nhân viên sàn mở ứng dụng ở giao diện sáng hoặc tối, luôn biết mình đang ở màn nào và được báo đúng chỗ khi có sự cố (`khung-va-giao-dien`)
- Mỗi màn được kiểm bằng từng vai ở bốn khổ màn hình, vai không được vào thấy đúng Không đủ quyền và không lộ dữ liệu (`kiem-vai-theo-man`)
- Sổ màn khai mỗi màn hiện những thứ gì, và bộ kiểm của kho (make check) đỏ khi một thứ trên màn thiếu thêm, xem, sửa hoặc gỡ theo từng vai, trừ khi ô thiếu mang lý do đã duyệt trỏ tới một hàng lộ trình (`kiem-vong-doi-thao-tac`)
- Đầu chủ chép đường dẫn một căn gửi đồng nghiệp mở đúng căn và đúng lần chào, và gõ mã căn ở thanh trên để mở thẳng hồ sơ căn trên Bảng hàng (`loi-vao-ho-so`)
- Mỗi sàn có lớp riêng của mình trên lõi chuẩn — nhãn riêng, trường riêng, từ điển giá trị, căn chờ khớp và mẫu nhập — và Bảng hàng hiện trường riêng, đọc nhãn riêng của sàn (`lop-rieng-cua-san`)
- Mọi vùng dữ liệu dùng chung Lưới, ô theo kiểu, đầu vùng và đủ trạng thái (`luoi-va-o-theo-kieu`)
- Đầu chủ lưu cách xem Bảng hàng (lọc, sắp xếp, nhóm, cột đang hiện) thành một mục ở cột thứ hai của App Shell và mở lại đúng cách xem ấy (`luu-goc-nhin-cot-hai`)
- Quản trị sàn mời người vào sàn và gán một trong bốn vai (`moi-nguoi-gan-vai`)
- Người của sàn mở inventory.onehub.center, nhận mã qua email và vào đúng sàn của mình trên bản chạy thật; mỗi bản mới đi qua bản thử trước khi lên bản thật, và lùi được về bản trước (`moi-truong-thu-va-ban-that`)
- Đầu chủ ghim ngăn chi tiết thành một cột cạnh bảng khi làm lâu trên một căn, bỏ ghim thì ngăn nổi lại (`ngan-chi-tiet-ghim-thanh-cot`)
- Lệnh ghi số đo của một vòng không bao giờ lặng lẽ bỏ tầng đã khai: bản số đo cũ đọc không được thì lệnh dừng và nói rõ, không ghi đè (`so-do-ghi-khong-mat-tang`)
- Mỗi vòng giao diện máy ghi một bản số đo, một lệnh gộp theo tầng, và có mốc đối chứng trước khi dựng nền (`so-do-moi-vong`)
- Đầu chủ sửa giá và trạng thái ngay trên ô, thấy lỗi ngay tại ô đó (`sua-tren-o`)
- Vòng dựng màn đi đúng thang kho, kho kết hợp ReUI Pro, tạo tay; thứ mới nhập kho được bày cho chủ kho chọn ở Cổng Phạm vi và có một dòng trong sổ khối (`thang-chon-khoi-vao-cong`)
- Một nhân viên giữ nhiều vai cùng lúc thấy đủ mục điều hướng của mọi vai mình giữ (`thanh-ben-nhieu-vai`)
- Quản trị sàn xem danh sách người và mời người trên màn Thành viên chọn từ kho và ReUI Pro, quyền và luật mời giữ nguyên (`thanh-vien-chon-tu-reui`)
- Thư mời dẫn người được mời tới đúng trang đăng nhập của sản phẩm, lấy từ cấu hình chứ không từ yêu cầu gửi tới (`thu-moi-dia-chi-tu-cau-hinh`)
- Quản trị sàn đặt Thuế phí và thấy Bảng hàng tính theo mức đó (`thue-phi`)
- Ứng dụng nối cơ sở dữ liệu bằng một vai đăng nhập không phải chủ bảng, chỉ là thành viên của vai API, để mã trong cửa có đổi vai cũng không về được vai chủ (`ung-dung-noi-bang-vai-khong-chu`)
- Sau khi đăng nhập người dùng không bao giờ bị đưa sang trang ngoài, bấm Đăng xuất mà lỗi thì được báo rõ, và người không còn thuộc sàn nào có lối thoát khỏi màn chọn sàn (`va-dang-nhap`)

## Đã giao

- Nhận plugin design-assembly — lệnh kiểm chạy lại lint của kho, sổ linh kiện do công cụ của plugin ghi thay công cụ viết tay (`adopt-design-assembly`)
- `go-hoi-khi-gop`
- Nâng kit nghiệm thu của kho từ v2.38.1 lên v3.0.0 của kho mới delivery-loop — CI kéo kit 3.0 theo thẻ, phiên Claude Code bật chợ mới, kit-root chỉ đọc bản cài của chợ mới (`nang-kit-3-0`)
- Chép lại công cụ design-assembly từ plugin — sổ linh kiện hết ghi trùng linh kiện xuất lại qua tệp gom (`refresh-design-assembly-tool`)
- Lên đời công cụ design-assembly từ 0.1.0 lên 0.7.0 bằng lệnh upgrade — sổ linh kiện, sổ màn và sổ khối thôi đi theo pull request, bảng vai × màn × nút ra khỏi git, bản đồ affected (`upgrade-design-assembly-0-7-0`)
- Lên đời công cụ design-assembly từ 0.7.0 lên 0.7.1 và thêm hai hàng cổng decision-sheet, owner-calls, chạy được trên bản sao nông (`upgrade-design-assembly-0-7-1`)
- Lên đời công cụ design-assembly bằng lệnh upgrade của plugin bản 0.1.0 — sổ linh kiện ghi lại quan hệ dựng từ, kho ghi dấu phiên bản công cụ (`upgrade-design-assembly-tool`)
- Lên đời bộ setup repo-setup từ 0.4.0 lên 0.9.0, phần máy chạy (CI xếp tầng, sổ ngoài git, đường nâng cấp); luật của kho giữ nguyên, trừ hai điểm chủ kho đồng ý ở Gate 1 (Hỏi-2, Hỏi-3) (`upgrade-repo-setup-0-9-0`)
