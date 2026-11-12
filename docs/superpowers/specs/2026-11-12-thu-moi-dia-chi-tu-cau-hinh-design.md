# Thư mời lấy địa chỉ từ cấu hình — thiết kế (hàng 9d)

Hồ sơ: `_acceptance/thu-moi-dia-chi-tu-cau-hinh/` · hạng T3 · không có màn, không có migration.

## Vấn đề

Hàng 9 dựng đường tới trang đăng nhập trong thư mời từ gốc của yêu cầu gửi tới
(`src/modules/identity/members-http.ts`, `new URL(req.url).origin`). Máy chủ đứng sau lớp chuyển tiếp, hay yêu cầu mang
tên máy chủ bị đổi, thì thư mời — gửi từ người gửi chính thức của sản phẩm — có thể trỏ người được mời sang trang khác
(mục ngoài hợp đồng 2 của hàng 9, chủ kho chọn mở hợp đồng mới ngày 2026-11-11).

Thư mã đăng nhập của hàng 8 (`src/modules/identity/sender.ts`, `codeEmail`) chỉ chứa mã và thời hạn, không có đường nào:
không cùng lỗi. Hợp đồng giữ điều đó bằng một phép đo (AC-6) để thư mã không lặng lẽ thêm đường sau này.

## Cách làm

1. Biến mới `APP_URL`: địa chỉ gốc của sản phẩm, ví dụ `https://example.test`. Thêm vào danh sách biến bản thật phải có
   (`PRODUCTION_VARS` trong `src/modules/identity/config.ts`). Lệnh khởi động (`src/instrumentation.ts`) đã gọi hàm
   kiểm ấy, nên bản thật thiếu biến thì không khởi động, cùng nếp với bốn biến cũ.
2. Biến phải đúng khuôn: địa chỉ tuyệt đối, không tên/mật khẩu, không `?` hay `#`; ở bản thật phải là `https` (khuyến nghị — chờ chủ kho trả lời câu hỏi https/http ở Cổng Phạm vi). Sai khuôn
   thì khởi động dừng và gọi tên `APP_URL` (không in giá trị). Đường con được giữ: `https://example.test/onehub` cho
   `https://example.test/onehub/login`.
3. Cấu hình dựng bộ gửi thư mời kèm địa chỉ gốc ấy. Bộ gửi lấy đường đăng nhập từ địa chỉ gốc đã cấu hình, bỏ qua gốc của
   yêu cầu. Gốc của yêu cầu chỉ còn là đường lui ở máy phát triển khi chưa khai `APP_URL` — mỗi dãy chạy một cổng riêng,
   một mặc định cố định sẽ trỏ sai cổng.
4. Không đổi `members.ts`, `members-http.ts` (dãy N đang làm hàng 9a trong cùng mô-đun): trường `origin` của thư vẫn được
   truyền, chỉ là bộ gửi bản thật không dùng nó. Gỡ hẳn trường ấy là việc dọn sau khi 9a gộp.
5. `.env.example` thêm một dòng ghi chú và `# APP_URL=https://example.test` (chỉ thêm dòng; tệp dùng chung).
6. Một dòng ở bài kiểm cơ sở dữ liệu của hàng 8 (`tests/db/dang-nhap.db.test.ts`, ca đối chứng dương dựng cấu hình bản
   thật) phải thêm `APP_URL`, nếu không ca ấy đỏ. Ngoài ranh giới: đã xin giám sát (yêu cầu R-2).

## Luật sản phẩm chạm

SP-3 (người bấm gửi): không đổi — thư mời vẫn chỉ đi khi quản trị bấm «Mời». SP-1, SP-4: không chạm. Hàng này giảm rủi ro
thư giả danh người gửi chính thức.

## Giới hạn đã biết

- Phép đo dừng ở bộ gửi thư do cấu hình dựng (đúng thứ bộ xử lý mời người dùng ở bản thật, nối qua
  `src/modules/identity/runtime.ts`), không đi lại toàn đường HTTP có cơ sở dữ liệu: đường ấy nằm ngoài ranh giới
  của hàng và đang có dãy N sửa. Bài cơ sở dữ liệu của hàng 9 (`tests/db/moi-nguoi.db.test.ts`) vẫn chạy trong làn máy và
  vẫn xanh vì máy phát triển chưa khai `APP_URL` dùng gốc của yêu cầu.

## Không có màn

Hàng chỉ đổi cấu hình và thân thư: không có bản bấm được, không có đặc tả UX, không bài trình duyệt mới.
