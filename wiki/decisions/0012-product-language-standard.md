---
type: decision
title: Chuẩn ngôn ngữ của sản phẩm
links: [ontology/labels.yaml, design/language.md]
sources: [design/language.md, docs/design-standard-proposal.md]
---

# 0012 Chuẩn ngôn ngữ của sản phẩm

## Status

Accepted, 2026-11-09, chủ kho chốt nhãn «Đầu chủ», «Đầu khách» và yêu cầu áp nguyên tắc cho toàn ứng dụng.

## Context

«Seller side», «Đầu chủ», «Bên bán» đang gộp ba khái niệm: phía giao dịch, người môi giới, chủ thể giao dịch. RESO tách chúng bằng `List*`, `Buyer*` và `ContactType`. Luật 29/2023/QH15 dùng «bên bán», «bên mua» cho chủ thể hợp đồng.

## Decision

Mỗi khái niệm một mã theo RESO, một nhãn ưu tiên, nhiều nhãn thay thế. Nhãn ưu tiên chọn theo công thức bốn tiêu chí. Biến thể vùng miền đặt theo sàn. Từ điển ở `ontology/labels.yaml`, quy tắc ở `design/language.md`.

Không chọn:

- Dùng «Bên bán», «Bên mua» làm nhãn môi giới: trùng chủ thể hợp đồng và không phủ cho thuê.
- Đặt biến thể theo locale: `vi-VN` không phân biệt được vùng.

## Consequences

- Nhãn có chữ «bán» phải có biến thể cho thuê, nên «Đang bán», «Đã bán» đổi theo loại giao dịch.
- «Sàn» là ngoại lệ có ghi lý do vì trùng «sàn giao dịch» trong luật.
- Mức hiểu đúng ở hai miền chưa đo; nếu kém thì đổi nhãn của sàn, không đổi mã.
- Đổi từ điển là đổi ontology, cần người duyệt.
