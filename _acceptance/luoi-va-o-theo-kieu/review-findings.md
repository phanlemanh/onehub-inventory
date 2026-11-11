# Review findings: luoi-va-o-theo-kieu (round 1)

## Trong hợp đồng

- **Criteria and tests: AC-2 (đầu cột và ô cùng canh lề) không có bài kiểm mà E2 hứa**
  file: `tests/grid.test.tsx:127`
  severity: medium
  AC: AC-2
  source: invariants
  detail: evals.yaml E2 đòi dựng Lưới thật với hai cột Listing.listPrice, Listing.closePrice và hai cột chữ, kiểm đầu cột và ô cùng canh lề theo cặp, kèm ca đối chứng có thông điệp 'alignment drift: <cột>'. Trong tests/ không có chuỗi 'alignment drift' và không bài kiểm nào đọc canh lề của th/td trên DOM đã dựng. Khối 'column rules' chỉ kiểm alignFor(kind) và chặn kiểu tham số bằng @ts-expect-error. Bỏ meta.headerClassName/cellClassName ở data-region.tsx:136-137 thì không bài kiểm nào đỏ. Cách sửa: thêm ca DataRegion dựng 4 cột, so lớp hoặc text-align của th với td từng cột, thêm ca đối chứng 'alignment drift: <cột>'.

- **AC-9: lý do khoá ô chỉ nằm trong aria-description trên một span thường, trình đọc màn hình có thể không đọc**
  file: `src/components/candidate/typed-cell.tsx:75`
  severity: medium
  AC: AC-9
  source: invariants
  detail: Lý do khoá chỉ có ở title và aria-description của span data-slot=typed-cell. Span không có role và không nhận tiêu điểm, LockIcon thì aria-hidden (dòng 79-80). aria-description còn là thuộc tính nháp của ARIA 1.3, nhiều trình đọc bỏ qua trên phần tử generic. AC-9 chưa chắc đạt; E9 chỉ kiểm thuộc tính có mặt chứ không kiểm cây trợ năng. Cách sửa: thêm span sr-only chứa '{lockedPrefix}: {lý do}' hoặc gắn tên trợ năng cho biểu tượng khoá (role=img, aria-label).

- **Unit test: the check after pressing «Xoá lọc» passes even when the filter is not cleared**
  file: `tests/grid.test.tsx:441`
  severity: medium
  AC: AC-6
  source: bugs
  detail: After searching "khong-co", the header reads "0 / 2 dòng". After clicking «Xoá lọc» the test only checks `expect(container.textContent).toContain("2 dòng")`, and "0 / 2 dòng" already contains "2 dòng", so the test passes even if onClear does nothing. Fix: check the count equals exactly "2 dòng" (region-count text), or check tbody tr count = 2 and that no-match is gone.

- **E2E: the «Xoá lọc» test checks a substring that already matches before the click**
  file: `tests/e2e/grid.spec.ts:90`
  severity: medium
  AC: AC-6
  source: bugs
  detail: Playwright getByText(string) matches a case-insensitive substring. Before the click the no-match header reads "0 / 120 dòng", which contains "120 dòng", so the assertion after clicking passes even if the button does not clear the search. E6 ("bấm thì đủ dòng") is effectively unverified. Line 74 has the same weakness. Fix: use `{ exact: true }` or `toHaveText("120 dòng")` on `[data-slot="region-count"]`, and check body rows reappear and no-match is gone.

- **Hình dạng 3 (đo có mặt thay vì quan hệ): canh lề cặp đầu cột–ô của AC-2 không được đo, ca đối chứng 'alignment drift' mà E2 khai không tồn tại**
  file: `tests/grid.test.tsx:153`
  severity: high
  AC: AC-2
  source: measurement
  detail: Ca duy nhất về canh lề là 'aligns money, area and count right and every other kind left' (khoảng dòng 153-157), chỉ gọi hàm thuần alignFor(kind). Không ca nào dựng DataRegion với closePrice hay so canh lề th với td trên DOM; 'alignment drift' và 'closePrice' không xuất hiện trong tests/. Phép đo chỉ chạm luật, không chạm đầu ra. Chú thích trong data-grid-table.tsx (khoảng dòng 1656) nói đầu cột canh cuối cần thêm `[&>div]:w-full` mới dịch sang phải, nên đầu cột có thể lệch khỏi ô mà bộ kiểm vẫn xanh. Evidence E2 báo một ca không có thật.

- **Hình dạng 3 (đo có mặt thay vì quan hệ): ca tìm kiếm e2e không kiểm 'chỉ còn đúng các dòng khớp' và số đếm bằng số dòng khớp**
  file: `tests/e2e/grid.spec.ts:71`
  severity: high
  AC: AC-6
  source: measurement
  detail: Ca gõ 'S1.01' rồi chỉ kiểm: dòng đầu chứa chuỗi, số đếm dạng `^\d+ / 120 dòng$`, shown > 0, shown < TOTAL. E6/AC-6 hứa 'còn đúng các dòng khớp và số dòng là <khớp> / <tổng>'. Theo grid-showcase.tsx, tập khớp với 'S1.01' là i%15==0, tức 8 dòng. Bộ lọc vẫn qua ca này khi để lọt dòng không khớp (miễn dòng đầu khớp), đếm sai (ví dụ 50 / 120), hoặc số đếm khác số dòng thân bảng. Ca không đối chiếu mọi dòng với needle, không đối chiếu shown với bodyRows().count() hay với 8.

