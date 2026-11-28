---
slug: nhap-excel
at: 2026-11-17T01:40:00Z
route: /proto/nhap-excel?loi=a|b&buoc=1..5 (bản phát triển, cổng 3481, dữ liệu mẫu trong mã bản mẫu, không cơ sở dữ liệu)
material: real-components
context: host-embedded
context_scenes: []
reaction: nac-1 (anh-gui-kem-the)
options: trang cổng ở thư mục đợt, trinh/11-cong-pham-vi.html (, hai lối so ngang cùng bước, cùng dữ liệu) · ảnh ở cong/ · khối gốc ở evidence/reui-*.png
divergence: opened
ds_skill: inventory-ui
states: [buoc1-chon-tep, buoc2-ghep-cot, buoc3-gia-tri-va-can, buoc4-xem-truoc, buoc5-xong]
breakpoints: [desktop-1440, desktop-1024]
themes: [light]
patched: 0
deferred: 0
---
# design-pass — nhap-excel

Hai lối dựng từ CÙNG các khối (Frame, Badge, Button, Checkbox của kho) và CÙNG dữ liệu mẫu, chỉ khác chỗ đặt thanh bước:
A ngang trên thân (hình solution-crm-6, khối Quỹ hàng đã chọn), B dọc ở cột trái (hình onboarding-2). wizard-1 (ba bước
ngang) chỉ bày ảnh gốc: nó là A với ba bước, gộp ghép cột và giá trị thành một bước dài. Thanh bước ở bản mẫu là chỗ thay
tạm cho `@reui/stepper` mà bản dựng cài; bảng ghép cột và lưới xem trước ở bản dựng là `DataRegion` của kho.

## Ma trận capture

| state | breakpoint | theme | file |
|---|---|---|---|
| buoc1-chon-tep | 1440 | light | cong/a-buoc1-1440-sang.png · cong/b-buoc1-1440-sang.png |
| buoc2-ghep-cot | 1440 | light | cong/a-buoc2-1440-sang.png · cong/b-buoc2-1440-sang.png |
| buoc3-gia-tri-va-can | 1440 | light | cong/a-buoc3-1440-sang.png · cong/b-buoc3-1440-sang.png |
| buoc4-xem-truoc | 1440 | light | cong/a-buoc4-1440-sang.png · cong/b-buoc4-1440-sang.png |
| buoc4-xem-truoc | 1024 | light | cong/a-buoc4-1024-sang.png · cong/b-buoc4-1024-sang.png |
| buoc5-xong | 1440 | light | cong/a-buoc5-1440-sang.png · cong/b-buoc5-1440-sang.png |

## Findings

- Ở 1024, lối B còn khoảng 600 px cho lưới xem trước 7 cột — đã chạm mép; tệp thật 12–15 cột sẽ cuộn ngang. Lối A giữ trọn
  bề ngang. Đây là lý do máy khuyên A.
- Bản mẫu chưa có trạng thái lỗi, mất mạng, không quyền: chúng là trạng thái kho sẵn có (`RegionError`, băng mất mạng,
  `RegionDenied`), không phải lựa chọn bố cục; bài trình duyệt E16 đo đủ mười ba trạng thái.
- Nút «Nạp tệp» ở trạng thái trống của Bảng hàng: luật design-assembly «empty state offers a button only where the person can
  fill the list from this screen» — Nạp tệp là màn khác, nên ở trạng thái trống nó là MỘT liên kết trong câu, nút viền thì ở
  đầu màn Bảng hàng (sửa AC-11 theo luật này).
