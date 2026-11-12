# Thiết kế: bộ kiểm cách ly bắt dạng xem chỉ cấp quyền ghi, sửa hay xoá (hàng 7b)

Ngày: 2026-11-12 · Dãy C · Hạng T3 (chạm `db/**`) · Luật chạm: SP-1 (siết, không nới) · Không migration.

## Vì sao

Ở Cổng Bằng chứng hàng 7a, chủ kho chọn «mở hợp đồng mới» cho mục Ngoài-1 (sổ
`_acceptance/cach-ly-truoc-du-lieu-that/decisions.jsonl`, dòng `d-20261112T043105Z-15`): ca 18
`dang-xem-khong-vuot-luat` của hàng 7a chỉ xét dạng xem mà vai của ứng dụng ĐỌC được. Một dạng xem thường (chạy bằng
quyền người tạo, không theo quyền người đọc) mà chỉ được cấp quyền thêm, sửa hay xoá thì lọt mọi ca.

Đã thử trên cơ sở dữ liệu nháp của dãy C (2026-11-12, cây có migration 001–005): tạo `public.agreements_xoa` là dạng xem
thường trên bảng thoả thuận, chỉ cấp quyền xoá cho vai của ứng dụng. Dưới vai của ứng dụng với sàn A, lệnh
`delete from public.agreements_xoa where true` xoá luôn thoả thuận của sàn B (đếm lại bằng vai chủ: còn 0 dòng). Người
tạo dạng xem là vai chủ cơ sở dữ liệu, vượt được luật theo dòng, nên luật của bảng không áp. Bộ kiểm cách ly vẫn xanh.

## Cách làm

Giữ khuôn của hàng 7 và 7a: bộ kiểm SQL chạy dưới vai của ứng dụng bằng đúng câu của cửa, mỗi ca in `ok <ca>` đúng một
lần, mỗi ca mới có tệp phá thử làm bộ kiểm đỏ với dòng ghim; kiểu kiểm là danh sách cho phép (thứ vai chạm được mà
không đúng dạng cho phép thì đỏ).

1. **Ca SQL mới `dang-xem-ghi-khong-vuot-luat` (ca 20).** Mọi dạng xem (`relkind = 'v'`) ở mọi schema không phải hệ
   thống mà vai của ứng dụng có quyền thêm (trên bất kỳ cột nào), sửa (trên bất kỳ cột nào) hay xoá — nhận thẳng, qua
   PUBLIC hay qua vai mẹ, đọc bằng `has_any_column_privilege` và `has_table_privilege` — phải chạy theo quyền người đọc
   (`security_invoker` bật). Sai thì đỏ: `HỎNG dang-xem-ghi-khong-vuot-luat: <schema.dạng xem> <quyền>`, nêu từng quyền
   vượt. Ca 18 của hàng 7a giữ nguyên từng chữ — nó đã ký với nghĩa «dạng xem đọc được».
   - Đối chứng dương trong cùng ca, trong một giao dịch rút lại: một dạng xem chạy theo quyền người đọc, cấp thêm, sửa
     một cột và xoá cho vai, phải được đếm (số dạng xem ghi được = 1) mà không bị nêu.
   - Dạng xem vật chất hoá không ghi được; bảng ngoại thuộc ca 17; quyền xoá sạch, gắn trigger, khoá ngoại thuộc ca 16.
2. **Ca phá mới `pha-thu-dang-xem-chi-ghi`** — ba tệp, mỗi tệp một cơ sở dữ liệu nháp, mỗi tệp một lối vào khác:

   | Tệp phá | Dựng gì | Dòng ghim |
   |---|---|---|
   | `dang-xem-chi-xoa` | dạng xem thường trên thoả thuận ở `public`, cấp đúng quyền xoá cho vai | `HỎNG dang-xem-ghi-khong-vuot-luat: public.agreements_xoa DELETE` |
   | `dang-xem-chi-sua-cot` | dạng xem thường, cấp sửa đúng một cột cho PUBLIC (không cho vai) | `HỎNG dang-xem-ghi-khong-vuot-luat: public.agreements_sua_ben UPDATE` |
   | `dang-xem-chi-them-schema-khac` | schema mới, cấp quyền vào schema và quyền thêm trên một dạng xem thường cho vai | `HỎNG dang-xem-ghi-khong-vuot-luat: kho_xem.agreements_them INSERT` |

   Cả ba tệp không cấp quyền đọc, nên ca 18 của hàng 7a vẫn xanh trên bản phá — chứng rằng ca mới bắt chỗ ca cũ bỏ sót.
3. **Kẽ hở là thật, không phải báo động suông** — bài kiểm cơ sở dữ liệu `tests/db/cach-ly.db.test.ts` thêm một cặp:
   trên cơ sở dữ liệu dựng từ tệp phá `dang-xem-chi-xoa`, dưới vai của ứng dụng với sàn A (đúng câu của cửa), lệnh xoá
   qua dạng xem làm mất thoả thuận của sàn B (vai chủ đếm: 1 → 0). Đối chứng cùng fixture: đổi dạng xem ấy sang chạy theo
   quyền người đọc thì cùng lệnh không chạm dòng nào của B (vẫn 1).
