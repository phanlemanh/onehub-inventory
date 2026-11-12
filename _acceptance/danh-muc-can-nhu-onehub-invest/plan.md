# Kế hoạch: danh-muc-can-nhu-onehub-invest (hàng 7d)

Điều kiện mở dựng: PR #36 (hàng 9a, migration 006) đã ở nhánh chính; gộp `origin/main` về một lần; giám sát đã duyệt
yêu cầu chạm tệp R-4. Tuần tự, một nhánh. Kiểm từng việc theo lệnh của kho (`make …`), không lệnh tự chế.

| # | Việc | Tệp | Kiểm của việc | Phục vụ | Độc lập |
|---|---|---|---|---|---|
| 1 | Mô hình nghiệp vụ: năm thực thể mới, sửa `Unit`, thuật ngữ, nhãn, quan hệ; `make gen` | `ontology/**`, `src/generated/**`, `architecture/modules.yaml`, `wiki/entities/*` | `make gen && make ontology` | E13, E14 | không |
| 2 | Bộ đọc mã 8 dạng của invest và hàm cấp khoá, viết ma trận trước rồi mới viết hàm | `src/modules/catalog/unit-code.ts`, `keys.ts`, `*.test.ts`, `index.ts` | `config:executors.test.danh_muc`, có lượt phá thêm dạng trùng | E4, E5, E8 | có (với 3, 4) |
| 3 | Migration 007: năm bảng, ràng buộc khoá, tầng, cha phân khu, bí danh; ép luật theo dòng, chỉ đọc cho vai API; cột `agreement_id` không cấp đọc | `db/migrations/007_danh_muc_nhu_invest.sql` | `make db-up DB_LANE=r DB_PORT=5565` rồi `bash db/scripts/migrate.sh` | E1, E3, E6, E7, E11 | có (với 2) |
| 4 | Bộ kiểm cách ly: thêm năm bảng vào danh sách danh mục chung của 9a; hai tệp phá | `db/tests/cach-ly.sql`, `db/tests/pha-thu/danh-muc-*.sql` | `DB_LANE=r bash db/scripts/cach-ly.sh`, đỏ đúng dòng ghim với từng tệp phá | E12 | không (sau 3) |
| 5 | Danh mục mẫu theo cấp mới, mã gốc thành bí danh; hàm nạp mẫu vào cơ sở dữ liệu ở `server.ts`; bài chuyển mẫu so với ảnh chụp rút từ commit trước | `src/modules/catalog/sample.ts`, `server.ts`, `tests/danh-muc-chuyen-mau.test.ts`, `tests/sample-data.test.ts` (ba dòng) | `config:executors.test.danh_muc`, có lượt phá bỏ một căn, nhân đôi một căn | E2, E9, E15 | không (sau 1, 2) |
| 6 | Bài cơ sở dữ liệu của danh mục: cha phân khu, tầng, khoá, bí danh, chỉ đọc, cột đọc được, cột khớp ontology, nạp mẫu đủ | `tests/db/danh-muc.db.test.ts` | `config:executors.script.danh_muc_db_r` | E1, E3, E6, E7, E10, E11, E13, E16 | không (sau 3, 5) |
| 7 | Sổ ghi: một dòng `wiki/log.md`; trang thực thể; `make check` | `wiki/log.md` | `make check` | E14 | không |

Thứ tự: 1 → (2 ‖ 3) → 4 → 5 → 6 → 7. Việc 2 và 3 độc lập nhưng nhỏ; làm tuần tự trong một phiên, không tách tác tử.
