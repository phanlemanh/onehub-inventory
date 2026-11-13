---
schema_version: 1
feature: "Đầu chủ mở hồ sơ căn và đọc đủ thông tin của căn và của lần chào"
slug: ho-so-du-thong-tin
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [ui]
screens: [inventory]
status: implemented
approved_by: Manh Phan
approved_at: 2026-11-13
design_doc: _acceptance/ho-so-du-thong-tin/design.md
---

# Acceptance Contract: ho-so-du-thong-tin

## Context

Hàng 3b của lộ trình (`docs/plan/lo-trinh.json`), ô `_acceptance/ho-so-du-thong-tin/opportunity.md` (chủ kho «Build cả
năm hàng», 2026-11-12). Hồ sơ căn của hàng 3 chỉ có tám trường của Bảng hàng. Hàng này cho hồ sơ đủ thuộc tính căn, phần
lần chào, các lần chào của căn, mức đủ thông tin và câu xác nhận đếm ngày; thêm năm trường của lần chào vào mô hình
nghiệp vụ (đổi ontology — chủ kho soi). Chỉ đọc. Hàng 15 dựng trên Pháp lý và Tình trạng sử dụng của hàng này.
Không chạm SP-1 (không truy vấn cơ sở dữ liệu), SP-3 (không gửi gì), SP-4 (không phải trang khách).

## Criteria

- AC-1: Given mô hình nghiệp vụ, When chạy bộ kiểm mô hình và sinh kiểu, Then `Listing` có `furnished`, `occupantType`,
  `legalStatus`, `financing`, `originalEntryTimestamp` với kiểu đã chốt ở Cổng Phạm vi, luật «một căn có nhiều nhất một
  lần chào đang mở trong một sàn» được khai, bảng nhãn có nhãn cho năm trường cùng Hướng, Loại hình (và bốn giá trị),
  Loại căn, Mức đủ thông tin, Các lần chào — nhãn nào cũng không quá 17 ký tự — và kiểu sinh ra khớp mô hình.
- AC-2: Given dữ liệu mẫu, When dựng lần chào mẫu, Then 60 lần chào hiện tại giữ nguyên mã, trạng thái, giá và Bảng hàng
  vẫn 60 dòng; có thêm lần chào cũ (Đã bán hoặc Ngừng bán, nhãn MAU) trên một phần các căn; mọi lần chào có ngày tạo;
  bốn trường mới có ô đủ và ô trống; không căn nào có hai lần chào đang mở; bộ kiểm dữ liệu mẫu bắt được ca phá «hai lần
  chào đang mở trên một căn».
- AC-3: Given hồ sơ một căn đang mở, When đọc khối «Căn», Then thấy Mã căn, Loại căn, Diện tích, Tầng, Hướng, Toà, Dự án,
  Loại hình đúng giá trị của căn ấy trong danh mục; Loại căn là «Studio», «{n}PN» hoặc «—»; ô trống hiện «—».
- AC-4: Given hồ sơ một căn đang mở, When nhìn đầu hồ sơ, Then dòng nơi chốn là «Dự án · Toà · Loại hình»; ba thông số
  của thẻ căn là Diện tích · Phòng ngủ · Hướng; đầu hồ sơ ghi «Xác nhận hôm nay», «Xác nhận N ngày trước» (N đếm theo
  ngày lịch giờ Việt Nam) hoặc «Chưa xác nhận với chủ nhà».
- AC-5: Given hồ sơ một căn đang mở, When đọc khối lần chào, Then khối tên «Lần chào đang mở» (hoặc «Lần chào đang xem»
  khi lần ấy đã đóng) có Pháp lý, Nội thất, Tài chính, Tình trạng sử dụng đúng giá trị của lần chào; ô thiếu ghi «Chưa
  có».
- AC-6: Given một lần chào, When tính mức đủ thông tin, Then đếm năm phần theo thứ tự Giá · Nội thất · Pháp lý · Tài chính ·
  Tình trạng sử dụng; hồ sơ hiện «Mức đủ thông tin», số «có/5», thanh tiến độ cùng giá trị, và «Còn thiếu: …» liệt tên
  phần thiếu theo thứ tự ấy, hoặc «Đủ thông tin» khi đủ; bài đo phủ đủ 32 tổ hợp có/thiếu.
- AC-7: Given một căn có nhiều lần chào, When mở hồ sơ, Then «Các lần chào của căn · N» liệt mọi lần chào của sàn trên căn
  ấy, mới trước, mỗi dòng «Lần k» (lần cũ nhất là Lần 1), huy hiệu trạng thái, giá, ngày tạo; dòng đang xem được đánh dấu;
  When chạm một lần cũ, Then giá, trạng thái, khối lần chào, mức đủ và câu xác nhận đổi sang lần ấy, có dải «Đang xem lần
  chào cũ · Lần k» và nút «Về lần mới nhất»; Trước/Sau sang căn khác thì hồ sơ về lần mới nhất của căn ấy.