4. **Bộ chạy** `db/scripts/cach-ly.sh` đăng ký ca SQL và ca phá mới; dòng tổng của bản lành thành
   `cach-ly: 31 ca đạt, vai quy_hang_app` (29 cũ + 1 ca SQL + 1 ca phá). Bài kiểm bộ chạy (E9b của hàng 7a) đổi số 29 →
   31 và thêm một chỗ hỏng: tệp phá mới bị thay bằng `select 1;` thì bộ chạy nêu
   `HỎNG pha-thu-dang-xem-chi-ghi: dang-xem-chi-xoa: bộ kiểm vẫn xanh trên bản phá`.
5. **Việc kèm (giám sát giao): cặp phá thử cũ của hàng 9 «mời người mà cơ sở dữ liệu không kiểm quản trị».** Sau hàng
   9a, giao diện lập trình chặn trước theo bảng quyền, nên phép kiểm cũ (gọi qua giao diện lập trình, chờ mã 403) cho
   cùng kết quả trên bản lành lẫn bản phá — cặp đỏ khi chạy cả bộ, và hàng 9a đã phải lọc nó khỏi lệnh nghiệm thu. Viết
   lại phép kiểm của đúng cặp ấy để đo lớp cơ sở dữ liệu: gọi thẳng hàm mời của cơ sở dữ liệu dưới vai của ứng dụng,
   với phiên của một người không phải quản trị sàn (Đầu chủ), chờ bị từ chối và số thành viên không đổi; trên bản phá
   (hàm mời bỏ phép kiểm quyền) cùng lời gọi thêm được người → đỏ với thông điệp ghim mới
   `ba-vai-khong-quan-tri: cơ sở dữ liệu cho Đầu chủ mời người`. Tệp phá được dựng lại từ thân hàm mời của migration 006
   (hàng 9a) bỏ đúng phép kiểm quyền, để bản phá chỉ khác bản lành ở một chỗ. Không bỏ cặp: nó đo một kiểu hỏng (thân
   hàm không còn hỏi quyền) mà E4 của hàng 9a (đổi ô trong bảng quyền) không đo. Các ca và cặp khác của hàng 9 không đổi.
   Cả bộ kiểm cơ sở dữ liệu (`tests/db/*.db.test.ts`) chạy xanh trong một lệnh, không bộ lọc bỏ ca.

Thứ tự: KHÔNG viết mã trước khi PR #36 (hàng 9a) vào nhánh chính; khi đó gộp nhánh chính về một lần rồi mới dựng (hàng
9a sửa cùng `db/tests/cach-ly.sql` và thêm migration 006). Không cần migration.

## Từ Quỹ hàng

Đã tìm ở `/Users/manhphan/dev/onehub-quy-hang` commit `1729b11f` (chỉ đọc): `packages/db/migrations/**`,
`packages/db/tests/**`, `packages/db/scripts/**`, `docs/adr/**`.

- Quỹ hàng không có dạng xem nào: không migration nào chứa `create view` hay `materialized view`, không tệp nào nhắc
  `security_invoker`.
- Bộ kiểm cách ly của Quỹ hàng (`packages/db/tests/isolation.test.mjs`, dòng 107) chỉ quét bảng thường
  (`relkind = 'r'`) ở schema `public`; bộ soát nhanh `packages/db/scripts/kiem-nhanh.mjs` (dòng 70) cũng vậy. Không có
  phép quét dạng xem, cả đọc lẫn ghi.
- Giữ: kiểu kiểm bằng danh mục hệ thống của Postgres, chạy trên Postgres tạm. Bỏ: giới hạn chỉ bảng thường, chỉ
  `public` — hàng 7a đã mở sang mọi schema và dạng xem đọc được; hàng này mở sang dạng xem ghi được.

## Thứ không đo chắc bằng máy

- Luật viết lại câu (`CREATE RULE … DO INSTEAD`) gắn trên dạng xem chạy bằng quyền chủ luật; vẫn ngoài phạm vi như hàng
  7a ghi. Trigger `INSTEAD OF` gọi hàm chạy bằng quyền người tạo thì ca 19 của hàng 7a bắt (ca ấy xét trigger trên mọi
  quan hệ vai ghi được); trigger gọi hàm chạy theo người gọi thì luật của bảng vẫn áp.
- Bộ kiểm cách ly chưa chạy trên CI (hàng 1s).

## Ràng buộc

- Ranh giới của dãy: `db/tests/cach-ly.sql`, `db/tests/pha-thu/**`, `tests/db/pha-thu/**`, `tests/db/cach-ly.db.test.ts`,
  `db/scripts/cach-ly.sh`, `wiki/log.md`, hồ sơ này. Việc kèm cần thêm `tests/db/moi-nguoi.db.test.ts` và một dòng mới
  trong `_acceptance/config.yaml` — đã xin giám sát (yêu cầu C-5).
- Dữ liệu mẫu: `[Sàn A]`, `[Sàn B]`, `[Tên]`.
