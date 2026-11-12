# Hình tại điểm quyết định — danh-muc-can-nhu-onehub-invest

| Điểm | Đếm | Hình |
|---|---|---|
| Hỏi-3 · bảy thay đổi mô hình nghiệp vụ | 5 cấp nối tiếp (dự án → phân khu → toà → trục → căn) + nhánh toà thẳng dưới dự án + bí danh | cap-danh-muc |
| Hỏi-1 · khoá sàn trên danh mục | hai lối, một bước | dưới ngưỡng: 1 bước, 2 lối |
| Hỏi-2 · tên toà là cột hay bí danh | hai lối, một bước | dưới ngưỡng: 1 bước, 2 lối |

## Đề bài: cap-danh-muc

- Loại: cây cấp (tree), trái sang phải.
- Nút: Dự án (SubdivisionName) → Phân khu (ComplexName) → Toà (bld_…) → Trục (stk_…) → Căn (unt_…, tầng dạng chữ); nhánh
  phụ Dự án → Toà (khi không có phân khu); hộp Mã gốc (bí danh) nối tới Toà, Trục, Căn.
- Nhãn: tên tiếng Việt + tên RESO nhỏ bên dưới; ghi chú «khoá sàn: agreement_id trên mỗi dòng (Hỏi-1)».
- AC liên quan: AC-1, AC-3, AC-4.
