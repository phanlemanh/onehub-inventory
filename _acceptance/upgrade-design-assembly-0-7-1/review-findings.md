# Review findings: upgrade-design-assembly-0-7-1 (round 3)

## Trong hợp đồng

Không có.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Design: E14 is listed in feature_loop.model_evals but calls no model**
  Người dùng thấy gì: Các vòng chấm và ghim lại sau này sẽ đếm một phép đo không gọi mô hình thật là một lần gọi mô hình, và không thử lại nó. Người dùng cuối không thấy gì; chỉ số liệu trong báo cáo chấm bị lệch.
  Căn cứ: Chỉ làm số đếm trong báo cáo nội bộ lệch đi, không ảnh hưởng người dùng hay dữ liệu, và gỡ được bằng cách xoá mục này sau khi gộp.
  file: `_acceptance/config.yaml`
  severity: low
  Đề xuất: known-limits

- **Secrets: gitleaks flags 4 generic-api-key hits in the new s4-args files**
  Người dùng thấy gì: Một lần quét bí mật toàn lịch sử sẽ báo đỏ vì vài mã băm tệp bị nhầm là khoá. Không có khoá thật nào bị lộ.
  Căn cứ: Đây là báo động giả, không lộ dữ liệu nào, và lịch sử cũ đã đỏ vì cùng lý do; chỉ cần ghi lại để người quét sau biết.
  file: `_acceptance/upgrade-design-assembly-0-7-1/s4-args.json`
  severity: low
  Đề xuất: known-limits

- **CI and agent privileges: owner-calls.mjs overrides the user's SSH setup on every fetch**
  Người dùng thấy gì: Máy hoặc máy chạy kiểm tra tự động nào lấy mã qua SSH bằng khoá riêng có thể bị mất cấu hình đó, khiến hai cổng kiểm tra báo đỏ trên bản sao nông. Chỉ gặp ở môi trường có cấu hình SSH riêng.
  Căn cứ: Hậu quả là cổng đỏ chứ không mất hay lộ dữ liệu, chỉ gặp ở một số môi trường, và phải sửa ở kho của công cụ chứ không sửa được tại đây.
  file: `tools/design-assembly/owner-calls.mjs`
  severity: low
  Đề xuất: known-limits

- **Records: no wiki decision page for a change with a lasting why**
  Người dùng thấy gì: Lý do lâu dài của thay đổi này (kiểm tra có thể gọi mạng trên bản sao nông) chỉ có một dòng nhật ký, chưa có trang quyết định riêng. Người đọc sau này khó tìm vì sao.
  Căn cứ: Chỉ thiếu tài liệu giải thích, không ảnh hưởng người dùng hay dữ liệu, và có thể bổ sung sau bằng một thay đổi riêng.
  file: `_acceptance/upgrade-design-assembly-0-7-1/rang/change-list.mjs`
  severity: low
  Đề xuất: known-limits

- **The two-way test for the leftover-clone check never runs redWith, so it misses the TMPDIR handoff that the fix depends on**
  Người dùng thấy gì: Một phép kiểm phụ có thể im lặng nếu ai đó làm hỏng một dòng cấu hình, nên bản sao thừa trong thư mục tạm có thể lọt qua. Không ảnh hưởng người dùng sản phẩm.
  Căn cứ: Chỉ làm yếu công cụ kiểm nội bộ, không mất hay lộ dữ liệu, và chỉ có hại nếu có người sửa nhầm sau này.
  file: `_acceptance/upgrade-design-assembly-0-7-1/rang/shallow-two-way.mjs`
  severity: medium
  Đề xuất: known-limits

- **Assertion âm-tính-một-mình (hình dạng 4): kiểm 'không để lại bản sao' trong redWith không có đối chứng dương rằng bản sao thật sự nằm trong TMPDIR riêng của ca, và bài tự kiểm mới không thể đỏ**
  Người dùng thấy gì: Phép kiểm phụ có thể xanh dù không đo gì nếu thư mục tạm không tới được tiến trình con, nên bản sao bị bỏ lại có thể không bị phát hiện. Người dùng sản phẩm không bị ảnh hưởng.
  Căn cứ: Chỉ là lỗ hổng trong công cụ kiểm nội bộ, không mất hay lộ dữ liệu, và có thể vá sau mà không ảnh hưởng ai.
  file: `_acceptance/upgrade-design-assembly-0-7-1/rang/shallow-two-way.mjs`
  severity: medium
  Đề xuất: known-limits

- **Criteria and tests: the change to the shared e2e executor has no acceptance criterion (r2 · tệp đã đổi)**
  Người dùng thấy gì: Các lần chạy lại bộ kiểm tra trình duyệt của khoảng mười hồ sơ khác nay sẽ chạy không có cơ sở dữ liệu, giống môi trường CI. Chủ kho đã đồng ý, nhưng hồ sơ này chưa ghi rõ điều đó.
  Căn cứ: Hậu quả nhẹ: chỉ ảnh hưởng cách chạy kiểm tra nội bộ, không động tới người dùng hay dữ liệu, chủ kho đã duyệt và khớp với CI; chỉ cần ghi lại thành giới hạn đã biết, sửa sau cũng rẻ.
  file: `_acceptance/config.yaml`
  severity: low
  Đề xuất: known-limits

- **Records: số dòng đổi của owner-calls.mjs trong design doc sai (r1)**
  Người dùng thấy gì: Tài liệu thiết kế ghi sai số dòng thay đổi của một công cụ. Người dùng cuối không thấy gì, chỉ người duyệt có thể đọc nhầm quy mô thay đổi.
  Căn cứ: Hậu quả nhẹ, chỉ là con số trong tài liệu nội bộ, không mất dữ liệu và sửa lại rất rẻ bất cứ lúc nào.
  file: `docs/superpowers/specs/2026-11-18-upgrade-design-assembly-0-7-1-design.md`
  severity: low
  Đề xuất: known-limits

- **Records: không có trang quyết định trong wiki, và phép đo AC-8 cấm thêm (r1)**
  Người dùng thấy gì: Lý do lâu dài của thay đổi chưa có trang riêng trong wiki, nên người đến sau khó tìm hiểu vì sao có hai chặn mới. Người dùng cuối không bị ảnh hưởng.
  Căn cứ: Hậu quả nhẹ, chỉ ảnh hưởng việc tra cứu nội bộ, lý do vẫn có ở hồ sơ nghiệm thu và nhật ký, và hồ sơ 0.7.0 trước đó cũng không có trang này.
  file: `_acceptance/upgrade-design-assembly-0-7-1/rang/measures-two-way.mjs`
  severity: low
  Đề xuất: known-limits

- **owner-calls.mjs ghi đè GIT_SSH_COMMAND, làm mất core.sshCommand và GIT_SSH của người dùng khi fetch trên bản sao nông (r1)**
  Người dùng thấy gì: Trên máy hoặc CI dùng khóa ssh riêng để lấy mã, hai chặn mới có thể báo không lấy được dữ liệu từ kho gốc và làm lượt kiểm đỏ. Hiện CI dùng HTTPS nên chưa gặp.
  Căn cứ: Hậu quả nhẹ và hiện ra rõ ràng chứ không âm thầm, không mất dữ liệu; chỉ dính khi đổi cách xác thực, và lỗi nằm ở plugin nên sửa ở đó.
  file: `tools/design-assembly/owner-calls.mjs`
  severity: low
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
