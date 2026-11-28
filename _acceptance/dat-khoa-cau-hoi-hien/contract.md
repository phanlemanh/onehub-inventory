---
schema_version: 1
feature: make dat-khoa hiện câu hỏi khoá trên dòng riêng — PR #134 sửa thứ tự viết câu hỏi để readline không xoá nó
slug: dat-khoa-cau-hoi-hien
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [cli]
status: verified
approved_by: Manh Phan
approved_at: 2026-11-28
design_doc: _acceptance/dat-khoa-cau-hoi-hien/design.md
---

# Acceptance Contract: dat-khoa-cau-hoi-hien

## Context

Ngày 28/11/2026 chủ kho chạy `make dat-khoa` để dán khoá cho lần đưa bản lên đầu tiên và thấy màn trống: lệnh chờ dán
mà không câu hỏi nào hiện. Nguyên nhân: câu hỏi được viết trên dòng nhập trước khi readline bắt đầu hỏi, và readline
xoá dòng hiện tại khi bắt đầu (và mỗi lần terminal vẽ lại). PR #134 viết câu hỏi trên một dòng riêng có xuống dòng rồi
mới tạo readline với lời nhắc rỗng, và thêm bài kiểm `tools/deploy/dat-khoa-ask.test.ts` trên một terminal giả.

`tools/**` là hạng cao, nên bước kiểm cổng của PR đòi hồ sơ đã ký. Vòng không viết mã sản phẩm: mã đã ở PR. Nó chứng
PR làm đúng việc trên một terminal thật của hệ điều hành, đúng với chính lệnh `make dat-khoa`, và không đổi gì ngoài cách
hỏi.

«Terminal thật» dưới đây là một terminal ảo (pseudo-terminal) do hệ điều hành cấp, như terminal của máy chủ kho; câu trả
lời gửi kèm phím Enter như người dán. «gh giả» là một tệp `gh` của phép đo đứng đầu PATH: trả lời các lệnh đọc và ghi tên
cùng giá trị mỗi khoá được đặt vào sổ của lượt đo, không chạm GitHub. Mọi giá trị khoá là giá trị thử (`khoa-thu-000n`).

## Criteria

- AC-1: Given terminal thật và gh giả, When chạy `make dat-khoa ENV=staging` cho một môi trường chưa có khoá nào, với chuỗi
  Session pooler còn chữ `[YOUR-PASSWORD]`, và trả lời từng câu như người dán, Then màn hình lúc lệnh kết thúc còn đủ năm câu
  hỏi (VERCEL_TOKEN, MIGRATE_DATABASE_URL, mật khẩu vai chủ, RESEND_API_KEY, VERCEL_AUTOMATION_BYPASS_SECRET), mỗi câu
  nguyên một dòng riêng, đúng thứ tự hỏi. And khi terminal 80 cột được đổi cỡ xuống 60 cột giữa lúc dán chuỗi pooler (lệnh
  nhận SIGWINCH và readline vẽ lại dòng nhập), năm câu hỏi vẫn còn trên màn như vậy.
- AC-2: Given cùng lượt chạy của AC-1, Then lệnh thoát 0 và in «dat-khoa staging: xong»; gh giả nhận đúng giá trị đã dán
  cho bốn khoá (mật khẩu được điền vào chuỗi pooler đã mã hoá) và hai khoá tự sinh đúng khuôn; không giá trị nào đã dán
  (kể cả mật khẩu) xuất hiện trong bất kỳ byte nào terminal đã hiện.
- AC-3: Given đầu vào là một ống dẫn thay cho terminal, When chạy `make dat-khoa ENV=staging` với năm câu trả lời, mỗi câu
  một dòng, Then lệnh hỏi đủ năm câu ra luồng lỗi (luồng ra chỉ mang dòng kết quả), đọc từng dòng theo thứ tự câu hỏi, đặt đúng khoá như AC-2 và thoát 0.
- AC-4: Given thứ tự cũ (viết câu hỏi rồi mới tạo readline, trên cùng dòng), When (a) chạy bài kiểm
  `tools/deploy/dat-khoa-ask.test.ts` trên bản sao mã mang thứ tự ấy, và (b) chạy mã ở điểm rẽ của nhánh với `origin/main`
  (bản trước PR) trên terminal thật như AC-1, Then (a) bài kiểm đỏ đúng ở chỗ đòi câu hỏi nằm trên dòng riêng, còn bản sao
  mã của PR thì xanh; (b) cả năm câu hỏi bị xoá khỏi màn — đúng lỗi chủ kho gặp.
- AC-5: Given PR #134, When liệt kê tệp đổi so với điểm rẽ của nhánh với `origin/main`, Then ngoài hồ sơ này, một tệp
  `wiki/log/` và hai trang máy vẽ lại khi cổng đóng (`PRODUCT-MAP.md`, `LO-TRINH.html`) chỉ có `tools/deploy/dat-khoa.mjs`
  và bài kiểm mới; mọi dòng đổi của `dat-khoa.mjs` nằm trong hàm hỏi `terminalAsk` (cách kiểm, câu hỏi và đường đưa giá trị
  vào `gh secret set` không đổi). (Sửa sau Cổng Phạm vi, G-2811-103, chờ chủ kho phê ở Cổng Bằng chứng.)
