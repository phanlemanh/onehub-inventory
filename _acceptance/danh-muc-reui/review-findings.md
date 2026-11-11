# Review findings: danh-muc-reui (round 2)

## Trong hợp đồng

Không có.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **`--refresh --from` with no folder falls through to a live network re-pin and rewrites tracked files**
  Người dùng thấy gì: Nếu người dùng gõ thiếu tên thư mục khi ghim lại offline, lệnh âm thầm tải từ mạng và đổi bản ghim, dù người dùng muốn làm offline.
  Căn cứ: Chỉ xảy ra khi gõ thiếu đối số, thay đổi hiện rõ trong git và hoàn tác được bằng một lệnh, nên nhẹ; sửa sau vẫn rẻ.
  file: `tools/reui_catalog/build.mjs`
  severity: medium
  Đề xuất: known-limits

- **Reading llms-full.txt drops a whole section silently when its heading changes form**
  Người dùng thấy gì: Nếu ReUI đổi cách ghi tiêu đề mục, lần ghim lại có thể mất cả loại khối mà vẫn báo xanh, và danh mục thiếu hàng trăm mục mà không ai biết.
  Căn cứ: Hậu quả có thể âm thầm và làm sai kết luận «đã tra, không có», nhưng chỉ xảy ra khi ghim lại từ nguồn đổi định dạng và bản cũ vẫn khôi phục được; sửa rẻ nên đáng làm thành việc riêng.
  file: `tools/reui_catalog/catalog.mjs`
  severity: medium
  Đề xuất: new-contract

- **File name, CLI flags and an output line are in Vietnamese, breaking the repo's English-only rule**
  Người dùng thấy gì: Tên lệnh tra và các tuỳ chọn viết bằng tiếng Việt, lệch quy ước tiếng Anh của kho; người dùng không bị ảnh hưởng khi dùng.
  Căn cứ: Không mất dữ liệu và không sai kết quả; chủ kho đã duyệt các tên này, còn đổi tên kéo theo sửa hướng dẫn và nhiều ca kiểm nên tốn hơn lợi ích.
  file: `tools/reui_catalog/tra.mjs`
  severity: medium
  Đề xuất: wont-fix

- **`--loai` with no value is ignored and the lookup returns every kind with exit 0**
  Người dùng thấy gì: Nếu gõ thiếu giá trị loại, lệnh tra không lọc mà vẫn trả kết quả lẫn lộn như thể đã lọc.
  Căn cứ: Kết quả vẫn là dữ liệu thật, chỉ không được lọc; người dùng chạy lại là xong và không có gì bị mất.
  file: `tools/reui_catalog/tra.mjs`
  severity: low
  Đề xuất: known-limits

- **The network blocker does not block `net.Socket#connect` or other low-level paths, though its comment promises "every network call"**
  Người dùng thấy gì: Bộ chặn mạng dùng khi kiểm chưa chặn mọi đường kết nối cấp thấp, nên lời hứa «chặn mọi lời gọi mạng» rộng hơn thực tế.
  Căn cứ: Công cụ hiện chỉ dùng đường đã được chặn nên chưa có rò rỉ thật; chỉ cần ghi rõ giới hạn.
  file: `tools/reui_catalog/no-network.cjs`
  severity: low
  Đề xuất: known-limits

- **Test E10 runs the regenerate command on the real repo, so a drifted catalog gets overwritten during `make check`**
  Người dùng thấy gì: Khi danh mục trong máy đang bị sửa tay, chạy bộ kiểm có thể ghi đè bản sửa đó.
  Căn cứ: Chỉ ảnh hưởng người đang sửa tay danh mục và git còn lưu bản cũ nên khôi phục được; xác suất thấp.
  file: `tools/reui_catalog/catalog.test.mjs`
  severity: low
  Đề xuất: known-limits

- **The offline check runs `git diff` against the staging area, not the commit, and changes the tracked file it checks**
  Người dùng thấy gì: Phép đo «giống bản đã commit» thực ra so với bản đã đưa vào vùng chờ, nên một thay đổi chưa commit có thể lọt qua.
  Căn cứ: Chỉ sai khi có thay đổi danh mục đã đưa vào vùng chờ mà chưa commit, hiếm và thấy được ở bước commit; sửa sau vẫn rẻ.
  file: `_acceptance/config.yaml`
  severity: low
  Đề xuất: known-limits

- **A renamed or reformatted section heading drops a whole kind and still exits green**
  Người dùng thấy gì: Nếu nguồn ReUI đổi chữ hoa thường của tiêu đề hoặc kiểu xuống dòng, danh mục có thể thiếu cả loại khối mà vẫn báo thành công.
  Căn cứ: Âm thầm làm sai kết luận «đã tra, không có» nhưng chỉ khi ghim lại từ nguồn đổi định dạng; bản cũ khôi phục được và sửa rẻ nên mở việc riêng.
  file: `tools/reui_catalog/catalog.mjs`
  severity: medium
  Đề xuất: new-contract

