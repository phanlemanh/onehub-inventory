# Kế hoạch — bo-bai-kiem-tu-so-man (hàng 1f)

Trước task đầu: gộp nhánh chính về MỘT lần sau khi hàng 8 gộp (hàng 8 thêm màn đăng nhập vào sổ), để bộ sinh thấy đủ sổ. Không
viết tệp kiểm nào trước bước này.

| # | Việc | Tệp | Kiểm từng việc | Phục vụ | Độc lập |
|---|---|---|---|---|---|
| 1 | Cầu đọc sổ: in JSON màn, vai, nhãn và lỗi của sổ bằng bộ đọc của 1d; bên TypeScript gọi cầu, sổ sai thì ném đúng lỗi bộ đọc in | `tools/e2e_templates/register.py`, `tools/e2e_templates/register.ts` | bài đơn vị: sổ thật đọc được; bản sao thiếu `route` ném đúng lời bộ đọc | E1, E2, E10 | không |
| 2 | Công thức: kiểu công thức (đưa vào · một hàm kiểm · các cách phá · thông điệp ghim), bốn công thức khung, bảy công thức vùng, hàm chờ màn sẵn sàng, hàm nhận vùng («lưới dựng ngoài khuôn») | `tools/e2e_templates/recipes.ts`, `tools/e2e_templates/ready.ts` | `make typecheck` | E3–E8 | không |
| 3 | Bài kiểm cấu trúc: đọc bảng `design/states.md`, so với khoá công thức; công thức thiếu cách phá hay thông điệp thì lỗi gọi tên | `tools/e2e_templates/structure.ts`, `tools/e2e_templates/e2e-templates.test.ts` | ca chính xanh + bản sao thêm «Thử ma» đỏ + công thức bỏ cách phá đỏ | E5 | có (sau 2) |
| 4 | Tệp kiểm màn: đọc sổ, in dòng bỏ qua và bảng Vai × Màn, dựng bộ khung cho mỗi màn, bộ vùng cho màn Lưới và đích hiệu chuẩn, ca phá ở 1440 (cuộn ngang ở 360), hãm CPU khi có `E2E_CPU_THROTTLE` | `tests/e2e/screens/screens.spec.ts` | `npx playwright test tests/e2e/screens` xanh, mỗi ca phá xanh (tức hàm kiểm đỏ đúng lời) | E3, E4, E6–E9 | không |
| 5 | Bài kiểm liệt kê trên sổ giả: thêm màn, bỏ màn, màn planned/dev, sổ sai, thêm vai thứ năm | `tools/e2e_templates/e2e-templates.test.ts` | `npx vitest run tools/e2e_templates` xanh; mỗi ca có đối chứng dương trên cùng bản sao | E1, E2, E10 | có (sau 1, 4) |
| 6 | Chạy trọn: `make check`, `make e2e`, bộ màn dưới hãm CPU 4 lần; thêm một dòng `wiki/log.md` | `wiki/log.md` | ba lệnh xanh trên máy trước khi xin lượt chấm | tất cả | không |

Thứ tự: 1 → 2 → 3 → 4 → 5 → 6, tuần tự trong phiên chính (các việc chung tệp kiểm và công thức, song song không lợi).

Thời hạn: bài trình duyệt 90 giây (axe 240 giây); bài đơn vị gọi Python hay Playwright `--list` 60 giây.
