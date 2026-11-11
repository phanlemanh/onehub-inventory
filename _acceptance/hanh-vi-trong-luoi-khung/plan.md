# Kế hoạch: hanh-vi-trong-luoi-khung (hàng 1e)

Hạng T2: không dừng duyệt kế hoạch. Mỗi việc có lệnh kiểm riêng; việc 1–4 đã dựng trước cổng cùng bản mẫu của design-pass.

| # | Việc | Tệp | Kiểm | Phục vụ | independent |
|---|---|---|---|---|---|
| 1 | Khung hồ sơ và Lưới mở hồ sơ theo thứ tự đang hiện | `src/components/candidate/record-panel.tsx`, `data-region.tsx` | `make typecheck` | E1, E2, E11 | false |
| 2 | Chờ tải ba nấc, lỗi, một phần hỏng, đầu vùng theo trạng thái, nút theo quyền | `region-state.tsx`, `region-header.tsx`, `data-region.tsx`, `grid-copy.ts` | `make typecheck` | E4, E5, E6, E12 | false |
| 3 | Cách sửa theo kiểu, chữ cắt đo lại | `column-kind.ts`, `typed-cell.tsx`, `truncated-text.tsx` | `make typecheck` | E3, E7 | false |
| 4 | Cửa lưu chung và câu xác nhận | `use-change.tsx`, `frame-copy.ts` | `make typecheck` | E8 | false |
| 5 | Bài kiểm đơn vị, sáu ca phá thử, bài rào | `tests/behavior.test.tsx`, `tests/behavior-guard.test.ts`, `tests/grid.test.tsx` | `make test` | E1–E9 | false |
| 6 | Bài kiểm trình duyệt bốn khổ, axe sáng tối | `tests/e2e/behavior.spec.ts`, `tests/e2e/grid.spec.ts` | `make e2e` | E11–E13 | false |
| 7 | Dòng check trong sổ quyết định, mục record-panel, sổ hành vi và trạng thái, sổ thay đổi | `design/decisions.yaml`, `design/behaviors.md`, `design/states.md`, `wiki/log.md` | `make check` | E10 | false |
