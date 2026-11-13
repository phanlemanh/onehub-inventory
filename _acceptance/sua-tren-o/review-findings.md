# Review findings: sua-tren-o (round 2)

## Trong hợp đồng

- **Optimistic value is never rolled back when the write throws a non-classified error**
  file: `src/modules/listings/ui/use-listing-cell-edit.tsx:148`
  severity: medium
  AC: AC-7
  source: bugs
  detail: `save` patches the row with the new value first, then awaits runDoorChange. `attempt` rethrows any error that writeFailure does not classify (for example a 500 WriteRefused, or any non-TypeError fault). `save` has no try/finally, so the patch(row.id, before) line is skipped. The callers use `void save(...)`, so the rejection is unhandled and silent: the grid keeps showing a price or status that was never saved, with no toast. Put the rollback in a finally/catch and show a failure.
  rationale: AC-7 buộc khi chính lần sửa hỏng thì ô về giá trị cũ và thông báo nói vì sao, không bao giờ im; lỗi lạ làm ô giữ giá chưa lưu và không báo gì.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Authorization (check 6): status moves bypass activateListing in the permission table**
  Người dùng thấy gì: Một người môi giới phía khách, hoặc người không giữ căn đó, có thể đưa căn từ Chưa đủ hay Tạm giữ sang Đang bán ngay trên ô, dù bảng quyền không cho. Hiện chỉ ghi vào dữ liệu mẫu trong bộ nhớ.
  Căn cứ: Hiện chưa chạm dữ liệu thật và tải lại là mất, nhưng khi nối đường ghi thật ở hàng 10 thì phải chốt quyền kích hoạt; sửa ngay giờ thì rẻ hơn làm lại sau.
  file: `src/modules/listings/ui/use-listing-cell-edit.tsx`
  severity: medium
  Đề xuất: new-contract

- **Authorization / CI and agent privileges (checks 6, 8): role taken from the URL in non-production builds**
  Người dùng thấy gì: Trên bản chạy thử (không phải bản chính thức), ai mở đường dẫn có gắn vai đều bật được ô sửa như vai đó mà không cần đăng nhập. Bản chính thức không bị.
  Căn cứ: Chỉ ảnh hưởng bản thử, ghi vào dữ liệu mẫu, không lộ dữ liệu thật; nhẹ và người dùng bản chính thức không gặp.
  file: `src/app/(app)/inventory/page.tsx`
  severity: low
  Đề xuất: known-limits

- **Tier (check 10): high tier because the ontology is touched; needs a code owner and an ontology call-out**
  Người dùng thấy gì: Người dùng không thấy gì khác. Chỉ là thay đổi nhãn mới cần chủ kho xác nhận trong mô tả PR trước khi gộp.
  Căn cứ: Không ảnh hưởng người dùng hay dữ liệu; chỉ là việc ghi chú và duyệt khi gộp, làm ở bước gộp là đủ.
  file: `ontology/labels.yaml`
  severity: low
  Đề xuất: known-limits

- **Status cell moves a listing to Active under updateListing, bypassing activateListing scope**
  Người dùng thấy gì: Người môi giới không giữ căn vẫn có thể đưa căn lên Đang bán từ ô Trạng thái, trái với bảng quyền. Hiện chỉ tác động lên dữ liệu mẫu.
  Căn cứ: Chưa mất dữ liệu thật và tải lại là về như cũ, nhưng cần chốt luật quyền trước khi nối đường ghi thật, nên gộp vào việc riêng.
  file: `src/modules/listings/ui/use-listing-cell-edit.tsx`
  severity: medium
  Đề xuất: new-contract

