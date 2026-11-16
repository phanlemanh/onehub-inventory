---
schema_version: 1
feature: Người của sàn mở inventory.onehub.center, nhận mã qua email và vào đúng sàn của mình trên bản chạy thật; mỗi bản mới đi qua bản thử trước khi lên bản thật, và lùi được về bản trước
slug: moi-truong-thu-va-ban-that
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [config, ci, api]
status: draft
approved_by:
approved_at:
design_doc: _acceptance/moi-truong-thu-va-ban-that/design.md
---

# Acceptance Contract: moi-truong-thu-va-ban-that

## Context

Lộ trình chưa có hàng nào dựng môi trường chạy thật. Chủ kho cho ở Cổng Đáng 2026-11-15 («Cho cả gói, build»):
Inventory chạy thật ở `inventory.onehub.center`, dựng mới, không chuyển dữ liệu từ Quỹ hàng, bộ khoá riêng, Vercel và
Supabase vùng Singapore, bản thử tách bản thật ([0041](../../wiki/decisions/0041-ban-that-o-dia-chi-rieng.md)). Hàng
này dựng phần trong kho: lệnh đưa bản lên và lùi bản, phép kiểm cấu hình, sức khoẻ chỉ đọc, kiểm cách ly trên bản thử,
sao lưu và thử khôi phục, sổ tay vận hành, và bản đề xuất hai tệp tự động triển khai. Tài khoản, tên miền, khoá và hai
tệp trong `.github/workflows/` là của chủ kho. Mọi tiêu chí đo được tại máy, trên Postgres của làn K, với `vercel` giả và
máy chủ giả; không lệnh nào của vòng chạm dịch vụ thật. Luật chạm: SP-1 (chỉ siết).

Source input: hàng 22 của `docs/plan/lo-trinh.json`; ô cơ hội `_acceptance/moi-truong-thu-va-ban-that/opportunity.md`
(build, Manh Phan, 2026-11-15T09:38Z); chi phí `chi-phi.md` (tra 2026-11-16).

## Criteria

- AC-1: Given cây sạch, đủ tên biến cho bản thử, `vercel` giả ghi mọi lần gọi vào nhật ký, Postgres của làn làm cơ sở
  bản thử và một máy chủ giả trả sức khoẻ, When chạy `make deploy ENV=staging`, Then lệnh đi đúng bảy bước theo thứ tự
  `cau-hinh`, `migration`, `cach-ly`, `dung`, `kiem-nhanh`, `gan-ten-mien`, `kiem-nhanh-ten-mien`, mỗi bước in đúng một
  dòng `deploy staging: <bước> đạt`, migration chưa chạy được áp trước khi `vercel` được gọi lần đầu, lệnh dựng là
  `deploy --prebuilt --prod --skip-domain`, `promote` chỉ được gọi sau `kiem-nhanh` đạt, dòng cuối
  `deploy staging: xong <commit ngắn>`, mã thoát 0; `vercel.json` ghi vùng `sin1` và tắt tự triển khai theo nhánh, thiếu
  một trong hai thì `cau-hinh` đỏ gọi tên khoá.
- AC-2: Given cùng dựng ấy, When một bước đỏ — thiếu một tên biến, migration lỗi, bộ kiểm cách ly đỏ, `vercel build` hay
  `deploy` lỗi, `kiem-nhanh` đỏ — Then lệnh dừng ngay ở bước ấy với dòng `deploy <ENV>: <bước> ĐỎ — <lý do>` rồi
  `deploy <ENV>: DỪNG ở <bước> — tên miền không đổi`, không bước nào sau nó chạy, nhật ký `vercel` giả không có `promote`,
  mã thoát khác 0; và khi `kiem-nhanh-ten-mien` đỏ sau khi đã gắn tên miền, lệnh gọi `vercel rollback` đúng một lần, in
  `deploy <ENV>: đã lùi về bản trước` và thoát khác 0. Nếu chủ kho chọn «có» ở Hỏi-4: một tệp migration chưa áp có xoá
  hay đổi tên bảng hoặc cột mà không có dòng `-- bo-sau:` thì bước `migration` đỏ trước khi áp, gọi tên tệp; có dòng ấy
  thì đi tiếp.
- AC-3: Given máy chủ giả của bản thử trả một commit khác HEAD (hay không trả lời), When chạy `make deploy ENV=production`,
  Then bước `ban-thu-truoc` đỏ với `bản thử chưa chạy <commit ngắn>` trước mọi migration và mọi lần gọi `vercel`; trả đúng
  HEAD thì bản thật đi đủ bảy bước của nó (như AC-1 nhưng có `ban-thu-truoc` thay cho `cach-ly`), và không lệnh nào in giá trị của một
  biến (chạy với giá trị mốc: không dòng nhật ký nào chứa mốc).
