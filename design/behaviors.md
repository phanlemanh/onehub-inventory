# Mẫu hành vi

Câu trả lời đóng cho các việc lặp lại, để không phải đoán mỗi lần dựng. Mỗi mục có nguồn trong `decisions.yaml`.

- **Phản hồi theo độ trễ:** Dưới 1 giây không chỉ báo; 1–10 giây có chỉ báo; trên 10 giây có tiến độ và nút huỷ
- **Lưu:** Đảo được thì làm ngay và cho hoàn tác; không đảo được hoặc ra ngoài sàn thì xác nhận
- **Gửi ra ngoài:** Người luôn là người bấm gửi
- **Sửa dữ liệu:** Kiểu `money`, `count`, `text`, `select`, `boolean`, `date` sửa trên ô; còn lại mở hồ sơ cạnh bảng. Ô chỉ mở sửa khi bảng quyền cho vai thao tác và dòng không khoá, từ 768 px; F2, gõ hay bấm đúp vào sửa; ô nhập nằm trong ô, một dòng ngay dưới ô đọc lại giá, báo chưa hiểu, hỏi lại khi giá đổi quá 20%; nấc cần thêm thông tin hỏi trong hộp giữa màn; Enter ghi, Tab ghi rồi sang ô kế, Esc huỷ (hàng 4)
- **Canh cột:** `money`, `area`, `count` canh phải; còn lại canh trái
- **Bề rộng cột:** `max(độ dài nhãn, độ dài mẫu của kiểu) × 1ch + đệm hai bên`; cột `text`, `person` thay độ dài mẫu bằng chuỗi dài nhất vùng đang giữ, không quá độ dài đọc của kiểu, cộng 1ch dư
- **Mật độ bảng:** Tổng bề rộng tối thiểu vượt vùng nội dung thì dày (`h-8`, `text-sm`), không thì thường (`h-12`, `text-base`)
- **Mở hồ sơ cạnh bảng:** Có địa chỉ riêng; Esc đóng và trả tiêu điểm về dòng cũ; trên điện thoại mở toàn màn; từ 768 px là ngăn nổi bên phải rộng khoảng hai phần năm, từ ngay dưới thanh trên App Shell tới đáy, sát mép phải, nổi trên nội dung (nền lớp nổi, viền trái, bóng), không khoá bảng (quyết định 0024; chủ kho 2026-11-27 «Chốt cả bốn», thay cách hàng 3a đặt ngăn dưới thanh công cụ của vùng); khi ngăn nổi, thanh công cụ của vùng dừng cách ngăn 16 px; khi ngăn mở cạnh lưới, nổi hay ghim, nút của thanh công cụ chỉ còn hình, có tên đọc và chữ gợi ý (ghim: chủ kho 2026-11-27, Cổng Phạm vi khung-luoi-va-ngan-chi-tiet, Hỏi-7); đầu hồ sơ một dòng ở mọi khổ — tên bên trái, góc phải trên Chép đường dẫn, Ghim, Trước, Sau, Đóng, chỉ hình, có tên đọc và chữ gợi ý (chủ kho 2026-11-27 «Chốt một dòng», thay hai dòng của hàng 3e); lưới cao khít màn, đáy cách vùng làm việc 16 px, cột thứ hai không làm trang cuộn thừa (chủ kho 2026-11-27); nút Ghim (khi vùng làm việc từ 800 px) biến ngăn thành cột cạnh bảng, bảng nhường chỗ, vạch chia kéo được 320 px tới ba phần năm, ghim và độ rộng nhớ bằng cookie (hàng 3a, quyết định 0031)
- **Chia trang:** Không chia trang: lưới cuộn liền một mạch (bảng cuộn ảo ReUI), tiêu đề đứng yên khi cuộn dọc, cột số dòng và hai cột đầu đứng yên khi cuộn ngang; chân bảng ghi số dòng (chốt ở Bảng hàng, «đọc như Sheet»)
- **Tiêu điểm:** Hàng và cột dính không che ô đang chọn
- **Đăng nhập:** Dán được mã, cho trình quản lý mật khẩu điền
- **Kênh thông báo:** Lỗi của một ô hay trường báo tại chỗ; kết quả thao tác báo bằng toast, đảo được thì có hoàn tác; sự cố của cả màn báo bằng băng trên màn
- **Giao diện:** Có sáng và tối, mặc định theo thiết bị, người dùng đổi được; cả hai phải đạt kiểm tương phản
- **Điều hướng điện thoại:** Thanh bên thu gọn; chưa có thanh dưới; Lưới thành danh sách thẻ (mục «Danh sách thẻ điện thoại»)
- **Ô không sửa được:** Không có quyền thì hiện như chữ thường; tạm khoá thì nói lý do
- **Hành động nguy hiểm:** Câu xác nhận nói rõ việc sẽ xảy ra, nút mang đúng động từ đó
- **Phím trong lưới:** Bấm ô là chọn ô; mũi tên, Tab, Home, End, Ctrl+Home/End, PageUp/Down đi ô, Shift mở rộng vùng, Esc bỏ vùng; Enter mở dòng khi màn có hồ sơ, không thì đi xuống (dùng tay như Sheet, hàng 2a); F2 hay gõ mở sửa ô sửa được, đóng khung thì tiêu điểm về ô vừa sửa (hàng 4)
- **Chép vùng:** Ctrl+C (Cmd+C) chép chữ đang hiện của vùng ô, tách tab, không tiêu đề, không cột số dòng
- **Lọc từng cột:** Hàng ô lọc luôn hiện dưới mỗi tiêu đề theo kiểu cột (hàng 2e, không nút bật tắt): chữ chứa không dấu, giá trị chọn nhiều, số theo luật (`<=5`, `2-5`, hoặc, và; giá theo tỷ), ngày theo số ngày đã qua; các ô cộng dồn; luật sai báo ở ô, không lọc
- **Sắp xếp:** Bấm tiêu đề mở menu Tăng dần, Giảm dần, Ghim; một cột một lúc; ô trống luôn cuối; trạng thái theo thứ tự trạng thái
- **Nhóm dòng:** Màn khai trường được nhóm; nút «Nhóm theo …» bật tắt, dòng nhóm có nút gập, tên, số dòng; số dòng đếm liền qua nhóm
- **Ẩn hiện cột:** Nút «Cột» tắt bật từng cột, trừ cột đầu
- **Toàn màn hình:** Từ 768px: nút «Toàn màn hình» đưa cả trang vào toàn màn, App Shell và đầu màn ẩn, lưới dày; Esc thoát
- **Danh sách thẻ điện thoại:** Dưới 768 px thân vùng Lưới của màn có khai thẻ (Bảng hàng) là danh sách thẻ dùng trọn bề ngang, không khung; từ 768 là bảng. Một hàng công cụ dính dưới thanh trên: số dòng; Lọc (kèm số ô đang lọc), Nhóm theo …, «…» chứa việc của vùng. Ngăn Lọc mở từ đáy: «Sắp theo» trước, rồi ô lọc của từng cột; lọc đang chạy hiện thành chip bỏ được từng cái. Chạm thẻ mở hồ sơ toàn màn; đóng hay lùi giữ chỗ đang cuộn và trả tiêu điểm về thẻ. Không sửa trên thẻ; «…» của từng dòng (khuôn 9e) đứng cuối thẻ (hàng 2b)
- **Lối tắt trạng thái:** Cột thứ hai mở Bảng hàng đã lọc `?status=<trạng thái>`; một thứ tự trạng thái cho mọi nơi (thứ tự nhãn)
- **Theo địa lý:** Cột thứ hai của Bảng hàng có mỗi dự án một nhóm (hàng 2d): «Tất cả», phân khu lồng toà, toà; không số. Bấm một nơi chỉ thay lọc Dự án, Toà (danh sách tên khớp trọn: «Park 1» không lấy «Park 10»; chữ gõ tay vẫn chứa chữ), giữ lọc khác; địa chỉ ghi `?place=<nơi>` khi lọc Dự án, Toà lọc ra đúng tập dòng của một nơi, và nơi ấy sáng; giữa hai mục cùng khớp địa chỉ, mục sau sáng
- **Chữ mở trong ô:** Trong Lưới, chữ là đường mở (mã căn) mở hồ sơ bằng một cú bấm; phần còn lại của ô chỉ chọn ô như Sheet; Enter trên ô đang chọn cũng mở; chữ mở không là chỗ dừng Tab; đóng hồ sơ thì tiêu điểm về chữ mở, ô của nó là ô đang chọn và phím mũi tên chạy tiếp (phân xử D-1211-19)
- **Bộ nút theo quyền:** Mỗi nút thao tác đi qua `PermittedAction` và hiện theo bảng quyền; không quyền thì không có nút; chỗ đặt và thứ tự ở mục «Bộ nút theo quyền» dưới đây

