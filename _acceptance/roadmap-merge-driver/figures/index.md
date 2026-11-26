# Hình tại điểm quyết định — Cổng Phạm vi của roadmap-merge-driver

| Điểm | Đếm | Hình |
| --- | --- | --- |
| K1: một dòng `.gitattributes`, và việc phải làm sau mỗi lần gộp (dòng sổ 3, 4) | 5 bước nối tiếp, 2 nhánh rẽ | `sau-gop` |
| Hỏi-2: K6 đi cùng vòng này, tách vòng, hay chủ kho tự áp (dòng sổ 7) | 3 nhánh rẽ | `k6-ba-loi` |
| Hỏi-1: «mốc» là mốc của kit hay bản minor của repo-setup (dòng sổ 6) | 2 nhánh rẽ | `moc-hai-nghia` |
| Trang quyết định đặt ở `wiki/decisions` (dòng sổ 5) | dưới ngưỡng: 1 bước, 1 nhánh | — |
| Bỏ bộ quét độ phủ, bỏ đặc tả UX (dòng sổ 8, 9) | dưới ngưỡng: 1 bước, 1 nhánh | — |

## Đề bài `sau-gop` (flowchart)

Gộp nhánh chính vào nhánh PR khi hai bên cùng vẽ lại `LO-TRINH.html`.

- Nút: «git merge origin/main» → rẽ «Bản kéo có driver?» (đã chạy `make setup`).
- Nhánh «có»: «Gộp sạch, giữ trang của nhánh» → «Vẽ lại: product-map.mjs --root .» → «Commit» → «product-map --check xanh».
- Nhánh «chưa»: «Xung đột ở LO-TRINH.html, như hôm nay» → «make setup rồi gộp lại».
- Ghi chú bên lề: «Trang PR trên GitHub vẫn báo xung đột: GitHub không chạy driver của máy». «Lời dạy nằm ở docs/START-HERE.md».
- Tiêu chí liên quan: AC-1, AC-2, AC-3, AC-4.
- Hình vẽ trước phản biện: chưa có ca 9 (nhánh mở trước vòng này còn xung đột một lần) và chỗ đặt lời dạy nay là Hỏi-3.

## Đề bài `k6-ba-loi` (ba lối song song, mỗi lối một cột)

Hỏi-2: đưa `_acceptance/**/rang/**` ra khỏi phạm vi quét CodeQL bằng bốn dòng trong `.github/workflows/security.yml`.

- Lối A (máy khuyên): «Đi cùng vòng này» — máy áp đúng bản vá chủ kho duyệt · 1 PR · 2 lượt chạy trọn bộ kiểm · AC-6.
- Lối B: «Tách vòng riêng» — 2 PR · 4 lượt chạy trọn bộ kiểm · thêm 1 lượt duyệt.
- Lối C: «Chủ kho tự áp» — chủ kho commit bốn dòng · máy chỉ đo.
- Chân hình: «Cả ba lối: bốn cảnh báo chỉ đóng ở lần quét kế trên main».

## Đề bài `moc-hai-nghia` (hai lối cạnh nhau)

Hỏi-1: «gom theo mốc, trừ bản vá chữa lỗi kho đang vấp» — mốc là gì.

- Lối A (máy khuyên): «Mốc của kit nghiệm thu (3.1, 3.2…)» — một vòng nâng repo-setup đi cùng dịp kho nhận mốc kit, lấy bản mới nhất lúc đó.
- Lối B: «Bản minor của repo-setup (0.11.0, 0.12.0…)» — nhịp theo công cụ, có thể dày hơn.
- Chung cho cả hai: «Bản vá chữa lỗi kho đang vấp thì nâng ngay».
- Tiêu chí liên quan: AC-5.