- AC-8: Given hồ sơ đang mở, When tìm chỗ ghi, Then hồ sơ không có ô nhập hay nút nào đổi dữ liệu, không có đường ghi mới
  nào ngoài `/api/v1`, và Bảng hàng giữ đúng tám cột, 60 dòng như hàng 2.
- AC-9: Given hồ sơ một căn có lần chào cũ đang mở ở 1440 và 360, When quét trợ năng ở sáng và tối, cả khi đang xem lần
  cũ, Then không lỗi mức nghiêm trọng hay nguy cấp.
- AC-10: Given Bảng hàng đang chạy, When nhìn hồ sơ một căn có lần chào cũ ở bốn khổ, sáng và tối, Then đọc được từ trên
  xuống theo thứ tự xác nhận · mức đủ · căn · lần chào · các lần chào, chữ không chồng chữ, ô «Chưa có» phân biệt được
  với giá trị thật, ảnh tối đọc được. (judgment)

## Vai × Màn

Khung chưa có vai thật của người đăng nhập ở Bảng hàng (như hàng 3); ô dưới là ý định.

| Màn | Đầu chủ | Đầu khách | Trưởng nhóm | Quản trị sàn |
|---|---|---|---|---|
| inventory | được — đọc đủ hồ sơ mọi căn của sàn | được — đọc đủ hồ sơ mọi căn của sàn | được — đọc đủ hồ sơ mọi căn của sàn | chặn — vùng báo không đủ quyền, không mở hồ sơ |

## Coverage

Quét theo khuôn «entity-feature»; bản đầy đủ ở mục «Quét không gian tiêu chí» của `design.md`.

- Trục A — khổ: 1440 · 1024 · 414 · 360; sáng · tối.
- Trục B — phần hồ sơ: đầu (nơi chốn, ba thông số, xác nhận) · mức đủ · căn · lần chào · các lần chào.
- Trục C — dữ liệu lần chào: đủ · thiếu từng trường · thiếu cả bốn · chưa xác nhận · xác nhận hôm nay · N ngày.
- Trục D — số lần chào của căn: một · nhiều; đang xem mới nhất · đang xem lần cũ · sang căn khác.
- Trục E — mô hình: trường mới · nhãn · luật một lần chào mở · kiểu sinh ra · dữ liệu mẫu.

Thước: AC-1 phủ E; AC-2 phủ E (dữ liệu mẫu, luật) và D (nhiều lần); AC-3 phủ B (căn); AC-4 phủ B (đầu) và C (xác nhận);
AC-5 phủ B (lần chào) và C (thiếu); AC-6 phủ C (32 tổ hợp); AC-7 phủ D; AC-8 phủ chỉ đọc; AC-9, AC-10 phủ A.
[CE chưa kiểm chứng]: lần chào cho thuê — dữ liệu mẫu chưa có lần chào cho thuê, nhãn trạng thái theo cho thuê chỉ đo ở
mức mô hình như hàng 3.

## Đường đo

Ô cơ hội khai ngưỡng sống bằng câu bắt-khi của hàng; mỗi vế một AC:

- thuộc tính căn đủ bộ, dòng nơi chốn có loại hình, ba thông số có hướng → AC-3, AC-4 (bài trình duyệt đọc DOM hồ sơ).
- phần lần chào và ô «Chưa có» → AC-5. Thanh mức đủ → AC-6. Các lần chào, chạm lần cũ → AC-7.
- câu xác nhận → AC-4. Bốn trường trong mô hình, có nhãn → AC-1. Chỉ đọc → AC-8.
- «có lần chuyển lược đồ qua bộ kiểm cách ly» → không đo ở hàng này nếu chủ kho chọn lối khuyên ở Hỏi-2; vế ấy sang
  hàng 10.

## Out of scope

- Không sửa bốn trường hay bất kỳ trường nào trong hồ sơ (hàng 4, 3d); hồ sơ chỉ đọc.
- Không migration, không bảng lần chào trong cơ sở dữ liệu (hàng 10), nếu chủ kho chọn lối khuyên ở Hỏi-2.
- Không lịch sử của căn (hàng 3c), không ảnh, không Sẵn sàng bán (hàng 15), không bao phí và dòng thuế phí (hàng 19).
- Không địa chỉ riêng mở thẳng một lần chào cũ, không trang riêng của căn (hàng 3f).
- Không số chủ nhà hay liên hệ của chủ trên hồ sơ (hàng 13, sau hàng 10); không màn danh bạ liên hệ (L2, sau MVP).
- Không đổi cách gọi theo sàn cho «Loại hình» và các giá trị (hàng 7e).
- Không đổi cách lưu hướng trong danh mục (đang là chữ «Đông Nam»; RESO `DirectionFaces` là giá trị tiếng Anh) — hồ sơ
  hiện đúng chữ đang lưu.

## Notes

- Bảng so nguồn: mục 10, 11, 15, 16, 21, 27, 28 của bảng so Chi tiết căn (ghi chú chung của nhóm phiên).
