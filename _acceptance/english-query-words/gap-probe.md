---
slug: english-query-words
at: 2026-11-23T09:30:00Z
verdict: findings
p0: 1
p1: 4
p2: 0
claims_input: ok
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design | Dòng sổ chọn chín từ mới trích câu «dùng tên trong từ điển», nhưng câu ấy chỉ quyết được unit, building, subdivision; sáu từ kia (record, place, view, role, sample=edge, permission=denied) lấy theo tên trong mã, và theo đúng câu trích thì ngăn hồ sơ lẽ ra là listing=. Câu trích liên quan mà không quyết, như [nang-kit-3-1#F1] và [lui-ban-luc-xoay-mat-khau#F2]. | Chủ kho ký vì tin chín từ do luật kho quyết; sau khi gộp record= đã vào tin hỏi đầu chủ, muốn đổi sang listing= phải thêm bảng dịch thứ hai và một vòng nữa; giá «đổi ở bước làm» ghi thấp hơn thật. | Thay dòng cũ: giữ căn cứ từ điển cho ba từ ô tìm, sáu từ kia thành câu hỏi người ở Cổng Phạm vi, sửa giá sai thành cần thêm bảng dịch sau khi gộp. | fixed: dòng mới thay d-20261123T090449Z-3 (ba từ ô tìm theo từ điển) và Hỏi-3 (sáu từ còn lại, lối khác listing= và saved-view=, giá sau khi gộp); human-gate1 |
| P1 | evals | AC-6 hứa góc nhìn lưu trước vòng vẫn mở đúng, nhưng E7 chỉ in tên năm khoá, không xét giá trị trong query và filters; E6 lưu rồi mở bằng chính mã mới. | Nếu vật lưu mang từ truy vấn trong giá trị, góc nhìn cũ mở mà mất lọc; E7 và E6 vẫn xanh. | Ca mở một góc nhìn do bộ ghi thật tạo ra, so ô tìm, lọc, sắp xếp; E7 in kiểu giá trị từ bộ đọc. | fixed: E7 thành ca khứ hồi qua bộ ghi thật storedView và bộ đọc gridView với lọc theo nơi, trạng thái và chữ tìm, đòi vật lưu không mang từ cũ hay mới, kèm chiều đỏ có thông điệp ghim |
| P1 | evals | Ma trận ngữ cảnh của lệnh quét thiếu has, delete và khoá object dựng địa chỉ; tự thử chỉ chín bản sao, không chứng mỗi ngữ cảnh đều bắt được. | Còn sót một has("ho-so") hay delete("toa"); lệnh quét in chạm 0, tự thử vẫn đạt. | Thêm ba ngữ cảnh; tự thử một bản sao mỗi ô từ × ngữ cảnh. | fixed: 11 ngữ cảnh trong design doc, hợp đồng và E1; tự thử 99 ô xoay qua năm vùng cộng ca lệch danh sách giữ, in 100/100, mỗi ô một tên ca |
| P1 | contract | AC-4 đi qua cổng đăng nhập và chuyển hướng phía máy chủ mà không gắn cross-layer; bằng chứng chỉ là ảnh cho giám khảo và bài đơn vị dựng trang bằng tay; «một bước chuyển hướng» không có số đo; câu hỏi ảnh đòi «đúng căn» mà đầu vào không nói căn nào. | Cổng đăng nhập ghi next= bằng địa chỉ cũ, sau đăng nhập đi hai bước hay lặp vòng; bài đơn vị vẫn xanh, giám khảo chấm đúng mà không biết căn nào đúng. | Gắn cross-layer, thêm ca máy trên Postgres thật đi qua đăng nhập, đếm bước chuyển hướng; bước ảnh in liên kết cũ, mã căn và nơi mong đợi. | fixed: AC-4 gắn cross-layer và hứa đúng một bước dịch; E18 (backend-effect) chạy ca lien-ket-cu trên Postgres qua đăng nhập; E17-ui in liên kết cũ, mã căn và tên nơi dưới khung |
| P1 | evals | Vài vế Then không eval nào ghim: mở bằng record= và câu báo khi id đã xoá; permission=denied trên bản thật; quyen=khong không còn tác dụng chỉ đo trong bảng dịch của Bảng hàng vốn không chạm /proto. | Trang đọc sai tên hằng record hay ca căn đã xoá ra ngăn trống; bản mẫu hành vi vẫn đọc quyen; mọi eval vẫn xanh. | Thêm các ca ấy vào E4, E9, E11; bỏ quyen khỏi E2. | fixed: E4 ghim record= mở đúng ngăn và câu báo id đã xoá; E9 thêm permission=denied trên bản thật; E11 thêm ca quyen-cu với đối chứng dương; E2 còn 22 assert, không còn quyen |
