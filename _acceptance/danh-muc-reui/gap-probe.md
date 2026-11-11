---
slug: danh-muc-reui
at: 2026-11-11T01:45:00Z
verdict: findings
p0: 1
p1: 3
p2: 1
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design (sổ quyết định) | Dòng d-20261111T012410Z-6 ghi căn cứ mục tiêu, nhưng câu giao không loại được một máy chủ MCP chạy tại máy đọc cùng tệp; lý do thật là ranh giới của hàng | Cổng Phạm vi tin lựa chọn «do mục tiêu quyết» nên không xét phương án MCP tại máy; lượt sau đổi sang MCP cũng không phạm câu trích | Mỗi dòng mục tiêu phải trích câu loại được mọi phương án đã nêu | fixed: dòng mới d-20261111T013136Z-12 thay d-6, căn cứ một-lối — MCP phải khai trong .mcp.json và mô-đun trong src/, đều ngoài ranh giới |
| P1 | evals | E2–E7 dùng chung một lần chạy vitest; không eval nào ghim tên ca hay số ca; chiều đỏ của AC-5 và ca tự đỏ của bộ chặn chỉ nằm trong E8; bộ chặn chỉ thử fetch [go-hoi-khi-gop#F4] | Thợ bỏ ca đỏ hay viết ca đỏ chỉ kiểm mã thoát, vitest vẫn xanh, tám eval cùng PASS cho một ngưỡng chưa đo | Tên ca mở đầu bằng mã eval, reporter in tên ca, mỗi eval khai số ca chính xác; bộ chặn thử đủ bốn đường | fixed: reui_catalog_test chạy reporter verbose; mỗi eval khai danh sách ca và số ca (tổng 33); E5b mang chiều đỏ của AC-5; 4 ca 'E8 · blocker' cho fetch, http, https qua import có tên của ESM, net |
| P1 | design, contract, evals | Ảnh chụp được commit nguyên văn vào kho công khai nhưng bộ quét chuỗi cấm chỉ chạy trên danh mục | Một lần ghim lại sau đưa khối mã hay dòng Bearer vào ảnh chụp; danh mục vẫn sạch, kiểm xanh, mã Pro lên kho công khai | Quét chuỗi cấm cả ảnh chụp; ma trận E6 có bản sao ảnh chụp bị chèn; ghim lại từ chối nguồn có chuỗi cấm | fixed: AC-6 mở cho ảnh chụp, E6 thành ma trận 9 phần tử gồm 2 chèn vào ảnh chụp, AC-7 và E7 thêm ca ghim lại từ chối; sổ d-20261111T013136Z-13 |
| P1 | evals | E9 hỏi lệnh có chạy được không nhưng hội đồng chỉ đọc README | README sai tên cờ hay câu bằng chứng khác đầu ra thật mà vẫn tự nhất quán, hội đồng cho PASS | Eval script chạy mọi dòng lệnh của README và so câu bằng chứng với đầu ra thật | fixed: thêm E10 (script) chạy dòng lệnh của README dưới bộ chặn mạng và so câu bằng chứng; E9 chỉ còn hỏi đủ và rõ |
| P2 | evals | Không eval nào khai đường dẫn của lệnh suy từ vị trí tệp lệnh; ca bản sao có thể ghi đè kho thật [go-hoi-khi-gop#F3] | build.mjs lấy gốc từ thư mục đang chạy; ca ghim lại trong vitest ghi đè ảnh chụp và danh mục thật, E7 vẫn xanh, cây bẩn sau make test | Gọi lệnh của bản sao bằng đường tuyệt đối từ thư mục khác; khẳng định git status của kho thật rỗng sau mỗi ca | fixed: đầu evals.yaml khai cách dựng bản sao và khẳng định git status rỗng sau mỗi ca dùng bản sao; AC-8 thêm «cây làm việc không đổi» |
