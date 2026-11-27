# Review findings: khung-luoi-va-ngan-chi-tiet (round 2)

## Trong hợp đồng

Không có finding nào được map vào AC (phân loại phạm vi không chạy được, xem mục dưới).

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Hình dạng 2 (fixture viết tay đúng khuôn bên đọc): chiều đỏ 'grid ends' của Q2 đưa số tự đặt vào assertGridFits (r1 · tệp đã đổi)**
  Người dùng thấy gì: Bài kiểm tra việc lưới khít màn có thể vẫn xanh nếu sau này lưới dừng sai chỗ, nên một lỗi về chỗ dừng của lưới có thể lọt qua mà không ai biết. Hiện màn vẫn chạy đúng.
  Căn cứ: Nhẹ với người dùng vì màn hiện đúng; chỉ làm giảm khả năng báo sớm khi lưới lệch sau này, và bổ sung bài kiểm tra bất cứ lúc nào cũng được.
  file: `tests/e2e/khung-luoi-nut.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (âm tính một mình, không ghim thông điệp): chiều đỏ Q3 dùng regex hai nhánh nên nhánh bóng và viền trái chưa từng đỏ (r1 · tệp đã đổi)**
  Người dùng thấy gì: Nếu sau này ngăn chi tiết mất bóng hoặc viền trái, bài kiểm tra có thể không báo, nên nhân viên sàn có thể thấy ngăn nhìn phẳng và khó tách khỏi lưới.
  Căn cứ: Hậu quả chỉ là thẩm mỹ, không mất dữ liệu, người dùng vẫn dùng được; chưa xảy ra nên chấp nhận và ghi lại là đủ.
  file: `tests/e2e/khung-luoi-nut.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (âm tính một mình, không ghim thông điệp): chiều đỏ Hỏi-7 dùng /keep their words|lines while pinned/ (r1 · tệp đã đổi)**
  Người dùng thấy gì: Khi ngăn được ghim thành cột, nếu nút lại hiện chữ hoặc rộng quá thì bài kiểm tra có thể không bắt được, làm hàng nút chật và khó bấm trên màn nhỏ.
  Căn cứ: Chỉ ảnh hưởng độ gọn của thanh nút, người dùng vẫn bấm được và tải lại là ổn; dễ bổ sung sau.
  file: `tests/e2e/khung-luoi-nut.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (âm tính một mình): phần thanh công cụ của sentFrame mà E21 dựa vào bị bỏ qua im lặng và không có chiều đỏ (r1 · tệp đã đổi)**
  Người dùng thấy gì: Trên màn Đã gửi, nếu thanh công cụ chạy đè lên ngăn chi tiết thì bài kiểm tra có thể không báo, khiến nút cuối bị che khi mở chi tiết.
  Căn cứ: Màn hiện đúng và lỗi nếu xảy ra chỉ là nút bị che, người dùng đóng ngăn là xong; chi phí bổ sung bài thấp nên ghi lại để làm sau.
  file: `tests/e2e/khung-luoi-nut.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (âm tính một mình): kiểm «Cột» và «Toàn màn hình» bỏ qua im lặng khi thiếu nút và không có chiều đỏ (r1)**
  Người dùng thấy gì: Nếu nút «Cột» hoặc «Toàn màn hình» biến mất khỏi thanh công cụ, bài kiểm tra này sẽ không báo, người dùng mất cách đổi cột hoặc vào toàn màn hình.
  Căn cứ: Nút mất sẽ bị phát hiện rất nhanh qua các bài khác và khi dùng thật, mức nhẹ, tải lại không mất dữ liệu; sửa không đáng công.
  file: `tests/e2e/ho-so-can.spec.ts`
  severity: low
  Đề xuất: wont-fix

- **Hình dạng 2 (fixture viết tay): chiều đỏ 'no button at the record head' của E7 đưa mảng rỗng tự đặt (r1)**
  Người dùng thấy gì: Nếu đầu hồ sơ mất hết nút, phép kiểm này chưa được chứng minh là báo đỏ trên trang thật, nên nhân viên có thể gặp hồ sơ không có nút mà không ai hay.
  Căn cứ: Mất hết nút ở đầu hồ sơ sẽ lộ ngay khi dùng và các bài khác cũng đo nút này, nên rủi ro thấp và sửa không đáng công.
  file: `tests/e2e/ho-so-can.spec.ts`
  severity: low
  Đề xuất: wont-fix

