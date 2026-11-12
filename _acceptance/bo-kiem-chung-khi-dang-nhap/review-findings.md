# Review findings: bo-kiem-chung-khi-dang-nhap (round 1)

## Trong hợp đồng

- **Hình dạng 5 (claims a whole class but checks a point list): CHO_TESTS leaves out a test that waits for a banner through shown()**
  file: `tools/e2e_templates/settle.ts:79`
  severity: high
  AC: AC-8
  source: measurement
  detail: CHO_TESTS says it lists 'every test that waits for the phone sheet or a banner'. Evals E8 and E15 say the same: every @cho test, including the offline banner, runs 20 times on a slowed CPU. The test 'a save that fails offline keeps the input and offers retry' in tests/e2e/frame.spec.ts:331 calls setOffline(true) and then `await shown(banner, "bang chua luu")`, so it waits for a banner. It has no { tag: "@cho" } and is not in CHO_TESTS. The check untagged() in tools/e2e_templates/cho-scan.ts only confirms that names already in the hand list appear in `--list --grep @cho`. Nothing derives the full set from the real calls to openSheet()/shown() in tests/e2e and tests/e2e-db and compares it with CHO_TESTS. So a test that uses the shared wait can drop out of the slowed repeat run, and the suite still passes.
  rationale: AC-8 requires the tests that wait for the sheet and the banner to be repeated twenty times on a slowed machine, and a banner-waiting test is missing from that repeated set.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Session break silently skips instead of failing when clearing the cookie no longer signs the person out**
  Người dùng thấy gì: Nếu một ngày xoá phiên không còn đẩy người dùng ra trang đăng nhập, bài kiểm tương ứng sẽ bị bỏ qua thay vì báo đỏ. Khi đó lỗ hổng truy cập có thể lọt qua mà bộ kiểm vẫn xanh.
  Căn cứ: Đây là lớp phòng thủ phụ cho chính bộ kiểm, không phải lỗi người dùng gặp ngay, và hợp đồng đã ghim cách bài kiểm báo đỏ; sửa sau cũng không đắt.
  file: `tools/e2e_templates/runner.ts`
  severity: medium
  Đề xuất: known-limits

- **Signed-out run (the only one CI runs) silently skips any screen that starts redirecting to /login**
  Người dùng thấy gì: Trên máy CI, nếu một màn công khai bất ngờ bắt người dùng đăng nhập, các bài kiểm của màn đó bị bỏ qua và CI vẫn xanh. Lỗi chỉ lộ ra ở lượt có phiên chạy tay.
  Căn cứ: Hợp đồng đã nêu rõ và chấp nhận hạn chế này cho tới khi CI có cơ sở dữ liệu; hậu quả chỉ là phát hiện chậm hơn, không mất dữ liệu.
  file: `tools/e2e_templates/suite.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2 (hand-built fixture instead of a round trip): the 'remove the @cho tag' break edits the list output, not the test**
  Người dùng thấy gì: Bài kiểm chứng việc thiếu nhãn chờ mới thử trên dữ liệu dựng sẵn, chưa thử trên một bản sao thật của bài kiểm. Nếu Playwright xử lý nhãn khác dự đoán, lỗi có thể không bị bắt.
  Căn cứ: Rủi ro thấp vì chỉ ảnh hưởng độ tin cậy của công cụ kiểm, người dùng cuối không bị tác động, và có thể bổ sung sau với chi phí vừa phải.
  file: `tools/e2e_templates/e2e-templates.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (negative-only, no positive control): the session break can silently become a skip on every screen**
  Người dùng thấy gì: Nếu màn Thành viên ngừng đẩy người chưa đăng nhập ra ngoài, bài kiểm phá phiên của màn đó thành bỏ qua và bộ kiểm vẫn xanh. Người chưa đăng nhập có thể vào được màn không nên thấy mà không ai hay.
  Căn cứ: Hậu quả tiềm tàng nghiêm trọng hơn nhưng cần một lỗi khác xảy ra trước; hợp đồng không bao gồm và có thể thêm một chốt đếm số màn sau này với chi phí thấp.
  file: `tools/e2e_templates/runner.ts`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
