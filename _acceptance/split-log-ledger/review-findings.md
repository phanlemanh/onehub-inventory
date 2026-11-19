# Review findings: split-log-ledger (round 1)

## Trong hợp đồng

(không có finding nào)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **measure.sh hard-codes the owner's local checkout path, unlike the other measures that work out the repo root**
  Người dùng thấy gì: Only the repo owner's machine can re-run the 'before' count of merge conflicts, and the file shows a local username in a public repo. Nothing changes for people using the product.
  Căn cứ: Low impact: no data loss and no effect on users, the measurement is a one-off already recorded, and the contract already states the limit.
  file: `_acceptance/split-log-ledger/rang/measure.sh`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 1 (đo chỉ dẫn thay vì đầu ra): ve-truoc-test đọc kế hoạch `make -n check-quick` rồi tự vẽ bằng `make derived`, không đo việc check-quick thật sự vẽ trước khi chạy test**
  Người dùng thấy gì: The check only confirms the quick check is ordered to draw the log before the tests, not that a real run does so. A faulty setup could pass the check yet fail on the first real run, where it would show up immediately.
  Căn cứ: Medium-low impact: a miss would surface as a visibly failing CI run that can simply be re-run or fixed, with no data lost, and the CI job itself is the real safety net.
  file: `_acceptance/split-log-ledger/rang/ve-truoc-test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 6 (đường dẫn hardcode ROOT): measure.sh cd vào bản checkout chính của tác giả**
  Người dùng thấy gì: The recorded 'before' conflict count can only be reproduced from the owner's main checkout, not from another copy or machine. Product users are unaffected.
  Căn cứ: Low impact: it only affects a historical measurement already saved, nothing is lost, and the contract discloses it.
  file: `_acceptance/split-log-ledger/rang/measure.sh`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 2 (fixture viết tay đúng khuôn bên đọc): ca «entry dated before the split» của so-log tự viết tệp mục thay vì sinh bằng writer**
  Người dùng thấy gì: One test case builds its sample log entry by hand instead of with the real tool, so it could miss a future change in the entry format. Today it matches, and users see no effect.
  Căn cứ: Low impact: it is a hypothetical future drift in a test, nothing is lost for users, and the other cases already go through the real tool.
  file: `_acceptance/split-log-ledger/rang/two-way.mjs`
  severity: low
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
