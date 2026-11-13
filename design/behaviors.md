# Mẫu hành vi

Câu trả lời đóng cho các việc lặp lại, để không phải đoán mỗi lần dựng. Mỗi mục có nguồn trong `decisions.yaml`.

| Việc                  | Quy tắc                                                                                                                                                                                                                                                                         |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Phản hồi theo độ trễ  | Dưới 1 giây không chỉ báo; 1–10 giây có chỉ báo; trên 10 giây có tiến độ và nút huỷ                                                                                                                                                                                             |
| Lưu                   | Đảo được thì làm ngay và cho hoàn tác; không đảo được hoặc ra ngoài sàn thì xác nhận                                                                                                                                                                                            |
| Gửi ra ngoài          | Người luôn là người bấm gửi                                                                                                                                                                                                                                                     |
| Sửa dữ liệu           | Kiểu `money`, `count`, `text`, `select`, `boolean`, `date` sửa trên ô; còn lại mở hồ sơ cạnh bảng                                                                                                                                                                               |
| Canh cột              | `money`, `area`, `count` canh phải; còn lại canh trái                                                                                                                                                                                                                           |
| Bề rộng cột           | `max(độ dài nhãn, độ dài mẫu của kiểu) × 1ch + đệm hai bên`; cột `text`, `person` thay độ dài mẫu bằng chuỗi dài nhất vùng đang giữ, không quá độ dài đọc của kiểu, cộng 1ch dư                                                                                                 |
| Mật độ bảng           | Tổng bề rộng tối thiểu vượt vùng nội dung thì dày (`h-8`, `text-sm`), không thì thường (`h-12`, `text-base`)                                                                                                                                                                    |
| Mở hồ sơ cạnh bảng    | Có địa chỉ riêng; Esc đóng và trả tiêu điểm về dòng cũ; trên điện thoại mở toàn màn; từ 768 px là ngăn nổi bên phải rộng khoảng hai phần năm, từ ngay dưới thanh trên tới đáy màn hình, không khoá bảng, Trước, Sau, Đóng ở góc trên phải (quyết định 0024)                     |
| Chia trang            | Không chia trang: lưới cuộn liền một mạch (bảng cuộn ảo ReUI), tiêu đề đứng yên khi cuộn dọc, cột số dòng và hai cột đầu đứng yên khi cuộn ngang; chân bảng ghi số dòng (chốt ở Bảng hàng, «đọc như Sheet»)                                                                     |
| Tiêu điểm             | Hàng và cột dính không che ô đang chọn                                                                                                                                                                                                                                          |
| Đăng nhập             | Dán được mã, cho trình quản lý mật khẩu điền                                                                                                                                                                                                                                    |
| Kênh thông báo        | Lỗi của một ô hay trường báo tại chỗ; kết quả thao tác báo bằng toast, đảo được thì có hoàn tác; sự cố của cả màn báo bằng băng trên màn                                                                                                                                        |
| Giao diện             | Có sáng và tối, mặc định theo thiết bị, người dùng đổi được; cả hai phải đạt kiểm tương phản                                                                                                                                                                                    |
| Điều hướng điện thoại | Thanh bên thu gọn; chưa có thanh dưới                                                                                                                                                                                                                                           |
| Ô không sửa được      | Không có quyền thì hiện như chữ thường; tạm khoá thì nói lý do                                                                                                                                                                                                                  |
| Hành động nguy hiểm   | Câu xác nhận nói rõ việc sẽ xảy ra, nút mang đúng động từ đó                                                                                                                                                                                                                    |
| Phím trong lưới       | Bấm ô là chọn ô; mũi tên, Tab, Home, End, Ctrl+Home/End, PageUp/Down đi ô, Shift mở rộng vùng, Esc bỏ vùng; Enter mở dòng khi màn có hồ sơ, không thì đi xuống (dùng tay như Sheet, hàng 2a)                                                                                    |
| Chép vùng             | Ctrl+C (Cmd+C) chép chữ đang hiện của vùng ô, tách tab, không tiêu đề, không cột số dòng                                                                                                                                                                                        |
| Lọc từng cột          | Nút «Lọc» mở một ô lọc dưới mỗi tiêu đề theo kiểu cột: chữ chứa không dấu, giá trị chọn nhiều, số theo luật (`<=5`, `2-5`, hoặc, và; giá theo tỷ), ngày theo số ngày đã qua; các ô cộng dồn; luật sai báo ở ô, không lọc                                                        |
| Sắp xếp               | Bấm tiêu đề mở menu Tăng dần, Giảm dần, Ghim; một cột một lúc; ô trống luôn cuối; trạng thái theo thứ tự trạng thái                                                                                                                                                             |
| Nhóm dòng             | Màn khai trường được nhóm; nút «Nhóm theo …» bật tắt, dòng nhóm có nút gập, tên, số dòng; số dòng đếm liền qua nhóm                                                                                                                                                             |
| Ẩn hiện cột           | Nút «Cột» tắt bật từng cột, trừ cột đầu                                                                                                                                                                                                                                         |
| Toàn màn hình         | Từ 768px: nút «Toàn màn hình» đưa cả trang vào toàn màn, App Shell và đầu màn ẩn, lưới dày; Esc thoát                                                                                                                                                                           |
| Lối tắt trạng thái    | Cột thứ hai mở Bảng hàng đã lọc `?status=<trạng thái>`; một thứ tự trạng thái cho mọi nơi (thứ tự nhãn)                                                                                                                                                                         |
| Chữ mở trong ô        | Trong Lưới, chữ là đường mở (mã căn) mở hồ sơ bằng một cú bấm; phần còn lại của ô chỉ chọn ô như Sheet; Enter trên ô đang chọn cũng mở; chữ mở không là chỗ dừng Tab; đóng hồ sơ thì tiêu điểm về chữ mở, ô của nó là ô đang chọn và phím mũi tên chạy tiếp (phân xử D-1211-19) |
| Bộ nút theo quyền     | Mỗi nút thao tác đi qua `PermittedAction` và hiện theo bảng quyền; không quyền thì không có nút; chỗ đặt và thứ tự ở mục «Bộ nút theo quyền» dưới đây                                                                                                                           |

