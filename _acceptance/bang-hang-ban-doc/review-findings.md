# Review findings: bang-hang-ban-doc (round 3)

## Trong hợp đồng

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Decision log still records the pre-fix keyboard gap as an open 'known limitation', so the owner's card asks for sign-off on a limitation that is already fixed**
  Người dùng thấy gì: Thẻ trình chủ kho còn xin phê một giới hạn cũ là bàn phím chưa vào được bảng trước khi trang nhận thao tác, dù lỗi này đã sửa xong. Người dùng cuối không bị ảnh hưởng, chỉ có người duyệt dễ bị rối khi đọc thẻ.
  Căn cứ: Nhẹ: sản phẩm chạy đúng, không mất hay lộ dữ liệu, chỉ là một dòng ghi chép lỗi thời khiến người duyệt phải đọc thêm; ghi lại là đủ, và chủ kho có thể đảo đề xuất nếu muốn thẻ sạch.
  file: `_acceptance/bang-hang-ban-doc/decisions.jsonl`
  severity: low
  Đề xuất: known-limits

- **E11 judge question still says 'four images' after a fifth (long-name) screenshot was added to its inputs (r2)**
  Người dùng thấy gì: Câu hỏi cho người chấm ảnh vẫn nói bốn ảnh dù đã có ảnh thứ năm. Màn hình cho người dùng không đổi, chỉ có nguy cơ phép chấm bỏ qua ảnh mới và lại cho kết quả chưa chắc về tên dự án dài bị cắt.
  Căn cứ: Không ảnh hưởng người dùng, chỉ làm phép chấm có thể lưỡng lự và chạy lại được; sửa lại rẻ nhưng không đổi hành vi của màn.
  file: `_acceptance/bang-hang-ban-doc/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (âm tính một mình): chỗ chờ trước lượt quét trợ năng chỉ đòi «không còn khung cuộn nào thiếu tabindex», không đòi khung cuộn có mặt (r2)**
  Người dùng thấy gì: Bài kiểm trợ năng có thể quét quá sớm, trước khi khung cuộn của bảng sẵn sàng. Người dùng bàn phím không bị ảnh hưởng ngay, nhưng lỗi chập chờn đã thấy ở khổ 1024 có thể xuất hiện lại mà bài kiểm không báo.
  Căn cứ: Chỉ làm bài kiểm kém chắc chắn, không làm mất hay lộ dữ liệu của người dùng; chạy lại được và sửa sau cũng rẻ.
  file: `tests/e2e/behavior.spec.ts`
  severity: low
  Đề xuất: known-limits

- **label("StandardStatus") reused for a different meaning (region/page states) (r1)**
  Người dùng thấy gì: Trên trang mẫu nội bộ, tiêu đề phần trạng thái toàn trang dùng chữ của trạng thái căn. Nếu sàn đổi tên trạng thái căn thì tiêu đề này đổi theo dù không liên quan.
  Căn cứ: Chỉ ảnh hưởng một trang mẫu nội bộ, khách hàng và đầu chủ không thấy, không mất dữ liệu, sửa lúc nào cũng rẻ.
  file: `src/app/(app)/proto/[slug]/frame-showcase.tsx`
  severity: medium
  Đề xuất: known-limits

- **The Bảng hàng empty-state sentence hard-codes the Unit label «căn» (r1)**
  Người dùng thấy gì: Khi sàn chưa có căn nào, câu báo trống viết sẵn chữ «căn». Nếu sàn đổi tên gọi này thì câu đó lệch với phần còn lại của màn.
  Căn cứ: Nhẹ: chỉ lệch chữ ở một câu hiếm gặp, không mất dữ liệu, và việc sàn đổi tên gọi này chưa xảy ra.
  file: `src/app/(app)/inventory/page.tsx`
  severity: medium
  Đề xuất: known-limits

- **The row-count rule is split into two places with different conditions; showCount is documented but never used (r1 · tệp đã đổi)**
  Người dùng thấy gì: Số dòng hiện hai lần, cạnh ô tìm và ở chân bảng. Khi tìm mà vẫn giữ đủ dòng thì hai nơi ghi hơi khác nhau.
  Căn cứ: Chỉ là trùng lặp và lệch cách ghi, người dùng vẫn đọc đúng số dòng, không mất dữ liệu, sửa nhỏ sau cũng được.
  file: `src/components/candidate/data-region.tsx`
  severity: low
  Đề xuất: known-limits

- **Showcases still hard-code headers for concepts that now have labels (ListPrice, LastConfirmedAt) (r1)**
  Người dùng thấy gì: Trên trang mẫu Lưới, hai cột còn mang tên cũ khác với Bảng hàng thật. Cùng một thông tin mà hai màn gọi hai tên.
  Căn cứ: Chỉ lệch tên ở trang mẫu nội bộ, không mất dữ liệu, không ảnh hưởng đầu chủ, đổi lại rẻ khi dọn trang mẫu.
  file: `src/app/(app)/proto/[slug]/grid-showcase.tsx`
  severity: low
  Đề xuất: known-limits

- **Row count appears twice: the toolbar's showCount switch is never used (r1 · tệp đã đổi)**
  Người dùng thấy gì: Số «60 dòng» hiện cạnh ô tìm và lặp lại ở chân bảng. Hơi thừa nhưng không sai.
  Căn cứ: Chỉ thừa một con số, không sai thông tin, không mất dữ liệu, và gỡ đi còn kéo theo chỉnh bài kiểm tìm nên để sau.
  file: `src/components/candidate/data-region.tsx`
  severity: low
  Đề xuất: known-limits

- **Shape 3: the test checks that a status badge exists, but the promise is that each badge matches its row's status (r1)**
  Người dùng thấy gì: Bài kiểm chỉ xác nhận có huy hiệu trạng thái, chưa kiểm huy hiệu khớp đúng trạng thái của từng dòng. Nếu sau này huy hiệu hiện sai dòng thì bài kiểm vẫn xanh.
  Căn cứ: Màn hôm nay hiển thị đúng, rủi ro chỉ là bỏ sót lỗi tương lai, người dùng chưa gặp gì, và bổ sung kiểm chứng sau rất rẻ.
  file: `tests/inventory.test.tsx`
  severity: medium
  Đề xuất: known-limits

- **Shape 4: the 'widths stay the same' check stands alone, with no proof the search actually filtered (r1 · tệp đã đổi)**
  Người dùng thấy gì: Bài kiểm bề rộng cột khi gõ tìm không chứng minh ô tìm thật sự đã lọc dòng. Nếu ô tìm hỏng thì bài này vẫn xanh.
  Căn cứ: Người dùng không gặp lỗi nào hôm nay, các bài tìm khác đã phủ việc lọc, và thêm một dòng kiểm chứng sau là rẻ.
  file: `tests/grid.test.tsx`
  severity: low
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
