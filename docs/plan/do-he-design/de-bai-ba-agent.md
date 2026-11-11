# Đề bài mốc đối chứng: ba agent cùng lập phương án một màn chưa có mẫu

Đề bài này cố định. Mỗi lần đo lại dùng đúng câu giao dưới đây, chỉ đổi bản kho được đọc, để số của các lần đo so được với nhau.
Cách đo chép từ phép đo ba tác tử ở Quỹ hàng (`onehub-quy-hang` `docs/plan/ma-tran-kiem-ke-design-claude-code.md` mục 2), đổi màn
«Dự án» thành màn «Liên hệ» vì kho này chưa có màn nào, còn Liên hệ là màn họ Lưới làm sau đợt nền (hàng `1d` của lộ trình).

## Điều kiện

- Ba agent mới, độc lập, không có ngữ cảnh của phiên giao việc, không thấy phương án của nhau.
- Mỗi agent đọc một bản kho sạch ở đúng commit ghi trong `moc-*/moc.json`, không đọc tệp nào ngoài bản kho đó.
- Agent không viết mã, không sửa tệp, không chạy máy chủ.
- Một agent thứ tư, cũng mới, đặt ba phương án vào bảng so theo danh sách quyết định dưới. Phiên giao việc không tự chấm.

## Câu giao (chép nguyên văn cho cả ba agent)

> Bạn là agent lập trình mới vào kho onehub-inventory ở thư mục `<bản kho>`. Chỉ đọc tệp trong thư mục đó (node_modules trong
> đó cũng được), không đọc thư mục nào khác. Hãy lập phương án dựng màn danh sách «Liên hệ»
> (Contact) cho nhân viên sàn: xem danh sách liên hệ, tìm, lọc, mở hồ sơ một liên hệ. Đọc đúng những gì kho yêu cầu đọc trước khi
> làm (AGENTS.md, CLAUDE.md và các tệp chúng trỏ tới), như khi bạn sắp dựng thật. Không viết mã, không sửa tệp nào.
>
> Trả về phương án dưới dạng danh sách quyết định thiết kế. Mỗi quyết định một dòng gồm: tên quyết định, lựa chọn của bạn, căn
> cứ (đường tệp trả lời quyết định này, hoặc «tự đoán»), và với quyết định tự đoán thì ghi thêm đây là việc hệ thiết kế lẽ ra phải
> trả lời sẵn hay việc sản phẩm cần người quyết. Tối thiểu phải có các quyết định: bố cục, có tạo khuôn mới không, thành phần
> bảng, cấu hình bảng, chiều cao dòng, cách nạp dữ liệu, căn cột số, căn cột ngày, bề rộng cột, đường dẫn và mô tả trang, tiêu đề
> trang, số đếm, trạng thái chờ tải và chưa có dữ liệu, tìm không ra, lỗi tải, định dạng số, định dạng ngày, địa chỉ riêng của hồ
> sơ, phím Esc và bàn phím, điện thoại, nhãn màn. Thêm mọi quyết định khác bạn phải đưa ra.
>
> Cuối bài ghi: số lượt gọi công cụ, số tệp đã đọc, danh sách tệp đã đọc.
>
> Trả lời bằng tiếng Việt, toàn bộ phương án trong câu trả lời cuối (dạng markdown).

`<bản kho>` là đường tuyệt đối tới bản kho sạch của lần đo, một worktree tạm tại commit ghi trong `moc.json`. Tệp phương án
giữ câu đã gửi với đường ấy lược về lại `<bản kho>`, vì kho công khai. Agent chạy với kiểu agent `general-purpose`,
mô hình của phiên giao việc, không có ngữ cảnh khác.

## Danh sách quyết định của bảng so

Hai mươi mốt quyết định của câu giao, giữ đúng thứ tự, cộng các quyết định thêm mà ít nhất hai agent cùng nêu. Mỗi dòng ghi lựa
chọn của từng agent và một trong ba kết quả:

- **Giống**: ba agent cùng lựa chọn.
- **Giống, mang lỗi**: ba agent cùng lựa chọn và lựa chọn trái một luật đã ghi trong kho (ghi tệp luật).
- **Lệch**: ít nhất hai lựa chọn khác nhau.

Luật áp dụng khi xếp dòng (chủ kho chốt ngày 11/11/2026; lần đo lại dùng y nguyên):

- Một agent không nêu quyết định mà agent khác có nêu thì dòng đó là **Lệch**: «không nêu» được tính là một lựa chọn khác. Ngưỡng
  này áp cả khi agent nêu quyết định nhưng bỏ một phần mà agent khác có nêu (ví dụ dòng «Dữ liệu thử» của lần đo đầu).
- **Giống, mang lỗi** chỉ dùng khi ít nhất một phương án tự trích luật bị trái. Người lập bảng không tự suy luật.
- Một khác biệt chỉ tính ở dòng mang đúng tên nó; không có dòng như vậy thì tính ở dòng đầu tiên nó xuất hiện, và không tính lại ở
  dòng khác.
- Hai cách gọi khác nhau cho cùng một thứ người dùng nhìn thấy (ví dụ chữ trên nút) là hai lựa chọn khác nhau.

Hai luật đầu đã có trong câu giao cho agent lập bảng của lần đo đầu, trước khi có kết quả. Một luật «tính lại khác biệt ở mọi dòng
chứa nó» từng được thêm sau lượt chấm đầu; chủ kho bỏ luật đó vì nó được viết sau khi thấy số, và chốt luật thứ ba, thứ tư ở trên
khi xếp năm dòng người chấm hỏi.

Cuối bảng đếm cho từng agent: số quyết định tự đoán, trong đó bao nhiêu hệ lẽ ra phải trả lời sẵn, bao nhiêu cần người quyết.
