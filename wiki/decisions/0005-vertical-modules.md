---
type: decision
title: Mô-đun theo chiều dọc
links: [setup-blueprint.yaml]
sources: [setup-blueprint.yaml]
---

# 0005 Mô-đun theo chiều dọc

## Status

Accepted, 2026-11-09, chủ kho duyệt bản kế hoạch dựng kho.

## Context

Lớp `architecture` của lần dựng kho onehub-inventory, bản chuẩn hoá của Quỹ hàng.

## Decision

Chọn: archetype: modular-monolith.

Kho cũ có khoảng 30 miền nghiệp vụ, mỗi miền bị xé làm hai nửa ở core và api, và các miền trong api gọi chéo tự do (auth 67 lần, owners 12, routing 10). Mô-đun theo chiều dọc với ranh giới có máy kiểm là lợi ích chính của đợt refactor.

Không chọn:

- Không có archetype: Nhiều miền nghiệp vụ, ranh giới phải được máy giữ
- service-api: Cần stack Fastify; kho cũ đã có API Hono + OpenAPI gắn trong app Next.js, một cửa duy nhất

## Consequences

Tự động: partial. Các việc làm tay còn lại:

- SaaS đa công ty: một cửa truy vấn duy nhất withCompany đặt app.company_id và vai không phải chủ bảng, kèm bộ kiểm cấm mở kết nối ngoài cửa; chỉ mô-đun identity được ngoại lệ vì một người thuộc nhiều sàn. Mọi khái niệm của sàn ghi rõ phạm vi company trong ontology.
- SaaS cấu hình theo sàn (ADR-0018): mô-đun company-config giữ cấu hình của sàn, nhãn và trạng thái riêng, trường riêng, từ điển giá trị, mẫu; chuyển Sổ điểm biến thiên cùng bộ kiểm khớp giữa sổ và mã. Giữ nguyên giới hạn đã chốt: không đối tượng tự tạo, không công thức, không rules engine hay workflow engine tổng quát.
- SaaS API-first: /api/v1 có OpenAPI là đường ghi duy nhất; thêm bước so bản mô tả API để phát hiện thay đổi phá vỡ, vì bộ khung chỉ có bước này ở archetype service-api.
- Tầng vận hành SaaS (mở sàn, gói dịch vụ, hợp đồng, thanh toán): kho cũ chỉ có lệnh mở sàn, chưa có gói cước hay thanh toán. Chuyển lệnh mở sàn; phần còn lại ngoài phạm vi refactor.
