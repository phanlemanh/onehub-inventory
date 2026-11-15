# Review findings: don-no-bo-kiem (round 5)

## Trong hợp đồng

Không có finding nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **The page-ready wait gained a fourth condition (every data region marked) with no failing-direction test**
  Người dùng thấy gì: Bộ kiểm có thể vô tình bỏ mất bước chờ vùng dữ liệu dựng xong mà không ai biết, khiến cảnh báo dựng trang lệch quay lại và bộ kiểm đỏ oan. Người dùng sản phẩm không bị ảnh hưởng.
  Căn cứ: Chỉ ảnh hưởng người chạy bộ kiểm, không mất dữ liệu, nếu đỏ oan thì thấy ngay và sửa được; thêm phép thử sau này rẻ nên ghi lại là đủ.
  file: `tests/e2e/sua-trang.ts`
  severity: medium
  Đề xuất: known-limits

- **Decision d-…-32/33: the `at` time is one hour after the time in the id and after the commit**
  Người dùng thấy gì: Hai dòng trong sổ quyết định ghi giờ muộn hơn một tiếng so với thực tế, nên khi xem lại theo thời gian chúng nằm sau vòng chấm thay vì trước. Người dùng sản phẩm không bị ảnh hưởng.
  Căn cứ: Chỉ làm lệch thứ tự đọc lại sổ nội bộ, không mất dữ liệu hay ảnh hưởng người dùng, và chỉnh lại sau rất rẻ.
  file: `_acceptance/don-no-bo-kiem/decisions.jsonl`
  severity: low
  Đề xuất: known-limits

- **tools/e2e_templates now imports from tests/e2e, reversing the direction the shared browser helpers already use (r4)**
  Người dùng thấy gì: Thư viện bài kiểm dùng chung giờ phụ thuộc ngược vào thư mục test. Người dùng sản phẩm không bị ảnh hưởng; chỉ người bảo trì bộ kiểm thấy cấu trúc hơi lệch hướng.
  Căn cứ: Chỉ là chuyện sắp xếp thư mục trong bộ kiểm, không làm mất hay lộ dữ liệu của ai, và sửa sau vẫn rẻ.
  file: `tools/e2e_templates/runner.ts`
  severity: low
  Đề xuất: known-limits

- **New row 1u log line has no PR or issue link (r4)**
  Người dùng thấy gì: Dòng nhật ký của hàng này trỏ tới một tệp đề xuất chứ không tới PR. Người dùng sản phẩm không thấy gì; người đọc nhật ký phải tự tìm PR.
  Căn cứ: Hậu quả rất nhẹ, chỉ là thiếu một đường dẫn trong nhật ký nội bộ, và có thể bổ sung bất cứ lúc nào.
  file: `wiki/log.md`
  severity: low
  Đề xuất: wont-fix

- **Shape 5 (claims a whole class, tests only a few cases): the hydration guard's 2-pattern matrix has only one red case (r4)**
  Người dùng thấy gì: Phép gác cảnh báo dựng trang lệch mới được thử với một loại cảnh báo, loại thứ hai chưa được thử. Nếu loại này xảy ra, giao diện có thể lệch mà bộ kiểm vẫn xanh.
  Căn cứ: Đã được ghi nhận là giới hạn đã biết; không ảnh hưởng người dùng trực tiếp và bổ sung ca thử sau không đắt.
  file: `tests/e2e/gac-hydration.ts`
  severity: medium
  Đề xuất: known-limits

- **Shape 5 (claims a whole class, tests only a few cases): the 'every call that changes the page' scanner has a hand-picked token list and few break cases (r4)**
  Người dùng thấy gì: Phép kiểm tra tự động còn kẽ hở: một số cách đổi trang trong bộ bài kiểm không bị phát hiện. Người dùng sản phẩm không bị ảnh hưởng, chỉ bộ kiểm có thể bỏ sót.
  Căn cứ: Chỉ ảnh hưởng độ chặt của bộ kiểm nội bộ, không mất dữ liệu người dùng, và có thể mở rộng dần khi gặp ca thật.
  file: `tests/sua-trang-quet.ts`
  severity: medium
  Đề xuất: known-limits

