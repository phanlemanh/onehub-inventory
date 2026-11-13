# Review findings: kiem-vai-theo-man (round 1)

## Trong hợp đồng

Không có.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Tier (review-change check 10): an authorization file is classified below high**
  Người dùng thấy gì: Tệp quyết định nút nào hiện cho vai nào đang bị máy xếp vào hạng thấp hơn thực tế. Lần này thay đổi vẫn có người sở hữu mã duyệt nên rủi ro nhỏ, nhưng lần sau có thể lọt qua mà không ai để ý.
  Căn cứ: Hậu quả nhẹ vì lần này đã có người duyệt, không mất hay lộ dữ liệu; chỉ chủ kho mới sửa được luật phân hạng và sửa rất rẻ.
  file: `src/modules/identity/ui/permitted-action.tsx`
  severity: medium
  Đề xuất: known-limits

- **Break-run working copy leaves out staged changes**
  Người dùng thấy gì: Khi chạy thử phá, bản sao có thể thiếu các thay đổi đã đưa vào vùng chờ commit, nên kết quả xanh hay đỏ có thể không phản ánh đúng bản đang duyệt. Chỉ ảnh hưởng người chạy bài kiểm, không ảnh hưởng người dùng sản phẩm.
  Căn cứ: Không ảnh hưởng người dùng cuối và người chạy bài tránh được bằng cách không staged trước khi chạy; sửa rẻ nhưng không gấp.
  file: `tests/e2e-db/pha-thu-vai-man.mjs`
  severity: medium
  Đề xuất: known-limits

- **Git worktree left behind when building the copy fails**
  Người dùng thấy gì: Nếu bước dựng bản sao thử phá bị lỗi giữa chừng, một thư mục làm việc thừa còn lại trên máy dãy. Người dùng sản phẩm không thấy gì.
  Căn cứ: Chỉ để lại rác trên máy kiểm, xóa tay được trong vài giây và hiếm khi xảy ra.
  file: `tests/e2e-db/pha-thu-vai-man.mjs`
  severity: low
  Đề xuất: wont-fix

- **Hình dạng 3: chỉ kiểm chuỗi có mặt, trong khi lời hứa là quan hệ giữa ô và giá trị (createListing nằm trong ô Đầu chủ của mục inventory)**
  Người dùng thấy gì: Bài kiểm bảng nút theo vai kiểm lỏng hơn lời hứa: một nút có thể chuyển sang nhầm vai hay nhầm màn mà bài vẫn xanh. Bảng vẫn được máy sinh lại và so khớp nên sai lệch thật khó lọt.
  Căn cứ: Hậu quả nhẹ vì bảng được sinh tự động và đã có phép so lệch; không mất hay lộ dữ liệu, siết bài kiểm sau cũng rẻ.
  file: `tests/vai-man-nut-sinh.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5: tuyên quét cả lớp «mọi id màn của sổ», nhưng chỉ kiểm danh sách điểm viết tay**
  Người dùng thấy gì: Bài kiểm chỉ chặn việc viết tay năm màn cố định, nên màn mới thêm sau này có thể bị viết tay vào bài mà không bị bắt. Chỉ ảnh hưởng độ chặt của bài kiểm, không ảnh hưởng người dùng.
  Căn cứ: Không ảnh hưởng người dùng; chỉ là khe hở nhỏ của bài kiểm, sửa rẻ khi có màn mới.
  file: `tests/vai-man-so-man.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 (kèm hình dạng 1): bước thanh bên không có ma trận viết trước, và tập màn được kiểm suy ra bằng cách grep mã nguồn nav.ts**
  Người dùng thấy gì: Nếu cách viết đường dẫn trong thanh bên đổi, một màn có thể lặng lẽ rơi khỏi phép kiểm thanh bên mà bài vẫn xanh. Hiện thanh bên đang đúng nên chưa ai thấy lỗi.
  Căn cứ: Chưa gây sai cho người dùng hôm nay; chỉ có thể che một lỗi trong tương lai, và người dùng tự thấy ngay khi mục thanh bên sai, sửa bài kiểm rẻ.
  file: `tests/e2e-db/vai-man.spec.ts`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
