# Kế hoạch: số đo ghi không mất tầng (hàng 1l)

Hợp đồng: `_acceptance/so-do-ghi-khong-mat-tang/contract.md`. Thiết kế: `design.md` cùng thư mục. Hạng T3.

| # | Việc | Tệp | Kiểm từng việc | Phục vụ | Độc lập |
|---|---|---|---|---|---|
| 1 | Viết trước năm bài kiểm (ba bài phá thử theo dạng hỏng, một bài đường gỡ, một bài đối chứng lành), chạy thấy đỏ ở bốn bài đầu với lệnh hiện tại | `tools/round_metrics/round-metrics.test.ts` | `npx vitest run tools/round_metrics` — 4 bài mới đỏ, bài cũ xanh | E1–E5 | không |
| 2 | Thêm hàm đọc bản cũ: vắng → rỗng; lỗi hệ điều hành, không phải JSON, sai hình dạng → lỗi đầu vào có tên tệp, dạng hỏng, «khong ghi de» và hai đường gỡ; gọi trước mọi lần ghi | `tools/round_metrics/round_metrics.py` | `npx vitest run tools/round_metrics` — cả tệp xanh | E1–E5 | không |
| 3 | Phá thử: tạm đưa lại nhánh nuốt lỗi cũ, thấy bài 1–3 đỏ với đúng thông điệp ghim, rồi hoàn lại | (không commit) | như trên | E1–E3 | không |
| 4 | Một dòng `wiki/log.md`, chạy `make check` | `wiki/log.md` | `make check` | E5 | không |

Thứ tự: 1 → 2 → 3 → 4, một nhánh, không chạy song song. Mỗi bài mới có thời hạn riêng 60 giây.
