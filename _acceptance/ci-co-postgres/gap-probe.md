---
slug: ci-co-postgres
at: 2026-11-13T09:00:00Z
verdict: findings
p0: 0
p1: 4
p2: 1
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | evals | Bài chép-đúng mới của AC-7 lại so bằng git show tới commit cũ, chạy trong job kiểm cũ của CI (bản sao nông); phạm vi quét chỉ phủ tệp make ci-db chạy; ci-thu không chạy make check trong bản sao nông | PR mở, job kiểm cũ đỏ vì lịch sử vắng — đúng lỗi 7c đã vấp; lượt dựng lại vẫn xanh | Mã blob ghim trong bài; ci-thu chạy make check trong bản sao nông; quét mọi tệp kiểm CI chạy, có ca đỏ ở tests/*.test.ts | fixed: AC-7 so mã blob ghim (9838bcec…, 10817856…), quét mọi tests/**, tools/**, db/scripts/**; AC-5 và ci-thu chạy make check trong bản sao nông |
| P1 | contract | Không AC nào đòi lượt CI thật; ba ngưỡng của ô cơ hội nói «trên CI»; lượt dựng lại chỉ xét không vượt trần | Job chạm trần và bị cắt ở PR đầu dù hồ sơ ghi đạt | AC đòi mã lượt CI thật, hai dòng nhật ký, thời lượng và mức tăng so với nhánh chính; lượt dựng lại dưới 2/3 trần | fixed: thêm AC-10 + E10 (lượt CI thật khi chủ kho cho thợ dán; tự dán thì thành giới hạn có tên); AC-5 dưới 2/3 trần |
| P1 | evals | E2 chỉ tìm chuỗi in sẵn về vai nối của máy chủ dev; không có chiều phá cho máy chủ dev | Máy chủ dev rơi về vai postgres trên CI, mọi bài vẫn xanh, SP-1 không được đo | Đo current_user hay pg_stat_activity của máy chủ dev; bản phá máy chủ dev nối bằng postgres | fixed: AC-2 đo tập vai trong pg_stat_activity = {quy_hang_login} bằng bài mới vai-noi.spec.ts; ci-thu thêm pha may-chu-chu với dòng ghim |
| P1 | design | Dòng sổ dọn thư mục trích câu không quyết lựa chọn; lối xoá theo tiến trình sống chưa cân với số tiến trình dùng lại | Thư mục của lượt dãy khác bị coi là chết và bị xoá, lượt ấy đỏ giả | Thay dòng sổ bằng căn cứ đúng; E8 thêm ca số tiến trình dùng lại | fixed: dòng sổ mới (supersedes …-6) dùng tệp .chu ghi số tiến trình chủ, căn cứ một-lối; E8 sáu loại thư mục gồm số tiến trình dùng lại và tên E2E_RUN |
| P2 | evals | E1 coi tên tệp có trong nhật ký là bằng chứng tệp đã chạy | Một tệp toàn bài bị bỏ qua vì lý do khác vẫn qua | Đọc báo cáo JSON, mỗi tệp ghim có ít nhất một bài đạt | fixed: bước dem in số bài đạt theo từng tệp ghim từ báo cáo JSON, tệp 0 bài đạt là đỏ; E4 thêm bản phá |
