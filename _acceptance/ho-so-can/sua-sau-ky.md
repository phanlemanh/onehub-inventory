# Sửa sau chữ ký

Chủ kho đã ký Cổng Bằng chứng của hồ sơ này. Việc phụ VP10 lát 1 «Khung lưới, ngăn chi tiết và nút» đổi bài sau chữ
ký, theo luật đợt «đổi mã hay bài của hồ sơ đã ký thì ghi ở đây và ghim lại cùng lượt». Căn cứ: chủ kho quyết ở phiên xem trước «BH · Điều chỉnh UX Bảng hàng» ngày 2026-11-27, ghi lại và dựng ở hồ sơ `_acceptance/khung-luoi-va-ngan-chi-tiet/` (Cổng Phạm vi duyệt 2026-11-27, vòng 4 PASS trên `26a399d8`); giám sát G-2711-12…14, G-2711-19.

## VP10 lát 1, 2026-11-27

| Chỗ | Người dùng thấy khác gì | Phép |
| --- | --- | --- |
| `tests/e2e/ho-so-can.spec.ts` «E2 · the record floats beside the grid»: ngăn nổi từ đáy thanh trên tới đáy, thanh công cụ dừng trước ngăn 16 px kể cả khi nút dồn phải, nút «Cột», «Toàn màn hình» chỉ hình ≤ 40 px có chữ gợi ý | Có: ngăn cao hơn và không đè thanh công cụ | «Chốt cả bốn» (Q1, Q4) |
| `tests/e2e/ho-so-can.spec.ts` đầu ngăn một dòng (thay hai dòng) và bài mới «44 px to press on a phone» | Có: đầu ngăn một dòng; nút đầu hồ sơ, đầu mục, đáy hồ sơ cao 44 px trên điện thoại | «Chốt một dòng» (A5), «Duyệt cả ba câu» (B3) |
| `tests/e2e/sheet.spec.ts` «sheet tab stops» trên điện thoại: bỏ điểm dừng «Thêm» | Có: nút «…» tên «Thêm» mở ngăn rỗng không còn | «Duyệt cả sáu điểm» (L1), luật «…» |
