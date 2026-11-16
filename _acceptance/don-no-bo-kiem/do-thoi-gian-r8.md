# Đo ca phá «chỉ còn khung đầu» trước và sau lượt delta 8

Ngày: 2026-11-16. Máy: máy chủ kho (macOS), bản chậm CPU 4 lần, cỡ 1440, màn Hàng, một tiến trình chạy.
Lệnh: `npx playwright test tests/e2e/screens/screens.spec.ts --project=1440 -g "cham.*man inventory.*chi con khung dau" --repeat-each=6 --workers=1`.

| Bản | Sáu lần (giây) | Trung vị |
|---|---|---|
| Trước (`d0ba14a`, hàm đọc dòng đi qua cửa chung) | 11,6 · 12,9 · 20,5 · 8,7 · 8,2 · 28,5 | ≈ 12,3 |
| Sau (hàm đọc dòng đọc thẳng) | 8,4 · 19,9 · 10,1 · 14,8 · 10,8 · 18,3 | ≈ 12,9 |

Kết luận: cửa chung không phải nguyên nhân chính làm ô e2e đỏ trên CI ở `d0ba14a`.

Đếm tạm trong vòng cuộn (gỡ sau khi đo), ba lần: ca phá này cuộn 3, 49 và 7 nấc, mất 3,1 · 35,3 · 6,2 giây. Mỗi nấc mất 0,7–1 giây, vì ca phá cài một bộ theo dõi chạy lại trên mọi thay đổi của trang để giấu dòng. Bài thường cuộn 5–6 nấc, mất khoảng 0,1 giây mỗi nấc. Số nấc dao động vì dòng bị giấu làm chiều cao bảng đổi liên tục.

Trên CI của nhánh chính (`b6f4f29`), ca này đã mất 18,9 và 20,6 giây khi các bài cạnh nó mất 3,4–11 giây. Trên CI của PR, nó chạm trần 90 giây.

Đích đến: hàng siết bộ kiểm lần hai (chưa có trong lộ trình; G đưa vào Cổng Đáng kế).
