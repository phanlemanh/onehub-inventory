---
schema_version: 1
feature: "Đầu chủ bấm một căn và thấy hồ sơ căn cạnh bảng, trên điện thoại thấy thẻ căn"
slug: ho-so-can
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [ui]
screens: [inventory]
status: implemented
approved_by: Manh Phan
approved_at: 2026-11-12
design_doc: _acceptance/ho-so-can/design.md
---

# Acceptance Contract: ho-so-can

## Context

Hàng 3 của lộ trình (`docs/plan/lo-trinh.json`, mã B2 hồ sơ cạnh bảng, B3 thẻ căn điện thoại). Bảng hàng bản đọc (hàng 2)
đã có khung hồ sơ dùng chung (hàng 1e) nhưng chưa màn nào mở hồ sơ căn, và khung ấy nổi từ mép trên màn hình, che thanh trên và thanh công cụ. Chủ kho chốt ở
Cổng Phạm vi «Lấy B có ghim»: ngăn nổi là cách chung của cả ứng dụng để xem chi tiết một dòng. Hàng này cho Bảng hàng mở hồ
sơ một căn, đặt ngăn nổi từ ngay dưới thanh trên của App Shell tới đáy màn hình (chủ kho chốt «Trừ thanh trên»; không che thanh trên, không khoá bảng), giữ toàn màn trên điện
thoại, và dựng thẻ căn cùng ruột hồ sơ từ một mô hình. Chỉ đọc. Không chạm
SP-1 (không truy vấn cơ sở dữ liệu), SP-3 (không gửi gì), SP-4 (không phải trang khách).

Source input: hàng `3` của lộ trình, ô `_acceptance/ho-so-can/opportunity.md` (build), lời giao của giám sát đợt «nen»,
phán quyết 2026-11-12 06:20Z (chia việc với hàng 2a), tin K-1211-9 của dãy K (sống chung với lưới).

## Criteria

- AC-1: Given một dòng Bảng hàng của căn mẫu, When dựng mô hình xem của căn, Then thẻ căn và hồ sơ cùng đọc mô hình ấy: mã
  căn, nơi (toà · khu), trạng thái, giá và tám trường bằng đúng giá trị của dòng, hiện cùng cách hiện của ô bảng (tiền «x,xx
  tỷ», m², huy hiệu trạng thái); thẻ có ba thông số Diện tích · Phòng ngủ · Xác nhận lúc; trường trống hiện «—».
- AC-2: Given Bảng hàng ở 1440 và 1024, When bấm mã một căn, Then hồ sơ căn ấy nổi bên phải vùng làm việc, mép trên sát mép
  dưới thanh trên của App Shell và mép dưới sát đáy màn hình, rộng khoảng hai phần năm; thanh trên không bị che, ô tìm vẫn thấy
  và gõ được, bảng bên trái ngăn vẫn bấm được, bấm mã căn khác thì hồ sơ đổi sang căn ấy mà không đóng.
- AC-3: Given hồ sơ đang mở ở 1440 và 1024, When nhìn phần bảng bên trái ngăn, Then cột số dòng, Căn, Toà vẫn đứng yên và
  thấy trọn khi bảng cuộn ngang, không cột nào bị tự ẩn, và giá của căn đang mở luôn thấy ở đầu hồ sơ; bài đo in số cột thấy trọn ở
  mỗi khổ khi hồ sơ đóng và mở.
- AC-4: Given hồ sơ mở, When nhìn địa chỉ trang, Then địa chỉ mang `ho-so=<id lần chào>`; mở thẳng địa chỉ ấy thì hồ sơ căn
  ấy hiện; nút lùi của trình duyệt đóng hồ sơ; địa chỉ mang id không có thì không mở gì và bảng vẫn bình thường.
- AC-5: Given hồ sơ mở, When bấm «Sau» và «Trước», Then đi theo đúng thứ tự dòng bảng đang hiện (cả sau khi gõ tìm), «Trước»
  tắt ở dòng đầu và «Sau» tắt ở dòng cuối; dòng đang mở bị tìm làm biến khỏi bảng thì hồ sơ vẫn hiện căn ấy và cả hai nút tắt; vùng đang chờ tải, lỗi, không
  có dòng hay không đủ quyền thì địa chỉ mang id thật cũng không mở hồ sơ.
- AC-6: Given hồ sơ mở ở máy tính, When mở từ lúc đóng, Then tiêu điểm vào tên hồ sơ; When bấm Esc trong hồ sơ hoặc «Đóng»,
  Then hồ sơ đóng và tiêu điểm về đúng mã căn của dòng vừa xem; bảng không bị giữ tiêu điểm khi hồ sơ mở (Tab vào được bảng).
- AC-7: Given Bảng hàng ở 414 và 360, When chạm mã một căn, Then hồ sơ mở toàn màn (phủ cả khung nhìn), đầu màn là thẻ căn
  (mã căn, giá, nơi, trạng thái, ba thông số), dưới là tám trường; «Đóng» về bảng và tiêu điểm về mã căn.
