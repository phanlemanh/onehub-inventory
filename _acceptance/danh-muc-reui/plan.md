# Kế hoạch: danh-muc-reui (hàng 1g)

Thiết kế: `_acceptance/danh-muc-reui/design.md` · hợp đồng: `_acceptance/danh-muc-reui/contract.md` · eval: `_acceptance/danh-muc-reui/evals.yaml`

Mọi tệp mã nằm trong `tools/reui_catalog/`, tệp sinh ra là `design/reui-catalog.json`. Không chạm `src/`, Makefile, cấu hình lint hay prettier. Kiểm theo từng việc bằng lệnh của kho; cả vòng kết bằng `make check`.

| # | Việc | Tệp | Kiểm từng việc | Phục vụ | Độc lập |
|---|---|---|---|---|---|
| 1 | Chụp nguồn và ghim | `tools/reui_catalog/snapshot/llms-full.txt`, `snapshot/llms.txt`, `pin.json` | SHA-256 trong tệp ghim bằng `shasum -a 256` của tệp chụp | E2, E3 | có |
| 2 | Bộ chặn mạng | `tools/reui_catalog/no-network.cjs` | tự thử `fetch`, `http.get`, `https.request` qua import có tên của ESM, `net.connect` đều ném `network blocked` | E1, E4, E8 | có |
| 3 | Thư viện: đọc nguồn fail-closed, dựng danh mục, kiểm băm, quét chuỗi cấm trên danh mục và ảnh chụp, tra xếp hạng có chỉ mục | `tools/reui_catalog/catalog.mjs` | ca kiểm của việc 6 cho phần tương ứng | E2–E6 | không (cần 1) |
| 4 | Lệnh sinh lại, kiểm, ghim lại | `tools/reui_catalog/build.mjs` | sinh lại hai lần trùng byte; `--check` xanh; `--refresh --from` trên bản sao | E1, E2, E5, E7 | không (cần 3) |
| 5 | Lệnh tra | `tools/reui_catalog/tra.mjs` | tra `kanban` ra `@reui/kanban` đầu; tra chuỗi lạ thoát 1 | E4 | không (cần 3) |
| 6 | Bộ kiểm 33 ca, tên ca mở đầu bằng mã eval; cặp xanh–đỏ trên cùng bản sao trong thư mục tạm, gọi lệnh của bản sao bằng đường tuyệt đối, khẳng định kho thật sạch sau mỗi ca | `tools/reui_catalog/catalog.test.mjs` | `npx vitest run tools/reui_catalog --coverage.enabled=false --reporter=verbose` | E2–E8, E10 | không (cần 3–5, 8) |
| 7 | Sinh danh mục và commit | `design/reui-catalog.json` | lệnh của E1 | E1, E3, E5 | không (cần 4) |
| 8 | Hướng dẫn cho agent | `tools/reui_catalog/README.md` | ca E10 chạy mọi dòng lệnh của tệp | E9, E10 | không (cần 4, 5) |
| 9 | Ghi sổ kho | `wiki/log.md` (thêm một dòng), sinh lại bản đồ sản phẩm và lộ trình bằng máy | `make check` | — | không (cuối) |

Thứ tự: 1 và 2 → 3 → 4, 5 → 7 → 8 → 6 → 9. Việc 1 và 2 độc lập nhưng nhỏ, nên chạy tuần tự trong phiên chính, không tách luồng.

Lựa chọn chịu lực:

- Tra dùng chỉ mục từ → mục dựng một lần khi nạp, để bài kiểm duyệt cả 1.969 mục hai lần chạy trong vài giây thay vì ~17 giây của bản thử quét tuần tự.
- Lệnh sinh lại, kiểm và tra lấy gốc kho từ vị trí của chính tệp lệnh, không từ thư mục đang chạy.
- Định dạng danh mục bằng chính prettier của kho trong lệnh sinh lại, để `make lint` không đỏ vì khác khoảng trắng.
- Bộ kiểm dựng mọi ca đỏ bằng cách chép tệp thật (ảnh chụp, tệp ghim, danh mục) vào thư mục tạm rồi phá đúng một chỗ, và chạy chính lệnh `build.mjs` trên bản sao — không viết tay khuôn tệp.