## Bộ nút theo quyền

Hàng 9e, lựa chọn của chủ kho ở Cổng Phạm vi (2026-11-12). Bảng quyền `ontology/actions.yaml` là nguồn duy nhất: nút hiện
khi vai của phiên có ô cho thao tác của nút (`actionVisibility` cạnh `allowedScope`), màn không so tên vai.

| Nút                                              | Chỗ                       | Máy tính                             | Điện thoại                                        |
| ------------------------------------------------ | ------------------------- | ------------------------------------ | ------------------------------------------------- |
| Thêm thứ chính của màn (thêm căn, thêm liên hệ)  | Đầu màn, cạnh tiêu đề (C) | Một nút chính, chữ «Thêm <danh từ>»  | Cùng chỗ, cùng chữ                                |
| Nút của vùng (việc trên cả vùng)                 | Đầu vùng, bên phải        | Nút phụ trong thanh công cụ của vùng | Cùng chỗ; thanh công cụ xuống dòng khi chật       |
| Thao tác trên một dòng                           | Theo luật «…» dưới đây    | Cột cuối của lưới, ghim bên phải     | Cột cuối của lưới, ghim nên luôn thấy ở mép phải  |
| Đi lại và việc của cả bản ghi trong hồ sơ        | Đầu hồ sơ, góc phải trên  | Trước, Sau, Đóng và «…»; chỉ hình    | Như máy tính, trong hồ sơ toàn màn; vùng bấm 44px |
| Sửa một mục của hồ sơ                            | Đầu mục nó sửa, bên phải  | «Sửa», mỗi mục sửa được một nút      | Cùng chỗ; vùng bấm 44px                           |
| Bước kế với một người (hỏi người giữ căn)        | Đáy hồ sơ, dính (D)       | Đúng một nút, rộng hết hồ sơ         | Cùng chỗ, nút cỡ lớn                              |
| Việc trên một mục của hồ sơ (báo sai thuộc tính) | Đầu mục, bên phải         | Nút phụ không viền                   | Cùng chỗ; vùng bấm 44px                           |

