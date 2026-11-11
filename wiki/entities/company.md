---
type: entity
title: Company (Sàn)
links: [ontology/entities/Company.yaml]
sources: [onehub-quy-hang/CONTEXT.md, onehub-quy-hang/docs/adr/0001-khoi-diem.md]
---

# Company (Sàn)

## Definition

Công ty môi giới dùng sản phẩm, và là đơn vị cách ly dữ liệu. RESO không có khái niệm tương đương: `Office` là danh
sách văn phòng thành viên của MLS, `OUID` là mã định danh để trao đổi dữ liệu.

## Rules

Mọi bảng của công ty có `company_id` và ép luật theo dòng. Một yêu cầu chỉ thấy một công ty.

## Where in the code

- Lược đồ nền (bảng sàn, thoả thuận, vai `quy_hang_app`, luật theo dòng): `db/migrations/001_nen_cong_ty.sql`, chép
  nguyên văn từ Quỹ hàng; áp bằng `db/scripts/migrate.sh`.
- Cửa truy vấn duy nhất `withCompany`: `src/modules/identity/with-company.ts`, mở ra ngoài qua
  `src/modules/identity/server.ts`. Bộ quét một cửa: `src/modules/identity/one-door.test.ts`.
- Bộ kiểm cách ly 19 ca trên Postgres của dãy: `db/scripts/cach-ly.sh`, các ca ở `db/tests/cach-ly.sql`, bản phá thử ở
  `db/tests/pha-thu/`. Bảng công ty mới ở schema `public` tự rơi vào ca quét danh mục.

## History

Lấy từ từ vựng của Quỹ hàng khi dựng kho, 09/11/2026. Nền cách ly, cửa truy vấn và bộ kiểm cách ly, 11/11/2026
(hồ sơ `_acceptance/cach-ly-moi-san/`).
