---
schema_version: 1
feature: Một lệnh đặt khoá — chủ kho dán mỗi khoá do dịch vụ cấp một lần vào make dat-khoa; lệnh đưa bản lên tự đặt mật khẩu vai đăng nhập và tự đẩy biến sang Vercel; sổ tay chỉ còn phần của chủ kho; quyền đứng cho hạ tầng Inventory
slug: dat-khoa-mot-lenh
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [cli, docs]
status: approved
approved_by: Manh Phan
approved_at: 2026-11-22
design_doc: docs/superpowers/specs/2026-11-22-dat-khoa-mot-lenh-design.md
---

# Acceptance Contract: dat-khoa-mot-lenh

## Context

Hàng 22 đã dựng lệnh đưa bản lên. Theo sổ tay hiện tại, chủ kho làm 14 việc ngoài kho trước lần đưa bản đầu:

- dựng tay hai chuỗi nối cơ sở dữ liệu;
- đặt tay sáu biến ở mỗi dự án Vercel;
- đặt mật khẩu vai đăng nhập giữa lần đưa bản đầu, nên lần ấy dừng ở mỗi môi trường.

Đo ngày 22/11 trên tài khoản thật: hai dự án Supabase và hai dự án Vercel đã có; GitHub chưa có môi trường, khoá hay biến.

Vòng này thu việc của chủ kho về hai thứ: tạo khoá ở trang dịch vụ, rồi dán vào một lệnh. Máy không cầm giá trị khoá.
Nhánh cắt từ `origin/main` ở `63037a34`.

Source input: prompt. Chủ kho ngày 22/11, nguyên văn «Tôi muốn đào sâu hơn vậy cấu hình setup ở repo như thế nào để bạn
chủ động làm hết và tôi sẽ ít xuất hiện nhất?»; sau đề xuất bốn thay đổi, chủ kho trả lời «Làm đi».

## Criteria

- AC-1: Given môi trường GitHub `staging` đã có, chưa có khoá nào, và một `gh` giả ghi lại dòng lệnh và đầu vào chuẩn của
  mỗi lần gọi; When chạy `dat-khoa staging` với các câu trả lời đúng khuôn — chuỗi Session pooler còn chữ
  `[YOUR-PASSWORD]` cùng một mật khẩu có ký tự đặc biệt; Then `gh secret set` được gọi đúng một lần cho mỗi tên sau và
  không tên nào khác: `VERCEL_TOKEN`, `MIGRATE_DATABASE_URL`, `RESEND_API_KEY`, `AUTH_SECRET`, `LOGIN_DB_PASSWORD`. Mỗi
  giá trị chỉ đi qua đầu vào chuẩn, không nằm trên dòng lệnh, không có trong đầu ra của lệnh. `MIGRATE_DATABASE_URL` mang
  mật khẩu đã mã hoá theo URL, không còn chữ `[YOUR-PASSWORD]`. Chạy `dat-khoa all` thì `VERCEL_TOKEN` chỉ được hỏi một
  lần.
- AC-2: Given môi trường đã có đủ khoá, When chạy lại `dat-khoa` và bỏ trống mọi câu, Then không khoá nào được đặt lại, và
  mỗi khoá in một dòng `giữ <tên>`. When chạy với `--xoay`, Then chỉ `AUTH_SECRET` và `LOGIN_DB_PASSWORD` được đặt lại, giá
  trị mới khác giá trị cũ. Khoá sinh ra đúng khuôn: `AUTH_SECRET` là 64 ký tự base64url, `LOGIN_DB_PASSWORD` là 40 ký tự
  chữ và số.
- AC-3: Given ma trận đầu vào sai viết trước trong `evals.yaml`, When chạy `dat-khoa` với từng ô, Then lệnh thoát khác 0
  với đúng thông điệp ghim của ô và không gọi `gh secret set` lần nào. Ma trận gồm:
  - chuỗi nối ở cổng 6543;
  - chuỗi không phải `postgresql://`;
  - chuỗi không có mật khẩu;
  - chuỗi có người dùng khác `postgres`;
  - khoá Resend không bắt đầu bằng `re_`;
  - khoá Vercel có khoảng trắng;
  - khoá chưa có mà bỏ trống;
  - môi trường chưa có trên GitHub;
  - `gh` chưa đăng nhập;
  - `gh` đăng nhập mà không đọc được khoá công khai của môi trường (thiếu quyền quản trị kho).

  Given mọi đầu vào đúng mà lần `gh secret set` thứ ba lỗi, When chạy, Then:
  - lệnh dừng ngay, thoát khác 0;
  - lệnh in tên các khoá đã đặt và tên khoá lỗi, không in giá trị;
  - chạy lại và bỏ trống các khoá đã đặt thì lệnh chỉ hỏi và đặt phần còn lại.