- Toàn màn hình (từ 768px): đầu màn ẩn, nên nút thêm của đầu màn hiện ở thanh công cụ của vùng — một nút, hai chỗ theo
  chế độ, không bao giờ hai nút cùng lúc (giám sát phân xử V-1211-6, chủ kho phê ở Cổng Bằng chứng).
- Đầu hồ sơ một dòng ở mọi khổ (chủ kho 2026-11-27, «Chốt một dòng», trả lời «Chốt đầu chi tiết căn một dòng, nút
  Trước/Sau/Đóng ở góc phải trên?»; thay «Có, mọi khổ» hai dòng của hàng 3e, 2026-11-13): tên bản ghi bên trái, cắt «…» khi
  dài; góc phải trên, cùng dòng: việc của bản ghi, «Chép đường dẫn», «Ghim» (từ 800 px), «Trước», «Sau», «Đóng» ở mép phải.
  Mọi nút ấy chỉ là biểu tượng, có tên cho trình đọc màn hình và cùng chữ ấy làm gợi ý khi rê; vừa 320 px.
- **Chuẩn nút dùng chung** (chủ kho 2026-11-27, «Duyệt cả ba câu»):
  1. «Sửa» đặt ở đầu mục nó sửa, mỗi mục sửa được một nút; đầu hồ sơ chỉ giữ đi lại (Trước, Sau, Đóng) và «…» cho việc của cả
     bản ghi. Thay luật «đầu hồ sơ có nút chính Sửa» của hàng 9e.
  2. Việc bị chặn vì trạng thái (căn đã bán) thì thay nút bằng một dòng chữ nhạt có ổ khoá nói lý do («Căn đã bán, không
     sửa»); không nút mờ, không biến mất im lặng.
  3. Trên điện thoại (dưới 768 px), nút ở đầu hồ sơ, đầu mục và đáy hồ sơ có vùng bấm ít nhất 44 px; máy tính giữ 28 px.
     Câu 1 và 2 trong ngăn chi tiết căn dựng ở hàng 3h; câu 3 là phần khung dùng chung (`RecordPanel`, `SectionHeader`).
- **Luật «…»** (chủ kho 2026-11-27, «Duyệt luật đã sửa»; thay R1 «một nút «…»» của hàng 9e):
  1. Đếm theo tập việc có thể có của chỗ ấy (mọi vai, mọi trạng thái), không đếm theo từng dòng: mọi dòng cùng một hình.
  2. Một hoặc hai việc thường thì hiện thẳng. Từ ba việc, hoặc có việc xoá, thì cả chỗ ấy dùng «…»; việc xoá đứng cuối, chữ
     đỏ, qua hộp xác nhận.
  3. «…» luôn hiện, không chỉ khi rê chuột; tên đọc «Việc với <tên bản ghi>» (ví dụ «Việc với căn 0905»).
     Hệ quả: «Đổi vai» của Thành viên hiện thẳng; hàng công cụ điện thoại của Bảng hàng hiện thẳng «Lưu góc nhìn» thay «…».
