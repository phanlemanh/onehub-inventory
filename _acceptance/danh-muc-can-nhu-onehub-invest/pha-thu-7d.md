# Tệp phá của hàng 7d trong bộ kiểm cách ly

Điều kiện R-6 của giám sát: mỗi tệp phá mới tự làm đỏ đúng ca của nó với đúng dòng ghim, khi chạy một mình trên cơ sở
nháp riêng (bộ chạy `db/scripts/cach-ly.sh` chạy mỗi tệp trên một cơ sở riêng). Đo ngày 12/11/2026 trên Postgres dãy R.

| Tệp phá | Ca phá có sẵn | Dòng đỏ (nguyên văn) | Ca khác |
|---|---|---|---|
| `db/tests/pha-thu/danh-muc-ghi-duoc.sql` | `bang-khong-luat` | `HỎNG vai-api-chi-cham-bang-co-luat: public.catalog_units — vai ghi được danh mục chung` | đều in ok |
| `db/tests/pha-thu/danh-muc-khong-khai.sql` | `bang-khong-luat` | `HỎNG vai-api-chi-cham-bang-co-luat: public.catalog_khong_khai — bảng không có company_id mà vai chạm được, không phải danh mục chung đã khai` | đều in ok |
| `db/tests/pha-thu/ma-rieng-doc-mo.sql` | `luat-doc-mo` | `HỎNG luat-doc-ghi-theo-san: company_catalog_aliases — luật ma_rieng_doc_mo không đúng dạng cho phép: true` | đều in ok |

Bản lành: `cach-ly: 29 ca đạt, vai quy_hang_app` — số ca không đổi. Bảng mã riêng của sàn (`company_catalog_aliases`)
không có ca riêng: nó được phủ bằng hai ca quét chung (12 `moi-bang-cong-ty-ep-luat-theo-dong`, 13
`luat-doc-ghi-theo-san`), nay in «— 4 bảng» thay «— 3 bảng»; ca 17 in «— 10 bảng» (năm bảng danh mục chung nằm trong
danh sách đã khai cạnh `app.permissions`).
