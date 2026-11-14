---
type: decision
title: Họ màn Danh sách khung cho màn Thành viên
links:
  [
    design/patterns/danh-sach-khung.md,
    design/screens.yaml,
    design/so-khoi.yaml,
    src/modules/identity/ui/members-list.tsx,
    src/components/candidate/form-dialog.tsx,
    _acceptance/thanh-vien-chon-tu-reui/contract.md,
  ]
sources:
  [
    _acceptance/thanh-vien-chon-tu-reui/decisions.jsonl,
    _acceptance/thanh-vien-chon-tu-reui/cong-pham-vi.html,
  ]
---

# 0033 Họ màn Danh sách khung cho màn Thành viên

## Status

Accepted, 2026-11-14, ở hàng 9c (Thành viên chọn từ ReUI). Chủ kho duyệt Cổng Phạm vi với lối B theo khuyến nghị.

## Context

Màn Thành viên ghép tay ở hàng 9 khi kho còn rỗng, sổ màn để họ của màn rỗng. Quyết định 0023 đòi chọn trước, vẽ sau. Hai
ứng viên cho danh sách người: khuôn Lưới của kho (bảng tính có lọc đầu cột, cần thêm bốn trường hiển thị của Thành viên vào
mô hình nghiệp vụ) và khối ReUI `solution-users-8` mà Quỹ hàng đã chọn. Việc của màn là Quản trị sàn xem vài chục người
với vai gì và đổi vai một người.

## Decision

Mở họ màn mới `list-frame` (Danh sách khung, `design/patterns/danh-sach-khung.md`) cạnh họ Lưới, màn mẫu là `members`:
một khung có tên và số đếm, mỗi người một dòng, các cột thẳng hàng theo bề rộng của chính khung, việc ở cuối dòng; không ô
tìm, không lọc cột. Hộp mời theo dáng khối `dialog-2` trên hộp dùng chung `FormDialog`, thêm ô nhãn tuỳ chọn cạnh tiêu đề
(mặc định tắt). Luật mời và quyền của hàng 9, 9e giữ nguyên.

## Consequences

- Màn danh sách ngắn về sau (một người hay một thứ mỗi dòng, việc trên dòng) so theo họ này; màn thứ hai của họ đưa khuôn
  lên `src/components/candidate/`.
- Mô hình nghiệp vụ không đổi; lọc theo vai trên màn Thành viên không có tới khi một hàng khác xin.
- Ba hộp khác dùng `FormDialog` không đổi dáng; ô nhãn có bài kiểm cả bật và tắt.
