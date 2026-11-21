---
type: decision
title: Nâng repo-setup gom theo mốc của kit nghiệm thu, trừ bản vá chữa lỗi kho đang vấp
links:
  [
    .repo-setup.json,
    _acceptance/config.yaml,
    wiki/decisions/0045-kit-nghiem-thu-delivery-loop-3-0.md,
  ]
sources:
  [
    _acceptance/roadmap-merge-driver/contract.md,
    docs/superpowers/specs/2026-11-21-roadmap-merge-driver-design.md,
  ]
---

# 0046 Nâng repo-setup gom theo mốc, trừ bản vá chữa lỗi kho đang vấp

## Status

Accepted, 2026-11-21. Chủ kho quyết khi duyệt kế hoạch 12 mục của kho `delivery-loop` (câu Q1 của
`migration/KE-HOACH-12-MUC-REPO-STANDARDS.md`, commit `f575b7fc`), và chốt nghĩa của «mốc» ở Cổng Phạm vi của hồ sơ
`roadmap-merge-driver` (Hỏi-1).

## Context

Kho dựng bằng repo-setup và nâng công cụ này bằng `apply.py` của từng bản. Trong bốn ngày có bốn vòng nâng, mỗi vòng đi
trọn một hồ sơ nghiệm thu. Hạng đọc từ hợp đồng của từng vòng:

| Bản    | Hồ sơ                       | Hạng | Duyệt phạm vi |
| ------ | --------------------------- | ---- | ------------- |
| 0.9.0  | `upgrade-repo-setup-0-9-0`  | T3   | 2026-11-18    |
| 0.10.1 | `upgrade-repo-setup-0-10-1` | T2   | 2026-11-20    |
| 0.10.2 | `upgrade-repo-setup-0-10-2` | T3   | 2026-11-20    |
| 0.10.3 | `upgrade-repo-setup-0-10-3` | T3   | 2026-11-21    |

Ba trong bốn vòng là T3 vì bản nâng chạm tệp thuộc `risk_tiers.t3_paths`. Phiên Repo Standards đo vòng 0.10.2 (PR 95):
11,5 giờ từ lúc mở tới lúc gộp.

## Decision

- Chủ kho quyết: nâng repo-setup «gom theo mốc, trừ bản vá chữa lỗi kho đang vấp».
- Mốc là lần kho này nhận một mốc của kit nghiệm thu (3.1, 3.2…). Mỗi mốc có một vòng nâng repo-setup, lấy bản mới nhất
  lúc đó.
- Giữa hai mốc chỉ mở vòng nâng khi bản vá chữa một lỗi kho đang vấp. Hợp đồng của vòng ấy gọi tên lỗi đó.
- `risk_tiers` không đổi ở quyết định này.

## Consequences

- Bản mới của repo-setup tới kho chậm hơn, nhiều nhất là một mốc.
- Thước theo dõi: số vòng nâng công cụ mỗi tuần, và số giờ từ lúc mở tới lúc gộp của một vòng nâng.
- Một vòng nâng theo mốc vẫn đi trọn hạng của tệp nó chạm. Việc khai lại hạng cho tệp do `apply.py` ghi chưa làm: chủ
  kho quyết ở một vòng riêng.
- `.gitattributes` và `.github/workflows/security.yml` có dòng của riêng kho, thêm ở hồ sơ `roadmap-merge-driver`. Vòng
  nâng kế phải giữ các dòng ấy khi `apply.py` ghi lại hai tệp.
