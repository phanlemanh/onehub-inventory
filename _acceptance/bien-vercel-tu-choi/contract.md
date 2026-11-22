---
schema_version: 1
feature: Bước bien đọc câu trả lời của Vercel — Vercel trả thành công mà từ chối hay không xác nhận ghi một biến, hoặc trả danh sách biến lạ khuôn, thì lệnh đưa bản lên dừng ở bien, gọi tên biến, không in giá trị, tên miền không đổi
slug: bien-vercel-tu-choi
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [cli, docs]
status: signed-off
approved_by: Manh Phan
approved_at: 2026-11-22
design_doc: docs/superpowers/specs/2026-11-22-bien-vercel-tu-choi-design.md
---

# Acceptance Contract: bien-vercel-tu-choi

## Context

Hàng `dat-khoa-mot-lenh` (PR #103, gộp 22/11) thêm bước `bien`: lệnh đưa bản lên đọc danh sách biến của dự án Vercel, rồi
ghi sáu biến của ứng dụng bằng một lần gọi. Bước bỏ qua câu trả lời của lần ghi. Vercel trả 201 cả khi từ chối một số
biến, và liệt chúng trong mảng `failed`. Khi ấy bước vẫn in «bien đạt», bản dựng chạy với giá trị cũ hoặc thiếu. Ví dụ: một
`AUTH_SECRET` hay `RESEND_API_KEY` vừa xoay không được áp mà không ai biết.

Ở Cổng Bằng chứng của hàng ấy (22/11), chủ kho chọn mở hợp đồng mới cho phát hiện này (Ngoài-4,
`_acceptance/dat-khoa-mot-lenh/decisions.jsonl`). Cùng hàm còn Ngoài-2, đang ở giới hạn đã biết: lần đọc trả thành công mà
không có mảng `envs` thì bị coi là danh sách rỗng, nên phép kiểm biến cấm lặng lẽ không chạy.

Tài liệu Vercel (đọc 22/11):
- lần ghi `POST /v10/projects/<id>/env` trả 201, thân `{ created, failed }`. Chỉ `failed` bắt buộc. `created` là một đối
  tượng hay một mảng. Mỗi mục `failed` có `error.code`, `error.message`, có thể có `error.key`, `error.envVarKey`, và
  `error.value`;
- lần đọc trả một trong ba khuôn, một khuôn không có `envs`.

Nhánh cắt từ `origin/main` ở `f41c4935`.

Source input: prompt — việc phiên điều phối giao ngày 22/11, theo lựa chọn «mở hợp đồng mới» của chủ kho cho Ngoài-4.

## Criteria

- AC-1: Given máy giả của Vercel trả 201 cho lần ghi, `created` đủ sáu biến, và `failed` gồm hai mục:
  - `AUTH_SECRET`, mã `ENV_CONFLICT`;
  - `RESEND_API_KEY`, không có mã.

  When chạy `make deploy` ở `staging` và ở `production`; Then lệnh in đúng dòng
  `deploy <ENV>: bien ĐỎ — Vercel từ chối ghi biến AUTH_SECRET (ENV_CONFLICT), RESEND_API_KEY`, rồi
  `deploy <ENV>: DỪNG ở bien — tên miền không đổi`, và thoát khác 0. Lệnh `vercel` không được gọi lần nào, nên không dựng
  bản. Tên miền vẫn trỏ bản cũ.

  Luật của dòng:
  - tên lấy từ `error.key`, không có thì từ `error.envVarKey`;
  - mục không có tên đúng khuôn tên biến (chữ hoa, số, gạch dưới) ghi `không rõ tên`;
  - mã lỗi `error.code` đứng trong ngoặc sau tên, chỉ khi mã khớp khuôn chữ, số, gạch dưới, gạch ngang;
  - các mục theo thứ tự của `failed`, tên trùng chỉ ghi lần đầu.
- AC-2: Given máy giả có `failed` cho `AUTH_SECRET`, `RESEND_API_KEY` và `DATABASE_URL`. Mỗi mục mang `error.value` là giá
  trị đã gửi, và `error.message` có giá trị ấy. Thân trả lời của máy giả được kiểm là có chứa các giá trị ấy (đối chứng
  dương). When chạy như AC-1; Then dòng đỏ là `Vercel từ chối ghi biến AUTH_SECRET, RESEND_API_KEY, DATABASE_URL`. Không
  dòng nào của đầu ra chuẩn, đầu ra lỗi hay nhật ký cuộc gọi chứa giá trị của một biến bí mật nào.
- AC-3: Given máy giả trả 201 cho lần ghi với `failed` rỗng, nhưng `created` thiếu biến; When chạy `make deploy`; Then
  bước `bien` đỏ với `Vercel không xác nhận đã ghi biến <tên>`, gọi tên mọi biến trong sáu mà `created` không có, theo thứ
  tự của sáu biến. Mỗi ô dưới đây là một ca, ở cả hai môi trường; mọi ca dừng như AC-1:
  - `created` thiếu `DATABASE_URL` và `APP_ENV`;
  - `created` là mảng rỗng;
  - không có `created`;
  - `created` là một đối tượng không có `key`;
  - thân không phải JSON.

  Bốn ô sau gọi tên cả sáu biến. (Phụ thuộc Hỏi-2. Nếu chọn câu đề: bước chỉ đỏ khi `created` không cho tên nào, tức bốn
  ô sau. Ô «thiếu hai biến» khi ấy là ca `bien đạt`.)
- AC-4: Given máy giả trả 200 cho lần đọc mà thân không có mảng `envs` — thân là một đối tượng biến đơn, `envs` không phải
  mảng, hay không phải JSON; When chạy `make deploy`; Then bước `bien` đỏ với
  `Vercel trả danh sách biến không đúng khuôn`. Không có lần ghi nào: 0 lần `POST`. Lệnh dừng như AC-1. (Phụ thuộc Hỏi-1.)
- AC-5: Given máy giả trả đúng khuôn tài liệu: 201, `created` là mảng sáu đối tượng `{ key, type, value, target }`,
  `failed` rỗng; When chạy `make deploy` ở hai môi trường; Then lệnh in `bien đạt` và chạy hết chín bước tới `xong`. Đây là
  đối chứng dương của AC-1–AC-4, trên cùng máy giả. Mọi ca xanh của tệp kiểm `tools/deploy/deploy.test.ts` vẫn qua khi máy
  giả mặc định trả khuôn này, thay cho `{"created":[]}`.
- AC-6: Given sổ tay `docs/van-hanh/dua-ban-len.md`; When người vận hành đọc mục «Đỏ thì làm gì»; Then có một hàng `bien`
  cho mỗi lý do đỏ mới: `Vercel từ chối ghi biến <tên>`, `Vercel không xác nhận đã ghi biến <tên>` và
  `Vercel trả danh sách biến không đúng khuôn`. Mỗi hàng nói việc cần làm, bằng tiếng của người vận hành: bản chưa dựng,
  tên miền không đổi. Không hàng nào bảo xoá hay sửa biến trên Vercel: người vận hành chạy lại một lần, còn đỏ thì báo
  người giữ kho mã kèm nguyên dòng đỏ. Hàng của AC-4 chỉ có khi Hỏi-1 được gộp. Một ca kiểm đọc tệp và đỏ khi thiếu một
  hàng.
- AC-7: Given nhánh của vòng; When chạy `make check`; Then thoát 0.

## Câu hỏi cho chủ kho

- **Hỏi-1** — Gộp Ngoài-2 vào vòng này? Ngoài-2: lần đọc biến của Vercel trả thành công mà không có mảng `envs`.
  - Máy khuyên gộp, vì cùng hàm, cùng máy giả; thêm AC-4, hai ô đỏ và một hàng sổ tay.
  - Không gộp thì bỏ AC-4. Ngoài-2 ở lại giới hạn đã biết: phép kiểm biến cấm vẫn có thể lặng lẽ không chạy.
- **Hỏi-2** — Đòi đủ sáu tên trong `created`, hay chỉ đỏ khi `failed` không rỗng hoặc `created` vắng hay rỗng (đúng câu
  đề)?
  - Máy khuyên đòi đủ sáu tên. Nếu Vercel thật không liệt biến đã ghi đè vào `created`, đỏ nhầm lộ ra ngay ở bản thử: bản
    thật chưa bị đụng, tên miền không đổi, sửa mã rồi đưa lại. Còn bỏ sót thì lộ ở bản thật.
  - Chọn câu đề thì không đỏ nhầm. Đổi lại, một biến Vercel lặng bỏ mà không ghi vào `failed` vẫn qua. AC-3 chỉ đỏ khi
    `created` không cho tên nào.
  - Giới hạn của bằng chứng: chưa có câu trả lời thật nào của Vercel cho một lần ghi đè. Máy giả chép sáu biến vào
    `created` theo tài liệu, nên ca xanh của AC-5 không chứng được rằng luật «đủ sáu» không đỏ nhầm trên Vercel thật. Lần
    đưa bản thử đầu sau khi gộp là lần chứng thật.

## Coverage

Không quét bằng `morphological-scan` (dòng `descope` trong sổ quyết định). Không gian là ma trận khuôn câu trả lời của hai
lời gọi Vercel, ở hai môi trường. Bảng dưới kê trọn các khuôn tài liệu Vercel ghi, cộng các khuôn hỏng.

**Chân ngành:** [NGÀNH: Vercel REST API — Create one or more environment variables; Retrieve the environment variables of
a project], đọc 22/11.

| Trục | Giá trị | Tiêu chí |
| --- | --- | --- |
| Lần ghi · `failed` | rỗng · một mục trở lên · mục có `key` · chỉ có `envVarKey` · không rõ tên ở giữa · tên trùng · có mã lỗi · mã lỗi lạ khuôn | AC-5 · AC-1 · AC-1 · AC-1 · AC-1 · AC-1 · AC-1 · AC-1 |
| Lần ghi · `created` | mảng đủ sáu · thiếu biến · mảng rỗng · vắng · đối tượng không `key` · thân không phải JSON | AC-5 · AC-3 · AC-3 · AC-3 · AC-3 · AC-3 |
| Lần đọc · `envs` | mảng · đối tượng biến đơn · không phải mảng · thân không phải JSON | AC-5 · AC-4 · AC-4 · AC-4 |
| Lộ giá trị | `error.value` · `error.message` · nhật ký cuộc gọi | AC-2 · AC-2 · AC-2 |
| Môi trường | staging · production | mọi ô của AC-1, AC-3, AC-4, AC-5 |
| Người vận hành | dòng đỏ có hàng trong sổ tay | AC-6 |

`[CE chưa kiểm chứng]` cho trục «Lần ghi · `created`»: tài liệu không nói biến được ghi đè (`upsert`) có nằm trong
`created` hay không. Hỏi-2 là chỗ quyết.

**Để sau:**
- lần đọc trả nhiều trang (`pagination.next` khác null): chỉ trang đầu được kiểm biến cấm (dòng `descope` trong sổ);
- Vercel trả 2xx khác 201 cho lần ghi: hôm nay vẫn được đọc như 201.

## Out of scope

- Đọc trang sau của danh sách biến: tài liệu Vercel không ghi tham số chuyển trang.
- Hoàn lại các biến đã ghi được khi một biến khác bị từ chối (dòng `descope` trong sổ). Hoàn lại cần đọc giá trị cũ của
  khoá. Bản chưa dựng nên giá trị mới chưa chạy ở đâu; lần chạy xanh kế ghi đè cả sáu. Giới hạn: một lần dựng lại từ phía
  Vercel (nút Redeploy) trước lần ấy sẽ chạy bộ biến lẫn cũ và mới.
- Xoá hay sửa biến trên Vercel thay người giữ kho mã.
- Đổi cách lệnh đưa bản lên gọi Vercel (CLI thay cho API), hay đổi sáu biến.
- Các giới hạn đã biết khác của hồ sơ `dat-khoa-mot-lenh` (Ngoài-1, Ngoài-3, Ngoài-5, Ngoài-6).

## Notes

- Hạng T3: vòng sửa `tools/**`.
- Không có màn nào: không có nghi thức thiết kế giao diện, không có đặc tả UX (dòng `descope` trong sổ).
- Known limits — chọn ở Cổng Bằng chứng 2026-11-22:
  - Ngoài-2: Bảng kế hoạch chấm ghi hai dòng báo lỗi mẫu (E1-b, E1-c) thiếu phần mã lỗi, khác với dòng lệnh thật in ra;
    người chấm đọc bảng có thể tưởng hai ca là sai dù lệnh chạy đúng.
  - Ngoài-3: Cùng chỗ lệch ấy, ghi lại lần hai từ một lượt soi khác.
  - Ngoài-4: Phép kiểm sổ tay so với ba lý do gõ tay, không với dòng đỏ mã thật in; đổi lời một dòng đỏ hay thêm lý do
    mới mà quên sửa sổ tay thì phép kiểm vẫn xanh.
- Ngoài hợp đồng: Ngoài-1 (vừa xoay mật khẩu vai đăng nhập mà bước `bien` đỏ thì hàng sổ tay mới nói bản thật không bị
  ảnh hưởng, trong khi nó có thể đã mất kết nối cơ sở dữ liệu) — chủ kho chọn mở hợp đồng mới ở Cổng Bằng chứng
  2026-11-22.
