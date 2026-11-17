# Đang ở đâu — nhap-excel (dãy D)

Cập nhật sau mỗi bước có nghĩa (G-1711-39: hạn mức tuần 95%, tới 98% đợt bàn giao).

- Trạng thái: Cổng Phạm vi DUYỆT (606ddb1), kế hoạch T3 DUYỆT (chủ kho 17/11). Vùng thi công G duyệt D-11.
- Xong: việc 0–1 (8cb09e3). make check đỏ đúng ba bài cửa /api/v1/imports (route ở việc 7) — dự kiến.
- Đang làm: việc 2 (migration 015, bảng import_runs, listing_pending_units, quyền chèn/xoá có rào, cách ly).
- Việc kế: Việc 1 (ontology) → 2 (migration 015) → 3, 4 → 5, 6, 7 → 8 → 9 (sau khi 3g gộp) → 10 → S4.
- Lệnh đang dùng: Postgres dãy D `DB_LANE=d DB_PORT=5571`; dev server bản mẫu `npx next dev -p 3481` (cấu hình `web-d` ở `.claude/launch.json`, chỉ ở máy, không commit).
- Luật đợt cần nhớ: listings chỉ tệp mới + THÊM dòng export; inventory-grid/rows/page.tsx sau khi 3g gộp; tệp dùng chung chỉ thêm dòng; thứ tự gộp VP7 → 3g → 11; migration số tạm 015.
