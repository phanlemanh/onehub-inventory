# Review findings — ngan-chi-tiet-ghim-thanh-cot (round 2)

## Trong hợp đồng

- **Criteria and tests: AC-7 (Esc in a cell being edited) has no test**
  file: `tests/e2e/ghim-ngan.spec.ts:515`
  severity: medium
  AC: AC-7
  source: invariants
  detail: AC-7 says Esc in a cell being edited must not close the pinned record and must only cancel the edit. The test 'Esc in the record closes it; Esc in the grid does not' and its break case only click a cell to select it and press Escape (assertEscFromGridKeepsPin(page, "o dang chon")). No test opens a cell editor, presses Esc, and checks both that the edit is cancelled and that data-record-layout stays "pinned". Fix: add a case that starts editing a cell (price or status, row 4), presses Escape, and checks the old value is back and the record is still pinned, with a break case.

- **Hình dạng 4 (âm tính một mình, thông điệp không được ghim): ca đối chứng Esc của E8 gọi một bản chép tay của phép kiểm, không gọi phép kiểm thật**
  file: `tests/e2e/ghim-ngan.spec.ts:562`
  severity: high
  AC: AC-7
  source: measurement
  detail: Phép kiểm thật là assertEscFromGridKeepsPin (dòng 495-499), và nó gọi panel(page).getAttribute(...). Khi hồ sơ đã đóng, phần tử không còn nên getAttribute chờ đến hết giờ rồi báo lỗi hết giờ của Playwright. Nó không bao giờ ném 'pinned record closed from grid'. Ca đối chứng ở dòng 562-567 không gọi assertEscFromGridKeepsPin. Nó dùng một hàm async viết ngay tại chỗ (if panel.count()===0 throw ...), rồi khẳng định hàm này ném đúng thông điệp nó vừa tự viết. Vì vậy ca đối chứng không chứng minh phép kiểm thật bắt được lỗi 'nghe Esc trên cả trang', và thông điệp mà evals.yaml E8 hứa cũng không gắn với phép kiểm thật. Ca dương (dòng 533) chỉ đúng nhờ hồ sơ còn mở. Nếu có lỗi thật, ta sẽ thấy lỗi hết giờ chứ không thấy thông điệp đã ghim.

- **Hình dạng 2 (fixture viết tay): ca đối chứng E5 đưa con số 200 viết tay vào assertWidthBounds thay vì bề rộng đo trên trang**
  file: `tests/e2e/ghim-ngan.spec.ts:443`
  severity: high
  AC: AC-5
  source: measurement
  detail: Ca 'break: a column narrower than 320 px is caught' có chèn CSS làm hẹp cột thật. Nhưng phép kiểm được gọi là assertWidthBounds(200, area), với 200 là hằng viết tay, không phải (await columnBox(page)).width. Vậy thông điệp 'pinned column narrower than 320' được chứng minh trên một giá trị đúng khuôn mà bên kiểm chờ, không phải trên đầu ra thật của trang. Dòng 444 đo trang thật bằng một expect riêng nên không chạy qua phép kiểm. Thêm nữa, ca dương E5 (dòng 419) chỉ gọi assertWidthBounds sau khi kéo hết cỡ sang trái, không gọi sau khi kéo hết cỡ sang phải (dòng 416). Vậy cận 320 của phép kiểm không lần nào được áp lên một bề rộng đo thật.

- **Hình dạng 4 (âm tính một mình): ở khung 768 cả hai vế đều chỉ khẳng định 'không có nút ghim', thiếu vế dương mà eval E1 hứa**
  file: `tests/e2e/ghim-ngan.spec.ts:153`
  severity: high
  AC: AC-1
  source: measurement
  detail: evals.yaml E1 hứa: ở 768x1024, cột thứ hai mở thì không có nút; gập cột thứ hai (vùng làm việc từ 800 px) thì CÓ nút, và sau khi ghim 320 ≤ bề rộng cột ≤ vùng − 480. Vòng for (dòng 153-161) chạy cả open='1' lẫn open='0', và vế nào cũng khẳng định area < 800, pinButton toHaveCount(0), layout=float. Không có vế nào đối chứng rằng nút xuất hiện khi vùng đủ rộng, cũng không có bài nào đo quan hệ 320 ≤ cột ≤ vùng − 480 ở khung này. Nếu nút ghim bị ẩn ở mọi khổ dưới 1024, bài này vẫn xanh.

