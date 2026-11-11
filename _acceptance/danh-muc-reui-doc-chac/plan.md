# Kế hoạch: danh-muc-reui-doc-chac (hàng 1k)

Thiết kế: `_acceptance/danh-muc-reui-doc-chac/design.md` · hợp đồng: `_acceptance/danh-muc-reui-doc-chac/contract.md` · eval: `_acceptance/danh-muc-reui-doc-chac/evals.yaml`

Mã nằm trong `tools/reui_catalog/`. Tệp kiểm của hàng 1g (`catalog.test.mjs`) và tệp danh mục không đổi byte nào. Ngoài
vùng chỉ có hai việc luật đợt cho sẵn: một dòng thêm vào `wiki/log.md` (báo giám sát) và sinh lại bản đồ sản phẩm,
trang lộ trình bằng máy. Cả vòng kết bằng `make check`.

| # | Việc | Tệp | Kiểm từng việc | Phục vụ | Độc lập |
|---|---|---|---|---|---|
| 1 | Bộ kiểm mới, viết trước mã: ma trận 21 ca tiêu đề, đối chứng, 6 ca sinh lại và kiểm, 3 ca nhiều nhóm và dòng gần giống, ma trận 270 ca chuỗi cấm, 4 ca trường lạ, 3 ca đối chứng, 10 ca lệnh kiểm — tổng 320 ca, mỗi ma trận neo vào danh sách của mã | `tools/reui_catalog/doc-chac.test.mjs` | `npx vitest run tools/reui_catalog/doc-chac.test.mjs --coverage.enabled=false --reporter=verbose` — trước việc 2: các ca DC1, DC3, DC4 và các ca chỗ `counts` của DC5, DC8 đỏ đúng chỗ (chứng thước biết đỏ), các ca còn lại của DC5–DC8 xanh | E1–E8, E10 | không (đi trước 2) |
| 2 | Nhóm bắt buộc: bảng `REQUIRED_SECTIONS`, bộ đọc ghi nhóm đã gặp, quét tiêu đề trước khi đọc mục, kê mọi nhóm mất trong một lỗi kèm dòng tiêu đề gần giống; `scanCatalog` quét thêm `counts`; bộ đọc `llms.txt` dùng cùng khuôn lỗi | `tools/reui_catalog/catalog.mjs` | cả 320 ca xanh; `node tools/reui_catalog/build.mjs --check` xanh | E1–E4 | không (cần 1) |
| 3 | Hướng dẫn: mục ghim lại nói lệnh dừng và gọi tên nhóm, và phải làm gì | `tools/reui_catalog/README.md` | đọc lại; ca E10 cũ của hàng 1g (chạy mọi dòng lệnh của tệp) vẫn xanh | E11 | không (cần 2) |
| 4 | Không thoái lui | `design/reui-catalog.json` (không đổi) | lệnh `reui_catalog_offline`; 33 ca của `catalog.test.mjs` xanh | E9, E10 | không (cần 2) |
| 5 | Ghi sổ kho và tệp sinh | `wiki/log.md` (một dòng), `PRODUCT-MAP.md`, `LO-TRINH.html` (sinh lại bằng máy, commit riêng) | `make check` | — | không (cuối) |

Thứ tự: 1 → 2 → 3 → 4 → 5, tuần tự trong phiên chính. Không có hai việc độc lập nên không tách luồng.

Lựa chọn chịu lực:

- Thước viết trước mã và phải thấy đỏ trước khi sửa: ca tiêu đề đổi dạng phải đỏ trên bộ đọc hôm nay (lệnh ghim lại
  thoát 0), nếu không thì thước chưa đo đúng lỗi.
- Ma trận dựng bằng cách chép tệp thật rồi đổi đúng một dòng hay một giá trị, và khẳng định giá trị đã đổi khác gốc —
  không viết tay khuôn nguồn.
- Đường dẫn suy từ vị trí tệp kiểm, không từ thư mục đang chạy.
