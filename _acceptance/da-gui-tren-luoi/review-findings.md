# Review findings: da-gui-tren-luoi (round 1)

## Trong hợp đồng

- **Hình dạng 1 (đo chỉ dẫn thay vì đầu ra): 'newest first' đọc mảng đầu vào, không đọc thứ tự dòng lưới hiển thị**
  AC: AC-2
  file: `tests/sent.test.tsx:754`
  severity: high
  source: measurement
  detail: Trong checkGrid, dòng `const sent = rows.map((r) => Date.parse(String(r["ShareLink.sentAt"])))` lấy tham số `rows`, tức chính mảng test đưa vào SentGrid. Nó không đọc các ô 'Gửi lúc' trong `container`. Vì vậy ca đối chứng 'fails when rows keep their input order' (dòng 777-781, `checkGrid(container, reversed)`) đỏ chỉ vì mảng được đảo trước khi đưa vào, và vẫn đỏ kể cả khi lưới tự sắp lại đúng. Ngược lại, nếu lưới hay SentGrid làm xáo thứ tự dòng thì ca chính vẫn xanh. Lời hứa của E2 là 'dòng 1 là link có sentAt mới nhất và sentAt không tăng theo dòng' trên lưới đã dựng, nhưng phép đo chỉ chạm tới thứ tự đầu vào. Phép đo này cũng không mô phỏng được ca 'bộ dựng dòng không sắp xếp' mà evals.yaml mô tả, vì sentRows không bị phá. Việc tìm ô 'Mở gần nhất' (dòng 762-764) cũng lấy chỉ số từ mảng đầu vào để trỏ vào dòng DOM, nên dựa trên cùng giả định này.
  rationale: AC-2 đòi 14 dòng mới gửi trước trên lưới đã dựng, nhưng bài kiểm chỉ đọc mảng đầu vào nên không chứng được điều đó.

- **Hình dạng 2 (fixture viết tay đúng khuôn bên đọc): props đầu cột và trạng thái trống chép lại thay vì lấy từ trang**
  AC: AC-2
  file: `tests/sent.test.tsx:719`
  severity: medium
  source: measurement
  detail: Test tự viết `HEADERS` (dòng 719-726), một bản chép tay của ánh xạ trường → label() trong src/app/(app)/sent/page.tsx. Câu `expect(SENT_FIELDS.map((f) => HEADERS[f])).toEqual(APPROVED_HEADERS)` vì thế chỉ đo bản chép của test. Nếu trang gán nhầm nhãn cho một trường, ví dụ SentAt vào listingCount, test vẫn xanh. Ca trạng thái trống cũng vậy: renderGrid đưa vào `emptyWhy` do test viết ('Chọn căn để gửi ở …', khác câu thật của trang là 'Chọn ${label("Unit").toLocaleLowerCase("vi")} …'), cùng `emptyActionLabel`/`emptyActionHref="/inventory"`. Sau đó dòng 794-796 khẳng định đúng các chuỗi test vừa đưa vào ('chưa gửi link', 'Mở Bảng hàng', href '/inventory'). Đây là đo lại tiếng vọng của đầu vào, không rút từ bên viết (hàm trang) để đọc bằng bên đọc. Tên ca nói 'a page that exists' nhưng không có gì kiểm chứng điều đó.
  rationale: AC-2 đòi nhãn sáu cột theo thứ tự lấy từ labels.yaml và trạng thái trống có lời giải thích cùng nút Mở Bảng hàng của trang thật; bài kiểm chỉ đo bản chép của chính nó.

- **Hình dạng 2 (fixture viết tay đúng khuôn bên đọc): ca Inventory tự đặt title bằng textContent rồi khẳng định chúng bằng nhau**
  AC: AC-9
  file: `tests/e2e/screens/open-cell-truncate.spec.ts:76`
  severity: medium
  source: measurement
  detail: Ở ca 'inventory: a long unit code fits its cell and is cut', test dùng page.evaluate để ghi đè `text.textContent = long; text.setAttribute("title", long);` (dòng 76-78). Sau đó checkCut khẳng định `full: text.getAttribute("title") === text.textContent` (dòng 39, 46). Trên /inventory, vế 'title là chữ đầy đủ' vì thế luôn đúng do chính test tạo ra, không đo việc thành phần cắt chữ có gán title từ giá trị thật hay không. Chữ dài cũng không đi qua bên viết là renderer hay dữ liệu, trong khi evals.yaml E13 mô tả nó được 'chèn bằng tham số thử của bài (route giả)'. Hai vế đo bố cục (overflow, scrollWidth > clientWidth) vẫn là phép đo thật. Ngoài ra lệnh chờ `data-cut="true"` bị nuốt lỗi bằng `.catch(() => undefined)` (dòng 28), nên tín hiệu này không bao giờ được khẳng định.
  rationale: AC-9 đòi chữ bị cắt vẫn đọc đủ qua title; ở Bảng hàng bài tự gán title rồi so với chính nó nên vế này không được chứng.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **The ?state= rule is copied into sharing instead of living in one place**
  Người dùng thấy gì: Quy tắc quyết định khi nào màn hiện trạng thái thử nghiệm đang có hai bản giống nhau, ở Bảng hàng và ở Đã gửi. Người dùng không thấy khác biệt, nhưng sau này sửa một bản mà quên bản kia thì hai màn có thể xử lý khác nhau.
  Căn cứ: Hiện chưa ảnh hưởng người dùng, hợp đồng đã chủ ý hoãn việc gộp và có bài kiểm giữ hai bản không lệch nhau; gộp sau khi 2c vào thì rẻ hơn.
  file: `src/modules/sharing/ui/sent-rows.ts`
  severity: medium
  Đề xuất: known-limits

- **Sample builder and ShareLink rule check are exported only from sharing's UI entry point; index.ts is still empty**
  Người dùng thấy gì: Phần dựng link mẫu và kiểm luật được lấy ra qua cửa dành cho giao diện thay vì cửa dành cho luật thuần. Người dùng không thấy gì, chỉ làm cấu trúc mã lệch so với mô-đun khác.
  Căn cứ: Không làm mất hay lộ dữ liệu và người dùng không gặp; sửa lúc nào cũng rẻ, chỉ là dọn cấu trúc.
  file: `src/modules/sharing/ui/index.tsx`
  severity: medium
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
