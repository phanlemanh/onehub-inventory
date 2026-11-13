---
slug: bo-o-tim-cua-vung
at: 2026-11-13T12:10:00Z
route: http://localhost:3481/inventory · http://localhost:3481/sent (bản vá tạm, ?loc=luon cho lối luôn hiện)
material: real-components
context: host-embedded
context_scenes: []
reaction: nac-1 (anh-gui-kem-the)
options: figures/proto/<màn>-nut-* (hàng ô lọc sau nút «Lọc»), figures/proto/<màn>-luon-* (luôn hiện)
divergence: opened
ds_skill: inventory-ui
states: [co-dong, khong-khop]
breakpoints: [mobile-360, mobile-414, desktop-1024, desktop-1440]
themes: [light, dark]
patched: 1
deferred: 0
---
# design-pass — bo-o-tim-cua-vung

Bản bấm được là Bảng hàng và Đã gửi thật trong App Shell thật, dữ liệu mẫu, với một bản vá tạm không commit trên nhánh
chính cộng PR của hàng 6: ô tìm bỏ khỏi thanh công cụ của lưới chung, câu của trạng thái không khớp nói về ô lọc đầu cột,
và `?loc=luon` cho hàng ô lọc luôn hiện (bỏ nút «Lọc»). Không viết mã lưới chung trên nhánh (điều kiện của giám sát: chờ
hàng 4 gộp). Bản vá giữ ở thư mục ghi chú của giám sát, `2e-ban-bam-duoc.patch`. Dãy K chạy ở cổng 3481.

## Ma trận capture

Mỗi ảnh có ở 1440, 1024, 414, 360 × sáng, tối (`<màn>-<lối>-<khổ>-<sang|toi>.png` trong `figures/proto/`); trạng thái
không khớp ở 1440 và 360.

| ảnh | nội dung |
|---|---|
| bang-hang-nut | figures/proto/bang-hang-nut-1440-sang.png |
| bang-hang-luon | figures/proto/bang-hang-luon-1440-sang.png |
| da-gui-nut | figures/proto/da-gui-nut-1440-sang.png |
| da-gui-luon | figures/proto/da-gui-luon-1440-sang.png |
| bang-hang-khong-khop | figures/proto/bang-hang-khong-khop-360-toi.png |
| da-gui-khong-khop | figures/proto/da-gui-khong-khop-1440-sang.png |

## Findings

| # | Thấy gì | Xử lý |
|---|---|---|
| 1 | Câu của trạng thái không khớp vẫn nói «ô tìm» khi ô tìm đã bỏ | patched: câu nói về ô lọc đầu cột (nhãn đặt ở S3) |
| 2 | Lối «sau nút Lọc»: bỏ ô tìm thì thanh công cụ không còn gợi ý chỗ gõ nào cho tới khi bấm «Lọc» | câu Hỏi-1 cho chủ kho |

## Nấc

Ngữ cảnh: host-embedded — màn thật trong App Shell thật. Phản ứng: nac-1 — máy dựng, tự chụp, gửi ảnh kèm trang Cổng Phạm
vi; chủ kho chọn trên ảnh.