## Chưa phân loại (triage-failed)

phân loại phạm vi không chạy được — không lỗi nào bị máy tự sửa, người xem lại toàn bộ

- **L4 comment now sits above the new record shadow, not the pinned-edge shadow it describes**
  file: `src/app/globals.css:9`
  severity: low
  source: conventions
  detail: The new comment and `--shadow-record-float` (lines 10-12) were inserted between the existing comment on line 9 and `--shadow-pinned-edge` (line 13). That comment explains `--shadow-pinned-edge` ("The last column pinned at the start casts this over the columns scrolling under it ... L4"). It now sits directly above a second comment and the floating-record token. Anyone reading the file will take the L4 note as describing the record shadow, and `--shadow-pinned-edge` is left with no explanation. Fix: put the new block (comment plus `--shadow-record-float`) after the `--shadow-pinned-edge` declaration, or move the L4 comment back down next to the token it explains. Only the comment is out of place; the token values and the CSS still work.

- **Bóng đổ sang lưới vẫn bị cắt: lớp overflow-visible thua style inline overflow:auto của react-resizable-panels**
  file: `src/components/candidate/record-panel.tsx:522`
  severity: high
  source: bugs
  detail: Bản sửa Q3 trông vào biến thể `[&_[data-slot=resizable-panel]>div:has(>aside)]:overflow-visible` để bóng của ngăn nổi không bị cắt. Nhưng react-resizable-panels 4.22.1 (node_modules/react-resizable-panels/dist/react-resizable-panels.js, khoảng dòng 4003-4011) dựng ô bên trong của Panel với style inline `overflow: "auto"`. Lớp Tailwind này không có `!important`, nên style inline thắng và ô ấy vẫn cắt mọi thứ vượt mép trái của `aside`. Lớp bóng mới `-12px 0 24px -10px` trong `--shadow-record-float` (globals.css) vì thế không bao giờ đổ sang lưới. Tôi đã đọc điểm ảnh trong khung bằng chứng `evidence/sau/ngan-1440-light.png`, chụp lại ở commit 603a2961 sau khi sửa: các cột x=880..919 (bên trái viền ngăn ở x=920) đều là (255,255,255) tuyệt đối, không có dải tối dần nào. Như vậy ở nền sáng ngăn vẫn không tách khỏi lưới, tức kỳ vọng mới của E18 («dải bóng tối dần đổ sang lưới ngay bên trái ngăn (nền ngăn trắng như trang)») chưa đạt. Cách sửa: dùng `!overflow-visible`, hoặc truyền `style={{ overflow: "visible" }}` cho ResizablePanel (prop style được gộp đè lên sau overflow:auto).

- **Bài kiểm Q3 chỉ đọc chuỗi box-shadow tính được nên không bắt được bóng bị cắt**
  file: `tests/e2e/khung-luoi-nut.spec.ts:228`
  severity: medium
  source: bugs
  detail: `assertSurface` chỉ dò chuỗi `getComputedStyle(aside).boxShadow` có khớp `/-\d+(\.\d+)?px 0px/` hay không. Chuỗi ấy khớp dù bóng có hiện ra thật hay bị ô bọc `overflow:auto` của Panel cắt mất, nên bài kiểm xanh trong lúc bóng đổ sang lưới vô hình (xem finding ở record-panel.tsx:522). Bài «break» mới cũng chỉ đối chứng chuỗi CSS, không đối chứng chuyện bị cắt. Bài kiểm vì thế báo đạt cho đúng cái lỗi mà nó được viết ra để chặn. Muốn bắt được thì phải đo cái thật sự hiển thị: kiểm `getComputedStyle(aside.parentElement).overflow === 'visible'` (và với mọi tổ tiên tới mép trái ngăn), hoặc lấy mẫu điểm ảnh ngay bên trái viền ngăn trong ảnh chụp.