- **`--refresh --from` without a folder silently downloads from the network**
  Người dùng thấy gì: Gõ thiếu thư mục nguồn khi ghim lại thì lệnh bỏ qua ý định offline và tải từ mạng mà không báo.
  Căn cứ: Chỉ xảy ra khi gõ thiếu đối số, thay đổi hiện trong git và hoàn tác được; hậu quả nhẹ.
  file: `tools/reui_catalog/build.mjs`
  severity: low
  Đề xuất: known-limits

- **tra.mjs ignores a missing --loai value and treats unknown flags as search words**
  Người dùng thấy gì: Gõ sai hoặc thiếu tuỳ chọn khi tra thì lệnh vẫn trả kết quả trông hợp lệ nhưng không đúng ý, không có cảnh báo.
  Căn cứ: Kết quả lệch có thể bị chép làm bằng chứng, nhưng chỉ khi gõ sai tuỳ chọn, tra lại là sửa được và không mất dữ liệu.
  file: `tools/reui_catalog/tra.mjs`
  severity: low
  Đề xuất: known-limits

- **E1 offline executor checks against the index, not the commit**
  Người dùng thấy gì: Phép đo ngoại tuyến có thể báo «giống bản đã commit» dù bản đó mới chỉ ở vùng chờ.
  Căn cứ: Chỉ sai trong tình huống hiếm khi danh mục đã được đưa vào vùng chờ, và bước commit sẽ lộ ra; sửa sau rẻ.
  file: `_acceptance/config.yaml`
  severity: low
  Đề xuất: known-limits

- **The network blocker does not cover net.Socket#connect**
  Người dùng thấy gì: Bộ chặn mạng chưa chặn một đường kết nối cấp thấp, nên bằng chứng «chạy khi không có mạng» yếu hơn mô tả.
  Căn cứ: Công cụ hiện không dùng đường đó nên chưa có rò rỉ thật; chỉ cần ghi rõ giới hạn.
  file: `tools/reui_catalog/no-network.cjs`
  severity: low
  Đề xuất: known-limits

- **Hinh dang 5: E6 noi la quet ca lop nhung ma tran viet truoc thieu phan, va so 9 chi la do dai cua chinh ma tran**
  Người dùng thấy gì: Bộ kiểm chuỗi cấm chỉ thử một phần các trường hợp chèn vào ảnh chụp, nên nếu ai làm hỏng việc quét một số chuỗi thì bộ kiểm vẫn xanh.
  Căn cứ: Không ảnh hưởng người dùng hôm nay, nhưng làm lưới an toàn chống lộ nội dung cấm thủng về sau; thêm ca kiểm là việc rẻ nên mở việc riêng.
  file: `tools/reui_catalog/catalog.test.mjs`
  severity: medium
  Đề xuất: new-contract

- **Hinh dang 1: E10 grep cau huong dan 'needs the network' thay vi do dau ra cua lenh --refresh**
  Người dùng thấy gì: Câu hướng dẫn nói lệnh ghim lại cần mạng chỉ được kiểm bằng cách đọc chữ trong hướng dẫn, không phải bằng cách chạy thử.
  Căn cứ: Hợp đồng đã ghi rõ không kiểm đường tải mạng; nếu hành vi đổi thì người dùng thấy ngay khi ghim lại, nhẹ.
  file: `tools/reui_catalog/catalog.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hinh dang 5: AC-1 hua chan MOI loi goi mang nhung E8 chi thu 4 diem, it hon danh sach ham ma bo chan da va**
  Người dùng thấy gì: Bộ kiểm chỉ thử bốn đường chặn mạng chính, chưa thử hết các đường mà bộ chặn đã bao phủ.
  Căn cứ: Đúng bằng yêu cầu đã duyệt và công cụ hiện chỉ dùng đường đã thử; rủi ro thấp.
  file: `tools/reui_catalog/catalog.test.mjs`
  severity: low
  Đề xuất: known-limits

- **File name, CLI flags and an output line are in Vietnamese, which breaks the repo language rule (r1)**
  Người dùng thấy gì: Công cụ tra có tên tệp và tên cờ bằng tiếng Việt, trái quy ước tiếng Anh của kho. Người dùng vẫn tra được bình thường, chỉ là kho chưa nhất quán về cách đặt tên.
  Căn cứ: Hậu quả nhẹ, không mất hay lộ dữ liệu, tra vẫn đúng; đổi tên sau này rẻ nhưng phải sửa cả hướng dẫn và các ca kiểm, và thiết kế đã được chủ kho duyệt với các tên này.
  file: `tools/reui_catalog/tra.mjs`
  severity: medium
  Đề xuất: known-limits

- **The README test runs the regenerate command against the real repo and can overwrite an uncommitted catalog (r1)**
  Người dùng thấy gì: Nếu ai đó đang sửa dở danh mục chưa lưu vào lịch sử, chạy bộ kiểm có thể ghi đè mất bản sửa đó. Trường hợp thường ngày với kho sạch thì không bị ảnh hưởng.
  Căn cứ: Chỉ gây mất việc khi người dùng đang sửa tay danh mục, hiếm gặp, và tệp này sinh lại được từ nguồn nên mất mát nhỏ; sửa sau cũng rẻ.
  file: `tools/reui_catalog/catalog.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **The lookup CLI ignores `--loai` when it has no value, and `--refresh --from` with no folder crashes (r1)**
  Người dùng thấy gì: Gõ thiếu giá trị cho bộ lọc loại thì lệnh vẫn trả kết quả của mọi loại mà không báo lỗi. Ghim lại mà quên chỉ thư mục thì lệnh báo lỗi khó hiểu.
  Căn cứ: Chỉ xảy ra khi gõ sai lệnh, người dùng thấy ngay kết quả lẫn loại và gõ lại được; không mất hay lộ dữ liệu.
  file: `tools/reui_catalog/tra.mjs`
  severity: low
  Đề xuất: known-limits

