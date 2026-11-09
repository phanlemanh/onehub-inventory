# Gói đợt nen

Đợt Điều phối – Thợ đầu tiên của onehub-inventory. Chủ kho duyệt hàng, Cổng Đáng của từng hàng và quyền tự merge ở thẻ khởi tạo của `/dieu-phoi:mo-dot nen`, không phải ở đây.

## Điều kiện trước khi mở

1. Gói này và toàn bộ nền đã vào `main` trên kho GitHub riêng tư.
2. Bản vá T1-escape của kit đã phát hành và kho đã nâng bản.
3. Lộ trình đã chốt.
4. Docker đang chạy.
5. Mở từ một phiên mới ở checkout chính, để nạp gói `dieu-phoi`.

## Dãy

| Dãy             | Hàng theo thứ tự | Vì sao chung dãy                 |
| --------------- | ---------------- | -------------------------------- |
| G · giao diện   | 1a → 1b → 1c → 2 | Cùng chạm khung, Lưới và màn mẫu |
| D · dữ liệu mẫu | 1 → 3 → 6        | Hàng 3 và 6 chờ hàng 2 của dãy G |
| N · nền thật    | 7 → 8 → 9        | Không chạm giao diện, đều mức T3 |
