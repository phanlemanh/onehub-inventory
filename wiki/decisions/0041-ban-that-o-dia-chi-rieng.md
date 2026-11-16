---
type: decision
title: Bản thật ở địa chỉ riêng, Quỹ hàng chỉ để đối chiếu
links:
  [
    wiki/decisions/0010-delivery-and-cutover.md,
    wiki/decisions/0013-selective-scope-and-design-foundation.md,
    docs/plan/lo-trinh.json,
  ]
sources: [_acceptance/moi-truong-thu-va-ban-that/opportunity.md, docs/plan/lo-trinh.json]
---

# 0041 Bản thật ở địa chỉ riêng, Quỹ hàng chỉ để đối chiếu

## Status

Accepted, 2026-11-15. Chủ kho cho ở Cổng Đáng «Ra mắt Inventory ở địa chỉ riêng» lúc 09:38Z, nguyên văn «Cho cả gói,
build». Thay [0010](0010-delivery-and-cutover.md).

## Context

[0010](0010-delivery-and-cutover.md) tính một lần chuyển kho: đóng băng từng phần ở Quỹ hàng, dừng ghi ở kho cũ, dùng
chung khoá bí mật, rồi đổi tên miền `quyhang.onehub.center` sang kho này. Lộ trình có hàng 21 chuyển dữ liệu nhưng không
có hàng nào dựng môi trường chạy thật.

Ngày 2026-11-15, ở phiên giám sát, chủ kho nói:

- «Tôi muốn chuyển sang dùng domain inventory.onehub.center như là một cổng quản trị hàng hóa cho đối tác vẫn giữ lại
  quyhang.onehub.center»
- «Hiện nay quyhang cũng chưa ai sử dụng nên dùng nó để so sánh tính năng chứ không cần chuyển dữ liệu»

## Decision

- Inventory chạy thật ở `inventory.onehub.center`, như cổng quản trị hàng hoá cho đối tác, dựng mới.
- Quỹ hàng giữ `quyhang.onehub.center`, chỉ để đối chiếu tính năng.
- Không chuyển dữ liệu, không đóng băng hay dừng ghi kho cũ, không đổi tên miền cũ. Hàng 21 thành mục chân trời H13.
- Inventory có bộ khoá bí mật riêng, không dùng chung với Quỹ hàng.
- Giữ đích Vercel và Supabase vùng Singapore; bản thử tách khỏi bản thật.
- Trình tự đưa bản lên (áp migration, kiểm nhanh chỉ đọc, rồi mới đưa lên) thuộc hàng 22 «Môi trường thử và bản thật».

## Consequences

- Hàng 22 dựng lệnh đưa bản lên, phép kiểm cấu hình lúc khởi động, sổ tay vận hành và bản đề xuất cho hai tệp tự động
  triển khai. Tài khoản, tên miền, khoá bí mật và hai tệp trong `.github/workflows/` là việc của chủ kho ngoài kho.
- Không còn giai đoạn hai kho cùng ghi, nên không cần đường lùi trỏ tên miền về kho cũ.
- Nếu Quỹ hàng còn số điện thoại chủ nhà thật từ các lần chạy thử thì bản ấy vẫn phải giữ kín như bản thật, dù không ai
  dùng.
- Chi phí hằng tháng của Vercel, Supabase và Resend trình ở Cổng Phạm vi của hàng 22.