- **Hình dạng 1 (đo chỉ dẫn thay vì đầu ra): kiểm tra bóng đổ sang lưới chỉ đọc chuỗi box-shadow đã tính, không bắt được việc bóng bị cắt**
  file: `tests/e2e/khung-luoi-nut.spec.ts:228`
  severity: high
  source: measurement
  detail: Commit 603a2961 nói lỗi ở vòng 1 là ô bên trong của ResizablePanel đã cắt mất bóng. Bản sửa là lớp `[&_[data-slot=resizable-panel]>div:has(>aside)]:overflow-visible` trong record-panel.tsx, cộng thêm token `--shadow-record-float`. Thế nhưng phép đo mới chỉ đọc `getComputedStyle(aside).boxShadow` (dòng 213 trong recordSurface) rồi cho qua regex `/-\d+(\.\d+)?px 0px/` ở dòng 228. Giá trị box-shadow tính được trên aside không đổi dù phần tử cha có overflow:hidden hay không. Vì vậy nếu bỏ lớp overflow-visible, tức là quay lại đúng lỗi vòng 1, cả hai test `popover colour, left line, shadow (light|dark)` vẫn xanh. Phép đo xác nhận khai báo CSS (chỉ dẫn) chứ không xác nhận bóng thật sự hiện trên lưới (đầu ra). Phép phá ở dòng 246-258 cũng chỉ thay khai báo box-shadow, không thử trường hợp bóng bị cắt, nên không lấp được chỗ hở này.

- **Hình dạng 3 (kiểm chuỗi có mặt trong khi lời hứa là quan hệ giữa các giá trị): regex 'độ lệch x âm' không bảo đảm có bóng tràn sang trái**
  file: `tests/e2e/khung-luoi-nut.spec.ts:228`
  severity: medium
  source: measurement
  detail: Lời hứa của Q3/E18 là bóng tràn ra ngoài mép trái của ngăn và đổ lên lưới. Đây là quan hệ giữa độ lệch x, độ nhoè, độ loang (spread) và việc có `inset` hay không. Assert ở dòng 228 chỉ kiểm có chuỗi con dạng `-Npx 0px` trong box-shadow đã tính. Các trường hợp sau vẫn qua: (a) bóng có loang âm triệt tiêu độ lệch, ví dụ `-12px 0px 0px -12px`, không tràn ra pixel nào; (b) bóng `inset`, ví dụ Chrome xuất `rgb(...) -1px 0px 0px 0px inset`, nằm bên trong ngăn; (c) bóng hắt lên trên, ví dụ `0px -4px 0px ...` chứa `-4px 0px`, vì regex không neo vào vị trí của độ lệch x. Assert này không so các giá trị với nhau để chứng minh có phần bóng nằm bên trái mép ngăn.

- **Hình dạng 6 (đo bản chụp không thuộc cây đang kiểm): E18 chấm các khung sau/ chụp trước bản sửa bóng**
  file: `_acceptance/khung-luoi-va-ngan-chi-tiet/evals.yaml:149`
  severity: high
  source: measurement
  detail: Bước mới ở dòng 149 và kỳ vọng mới ở dòng 150 yêu cầu chấm sau/ngan-1440-light.png và sau/ngan-1440-dark.png theo tiêu chí 'dải bóng tối dần đổ sang lưới ngay bên trái ngăn'. `git log` cho thấy hai tệp này chỉ được commit một lần, ở 3e3a4208 (15:26). Mốc này trước cả hai commit sửa bóng: 603a2961 (thêm overflow-visible và --shadow-record-float) và 2bef2d59 (bóng đen ở cả hai nền). Từ 3e3a4208 đến HEAD, src/ có đổi ở globals.css, record-panel.tsx, data-region.tsx và save-view-buttons.tsx, nhưng thư mục sau/ không được chụp lại. Hơn nữa không script nào trong repo sinh lại các khung này: không có tệp .ts, .sh hay .py nào tham chiếu tới ngan-1440. Hệ quả là người chấm E18 nhìn ảnh của mã trước bản sửa, không phải cây đang kiểm. Phép đối chứng đỏ (pha/*-khong-tach.png) cũng đem so với những khung cũ đó.

## Chưa adversarial-verify (refuter chết)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
