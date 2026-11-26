---
slug: sua-ba-luat-lint-giao-dien
at: 2026-11-26T06:30:00Z
verdict: findings
p0: 0
p1: 2
p2: 2
claims_input: ok
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
| --- | --- | --- | --- | --- | --- |
| P1 | evals | Không phép đo nào đọc kết luận thật của công cụ thiết kế; E5 đọc khai báo trong design/theme.json, E6 chỉ kiểm chuỗi «make check passed»; mẫu công cụ báo lọt không được ghim. | Sổ ghi phép kiểm lint cho lint-exceptions nên E5 xanh, nhưng khi chạy mẫu /* eslint-disable */ của công cụ vẫn lọt; công cụ hạ quyết định xuống «khai» mà vẫn thoát 0; cổng duyệt PR còn đúng lỗ vòng này vá. | Phép đo chạy công cụ và khẳng định ba dòng «giữ»; chiều đỏ với luật của điểm gộp; ghim danh sách mẫu vào Coverage. | fixed: E5 nay chạy tools/design-assembly/check.mjs --rate của cây và đọc dòng «held … (eslint:<luật>, re-run here)»; chiều đỏ là worktree của HEAD mang luật điểm gộp → «E5 KHÔNG GIỮ: spacing»; Coverage ghim nguyên văn chín mẫu công cụ in «lọt». |
| P1 | contract | AC-4 thiếu đối chứng cho tác dụng phụ của bộ hậu xử lý: chỉ gỡ nhãn của luật lý do, và sửa tự động vẫn chạy. | Bộ hậu xử lý gỡ nhãn của mọi báo cáo, hoặc thiếu supportsAutofix; ngoại lệ hợp lệ lại kêu hay sửa tự động thôi chạy mà không phép đo nào đỏ. | Hai ca: ngoại lệ có lý do cho luật khác phải ra 0 báo cáo; lint có sửa tự động phải sửa; mỗi ca có chiều đỏ ghim. | fixed: AC-4 và E4 thêm «other rules stay suppressed» (kèm tiền đề luật ấy có báo khi không có ngoại lệ) và «autofix still runs on screen files»; E8 thêm hai bản phá bộ hậu xử lý với hai dòng ghim. |
| P2 | contract | Ma trận chưa đủ: AC-1 không có lớp kích thước; AC-2 thiếu &&, hai-gạch-đứng, clsx, cva và chuỗi bên phải trên className. | <div className={on && "bg-" + tone} /> hay w-[200px] lọt trong khi E1, E2 xanh. | Viết trước ma trận họ lớp × tiền tố, dạng ghép × chỗ đọc; liệt kê từng dòng chặn trong expected. | fixed: AC-1 tám mẫu (ba khoảng cách, năm kích thước, có và không tiền tố); AC-2 chín mẫu (trái, phải, ? :, &&, hai-gạch-đứng, className, cn, clsx, cva); Coverage thêm hai trục; expected liệt kê từng mẫu. |
| P2 | design | Thay đổi quy ước (d-5) không có trang wiki/decisions/ và dòng nhật ký như AGENTS.md đòi. | Phiên sau gặp ngoại lệ bị chặn, tra wiki không ra vì sao, rồi nới luật lại. | Thêm trang quyết định trỏ d-5 và d-6 cùng dòng nhật ký; gắn vào AC-6. | fixed: AC-6 đòi một trang wiki/decisions/ trỏ d-20261126T061152Z-5 (E10, chiều đỏ trên thư mục trống); trang viết ở S3 theo câu trả lời Hỏi-1; dòng nhật ký wiki đã có trên nhánh. |
