# Review findings: hanh-vi-trong-luoi-khung (round 1)

## Trong hợp đồng

- **Bài kiểm chặn màn tự dựng hành vi không chặn được việc nhập thẳng khung hồ sơ hay khối trạng thái**
  file: `tests/behavior-guard.test.ts:24`
  severity: medium
  AC: AC-9
  source: conventions
  detail: Mục mới trong design/behaviors.md («Dựng ở đâu») cam kết rằng tệp màn không nhập thẳng khung hồ sơ, khung chờ hay khối trạng thái, và nếu có thì `tests/behavior-guard.test.ts` sẽ đỏ. Nhưng danh sách FORBIDDEN chỉ có các thành phần gốc (ui/sheet, ui/dialog, ui/skeleton, @base-ui/react/dialog…). Danh sách này thiếu `@/components/candidate/record-panel` (RecordPanel, useRecordAddress) và `@/components/candidate/region-state` (RegionLoading, RegionError, RegionPartialEmpty…). Vì vậy một màn trong src/app hay src/modules/*/ui có thể tự dựng khung hồ sơ hoặc trạng thái vùng mà không đi qua `DataRegion`, và bài kiểm vẫn xanh. Như vậy luật "mỗi hành vi chỉ một chỗ dựng" chỉ có trên giấy. Ngoài ra, biểu thức IMPORT không bắt dạng `export { X } from "..."`.

- **Hình dạng 1 — đo chỉ dẫn thay vì đầu ra: ca phá 'notification-channel' và ca 'field error' đo bảng luật channelFor, mà không đường chạy nào đọc bảng này**
  file: `tests/behavior.test.tsx:798`
  severity: high
  AC: AC-9
  source: measurement
  detail: Ca phá trong BREAKS (dòng 795-799) gọi assertFieldInline((event) => event === 'field' ? 'toast' : channelFor(event)), còn ca dương ở dòng 741 gọi assertFieldInline(channelFor). Cả hai chỉ đọc bảng CHANNEL trong src/components/templates/notify.ts. Tìm trong src thì thấy channelFor không có nơi gọi nào: useChange (use-change.tsx dòng 56-62) gọi thẳng notifyResult/saveWithBanner và không hỏi channelFor. Vì vậy dù useChange đẩy lỗi trường ra toast, ca phá vẫn đỏ đúng 'field error sent to toast' và ca dương vẫn xanh. Phép đo kiểm tra bảng khai báo chứ không kiểm tra hành vi thật của cửa lưu. Phần expect(toastMock).not.toHaveBeenCalled() ở dòng 753 cũng không chứng minh được 'lỗi trường ở lại ô': toast không bắn chỉ vì apply ném lỗi và saveWithBanner ném lại, trong khi cửa không hề biết đâu là lỗi trường.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Lưu sau khi xác nhận mà hỏng vì lỗi khác mất mạng thì lỗi bị nuốt, người dùng không thấy gì**
  Người dùng thấy gì: Khi xóa hay gửi ra ngoài sàn mà việc lưu hỏng vì lý do khác ngoài mất mạng, hộp xác nhận đóng lại và không báo gì, người dùng tưởng đã xong.
  Căn cứ: Việc im lặng khiến người dùng tin sai về dữ liệu của mình, nhưng hiện chỉ có bản mẫu chưa nối lưu thật, nên nên xử lý cùng hàng nối dữ liệu.
  file: `src/components/candidate/use-change.tsx`
  severity: medium
  Đề xuất: new-contract

- **Hoàn tác đi vòng qua cửa lưu: hoàn tác hỏng khi mất mạng thì im lặng**
  Người dùng thấy gì: Nếu bấm Hoàn tác lúc mất mạng thì không có thông báo nào, người dùng tưởng đã hoàn tác trong khi dữ liệu vẫn ở trạng thái mới.
  Căn cứ: Người dùng có thể hiểu sai dữ liệu mà không biết, nhưng chỉ xảy ra khi mất mạng đúng lúc hoàn tác và chưa có đường lưu thật; nên làm cùng hàng nối dữ liệu.
  file: `src/components/candidate/use-change.tsx`
  severity: medium
  Đề xuất: new-contract

- **Confirmed change swallows non-offline save errors: the failure looks the same as pressing Huỷ**
  Người dùng thấy gì: Một thay đổi không đảo được như xóa có thể hỏng mà không có thông báo nào, trông giống hệt khi bấm Thôi.
  Căn cứ: Người dùng không biết việc đã không xảy ra, nhưng hiện chỉ là bản mẫu chưa lưu thật, và tải lại trang là thấy dữ liệu đúng; nên làm khi nối lưu thật.
  file: `src/components/candidate/use-change.tsx`
  severity: high
  Đề xuất: new-contract

- **Undo runs outside the save door: a failed undo is an unhandled rejection with no feedback**
  Người dùng thấy gì: Khi hoàn tác thất bại, người dùng không thấy báo gì và tưởng thay đổi đã được hoàn tác.
  Căn cứ: Hậu quả là hiểu sai trạng thái dữ liệu nhưng hiếm gặp và chưa có lưu thật; nên xử lý cùng hàng nối dữ liệu.
  file: `src/components/candidate/use-change.tsx`
  severity: medium
  Đề xuất: new-contract

- **Closing the record panel adds a history entry, so Back after closing reopens it, and Back while walking rows moves between rows instead of closing**
  Người dùng thấy gì: Sau khi đóng hồ sơ, bấm Quay lại của trình duyệt có thể mở lại hồ sơ, và đi qua nhiều dòng thì phải bấm Quay lại nhiều lần mới thoát.
  Căn cứ: Chỉ gây khó chịu nhỏ, không mất dữ liệu, người dùng tự thoát được bằng nút Đóng; sửa cần chạm vào cách điều hướng nên để sau.
  file: `src/components/candidate/record-panel.tsx`
  severity: medium
  Đề xuất: known-limits

- **Prototype 'partial-empty' state: «Thử lại» leads to the 'no rows were ever entered' empty state**
  Người dùng thấy gì: Trên bản mẫu thử, sau khi bấm Thử lại ở vùng tải một phần, vùng nói chưa có dòng nào dù dữ liệu có.
  Căn cứ: Chỉ ảnh hưởng bản mẫu cho người phát triển, không tới nhân viên sàn, và tải lại trang là hết; không đáng mở việc.
  file: `src/app/(app)/proto/[slug]/behavior-showcase.tsx`
  severity: low
  Đề xuất: wont-fix

- **Hình dạng 2 — fixture viết tay đúng khuôn bên đọc: ca phá 'read-only-cell' dựng HTML bằng tay, còn assertLockedHasReason chưa từng chạy trên ô thật**
  Người dùng thấy gì: Bài kiểm ô khóa có thể vẫn xanh dù ô khóa thật mất lý do hiển thị, nên lỗi này có thể lọt qua mà không ai biết.
  Căn cứ: Ô khóa thật vẫn có bài kiểm riêng của hàng trước nên rủi ro thấp, và người dùng không bị ảnh hưởng trực tiếp; ghi lại để củng cố sau.
  file: `tests/behavior.test.tsx`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
