---
schema_version: 1
feature: "Mỗi màn trong sổ có sẵn bộ bài kiểm trạng thái sinh ra từ sổ, kèm bài phá thử chứng minh bài kiểm đỏ được"
slug: bo-bai-kiem-tu-so-man
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [cli]
status: approved
approved_by: Manh Phan
approved_at: 2026-11-11
design_doc: _acceptance/bo-bai-kiem-tu-so-man/design.md
---

# Acceptance Contract: bo-bai-kiem-tu-so-man

## Context

Mỗi màn mới hôm nay tự viết bài kiểm trạng thái, và bài viết tay để lại lỗ (bốn lỗ hàng 1b ký với điều kiện sửa ở đây, một
lỗ của 1i). Vòng này dựng một tệp kiểm trình duyệt đọc sổ màn lúc chạy và dựng bài cho từng màn từ các công thức trạng thái;
mỗi công thức có ca phá gọi đúng hàm kiểm của ca chính. Hạng T3 vì công thức nằm trong `tools/`. Không chạm SP-1, SP-3; SP-4
xem Notes.

Source input: hàng `1f` của `docs/plan/lo-trinh.json`, ô `_acceptance/bo-bai-kiem-tu-so-man/opportunity.md` (build), mục
ngoài hợp đồng của `_acceptance/luoi-va-o-theo-kieu/review-findings.md` (bài chờ tải treo, đối chứng chờ tải, tìm bỏ sót,
đỏ giả khi máy chậm), ghi chú hàng 1i trong sổ luật của đợt.

## Criteria

- AC-1: Given sổ màn có màn `built` với `audience` `staff` hay `public`, When liệt kê bài của tệp kiểm màn, Then mỗi màn ấy có
  bộ khung mang id của màn mà không ai viết bài cho nó; và Given một bản sao sổ thêm một màn `built` mới (trỏ một trang có
  thật), When liệt kê lại, Then bộ khung của màn mới xuất hiện, bỏ màn ấy thì bộ biến mất.
- AC-2: Given màn `planned` hay màn `audience: dev` trong sổ, When chạy tệp kiểm màn, Then màn ấy không có bộ khung và tệp
  kiểm in một dòng gọi tên màn kèm lý do bỏ; và Given sổ sai (thiếu khoá, họ lạ), When chạy tệp kiểm màn, Then nó đỏ với
  đúng lỗi bộ đọc sổ của hàng 1d báo, không có bài nào chạy trên sổ sai.
- AC-3: Given mỗi màn của bộ khung, When chạy ở bốn khổ, Then: trang mở với một `h1` đúng nhãn của màn trong
  `ontology/labels.yaml` · trang không cuộn ngang · không lỗi trên trình duyệt · axe không có vi phạm nặng ở sáng và tối.
- AC-4: Given mỗi bài của AC-3 trên chính màn ấy, When phá đúng chỗ bài đo (đổi chữ `h1`, chèn phần tử rộng hơn màn, ném lỗi
  trên trang, chữ không đọc được), Then chính hàm kiểm của ca chính đỏ với thông điệp ghim gọi tên màn và bài.
- AC-5: Given bảng trạng thái của `design/states.md`, When chạy bài kiểm đơn vị của bộ công thức, Then mỗi trạng thái vùng
  trong bảng có đúng một công thức, và mỗi công thức có hàm kiểm, ít nhất một cách phá và thông điệp ghim; thêm vào bảng một
  trạng thái vùng không có công thức, hay bỏ cách phá của một công thức, thì bài kiểm ấy đỏ gọi tên trạng thái.
- AC-6: Given đích hiệu chuẩn (bản mẫu Lưới) và mọi màn họ `grid` có vùng dữ liệu, When chạy bộ vùng, Then cả bảy trạng thái
  (chờ tải, trống, tìm không ra, lỗi, một phần hỏng, chữ dài, không đủ quyền) xanh, và mỗi cách phá của mỗi công thức làm chính
  hàm kiểm ấy đỏ với thông điệp ghim; Given màn họ `grid` chưa có vùng, Then nó chỉ được bỏ qua có tên khi nằm trong danh sách
  cố định của bộ công thức (kèm lý do), màn khác chưa có vùng thì đỏ gọi tên màn, màn trong danh sách mà đã có vùng thì đỏ «gỡ
  khỏi danh sách»; Given màn họ `grid` có bảng mà không qua vùng dùng chung, Then nó đỏ «lưới dựng ngoài khuôn».
- AC-7: Given công thức chờ tải, When phá cho khung chờ không bao giờ hiện, Then hàm kiểm đỏ với thông điệp ghim trước 15 giây
  (không treo tới hết giờ); và When phá độ trễ thật của đồng hồ vùng (hẹn giờ chạy ngay), Then cùng hàm kiểm ấy đỏ «hiện chỉ
  báo trước 1 giây».
