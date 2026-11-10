---
type: decision
title: Rào thiết kế phải đỏ được
links: [design/decisions.yaml, tools/design_check.py, eslint.config.js, playwright.config.ts]
sources: ["user, 2026-11-09", "rà soát độc lập tại commit 5abf972"]
---

# 0015 Rào thiết kế phải đỏ được

## Status

Accepted, 2026-11-09.

## Context

Rà soát độc lập cho thấy tỉ lệ tất định chỉ xem tệp có tồn tại không, ba cam kết trên trình duyệt không nằm trong cổng, và lint bỏ lọt kích thước tự đặt. Chủ kho duyệt thứ tự vá.

## Decision

Một lệnh kiểm chỉ được tính khi nó đỏ được: bài kiểm ghi rõ `decision:<id>`, công cụ phải do `make` chạy, luật lint phải đang bật, kiểm trình duyệt phải nằm trong bộ lệnh của kit. Dùng `@shadcn/lint` cho giá trị tự đặt, sửa kiểu linh kiện và style nội tuyến, và thêm hai luật riêng cho phần gói này bỏ qua: bước ngoài thang và lớp ghép động. Kiểm trình duyệt luôn tự mở máy chủ riêng ở cổng 3471, không dùng lại máy chủ đang chạy.

Không chọn:

- Tự viết toàn bộ luật lint: đã có chuẩn thì dùng chuẩn.
- Giữ gợi ý sửa của gói: nó đổi `h-[37px]` thành `h-9.25`, vẫn lệch thang.

## Consequences

- Tỉ lệ tất định của kho mới không so với 35 % của Quỹ hàng vì mẫu số khác.
- Sổ tất định viết dạng khối để đọc được khi không có PyYAML. Khoá lạ bị báo lỗi, và kiểm tra này đã bắt hai dòng từng bị đọc sai.
- Chạy kiểm trình duyệt khi đang mở máy chủ dev trong cùng thư mục có thể báo lỗi. Lỗi này là chủ ý, tốt hơn là kiểm nhầm bản khác.
- CI chưa chạy kiểm trình duyệt: tệp CI do người sửa.
- Mã ReUI Pro không qua được `noUncheckedIndexedAccess` và không được sửa tay, nên cờ này nằm ở `tsconfig.strict.json` và `tools/typecheck_own.mjs` chỉ tính lỗi trong mã của kho.
- Không khai lệnh gate của kit: lệnh này cần trang chụp sẵn và chưa đọc được màu Tailwind 4. Tương phản do axe trong kiểm trình duyệt đo, nên mỗi màn mới phải được thêm vào bài axe.
- Bước S3 của kit chạy `make gen` để tệp sinh được cập nhật ngay trong vòng.
