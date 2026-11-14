---
type: decision
title: Thuế phí là dữ liệu của sàn, một hình dạng khoản, tính Về tay ở một chỗ
links:
  [
    ontology/entities/FeeItem.yaml,
    src/modules/company-config/fee-schedule.ts,
    db/migrations/012_thue_phi.sql,
    src/components/candidate/framed-list.tsx,
    _acceptance/thue-phi/contract.md,
  ]
sources:
  [
    _acceptance/thue-phi/decisions.jsonl,
    docs/superpowers/specs/2026-11-14-thue-phi-design.md,
    "giám sát đợt nền, cấp số 0037 (G-1411-142), 2026-11-14",
  ]
---

# 0037 Thuế phí là dữ liệu của sàn, một hình dạng khoản, tính Về tay ở một chỗ

## Status

Accepted, 2026-11-14, ở hàng 19 (thue-phi). Chủ kho duyệt phạm vi và kế hoạch cùng ngày, chọn Hỏi-7 B (sàn thêm, đổi tên,
bỏ khoản riêng).

## Context

Quỹ hàng tính «về tay» theo thuế phí mỗi sàn đặt. ADR-0018 cấm đối tượng tự đặt và công thức: sàn không được viết cách
tính riêng. Chủ kho muốn sàn tự thêm khoản (phí dịch vụ hồ sơ…) mà vẫn giữ hai khoản theo luật.

## Decision

- Một khoản phí có đúng một hình dạng: tên, tỉ lệ phần trăm trên Giá chào, bật hay tắt khỏi giá bao phí. Đó là dữ liệu,
  không phải công thức, nên nằm trong giới hạn của ADR-0018.
- Hai khoản theo luật (Thuế thu nhập cá nhân 2%, Lệ phí trước bạ 0,5%) cố định, chỉ bật tắt; khoản riêng tối đa 5, tỉ lệ
  0–5% bước 0,1%; tổng các khoản bật tối đa 10%. Tỉ lệ lưu phần vạn số nguyên, tiền làm tròn xuống tới đồng.
- Bảng `company_fee_items` chỉ giữ khoản sàn đã đổi hay thêm; không dòng là mặc định. Không xoá: trả về mặc định hay bỏ
  khoản ghi người và lúc; mã khoản thêm cấp một lần.
- Lõi tính và kiểm mức ở một hàm thuần trong `company-config`, màn và API dùng chung.
- Màn ghép từ khối `FramedList` của họ danh sách khung; khối được mở thêm ba tuỳ chọn (cột cuối rộng theo nội dung, dòng
  không chữ cái đầu, dòng ghi chú dưới mỗi hàng), màn Thành viên không đổi dáng.
- Nhãn «Thuế thu nhập» (17 ký tự trở xuống theo `design/language.md`), tên đầy đủ «Thuế thu nhập cá nhân» và «Thuế TNCN»
  là nhãn thay thế để tìm.

## Consequences

- Cột Về tay của Bảng hàng tính từ Giá chào và Điều kiện phí của từng hàng; ô tiền làm tròn hai số lẻ như mọi ô tiền
  (2.895.000.000 hiện «2,9 tỷ», làm tròn nửa lên); dòng ví dụ của phần Thuế phí hiện ba số lẻ.
- Dấu định nghĩa lúc tính trên từng giá chờ hàng 10, khi giá thật vào cơ sở dữ liệu.
