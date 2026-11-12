## Trong hợp đồng

- **Floating record's top and bottom are measured once and go stale when the page scrolls**
  AC: AC-2
  file: `src/components/candidate/record-panel.tsx:211`
  severity: medium
  source: bugs
  detail: useWorkAreaBounds re-measures only on ResizeObserver(documentElement), window resize and fullscreenchange. It never re-measures on scroll. The panel is position:fixed, but the values it copies are viewport positions that change as the document scrolls. The document is the scroll container here (SidebarProvider is min-h-svh, SidebarInset has no overflow), and the top bar is `sticky top-0` inside an inset that has an 8px top margin from md up. Opened at scrollY=0, barRect.bottom is 56. Once the user scrolls, the bar sticks at 0..48, but the panel keeps top=56, so an 8px strip of grid rows shows above it. Opened while scrolled, top is 48; scrolling back to the top puts the bar at 8..56, and the panel (z-50, above the bar's z-20) covers the bottom 8px of the top bar, which the spec says must never happen ('record covers the top bar'). The bottom inset has the same problem: opened at the end of the page, bottom becomes 8, and after scrolling up an 8px gap remains. The e2e geometry check (assertFloat) only measures without scrolling, so this never shows up. The 'top bar hidden' test even resizes the viewport by 1px to force a re-measure, which shows that hiding the bar inside the app also does not trigger one. Fix: also listen to scroll (passive) on window, or observe the top bar and work area elements themselves.
  rationale: AC-2 đòi mép trên hồ sơ sát đáy thanh trên, mép dưới sát đáy màn hình và thanh trên không bị che; cuộn trang làm hồ sơ che 8px thanh trên hoặc để hở dải bảng.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Comment on RecordPanel contradicts decision 0024 and the code: it says the panel sits below the region's toolbar**
  Người dùng thấy gì: Người dùng không thấy gì khác: hồ sơ vẫn nổi đúng chỗ. Chỉ có người đọc mã sau này có thể hiểu sai cách đặt ngăn.
  Căn cứ: Không ảnh hưởng người dùng và không mất dữ liệu; sửa một dòng chú thích bất cứ lúc nào, nên ghi nhận và không mở việc riêng.
  file: `src/components/candidate/record-panel.tsx`
  severity: low
  Đề xuất: wont-fix

- **Leftover wrapper data-region-stage (relative) that nothing uses**
  Người dùng thấy gì: Người dùng không thấy khác biệt nào; chỉ có thêm một lớp bọc thừa trong mã của bảng.
  Căn cứ: Không có hậu quả nhìn thấy được và không mất dữ liệu; dọn sau rất rẻ khi chạm lại bảng này.
  file: `src/components/candidate/data-region.tsx`
  severity: low
  Đề xuất: wont-fix

- **aria-label on a role-less span: the price label is never announced**
  Người dùng thấy gì: Người dùng đọc màn hình sẽ nghe giá chỉ là một con số, không có chữ «Giá chào» đi kèm. Người nhìn màn hình không bị ảnh hưởng.
  Căn cứ: Ảnh hưởng nhẹ, chỉ với người dùng trình đọc màn hình, không mất dữ liệu và các thông tin khác trong thẻ vẫn có nhãn; sửa sau không đắt nên ghi thành hạn chế đã biết.
  file: `src/modules/listings/ui/listing-record.tsx`
  severity: low
  Đề xuất: known-limits

- **Shape 3 (checks that a string is present when the promise is a relation): the phone card's unit, price and place are only checked as not empty, never against the unit that was opened**
  Người dùng thấy gì: Nếu sau này thẻ căn trên điện thoại hiện nhầm căn khác, bài kiểm tự động hiện tại có thể không bắt được. Hôm nay người dùng không thấy lỗi nào.
  Căn cứ: Hôm nay không có hậu quả với người dùng; rủi ro chỉ là lỗi tương lai lọt qua kiểm thử, và có thể siết bài kiểm bất cứ lúc nào mà không đụng đến sản phẩm.
  file: `tests/e2e/ho-so-can.spec.ts`
  severity: medium
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
