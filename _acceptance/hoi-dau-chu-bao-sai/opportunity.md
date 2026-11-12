---
schema_version: 1
slug: hoi-dau-chu-bao-sai
feature: Đầu khách bấm «Hỏi đầu chủ» trên hồ sơ căn để mở bảng chia sẻ của máy với tin soạn sẵn cho người giữ căn, và bấm «Báo sai thông tin căn» để soạn tin nêu trường sai cùng giá trị đúng; người tự bấm gửi
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build   # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Manh Phan
decided_at: 2026-11-12T22:20:00Z   # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: 3e
lo_trinh_tep: docs/plan/lo-trinh.json
---

## Vấn đề & ai gặp

Mở từ hàng 3e của «Lộ trình onehub-inventory» (`docs/plan/lo-trinh.json`).
Nguồn: `wiki/nen/muc-luc.md#62c011273645275c4ecd1728afe0a36626484e09` · `wiki/nen/san-pham.md#7e0f870248935f95f71cf9300b1a0f7e5f2d1eb0` · `wiki/dot/mvp-dot-1.md#adb1cba497edd0ad0fd877ee7bf608aeabd4d83e`

Đầu khách bấm «Hỏi đầu chủ» trên hồ sơ căn để mở bảng chia sẻ của máy với tin soạn sẵn cho người giữ căn, và bấm «Báo sai thông tin căn» để soạn tin nêu trường sai cùng giá trị đúng; người tự bấm gửi

Vì sao: Chủ kho 2026-11-12 ở Cổng Đáng của năm hàng tách ra khi so hồ sơ căn của Quỹ hàng với hàng 3 «Hồ sơ căn»: «Build cả năm hàng». Quỹ hàng có nút «Hỏi đầu chủ» dính đáy hồ sơ cho người không giữ căn và nút «Báo sai thông tin căn» ở mục thuộc tính. Hợp đồng hàng 3 cắt nút hỏi ra và viện dẫn K1, nhưng K1 là gửi link cho khách, nên cả hai nút chưa có chỗ trên lộ trình. Luật SP-3: người luôn là người bấm gửi. Đứng sau 9a vì cần biết ai giữ căn

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] đã đạt «Người không giữ căn thấy nút «Hỏi đầu chủ» kèm tên người giữ căn ở đáy hồ sơ; bấm thì soạn sẵn tin có mã căn, toà và đường dẫn tới hồ sơ rồi mở bảng chia sẻ của máy, máy không có bảng chia sẻ thì chép tin và báo đã chép; căn chưa ai giữ thì nút tắt và nói vì sao; người giữ căn không thấy nút hỏi chính mình; «Báo sai thông tin căn» ở mục thuộc tính cho chọn trường sai, gõ giá trị đúng, ghi căn cứ rồi soạn tin theo cùng đường; không tin nào tự gửi, không gửi qua Zalo cá nhân hay vào nhóm, không ghi gì vào dữ liệu căn (SP-3); hai nút đi qua bộ nút theo quyền của hàng 9e» chưa?
- Kết quả nào là SỐNG: [đề xuất] Người không giữ căn thấy nút «Hỏi đầu chủ» kèm tên người giữ căn ở đáy hồ sơ; bấm thì soạn sẵn tin có mã căn, toà và đường dẫn tới hồ sơ rồi mở bảng chia sẻ của máy, máy không có bảng chia sẻ thì chép tin và báo đã chép; căn chưa ai giữ thì nút tắt và nói vì sao; người giữ căn không thấy nút hỏi chính mình; «Báo sai thông tin căn» ở mục thuộc tính cho chọn trường sai, gõ giá trị đúng, ghi căn cứ rồi soạn tin theo cùng đường; không tin nào tự gửi, không gửi qua Zalo cá nhân hay vào nhóm, không ghi gì vào dữ liệu căn (SP-3); hai nút đi qua bộ nút theo quyền của hàng 9e
- Kết quả nào là CHẾT: [đề xuất] chưa đạt «Người không giữ căn thấy nút «Hỏi đầu chủ» kèm tên người giữ căn ở đáy hồ sơ; bấm thì soạn sẵn tin có mã căn, toà và đường dẫn tới hồ sơ rồi mở bảng chia sẻ của máy, máy không có bảng chia sẻ thì chép tin và báo đã chép; căn chưa ai giữ thì nút tắt và nói vì sao; người giữ căn không thấy nút hỏi chính mình; «Báo sai thông tin căn» ở mục thuộc tính cho chọn trường sai, gõ giá trị đúng, ghi căn cứ rồi soạn tin theo cùng đường; không tin nào tự gửi, không gửi qua Zalo cá nhân hay vào nhóm, không ghi gì vào dữ liệu căn (SP-3); hai nút đi qua bộ nút theo quyền của hàng 9e» khi hết timebox
- Timebox: …