- AC-6: Given nhánh ở HEAD, When chạy mọi bài kiểm của `tools/deploy/` rồi các lệnh chung của kho (`make check`,
  `npm run build`, `make e2e`), Then tất cả thoát 0.
- AC-7 (cross-layer): Given PR #134 trên GitHub, When đọc CI ở đầu nhánh (chỉ đọc), Then đầu nhánh ấy đúng là bản đang
  chấm, và các việc quick, e2e, e2e-db đã xong và xanh. (Sửa sau Cổng Phạm vi, G-2811-103, chờ chủ kho phê ở Cổng Bằng
  chứng.)

## Coverage

| Trục | Phần tử | AC |
| --- | --- | --- |
| Loại đầu vào | terminal thật · terminal thật đổi cỡ giữa lúc dán · ống dẫn · terminal giả của bài kiểm | AC-1, AC-2 · AC-1 · AC-3 · AC-4 (a) |
| Câu hỏi của lệnh | năm câu của một môi trường chưa có khoá, gồm câu mật khẩu khi chuỗi còn chữ giữ chỗ | AC-1, AC-3 |
| Điều người thấy | câu hỏi còn trên màn · chữ dán không hiện · lệnh báo xong | AC-1 · AC-2 · AC-2 |
| Điều lệnh làm | giá trị dán tới đúng khoá · mật khẩu điền và mã hoá · hai khoá tự sinh | AC-2, AC-3 |
| Đối chứng | thứ tự cũ trên bài kiểm · bản trước PR trên terminal thật | AC-4 (a) · AC-4 (b) |
| Luật kho | PR gọn, chỉ đổi cách hỏi · kho xanh · CI xanh | AC-5 · AC-6 · AC-7 |

Mọi trục đều đã kiểm chứng trên máy trước Cổng Phạm vi: phép đo chạy xanh trên mã của PR, bản trước PR mất 5/5 câu hỏi,
và mười một bản phá của phép đo đỏ đúng thông điệp.

## Out of scope

- Đặt khoá thật lên GitHub hay chạy lệnh với `gh` thật: máy không cầm giá trị khoá (AGENTS.md), và chủ kho đã làm việc
  ấy hôm 28/11.
- Bảng Terminal của ứng dụng Claude: phép đo dùng terminal của hệ điều hành; lần vẽ lại khi đổi cỡ được đo ở AC-1 trên
  terminal ấy.
- Môi trường `production` và `ENV=all`: cùng hàm hỏi, chỉ thêm câu hỏi theo môi trường.
- Đổi chữ của câu hỏi hay cách kiểm giá trị dán.

## Sửa sau Cổng Phạm vi

Hai dòng chữ đổi sau khi chủ kho duyệt Cổng Phạm vi (28/11), theo lời điều phối G-2811-103. Cả hai nêu cho đúng sự thật
hoặc siết chặt hơn, không nới phép đo; chủ kho phê hay không phê ở Cổng Bằng chứng.

- AC-5 kể thêm hai trang máy vẽ lại khi cổng đóng (`PRODUCT-MAP.md`, `LO-TRINH.html`). Lệnh duyệt nào cũng vẽ lại hai trang
  ấy và CI đòi chúng khớp, nên chúng luôn nằm trong PR; phép đo E5 đã nhận chúng từ trước, chữ cũ không kể (bước soi lượt 1
  bắt chỗ lệch). Hợp đồng PR #135 viết như vậy.
- AC-7 đòi đầu nhánh trên GitHub đúng là bản đang chấm, để CI xanh không thể là CI của một commit khác (bước soi lượt 1).

## Notes

- Chứng cứ người dùng (không phải phép đo máy): ngày 28/11/2026 chủ kho đã dán khoá ba lần bằng chính nhánh này và lệnh
  hiện câu hỏi (theo lời phiên mẹ `PROD · Kiểm nhanh ứng dụng bản thật`). Lần đưa bản thử và bản thật hôm ấy chạy trên
  các khoá đã đặt như vậy.
- Lần chạy CI trước đỏ ở bước e2e-db (bài kiểm trình duyệt có đăng nhập): đó là lỗi chung của nhánh chính lúc ấy; nhánh
  chính đã xanh và nhánh đã gộp main (5d2d1e32). AC-7 đọc lại trên đầu nhánh.
- Known limits (đề xuất, chủ kho chốt ở Cổng Bằng chứng):
  - Màn hình lúc kết thúc được dựng lại từ các byte terminal đã hiện bằng một mô hình màn nhỏ của hồ sơ (dời con trỏ,
    xoá dòng, xoá màn, dòng dài tràn sang hàng sau); nó không phải một trình giả lập terminal đầy đủ. Mô hình từ chối mọi
    chuỗi điều khiển nó không mô hình (phép đo dừng «không chạy được»), nên không chuỗi nào bị bỏ qua lặng lẽ; lệnh hôm nay
    chỉ phát hai chuỗi, `ESC[1G` và `ESC[0J`. Kho không có sẵn trình giả lập terminal nào; cài thêm là đổi phụ thuộc của kho,
    ngoài PR này.
