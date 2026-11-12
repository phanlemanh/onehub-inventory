---
schema_version: 1
feature: Thư mời dẫn người được mời tới đúng trang đăng nhập của sản phẩm, lấy từ cấu hình chứ không từ yêu cầu gửi tới
slug: thu-moi-dia-chi-tu-cau-hinh
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [config, api]
status: approved
approved_by: Manh Phan
approved_at: 2026-11-12
design_doc: docs/superpowers/specs/2026-11-12-thu-moi-dia-chi-tu-cau-hinh-design.md
---

# Acceptance Contract: thu-moi-dia-chi-tu-cau-hinh

## Context

Hàng 9d của lộ trình, dựng trên hàng 9 (mời người, gán vai). Mục ngoài hợp đồng 2 của hàng 9: đường tới trang đăng nhập
trong thư mời lấy từ gốc của yêu cầu gửi tới, nên ở một số cách triển khai thư — gửi từ người gửi chính thức — có thể trỏ
người được mời sang trang khác. Hàng này đưa đường ấy về địa chỉ gốc khai trong cấu hình (`APP_URL`), và bản thật thiếu
hay khai sai địa chỉ ấy thì không khởi động, cùng nếp với `DATABASE_URL`, `AUTH_SECRET`, `RESEND_API_KEY`, `MAIL_FROM`.
Phải xong trước hàng 10 (nối dữ liệu thật). Source input: ô cơ hội `_acceptance/thu-moi-dia-chi-tu-cau-hinh/opportunity.md`
đã quyết «build» bởi Manh Phan; `_acceptance/moi-nguoi-gan-vai/review-findings.md`.

Luật chạm: SP-3 không đổi (thư mời vẫn chỉ đi khi quản trị bấm «Mời»). Không chạm SP-1, SP-4.

## Criteria

- AC-1: Given bản thật khai `APP_URL=https://app.example.test`, When quản trị mời một người, Then thư mời đi qua Resend
  chứa đúng đường `https://app.example.test/login` để đăng nhập.
- AC-2: Given cùng cấu hình ấy, When yêu cầu mời mang tên máy chủ lạ (gốc `https://ke-gian.test`), Then thư vẫn trỏ
  `https://app.example.test/login` và không chứa tên máy chủ lạ ở bất kỳ phần nào của thư gửi đi.
- AC-3: Given bản thật đủ bốn biến cũ nhưng thiếu `APP_URL`, When máy chủ khởi động, Then nó không khởi động và lỗi gọi
  đúng tên `APP_URL`; đọc cấu hình đăng nhập lúc chạy cũng từ chối như vậy.
- AC-4: Given bản thật khai `APP_URL` sai khuôn (không phải địa chỉ tuyệt đối, giao thức khác `https` [chờ Hỏi-1: chủ kho chọn «nhận cả http» thì vế này thành «giao thức khác `http`/`https`»], có tên/mật khẩu,
  có `?` hay `#`), When máy chủ khởi động, Then nó không khởi động, lỗi gọi tên `APP_URL` và không in giá trị đã khai (cả trong lỗi gốc đi kèm);
  địa chỉ có đường con (`https://app.example.test/onehub/`) thì được nhận và thư trỏ `.../onehub/login`.
- AC-5: Given máy phát triển, When chưa khai `APP_URL`, Then thư mời trỏ gốc của yêu cầu như hàng 9 (mỗi dãy một cổng);
  When đã khai `APP_URL`, Then thư trỏ `APP_URL` dù yêu cầu mang gốc khác.
- AC-6: Given thư mã đăng nhập của hàng 8, When dựng thư ở bản thật, Then toàn bộ thư gửi đi (tiêu đề, thân chữ và mọi phần khác) không chứa đường nào
  (`http://` hay `https://`) — hàng 8 không cùng lỗi và phép đo giữ điều đó.
- AC-7: Given `.env.example`, Then nó ghi `APP_URL` kèm ví dụ `https://example.test` và câu chú thích «bắt buộc ở bản thật»; không
  có địa chỉ thật nào.

## Coverage

Trục (quét bằng morphological-scan, preset risk-premortem rút gọn):
- Môi trường: bản thật · máy phát triển → AC-1..4 · AC-5.
- Trạng thái biến: đủ đúng · thiếu · sai khuôn (5 khuôn) · có đường con → AC-1 · AC-3 · AC-4.
- Nguồn tên máy chủ: cấu hình · gốc yêu cầu bình thường · gốc yêu cầu lạ → AC-1 · AC-5 · AC-2.
- Thư: thư mời · thư mã đăng nhập → AC-1..5 · AC-6.
- Điểm chặn: khởi động · đọc cấu hình lúc chạy → AC-3 (cả hai), AC-4 (khởi động).
- Tài liệu cấu hình → AC-7.
Thước CE: mỗi ô của năm trục đầu có ít nhất một AC; ô «sai khuôn» đo đủ năm khuôn trong một ca. Không còn ô trống.

## Đường đo

- Câu hỏi của ô cơ hội («đường lấy từ cấu hình · tên máy chủ lạ không đổi được · thiếu thì không khởi động») — số từ ba
  ca kiểm đơn vị, AC-1, AC-2, AC-3 bảo đảm. Không có thước dùng thật (hàng không có UAT riêng theo luật đợt).

## Out of scope

- Gỡ trường `origin` khỏi đường mời người (`members.ts`, `members-http.ts`): dãy N đang sửa cùng mô-đun; làm sau khi 9a gộp.
- Đi lại toàn đường HTTP có cơ sở dữ liệu với tên máy chủ lạ: ngoài ranh giới, đo ở bộ gửi do cấu hình dựng (xem Notes).
- Đổi nội dung chữ của thư mời hay thư mã.
- Kiểm tên miền của `APP_URL` có thật trỏ về máy chủ này không (việc vận hành của người triển khai).

## Notes

- Known limits: phép đo dừng ở bộ gửi thư mà cấu hình dựng — chính bộ gửi `runtime.ts` nối vào bộ xử lý mời người ở bản
  thật; không có bài HTTP đầu-cuối với tên máy chủ lạ.
