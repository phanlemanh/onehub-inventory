# Bước bien đọc câu trả lời của Vercel — thiết kế

Hồ sơ: `_acceptance/bien-vercel-tu-choi/`. Nguồn: Ngoài-4 của `_acceptance/dat-khoa-mot-lenh/` (chủ kho chọn «mở hợp đồng
mới», 22/11). Cùng hàm còn Ngoài-2, đang ở giới hạn đã biết; Hỏi-1 quyết có gộp không.

## Vì sao

Bước `bien` của `make deploy` ghi sáu biến của ứng dụng vào dự án Vercel ngay trước bản dựng, và bỏ qua câu trả lời. Theo
tài liệu Vercel, lần ghi hàng loạt trả 201 cả khi từ chối một số biến; biến bị từ chối nằm trong mảng `failed`. Khi đó:

- bước vẫn in «bien đạt»;
- bản dựng kéo biến về, chạy với giá trị cũ hoặc thiếu;
- ca xoay khoá là ca nặng nhất: `AUTH_SECRET` hay `RESEND_API_KEY` mới không được áp, khoá cũ lặng lẽ còn dùng.

Lần đọc trước đó cũng tin câu trả lời. Tài liệu ghi lần đọc có một khuôn trả lời không có mảng `envs`. Khi ấy mã coi danh
sách là rỗng, nên phép kiểm biến cấm không chạy mà không báo.

## Mục tiêu

- Vercel trả thành công mà từ chối một biến: bước `bien` đỏ, gọi tên biến. Bản chưa dựng, tên miền không đổi.
- Vercel trả thành công mà không xác nhận đã ghi đủ sáu biến: đỏ, gọi tên biến thiếu (Hỏi-2).
- Lần đọc trả khuôn không có danh sách biến: đỏ trước khi ghi gì (Hỏi-1).
- Không dòng nào in giá trị của một biến, kể cả khi Vercel chép giá trị vào lời báo lỗi.
- Sổ tay vận hành có hàng cho từng dòng đỏ mới.

## Không làm

- Đọc trang sau của danh sách biến (`pagination.next`): tài liệu Vercel không ghi tham số chuyển trang. Dự án có dưới 20
  biến.
- Hoàn lại các biến đã ghi được khi một biến khác bị từ chối: cần đọc giá trị cũ của khoá bí mật từ Vercel, việc lệnh đưa
  bản lên không làm. Bản chưa dựng nên giá trị mới chưa chạy ở đâu; lần chạy xanh kế ghi đè cả sáu. Một lần dựng lại từ phía
  Vercel trước lần ấy sẽ chạy bộ biến lẫn cũ và mới.
- Đổi đường gọi Vercel, hay đổi sáu biến.

## Cách làm

Mọi thay đổi mã nằm trong `stepVercelVars` của `tools/deploy/len-ban.mjs`. `vercelApi` giữ nguyên: mọi mã ngoài 2xx vẫn đỏ
`Vercel trả <mã>`, thân không phải JSON vẫn thành `null`.

### Lần đọc (Hỏi-1)

Sau `GET /v9/projects/<id>/env`: thân không phải đối tượng có mảng `envs` (thân `null`, đối tượng biến đơn, `envs` không
phải mảng) → `Red("Vercel trả danh sách biến không đúng khuôn")`. Lần ghi không chạy. Đúng khuôn thì phép kiểm biến cấm chạy
như cũ.

### Lần ghi

Sau `POST /v10/projects/<id>/env?upsert=true`:

1. `failed` là mảng không rỗng → `Red("Vercel từ chối ghi biến <mục>, <mục>")`, các mục theo thứ tự của `failed`. Mỗi
   mục:
   - tên lấy `error.key`, không có thì `error.envVarKey`;
   - chỉ nhận tên khớp `^[A-Z][A-Z0-9_]*$`, ngược lại ghi `không rõ tên`;
   - `error.code` khớp `^[A-Za-z0-9_-]+$` thì thêm ` (<mã>)` sau tên;
   - một tên đã ghi thì không ghi lại.

   Không bao giờ đọc `error.message` hay `error.value` ra dòng in: tài liệu cho thấy `error.value` có thể mang giá trị. Mã
   lỗi là tên loại lỗi, không mang giá trị. Nó cho người giữ kho mã biết vì sao Vercel từ chối mà không phải đoán.

