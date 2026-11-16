## Trong hợp đồng

Không có finding nào.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **LOGIN_ROLE is declared a second time in config.ts instead of reusing the one in with-company.ts**
  Người dùng thấy gì: Tên vai đăng nhập đang được ghi ở hai chỗ. Hôm nay hai chỗ khớp nhau nên người dùng không thấy gì, nhưng nếu sau này đổi một chỗ mà quên chỗ kia thì máy chủ có thể từ chối khởi động hoặc báo sai.
  Căn cứ: Không ảnh hưởng người dùng lúc này, không mất hay lộ dữ liệu; nếu lệch thì lộ ra ngay khi khởi động và sửa rẻ khi thật sự đổi tên vai.
  file: `src/modules/identity/config.ts`
  severity: medium
  Đề xuất: known-limits

- **The production address is hard-coded in both the deploy tool and the start-up check**
  Người dùng thấy gì: Địa chỉ bản thật được ghi ở hai nơi. Nếu sau này đổi tên miền ở một nơi thôi, kiểm nhanh sẽ báo đỏ hoặc máy chủ không chịu khởi động, người vận hành phải đi tìm nguyên nhân.
  Căn cứ: Chỉ gây đỏ có thể thấy ngay chứ không làm sai lặng lẽ, không mất dữ liệu, và địa chỉ này hiếm khi đổi.
  file: `tools/deploy/kiem-nhanh.mjs`
  severity: low
  Đề xuất: known-limits

- **Deploy, smoke và rollback lặng lẽ thoát mã 0, không làm gì, khi chạy qua đường dẫn có symlink**
  Người dùng thấy gì: Nếu kho nằm dưới đường dẫn có liên kết tắt, lệnh đưa bản lên, kiểm nhanh hay lùi bản sẽ không làm gì mà vẫn báo thành công, người vận hành tưởng đã lên bản trong khi chưa có gì xảy ra.
  Căn cứ: Hậu quả là một lần xanh giả nhưng chỉ xảy ra khi chạy ở thư mục có liên kết tắt, không mất dữ liệu, người vận hành thấy không có dòng nào in ra và chạy lại ở đường dẫn thật được.
  file: `tools/deploy/len-ban.mjs`
  severity: medium
  Đề xuất: known-limits

- **Bước ban-thu-truoc cho bản thật đi tiếp dù bản thử đang không khoẻ**
  Người dùng thấy gì: Bản thật có thể được đưa lên dù bản thử đang báo lỗi, miễn là bản thử đang chạy đúng phiên bản. Khi đó cơ sở dữ liệu thật có thể bị đổi cấu trúc trong lúc bản thử chưa thật sự chạy tốt.
  Căn cứ: Bản thử vừa được đưa lên và kiểm đạt ngay trước đó nên hiếm khi hỏng, và các bước kiểm sau đó vẫn chặn trước khi đổi tên miền; rủi ro nhỏ và sửa rẻ.
  file: `tools/deploy/len-ban.mjs`
  severity: low
  Đề xuất: known-limits

- **Tự lùi bản bỏ qua kiểm commit khi bản cũ không có trong danh sách Vercel**
  Người dùng thấy gì: Khi tự lùi bản mà không tra được phiên bản cũ, lệnh vẫn báo đã lùi về bản trước dù không đối chiếu được đó có đúng phiên bản mong muốn hay không.
  Căn cứ: Chỉ xảy ra khi tra danh sách bản cũ thất bại, lúc ấy tên miền vẫn được lùi và kiểm sức khoẻ; không mất dữ liệu và người vận hành tự kiểm lại được.
  file: `tools/deploy/len-ban.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5 — tuyên quét LỚP mẫu khoá nhưng ca phá chỉ phủ một phần mảng PATTERNS (không có ma trận số ca = số mẫu)**
  Người dùng thấy gì: Hai loại khoá bí mật chưa có phép thử chứng minh bộ dò thật sự bắt được chúng. Nếu mẫu dò của hai loại này hỏng, một khoá thật lọt vào kho vẫn không bị phát hiện.
  Căn cứ: Bộ dò vẫn chạy đúng với các loại khoá còn lại và hai mẫu này hiện đang viết đúng; chỉ là thiếu bằng chứng, và bổ sung ca thử về sau rất rẻ.
  file: `tests/khong-khoa-bi-mat.test.ts`
  severity: medium
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