- AC-8: Given khung hồ sơ và khung lưới là khuôn dùng chung, When chạy bộ kiểm hành vi, bộ kiểm lưới, rào «màn tự dựng lại
  hành vi» và lưới chứng minh màn, Then tất cả xanh: trang mẫu hành vi vẫn mở hồ sơ, không tệp màn nào tự dựng khung hồ sơ,
  và tệp chứng minh màn của hồ sơ này qua lưới.
- AC-9: Given hồ sơ đang mở ở 1440 và 360, When quét trợ năng ở sáng và tối, Then không lỗi mức nghiêm trọng hay nguy cấp.
- AC-10: Given Bảng hàng đang chạy, When nhìn ở bốn khổ, sáng và tối, với hồ sơ một căn đang mở, Then thấy hồ sơ nổi bên phải, từ dưới
  thanh trên tới đáy màn hình, ở 1440 và 1024, hồ sơ toàn màn với thẻ căn ở đầu ở 414 và 360, chữ không chồng chữ, ảnh tối đọc được.
  (judgment)

## Vai × Màn

Hôm nay khung chưa có vai thật của người đăng nhập (chưa bắt đăng nhập), nên ô dưới là ý định, giống hàng 2; hồ sơ hàng này
chưa có phần nội bộ nào để che theo vai.

| Màn | Đầu chủ | Đầu khách | Trưởng nhóm | Quản trị sàn |
|---|---|---|---|---|
| inventory | được — mở hồ sơ mọi căn của sàn | được — mở hồ sơ mọi căn của sàn | được — mở hồ sơ mọi căn của sàn | chặn — vùng báo không đủ quyền, không có mã căn để mở hồ sơ; bảng quyền của hàng 9a quyết |

## Coverage

Quét theo khuôn «entity-feature» của bộ quét hình thái; bản đầy đủ ở mục «Quét không gian tiêu chí» của `design.md`.

- Trục A — khổ: 1440 · 1024 · 414 · 360; sáng · tối.
- Trục B — lối mở và đóng: bấm mã căn · địa chỉ trực tiếp · nút lùi · Esc · «Đóng» · Enter (lối của 2a, Later).
- Trục C — trạng thái hồ sơ: đóng · mở · Trước/Sau · đầu/cuối · id lạ · dòng bị tìm làm biến · vùng không có dòng.
- Trục D — dữ liệu căn: đủ · thiếu giá · thiếu diện tích hay phòng ngủ · cho thuê.

Thước: AC-2, AC-3, AC-6 phủ A (1440, 1024) × C; AC-7 phủ A (414, 360); AC-4 phủ B (địa chỉ, lùi) và C (id lạ); AC-6 phủ B
(Esc, Đóng); AC-5 phủ C (Trước/Sau, đầu/cuối, tìm); AC-1 phủ D; AC-9, AC-10 phủ A (sáng, tối); trạng thái vùng không có dòng
do bộ bài sinh từ sổ màn của hàng 2 đo (AC-8). [CE chưa kiểm chứng]: dữ liệu «cho thuê» — 60 căn mẫu chưa có lần chào cho
thuê, nhãn trạng thái theo cho thuê chỉ đo ở mức mô hình.

## Đường đo

- bỏ đường đo — ô cơ hội chưa khai ngưỡng (sổ quyết định).

## Out of scope

- Không ảnh của căn (G4), không số chủ nhà (G1), không Sẵn sàng bán (G5), không chế độ cuộc gọi: hàng sau của lộ trình hoặc
  MVP chưa xác nhận.
- Không sửa trong hồ sơ (hàng 4, 5); hồ sơ chỉ đọc.
- Không bảng thẻ trên điện thoại (hàng 2b): hàng này dựng thẻ căn làm đầu hồ sơ; danh sách thẻ thay lưới là của 2b.
- Không phím mũi tên, chọn ô, bôi vùng, lọc từng cột, nhóm, ẩn hiện cột (hàng 2a); Enter mở dòng là lối 2a dựng, hồ sơ nối
  vào khi 2a gộp (hàng ký sau chấm lại phần bị đụng).
- Không nút ghim ngăn thành cột, không kéo đổi rộng, không lớp trò chuyện với AI (chủ kho chốt «B có ghim»: hàng sau);
  không trang toàn màn riêng cho một căn.
- Không nút chính dính đáy trên điện thoại («Hỏi đầu chủ», «Ghi cuộc gọi») (Hỏi-4): luồng Gửi (K1) và ghi cuộc gọi (G3)
  chưa có.
- Không hướng căn trên thẻ: bảng nhãn chưa có nhãn «Hướng», mô hình nghiệp vụ không mở ở hàng này.

## Notes

- Sống chung với hàng 2a: `design.md` mục «Sống chung với hàng 2a».