- **Shape 3 (checks that a string is present when the promise is an order between steps): an addInitScript passes just by containing 'data-hydrated' (r4)**
  Người dùng thấy gì: Một bài thử có thể sửa trang quá sớm mà phép kiểm tra vẫn cho qua, gây lại cảnh báo dựng trang lệch và làm bộ kiểm đỏ oan. Người dùng sản phẩm không bị ảnh hưởng.
  Căn cứ: Chỉ làm bộ kiểm kém tin cậy với người chạy nó, tự lộ ra khi chạy lại, và không đụng tới người dùng sản phẩm.
  file: `tests/sua-trang-quet.ts`
  severity: medium
  Đề xuất: known-limits

- **Shape 3 (checks that a string is present when the promise is a lock): KHOA_LOI 'still locked' is only checked by a substring (r4)**
  Người dùng thấy gì: Phép kiểm tra rằng các tệp được miễn vẫn bị khoá chỉ dựa vào việc tên tệp có xuất hiện. Người dùng sản phẩm không ảnh hưởng; bộ kiểm có thể xanh dù khoá thật đã mất.
  Căn cứ: Rủi ro chỉ nằm trong bộ kiểm nội bộ và cần có người vô tình gỡ khoá mới xảy ra, nên chi phí sửa không đáng so với hậu quả.
  file: `tests/sua-trang.test.ts`
  severity: low
  Đề xuất: wont-fix

- **Shape 1 (checks the instructions, not the result): the hydrated mark is checked by searching the source text (r4)**
  Người dùng thấy gì: Phép kiểm tra dấu trang đã tải xong chỉ đọc chữ trong mã, chưa xem trang thật. Người dùng sản phẩm không bị ảnh hưởng; bộ kiểm có thể đỏ oan hoặc xanh nhầm khi thư viện giao diện đổi.
  Căn cứ: Chỉ ảnh hưởng người chạy bộ kiểm, không mất dữ liệu, và lỗi sẽ lộ ra khi các bài e2e chạy trên trang thật.
  file: `tests/sua-trang.test.ts`
  severity: low
  Đề xuất: known-limits

- **Shape 2 (hand-written input, not taken from the real file): the 'configuration without the guard' break passes the literal 'list' instead of a config copy (r4)**
  Người dùng thấy gì: Ca thử cấu hình thiếu phép gác dùng giá trị viết tay thay vì một bản sao cấu hình thật. Người dùng sản phẩm không bị ảnh hưởng; bộ kiểm có thể chưa bắt được một cấu hình lạ thiếu phép gác.
  Căn cứ: Hậu quả nhẹ và chỉ trong bộ kiểm nội bộ, hợp đồng đã chủ động đo cách khác vì lượt đầy đủ cần cơ sở dữ liệu.
  file: `tests/cong-chay.test.ts`
  severity: low
  Đề xuất: known-limits

- **waitReady no longer waits for the data region itself to hydrate: the combined locator plus .first() picks <main> in document order (r3)**
  Người dùng thấy gì: Bộ kiểm trình duyệt có thể coi trang là sẵn sàng sớm hơn thực tế, nên thỉnh thoảng một bài đỏ oan do bấm hay sửa trang quá sớm. Người dùng cuối không bị ảnh hưởng.
  Căn cứ: Chỉ ảnh hưởng bộ kiểm nội bộ, không mất dữ liệu, chạy lại bài là qua; lượt chạy đầy đủ hiện vẫn xanh nên có thể ghi nhận và theo dõi.
  file: `tools/e2e_templates/runner.ts`
  severity: medium
  Đề xuất: known-limits

- **The hydrated-mark comment says the data region uses the same mark (row VP4), but no code anywhere sets data-hydrated except this file (r3)**
  Người dùng thấy gì: Một dòng ghi chú trong mã nói sai về dấu hiệu của vùng dữ liệu, có thể làm người đọc sau này hiểu nhầm. Người dùng không thấy gì.
  Căn cứ: Không ảnh hưởng hành vi hay dữ liệu của ai, chỉ là câu chữ; sửa không đáng để mở việc riêng.
  file: `src/app/hydration-mark.tsx`
  severity: low
  Đề xuất: wont-fix

