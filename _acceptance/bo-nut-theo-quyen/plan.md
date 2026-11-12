# Kế hoạch dựng — bo-nut-theo-quyen (hàng 9e, T3)

Điều kiện bắt đầu: hàng 2a và hàng 3 đã ở nhánh chính; gộp `origin/main` về MỘT lần, `make setup`, `make gen`, rồi mới
dựng. Các lựa chọn ở Cổng Phạm vi (Hỏi-1 … Hỏi-5) điền vào luật và hằng trước việc 2. Đổi `ontology/**`, tệp sinh của bảng
vai × màn và `design/decisions.yaml` chỉ sau khi giám sát duyệt yêu cầu chạm tệp.

| # | Việc | Tệp | Kiểm từng việc | Phục vụ | Độc lập |
|---|---|---|---|---|---|
| 1 | Dòng nháp của bảng quyền (7 dòng, planned, không cửa) và nhãn nút, câu «không đủ quyền»; `make gen`; ca `quan-tri-khong-o-nghiep-vu` | `ontology/actions.yaml`, `ontology/labels.yaml`, `src/generated/**`, `src/modules/identity/permission-table.test.ts` | `make ontology` · E9 | AC-8 | không (mọi việc sau đọc tên thao tác) |
| 2 | Hàm thuần `actionVisibility` cạnh `allowedScope`, hằng `LUAT_KHAC` theo Hỏi-4; ca đủ ô (152, hay 176 sau hàng 7d), 15 tổ hợp vai, dòng người khác + phá thử | `src/modules/identity/permissions.ts`, `index.ts`, `permitted-action.test.tsx` | E2 | AC-2 | không (sau 1) |
| 3 | `PermittedAction` và ngữ cảnh vai của phiên ở cửa `ui` của mô-đun danh tính; layout `(app)` dựng ngữ cảnh | `src/modules/identity/ui/**`, `src/app/(app)/layout.tsx` | E2 | AC-2 | không (sau 2) |
| 4 | `RowActions`, `RecordActions`; việc xoá xác nhận bằng `useChange` của kho (hộp X1 chủ kho chọn chính là nó — không cài AlertDialog); khe thao tác dòng của `DataRegion`; ca thứ tự, menu rỗng, hộp xoá + phá thử | `src/components/candidate/**` | E5 · E6 · E14 | AC-4, AC-5 | có (với 6, 7) |
| 5 | Mục «Bộ nút theo quyền» trong sổ thiết kế theo lựa chọn ở cổng; dòng `design/so-khoi.yaml` cho khuôn mới | `design/behaviors.md`, `design/states.md`, `design/so-khoi.yaml` | E1 (hội đồng) | AC-1 | có |
| 6 | ĐÃ XONG sớm (8d42303, G cho phép) — Bộ kiểm «nút đi đường khác»: ba luật, mỗi luật một cặp lành/phá trên tệp mẫu tạm; nối vào `make check` qua `make test` | `tests/bo-nut-kiem.test.ts` | E3 · E4 | AC-3 | có (với 4, 7) |
| 7 | Bảng vai × màn tới cấp nút: lệnh sinh + kiểm lệch trong `tools/coverage_matrix`, tệp sinh | `tools/coverage_matrix/**`, tệp sinh (đường xin G) , `tests/bo-nut-vai-man.test.ts` | E10 | AC-9 | có (với 4, 6) |
| 8 | Thanh bên đọc `action` của mục điều hướng; màn Thành viên chặn bằng `allowedScope`; nút Mời, Đổi vai qua `PermittedAction`; 403 → câu riêng + làm mới | `src/app/(app)/nav.ts`, `src/components/templates/nav-menu.tsx`, `src/app/(app)/members/**` | E7 · E8 trên Postgres dãy V (5570) | AC-6, AC-7 | không (sau 3) |
| 9 | Mẫu chạy của khuôn: trang `/proto/bo-nut-theo-quyen` chuyển sang thành phần thật và bảng quyền thật, bỏ bảng chọn ứng viên; bài trình duyệt bốn vai hai khổ + axe sáng tối; chứng minh màn Thành viên | `src/app/(app)/proto/bo-nut-theo-quyen/**`, `tests/e2e/bo-nut.spec.ts`, `_acceptance/bo-nut-theo-quyen/chung-minh-man.md` | E11 · E12 · E13 | AC-10 | không (sau 4, 8) |
| 10 | Sổ: wiki (log, trang thực thể Member nếu đổi hành vi, bản ghi quyết định cho luật bộ nút), `make check`, `make e2e` | `wiki/**` | `make check` | — | không (cuối) |

Thứ tự: 1 → 2 → 3 → (4 ∥ 5 ∥ 6 ∥ 7) → 8 → 9 → 10. Việc 4, 6, 7 chạm tệp rời nhau nên chạy song song được.

Rủi ro đã thấy: khe cột cuối của `DataRegion` phải sống chung phím mũi tên của 2a (cột không sửa được); đầu ngăn nổi của
hàng 3 nhận `RecordActions` cạnh nút ghim — đọc `design.md` của hai hàng ấy sau khi gộp.

Đọc trước trên nhánh chính sau khi 2a gộp (5d962fb, 2026-11-12):
- `DataRegion` của 2a giữ khe `action` ở thanh công cụ trong lưới và đã ghim cột đầu (`columnPinning.end` còn trống): khe
  thao tác dòng của việc 4 là một cột ghim cuối (`end: ["row-actions"]`), không đụng phần sửa trên ô.
- Va chạm cần G phân xử: ở «Toàn màn hình» (2a, từ 768px) đầu màn và App Shell ẩn, nên nút thêm đặt ở đầu màn (Hỏi-2 = C)
  biến mất. Đề xuất: nút thêm đặt ở đầu màn như chủ kho chọn; riêng lúc toàn màn hình, cùng nút ấy hiện ở khe `action` của
  thanh công cụ trong lưới (một nút, hai chỗ theo chế độ, không hai nút cùng lúc). Ghi thành mục «sửa sau Cổng Phạm vi» để
  chủ kho phê ở Cổng Bằng chứng.
- Trước khi dựng: gộp origin/main (đã có 7d: 10 dòng sống, hằng ô của E2 thành 4 × 2 × 22 = 176: 10 dòng sống, 5 dòng nháp của Bảng hàng, 7 dòng nháp của 9e — đúng số evals ghi sẵn; con số 136 ghi trước đây quên 5 dòng nháp của Bảng hàng) và gộp lại origin/chore/nen-lo-trinh-hang-nhap-3 (đỉnh 592a14b, G-1211-61), sinh lại bản đồ và lộ trình bằng máy.
