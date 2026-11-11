## Trong hợp đồng

- **Behaviour guard matches only the exact '@/' spelling, so a relative import of record-panel or region-state slips through**
  file: tests/behavior-guard.test.ts:83
  severity: medium
  AC: AC-9
  source: conventions
  detail: This round added '@/components/candidate/record-panel' and '@/components/candidate/region-state' to FORBIDDEN to close the round-1 hole where a screen could import them directly. But rebuiltBehaviour compares with `FORBIDDEN.find((f) => f.spec === spec)`, an exact string match. A screen under src/app or src/modules/*/ui that writes `import { RecordPanel } from "../../../components/candidate/record-panel"`, or adds a '.tsx' suffix, passes the guard. AGENTS.md says the repo's boundary checks cover 'relative imports and @/ imports alike' (tools/boundaries.py), so this guard is weaker than the repo's own pattern. The hole the commit claims to close is still open. The re-export case added this round only tests the '@/' spelling.

- **Confirmed changes silently swallow every error, including the new FieldError**
  file: src/components/candidate/use-change.tsx:103
  severity: high
  AC: AC-8
  source: bugs
  detail: This round says a FieldError goes down the `field` channel and is handed back to the screen, which then shows it at the field. That only holds when the change runs at once. When a change needs confirmation, `close(true)` runs `void apply(change).then(resolve, () => resolve(false))`, and the rejection handler drops the error. The screen gets `false` and never sees the FieldError or its `channel`. `notify("field", ...)` returns 'inline' and shows nothing by itself, so the field message is lost with no toast, banner or inline text. Any other online save error from a confirmed change (server 500 and so on) is lost the same way; nothing reports it, although saveWithBanner says other failures are 'the caller's to report'. Result: an irreversible or leaves-the-company change that fails after the person presses confirm just closes the dialog with no feedback. The new test only covers the run-at-once path (reversible, inside the company), so this path has no test.

- **Hình dạng 5 — tuyên chặn mọi cách màn nhập nguồn bị cấm, nhưng chỉ thử một dạng viết đường dẫn (bí danh @/), nên nhập bằng đường tương đối lọt qua**
  file: tests/behavior-guard.test.ts:85
  severity: medium
  AC: AC-9
  source: measurement
  detail: rebuiltBehaviour so khớp bằng `FORBIDDEN.find((f) => f.spec === spec)`, tức là phải trùng nguyên văn chuỗi `@/components/candidate/record-panel`, `@/components/ui/sheet`, v.v. Ca phá 'a screen importing any forbidden source turns the guard red' (dòng ~104-140) và ca tái xuất mới thêm đều chỉ viết đúng dạng bí danh `@/…`. Không có ca nào thử dạng tương đối (ví dụ `../../components/candidate/region-state` từ src/app/x/page.tsx), dạng có đuôi `.tsx`, hay dạng `@/components/candidate/record-panel/index`. Một tệp màn nhập RecordPanel hoặc RegionError bằng đường tương đối sẽ không bị bắt mà bài kiểm vẫn xanh. Cũng không có bộ kiểm nào khác chặn các dạng này: tools/*.py không nhắc tới components/ui hay components/candidate. AGENTS.md nói rõ ranh giới phải đúng cho cả 'relative imports and @/ imports alike'. Ma trận 13 ca hiện chỉ là ma trận theo tên nguồn, chưa phải theo các dạng nhập, nên lời hứa 'tệp màn không nhập thẳng khung hồ sơ hay khối trạng thái' (luật 'Dựng ở đâu' trong design/behaviors.md, eval E9) chỉ được đo trên một dạng viết.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Test title still says 11 forbidden sources, but the test now asserts 13**
  Người dùng thấy gì: Báo cáo kiểm thử ghi sai con số trong tên một bài kiểm, nhưng nhân viên sàn không thấy gì và chức năng không bị ảnh hưởng.
  Căn cứ: Chỉ sai chữ trong báo cáo nội bộ, không ảnh hưởng người dùng và không mất dữ liệu; sửa lúc nào cũng rẻ nhưng không đáng mở việc riêng.
  file: `tests/behavior-guard.test.ts`
  severity: low
  Đề xuất: wont-fix

- **New FieldError class in use-change clashes with the existing FieldError component in ui/field**
  Người dùng thấy gì: Người dùng cuối không thấy gì khác; chỉ là người làm màn sau này dễ nhầm hai thứ cùng tên khi nối báo lỗi ở trường.
  Căn cứ: Không ảnh hưởng người dùng cuối hay dữ liệu; chỉ gây nhầm cho người phát triển và đổi tên sau này còn rẻ vì chưa màn thật nào dùng.
  file: `src/components/candidate/use-change.tsx`
  severity: low
  Đề xuất: known-limits

- **A FieldError thrown while offline becomes the 'not saved, offline' banner and never reaches the field**
  Người dùng thấy gì: Khi đang mất mạng mà giá trị nhập bị kiểm tra là sai, người dùng thấy băng báo chưa lưu vì mất mạng thay vì câu báo ngay tại ô sai, và bấm thử lại sẽ lặp lại lỗi đó.
  Căn cứ: Dữ liệu đang nhập vẫn còn nguyên và người dùng tự thoát được khi có mạng lại hoặc sửa giá trị; chỉ là thông báo kém chính xác trong một tình huống hiếm.
  file: `src/components/candidate/use-change.tsx`
  severity: low
  Đề xuất: known-limits

- **Lưu sau khi xác nhận mà hỏng vì lỗi khác mất mạng thì lỗi bị nuốt, người dùng không thấy gì (r1 · tệp đã đổi)**
  Người dùng thấy gì: Khi xóa hay gửi ra ngoài sàn mà việc lưu hỏng vì lý do khác ngoài mất mạng, hộp xác nhận đóng lại và không báo gì, người dùng tưởng đã xong.
  Căn cứ: Việc im lặng khiến người dùng tin sai về dữ liệu của mình, nhưng hiện chỉ có bản mẫu chưa nối lưu thật, nên nên xử lý cùng hàng nối dữ liệu.
  file: `src/components/candidate/use-change.tsx`
  severity: medium
  Đề xuất: new-contract

- **Hoàn tác đi vòng qua cửa lưu: hoàn tác hỏng khi mất mạng thì im lặng (r1 · tệp đã đổi)**
  Người dùng thấy gì: Nếu bấm Hoàn tác lúc mất mạng thì không có thông báo nào, người dùng tưởng đã hoàn tác trong khi dữ liệu vẫn ở trạng thái mới.
  Căn cứ: Người dùng có thể hiểu sai dữ liệu mà không biết, nhưng chỉ xảy ra khi mất mạng đúng lúc hoàn tác và chưa có đường lưu thật; nên làm cùng hàng nối dữ liệu.
  file: `src/components/candidate/use-change.tsx`
  severity: medium
  Đề xuất: new-contract

- **Confirmed change swallows non-offline save errors: the failure looks the same as pressing Huỷ (r1 · tệp đã đổi)**
  Người dùng thấy gì: Một thay đổi không đảo được như xóa có thể hỏng mà không có thông báo nào, trông giống hệt khi bấm Thôi.
  Căn cứ: Người dùng không biết việc đã không xảy ra, nhưng hiện chỉ là bản mẫu chưa lưu thật, và tải lại trang là thấy dữ liệu đúng; nên làm khi nối lưu thật.
  file: `src/components/candidate/use-change.tsx`
  severity: high
  Đề xuất: new-contract

- **Undo runs outside the save door: a failed undo is an unhandled rejection with no feedback (r1 · tệp đã đổi)**
  Người dùng thấy gì: Khi hoàn tác thất bại, người dùng không thấy báo gì và tưởng thay đổi đã được hoàn tác.
  Căn cứ: Hậu quả là hiểu sai trạng thái dữ liệu nhưng hiếm gặp và chưa có lưu thật; nên xử lý cùng hàng nối dữ liệu.
  file: `src/components/candidate/use-change.tsx`
  severity: medium
  Đề xuất: new-contract

- **Closing the record panel adds a history entry, so Back after closing reopens it, and Back while walking rows moves between rows instead of closing (r1)**
  Người dùng thấy gì: Sau khi đóng hồ sơ, bấm Quay lại của trình duyệt có thể mở lại hồ sơ, và đi qua nhiều dòng thì phải bấm Quay lại nhiều lần mới thoát.
  Căn cứ: Chỉ gây khó chịu nhỏ, không mất dữ liệu, người dùng tự thoát được bằng nút Đóng; sửa cần chạm vào cách điều hướng nên để sau.
  file: `src/components/candidate/record-panel.tsx`
  severity: medium
  Đề xuất: known-limits

- **Prototype 'partial-empty' state: «Thử lại» leads to the 'no rows were ever entered' empty state (r1)**
  Người dùng thấy gì: Trên bản mẫu thử, sau khi bấm Thử lại ở vùng tải một phần, vùng nói chưa có dòng nào dù dữ liệu có.
  Căn cứ: Chỉ ảnh hưởng bản mẫu cho người phát triển, không tới nhân viên sàn, và tải lại trang là hết; không đáng mở việc.
  file: `src/app/(app)/proto/[slug]/behavior-showcase.tsx`
  severity: low
  Đề xuất: wont-fix

- **Hình dạng 2 — fixture viết tay đúng khuôn bên đọc: ca phá 'read-only-cell' dựng HTML bằng tay, còn assertLockedHasReason chưa từng chạy trên ô thật (r1 · tệp đã đổi)**
  Người dùng thấy gì: Bài kiểm ô khóa có thể vẫn xanh dù ô khóa thật mất lý do hiển thị, nên lỗi này có thể lọt qua mà không ai biết.
  Căn cứ: Ô khóa thật vẫn có bài kiểm riêng của hàng trước nên rủi ro thấp, và người dùng không bị ảnh hưởng trực tiếp; ghi lại để củng cố sau.
  file: `tests/behavior.test.tsx`
  severity: medium
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
