---
type: decision
title: Chuẩn hoá hệ design — màu trạng thái và cách sửa trên ô
links:
  [
    wiki/decisions/0051-khung-luoi-va-ngan-chi-tiet.md,
    design/behaviors.md,
    src/lib/format/index.ts,
    src/app/globals.css,
    src/styles/dark.css,
    src/components/candidate/grid-keys.ts,
    src/components/candidate/data-region.tsx,
    src/components/candidate/cell-editor.tsx,
    src/components/candidate/typed-cell.tsx,
    tests/e2e/support/mo-sua-o.ts,
  ]
sources:
  [
    "user, 2026-11-27 (phiên BH «Điều chỉnh UX Bảng hàng», «Duyệt cả ba lối A»)",
    "user, 2026-11-28 (Cổng Phạm vi VP11, «/acceptance-gate:approve chuan-hoa-he-design duyệt»)",
    _acceptance/chuan-hoa-he-design/decisions.jsonl,
  ]
---

# 0053 Chuẩn hoá hệ design — màu trạng thái và cách sửa trên ô

## Status

Accepted, 2026-11-27, tại phiên BH, trên ảnh dựng: «Duyệt cả ba lối A» cho màu trạng thái, bấm ô và dòng, lọc. Cổng Phạm vi
của lát 1 ngày 2026-11-28 nhận cả bốn khuyến nghị (Hỏi-1 đến Hỏi-4). Trang này ghi lát 1; lát 2 (mã căn là liên kết thật,
nút mở ở ô số thứ tự, ngăn theo dòng đang chọn, Tuỳ chỉnh sửa trong ô, vai Thành viên trung tính) và lát 3 (lọc) là hồ sơ
riêng và chưa làm.

## Context

Bảng hàng có hai cặp trạng thái trùng màu: «Chưa đủ để rao» và «Tạm ngừng» cùng cam ở cả hai nền; «Đang giao dịch» và «Đã
bán» cùng xanh thương hiệu ở nền sáng. Bảng màu chép từ Quỹ hàng, chủ kho chưa từng ký. Ô khoá vẽ ổ khoá ở mọi ô của căn đã
bán, ngừng hẳn, trong khi chính dòng đã nói trạng thái. Sửa trên ô theo luật hàng 2a và 4: Enter mở hồ sơ ở mọi ô, F2, gõ
hay bấm đúp mới vào sửa, bấm ra ngoài là mất chữ đã gõ. Ở nền tối, ngăn chi tiết nổi cùng màu với lưới, chỉ tách bằng viền.

## Decision

- Màu trạng thái: mỗi trạng thái một màu, như nhau ở sáng và tối; «Chưa đủ để rao» xám; «Đang giao dịch» tím hồng ở cả hai
  nền (Hỏi-2; tím của ảnh 27/11 chỉ cách «Đã bán» 10,4 ở nền sáng); bốn trạng thái kia giữ màu. Một nguồn: `STATUS_TONE`;
  trong mã ứng dụng chỉ nhãn «Đang giao dịch» dùng sắc info. Hai trạng thái gần màu nhau hơn ΔE2000 12 là trùng (Hỏi-2).
- Không ổ khoá ở ô khoá do trạng thái; lý do vẫn có khi rê và cho trình đọc màn hình.
- Phím (Hỏi-1, đổi luật đã ký của hàng 2a, hàng 4 và phân xử D-1211-19): Enter trên ô sửa được mở sửa, trên ô khác mở hồ sơ;
  phím cách mở hồ sơ ở mọi ô. Một luật: `gridKeyAction`.
- Rê lên ô sửa được thì có bút chì ở mép phải; máy không rê được thì bút trên ô đang chọn.
- Bấm ra ngoài khung sửa là ghi như Enter; giá trị chưa hiểu thì khung ở lại; Esc vẫn huỷ.
- Nền tối: lớp nổi (ngăn chi tiết, trình đơn, hộp thoại) sáng hơn lưới nửa nấc — trang 10, lưới 23, ngăn 30, dấu rê trong
  trình đơn 38 (Hỏi-4).
- Một bộ trợ giúp bài trình duyệt mở sửa một ô (`mo-sua-o.ts`) cho mọi hàng sửa trên ô.

## Consequences

- Năm luật đã ký đổi theo lời chủ kho; tám hồ sơ đã ký mang một dòng «sửa sau ký» và được ghim lại trước khi gộp
  (danh sách ở `_acceptance/chuan-hoa-he-design/design.md`).
- Dấu «khác danh mục» của hàng 3h không dùng sắc info nữa (đã là màu của «Đang giao dịch»): 3h chọn màu riêng.
- Việc đi kèm, không phải điều chủ kho duyệt (giám sát đòi, G-2811-25 — chờ chủ kho veto): tín hiệu sẵn sàng của vùng chỉ bật khi lưới đã yên: trước đây lưới vẽ lại mọi ô ngay sau tín hiệu (mật độ đổi khi khung
  cuộn gắn vào; màn dựng lại cách sửa trên ô mỗi lần vẽ), mất ô vừa bấm (`design/escapes.md`, 2026-11-28).
- Lưới của ReUI không vẽ lại thân bảng trong lúc đang nhấn chuột chọn ô; khung sửa vì thế ghi khi nhả chuột.
- Việc máy chọn, chờ chủ kho veto: chữ gợi ý của bút chì «Bấm Enter để đổi ô này»; bút hiện trên ô đang chọn khi máy không rê
  được; dấu «đã sửa» ở màn nhập tệp thôi dùng sắc info (nay `primary-light`, vẫn trùng «Đã bán» — lát 2 đổi sang viền).
