---
schema_version: 1
slug: bo-kiem-chung-khi-dang-nhap
feature: Bộ kiểm chung sinh từ sổ màn chạy được trên màn cần đăng nhập và không lỡ nhịp khi máy chậm
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build   # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Manh Phan
decided_at: 2026-11-12T01:49:02Z   # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: 1r
lo_trinh_tep: docs/plan/lo-trinh.json
---

## Vấn đề & ai gặp

Mở từ hàng 1r của «Lộ trình onehub-inventory» (`docs/plan/lo-trinh.json`).
Nguồn: `wiki/nen/muc-luc.md#eda65bbab423f707ecfec5947798f0f1d04fb0db` · `wiki/nen/san-pham.md#7e0f870248935f95f71cf9300b1a0f7e5f2d1eb0` · `wiki/dot/mvp-dot-1.md#adb1cba497edd0ad0fd877ee7bf608aeabd4d83e`

Bộ kiểm chung sinh từ sổ màn chạy được trên màn cần đăng nhập và không lỡ nhịp khi máy chậm

Vì sao: Chủ kho 2026-11-11 cho bộ kiểm chung bỏ qua có điều kiện màn cần đăng nhập (hàng 9); khi nối dữ liệu thật mọi màn đều cần đăng nhập nên bộ kiểm sẽ bỏ qua gần hết. Hàng 1o trượt hai lần vì bài kiểm lỡ nhịp trên máy chậm

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] đã đạt «Bộ kiểm chung mở được màn cần đăng nhập bằng một phiên thử và đo khung, trợ năng như màn thường; danh sách bỏ qua vì cần đăng nhập về rỗng; các bài chờ ngăn, băng báo hiện hẳn rồi mới đo, chạy lặp hai mươi lần dưới máy giảm tốc vẫn xanh» chưa?
- Kết quả nào là SỐNG: [đề xuất] Bộ kiểm chung mở được màn cần đăng nhập bằng một phiên thử và đo khung, trợ năng như màn thường; danh sách bỏ qua vì cần đăng nhập về rỗng; các bài chờ ngăn, băng báo hiện hẳn rồi mới đo, chạy lặp hai mươi lần dưới máy giảm tốc vẫn xanh
- Kết quả nào là CHẾT: [đề xuất] chưa đạt «Bộ kiểm chung mở được màn cần đăng nhập bằng một phiên thử và đo khung, trợ năng như màn thường; danh sách bỏ qua vì cần đăng nhập về rỗng; các bài chờ ngăn, băng báo hiện hẳn rồi mới đo, chạy lặp hai mươi lần dưới máy giảm tốc vẫn xanh» khi hết timebox
- Timebox: …
