---
slug: roadmap-merge-driver
at: 2026-11-21T07:40:00Z
verdict: findings
p0: 1
p1: 2
p2: 2
---

# Phản biện context sạch — roadmap-merge-driver

Một tác tử context sạch đọc bốn tệp (thiết kế, hợp đồng, kế hoạch đo, sổ quyết định) và tệp bài học của các hồ sơ trước.
Không đọc mã của kho, không chạy lệnh. Một lượt, không phản biện lại sau khi sửa.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
| --- | --- | --- | --- | --- | --- |
| P0 | design + sổ (dòng d-20261121T072341Z-4) | Căn cứ của dòng «đặt đoạn dạy ở docs/START-HERE.md» trích câu về ngôn ngữ của AGENTS.md; câu ấy không quyết chỗ đặt. Lý do «do repo-setup ghi» không giết lối CONTRIBUTING.md, vì chính vòng này vẫn sửa hai tệp do repo-setup ghi. Cùng dạng với [tat-plugin-cho-cu#F2]. | Chủ kho thấy căn cứ là một câu của AGENTS.md nên tưởng chỗ đặt đã có luật quyết, và ký mà không biết mình đã chọn. | Thay dòng 4 bằng hai dòng mang supersedes: một dòng ngôn ngữ, một dòng chỗ đặt; không có câu nào quyết thì thành câu hỏi trên thẻ. | human-gate1: dòng 4 bị thay bởi dòng 10 (ngôn ngữ, căn cứ cũ) và dòng 11 (chỗ đặt, chỉ-người); thành Hỏi-3 trong hợp đồng và thiết kế |
| P1 | contract (AC-2, Coverage) + evals (E2) | Ma trận gộp chỉ có ca .gitattributes giống nhau ở hai bên; thiếu ca nhánh mở trước khi dòng mới lên nhánh chính. | Sau khi PR gộp, mọi nhánh đang mở gộp nhánh chính lần đầu vẫn xung đột ở LO-TRINH.html, vì Git đọc .gitattributes của nhánh. Tám ca vẫn xanh, trang dạy không nhắc, và số xung đột 7 ngày kế bị đọc thành K1 hỏng. | Thêm ca 9, kỳ vọng theo Git thật; nếu xung đột thì thêm câu giới hạn vào AC-4 kèm ca phá. | fixed: thử trên kho tạm cho xung đột; thêm ca 9 vào AC-2 và E2 (9 of 9), câu giới hạn vào AC-4 và E4, ca phá vào AC-8, trục «tuổi của nhánh» vào Coverage, một dòng vào giới hạn đã biết |
| P1 | contract (Hỏi-2, AC-6, AC-7) | Hỏi-2 khuyên máy áp bản vá và tự ghi cài đặt của kho cấm máy sửa thư mục ấy, nhưng không nêu máy áp bằng đường nào. | Chủ kho trả lời có; tới bước viết mã, lệnh sửa bị chặn: hoặc vòng kẹt, hoặc máy đi vòng qua một lệnh cấm mà cổng chưa được hỏi. | Hỏi-2 ghi rõ đường áp cho từng lối; việc vượt lệnh cấm là một dòng sổ chỉ-người hiện trên thẻ. | fixed: Hỏi-2 viết lại (dòng sổ 12 thay dòng 7): máy chạy git apply đúng tệp vá security-yml.patch, nói rõ đường này đi qua lệnh cấm và chỉ đi khi chủ kho duyệt; lối khác là chủ kho tự commit |
| P2 | design + contract (AC-6) + evals (E6) | Tiền đề «thước chỉ chạy lúc chấm» là lý do duy nhất để bớt lưới quét, mà không phép đo nào kiểm. | Một workflow hay lệnh make gọi một tệp dưới rang/; mã ấy chạy trong CI mà CodeQL không còn quét, chú thích trong workflow sai, E6 vẫn xanh. | E6 thêm assert: không bên gọi nào trong danh sách viết trước trỏ vào rang/, in số tệp đã soát, có ca phá. | fixed: AC-6 và E6 thêm danh sách bên gọi BEN_GOI và assert 0 bên gọi; AC-8 thêm ca phá «một workflow gọi một tệp dưới rang/» |
| P2 | evals (E2, E4) | Lời hứa «make setup là đủ để có driver» chỉ đo bằng chuỗi; E2 không nói driver của ca «có» lấy từ đâu. | Script prepare có chuỗi lệnh nhưng không chạy tới nó; bản kéo mới vẫn không có driver. E2 xanh vì tự đặt driver, E4 xanh vì chuỗi có mặt. | E2 chạy chính script prepare rút từ package.json trên kho tạm rồi đọc git config; các ca «có driver» dùng kho tạm dựng như thế; có ca phá. | fixed: AC-2 và E2 đặt driver bằng script prepare thật và đòi git config trả true; AC-8 thêm ca phá «prepare mất lệnh đặt driver» |