- **Rule refusals ('invalid') are reported as permission refusals, and a failed undo then sits on screen forever**
  Người dùng thấy gì: Nếu bấm Hoàn tác sau khi căn đã chuyển sang trạng thái cuối, người dùng thấy câu báo thiếu quyền sai nguyên nhân và thông báo kẹt lại với nút Thử lại không bao giờ thành công.
  Căn cứ: Hiếm gặp, không mất dữ liệu và dữ liệu không bị sai; chỉ gây khó hiểu, tải lại trang là hết.
  file: `src/modules/listings/ui/use-listing-cell-edit.tsx`
  severity: medium
  Đề xuất: known-limits

- **Cell accepts sub-million prices that the save door then rejects as 'refused'**
  Người dùng thấy gì: Gõ giá rất nhỏ như 0,5 tr thì ô tưởng hiểu nhưng khi lưu bị từ chối, ô trở về giá cũ kèm câu báo thiếu quyền gây hiểu nhầm.
  Căn cứ: Giá chào dưới một triệu hầu như không có thật, không mất dữ liệu, người dùng gõ lại giá đúng là xong.
  file: `src/modules/listings/save-door.ts`
  severity: medium
  Đề xuất: known-limits

- **Every TypeError is treated as 'offline', hiding real bugs as network failures**
  Người dùng thấy gì: Nếu có lỗi lập trình trong lúc lưu, người dùng chỉ thấy báo mất mạng và giá trị trở về, còn lỗi thật bị che.
  Căn cứ: Giá trị không bị lưu sai và tự về cũ nên người dùng không mất gì; chỉ khó tìm lỗi cho đội làm, sửa sau rẻ.
  file: `src/lib/write-failure.ts`
  severity: low
  Đề xuất: known-limits

- **Shape 3 (string present instead of the relation): hoan-tac-hong-bao-ro in use-change.test checks a fixed fixture sentence, not the unit and the value the cell actually shows**
  Người dùng thấy gì: Người dùng không thấy khác. Lượt đo cho thông báo hoàn tác hỏng chưa tự kiểm việc thông báo nêu đúng căn và đúng giá trị.
  Căn cứ: Hành vi sản phẩm vẫn được một bài kiểm khác phủ nên không có rủi ro trực tiếp cho người dùng; chỉ làm số đo kém chặt, thêm bài vào danh sách chạy là rẻ.
  file: `src/components/candidate/use-change.test.tsx`
  severity: medium
  Đề xuất: known-limits

- **Shape 2 (hand-written fixture): the 'navigator.onLine false' failure is made up as Error("network down") instead of coming from the real write path**
  Người dùng thấy gì: Người dùng không thấy khác. Một ca báo mất mạng trong bài kiểm dùng lỗi tự dựng thay vì lỗi của đường ghi thật.
  Căn cứ: Không ảnh hưởng người dùng, hai ca còn lại đã đi qua đường ghi thật; chỉ làm bài đo kém sát.
  file: `src/components/candidate/use-change.test.tsx`
  severity: low
  Đề xuất: known-limits

- **Shape 4 (negative assertion with no positive control): khong-quyen-chu-thuong passes even if ?vai=CompanyAdmin is ignored**
  Người dùng thấy gì: Người dùng không thấy khác. Bài kiểm vai không có quyền có thể xanh dù vai chưa thật sự được áp dụng.
  Căn cứ: Hành vi vai có quyền đã có bài kiểm khác; rủi ro là một lỗi quyền sau này lọt qua mà không đỏ, sửa bài kiểm rẻ.
  file: `tests/e2e/sua-tren-o.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Shape 4 (pinned message): the messages the evals.yaml break directions expect do not match the messages the tests print**
  Người dùng thấy gì: Người dùng không thấy khác. Hai bài đo ghi sai câu báo đỏ mong đợi nên người chấm khó đối chiếu chiều làm hỏng.
  Căn cứ: Không ảnh hưởng sản phẩm hay dữ liệu; chỉ là câu chữ trong hồ sơ đo, sửa rất rẻ khi tiện.
  file: `_acceptance/sua-tren-o/evals.yaml`
  severity: low
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
