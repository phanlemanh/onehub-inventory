# Kế hoạch: cach-ly-truoc-du-lieu-that (hàng 7a)

Hồ sơ: `_acceptance/cach-ly-truoc-du-lieu-that/` · Thiết kế: `design.md` · Viết theo lối khuyên của Hỏi-1 (tám loại · ghi
hai luật). Mỗi việc chỉ xong khi phép đo mới của nó có cặp xanh trên bản lành, đỏ trên bản phá với dòng ghim.

| # | Việc | Tệp | Kiểm từng việc | Phục vụ | Độc lập |
|---|---|---|---|---|---|
| 1 | Ca «sàn ghi được dòng của mình» + tệp phá rút quyền thêm | `db/tests/cach-ly.sql`, `db/tests/pha-thu/ghi-bi-chan.sql`, `db/scripts/cach-ly.sh` | `DB_LANE=c bash db/scripts/cach-ly.sh` | E1 | không (chung tệp với 2–5) |
| 2 | Ca «không quyền nguy hiểm» + hai tệp phá | như việc 1, `pha-thu/cap-xoa-sach.sql`, `pha-thu/cap-trigger-public.sql` | như trên | E2 | không |
| 3 | Ca «chỉ chạm bảng có luật» + hai tệp phá | như việc 1, `pha-thu/bang-schema-khac.sql`, `pha-thu/bang-public-khong-cot-san.sql` | như trên | E3 | không |
| 4 | Ca «dạng xem không vượt luật» + hai tệp phá | như việc 1, `pha-thu/dang-xem-thuong.sql`, `pha-thu/dang-xem-vat-chat.sql` | như trên | E4 | không |
| 5 | Ca «hàm đặc quyền trong danh sách» + hai tệp phá; bộ chạy đăng ký 5 ca SQL, 5 ca phá, dòng tổng 29, nhận biến `TESTS_DIR` | như việc 1, `pha-thu/ham-dac-quyen-public.sql`, `pha-thu/ham-trigger-dac-quyen.sql` | như trên, dòng cuối `cach-ly: 29 ca đạt` | E5, E9 | không |
| 6 | Luật quét 3 của bài quét một cửa + ma trận 9 dạng | `src/modules/identity/one-door.test.ts` | `npx vitest run src/modules/identity/one-door.test.ts` | E6 | có |
| 7 | Migration 005 (ràng buộc loại đủ tám), hai luật trong mô hình, wiki thực thể, `make gen` | `db/migrations/005_thoa_thuan_du_loai.sql`, `ontology/entities/Agreement.yaml`, `wiki/entities/agreement.md`, `src/generated/**` | `make ontology`, `DB_LANE=c bash db/scripts/cach-ly.sh` (áp hai lần) | E7, E8 | có |
| 8 | Bài kiểm bảng thoả thuận so mô hình + bốn ca phá; bài bộ chạy nêu đúng ba tệp phá hỏng (bản sao thư mục kiểm) | `tests/db/cach-ly.db.test.ts` | `DB_LANE=c DB_PORT=5569 npx vitest run -c vitest.db.config.ts tests/db/cach-ly.db.test.ts` | E7, E8, E9b | không (sau 5 và 7) |
| 9 | Ghi sổ: một dòng `wiki/log.md`; `make check` | `wiki/log.md` | `make check` | E10 | không (cuối) |

Thứ tự: 1 → 5 tuần tự (cùng tệp), 6 và 7 xen kẽ, 8 sau 7, 9 cuối. Không việc nào chạy song song bằng nhiều tác tử: việc
nhỏ, tệp chung.
