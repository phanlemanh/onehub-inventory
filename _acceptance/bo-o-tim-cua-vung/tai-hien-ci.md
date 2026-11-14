# Tái hiện bài trình duyệt của CI ở máy dãy (Chromium Linux)

Dùng khi một bài trình duyệt xanh ở máy dãy (macOS) mà đỏ trên CI (ubuntu). Khác biệt đo được ở hàng 2e: phông Inter trên
Chromium Linux rộng 9,00 điểm ảnh mỗi ký tự lưới, trên macOS 8,84; máy CI chậm hơn nhiều lần.

1. Kéo đúng bản Playwright của kho: `docker pull mcr.microsoft.com/playwright:v<bản>-noble` (bản in bởi `npx playwright --version`).
2. Chạy máy chủ trình duyệt trong container, kèm một bộ chuyển cổng để trình duyệt gọi được `127.0.0.1:<cổng dãy>` (máy dev
   Next chặn tài nguyên khi tên máy khác `127.0.0.1`):
   `docker run -d --rm --name pw-<dãy> -p 3999:3999 --add-host=host.docker.internal:host-gateway mcr.microsoft.com/playwright:v<bản>-noble bash -c 'node -e "<chuyển 127.0.0.1:<cổng> → host.docker.internal:<cổng>>" & npx -y playwright@<bản> run-server --port 3999 --host 0.0.0.0'`
3. Một tệp cấu hình tạm (không commit) kế thừa `playwright.config.ts`, thêm `connectOptions: { wsEndpoint: "ws://127.0.0.1:3999/" }`
   cho mọi khổ; chạy `E2E_PORT=<cổng dãy> npx playwright test -c <tệp tạm> <tệp bài>`. Máy dev vẫn chạy ở máy dãy.
4. Máy CI chậm: trong bài thử, `newCDPSession(page)` rồi `Emulation.setCPUThrottlingRate` với `rate: 6`.

Ở 2e cách này tái hiện đúng hai bài đỏ của CI («vừa 8 cột ở 1440» và «/ trong ô lọc» của ô ⌘K) trước khi sửa.