2. Ngược lại, gom tên trong `created`:
   - mảng thì lấy `key` của từng phần tử;
   - đối tượng thì lấy `key` của nó;
   - vắng, thân `null`, hay đối tượng không có `key` thì không có tên nào.

   Biến nào trong sáu thiếu tên → `Red("Vercel không xác nhận đã ghi biến <tên>, …")`, theo thứ tự của `VERCEL_VARS`.
   `created` không cho tên nào thì liệt cả sáu.
   - Nếu Hỏi-2 chọn câu đề: chỉ đỏ khi `created` không cho tên nào; dòng đỏ liệt cả sáu.

Thứ tự: `failed` được đọc trước `created`, nên một lần từ chối luôn ra dòng «từ chối».

### Máy giả và ca kiểm — `tools/deploy/deploy.test.ts`

Máy API giả nhận `ctx.vercelReply = { get?: { status, body }, post?: { status, body } }`, thân là đối tượng hay chuỗi thô
(cho ô «không phải JSON»). Mặc định theo khuôn tài liệu:

- lần đọc: 200 `{ envs: [{ key }] }`;
- lần ghi: 201 `{ created: <sáu đối tượng chép từ thân gửi: key, type, value, target>, failed: [] }`.

`apiStatus` cũ giữ cho các ca 403.

Ca mới mang mã eval làm tiền tố (E1–E6), mỗi ca chạy ở hai môi trường. Một hàm thuần `markerLeak(text)` thay chỗ cho phép đo
lộ giá trị, để ca chiều đỏ gọi được nó trên một đầu ra đã phá. `expectNoMarker` gọi lại hàm ấy. Một hàm thuần
`soTayFindings(md)` so mục «Đỏ thì làm gì» với ba lý do đỏ.

### Sổ tay — `docs/van-hanh/dua-ban-len.md`

Thêm ba hàng `bien` vào bảng «Đỏ thì làm gì», cạnh hai hàng đang có. Cả ba hàng mở bằng «bản chưa dựng, tên miền không
đổi». Không hàng nào bảo xoá hay sửa biến trên Vercel: xoá một khoá của bản thật dựa trên đoán nguyên nhân là việc khó đảo.

- `Vercel từ chối ghi biến <tên> (<mã>)`: không xoá hay sửa biến trên Vercel. Báo người giữ kho mã kèm nguyên dòng đỏ: mã
  lỗi nói vì sao Vercel từ chối.
- `Vercel không xác nhận đã ghi biến <tên>`: chạy lại một lần. Còn đỏ thì Vercel đã đổi cách trả lời: báo người giữ kho mã
  kèm dòng ấy.
- `Vercel trả danh sách biến không đúng khuôn`: như trên.

## Lựa chọn và căn cứ

Máy đã quyết, căn cứ trong `decisions.jsonl`:

- đọc câu trả lời và đỏ khi có `failed` (phát hiện Ngoài-4);
- dòng đỏ gọi tên và mã lỗi, không chép lời Vercel (lệnh đưa bản lên không bao giờ in giá trị);
- sổ tay không bảo xoá biến trên Vercel; không hoàn lại biến đã ghi;
- không đọc trang sau; không quét hình thái; không đặc tả UX.

Chờ chủ kho: Hỏi-1 (gộp Ngoài-2), Hỏi-2 (đòi đủ sáu tên).

## Rủi ro đã biết

- Hỏi-2 chọn đòi đủ sáu tên mà Vercel thật không liệt biến ghi đè vào `created`: mọi lần đưa bản dừng ở `bien`. Lộ ở bản
  thử trước, vì việc `production` không chạy khi bản thử chưa chạy commit ấy. Tên miền không đổi.
- Máy giả là khuôn đọc từ tài liệu, chưa so với một câu trả lời thật của Vercel. Nên ca xanh không chứng được rằng luật
  «đủ sáu» không đỏ nhầm; lần đưa bản thử đầu sau khi gộp là lần chứng thật.