- AC-8: Given công thức tìm, When tìm một chuỗi lấy từ dữ liệu mà khớp ít nhất hai dòng nằm trên ít nhất hai trang, Then tập
  dòng hiện qua mọi trang bằng đúng tập dòng khớp tính từ toàn bộ dòng trước khi tìm, và số dòng ở đầu vùng bằng cỡ tập ấy;
  When phá bằng bỏ một dòng khớp khỏi kết quả, hay chỉ để lại trang đầu của kết quả, Then hàm kiểm đỏ «tìm bỏ sót dòng khớp».
- AC-9: Given máy chậm, When chạy cả tệp kiểm màn với CPU bị hãm 4 lần ở khổ 1440, Then mỗi trang của mọi bài đo được thật sự
  chậm đi (một vòng tính cố định chậm ít nhất 2,5 lần so với lúc chưa hãm, đo trong cùng trang) và mọi bài xanh không chạy lại;
  mọi ca do bộ chạy chờ bản truyền dòng đã thay và màn sẵn sàng tương tác trước khi đưa cho công thức, công thức không tự mở
  trang.
- AC-10: Given bản khai vai `ontology/roles.yaml`, When chạy tệp kiểm màn, Then bảng Vai × Màn nó in có đúng các vai ấy theo
  thứ tự khai; thêm một vai thứ năm vào bản sao bản khai thì bảng có thêm cột ấy mà không sửa dòng mã nào.

## Coverage

Quét trục tại chỗ theo khuôn «test-matrix» của bộ quét hình thái, không gọi bộ quét (sổ quyết định):

- Trục 1 — loại màn trong sổ: `built` staff · `built` public · `planned` · `dev` · sổ sai.
- Trục 2 — họ màn: không họ · `grid` có vùng · `grid` chưa có vùng · `grid` dựng ngoài khuôn.
- Trục 3 — trạng thái: bốn bài khung + bảy trạng thái vùng (bảng `design/states.md`).
- Trục 4 — chiều đo: ca chính xanh · ca phá đỏ với thông điệp ghim.
- Trục 5 — môi trường: bốn khổ · máy thường · máy hãm CPU.
- Trục 6 — vai: bốn vai khai · vai thứ năm.

Thước: mỗi ô (màn × trạng thái × chiều) có một bài; AC-1, AC-2 phủ trục 1; AC-6 phủ trục 2; AC-3, AC-5, AC-6 phủ trục 3; AC-4,
AC-6, AC-7, AC-8 phủ trục 4; AC-3, AC-9 phủ trục 5; AC-10 phủ trục 6. Ô `built` public hôm nay rỗng (chưa có màn khách): phủ
bằng sổ giả của AC-1. [CE chưa kiểm chứng]: chưa có màn thật họ `grid` có vùng — ô ấy chỉ chứng trên đích hiệu chuẩn.

## Đường đo

- «Thêm một màn vào sổ thì có bộ bài kiểm mà không viết tay»: số bài khung liệt kê cho một màn mới trên sổ giả — từ bài liệt
  kê của E1 · AC-1 bảo đảm.
- «Phá từng trạng thái thì bài kiểm tương ứng đỏ»: số ca phá đạt trên tổng số ca phá của ma trận viết trước (khung 64, vùng
  theo bảy công thức) — từ lượt chạy bộ màn của E4, E6, E7, E8 · AC-4, AC-6, AC-7, AC-8 bảo đảm.

## Vai × Màn

Vòng này không chạm màn nào của nhân viên sàn (không sửa `src/`); nó dựng bài kiểm cho mọi màn đã có. Bảng Vai × Màn mà tệp
kiểm in thuộc AC-10.

## Out of scope

- Bài chạy theo từng vai trên trình duyệt: chờ bảng quyền (hàng 9a) và đăng nhập không cơ sở dữ liệu (Hỏi-1).
- Trạng thái cần đường lưu thật hay đăng nhập: xung đột khi lưu, mất mạng khi lưu, phiên hết hạn, link hết hạn.
- Sửa bài kiểm trình duyệt có sẵn của hàng khác, kể cả `tests/e2e/grid.spec.ts`: bốn lỗ đóng trong bộ mới, bài cũ giữ nguyên.
- Thêm cách đưa màn thật vào trạng thái (`?state=`): việc của màn khi nó dựng vùng (hàng 2).
- Bài kiểm che dữ liệu nội bộ trên trang khách (SP-4): thuộc hàng trang khách.

## Notes

- SP-4: bộ khung chạy cả màn `public` khi có, nhưng chỉ đo khung; không chứng gì về dữ liệu nội bộ.
- Ca phá chạy ở cả bốn khổ như ca chính (sổ quyết định dòng 13).
- Bài trình duyệt mang thời hạn riêng 90 giây (bài axe 240 giây); bài kiểm đơn vị gọi Python mang hạn 60 giây.
