# Sửa sau chữ ký

Chủ kho đã ký Cổng Bằng chứng của hồ sơ này. Việc phụ VP10 lát 1 «Khung lưới, ngăn chi tiết và nút» đổi bài sau chữ
ký, theo luật đợt «đổi mã hay bài của hồ sơ đã ký thì ghi ở đây và ghim lại cùng lượt». Căn cứ: chủ kho quyết ở phiên xem trước «BH · Điều chỉnh UX Bảng hàng» ngày 2026-11-27, ghi lại và dựng ở hồ sơ `_acceptance/khung-luoi-va-ngan-chi-tiet/` (Cổng Phạm vi duyệt 2026-11-27, vòng 4 PASS trên `26a399d8`); giám sát G-2711-12…14, G-2711-19.

## VP10 lát 1, 2026-11-27

| Chỗ | Người dùng thấy khác gì | Phép |
| --- | --- | --- |
| `tests/e2e/ho-so-can.spec.ts` `assertEdges`: ngăn nổi đứng từ đáy thanh trên App Shell (hoặc mép trên cửa sổ khi không có thanh trên) tới đáy, không còn đứng dưới thanh công cụ của vùng; thanh công cụ dừng trước ngăn 16 px; bỏ lỗi «record covers the toolbar» | Có: ngăn cao hơn, từ dưới thanh trên tới đáy, thay AC-4 «ngăn dưới thanh công cụ» (phân xử D-1411-1) | «Chốt cả bốn» (Q1, Q4), quyết định 0024 «Trừ thanh trên» |
| `tests/e2e/ghim-ngan.spec.ts` «E2 · pinning makes room»: cửa sổ thử cao 440 thay 520, để thân ngăn vẫn cuộn được khi ngăn cao hơn; kỳ vọng giữ chỗ cuộn không đổi | Không: chỉ đổi khung thử | Q1 |
