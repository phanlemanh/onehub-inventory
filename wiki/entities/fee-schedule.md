---
type: entity
title: FeeItem (Khoản phí) và FeeSchedule (Thuế phí)
links: [ontology/entities/FeeItem.yaml, ontology/entities/Listing.yaml]
sources:
  ["_acceptance/thue-phi/contract.md", "docs/superpowers/specs/2026-11-14-thue-phi-design.md"]
---

# FeeItem (Khoản phí) và FeeSchedule (Thuế phí)

## Definition

Thuế phí của một sàn là các khoản tính bằng phần trăm của Giá chào, trừ ra khỏi lần chào Bao phí để ra Về tay. Hai khoản
theo luật (Thuế thu nhập cá nhân 2%, Lệ phí trước bạ 0,5%) và các khoản riêng của sàn (mặc định Phí môi giới 1%). Nội bộ;
trang khách không đọc (SP-4).

## Rules

- Khoản theo luật chỉ bật hay tắt, không đổi tên, không đổi tỉ lệ, không bỏ.
- Khoản riêng: tên 1–40 ký tự, không trùng; tỉ lệ 0–5%, bước 0,1%; tối đa 5 khoản đang dùng.
- Tổng các khoản đang bật tối đa 10%; ít nhất một khoản bật. Tỉ lệ lưu bằng phần vạn số nguyên.
- Về tay = Giá chào × (1 − tổng tỉ lệ đang bật), làm tròn xuống tới đồng, cho lần chào Bao phí; Không bao phí thì bằng Giá
  chào; thiếu giá, thiếu Điều kiện phí hay cho thuê thì trống.
- Bảng chỉ giữ khoản sàn đã đổi hay thêm; khoản không có dòng là mặc định. Không xoá: trả về mặc định hay bỏ khoản là ghi
  người và lúc ngừng dùng; mã khoản không dùng lại.

## Where in the code

Lõi tính và kiểm mức: `src/modules/company-config/fee-schedule.ts`. Bảng `company_fee_items`:
`db/migrations/012_thue_phi.sql`. Đọc, ghi: `src/modules/company-config/fee-store.ts`, qua
`/api/v1/company/fee-schedule` (bảng quyền `readFeeSchedule`, `setFeeSchedule`). Bảng hàng đọc mức của sàn đang đăng
nhập để tính cột Về tay.

## History

Thêm ở hàng 19 (thue-phi), 14/11/2026; chủ kho duyệt phạm vi và kế hoạch cùng ngày (Hỏi-7 B: sàn thêm khoản riêng).