- **quetTep's doc comment promises to report a file waiting on another PR once, but the code does nothing of the sort (r3)**
  Người dùng thấy gì: Ghi chú của máy quét hứa một việc mà mã không làm, người đọc có thể hiểu nhầm. Người dùng không bị ảnh hưởng.
  Căn cứ: Chỉ là chú thích lệch, bài kiểm vẫn tự lọc đúng nên không có hậu quả thực; chi phí sửa nhỏ nhưng lợi ích gần như không có.
  file: `tests/sua-trang-quet.ts`
  severity: low
  Đề xuất: wont-fix

- **waitReady now waits on <main> instead of the data region: it can say ready before the region is hydrated (r3)**
  Người dùng thấy gì: Bộ kiểm trình duyệt có thể báo trang sẵn sàng trước khi vùng dữ liệu thật sự sẵn sàng, gây thỉnh thoảng đỏ oan hoặc cảnh báo dựng trang. Người dùng cuối không bị ảnh hưởng.
  Căn cứ: Chỉ làm bộ kiểm chập chờn, không mất hay lộ dữ liệu, chạy lại là hết; lượt chạy hiện tại vẫn xanh nên đưa vào hạn chế đã biết.
  file: `tools/e2e_templates/runner.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 (tuyên quét LỚP nhưng chỉ có điểm-case): máy quét «mọi lệnh đổi trang đều qua cửa chung» chỉ thử 3 trên khoảng 17 dấu hiệu đổi trang và bỏ hẳn một loại lệnh (r3)**
  Người dùng thấy gì: Máy canh việc sửa trang chỉ thử vài kiểu sửa nên sau này một kiểu sửa mới có thể lọt qua cửa chung mà không bị báo. Hiện chưa có trường hợp nào thật sự lọt.
  Căn cứ: Hiện chưa có lệnh nào lọt nên chưa gây hại; chỉ là lưới chắn chưa kín, mở rộng sau khi có nhu cầu là đủ.
  file: `tests/sua-trang.test.ts`
  severity: medium
  Đề xuất: known-limits

- **The new hydration helper copies the React check that the shared test runner already has (r2)**
  Người dùng thấy gì: Quy tắc nhận biết trang đã tải xong nằm ở hai chỗ trong bộ kiểm tự động. Người dùng sản phẩm không bị ảnh hưởng; chỉ khi thư viện giao diện đổi cách làm thì một chỗ có thể được sửa còn chỗ kia bị quên, khiến bài kiểm đỏ oan.
  Căn cứ: Không ảnh hưởng người dùng cuối và không mất dữ liệu; nếu lệch thì chỉ làm bài kiểm đỏ và dễ thấy ngay, còn việc gom về một chỗ có thể làm sau với chi phí thấp.
  file: `tests/e2e/da-gan.ts`
  severity: low
  Đề xuất: known-limits

- **Thay đổi chạm tools/** nên cả PR rơi vào bậc high: cần chủ mã duyệt, tác tử không được tự gộp (r1)**
  Người dùng thấy gì: Thay đổi này cần chủ kho duyệt trước khi gộp, tác tử không tự gộp được. Người dùng cuối không bị ảnh hưởng gì.
  Căn cứ: Chỉ là bước duyệt thêm theo quy trình, không mất hay lộ dữ liệu của ai, và đã được nêu ở cổng phạm vi nên ghi lại là đủ.
  file: `tools/wiki_lint.py`
  severity: low
  Đề xuất: known-limits

- **Hydration guard is silently missing from the CI database job because the command-line reporter flag replaces the config's reporters (r1)**
  Người dùng thấy gì: Khi chạy kiểm tra tự động trên CI có cơ sở dữ liệu, cảnh báo dựng trang lệch vẫn có thể lọt qua mà không làm lượt chạy đỏ. Người dùng không thấy ngay, nhưng lỗi giao diện kiểu này có thể đến tay họ mà không ai hay.
  Căn cứ: Không mất dữ liệu và chỉ ảnh hưởng độ chắc của lưới kiểm tra trên CI, vẫn còn chạy được ở máy dev; sửa rẻ nhưng nằm ngoài những gì hàng này đã hứa nên nên đăng thành việc riêng.
  file: `db/scripts/ci-db.sh`
  severity: medium
  Đề xuất: new-contract

- **Hình dạng 5 (tuyên quét lớp nhưng chỉ có điểm-case): phép gác hydration bắt hai mẫu, nhưng chỉ một mẫu có chiều đỏ (r1)**
  Người dùng thấy gì: Phép gác cảnh báo dựng trang lệch mới được thử đỏ cho một loại cảnh báo, loại thứ hai chưa được thử. Nếu loại này xảy ra, giao diện có thể lệch mà bộ kiểm vẫn xanh.
  Căn cứ: Hậu quả nhẹ vì chỉ là một loại cảnh báo hiếm chưa được chứng minh, không mất dữ liệu, và có thể bổ sung sau khi gặp ca thật.
  file: `tests/e2e/gac-hydration.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2 (fixture viết tay đúng khuôn bên đọc): chiều đỏ của «cấu hình thiếu phép gác» đưa chuỗi 'list' gõ tay, không nạp bản sao cấu hình (r1)**
  Người dùng thấy gì: Bài thử kiểm tra việc thiếu phép gác dùng dữ liệu viết tay nên có thể không bắt được nếu cấu hình thật đổi sang dạng khác. Người dùng không bị ảnh hưởng trực tiếp.
  Căn cứ: Rủi ro rất nhỏ, chỉ xảy ra nếu sau này ai đó đổi dạng cấu hình, không ảnh hưởng người dùng và không mất dữ liệu; công sửa không đáng so với hậu quả.
  file: `tests/cong-chay.test.ts`
  severity: low
  Đề xuất: wont-fix

