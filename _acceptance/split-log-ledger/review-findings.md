# Review findings: split-log-ledger (round 2)

## Trong hợp đồng

Không có.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **The design doc's 'Lựa chọn' section still describes the Hỏi-2 approach the owner rejected**
  Người dùng thấy gì: The design note still describes an approach the owner turned down, so a reviewer may read two conflicting accounts of what was decided. The wiki log split itself works as the owner approved; only the written explanation is out of date.
  Căn cứ: Low impact: nothing is lost and nobody using the product sees it, but a reviewer could be misled, and the fix is a quick edit to one document at any later time.
  file: `docs/superpowers/specs/2026-11-19-split-log-ledger-design.md`
  severity: medium
  Đề xuất: known-limits

- **The re-signed Gate 1 card still shows decisions about E5, which was dropped, with nothing marking them as replaced**
  Người dùng thấy gì: The signed approval card lists two trade-offs about a check that was later dropped, so it looks slightly more complete than it is. The product and the log split are not affected.
  Căn cứ: Very low impact: it is only a stale line on an already-signed record, no data is lost, and the signed card is a historical record that is not worth reopening.
  file: `_acceptance/split-log-ledger/decisions.jsonl`
  severity: low
  Đề xuất: wont-fix

- **measure.sh hard-codes the owner's local checkout path, unlike the other measures that work out the repo root (r1)**
  Người dùng thấy gì: Only the repo owner's machine can re-run the 'before' count of merge conflicts, and the file shows a local username in a public repo. Nothing changes for people using the product.
  Căn cứ: Low impact: no data loss and no effect on users, the measurement is a one-off already recorded, and the contract already states the limit.
  file: `_acceptance/split-log-ledger/rang/measure.sh`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 1 (đo chỉ dẫn thay vì đầu ra): ve-truoc-test đọc kế hoạch `make -n check-quick` rồi tự vẽ bằng `make derived`, không đo việc check-quick thật sự vẽ trước khi chạy test (r1)**
  Người dùng thấy gì: The check only confirms the quick check is ordered to draw the log before the tests, not that a real run does so. A faulty setup could pass the check yet fail on the first real run, where it would show up immediately.
  Căn cứ: Medium-low impact: a miss would surface as a visibly failing CI run that can simply be re-run or fixed, with no data lost, and the CI job itself is the real safety net.
  file: `_acceptance/split-log-ledger/rang/ve-truoc-test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 6 (đường dẫn hardcode ROOT): measure.sh cd vào bản checkout chính của tác giả (r1)**
  Người dùng thấy gì: The recorded 'before' conflict count can only be reproduced from the owner's main checkout, not from another copy or machine. Product users are unaffected.
  Căn cứ: Low impact: it only affects a historical measurement already saved, nothing is lost, and the contract discloses it.
  file: `_acceptance/split-log-ledger/rang/measure.sh`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 2 (fixture viết tay đúng khuôn bên đọc): ca «entry dated before the split» của so-log tự viết tệp mục thay vì sinh bằng writer (r1 · tệp đã đổi)**
  Người dùng thấy gì: One test case builds its sample log entry by hand instead of with the real tool, so it could miss a future change in the entry format. Today it matches, and users see no effect.
  Căn cứ: Low impact: it is a hypothetical future drift in a test, nothing is lost for users, and the other cases already go through the real tool.
  file: `_acceptance/split-log-ledger/rang/two-way.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
