# Review findings: dat-khoa-cau-hoi-hien (round 3)

## Trong hợp đồng

Không có finding nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **terminalAsk takes input/output parameters, but the non-terminal path still reads file descriptor 0 and writes to process.stderr**
  Người dùng thấy gì: Khi chủ kho dán khoá qua lệnh thật thì mọi thứ chạy đúng. Chỉ khi sau này có người dùng hàm hỏi này với luồng tự chọn thì câu hỏi có thể đi nhầm chỗ hoặc lệnh chờ mãi.
  Căn cứ: Hiện không ai gặp lỗi này, lệnh thật chạy đúng, và chỉ ảnh hưởng người viết bài kiểm sau này nên ghi lại là đủ.
  file: `tools/deploy/dat-khoa.mjs`
  severity: low
  Đề xuất: known-limits

- **Self-test case pha-plan-mang-env writes the grader's whole environment to disk and only deletes it if nothing goes wrong first**
  Người dùng thấy gì: Nếu phép tự kiểm của bộ chấm hỏng giữa chừng, một tệp tạm chứa môi trường máy chấm có thể còn lại trên máy chấm. Tệp nằm trong thư mục không đưa lên kho và người dùng sản phẩm không bị ảnh hưởng.
  Căn cứ: Chỉ để lại tệp tạm trên máy chấm, không lộ ra ngoài và xoá tay được, nên ghi lại thay vì sửa ngay.
  file: `_acceptance/dat-khoa-cau-hoi-hien/rang/kiem.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (assertion âm tính một mình): bài kiểm mới khẳng định 'chữ đã dán không hiện' mà không có đối chứng dương**
  Người dùng thấy gì: Bài kiểm nhỏ của PR có thể không bắt được lỗi nếu sau này chữ khoá dán vào lại hiện lên màn. Lệnh thật hôm nay vẫn không hiện chữ dán và phép đo trên terminal thật bắt được lỗi ấy.
  Căn cứ: Việc ẩn chữ đã được phép đo trên terminal thật bảo vệ, nên rủi ro cho người dùng thấp, và gia cố bài kiểm nhỏ có thể làm sau.
  file: `tools/deploy/dat-khoa-ask.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3/1: bài kiểm mới tuyên 'readline không xoá' nhưng chỉ đo chuỗi có mặt trong luồng byte thô, không đo màn**
  Người dùng thấy gì: Bài kiểm nhỏ chỉ nhìn chữ đã gửi ra, không nhìn màn sau khi xoá, nên có thể bỏ sót một kiểu xoá dòng mới. Phép đo trên terminal thật vẫn kiểm màn cuối cùng.
  Căn cứ: Màn thật đã được kiểm ở chỗ khác nên chủ kho vẫn thấy đủ câu hỏi, và bài kiểm nhỏ chỉ là lớp phụ.
  file: `tools/deploy/dat-khoa-ask.test.ts`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4: ca 'gh-gia' luôn báo ok với danh sách lỗi viết cứng là rỗng**
  Người dùng thấy gì: Dòng báo xanh về công cụ gh giả chỉ nhắc lại điều kiện có sẵn, không phải một phép đo thật. Người dùng sản phẩm không bị ảnh hưởng.
  Căn cứ: Chỉ làm bằng chứng chấm yếu hơn vẻ ngoài, không ảnh hưởng người dùng, và phép chặn trước đã đảm bảo gh là bản giả.
  file: `_acceptance/dat-khoa-cau-hoi-hien/rang/kiem.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 6 (đo cây khác cây đang kiểm): ci.mjs lấy HEAD của thư mục hiện hành thay vì của cây đang chấm**
  Người dùng thấy gì: Nếu chạy phép đo CI từ một bản làm việc khác, kết quả xanh có thể là của bản khác chứ không phải bản đang chấm. Chạy đúng chỗ như hồ sơ ghi thì không sao.
  Căn cứ: Chỉ sai khi người chạy đứng nhầm thư mục, tự phát hiện được bằng cách chạy lại đúng chỗ, nên ghi lại là đủ.
  file: `_acceptance/dat-khoa-cau-hoi-hien/rang/ci.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
