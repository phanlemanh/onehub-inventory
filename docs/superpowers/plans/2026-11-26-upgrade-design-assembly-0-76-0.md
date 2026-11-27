# Kế hoạch đo: upgrade-design-assembly-0-76-0

Mã đã có trên nhánh (`afcb1ca2`). Kế hoạch của vòng là kế hoạch đo; không task nào viết mã sản phẩm.

| Task                      | Tệp                                     | Kiểm từng task                            | Phục vụ       | independent |
| ------------------------- | --------------------------------------- | ----------------------------------------- | ------------- | ----------- |
| 1. Ma trận và thư viện đo | `rang/matrix.mjs`, `rang/lib.mjs`       | `node rang/tool-tree.mjs` xanh            | mọi eval      | false       |
| 2. Cổng và độ tất định    | `rang/gate-lines.mjs`                   | `node rang/two-way.mjs --only gate-lines` | E2, E3        | true        |
| 3. Cây công cụ            | `rang/tool-tree.mjs`                    | `--only tool-tree`                        | E4, E5        | true        |
| 4. Trạng thái quyết định  | `rang/decision-states.mjs`              | `--only decision-states`                  | E6, E7        | true        |
| 5. Kiểm tra 40/40         | `rang/audit.mjs`                        | `--only audit`                            | E8, E9        | true        |
| 6. Chữ của sổ và bảng     | `rang/words.mjs`, `rang/brand-words.md` | `--only words`                            | E10, E11, E16 | true        |
| 7. Sổ vẽ trang logo       | `rang/book.mjs`                         | `--only book`                             | E12, E13      | true        |
| 8. Danh sách tệp          | `rang/change-list.mjs`                  | `--only change-list`                      | E14, E15      | true        |

Thứ tự: task 1 trước, các task còn lại không phụ thuộc nhau. Cả tám đã làm trước Cổng Phạm vi; `rang/two-way.mjs` chạy
39 ca, tất cả giữ. E1 (`make check`) là suite của kho.
