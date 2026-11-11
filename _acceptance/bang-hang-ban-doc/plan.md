# Kế hoạch: Bảng hàng bản đọc (hàng 2)

Hồ sơ: `_acceptance/bang-hang-ban-doc/` · thiết kế: `design.md` · hạng T3. Làm tuần tự trong một phiên; mỗi việc xong thì
chạy lệnh kiểm của việc ấy. Mọi phép đo mới có cặp hai chiều trên cùng dữ liệu (xanh trên vật lành, đỏ với thông điệp ghim
khi phá).

| # | Việc | Tệp | Kiểm bằng | Phục vụ | Độc lập |
|---|---|---|---|---|---|
| 1 | Thêm năm nhãn cột (chỉ thêm dòng) và dòng thuật ngữ, sinh lại | `ontology/labels.yaml`, `ontology/glossary.md`, `src/generated/**`, `design/component-registry.json` | `make gen && npx vitest run tests/language.test.ts` | E9 | có |
| 2 | Hàm dựng dòng Bảng hàng, bộ đọc trạng thái theo môi trường, thành phần vùng chỉ khai cột và dòng | `src/modules/listings/ui/index.tsx`, `src/modules/listings/ui/inventory-grid.tsx`, `tests/inventory.test.tsx` | `npx vitest run tests/inventory.test.tsx` | E1, E2, E6 | không (cần 1) |
| 3 | Trang Bảng hàng ghép dữ liệu mẫu và đặt vùng dưới đầu màn; bài kiểm gọi chính hàm trang | `src/app/(app)/inventory/page.tsx`, `tests/inventory-page.test.tsx` | `npx vitest run tests/inventory-page.test.tsx`, mở `/inventory` ở cổng 3481 | E2, E3, E6, E12 | không (cần 2) |
| 4 | Bộ bài: gỡ Bảng hàng khỏi danh sách «chưa có vùng»; bài tìm đọc cỡ trang thật của vùng | `tools/e2e_templates/recipes.ts`, `tools/e2e_templates/e2e-templates.test.ts` | `npx vitest run tools/e2e_templates` | E4, E5 | có |
| 5 | Ghi cỡ trang 25 vào sổ hành vi và một dòng quyết định | `design/behaviors.md`, `design/decisions.yaml` | `make check` (kiểm thiết kế) | E2 | có |
| 6 | Chạy bộ bài sinh từ sổ màn trên Bảng hàng; tệp chứng minh màn mẫu; đổi dòng màn mẫu của họ Lưới; bài tự kiểm phép kiểm ma trận | `_acceptance/bang-hang-ban-doc/chung-minh-man.md`, `design/patterns/luoi.md`, `tests/proof-matrix-self.test.ts` | `npx playwright test tests/e2e/screens`, `python3 tools/proof_gate/check.py --root .`, `npx vitest run tests/proof-matrix-self.test.ts` | E3, E7, E8 | không (cần 2–5) |
| 7 | Ảnh bốn khổ sáng tối cho bằng chứng; một dòng nhật ký wiki; sinh lại bản đồ sản phẩm | `_acceptance/bang-hang-ban-doc/evidence/**`, `wiki/log.md`, `PRODUCT-MAP.md`, `LO-TRINH.html` | `make check`, `make e2e` | E10, E11 | không (cần 6) |

Thứ tự: 1 → 2 → 3 → 4 → 5 → 6 → 7. Xong thì hợp đồng sang `implemented` và chấm S4 bằng lượt `s4` của đợt.

Rủi ro đã biết: hai lỗi nhỏ của bản chạy chậm của bộ bài (1f) có thể đỏ giả — gặp thì báo giám sát, không sửa bộ bài
ngoài hai chỗ ở việc 4.
