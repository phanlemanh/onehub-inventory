# Hình tại điểm quyết định — du-lieu-mau

| Điểm | Đếm | Hình |
|---|---|---|
| Hỏi-1 chủ nhà gắn với lần chào hay với căn | hai nhánh rẽ (gắn lần chào · gắn căn trong sàn) | cần hình: `chu-nha-gan-dau.html` |
| Hỏi-2 tên toà Ocean Park 2, 3 | dưới ngưỡng: một giá trị dữ liệu, không nhánh cấu trúc | — |
| Hỏi-3 nhãn MAU một lớp hay hai lớp | dưới ngưỡng: một quy ước giá trị, không nhánh cấu trúc | — |

## Đề bài `chu-nha-gan-dau`

- Loại hình: sơ đồ quan hệ dữ liệu, hai cột so sánh A | B.
- Nút chung: Sàn mẫu · Danh mục căn dùng chung (không thuộc sàn) · Căn · Lần chào (thuộc sàn) · Liên hệ (thuộc sàn, mang số).
- A (khuyến nghị): Căn —«được chào thành»→ Lần chào ←«là chủ của»— Liên hệ; nhãn «quan hệ đã có trong ontology».
- B: Căn ←«là chủ của (trong phạm vi sàn)»— Liên hệ; nhãn «quan hệ mới, phải đổi ontology»; ghi «danh mục dùng chung không giữ liên hệ riêng của sàn».
- AC liên quan: AC-6, AC-7, AC-8.