## Bộ nút theo quyền

Hàng 9e, lựa chọn của chủ kho ở Cổng Phạm vi (2026-11-12). Bảng quyền `ontology/actions.yaml` là nguồn duy nhất: nút hiện
khi vai của phiên có ô cho thao tác của nút (`actionVisibility` cạnh `allowedScope`), màn không so tên vai.

| Nút                                             | Chỗ                       | Máy tính                             | Điện thoại                                       |
| ----------------------------------------------- | ------------------------- | ------------------------------------ | ------------------------------------------------ |
| Thêm thứ chính của màn (thêm căn, thêm liên hệ) | Đầu màn, cạnh tiêu đề (C) | Một nút chính, chữ «Thêm <danh từ>»  | Cùng chỗ, cùng chữ                               |
| Nút của vùng (việc trên cả vùng)                | Đầu vùng, bên phải        | Nút phụ trong thanh công cụ của vùng | Cùng chỗ; thanh công cụ xuống dòng khi chật      |
| Thao tác trên một dòng                          | Một nút «…» (R1)          | Cột cuối của lưới, ghim bên phải     | Cột cuối của lưới, ghim nên luôn thấy ở mép phải |
| Thao tác trong hồ sơ                            | Đầu hồ sơ, bên phải       | Một nút chính (thường là Sửa) và «…» | Như máy tính, trong hồ sơ toàn màn               |

- Toàn màn hình (từ 768px): đầu màn ẩn, nên nút thêm của đầu màn hiện ở thanh công cụ của vùng — một nút, hai chỗ theo
  chế độ, không bao giờ hai nút cùng lúc (giám sát phân xử V-1211-6, chủ kho phê ở Cổng Bằng chứng).
- Trong mọi «…»: việc thường trước, việc xoá sau cùng, tách bằng một vạch, chữ đỏ. «…» không còn việc nào thì không có «…».
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
- Bảng vai × màn tới cấp nút sinh từ bảng quyền: `design/vai-man-nut.md` (`make check` đỏ khi lệch).

## Dựng ở đâu

Mỗi hành vi trên chỉ có một chỗ dựng; màn chỉ khai mình cần gì. Tệp màn (`src/app/**`, `src/modules/*/ui/**`) không nhập thẳng khung hồ sơ, hộp thoại, khung chờ, khối trạng thái, vòng xoay hay toast — `tests/behavior-guard.test.ts` đỏ nếu có.

| Việc                         | Thành phần dùng chung                             | Màn khai                                              |
| ---------------------------- | ------------------------------------------------- | ----------------------------------------------------- |
| Mở hồ sơ cạnh bảng           | `DataRegion` với `record` (khung `RecordPanel`)   | cách dựng tên và nội dung của một dòng                |
| Phản hồi theo độ trễ khi tải | `DataRegion` với `status="loading"`               | `onCancel` khi huỷ được                               |
| Lỗi, một phần hỏng           | `DataRegion` với `status="error"` hay `"partial"` | `onRetry` khi tải lại được; không có thì không có nút |
| Nút làm việc của vùng        | `DataRegion` với `action={{ node, allowed }}`     | người xem có quyền làm việc ấy không                  |
| Sửa dữ liệu                  | `DataRegion` với `editable`, luật `editModeFor`   | vùng có sửa được không                                |
| Lưu và hoàn tác              | `useChange`                                       | động từ, việc sẽ xảy ra, đảo được, ra ngoài sàn       |
| Nút thao tác theo quyền      | `PermittedAction` (cửa `ui` của mô-đun danh tính) | tên thao tác của bảng quyền, bản ghi có phải của mình |
| Việc trên một dòng           | `DataRegion` với `rowActions` (`RowActions`)      | các việc của dòng, dòng có phải của mình              |
| Việc trong hồ sơ             | `RecordActions` trong `actions` của hồ sơ         | nút chính và các việc còn lại                         |
