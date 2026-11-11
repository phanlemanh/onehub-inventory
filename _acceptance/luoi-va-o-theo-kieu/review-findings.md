# Review findings: luoi-va-o-theo-kieu (round 2)

## Trong hợp đồng

- **AC-3: long text cannot be read in full on focus, and no test checks it**
  file: src/components/candidate/typed-cell.tsx:40
  severity: medium
  AC: AC-3
  detail: AC-3 says long text is cut with an ellipsis and can be read in full 'khi rê chuột hay đưa tiêu điểm vào' (on hover or on focus). Text cells only get a truncate class and a title (lines 40-42). The span cannot take focus, and browsers do not show a title tooltip on keyboard focus, so a sighted keyboard user cannot read the hidden part. E3 and tests/grid.test.tsx:216-220 only check that the truncate class and the title exist, so this half of the criterion is not tested. Fix: make the cell focusable and show the full text on focus (a tooltip or expand-on-focus), and add a test that focuses the cell and sees the full text. Alternatively, narrow AC-3 to hover in the contract and record a descope.
  source: invariants

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Product invariants SP-1 / SP-3 / SP-4: no violation (checked, no action needed)**
  Người dùng thấy gì: Không có vấn đề nào cần xử lý. Đây chỉ là ghi nhận rằng các quy tắc sản phẩm cốt lõi vẫn được giữ.
  Căn cứ: Đây không phải lỗi nên người dùng không bị ảnh hưởng gì, không có gì để sửa.
  file: `PRODUCT-INVARIANTS.md`
  severity: low
  Đề xuất: wont-fix
- **Invariant scan record (luat-cham.json) stops one commit short of HEAD**
  Người dùng thấy gì: Bản ghi kiểm tra quy tắc sản phẩm chưa phủ lần sửa cuối cùng, dù kiểm lại tay thì không có vi phạm. Người dùng không thấy ảnh hưởng.
  Căn cứ: Không ảnh hưởng người dùng, kết luận kiểm tay vẫn đúng, và chạy lại quét là việc rẻ nhưng chỉ là giấy tờ.
  file: `_acceptance/luoi-va-o-theo-kieu/luat-cham.json`
  severity: low
  Đề xuất: known-limits
- **Error state: region header still shows a row count and a search box**
  Người dùng thấy gì: Khi vùng bị lỗi tải, đầu vùng vẫn hiện số dòng và ô tìm phía trên thông báo lỗi, có thể khiến người xem tưởng vùng đang trống hoặc có dữ liệu.
  Căn cứ: Gây nhầm lẫn nhẹ nhưng thông báo lỗi và nút Thử lại vẫn hiện rõ, người dùng tự thử lại được và không mất dữ liệu.
  file: `src/components/candidate/data-region.tsx`
  severity: low
  Đề xuất: known-limits
- **AGENTS.md product language: column and button names written directly in the prototype**
  Người dùng thấy gì: Một số tên cột và nút trên trang mẫu dành cho người phát triển được viết cứng, nhân viên sàn không nhìn thấy trang này.
  Căn cứ: Trang chỉ dành cho người phát triển, không tới tay nhân viên, và sẽ được sửa đúng chỗ khi Lưới lên Bảng hàng.
  file: `src/app/(app)/proto/[slug]/grid-showcase.tsx`
  severity: low
  Đề xuất: known-limits
- **AC-9 / a11y: lock reason is announced twice**
  Người dùng thấy gì: Với một số trình đọc màn hình, lý do khoá ô có thể bị đọc lặp hai lần cho người khiếm thị.
  Căn cứ: Chỉ gây phiền nhẹ, thông tin vẫn đầy đủ và đúng, không mất hay lộ dữ liệu.
  file: `src/components/candidate/typed-cell.tsx`
  severity: low
  Đề xuất: known-limits
- **Loading-state test samples forever with no exit; its control now checks a different function**
  Người dùng thấy gì: Bài kiểm tự động cho trạng thái đang tải có thể treo tới hết giờ thay vì báo lỗi rõ ràng, và ca đối chứng không còn chứng minh được nó đỏ được. Người dùng cuối không thấy gì.
  Căn cứ: Chỉ ảnh hưởng người làm sản phẩm khi kiểm thử, không ảnh hưởng người dùng, và sửa rẻ khi có dịp.
  file: `tests/e2e/grid.spec.ts`
  severity: low
  Đề xuất: known-limits
- **The general empty-state reason claims a cause that can be false, e.g. a partial load with zero rows**
  Người dùng thấy gì: Trong trường hợp hiếm khi vùng tải hỏng một phần mà không có dòng nào, màn có thể nói sai rằng chưa ai nhập dữ liệu trong khi dữ liệu có nhưng chưa tải được.
  Căn cứ: Hiếm gặp, có banner báo phần chưa tải kèm Thử lại bên cạnh, người dùng tải lại là xong, không mất dữ liệu.
  file: `src/components/candidate/region-state.tsx`
  severity: low
  Đề xuất: known-limits
- **Hình dạng 4: đối chứng của ca khung chờ thử một bộ kiểm mà ca chính không còn dùng, và phép đo mới không có thông điệp ghim**
  Người dùng thấy gì: Bài kiểm tự động cho trạng thái đang tải chưa chứng minh được là nó sẽ báo đỏ đúng lúc khi lỗi xảy ra. Người dùng cuối không thấy ảnh hưởng.
  Căn cứ: Chỉ làm lưới an toàn kiểm thử yếu đi, không tác động người dùng, sửa rẻ và an toàn.
  file: `tests/e2e/grid.spec.ts`
  severity: medium
  Đề xuất: known-limits