- **Hình dạng 3 (đo có mặt thay vì quan hệ): ca khung chờ không đo mốc thời gian 500 ms và 1 giây mà E8 hứa**
  file: `tests/e2e/grid.spec.ts:100`
  severity: medium
  AC: AC-8
  source: measurement
  detail: E8 hứa khung chờ 'ở 500 ms có visibility hidden, từ 1 giây hiện'. Ca gọi assertSkeletonHiddenEarly ngay khi phần tử vừa attached (gần 0 ms), sau đó `toBeVisible({ timeout: 3000 })`, nên nhận cả độ trễ 100 ms lẫn 2,9 giây. Ca đối chứng chỉ bắt trường hợp gỡ hẳn lớp trễ; đổi độ trễ sang giá trị sai vẫn xanh.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **AGENTS.md / .claude/rules/ui.md: không viết nhãn cứng, phải dùng label()**
  Người dùng thấy gì: Một số tên cột và nút trên trang mẫu dành cho người phát triển được viết cứng, nên sau này đổi tên khái niệm có thể bị lệch. Nhân viên sàn chưa thấy trang này.
  Căn cứ: Chỉ ảnh hưởng trang mẫu nội bộ, không mất dữ liệu, sửa sau rẻ khi nối màn thật ở hàng 2.
  file: `src/app/(app)/proto/[slug]/grid-showcase.tsx`
  severity: medium
  Đề xuất: known-limits

- **AC-8 forbidden: vẫn hiện nút chính của vùng cho người không đủ quyền**
  Người dùng thấy gì: Người không có quyền xem một vùng vẫn thấy nút làm việc như «Thêm dòng» trên vùng đó. Dữ liệu không lộ, nhưng gây hiểu nhầm.
  Căn cứ: Không lộ dữ liệu, nút chưa nối việc thật ở vòng này, và sửa sau rất rẻ.
  file: `src/components/candidate/data-region.tsx`
  severity: medium
  Đề xuất: known-limits

- **Design: đầu vùng vẫn hiện số dòng và ô tìm khi vùng đang ở trạng thái lỗi**
  Người dùng thấy gì: Khi vùng báo lỗi tải, đầu vùng vẫn ghi số dòng và có ô tìm, nói ngược với thân vùng.
  Căn cứ: Chỉ gây bối rối nhẹ, không mất dữ liệu, người dùng bấm Thử lại là qua, sửa rẻ.
  file: `src/components/candidate/data-region.tsx`
  severity: low
  Đề xuất: known-limits

- **Domain: một luật ở một chỗ, danh sách kiểu chữ và kiểu giao dịch bị viết lại**
  Người dùng thấy gì: Hai danh sách giống nhau được viết ở hai nơi, nên sau này sửa một nơi có thể quên nơi kia và hai ô hiển thị lệch nhau.
  Căn cứ: Hiện chưa gây lỗi nào người dùng thấy; rủi ro chỉ xuất hiện khi sửa sau, sửa rẻ.
  file: `src/components/candidate/typed-cell.tsx`
  severity: low
  Đề xuất: known-limits

- **Records: hồ sơ nghiệm thu ghi đường dẫn tạm của máy cá nhân**
  Người dùng thấy gì: Hồ sơ nghiệm thu ghi một đường dẫn tạm của máy cá nhân, người khác không lần lại được. Người dùng sản phẩm không bị ảnh hưởng.
  Căn cứ: Không ảnh hưởng người dùng và không lộ dữ liệu khách; chi phí sửa nhỏ nhưng lợi ích gần bằng không.
  file: `_acceptance/luoi-va-o-theo-kieu/design-floor.json`
  severity: low
  Đề xuất: wont-fix

- **«Thử lại» silently does nothing when the screen does not pass onRetry**
  Người dùng thấy gì: Nếu một màn quên nối việc tải lại, nút «Thử lại» sẽ bấm không có tác dụng gì mà không báo lỗi.
  Căn cứ: Chưa có màn thật nào dùng, người dùng tải lại trang được, và sửa sớm khi nối màn đầu tiên rẻ.
  file: `src/components/candidate/data-region.tsx`
  severity: medium
  Đề xuất: known-limits

- **Error state still shows a row count and a working search box**
  Người dùng thấy gì: Khi tải lỗi, đầu vùng có thể ghi «0 dòng» như thể vùng thật sự trống, và ô tìm vẫn gõ được mà không có tác dụng.
  Căn cứ: Gây hiểu nhầm nhẹ, không mất dữ liệu, bấm Thử lại là qua, sửa rẻ.
  file: `src/components/candidate/data-region.tsx`
  severity: low
  Đề xuất: known-limits

- **E2E «error explains and retries» may click «Thử lại» before hydration**
  Người dùng thấy gì: Một bài kiểm tự động có thể thỉnh thoảng đỏ giả khi máy chậm. Người dùng sản phẩm không bị ảnh hưởng.
  Căn cứ: Chỉ gây nhiễu cho đội phát triển, không ảnh hưởng người dùng, chạy lại là qua.
  file: `tests/e2e/grid.spec.ts`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
