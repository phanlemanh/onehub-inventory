## Trong hợp đồng

- **The new cleanup test checks only its own hook, not the shared cleanup that removes the other ~35 copies**
  file: `tests/vong-doi-thao-tac.test.ts:533`
  severity: medium
  AC: AC-6
  source: conventions
  detail: AC-6 in contract.md says every temporary folder the test creates is removed after the run. The new case 'don-thu-muc-tam' passes its own private list (`made`) to `copy(made)`, adds its own `afterAll(() => release(made))` in the nested describe, and then checks that this one folder is gone. All the other copies the test makes go into the top-level `copies` list, and the only thing that removes them is the top-level `afterAll(() => { release(copies); })`. Nothing measures that hook. If you delete it, every case stays green and about 35 copies are left in the system temp folder on each `make test`. The test only proves that `rmSync(..., {recursive, force})` works on a list. It does not show that the shared cleanup the comment describes ('the one cleanup every case shares') actually runs. Ledger line d-20261115T062420Z-19 and the E6 evidence ('don-thu-muc-tam xanh') claim that removing the cleanup hook turns the case red. That only holds for the nested hook the case adds itself, so the round's evidence for AC-6 overstates what is checked. A case that pins the shared path is needed, for example one that runs last and checks that every entry of `copies` is gone, or that registers the shared hook through the same function the case checks. The fix is not applied here, as instructed.

- **The new cleanup test checks only its own copy, not the shared one most cases depend on**
  file: `tests/vong-doi-thao-tac.test.ts:533`
  severity: medium
  AC: AC-6
  source: bugs
  detail: The case 'don-thu-muc-tam' makes its own list `made`, has its own nested afterAll call `release(made)`, and then asserts that this single directory is gone. About 30 other cases create their copies through `copies`, and those are released only by the top-level `afterAll(() => release(copies))` (line 41). That hook runs after every test in the file, so no test can assert on it. If you delete the top-level afterAll, or replace its body with nothing, all 39 tests still pass while every copy leaks into tmpdir. Decision d-...-19 claims that 'a run that drops the cleanup hook turns the case red', but that only holds for the nested hook the case adds for itself. E6's promise is 'after afterAll every temporary directory the test made is gone from disk', and that is still not measured for the copies that actually leak. Two possible fixes: make the top-level cleanup an afterEach per describe and assert it, or have each describe use copy(list) with its own afterAll, so the shared hook is the code under test.

- **Hình dạng 5: hứa quét cả lớp «mọi thư mục tạm» nhưng chỉ kiểm một thư mục, lấy từ một afterAll thay thế**
  file: `tests/vong-doi-thao-tac.test.ts:542`
  severity: medium
  AC: AC-6
  source: measurement
  detail: E6 hứa rằng sau afterAll, mọi thư mục tạm mà bài tạo ra không còn trên đĩa. Ca 'don-thu-muc-tam' (dòng 533-546) chỉ tạo một bản sao vào danh sách riêng `made` (dòng 538). Nó gỡ bản sao đó bằng một afterAll riêng đăng ký ở describe con (dòng 536 `afterAll(() => release(made))`). Sau đó nó assert `made.length === 1` và `existsSync(dir) === false` cho đúng một thư mục ấy (dòng 543-544). Khoảng 30 bản sao mà các ca khác tạo vào `copies` không được kiểm. afterAll cấp tệp `afterAll(() => { release(copies); })` ở dòng 41-43, tức chỗ dọn thật, cũng không được kiểm. Nếu xoá hẳn dòng 41-43, mọi bản sao của các ca khác sẽ còn lại trong tmpdir mà ca này vẫn xanh. Đây là điểm-case thay cho ma trận toàn phần: số assert là 1, trong khi số phần tử của lớp được hứa bằng số lần gọi copy(). Ca này cũng gần hình dạng 1, vì nó đo một bản dựng lại của cơ chế dọn chứ không đo đầu ra của afterAll thật.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **The evidence report says the cleanup case passed at a commit where it did not exist**
  Người dùng thấy gì: The sign-off report says the temp-folder cleanup check passed, but it was written before that check existed. Whoever signs it would be relying on a result that was never actually run.
  Căn cứ: No user data is lost or exposed and the report can be regenerated cheaply by a new grading round, but until then the sign-off rests on an unbacked claim.
  file: `_acceptance/kiem-vong-doi-thao-tac/evidence-report.md`
  severity: medium
  Đề xuất: known-limits

