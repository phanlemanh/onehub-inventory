# Sửa sau Cổng Phạm vi — kiem-vai-theo-man

Chủ kho phê ở Cổng Bằng chứng. Giám sát đã quyết tạm (tin D-1311-21, 2026-11-13) để dãy không dừng giữa hai cổng.

## AC-11 — cách đọc nút mỗi vai thấy

| | Lời |
|---|---|
| Đã ký | «… mỗi nút theo quyền đang hiện mang dấu thao tác; … dấu là một thuộc tính gắn lên chính phần tử nút, không thêm phần tử nào vào trang …» |
| Đề nghị | «… nút theo quyền ghi lại mỗi quyết định của nó — cho hiện hay chặn, kèm phạm vi — vào một sổ chỉ có khi bộ kiểm bật cờ lúc dựng; không thêm phần tử hay thuộc tính nào vào trang; bộ kiểm so sổ ấy với bảng. Mỗi màn có nút theo quyền giữ ít nhất một phép so nút thật theo tên hiển thị, cho một vai được và một vai bị chặn …» |

Vì sao: con của nút theo quyền là hộp thoại và menu lồng nhau (hộp mời, hộp đổi vai, hộp lưu cách xem, menu cách xem), không
chuyển thuộc tính xuống nút thật. Giữ đúng lời đã ký phải sửa bốn tệp dùng chung (hộp thoại biểu mẫu, nút lưu cách xem, menu
cách xem, hộp đổi vai) mà hàng 4, 2e, 7e đang sửa.

Bốn điều kiện giám sát đặt, và chỗ giữ:

1. Sổ chỉ bật khi bản dựng mang cờ của bộ kiểm; bản thật không mang đường ghi nào chạy được (cờ được thay thành hằng lúc dựng,
   nhánh ghi là mã chết). Máy dev của bộ trình duyệt có cơ sở dữ liệu bật cờ — đó là bản dựng mà bộ ấy chạy ở máy dãy và, sau
   hàng 1s, ở CI.
2. Sổ ghi cả hai chiều: thao tác được cho hiện và thao tác bị chặn, kèm phạm vi — ma trận so được cả ô «không nút nào».
3. Giữ mọi phép đo trên trang thật đang có (bộ bài bộ nút, màn Thành viên); thêm phép so nút thật theo tên hiển thị trên mỗi màn
   có nút theo quyền.
4. Mục này.

Bài chấm bị ảnh hưởng: E14 (đọc sổ thay vì đọc thuộc tính), E16 (cây trang có và không có nút theo quyền giống hệt; sổ có cả
hai chiều; bản dựng không cờ không ghi gì).

## Chỗ tầng cao thứ ba — danh sách bài chờ của bộ kiểm chung

Đúng một dòng thêm vào `tools/e2e_templates/settle.ts` (`CHO_TESTS`): đăng ký bài mới «thanh ben theo vai» của
`tests/e2e-db/vai-man.spec.ts`. Không đổi luật nào của công cụ.

Vì sao buộc phải có: bài thanh bên ở khổ 360 mở ngăn điều hướng bằng hàm chờ dùng chung; luật của bộ kiểm chung (hàng 1r)
đòi mọi bài như vậy có tên trong danh sách để chạy lặp dưới máy chậm, thiếu thì `make check` đỏ. Chỗ này không nằm trong hai
chỗ tầng cao chủ kho đã cho ở Cổng Phạm vi (công cụ sinh bảng, nút theo quyền); giám sát cho giữ trên nhánh để lượt chấm chạy,
chủ kho phê ở Cổng Bằng chứng.

Nếu chủ kho không cho: hoàn lại dòng ấy và bỏ phần thanh bên ở khổ 360 khỏi bài (AC-7 khi ấy chỉ đo ở 1440, ghi giới hạn).
