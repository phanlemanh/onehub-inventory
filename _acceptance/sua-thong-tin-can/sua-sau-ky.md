# Sửa sau chữ ký

Chủ kho đã ký Cổng Bằng chứng của hồ sơ này. Giám sát G-2811-51 cho sửa bài của hồ sơ trên nhánh VP10 lát 1
(`feat/khung-luoi-va-ngan-chi-tiet`), theo luật đợt «đổi mã hay bài của hồ sơ đã ký thì ghi ở đây và ghim lại cùng lượt».

## VP10 lát 1, 2026-11-28

| Chỗ | Người dùng thấy khác gì | Phép |
| --- | --- | --- |
| `tests/e2e-db/sua-thong-tin-can.spec.ts` «o-rieng-that»: năm khung E6 chụp vào `.acceptance-runs/sua-thong-tin-can/evidence/`, chỉ ghi vào hồ sơ khi có cờ chụp bằng chứng `SUA_CAN_CHUP=1`. Trước đó mỗi lần chạy bộ có đăng nhập, bài ghi đè năm ảnh bằng chứng đã ký, và làn ghim lại của VP10 đỏ vì chạm hồ sơ đã ký. Chép nguyên văn bản sửa của dãy D (d9d1c975), commit `1cb3073b`; năm ảnh bằng chứng đã ký giữ nguyên | Không | G-2811-51 |