- **Hình dạng 3: lời hứa 'còn đúng các dòng khớp' là quan hệ giữa hai tập, nhưng phép đo chỉ kiểm một chiều**
  Người dùng thấy gì: Bài kiểm tự động cho ô tìm chưa bắt được trường hợp tìm bỏ sót bớt dòng đúng; nếu lỗi như vậy xảy ra, nhân viên có thể thấy thiếu dòng mà test không báo.
  Căn cứ: Hiện chưa có lỗi thật, chỉ là lưới kiểm thử hở một chiều; nhân viên tự xoá lọc để thấy đủ dòng, và bổ sung kiểm thử rẻ.
  file: `tests/e2e/grid.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **AGENTS.md / .claude/rules/ui.md: không viết nhãn cứng, phải dùng label() (r1)**
  Người dùng thấy gì: Một số tên cột và nút trên trang mẫu dành cho người phát triển được viết cứng, nên sau này đổi tên khái niệm có thể bị lệch. Nhân viên sàn chưa thấy trang này.
  Căn cứ: Chỉ ảnh hưởng trang mẫu nội bộ, không mất dữ liệu, sửa sau rẻ khi nối màn thật ở hàng 2.
  file: `src/app/(app)/proto/[slug]/grid-showcase.tsx`
  severity: medium
  Đề xuất: known-limits

- **AC-8 forbidden: vẫn hiện nút chính của vùng cho người không đủ quyền (r1 · tệp đã đổi)**
  Người dùng thấy gì: Người không có quyền xem một vùng vẫn thấy nút làm việc như «Thêm dòng» trên vùng đó. Dữ liệu không lộ, nhưng gây hiểu nhầm.
  Căn cứ: Không lộ dữ liệu, nút chưa nối việc thật ở vòng này, và sửa sau rất rẻ.
  file: `src/components/candidate/data-region.tsx`
  severity: medium
  Đề xuất: known-limits

- **Design: đầu vùng vẫn hiện số dòng và ô tìm khi vùng đang ở trạng thái lỗi (r1 · tệp đã đổi)**
  Người dùng thấy gì: Khi vùng báo lỗi tải, đầu vùng vẫn ghi số dòng và có ô tìm, nói ngược với thân vùng.
  Căn cứ: Chỉ gây bối rối nhẹ, không mất dữ liệu, người dùng bấm Thử lại là qua, sửa sau rẻ.
  file: `src/components/candidate/data-region.tsx`
  severity: low
  Đề xuất: known-limits

- **Domain: một luật ở một chỗ, danh sách kiểu chữ và kiểu giao dịch bị viết lại (r1 · tệp đã đổi)**
  Người dùng thấy gì: Hai danh sách giống nhau được viết ở hai nơi, nên sau này sửa một nơi có thể quên nơi kia và hai ô hiển thị lệch nhau.
  Căn cứ: Hiện chưa gây lỗi nào người dùng thấy; rủi ro chỉ xuất hiện khi sửa sau, sửa rẻ.
  file: `src/components/candidate/typed-cell.tsx`
  severity: low
  Đề xuất: known-limits

- **Records: hồ sơ nghiệm thu ghi đường dẫn tạm của máy cá nhân (r1)**
  Người dùng thấy gì: Hồ sơ nghiệm thu ghi một đường dẫn tạm của máy cá nhân, người khác không lần lại được. Người dùng sản phẩm không bị ảnh hưởng.
  Căn cứ: Không ảnh hưởng người dùng và không lộ dữ liệu khách; chi phí sửa nhỏ nhưng lợi ích gần bằng không.
  file: `_acceptance/luoi-va-o-theo-kieu/design-floor.json`
  severity: low
  Đề xuất: wont-fix

- **«Thử lại» silently does nothing when the screen does not pass onRetry (r1 · tệp đã đổi)**
  Người dùng thấy gì: Nếu một màn quên nối việc tải lại, nút «Thử lại» sẽ bấm không có tác dụng gì mà không báo lỗi.
  Căn cứ: Chưa có màn thật nào dùng, người dùng tải lại trang được, và sửa sớm khi nối màn đầu tiên rẻ.
  file: `src/components/candidate/data-region.tsx`
  severity: medium
  Đề xuất: known-limits

- **Error state still shows a row count and a working search box (r1 · tệp đã đổi)**
  Người dùng thấy gì: Khi tải lỗi, đầu vùng có thể ghi «0 dòng» như thể vùng thật sự trống, và ô tìm vẫn gõ được mà không có tác dụng.
  Căn cứ: Gây hiểu nhầm nhẹ, không mất dữ liệu, bấm Thử lại là qua, sửa rẻ.
  file: `src/components/candidate/data-region.tsx`
  severity: low
  Đề xuất: known-limits

- **E2E «error explains and retries» may click «Thử lại» before hydration (r1 · tệp đã đổi)**
  Người dùng thấy gì: Một bài kiểm tự động có thể thỉnh thoảng đỏ giả khi máy chậm. Người dùng sản phẩm không bị ảnh hưởng.
  Căn cứ: Chỉ gây nhiễu cho đội phát triển, không ảnh hưởng người dùng, chạy lại là qua.
  file: `tests/e2e/grid.spec.ts`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 2/10 lỗi rơi vào file không bộ đo nào phủ (PRODUCT-INVARIANTS.md, _acceptance/luoi-va-o-theo-kieu/luat-cham.json) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
