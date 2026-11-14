---
type: decision
title: Cổng chứng minh màn bắt tệp khối tự làm chưa kê, so với nhánh chính bằng danh sách cố định
links:
  [
    tools/proof_gate/check.py,
    tools/proof_gate/model.py,
    tools/proof_gate/thanh-phan-co-truoc.yaml,
    tools/proof_gate/proof-gate-1q.test.ts,
    _acceptance/cong-bat-khoi-khong-ke/contract.md,
  ]
sources:
  [
    _acceptance/cong-bat-khoi-khong-ke/decisions.jsonl,
    _acceptance/cong-bat-khoi-khong-ke/opportunity.md,
    docs/superpowers/specs/2026-11-14-cong-bat-khoi-khong-ke-design.md,
  ]
---

# 0034 Cổng chứng minh màn bắt tệp khối tự làm chưa kê, so với nhánh chính bằng danh sách cố định

## Status

Accepted, 2026-11-14, ở hàng 1q. Chủ kho duyệt Cổng Phạm vi (Hỏi-1, Hỏi-2 theo khuyến nghị) và kế hoạch.

## Context

Cổng chứng minh màn của quyết định 0023 chỉ xét khối mà hồ sơ của vòng tự kê trong bảng Khối. Khối tạo tay mà hồ sơ không
kê thì cổng không biết nó có, nên không đòi ứng viên ReUI hay dòng sổ khối cho nó. Giám sát thấy kẽ này ngày 2026-11-12.
CI của kho lấy bản sao nông, nên cổng không được đọc lịch sử git để biết «so với nhánh chính» có gì mới.

## Decision

- Khi kho có cả sổ khối (`design/so-khoi.yaml`) lẫn danh sách có trước (`tools/proof_gate/thanh-phan-co-truoc.yaml`), mỗi
  tệp của sổ thành phần ngoài `src/components/ui/` và `src/components/reui/` phải được kê ở một trong ba chỗ: dòng sổ khối
  (theo `tep`, hay `ten` là một thành phần của tệp), danh sách có trước, hay bảng Khối của một hồ sơ đang mở (`draft` tới
  `verified`). Không chỗ nào thì lưới đỏ một dòng `khoi-khong-ke` nêu tệp và các thành phần của nó.
- Đơn vị kê là tệp, không là tên thành phần, để đọc đúng cả sổ thành phần hôm nay (một mục mỗi tệp) lẫn sổ của PR #58 (một
  mục mỗi thành phần). Khối mới là tệp mới; thành phần mới viết chung vào tệp đã kê thì cổng không bắt (Hỏi-2, lối A).
- «Nhánh chính đã có» là danh sách cố định mười hai tệp có từ trước hàng 1q mà chưa có dòng sổ khối (Hỏi-1: miễn, bù sổ để
  hàng riêng). Danh sách không lớn thêm: bài kiểm của hàng ghim đúng tập tệp. Cổng không gọi git.

## Consequences

- Một vòng dựng màn tạo tệp khối mới trong `src/components` phải kê nó trong bảng Khối từ lúc tệp xuất hiện trong sổ thành
  phần; khi vòng đóng, luật nhập kho của 0023 đã đòi dòng sổ khối.
- Xoá danh sách có trước là tắt luật; bài kho thật của hàng 1q đọc tệp ấy nên xoá thì bài đỏ.
- Khối tạo tay ngoài `src/components` (vd `src/modules/*/ui`) cổng không thấy, vì sổ thành phần không quét chỗ ấy.
- `check.py --report --json` có thêm khoá `khoi_khong_ke` (số tệp chưa kê).