- AC-4: Given `vercel` giả có một bản trước bản đang gắn tên miền, When chạy `make rollback ENV=<staging|production>`,
  Then lệnh gọi `vercel rollback` một lần, chạy `kiem-nhanh-ten-mien` và in `rollback <ENV>: tên miền chạy <commit>`; không
  có bản trước thì từ chối với `không có bản trước để lùi` và không gọi `rollback`.
- AC-5: Given `NODE_ENV=production`, When máy chủ khởi động với từng ca của ma trận cấu hình (thiếu từng biến bắt buộc;
  `APP_ENV` lạ; có `LOGIN_CODE_OUTBOX`, `NEXT_PUBLIC_E2E_BUTTON_RECORD` hay `MIGRATE_DATABASE_URL`; `DATABASE_URL` nối bằng
  vai khác `quy_hang_login`; `APP_ENV=production` mà `APP_URL` khác `https://inventory.onehub.center`; tên miền của
  `MAIL_FROM` ngoài tập Hỏi-7 chốt), Then máy chủ không khởi động, lỗi gọi đúng tên biến và vì sao, không chứa giá trị nào
  của biến; đủ và đúng thì khởi động; ngoài `NODE_ENV=production` không ca nào bị chặn (máy dev và bài kiểm chạy như cũ);
  và với `APP_URL` của bản thử và của bản thật, mọi đường dẫn trong thư mã đăng nhập và thư mời mà bên gửi dựng ra (đọc
  từ thân thư gửi tới `fetch` giả) bắt đầu bằng đúng `APP_URL` ấy.
- AC-6: Given bản dựng `next build` chạy `next start` với `NODE_ENV=production`, `APP_ENV=staging`, nối Postgres của làn
  bằng `quy_hang_login`, When gọi `GET /api/v1/health` và các lối thử của máy dev (`/proto/<mọi slug trong sổ bản mẫu>`,
  `/inventory?vai=<mọi vai>`, `?mau=<mọi giá trị>`, `?state=<mọi trạng thái ép>`), cả khi chưa đăng nhập lẫn với một phiên
  bài kiểm tự ký bằng `AUTH_SECRET` của lượt, Then sức khoẻ trả `ok: true`, đúng `commit`, `env: staging`, `vai: dat` và
  không trường nào khác; `/proto/*` trả 404; chưa đăng nhập thì mọi đường có tham số về trang đăng nhập như đường không
  tham số; có phiên thì vai, dữ liệu và trạng thái hiện ra giống hệt đường không tham số; số ca bằng số mục của sổ bản
  mẫu và bảng quyền và lớn hơn 0; cùng ma trận trên máy chủ dev cho thấy tham số có tác dụng (đối chứng dương); và khi
  cùng bản dựng nối bằng vai chủ bảng thì sức khoẻ trả `ok: false` với lý do của cửa truy vấn.
- AC-7: Given Postgres của làn đã áp migration, When chạy `make cach-ly-dich` với địa chỉ vai chủ và vai đăng nhập của nó,
  Then bộ kiểm chạy mọi ca trong giao dịch chỉ đọc, in `ok <ca>` cho từng ca của danh sách viết trước và dòng cuối
  `cach-ly-dich: <n> ca đạt`, không tạo hay xoá cơ sở dữ liệu nào và không đổi dòng nào (đếm dòng mọi bảng trước và sau
  bằng nhau); trên bản phá — một bảng của sàn bỏ ép luật dòng, `anon` được cấp `select`, vai đăng nhập được làm chủ một
  bảng — mỗi bản đỏ với thông điệp ghim gọi tên bảng hay vai.
- AC-8: Given Postgres của làn có dữ liệu mẫu của bộ kiểm, When chạy `make sao-luu` rồi `make khoi-phuc-thu` với tệp ấy,
  Then tệp sao lưu nằm ngoài cây kho (đường trong cây bị từ chối với `không ghi sao lưu vào trong kho`), bản khôi phục vào
  một cơ sở nháp có số dòng từng bảng bằng bản gốc, `cach-ly-dich` đạt trên bản khôi phục, và lệnh in một dòng
  `khoi-phuc: <ngày> · <n> bảng · <m> dòng · cach-ly đạt` đúng khuôn của `docs/van-hanh/nhat-ky-khoi-phuc.md`; bản phá
  (xoá một bảng khỏi tệp) đỏ gọi tên bảng thiếu.
- AC-9: Given thư mục `docs/van-hanh/`, When đọc sổ tay, Then có đủ bốn quy trình — đưa bản lên, lùi bản, xoay khoá bí
  mật, khôi phục dữ liệu — và danh sách việc ngoài kho xếp theo thứ tự làm, mỗi việc ghi tên biến máy cần nhận lại (không
  giá trị); mọi lệnh `make <đích>` sổ tay nhắc có trong `Makefile`/`mk/`, mọi biến sổ tay nhắc có trong `.env.example`; và
  một người vận hành chưa từng làm làm theo được từng quy trình mà không phải đọc mã (judgment).