- Thanh dính đáy hồ sơ (D, hàng 3e, giám sát G-1311-38): chỗ đặt thứ năm, ngoài vùng cuộn của thân, chứa đúng MỘT nút — bước
  kế với một con người («Hỏi đầu chủ» cho người không giữ căn; «Ghi cuộc gọi» của người giữ căn là hàng 14). Không phải thanh
  công cụ. Không có nút thì không có thanh. Căn chưa ai giữ, đã bán hay ngừng hẳn thì chỗ nút là một dòng chữ nhạt nói vì sao
  («Căn chưa có đầu chủ giữ», «Căn đã bán, không hỏi đầu chủ»), không nút mờ (hàng 3h, C2 «Theo luật mới»; câu 2 của chuẩn nút
  dùng chung).
- Nút gửi tin cho người khác chỉ soạn tin rồi mở bảng chia sẻ của máy (`src/lib/share`); máy không có thì chép và báo; không
  lời gọi mạng nào (SP-3).
- Trong mọi «…»: việc thường trước, việc xoá sau cùng, tách bằng một vạch, chữ đỏ. Vai đang xem không có việc nào ở chỗ ấy
  thì không có «…».
- Chữ trên nút là động từ thường kèm danh từ (H1): «Sửa», «Xoá căn», «Xoá liên hệ», «Gộp với liên hệ khác…», «Xoá tên và số
  theo yêu cầu». «Xoá» là gỡ khỏi danh sách và giữ dấu vết ai xoá, lúc nào (quyết định 0016, sửa ngày 2026-11-12).
- Việc xoá luôn qua hộp xác nhận ngắn (X1) của `useChange`: tiêu đề hỏi đúng việc, một câu nói việc sẽ xảy ra, tiêu điểm đầu ở
  nút huỷ, Esc là huỷ, nút xác nhận mang đúng động từ và danh từ; huỷ không gửi gì.
- Phạm vi «của tôi» trên bản ghi của người khác: ẩn nút (O1). Vai không có ô: không thấy nút. Không có nút mờ.
- Máy chủ trả 403 cho một việc người đã bấm (bảng quyền hay vai vừa đổi): câu riêng «Không đủ quyền làm việc này. Tải lại
  trang để thấy đúng các nút.», khác câu lỗi chung; đóng hộp thì trang làm mới để bộ nút theo bảng quyền mới.
- Mục thanh bên của một màn khai `action` của thao tác mở màn ấy; mục hiện khi và chỉ khi bảng quyền cho thao tác đó.
- Bộ kiểm `tests/bo-nut-kiem.test.ts` (trong `make check`) đỏ khi một nút gửi yêu cầu ghi mà không đứng trong
  `PermittedAction` đúng thao tác, khi khai tên thao tác không có trong bảng, hay khi `src/app` viết cứng tên vai.
- Bảng vai × màn tới cấp nút sinh từ bảng quyền: `design/role-screen-buttons.md`, ngoài git, `make test` sinh lại trước bài kiểm.

## Dựng ở đâu

Mỗi hành vi trên chỉ có một chỗ dựng; màn chỉ khai mình cần gì. Tệp màn (`src/app/**`, `src/modules/*/ui/**`) không nhập thẳng khung hồ sơ, hộp thoại, khung chờ, khối trạng thái, vòng xoay hay toast — `tests/behavior-guard.test.ts` đỏ nếu có.

| Việc                         | Thành phần dùng chung                             | Màn khai                                              |
| ---------------------------- | ------------------------------------------------- | ----------------------------------------------------- |
| Mở hồ sơ cạnh bảng           | `DataRegion` với `record` (khung `RecordPanel`)   | cách dựng tên và nội dung của một dòng                |
| Phản hồi theo độ trễ khi tải | `DataRegion` với `status="loading"`               | `onCancel` khi huỷ được                               |
| Lỗi, một phần hỏng           | `DataRegion` với `status="error"` hay `"partial"` | `onRetry` khi tải lại được; không có thì không có nút |
| Nút làm việc của vùng        | `DataRegion` với `action={{ node, allowed }}`     | người xem có quyền làm việc ấy không                  |
| Sửa dữ liệu                  | `DataRegion` với `editable`, luật `editModeFor`   | vùng có sửa được không                                |
| Sửa trên ô                   | `DataRegion` với `cellEdit` (khung `CellEditor`)  | thao tác của bảng quyền, các trường, trình sửa của ô  |
| Ghi qua cổng và hoàn tác     | `runDoorChange` (`use-change`)                    | lần ghi, lần hoàn tác, câu khi hỏng                   |
| Lưu và hoàn tác              | `useChange`                                       | động từ, việc sẽ xảy ra, đảo được, ra ngoài sàn       |
| Nút thao tác theo quyền      | `PermittedAction` (cửa `ui` của mô-đun danh tính) | tên thao tác của bảng quyền, bản ghi có phải của mình |
| Việc trên một dòng           | `DataRegion` với `rowActions` (`RowActions`)      | các việc của dòng, dòng có phải của mình              |
| Việc trong hồ sơ             | `RecordActions` trong `actions` của hồ sơ         | nút chính và các việc còn lại                         |
