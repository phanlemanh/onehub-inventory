# Hình tại điểm quyết định — bo-o-tim-cua-vung

| Điểm | Đếm | Hình |
|---|---|---|
| Hỏi-1 hàng ô lọc luôn hiện hay sau nút «Lọc» | dưới ngưỡng: hai lối, không bước nối tiếp — ảnh bản bấm được thay hình | `proto/*-nut-*`, `proto/*-luon-*` |
| Hỏi-2 bản sao thiếu lịch sử | cần hình: ba nhánh rẽ (a, b, c) và bốn điều kiểm nối tiếp | `cua-mien.html`, `cua-mien.png` |
| Bỏ quét độ phủ (dòng sổ descope) | dưới ngưỡng: một quyết định, không nhánh | — |
| Bỏ đường đo (dòng sổ descope) | dưới ngưỡng: một quyết định, không nhánh | — |

## Đề bài: cua-mien

- Loại hình: sơ đồ luồng (flowchart), ngang.
- Nút: «Cặp miễn trong sổ khối» → «Commit có trong bản sao?» → nếu không: ba nhánh (a) «CI lấy đủ lịch sử — chủ kho sửa
  một dòng», (b) «Công cụ tự lấy commit, cha và lịch sử sổ khối từ kho gốc» (khuyên, tô nổi), (c) «Chỉ báo không kiểm
  được — không đỏ» (tô cảnh báo) → bốn điều kiểm nối tiếp: commit có thật · thêm đúng tệp của khối · ngày bằng ngày khai ·
  trước ngày sổ khối ra đời → «Miễn» hoặc «Đỏ, mã riêng».
- Nhãn bằng tiếng Việt, đúng chữ ở trên.
- AC liên quan: AC-10.
