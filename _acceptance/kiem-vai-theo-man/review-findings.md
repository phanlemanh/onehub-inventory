# Review findings: kiem-vai-theo-man (round 2)

## Trong hợp đồng

Không có.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Tier / scope boundary: protected tool path touched against the design's stated boundary (high tier, pending owner approval)**
  Người dùng thấy gì: Một dòng chỉnh trong bộ chờ của bài kiểm trình duyệt chưa được chủ kho duyệt. Nếu không duyệt thì phải gỡ dòng ấy và chỉ đo ở khổ 1440.
  Căn cứ: Không ảnh hưởng người dùng cuối, chỉ là thủ tục duyệt; chủ kho quyết ở cổng bằng chứng và gỡ lại rất rẻ.
  file: `tools/e2e_templates/settle.ts`
  severity: medium
  Đề xuất: known-limits

- **Records: the design describes a page marker that the code no longer uses**
  Người dùng thấy gì: Tài liệu thiết kế còn mô tả cách đánh dấu nút cũ, nên người rà soát luật sản phẩm có thể đọc sai phạm vi thay đổi thật. Người dùng cuối không thấy gì khác.
  Căn cứ: Chỉ là lệch ghi chép, không mất hay lộ dữ liệu, sửa lại câu chữ rất rẻ bất cứ lúc nào.
  file: `_acceptance/kiem-vai-theo-man/design.md`
  severity: low
  Đề xuất: known-limits

- **SP-4 adjacent: nothing stops a real build from enabling the test-only button record**
  Người dùng thấy gì: Nếu ai đó bật nhầm cờ thử nghiệm khi dựng bản chạy thật, trình duyệt sẽ để lộ thông tin quyền nội bộ của người đăng nhập. Dữ liệu này không đến trang của khách.
  Căn cứ: Chỉ xảy ra khi cấu hình sai, thông tin lộ là quyền nội bộ không phải dữ liệu khách, và thêm chốt chặn sau này rẻ.
  file: `src/modules/identity/ui/permitted-action.tsx`
  severity: low
  Đề xuất: known-limits

- **Leak check guard is met by any JS chunk, so an unreadable page or RSC body still passes as 'no leak'**
  Người dùng thấy gì: Bài kiểm rò rỉ có thể báo không lộ người chứng dù trang hay dữ liệu trang không đọc được, nên một lỗi lộ hiếm có thể lọt qua mà không ai biết.
  Căn cứ: Chỉ làm bài kiểm kém nhạy chứ không làm lộ thật cho người dùng, và ba bản phá thử cùng đối chứng dương vẫn bắt phần lớn trường hợp.
  file: `tests/e2e-db/vai-man.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Break-run copy keeps files the working tree deleted**
  Người dùng thấy gì: Khi có tệp đã xoá mà chưa lưu vào lịch sử, bản phá thử có thể chạy trên cây hơi khác cây đang được xem xét. Người dùng cuối không bị ảnh hưởng.
  Căn cứ: Chỉ là tình huống hiếm của người làm, không mất dữ liệu, tự hết khi lưu thay đổi và sửa rẻ.
  file: `tests/e2e-db/pha-thu-vai-man.mjs`
  severity: low
  Đề xuất: known-limits

- **Tier (review-change check 10): an authorization file is classified below high (r1)**
  Người dùng thấy gì: Tệp quyết định nút nào hiện cho vai nào đang bị máy xếp vào hạng thấp hơn thực tế. Lần này thay đổi vẫn có người sở hữu mã duyệt nên rủi ro nhỏ, nhưng lần sau có thể lọt qua mà không ai để ý.
  Căn cứ: Hậu quả nhẹ vì lần này đã có người duyệt, không mất hay lộ dữ liệu; chỉ chủ kho mới sửa được luật phân hạng và sửa rất rẻ.
  file: `src/modules/identity/ui/permitted-action.tsx`
  severity: medium
  Đề xuất: known-limits

- **Break-run working copy leaves out staged changes (r1 · tệp đã đổi)**
  Người dùng thấy gì: Khi chạy thử phá, bản sao có thể thiếu các thay đổi đã đưa vào vùng chờ commit, nên kết quả xanh hay đỏ có thể không phản ánh đúng bản đang duyệt. Chỉ ảnh hưởng người chạy bài kiểm, không ảnh hưởng người dùng sản phẩm.
  Căn cứ: Không ảnh hưởng người dùng cuối và người chạy bài tránh được bằng cách không staged trước khi chạy; sửa rẻ nhưng không gấp.
  file: `tests/e2e-db/pha-thu-vai-man.mjs`
  severity: medium
  Đề xuất: known-limits

- **Git worktree left behind when building the copy fails (r1 · tệp đã đổi)**
  Người dùng thấy gì: Nếu bước dựng bản sao thử phá bị lỗi giữa chừng, một thư mục làm việc thừa còn lại trên máy dãy. Người dùng sản phẩm không thấy gì.
  Căn cứ: Chỉ để lại rác trên máy kiểm, xóa tay được trong vài giây và hiếm khi xảy ra.
  file: `tests/e2e-db/pha-thu-vai-man.mjs`
  severity: low
  Đề xuất: wont-fix

- **Hình dạng 3: chỉ kiểm chuỗi có mặt, trong khi lời hứa là quan hệ giữa ô và giá trị (createListing nằm trong ô Đầu chủ của mục inventory) (r1)**
  Người dùng thấy gì: Bài kiểm bảng nút theo vai kiểm lỏng hơn lời hứa: một nút có thể chuyển sang nhầm vai hay nhầm màn mà bài vẫn xanh. Bảng vẫn được máy sinh lại và so khớp nên sai lệch thật khó lọt.
  Căn cứ: Hậu quả nhẹ vì bảng được sinh tự động và đã có phép so lệch; không mất hay lộ dữ liệu, siết bài kiểm sau cũng rẻ.
  file: `tests/vai-man-nut-sinh.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5: tuyên quét cả lớp «mọi id màn của sổ», nhưng chỉ kiểm danh sách điểm viết tay (r1)**
  Người dùng thấy gì: Bài kiểm chỉ chặn việc viết tay năm màn cố định, nên màn mới thêm sau này có thể bị viết tay vào bài mà không bị bắt. Chỉ ảnh hưởng độ chặt của bài kiểm, không ảnh hưởng người dùng.
  Căn cứ: Không ảnh hưởng người dùng; chỉ là khe hở nhỏ của bài kiểm, sửa rẻ khi có màn mới.
  file: `tests/vai-man-so-man.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 (kèm hình dạng 1): bước thanh bên không có ma trận viết trước, và tập màn được kiểm suy ra bằng cách grep mã nguồn nav.ts (r1 · tệp đã đổi)**
  Người dùng thấy gì: Nếu cách viết đường dẫn trong thanh bên đổi, một màn có thể lặng lẽ rơi khỏi phép kiểm thanh bên mà bài vẫn xanh. Hiện thanh bên đang đúng nên chưa ai thấy lỗi.
  Căn cứ: Chưa gây sai cho người dùng hôm nay; chỉ có thể che một lỗi trong tương lai, và người dùng tự thấy ngay khi mục thanh bên sai, sửa bài kiểm rẻ.
  file: `tests/e2e-db/vai-man.spec.ts`
  severity: medium
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

Không có.

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