- AC-4: Given migration đã áp, When bước `vai-dang-nhap` chạy với `LOGIN_DB_PASSWORD`, Then:
  - câu gửi tới `psql` qua đầu vào chuẩn chứa dạng băm `SCRAM-SHA-256$4096:` và không chứa mật khẩu trần;
  - trên một Postgres thật, vai `quy_hang_login` đăng nhập được bằng mật khẩu ấy;
  - mật khẩu khác bị từ chối;
  - chạy lại bước lần hai vẫn đăng nhập được.
- AC-5: Given một máy API Vercel giả, When lệnh đưa bản lên chạy tới bước `bien`, Then:
  - lệnh đọc danh sách biến của dự án, rồi gửi đúng một yêu cầu ghi đè gồm đúng sáu biến cho môi trường Production:
    `DATABASE_URL`, `AUTH_SECRET`, `RESEND_API_KEY` kiểu `encrypted`; `MAIL_FROM`, `APP_URL`, `APP_ENV` kiểu `plain`;
  - `DATABASE_URL` có người dùng `quy_hang_login` (giữ phần `.<mã dự án>`), cùng máy chủ, cổng và tên cơ sở với
    `MIGRATE_DATABASE_URL`, mật khẩu là `LOGIN_DB_PASSWORD`;
  - `APP_ENV` bằng môi trường đang chạy;
  - yêu cầu ghi đè đến trước lần gọi `vercel pull` đầu tiên;
  - không giá trị nào có trong đầu ra.
- AC-6: Given dự án Vercel đang có một trong ba biến cấm, hay API Vercel trả mã khác 2xx, When tới bước `bien`, Then bước
  đỏ gọi tên biến cấm hay mã trả về, không gửi yêu cầu ghi đè (ca biến cấm), không gọi `vercel` lần nào, và in
  `DỪNG ở bien — tên miền không đổi`.
- AC-7: Given lệnh đưa bản lên ở HEAD, When chạy xanh, Then:
  - mỗi môi trường in chín dòng bước đúng thứ tự thiết kế, rồi dòng `xong`;
  - thiếu một biến lệnh đòi thì đỏ `thiếu biến <tên>`;
  - `LOGIN_DB_PASSWORD` không phải chữ và số, hay ngắn hơn 24 ký tự, thì đỏ ở `cau-hinh`;
  - mỗi bước đỏ riêng được theo ma trận viết trước trong `evals.yaml`, gồm hai bước mới;
  - bước đỏ trước `gan-ten-mien` không gọi lệnh gắn tên miền lần nào;
  - dòng đỏ của bước `vai-dang-nhap` đã che giá trị, kể cả khi `psql` in chuỗi nối ra.
- AC-8: Given `docs/van-hanh/README.md` ở HEAD, When đọc khối `deploy.yml` trong sổ tay, Then:
  - ở mỗi việc `staging` và `production`, tập tên truyền vào `make deploy` qua `secrets.*` và `vars.*` đúng bằng tập biến
    lệnh đòi của môi trường ấy cộng `VERCEL_AUTOMATION_BYPASS_SECRET`;
  - sổ tay không còn bảo đặt `LOGIN_DATABASE_URL`, đặt biến tay trên Vercel hay đặt mật khẩu vai đăng nhập trong SQL
    Editor;
  - bài kiểm sổ tay sẵn có của kho vẫn xanh.
- AC-9 (judgment): Given sổ tay, mục quyền đứng trong `AGENTS.md` và ghi chú thiết kế, When một người vận hành chưa biết
  kho đọc, Then:
  - phần của chủ kho chỉ gồm việc cần tài khoản của chủ kho: tạo khoá, chạy `make dat-khoa`, dán `deploy.yml`, tạo Quản
    trị sàn đầu, duyệt bản thật;
  - mỗi việc có «Đạt khi» và «Đỏ thì»;
  - mục quyền đứng khớp câu trả lời Hỏi-2 ở Cổng Phạm vi;
  - mục ấy nói rõ máy được làm gì không hỏi;
  - mục ấy nói đủ năm điều máy không bao giờ làm: cầm giá trị khoá; duyệt bản thật hay đổi người duyệt của `production`;
    xoá dữ liệu, dự án hay khoá; sửa `.github/workflows/` hay `governance/`; nới quyền của chính mình;
  - không câu nào trong danh sách được làm cho phép điều mà danh sách cấm chặn.
- AC-10: Given cây ở HEAD, When chạy `make check`, Then lệnh thoát 0.

## Câu hỏi cho chủ kho

