---
schema_version: 1
slug: english-query-words
feature: "Địa chỉ và từ truy vấn của Bảng hàng viết bằng tiếng Anh như luật kho: ?vai, ?mau, ?ma, ?toa, ?du-an, ?ho-so, ?vung, ?goc-nhin của /inventory và ?quyen của /proto/[slug] đổi sang từ tiếng Anh, liên kết đã dán và góc nhìn đã lưu vẫn mở đúng chỗ"
owner: phanlemanh@gmail.com
stage: discovery              # discovery | decided | archived
decision:         # build | iterate | park | kill — người ký Cổng 0 điền
decided_by:
decided_at:     # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: 1v
lo_trinh_tep: docs/plan/lo-trinh.json
---

## Vấn đề & ai gặp

Mở từ hàng 1v của «Lộ trình onehub-inventory» (`docs/plan/lo-trinh.json`).
Nguồn: `wiki/nen/muc-luc.md#62c011273645275c4ecd1728afe0a36626484e09` · `wiki/nen/san-pham.md#7e0f870248935f95f71cf9300b1a0f7e5f2d1eb0` · `wiki/dot/mvp-dot-1.md#adb1cba497edd0ad0fd877ee7bf608aeabd4d83e`

Địa chỉ và từ truy vấn của Bảng hàng viết bằng tiếng Anh như luật kho: ?vai, ?mau, ?ma, ?toa, ?du-an, ?ho-so, ?vung, ?goc-nhin của /inventory và ?quyen của /proto/[slug] đổi sang từ tiếng Anh, liên kết đã dán và góc nhìn đã lưu vẫn mở đúng chỗ

Vì sao: AGENTS.md đòi mã, định danh và tên tệp bằng tiếng Anh. Hồ sơ english-route-names (PR #114) đổi /tuy-chinh-san và /proto/bo-nut-theo-quyen, và ở Cổng Phạm vi (Hỏi-2) chủ kho chọn tách tám từ truy vấn của Bảng hàng sang hàng riêng vì chúng chạm khoảng hai mươi tệp bài kiểm và tools/deploy/thu-ban-dung.sh. Chủ kho 2026-11-23: «mở hàng riêng cho từ truy vấn Bảng hàng».

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] đã đạt «Không còn từ truy vấn tiếng Việt nào được đọc trong src/ (lệnh quét có cặp phá thử); make check, make e2e và bài trình duyệt có Postgres của Bảng hàng xanh với từ mới; góc nhìn đã lưu và liên kết có ?vung= cũ được xử lý theo lựa chọn của chủ kho ở Cổng Phạm vi» chưa?
- Kết quả nào là SỐNG: [đề xuất] Không còn từ truy vấn tiếng Việt nào được đọc trong src/ (lệnh quét có cặp phá thử); make check, make e2e và bài trình duyệt có Postgres của Bảng hàng xanh với từ mới; góc nhìn đã lưu và liên kết có ?vung= cũ được xử lý theo lựa chọn của chủ kho ở Cổng Phạm vi
- Kết quả nào là CHẾT: [đề xuất] chưa đạt «Không còn từ truy vấn tiếng Việt nào được đọc trong src/ (lệnh quét có cặp phá thử); make check, make e2e và bài trình duyệt có Postgres của Bảng hàng xanh với từ mới; góc nhìn đã lưu và liên kết có ?vung= cũ được xử lý theo lựa chọn của chủ kho ở Cổng Phạm vi» khi hết timebox
- Timebox: …