- **`chan` is accepted on every cell but only checked on `xem`, so a `chan` anywhere else is silently ignored (r1)**
  Người dùng thấy gì: Khi người viết khai danh sách vai bị chặn ở một ô không phải ô xem, bộ kiểm vẫn báo xanh dù không áp dụng gì. Người khai có thể tưởng quy tắc đã được kiểm trong khi thực tế bị bỏ qua.
  Căn cứ: Hậu quả nhẹ: dữ liệu hiện tại không rơi vào trường hợp này, không mất dữ liệu của người dùng, và người khai tự sửa được khi phát hiện.
  file: `tools/coverage_matrix/lifecycle.py`
  severity: low
  Đề xuất: known-limits

- **Decision page 0038 is not linked from wiki/index.md (wiki-lint warns) (r1)**
  Người dùng thấy gì: Trang quyết định về bộ kiểm vòng đời khó tìm vì không có trong mục lục wiki. Người đọc wiki bắt đầu từ mục lục sẽ không thấy nó.
  Căn cứ: Hậu quả rất nhẹ: chỉ là cảnh báo, không ảnh hưởng người dùng, một số trang cũ cũng bị như vậy và thêm một dòng vào mục lục là rẻ.
  file: `wiki/decisions/0038-lifecycle-check.md`
  severity: low
  Đề xuất: known-limits

- **The lifecycle check reads fewer screen files than the button table it claims to match (r1)**
  Người dùng thấy gì: Nếu sau này một màn có thêm tệp nằm trong thư mục nhưng không được trang nhập vào, bộ kiểm có thể bỏ sót một thứ màn đó hiện. Hiện chưa có tệp nào như vậy nên chưa ảnh hưởng gì.
  Căn cứ: Hậu quả nhẹ và chưa xảy ra: không mất hay lộ dữ liệu, chỉ có thể bỏ sót một lỗi khai báo trong tương lai, và sửa sau vẫn rẻ.
  file: `tools/coverage_matrix/lifecycle.py`
  severity: low
  Đề xuất: known-limits

- **A `chan` key on a cell other than xem is accepted and ignored (r1)**
  Người dùng thấy gì: Người khai đặt danh sách vai bị chặn nhầm ô sẽ thấy bộ kiểm xanh nhưng quy tắc không có hiệu lực. Dễ gây hiểu lầm cho người viết dữ liệu về vai.
  Căn cứ: Hậu quả nhẹ: chỉ ảnh hưởng người khai dữ liệu nội bộ, hiện không có dữ liệu nào bị vậy, và phát hiện ra thì tự sửa được.
  file: `tools/coverage_matrix/lifecycle.py`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5: tuyên quét cả lớp «không khởi động tiến trình nào khác» nhưng chỉ dò ba mẫu chữ (r1 · tệp đã đổi)**
  Người dùng thấy gì: Bài kiểm khẳng định bộ kiểm không mở tiến trình nào khác, nhưng chỉ dò vài cách mở thông dụng. Một cách mở khác có thể lọt qua mà bài vẫn xanh.
  Căn cứ: Hậu quả nhẹ với người dùng: đây là bộ kiểm nội bộ chạy trong kho, không đụng dữ liệu khách, và cam kết bắt buộc là không gọi git vốn đã được đo.
  file: `tests/vong-doi-thao-tac.test.ts`
  severity: medium
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