- **Hình dạng 4 (âm tính một mình): E8 quét axe và đòi kết quả rỗng, nhưng thiếu ca đối chứng dương mà eval yêu cầu**
  file: `tests/e2e/ghim-ngan.spec.ts:509`
  severity: medium
  AC: AC-7
  source: measurement
  detail: expect(await seriousViolations(page)).toEqual([]) là khẳng định âm tính. evals.yaml E8 đòi thêm 'ca đối chứng bản dựng bỏ tên vạch chia cho vi phạm axe tên luật', nhưng spec không có ca này. Vậy chưa có gì chứng minh lần quét (với các tag và vùng loại trừ đã chọn) thực sự bắt được vi phạm trên vạch chia. Eval E8 cũng hứa vế 'ô Giá chào đang sửa, Escape thì ô thôi sửa và hồ sơ vẫn pinned', và spec cũng không có vế này.

- **Hình dạng 4 (âm tính một mình): nhánh 'pinned column still floats' của assertRoomMade không có ca đối chứng**
  file: `tests/e2e/ghim-ngan.spec.ts:173`
  severity: medium
  AC: AC-2
  source: measurement
  detail: Phần kiểm 'không bóng nổi' đọc computed boxShadow bằng regex /(rgba?\([^)]*\))\s+(-?[\d.]+)px.../ rồi đòi floats === false. Các ca đối chứng của E2 chỉ phá 'region under pinned column' và 'columns hidden on pin'. Không ca nào gắn một bóng đổ thật lên cột ghim để xem thông điệp 'pinned column still floats' có ném ra không. Nếu màu bóng được trình duyệt trả về ở dạng mà regex không khớp (chẳng hạn oklch/color()), floats sẽ luôn là false và khẳng định âm này trôi qua mà không đo gì.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Records: decision 0024 not updated after the floating record moved below the region toolbar**
  Người dùng thấy gì: Tài liệu quyết định cũ vẫn mô tả ngăn nổi nằm sát thanh trên, trong khi thực tế nó nằm dưới thanh công cụ của vùng. Người dùng không thấy gì, chỉ người đọc tài liệu sau này bị hiểu sai.
  Căn cứ: Không ảnh hưởng người dùng và không mất dữ liệu; sửa một đoạn tài liệu rất rẻ và làm sau được.
  file: `wiki/decisions/0024-ngan-noi-xem-chi-tiet.md`
  severity: medium
  Đề xuất: known-limits

- **Criteria and tests: AC-6 unit check cannot fail**
  Người dùng thấy gì: Một bài kiểm nhỏ về cookie ghim luôn xanh nên không có giá trị, nhưng bài kiểm trên trình duyệt thật vẫn bắt lỗi nếu cookie mang dữ liệu căn.
  Căn cứ: Người dùng không bị ảnh hưởng vì phép kiểm thật đã phủ việc này; sửa tốn công mà lợi ích rất nhỏ.
  file: `src/components/candidate/record-pin.ts`
  severity: low
  Đề xuất: wont-fix

- **Design: record-panel imports the resizable library directly instead of through the ui wrapper**
  Người dùng thấy gì: Không ảnh hưởng gì khi dùng; chỉ làm việc nâng cấp thư viện kéo đổi rộng sau này khó gom hơn một chút.
  Căn cứ: Người dùng không thấy hậu quả, không mất dữ liệu; có thể dọn sau với chi phí thấp.
  file: `src/components/candidate/record-panel.tsx`
  severity: low
  Đề xuất: known-limits

- **Work-area bounds (left/width) go stale when the App Shell column opens or closes, so the pinned column and the pin button run on an old width**
  Người dùng thấy gì: Khi đang ghim mà mở hay đóng cột bên của App Shell, cột hồ sơ có thể rộng quá mức cho phép và bảng bị hẹp hơn dự kiến, nút Ghim có thể hiện sai lúc vùng đã quá hẹp.
  Căn cứ: Bảng vẫn dùng được và không mất dữ liệu; tải lại trang hoặc kéo vạch sẽ sửa lại, nhưng lỗi lộ ra với thao tác khá thường gặp nên nên xử lý trong một việc riêng.
  file: `src/components/candidate/record-panel.tsx`
  severity: medium
  Đề xuất: new-contract

- **The floating record's size limits now come from the work area, so it can be narrower than its old 320 px floor and minSize conflicts with maxSize**
  Người dùng thấy gì: Ở cửa sổ hẹp khi cột bên mở, ngăn hồ sơ nổi có thể hẹp hơn mức trước đây, đọc hơi chật hơn.
  Căn cứ: Chỉ xảy ra ở khổ hẹp, vẫn đọc và thao tác được, không mất dữ liệu; đóng cột bên là hết.
  file: `src/components/candidate/record-panel.tsx`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