- **onResult passes its page-changing code as a string through a raw page.evaluate, so the 'one door' static check cannot see it (r3 · tệp đã đổi)**
  Người dùng thấy gì: Phép kiểm tra tự động có một kẽ hở: một chỗ trong bộ bài kiểm vẫn đổi trang mà phép kiểm tra không thấy. Hiện chỗ đó chạy an toàn, người dùng sản phẩm không bị ảnh hưởng.
  Căn cứ: Chỉ là kẽ hở trong công cụ kiểm tra nội bộ, hiện chưa gây lỗi gì và người dùng không thấy; sửa sau vẫn rẻ nếu có người thêm bài mới đi qua kẽ này.
  file: `tools/e2e_templates/recipes.ts`
  severity: low
  Đề xuất: known-limits

- **The 'go nut Xoa loc' break never removes a button that is already on the page when the hydrated mark appears (r3 · tệp đã đổi)**
  Người dùng thấy gì: Một bài phá thử trong bộ kiểm có thể thỉnh thoảng báo đỏ sai vì nút chưa bị gỡ kịp. Chỉ ảnh hưởng người chạy bộ kiểm, không ảnh hưởng người dùng sản phẩm.
  Căn cứ: Hậu quả nhẹ: chỉ làm bộ kiểm đỏ oan lúc nào đó và chạy lại là qua; không mất dữ liệu và không chạm người dùng cuối.
  file: `tools/e2e_templates/recipes.ts`
  severity: medium
  Đề xuất: known-limits

- **The two page-stripping breaks start on the root mark, which can come before the data region's loading boundary has hydrated (r3 · tệp đã đổi)**
  Người dùng thấy gì: Hai bài phá thử có thể bắt đầu sửa trang quá sớm và gây lại cảnh báo dựng trang lệch, làm bộ kiểm đỏ oan. Người dùng sản phẩm không bị ảnh hưởng.
  Căn cứ: Chỉ làm bộ kiểm đỏ oan thỉnh thoảng, chạy lại là hết, không lộ hay mất dữ liệu; nhưng nếu lặp lại thì đúng nợ mà hàng này muốn dọn nên đáng theo dõi.
  file: `tools/e2e_templates/recipes.ts`
  severity: medium
  Đề xuất: known-limits