- AC-10: Given cây ở HEAD, When chạy bộ dò khoá bí mật của hàng, Then không tệp được theo dõi nào chứa mẫu khoá của
  Vercel, Supabase, Resend, khoá ký JWT hay địa chỉ Postgres có mật khẩu khác `local-only`; `.env.example` có mọi biến mới
  của hàng với giá trị rỗng hay ví dụ `example.test`; bản phá (thêm một dòng mang khoá giả đúng mẫu vào một tệp được theo
  dõi trên bản sao) đỏ gọi tên tệp và dòng.

## Coverage

Quét theo preset risk-premortem của skill `morphological-scan`, làm tại bước thiết kế.

| Trục | Giá trị | Tiêu chí |
|---|---|---|
| Môi trường | bản thử · bản thật | AC-1, AC-3 |
| Bước | cấu hình · bản thử trước · migration · cách ly · dựng · kiểm nhanh · gắn tên miền · kiểm sau gắn · lùi | AC-1, AC-2, AC-3, AC-4 |
| Kết cục mỗi bước | đạt · đỏ trước gắn tên miền · đỏ sau gắn tên miền | AC-1, AC-2 |
| Cấu hình khởi động | thiếu · cấm · vai sai · địa chỉ sai · tên miền thư sai · đủ | AC-5 |
| Lối thử của máy dev | bản mẫu · vai qua địa chỉ · bộ mẫu qua địa chỉ · trạng thái ép | AC-6 |
| Cách ly | luật dòng · quyền vai Supabase · vai không chủ · phiên đăng nhập | AC-7 |
| Dữ liệu | sao lưu · khôi phục · đếm · cách ly bản khôi phục | AC-8 |
| Con người | sổ tay bốn quy trình · việc ngoài kho theo thứ tự | AC-9 |
| Bí mật | trong kho · trong nhật ký lệnh · mẫu biến | AC-10, AC-3 |

Thước CE: mỗi ô của hai trục «Bước» × «Kết cục» có ít nhất một ca trong ma trận của E1–E4; mỗi ca cấu hình của AC-5 là
một ca kiểm riêng. `[CE chưa kiểm chứng]` thư gửi thật từ tên miền đã xác minh và lần khôi phục thật trên bản thử: chỉ đo
được sau khi chủ kho làm việc ngoài kho (Out of scope 1, 2).

## Đường đo

| Ngưỡng ở `opportunity.md` | Số từ đâu | Tiêu chí bảo đảm |
|---|---|---|
| Một lệnh đưa bản lên bản thử rồi bản thật, kiểm đỏ thì dừng | nhật ký `vercel` giả + dòng bước của lệnh | AC-1, AC-2, AC-3 |
| Thiếu cấu hình thì không khởi động | lỗi khởi động theo ma trận | AC-5 |
| Không bộ mẫu, không lối chọn vai | trả lời của bản dựng production | AC-6 |
| Vai không sở hữu bảng, cách ly chạy trên bản thử | `cach-ly-dich` + sức khoẻ `vai` | AC-6, AC-7 |
| Thư từ tên miền đã xác minh, đường trong thư trỏ đúng địa chỉ mới | phép kiểm tên miền `MAIL_FROM` (Hỏi-7) và đường dẫn trong thân thư giả; xác minh thật ở Resend là việc ngoài kho | AC-5 |
| Sao lưu hằng ngày, một lần thử khôi phục có ghi | lệnh thử khôi phục trên làn; lần thật trên bản thử ghi ở nhật ký khôi phục | AC-8 |
| Sổ tay vận hành | `docs/van-hanh/` | AC-9 |
| Không khoá bí mật trong kho | bộ dò khoá | AC-10 |

## Out of scope

- Tạo tài khoản, dự án, cơ sở dữ liệu, khoá; trỏ tên miền; xác minh tên miền gửi thư; lần đưa bản đầu và lần thử khôi
  phục thật trên bản thử. Ai quyết: chủ kho — luật đợt và Cổng Đáng 2026-11-15.
- Sửa `.github/workflows/deploy.yml`, `release.yml`; máy chỉ soạn `workflows-de-xuat.md`. Ai quyết: chủ kho — AGENTS.md
  «Do not edit .github/workflows/».
- Chuyển dữ liệu từ Quỹ hàng. Ai quyết: chủ kho — 0041, hàng 21 thành chân trời H13.
- Khôi phục theo thời điểm (PITR), theo dõi và cảnh báo khi bản thật ngừng. Ai quyết: chủ kho — theo lối chi phí ở Hỏi-1.
- Khoá `RELEASE_PLEASE_TOKEN` cho Release, đã có hướng dẫn ở hàng 1u. Ai quyết: giám sát — lời giao hàng 22.

## Notes

- Phần dựng bắt đầu khi hàng 10 đã gộp (lời giám sát 2026-11-16).
- Không màn mới: bảng thao tác của thực thể và nghi thức thiết kế không áp (dòng sổ «bỏ đặc-tả-UX», «bỏ design-pass»).
