## Trong hợp đồng

- **REUSE regex never matches the real CI reuse line (CI prints a run URL, not a numeric id), so the reuse path is dead and E7/E7t go red with a misleading message**
  AC: AC-7
  file: `_acceptance/migration-vai-chu-khong-sieu-cap/rang/ci.mjs:26`
  severity: high
  source: bugs
  detail: ci.yml writes `.heavy-ok` line 1 as RUN_URL (`${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}`) and the reuse step prints `e2e-db not run again: same inputs as run $(sed -n 1p .heavy-ok) at commit ...`. A real log line (run 46099636240, job e2e) shows this: `e2e not run again: same inputs as run https://github.com/phanlemanh/onehub-inventory/actions/runs/46086555076 at commit c55415fe...`. REUSE is `/not run again: same inputs as run (\d+) at commit ([0-9a-f]{7,40})/`. `\d+` has to come straight after `run `, so it cannot match `https://...`. So `d.reuse` is never set, even when the head's e2e-db reused an earlier run. That is exactly the round-2 case: since 73231e21 the head commits touch only `_acceptance/`, which is in HEAVY_NOT_INPUTS. In that case `realLog` stays as the head's reuse log, which has no `ci-db: 6/6 bước đạt`, no test-file name and no postgres:16. E7 then fails with «nhật ký e2e-db chạy thật thiếu «ci-db: 6/6 bước đạt»» instead of following the reused run. E7t's `vat-lanh` case fails the same way. E7t's `pha-dung-lai-ma-khac` builds its own `reuse` object, so the self-test never exercises the regex and does not catch this. Fix: match the URL form (for example `/same inputs as run \S*?\/runs\/(\d+) at commit ([0-9a-f]{7,40})/`) and add a self-test case that feeds the verbatim CI line through `gather`'s parsing.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **--tu-kiem crashes with a TypeError instead of a pinned message when the CI run on the branch head is not finished**
  Người dùng thấy gì: Nếu lượt kiểm tự động của PR chưa chạy xong lúc chấm, công cụ chấm báo lỗi khó hiểu thay vì câu «chưa xong». Kết quả vẫn là đỏ nên không có gì lọt qua nhầm.
  Căn cứ: Hậu quả nhẹ: chỉ sai câu báo, không mất dữ liệu, chạy lại sau khi CI xong là hết, và công cụ này chỉ người chấm dùng.
  file: `_acceptance/migration-vai-chu-khong-sieu-cap/rang/ci.mjs`
  severity: low
  Đề xuất: known-limits

- **--tu-kiem crashes with a TypeError when the head run is missing or not finished, instead of reporting the 'chưa xong' verdict**
  Người dùng thấy gì: Khi lượt kiểm tự động chưa xong, công cụ chấm hiện ra lỗi kỹ thuật thay vì câu báo rõ ràng. Người chấm dễ tưởng công cụ hỏng, nhưng kết quả vẫn đỏ.
  Căn cứ: Hậu quả nhẹ và tự gỡ được: đợi CI xong rồi chạy lại; không ảnh hưởng người dùng sản phẩm hay dữ liệu.
  file: `_acceptance/migration-vai-chu-khong-sieu-cap/rang/ci.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5 — E7 hứa cả lớp thông điệp đỏ «ca của E7t», nhưng E7t chỉ có 4 bản phá**
  Người dùng thấy gì: Một số thông báo đỏ của phép kiểm CI chưa có ca thử riêng, nên nếu chúng hỏng thì chưa chắc ai biết. Sản phẩm và dữ liệu không bị ảnh hưởng.
  Căn cứ: Hậu quả nhẹ: chỉ là khoảng trống trong bài thử của công cụ chấm, không mất dữ liệu, bổ sung sau với chi phí thấp.
  file: `_acceptance/migration-vai-chu-khong-sieu-cap/rang/ci.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2 — bản phá pha-dung-lai-ma-khac đặt thẳng giá trị suy ra `sameCode=false`, không đi qua bên ghi**
  Người dùng thấy gì: Ca thử «dùng lại kết quả của mã khác» chỉ thử câu báo, chưa thử đường tính ra từ đầu đến cuối. Một lỗi ở đường ấy có thể không bị phát hiện.
  Căn cứ: Hậu quả nhẹ và khó xảy ra: chỉ làm bài thử của công cụ chấm yếu hơn mong muốn, không chạm tới người dùng hay dữ liệu.
  file: `_acceptance/migration-vai-chu-khong-sieu-cap/rang/ci.mjs`
  severity: low
  Đề xuất: known-limits

- **New migration reuses number 001 and fills the gap at 004 instead of taking the next number (r1)**
  Người dùng thấy gì: Hai tệp cập nhật cơ sở dữ liệu mang số cũ thay vì số cuối nên dễ bị người sau bắt chước nhầm. Người dùng cuối không thấy ảnh hưởng gì, cơ sở đã có vẫn được áp bù đúng.
  Căn cứ: Chỉ là lệch nếp đặt số, đã được nêu rõ và chấp nhận có chủ đích; không mất dữ liệu và không ảnh hưởng người dùng, chỉ cần ghi chú để người sau khỏi sao chép.
  file: `db/migrations/001_vai_chu_khong_sieu_cap.sql`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5: nói phá thử phủ chiều đỏ của E1–E4, nhưng chỉ có vài ca lẻ (r1)**
  Người dùng thấy gì: Bộ tự kiểm nói là đã thử phá mọi chiều nhưng thực tế mới thử vài ca, nên vài thông báo lỗi chưa được chứng minh là bắt được lỗi thật. Người dùng cuối không bị ảnh hưởng.
  Căn cứ: Chỉ làm bằng chứng nghiệm thu yếu hơn lời nói, không làm hỏng việc đưa bản lên; bổ sung thêm ca phá sau là rẻ và không gấp.
  file: `_acceptance/migration-vai-chu-khong-sieu-cap/rang/kiem.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4: hai assert chỉ có chiều âm, không có ca đối chứng trong bài kiểm CI (r1)**
  Người dùng thấy gì: Bài kiểm tự động kiểm tra rằng tài khoản danh tính không còn quyền tạo đối tượng thừa, nhưng chưa tự chứng minh được rằng nó sẽ báo đỏ nếu quyền ấy thật sự còn. Nếu định dạng quyền đổi, bài kiểm có thể vẫn xanh dù quyền thừa quay lại. Người dùng cuối không thấy gì trực tiếp.
  Căn cứ: Hậu quả nhẹ và chỉ ảnh hưởng độ tin cậy của bài kiểm về sau, không làm mất hay lộ dữ liệu; phần đối chứng đã được chạy ở công cụ tự kiểm riêng, và bổ sung sau cũng rẻ, không gấp.
  file: `tests/db/chu-khong-sieu-cap.db.test.ts`
  severity: low
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
