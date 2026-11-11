# Thiết kế: danh mục ReUI tra được trong kho (hàng 1g)

Ngày 11/11/2026 · dãy R · hạng T3 (vùng nằm trong thư mục công cụ; giám sát chốt theo cấu hình kho, tin R-1111-2)

## Vấn đề

Quyết định 0019 đặt thang dùng lại Trong kho → ReUI → Vẽ tay, và đòi agent rơi xuống bậc dưới phải nói đã tra gì, ứng viên gần nhất là gì. Hôm nay agent chỉ tra được ReUI qua máy chủ MCP của ReUI: cần mạng, cần tài khoản, kết quả đổi theo ngày, và không có bản nào để một phiên khác kiểm lại. Thang vì thế chưa đáng tin: «đã tra, không có» không chứng được.

Hàng 1c (cổng chứng minh màn mẫu, dãy D) chờ hàng này để chấm câu «đã tra gì».

## Hiện trạng đã đo

- ReUI không đánh số phiên bản. Hai tệp công khai cho agent: `https://reui.io/llms.txt` (mục lục, có 27 thành phần gốc kèm mô tả) và `https://reui.io/llms-full.txt` (mọi khối Pro và ví dụ miễn phí, mỗi mục một dòng). Máy chủ trả bản mới nhất mỗi lần.
- Bản chụp ngày 11/11/2026: 678 khối Pro trong 7 nhóm, 1.264 ví dụ miễn phí, 27 thành phần gốc. Số khai ở tiêu đề mục khớp số dòng đọc được.
- Giấy phép của kho là gói Pro (MCP `get_project_context` trả `plan: pro`). Biểu tượng chuyển động cần gói Ultimate; mẫu trang là tệp tải về.
- Tệp chụp không có mã nguồn hay khoá giấy phép: chỉ tên, tiêu đề, mô tả và đường dẫn trang.
- Kho công khai. Móc kiểm trước commit chặn tệp trên 500 KB.

## Cách làm

**Bản ghim là ảnh chụp có băm.** Hai tệp nguồn được lưu nguyên văn trong `tools/reui_catalog/snapshot/`. Tệp ghim `tools/reui_catalog/pin.json` ghi với mỗi tệp: đường gốc, tên tệp, số byte, SHA-256, và ngày chụp. Đây là cách duy nhất tái tạo được bản đã ghim, vì ReUI không giữ bản cũ.

**Một lệnh sinh lại, tại máy.** `node tools/reui_catalog/build.mjs` đọc ảnh chụp, kiểm băm với tệp ghim, đọc mục, rồi ghi `design/reui-catalog.json` qua prettier của kho. Chạy hai lần cho cùng một byte. Lệnh không gọi mạng.

**Danh mục gom theo nhóm** để tệp dưới trần 500 KB (bản chụp hôm nay ~410 KB). Mỗi nhóm: loại (`block`, `component`, `example`), nhóm lớn của ReUI nếu có, tên nhóm, đường gốc trang; mỗi mục: tên cài (`@reui/<tên>`), tiêu đề, mô tả nếu có. Đầu tệp mang tệp ghim và số đếm theo loại. Không trường nào khác. Lệnh sinh lại từ chối ghi khi tệp vượt 500 KB và nói rõ vì sao.

**Đọc mục fail-closed.** Mỗi tiêu đề mục của nguồn khai số mục, ví dụ `### Application: App Shell (36)` và `## Pro blocks (678)`. Bộ đọc so số khai với số đọc được ở từng nhóm và từng loại; lệch thì dừng, gọi tên nhóm lệch, không ghi tệp. Dòng có dạng mục mà không đọc được cũng dừng.

**Tra tại máy.** `node tools/reui_catalog/tra.mjs <từ khoá…>` đọc `design/reui-catalog.json`, không gọi mạng. Xếp hạng tất định: trùng nguyên tên cài đứng đầu; sau đó cộng điểm theo từ khớp ở tên, tiêu đề, nhóm, mô tả; hoà thì thành phần gốc trước khối, khối trước ví dụ, rồi theo tên. Mặc định in 10 kết quả: tên cài, loại, nhóm, tiêu đề, đường trang, kèm một dòng «danh mục ReUI ghim ngày …». Lọc được theo loại (`--loai`), đổi số kết quả (`--so`), in JSON (`--json`). Không mục nào khớp thì in câu «không có mục nào khớp» kèm ngày ghim và thoát 1, để «đã tra, không có» thành một bằng chứng chép lại được.

**«Có trong danh mục mà tra không ra thì đỏ».** Bộ kiểm duyệt từng mục của danh mục: tra bằng tên cài phải ra chính nó ở vị trí đầu; tra bằng «tên nhóm + tiêu đề» phải ra nó trong 10 kết quả mặc định. Mục nào trượt thì đỏ, liệt kê tên. Bản thử hôm nay: 1.969/1.969 mục đạt cả hai.

**Kiểm chạy trong `make check`.** Tệp kiểm `tools/reui_catalog/catalog.test.mjs` được vitest của kho tự nhặt, nên không cần sửa Makefile (ngoài ranh giới). `node tools/reui_catalog/build.mjs --check` cũng chạy độc lập: băm khớp ghim, sinh lại trùng byte với tệp đã commit, mọi mục tra ra, không trường hay chuỗi cấm.

**Chỉ tên và mô tả.** Bộ kiểm duyệt danh mục theo danh sách trường được phép, và quét chuỗi cấm: dấu khối mã, `import `, `export `, `Bearer`, `REUI_LICENSE`, chuỗi dạng khoá. Có thì đỏ, gọi tên mục.

**Ghim lại là việc chủ động, có mạng.** `node tools/reui_catalog/build.mjs --refresh` tải hai tệp nguồn, ghi đè ảnh chụp, cập nhật tệp ghim, sinh lại danh mục, rồi in số mục thêm và bớt theo tên. `--from <thư mục>` lấy nguồn từ thư mục tại máy thay cho mạng (để kiểm và để ghim từ bản tải tay). Đây là đường mạng duy nhất.

**Agent biết đến nó** qua `tools/reui_catalog/README.md`: tra thế nào, câu «đã tra, không có» chép ra sao, ghim lại khi nào. Đưa một dòng trỏ vào skill `inventory-ui` và luật `.claude/rules/ui.md` nằm ngoài ranh giới: gửi giám sát yêu cầu việc phụ, hàng 1c dùng trực tiếp.

## Không làm

- Không thêm máy chủ MCP hay mô-đun trong `src/`.
- Không tra biểu tượng và mẫu trang (ngoài giấy phép Pro, hoặc không cài được bằng lệnh).
- Không tự báo ghim cũ; không kiểm tươi trên CI (CI không có mạng tới ReUI là đúng ý định).
- Không dịch từ khoá tiếng Việt sang tiếng Anh; agent tra bằng tiếng Anh như ReUI viết.
- Không sửa skill, luật giao diện, Makefile hay cấu hình prettier của kho.

## Rủi ro

- Chép văn mô tả của ReUI vào kho công khai. Tiêu chí đã ký cho phép tên và mô tả; ReUI tự phát hành đúng tệp này cho agent. Vẫn là việc khó đảo, nên đưa ra Cổng Phạm vi (Hỏi-1).
- ReUI đổi khuôn tệp. Bộ đọc fail-closed khi ghim lại, nên khuôn đổi lộ ra lúc ghim, không lộ lúc tra.
- Danh mục lớn dần. Khi vượt 500 KB lệnh sinh lại dừng và nói rõ; lúc đó cần chọn chia tệp.
