## Trong hợp đồng

- **Hình dạng 6 (gốc cây): phép thử «gốc in ra là cây đang chấm» tự quy chiếu, nên không bắt được một gốc cây bị gắn cứng**
  file: `_acceptance/lint-bo-qua-thu-muc-ngoai-git/rang/two-way.mjs:18`
  severity: medium
  AC: AC-6
  source: measurement
  detail: Hàm run() ở dòng 18 kiểm `out.includes(`: root ${REPO}\n`)`, với REPO nhập từ ./lib.mjs (dòng 12). Ba phép đo bo-qua.mjs, chay-that.mjs và kiem-tron.mjs đều in dòng gốc qua ROOT_LINE của cùng lib.mjs (lib.mjs dòng 11), và ROOT_LINE in đúng biến REPO đó (lib.mjs dòng 14, `resolve(HERE, "../../..")`). Vế đo và vế so lấy từ một nguồn, nên phép so luôn đúng. Ví dụ: sửa lib.mjs thành `REPO = "/Users/.../onehub-inventory"` (đo bản checkout của tác giả) thì cả phép đo lẫn two-way cùng nhận gốc mới, và assert vẫn xanh. Như vậy điều E6/AC-6 hứa («gốc ấy là cây đang chấm») không có phép đo nào giữ. Muốn có đối chứng thì two-way phải tự suy gốc cây theo đường độc lập, ví dụ `git rev-parse --show-toplevel` từ cwd của lượt chấm, hoặc `process.cwd()` của executor, rồi mới so với dòng gốc mà phép đo in ra.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Hình dạng 4 (chỉ kiểm phía âm): hai lệnh thật `npm run lint` và `make check` của E4 và E7 chưa lần nào được chạy đỏ**
  Người dùng thấy gì: Hai lệnh kiểm thật của kho chưa từng được thử cho ra kết quả đỏ, nên nếu chúng hỏng âm thầm thì bộ nghiệm thu có thể vẫn báo xanh. Phần thiết lập chính của tính năng vẫn được các phép đo khác kiểm đỏ và xanh.
  Căn cứ: Hậu quả nhẹ vì chỉ làm bộ kiểm kém nhạy ở hai nhánh, không mất dữ liệu và người dùng cuối không thấy; sửa được sau này mà không ảnh hưởng bản đã giao.
  file: `_acceptance/lint-bo-qua-thu-muc-ngoai-git/rang/two-way.mjs`
  severity: low
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