- **The pageReady deadline is not enforced when the given element is missing: locator.evaluate waits until the test timeout, and .catch(() => false) hides the cause (r3 · tệp đã đổi)**
  Người dùng thấy gì: Khi một màn thiếu tiêu đề, bài kiểm sẽ treo đến hết giờ dài thay vì báo lỗi sớm với nguyên nhân rõ. Chỉ làm người chạy bộ kiểm chờ lâu hơn.
  Căn cứ: Chỉ xảy ra ở màn hiếm khi thiếu mọi phần tử chờ và chỉ làm chậm, không sai kết quả; chi phí sửa nhỏ nhưng hậu quả cũng rất nhẹ.
  file: `tests/e2e/sua-trang.ts`
  severity: low
  Đề xuất: wont-fix

- **The new hydration helper copies the React check that the shared test runner already has (r2)**
  Người dùng thấy gì: Quy tắc nhận biết trang đã tải xong nằm ở hai chỗ trong bộ kiểm tự động. Người dùng sản phẩm không bị ảnh hưởng; chỉ khi thư viện giao diện đổi cách làm thì một chỗ có thể được sửa còn chỗ kia bị quên, khiến bài kiểm đỏ oan.
  Căn cứ: Không ảnh hưởng người dùng cuối và không mất dữ liệu; nếu lệch thì chỉ làm bài kiểm đỏ và dễ thấy ngay, còn việc gom về một chỗ có thể làm sau với chi phí thấp.
  file: `tests/e2e/da-gan.ts`
  severity: low
  Đề xuất: known-limits

- **Thay đổi chạm tools/** nên cả PR rơi vào bậc high: cần chủ mã duyệt, tác tử không được tự gộp (r1)**
  Người dùng thấy gì: Thay đổi này cần chủ kho duyệt trước khi gộp, tác tử không tự gộp được. Người dùng cuối không bị ảnh hưởng gì.
  Căn cứ: Chỉ là bước duyệt thêm theo quy trình, không mất hay lộ dữ liệu của ai, và đã được nêu ở cổng phạm vi nên ghi lại là đủ.
  file: `tools/wiki_lint.py`
  severity: low
  Đề xuất: known-limits

- **Hydration guard is silently missing from the CI database job because the command-line reporter flag replaces the config's reporters (r1)**
  Người dùng thấy gì: Khi chạy kiểm tra tự động trên CI có cơ sở dữ liệu, cảnh báo dựng trang lệch vẫn có thể lọt qua mà không làm lượt chạy đỏ. Người dùng không thấy ngay, nhưng lỗi giao diện kiểu này có thể đến tay họ mà không ai hay.
  Căn cứ: Không mất dữ liệu và chỉ ảnh hưởng độ chắc của lưới kiểm tra trên CI, vẫn còn chạy được ở máy dev; sửa rẻ nhưng nằm ngoài những gì hàng này đã hứa nên nên đăng thành việc riêng.
  file: `db/scripts/ci-db.sh`
  severity: medium
  Đề xuất: new-contract

- **Hình dạng 5 (tuyên quét lớp nhưng chỉ có điểm-case): phép gác hydration bắt hai mẫu, nhưng chỉ một mẫu có chiều đỏ (r1)**
  Người dùng thấy gì: Phép gác cảnh báo dựng trang lệch mới được thử đỏ cho một loại cảnh báo, loại thứ hai chưa được thử. Nếu loại này xảy ra, giao diện có thể lệch mà bộ kiểm vẫn xanh.
  Căn cứ: Hậu quả nhẹ vì chỉ là một loại cảnh báo hiếm chưa được chứng minh, không mất dữ liệu, và có thể bổ sung sau khi gặp ca thật.
  file: `tests/e2e/gac-hydration.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2 (fixture viết tay đúng khuôn bên đọc): chiều đỏ của «cấu hình thiếu phép gác» đưa chuỗi 'list' gõ tay, không nạp bản sao cấu hình (r1)**
  Người dùng thấy gì: Bài thử kiểm tra việc thiếu phép gác dùng dữ liệu viết tay nên có thể không bắt được nếu cấu hình thật đổi sang dạng khác. Người dùng không bị ảnh hưởng trực tiếp.
  Căn cứ: Rủi ro rất nhỏ, chỉ xảy ra nếu sau này ai đó đổi dạng cấu hình, không ảnh hưởng người dùng và không mất dữ liệu; công sửa không đáng so với hậu quả.
  file: `tests/cong-chay.test.ts`
  severity: low
  Đề xuất: wont-fix

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
