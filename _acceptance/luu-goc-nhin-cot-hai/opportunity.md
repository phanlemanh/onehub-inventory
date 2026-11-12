---
schema_version: 1
slug: luu-goc-nhin-cot-hai
feature: Đầu chủ lưu cách xem Bảng hàng (lọc, sắp xếp, nhóm, cột đang hiện) thành một mục ở cột thứ hai của App Shell và mở lại đúng cách xem ấy
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build       # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Manh Phan
decided_at: 2026-11-12T08:25:47Z   # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: 2c
lo_trinh_tep: docs/plan/lo-trinh.json
---

## Vấn đề & ai gặp

Mở từ hàng 2c của «Lộ trình onehub-inventory» (`docs/plan/lo-trinh.json`).
Nguồn: `wiki/nen/muc-luc.md#62c011273645275c4ecd1728afe0a36626484e09` · `wiki/nen/san-pham.md#7e0f870248935f95f71cf9300b1a0f7e5f2d1eb0` · `wiki/dot/mvp-dot-1.md#adb1cba497edd0ad0fd877ee7bf608aeabd4d83e`

Đầu chủ lưu cách xem Bảng hàng (lọc, sắp xếp, nhóm, cột đang hiện) thành một mục ở cột thứ hai của App Shell và mở lại đúng cách xem ấy

Vì sao: Chủ kho 2026-11-12 trong phiên dãy K: «Có, tách hàng riêng» — tách phần lưu góc nhìn khỏi mục gác H7, đi ngay sau hàng 2a vì nối thẳng vào lọc, sắp xếp, nhóm, cột của 2a. Ở Sheet mỗi khu một tab; góc nhìn đã lưu thay cho tab

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] đã đạt «Lưu một cách xem rồi mở lại ra đúng tập dòng, thứ tự, nhóm và cột; mục đã lưu hiện ở cột thứ hai của App Shell và sáng lên khi đang mở; đổi tên và xoá được; Cổng Phạm vi chốt lưu trên máy chủ (dùng được trên mọi máy, cần bảng dữ liệu mới) hay cách khác, vì luật kho chưa cho giữ dữ liệu của sàn trên máy» chưa?
- Kết quả nào là SỐNG: [đề xuất] Lưu một cách xem rồi mở lại ra đúng tập dòng, thứ tự, nhóm và cột; mục đã lưu hiện ở cột thứ hai của App Shell và sáng lên khi đang mở; đổi tên và xoá được; Cổng Phạm vi chốt lưu trên máy chủ (dùng được trên mọi máy, cần bảng dữ liệu mới) hay cách khác, vì luật kho chưa cho giữ dữ liệu của sàn trên máy
- Kết quả nào là CHẾT: [đề xuất] chưa đạt «Lưu một cách xem rồi mở lại ra đúng tập dòng, thứ tự, nhóm và cột; mục đã lưu hiện ở cột thứ hai của App Shell và sáng lên khi đang mở; đổi tên và xoá được; Cổng Phạm vi chốt lưu trên máy chủ (dùng được trên mọi máy, cần bảng dữ liệu mới) hay cách khác, vì luật kho chưa cho giữ dữ liệu của sàn trên máy» khi hết timebox
- Timebox: …
