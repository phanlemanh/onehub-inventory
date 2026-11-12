# Kế hoạch: bảng quyền theo vai (hàng 9a)

Thiết kế: `_acceptance/bang-quyen-theo-vai/design.md`. Hợp đồng và kế hoạch đo: `contract.md`, `evals.yaml` cùng thư mục.
Làm tuần tự trong một phiên (các việc nối nhau: bảng → mã sinh → cơ sở dữ liệu → API → bài kiểm). Mỗi phép đo mới đi kèm
cặp phá thử trên cùng bản sao, đỏ với thông điệp ghim.

| # | Việc | Tệp | Kiểm từng việc | Phục vụ | Độc lập |
|---|---|---|---|---|---|
| 1 | Bộ sinh hiểu bảng quyền: đọc `scope`, `status`, `states`, `doors`, `exempt`; suy `roles` từ `scope`; kiểm khuôn năm lỗi (vai lạ, phạm vi lạ, sống không cửa, nháp có cửa, sống khai trạng thái); mang mọi trường sang mã sinh. *Chờ giám sát cho chạm `tools/` (N-8).* | `tools/ontology_actions.py` | `make ontology`, `make gen`, bài 'kiem-khuon-bang' với cặp phá thử | E1 | không |
| 2 | Viết bảng: 7 dòng sống, 5 dòng nháp, danh sách miễn; sinh lại mã | `ontology/actions.yaml`, `src/generated/ontology.ts` | `make gen && make ontology`; bài 'bang-sinh-du-dong' | E1 | không |
| 3 | Hàm thuần cộng quyền và cửa API chung: `allowedScope(roles, action)` ở cửa công khai, `requireAction(ctx, action)` ở cửa máy chủ | `src/modules/identity/permissions.ts`, `index.ts`, `server.ts`, `permissions.test.ts` | `bang_quyen_unit`: 'cong-quyen-15-to-hop' (105 assert), 'khong-vai-khong-quyen', phá thử lấy hẹp nhất | E2 | không |
| 4 | Bài quét route: mọi route `/api/v1` × phương thức phải có dòng hay nằm trong miễn; mọi cửa API khai phải có thật | `src/modules/identity/permissions.test.ts` | 'route-ngoai-bang', 'cua-api-khai-ma-khong-co', phá thử thêm route POST trên bản sao | E5 | không |
| 5 | Migration 006 (bằng `/new-migration`): bảng `app.permissions` và hạt; `app.allowed(text)`; viết lại ba hàm quản trị người và `member_roles` không đổi; luật đọc `company_members`; luật ghi, đọc `agreements`; khai ngoại lệ danh mục dùng chung trong bộ kiểm cách ly | `db/migrations/006_bang_quyen_theo_vai.sql`, `db/tests/cach-ly.sql` | `make db-up DB_LANE=n DB_PORT=5563`; `cach_ly_n` | E7, E10, E11, E12, E13 | không |
| 6 | Bộ xử lý thành viên gọi `requireAction` trước khi chạm dữ liệu; lời từ chối một thân | `src/modules/identity/members-http.ts` | `bang_quyen_unit`, `moi_nguoi_db` | E3, E8 | không |
| 7 | Bài cơ sở dữ liệu: 'csdl-theo-bang' (40 ô), 'ban-chep-khop-bang', 'quyen-csdl-ngoai-bang', 'quan-tri-nguoi-qua-bang', 'bang-thanh-vien-chi-dong-minh', 'thoa-thuan-chi-quan-tri', 'bang-quyen-dung-chung', mỗi ca một cặp phá thử | `tests/db/bang-quyen.db.test.ts` | `bang_quyen_db` | E4, E6, E7, E10, E11, E13 | không |
| 8 | Bài API: 'api-theo-bang' (12 ô) với phiên thật, đếm ô, phá thử đổi một ô | `tests/db/bang-quyen-api.db.test.ts` | `bang_quyen_db` | E3 | không |
| 9 | Ghi lại: luật Thành viên trỏ bảng, thuật ngữ «Thao tác», «Phạm vi», trang thực thể, sổ wiki | `ontology/entities/Member.yaml`, `ontology/glossary.md`, `wiki/entities/member.md`, `wiki/log.md` | `make ontology` | E7, E14 | có |
| 10 | Chạy lại bài hàng 9 và bài trình duyệt Thành viên trên cây mới; `make check` một lần | — | `moi_nguoi_db`, `moi_nguoi_e2e`, `make check` | E8, E9 | không |

Thứ tự: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10. Việc 1 và 9 chạm tệp ngoài ranh giới của dãy N; nếu giám sát không cho
chạm `tools/`, việc 1 đổi sang lối lùi đã ghi ở thiết kế (bảng viết tay trong mô-đun danh tính kèm bài so với
`actions.yaml`) và báo lại ở Cổng Bằng chứng.
