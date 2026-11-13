# Hình tại điểm quyết định — ung-dung-noi-bang-vai-khong-chu

| Điểm | Đếm | Hình |
|---|---|---|
| Hỏi-1 · cửa từ chối vai nối về được vai chủ: mọi môi trường hay chỉ bản thật | hai nhánh rẽ (mọi môi trường · chỉ bản thật), ba bước nối tiếp (nối → kiểm vai → chạy/từ chối) | `vai-noi-va-cua.html` |
| Các dòng S1 máy đã quyết (vai mới, phá trong giao dịch rút lại, ca phiên thật, bài kiểm đổi chuỗi nối) | dưới ngưỡng: không rẽ nhánh người quyết | — |

## Đề bài: vai-noi-va-cua

- Loại hình: sơ đồ luồng (flowchart), hai làn: «Hôm nay» và «Sau hàng 7c».
- Hôm nay: Ứng dụng nối bằng vai chủ bảng → cửa đổi sang vai API trong giao dịch → mã trong cửa «trả vai» → về vai chủ → đọc ghi mọi sàn (đỏ).
- Sau 7c: Ứng dụng nối bằng vai đăng nhập (không chủ, chỉ là thành viên vai API, không kế thừa) → cửa kiểm vai nối (lần đầu mỗi pool) → đạt: đổi sang vai API, luật theo dòng áp → mã trong cửa «trả vai» → về vai đăng nhập, không đọc được bảng nào (xanh); không đạt (vai về được vai chủ hay vượt luật) → cửa từ chối, không câu nào chạy.
- Nhánh Hỏi-1 cạnh bước «cửa kiểm vai nối»: A (máy khuyên) áp mọi môi trường — máy dev cũng phải dùng chuỗi nối mới; B chỉ áp bản thật — máy dev giữ chuỗi nối vai chủ được.
- AC liên quan: AC-2, AC-6, AC-7.