- **Hỏi-1 — địa chỉ bản thử và địa chỉ gửi thư.**
  - Khuyến nghị: bản thử ở `https://onehub-inventory-thu.vercel.app`, địa chỉ sẵn của dự án Vercel nên không cần bản ghi
    DNS. Thư gửi từ `OneHub Inventory <no-reply@onehub.center>`, tên miền đã xác minh ở Resend.
  - Lối khác: một tên miền con riêng cho bản thử, thêm một bản ghi DNS và một lần gắn tên miền.
  - Câu trả lời thành hai biến GitHub máy đặt sau khi gộp. Sổ tay hàng 22 không ghi tên miền bản thử vào kho, nên vòng này
    không đo nó.
- **Hỏi-2 — phạm vi quyền đứng.**
  - Khuyến nghị: như mục «Quyền đứng» của ghi chú thiết kế. Người duyệt `production` chỉ là chủ kho; máy đặt đúng một
    lần và không bao giờ đổi.
  - Lối khác: không có quyền đứng; máy hỏi từng cài đặt, khoảng mười lần cho lần dựng đầu.
  - AC-9 đo mục quyền đứng khớp câu trả lời.

## Coverage

Không gian quét bằng `morphological-scan`, bộ test-matrix.

**Chân sản phẩm:** `docs/van-hanh/README.md` và `tools/deploy/len-ban.mjs`.

**Chân ngành:**
- [NGÀNH: GitHub Actions — environment secrets]: khoá đặt qua khoá công khai của môi trường; cần quyền quản trị kho.
- [NGÀNH: PostgreSQL — SCRAM-SHA-256 password authentication]: Postgres nhận mật khẩu đã băm sẵn theo khuôn
  `SCRAM-SHA-256$<vòng>:<muối>$<khoá lưu>:<khoá máy chủ>`.
- [NGÀNH: OWASP Secrets Management Cheat Sheet]: không đặt khoá trên dòng lệnh hay trong nhật ký; xoay khoá được.

| Trục | Giá trị | Tiêu chí |
| --- | --- | --- |
| Vật | lệnh đặt khoá · bước mật khẩu vai · bước đẩy biến · thứ tự và cấu hình · sổ tay · quyền đứng | AC-1–3 · AC-4 · AC-5, AC-6 · AC-7 · AC-8, AC-9 · AC-9 |
| Đường | lần đầu · chạy lại giữ khoá · xoay khoá · đầu vào sai · đứt giữa chừng | AC-1, AC-4 · AC-2, AC-4 · AC-2 · AC-3 · AC-3 |
| Lộ giá trị | dòng lệnh · đầu ra · nhật ký câu lệnh Postgres | AC-1, AC-5 · AC-1, AC-5 · AC-4 |
| Người chạy và quyền | chủ kho có quyền quản trị · `gh` chưa đăng nhập · `gh` thiếu quyền quản trị | AC-1 · AC-3 · AC-3 |
| Hỏng ngoài | Vercel từ chối · biến cấm ở Vercel · vai chưa có · mật khẩu có ký tự đặc biệt | AC-6 · AC-6 · AC-7 · AC-1 |

`[CE chưa kiểm chứng]` cho trục «Hỏng ngoài». Trục chỉ liệt kê lỗi đã biết của ba dịch vụ, chưa có lịch sử lỗi thật của
lệnh này.

**Để sau:**
- giới hạn mức dùng của API Vercel;
- GitHub đổi khoá công khai của môi trường giữa chừng;
- hai lượt Deploy chạy cùng lúc (tệp CI đã có `concurrency: deploy`).

**Không làm:**
- đọc khoá từ trình giữ mật khẩu ngoài, vì thêm một dịch vụ cho chủ kho giữ;
- chủ kho không phải người quản trị kho, vì kho chỉ có một chủ.

## Out of scope

- Sửa `.github/workflows/` hay `governance/`: chủ kho dán tệp CI theo bản trong sổ tay.
- Tạo khoá ở dịch vụ thay chủ kho, hay đọc khoá từ trình giữ mật khẩu ngoài.
- Tự duyệt bản thật; bỏ người duyệt của môi trường `production`.
- Lịch tự thử khôi phục mỗi quý trên CI: để một hàng sau.
- Làm cài đặt hạ tầng thật (môi trường GitHub, dự án Vercel, Data API): việc vận hành sau khi PR gộp, theo quyền đứng, không
  phải tiêu chí của vòng này.

## Notes

- Không sửa hồ sơ hàng 22. Hồ sơ ấy đo bảy bước; vòng này đo chín bước bằng bài kiểm của chính nó.
- Đường nền không chạy được: phiên này nằm trong thư mục kho có đợt điều phối đang nghỉ, và móc chặn của đợt chặn lệnh đo
  nền khi không có lượt. Thẻ ghi «chưa có số liệu nền».
- Known limits: (trống)
- Ngoài hợp đồng: (trống)
