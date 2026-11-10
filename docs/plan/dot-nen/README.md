# Gói đợt nen

Đợt Điều phối – Thợ đầu tiên của onehub-inventory. Chủ kho duyệt hàng, Cổng Đáng của từng hàng và quyền tự merge ở thẻ khởi tạo của `/dieu-phoi:mo-dot nen`, không phải ở đây.

## Điều kiện trước khi mở

1. Gói này và toàn bộ nền đã vào `main` trên GitHub.
2. Bản vá T1-escape của kit đã phát hành và kho đã nâng bản.
3. Lộ trình đã chốt.
4. Docker đang chạy.
5. Mở từ một phiên mới ở checkout chính, để nạp gói `dieu-phoi`.

## Dãy

| Dãy                | Hàng theo thứ tự      | Vì sao chung dãy                                                                             |
| ------------------ | --------------------- | -------------------------------------------------------------------------------------------- |
| K · khung và màn   | 1a → 1b → 1e → 1c → 2 | Cùng chạm khung, Lưới và màn mẫu                                                             |
| H · hệ và thước đo | 1h → 1d → 1g → 1f     | Rào và công cụ, không chạm màn. Hàng 1a chờ mốc của 1h, hàng 1f chờ 1e, hàng 1c chờ 1d và 1g |
| D · dữ liệu mẫu    | 1 → 3 → 6             | Hàng 3 và 6 chờ hàng 2 của dãy K                                                             |
| N · nền thật       | 7 → 8 → 9             | Không chạm giao diện, đều mức T3                                                             |
