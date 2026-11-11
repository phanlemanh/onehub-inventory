# Chứng minh màn — moi-nguoi-gan-vai

## Màn members

### Hướng

Hai hướng thật sự khác nhau cho việc «quản trị thêm người và đổi vai» trên một sàn vài chục người.

| Hướng | Ảnh | Động cơ | Đánh đổi | Chọn |
| --- | --- | --- | --- | --- |
| Danh sách người, mời và đổi vai trong hộp thoại | evidence/members-invite-open-1440-sang.png | Màn chỉ đọc theo dòng, hai thao tác hiếm (mỗi tuần) mở hộp thoại riêng nên danh sách luôn gọn ở cả điện thoại | Thêm một lần bấm để mở hộp, đổi lại không có ô nhập thừa trên màn | x |
| Biểu mẫu mời đặt sẵn trên đầu danh sách, đổi vai mở ngay trong dòng | evidence/members-huong-2.png | Mời người không cần mở gì, thấy ngay ô nhập | Ô nhập chiếm chỗ mọi lần mở màn dù hiếm dùng, vỡ thành nhiều tầng ở khổ 360; trái AC-9 đã ký (hộp thoại) |  |

### Khối

| Khối | Bậc | Đã tra | Ứng viên gần nhất | Vì sao không dùng |
| --- | --- | --- | --- | --- |
| PageHeader | trong-kho |  |  |  |
| PageSkeleton | trong-kho |  |  |  |
| PageState | trong-kho |  |  |  |
| FormDialog | trong-kho |  |  |  |
| Badge | trong-kho |  |  |  |
| Checkbox | trong-kho |  |  |  |
| Field | trong-kho |  |  |  |
| Input | trong-kho |  |  |  |
| Button | trong-kho |  |  |  |
| Danh sách người | ve-tay | design/component-registry.json (DataRegion, DataGridTable) và design/reui-catalog.json (c-table-1) | DataRegion | DataRegion và DataGridTable là khuôn Lưới sửa tại ô cho Đầu chủ (design/patterns/luoi.md), cột theo trường của hàng; c-table-1 là bảng ReUI mà luật kho cấm dựng bảng ngoài khuôn Lưới; màn này là danh sách vài chục dòng chỉ đọc nên dựng bằng một danh sách có nhãn |