- **The offline executor compares against the index, not the commit, and changes the tracked file (r1)**
  Người dùng thấy gì: Phép kiểm sinh lại ngoại tuyến có thể báo giống bản đã lưu trong khi thực ra chỉ giống bản đang chuẩn bị lưu. Kết quả báo xanh có thể sai trong trường hợp hiếm đó.
  Căn cứ: Chỉ sai khi có thay đổi danh mục đã chuẩn bị mà chưa lưu, hiếm; chạy lại trên cây sạch là rõ ngay và sửa dòng kiểm rất rẻ.
  file: `_acceptance/config.yaml`
  severity: low
  Đề xuất: known-limits

- **Đọc llms-full.txt bỏ im lặng cả mục Pro blocks hoặc Free examples khi tiêu đề mục đổi dạng; ghim lại vẫn thoát 0 và --check vẫn xanh (r1)**
  Người dùng thấy gì: Nếu ReUI đổi chữ ở tiêu đề một nhóm, lần ghim lại sau có thể lặng lẽ mất cả nhóm khối mà vẫn báo thành công. Agent khi đó sẽ tra «không có» cho những khối thật ra có.
  Căn cứ: Hậu quả khá nặng vì danh mục sai mà không ai biết và agent có thể chép bằng chứng sai, nhưng chỉ xảy ra khi ghim lại sau thay đổi nguồn, và sửa đi kèm một ca kiểm không đắt.
  file: `tools/reui_catalog/catalog.mjs`
  severity: medium
  Đề xuất: new-contract

- **tra.mjs bỏ qua im lặng bộ lọc --loai khi thiếu giá trị và trả kết quả mọi loại với mã thoát 0 (r1)**
  Người dùng thấy gì: Khi gõ thiếu giá trị cho bộ lọc loại, lệnh vẫn trả kết quả lẫn mọi loại như thể không lọc. Người tra có thể hiểu nhầm đó là kết quả đã lọc.
  Căn cứ: Dễ nhận ra vì kết quả lẫn loại, tự gõ lại được và không đụng dữ liệu nào; hậu quả nhẹ.
  file: `tools/reui_catalog/tra.mjs`
  severity: low
  Đề xuất: known-limits

- **Ca E10 chạy lệnh sinh lại trên kho thật, nên khi danh mục lệch nó ghi đè design/reui-catalog.json thật (r1)**
  Người dùng thấy gì: Khi danh mục đang lệch so với nguồn, chạy bộ kiểm sẽ tự sửa danh mục trên đĩa mà không ai chủ ý, làm lần chạy sau xanh dù độ lệch chưa được xem xét.
  Căn cứ: Chỉ xảy ra khi danh mục lệch, hiếm; kết quả là danh mục được sinh lại đúng từ nguồn nên ít hại, và dấu vết vẫn hiện trong thay đổi chưa lưu.
  file: `tools/reui_catalog/catalog.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5: tuyên quét LỚP nhưng chỉ có điểm-case. Ma trận E6 không phủ hết lớp chuỗi cấm × hai bề mặt mà AC-6 hứa (r1)**
  Người dùng thấy gì: Bộ kiểm chỉ thử chèn một phần các chuỗi cấm vào ảnh chụp, nên một số loại chuỗi cấm chưa được chứng minh là bị bắt. Nội dung cấm có thể lọt vào kho công khai mà không ai hay nếu bộ quét hỏng ở những loại đó.
  Căn cứ: Rủi ro là lộ nội dung có bản quyền hay khoá vào kho công khai, khó đảo, nhưng hiện chưa có bằng chứng bộ quét hỏng và bổ sung ca kiểm sau này rẻ.
  file: `tools/reui_catalog/catalog.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3: lời hứa là quan hệ (xếp hạng, cùng kết quả ở hai định dạng) nhưng E4 chỉ kiểm có mặt hoặc đếm số (r1)**
  Người dùng thấy gì: Thứ tự các kết quả tra và việc hai kiểu in cho cùng kết quả chưa được bộ kiểm khẳng định chặt. Nếu sau này thứ tự đổi hay hai kiểu lệch nhau, bộ kiểm có thể không báo.
  Căn cứ: Hậu quả nhẹ vì chỉ là xếp thứ tự hay lệch định dạng, không mất hay lộ dữ liệu, người tra thấy được và bổ sung ca kiểm sau rẻ.
  file: `tools/reui_catalog/catalog.test.mjs`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 2/15 lỗi rơi vào file không bộ đo nào phủ (_acceptance/config.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
