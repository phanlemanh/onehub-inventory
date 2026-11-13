## Trong hợp đồng

- **Hình dạng 5 (tuyên quét LỚP nhưng chỉ có điểm-case): bài quét lịch sử git bỏ sót lời gọi có thật trong cây**
  AC: AC-7
  file: `tests/ci-ban-sao-nong.test.ts:59`
  severity: high
  source: measurement
  detail: Phần mở đầu tệp và E7 hứa "không test hay tool nào CI chạy gọi git show/log/rev-parse tới commit khác HEAD" trên mọi tests/**, tools/**, db/scripts/**. Nhưng HISTORY (dòng 59-64) chỉ là bốn mẫu điểm: `"git", ["show"|"log"`, `git("show"|"log"`, `git show|log ` và `rev-parse <hex literal>`. Trong cây đang kiểm có tools/round_metrics/round_metrics.py:334 `git(root, "show", f"{commit}:{KHUNG_1A}")` và dòng 328/337 `git(root, "cat-file", "-e", f"{commit}...")`. Các lời gọi này đọc commit cũ mà không khớp mẫu nào, vì đối số đầu là `root` và `cat-file` không có trong danh sách. Tệp cũng không nằm trong FALLS_BACK. Vì vậy `historyCalls(ROOT)` trả `[]` (dòng 128) chỉ vì mẫu không phủ hết lớp, chứ không phải vì lớp sạch. Các dạng `git -C dir show`, `["-C", d, "show"]` và `rev-parse ${BIEN}` cũng lọt. Bài phá (dòng 136-160) chỉ thử đúng ba dạng mà mẫu đã biết, không có ma trận viết trước cho các dạng gọi.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **ci-db.sh reads two new environment variables that .env.example does not list (CI_DB_OUT, CI_DB_DOI)**
  Người dùng thấy gì: Hai tuỳ chỉnh của lệnh kiểm CI không được ghi trong tệp cấu hình mẫu, nên người mới khó biết chúng tồn tại. Lệnh vẫn chạy đúng với giá trị mặc định.
  Căn cứ: Hậu quả nhẹ, chỉ là thiếu tài liệu, không mất dữ liệu và người dùng cuối không thấy; thêm hai dòng sau này rất rẻ.
  file: `.env.example`
  severity: low
  Đề xuất: known-limits

- **ci-thu waits for Postgres forever if the container never becomes ready**
  Người dùng thấy gì: Nếu bbài dựng lại gặp cơ sở dữ liệu không lên được, lượt chấm sẽ treo thay vì báo đỏ. Người chạy phải tự dừng và thử lại.
  Căn cứ: Chỉ xảy ra khi hạ tầng hỏng, không mất dữ liệu và chạy lại là xong; công cụ này chỉ người trong nhóm dùng, không phải khách hàng.
  file: `db/scripts/ci-thu.sh`
  severity: low
  Đề xuất: known-limits

- **ci-that `--cho` without a number turns into an endless wait**
  Người dùng thấy gì: Nếu gõ sai tham số thời gian chờ, lệnh đo CI sẽ chờ mãi thay vì báo lỗi. Cấu hình hiện tại truyền đúng nên không gặp.
  Căn cứ: Chỉ xảy ra khi người chạy gõ sai tay, tự dừng và chạy lại được; cấu hình sẵn đã an toàn nên sửa không đáng công.
  file: `db/scripts/ci-that.mjs`
  severity: low
  Đề xuất: wont-fix

- **Hình dạng 5 (thiếu ma trận toàn phần viết trước): E8 ghim '6 loại × 2 cấu hình' nhưng bài chỉ phủ 5 loại trên một gốc**
  Người dùng thấy gì: Việc dọn thư mục dựng tạm chỉ được thử đầy đủ trên một trong hai cấu hình trình duyệt. Cấu hình còn lại có thể lỗi mà bài kiểm không phát hiện.
  Căn cứ: Rủi ro là thư mục rác trên máy dãy chứ không phải dữ liệu khách hàng, và lỗi sẽ lộ khi dùng thật; bổ sung ô kiểm sau này không đắt.
  file: `tests/don-dung-tam.test.ts`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 1 (đo CHỈ DẪN thay vì ĐẦU RA): 'hai cau hinh Playwright khai dung ham don' chỉ grep mã nguồn**
  Người dùng thấy gì: Bài kiểm chỉ xác nhận cấu hình có ghi dòng gọi hàm dọn, không xác nhận hàm thật sự chạy. Nếu ai đó làm hỏng bước dọn, bài kiểm vẫn xanh.
  Căn cứ: Hậu quả chỉ là thư mục tạm không được dọn trên máy dãy, không ảnh hưởng người dùng và bài khác vẫn đo hành vi dọn.
  file: `tests/don-dung-tam.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2 (fixture cắt đúng khuôn bên đọc, không round-trip từ writer): báo cáo Playwright 'thật' chỉ còn đúng các khoá của PwReport**
  Người dùng thấy gì: Phép đếm giao–nhận được thử trên dữ liệu mẫu đã rút gọn, nên nếu công cụ chạy trình duyệt đổi định dạng báo cáo, bài thử không báo trước.
  Căn cứ: Lệnh chạy thật vẫn đọc báo cáo thật nên lỗi sẽ lộ ngay ở CI và chạy lại được; không ảnh hưởng người dùng cuối.
  file: `tests/fixtures/ci-db/co-phien.json`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 (assert 'chuỗi có mặt' khi lời hứa là quan hệ): đối chứng 'cach-ly.db.test.ts doc ban chep' chỉ toContain**
  Người dùng thấy gì: Bài kiểm chỉ xác nhận chuỗi tên bản chép có trong tệp, chưa xác nhận đường dẫn thật khớp tệp đã ghim. Nếu ai đó đổi lệch, bài kiểm có thể vẫn xanh.
  Căn cứ: Rủi ro thấp vì bài cách ly chạy thật sẽ đỏ nếu tệp thiếu; không mất dữ liệu và sửa lại nhanh khi gặp.
  file: `tests/ci-ban-sao-nong.test.ts`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
