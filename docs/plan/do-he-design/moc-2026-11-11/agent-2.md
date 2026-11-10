# Phương án agent 2

Bản kho: `/private/tmp/claude-501/-Users-manhphan-dev-onehub-inventory--claude-worktrees-recursing-herschel-c4214a/b5157e36-b8ad-4efc-9799-b32ee3ccb9a4/scratchpad/moc-tree` (commit `c706223`).

## Câu giao đã gửi (nguyên văn)

> Bạn là agent lập trình mới vào kho onehub-inventory ở thư mục `/private/tmp/claude-501/-Users-manhphan-dev-onehub-inventory--claude-worktrees-recursing-herschel-c4214a/b5157e36-b8ad-4efc-9799-b32ee3ccb9a4/scratchpad/moc-tree`. Chỉ đọc tệp trong thư mục đó (node_modules trong đó cũng được), không đọc thư mục nào khác. Hãy lập phương án dựng màn danh sách «Liên hệ» (Contact) cho nhân viên sàn: xem danh sách liên hệ, tìm, lọc, mở hồ sơ một liên hệ. Đọc đúng những gì kho yêu cầu đọc trước khi làm (AGENTS.md, CLAUDE.md và các tệp chúng trỏ tới), như khi bạn sắp dựng thật. Không viết mã, không sửa tệp nào.
>
> Trả về phương án dưới dạng danh sách quyết định thiết kế. Mỗi quyết định một dòng gồm: tên quyết định, lựa chọn của bạn, căn cứ (đường tệp trả lời quyết định này, hoặc «tự đoán»), và với quyết định tự đoán thì ghi thêm đây là việc hệ thiết kế lẽ ra phải trả lời sẵn hay việc sản phẩm cần người quyết. Tối thiểu phải có các quyết định: bố cục, có tạo khuôn mới không, thành phần bảng, cấu hình bảng, chiều cao dòng, cách nạp dữ liệu, căn cột số, căn cột ngày, bề rộng cột, đường dẫn và mô tả trang, tiêu đề trang, số đếm, trạng thái chờ tải và chưa có dữ liệu, tìm không ra, lỗi tải, định dạng số, định dạng ngày, địa chỉ riêng của hồ sơ, phím Esc và bàn phím, điện thoại, nhãn màn. Thêm mọi quyết định khác bạn phải đưa ra.
>
> Cuối bài ghi: số lượt gọi công cụ, số tệp đã đọc, danh sách tệp đã đọc.
>
> Trả lời bằng tiếng Việt, toàn bộ phương án trong câu trả lời cuối (dạng markdown).

## Phương án trả về (nguyên văn)

## Phương án dựng màn «Liên hệ»

Tôi chỉ đọc trong thư mục `moc-tree`, không viết mã, không sửa tệp nào.

**Điều quan trọng nhất trước bảng:** màn này đang đi trước nền của nó. Màn Liên hệ nằm ở mục `L2` («nhà Liên hệ»), tức là để sau đợt 1. Hàng `1d` chỉ yêu cầu «khai trước vào họ Lưới». Những thứ màn này phải dựa vào đều chưa có:

- Lưới dùng chung (`1b`);
- hồ sơ cạnh bảng, chờ tải, lỗi, lọc rỗng (`1e`);
- màn mẫu Bảng hàng (hàng `2`);
- bản đồ khuôn `design/patterns/`, `design/recipes/`, `design/screens.yaml`;
- cơ sở dữ liệu, `withCompany`, bảng quyền `9a`.

Nếu dựng ngay thì gần như mọi quyết định hành vi phải tự đoán. Đây đúng là kiểu lệch đã gây «43 chỗ khác» ở Quỹ hàng (0019).

Cột «Loại» trong bảng:

- **Có căn cứ**: kho đã trả lời.
- **Một phần**: có luật nhưng thiếu giá trị để áp.
- **Tự đoán – HTK**: hệ thiết kế lẽ ra phải trả lời sẵn.
- **Tự đoán – SP**: việc sản phẩm, người phải quyết.

| #   | Quyết định                              | Lựa chọn                                                                                                                                                                                    | Căn cứ                                                                                                                                                                                                                                            | Loại                                           |
| --- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| 1   | Thời điểm dựng                          | Chỉ khai màn vào họ Lưới và sổ màn. Dựng sau khi có `1b`, `1e` và màn mẫu Bảng hàng                                                                                                         | `docs/plan/pham-vi-mvp-dot-1.md` (L2), `docs/plan/lo-trinh.json` (hàng 1d, 1e, 2), `wiki/decisions/0020-…md`                                                                                                                                      | Tự đoán – SP                                   |
| 2   | Họ màn                                  | Họ Lưới (thay Sheet và Excel)                                                                                                                                                               | `wiki/decisions/0019-…md`, `lo-trinh.json` hàng 1d                                                                                                                                                                                                | Có căn cứ                                      |
| 3   | Bố cục                                  | Dùng `AppShell` có sẵn. Kiểu màn «bảng quản lý» (đầu vùng, thanh tìm và lọc, lưới) đặt trong **một** Frame, màn vận hành, mật độ dày                                                        | `src/components/templates/app-shell.tsx`, `.claude/skills/reui/rules/compose.md`, `.claude/skills/inventory-ui/SKILL.md` (một họ khung mỗi màn). Bản đồ khuôn `design/patterns/` chưa có (0013), nên kiểu màn lấy từ skill của ReUI, không từ kho | Một phần – HTK                                 |
| 4   | Có tạo khuôn mới không                  | Không. Khuôn hồ sơ cạnh bảng là việc của `1e` («chỉ có một cách dựng», nhận cả căn lẫn người)                                                                                               | `lo-trinh.json` hàng 1e, `wiki/decisions/0020-…md`, `inventory-ui/SKILL.md`                                                                                                                                                                       | Có căn cứ                                      |
| 5   | Chỗ đặt mã                              | Bảng riêng của Liên hệ ở `src/modules/contacts/ui/`. Lưới dùng chung ở `src/components/candidate/` (thư mục này chưa tồn tại)                                                               | `inventory-ui/SKILL.md`, `docs/design-standard-proposal.md` mục 3                                                                                                                                                                                 | Có căn cứ                                      |
| 6   | Thành phần bảng                         | `data-grid` của ReUI (TanStack v9), không dùng `<table>` trần                                                                                                                               | `design/decisions.yaml` (raw-table, có lint chặn), `.claude/skills/reui/SKILL.md`, `rules/components.md`                                                                                                                                          | Có căn cứ                                      |
| 7   | Cấu hình bảng                           | Đầu bảng dính, ghim cột Họ tên, không kéo đổi cỡ cột, không chọn dòng, không kéo thả, không sửa trên ô. Dữ liệu và chia trang phía máy chủ (`manualPagination`, `rowCount`)                 | `components.md` có nêu `tableLayout`, nhưng `design/component-registry.json` ghi DataGrid chỉ có prop `table`. Inventory-ui cấm đọc mã nguồn để tra, nên không biết được bộ khoá đầy đủ                                                           | Tự đoán – HTK                                  |
| 8   | Chiều cao dòng                          | Áp công thức: tổng bề rộng tối thiểu vượt vùng nội dung thì dày (`h-10`, `text-sm`), không thì thường (`h-12`, `text-base`). Ước tính: thường ở 1024/1440, dày ở 360/414                    | `design/behaviors.md` (Mật độ bảng), dòng `table-density` trong `decisions.yaml` (chưa có lệnh kiểm). Không có «độ dài mẫu của kiểu» nên không tính chắc được. Chưa rõ data-grid đặt mật độ bằng khoá nào                                         | Một phần – HTK                                 |
| 9   | Cách nạp dữ liệu                        | Server Component đọc qua `contacts/server.ts` dưới `withCompany`. Trước khi có cơ sở dữ liệu thì đọc dữ liệu mẫu MAU của hàng `1`. Không giữ bản sao trên máy                               | `AGENTS.md` (SP-1, chưa có ngoại tuyến), `wiki/decisions/0020-…md`. Chưa có cả `server.ts`, `withCompany` lẫn dữ liệu mẫu                                                                                                                         | Một phần – HTK                                 |
| 10  | Chia trang                              | Phân trang máy chủ, 50 dòng mỗi trang, số trang giữ trong URL                                                                                                                               | `behaviors.md` chỉ ghi «Chốt ở lát cắt Bảng hàng», chưa chốt                                                                                                                                                                                      | Tự đoán – HTK                                  |
| 11  | Căn cột số                              | Canh phải, `tabular-nums`. Chỉ một cột số: «Số căn» (kiểu `count`, cột suy ra)                                                                                                              | `behaviors.md` (Canh cột), `RIGHT_ALIGNED_KINDS` trong `src/generated/display.ts`, `components.md`. Cột suy ra phải khai ở `design/recipes/`, thư mục này chưa có                                                                                 | Có căn cứ (riêng chỗ khai cột suy ra: HTK)     |
| 12  | Căn cột ngày                            | Canh trái. Bản đầu không có cột ngày vì Contact không có trường ngày nào                                                                                                                    | `behaviors.md`, `display.ts`, `ontology/entities/Contact.yaml`                                                                                                                                                                                    | Có căn cứ                                      |
| 13  | Bề rộng cột                             | Áp `max(độ dài nhãn, độ dài mẫu) × 1ch + đệm`. Tạm đặt: Họ tên 24ch, Số điện thoại 14ch, Loại 18ch, Số căn 8ch, Người giữ 20ch                                                              | Công thức có ở `behaviors.md`, nhưng kho không có giá trị «độ dài mẫu của kiểu» và «đệm»                                                                                                                                                          | Một phần – HTK                                 |
| 14  | Đường dẫn trang                         | `/contacts` (tên tệp và đoạn đường dẫn viết tiếng Anh)                                                                                                                                      | `AGENTS.md` mục Language. Sổ màn `design/screens.yaml` của hàng 1d chưa có                                                                                                                                                                        | Tự đoán – HTK                                  |
| 15  | Mô tả trang                             | Bỏ câu mô tả dưới tiêu đề cho tới khi có chỗ chứa câu chữ                                                                                                                                   | `rules/compose.md` muốn tiêu đề kèm một vế mô tả. Nhưng `language.md` cấm viết cứng chữ trong `src/`, `labels.yaml` chỉ chứa nhãn, và `decisions.yaml` xếp `copy-content` là phán đoán. `design/content.md` (đề xuất mục 4) chưa có               | Tự đoán – SP                                   |
| 16  | Tiêu đề trang                           | Một `h1` = `label("Contact")` → «Liên hệ», qua `AppShell title`. Tiêu đề tab tạm giữ «OneHub» vì việc đặt tiêu đề tab theo màn (`F1`) chưa dựng                                             | `ontology/labels.yaml`, `src/modules/company-config/index.ts`, `tests/e2e/shell.spec.ts` (một main, một h1), `src/app/layout.tsx`                                                                                                                 | Có căn cứ (tiêu đề tab: HTK)                   |
| 17  | Mục điều hướng                          | Thêm `{ href: "/contacts", title: label("Contact") }` vào thanh bên. Đánh dấu mục đang chọn và điều hướng theo vai chờ `F1`                                                                 | `src/app/nav.ts`. `Contact` là khái niệm loại entity, không phải loại «surface» như Bảng hàng                                                                                                                                                     | Một phần – HTK                                 |
| 18  | Số đếm                                  | Tổng số liên hệ khớp bộ lọc, đặt cạnh tiêu đề vùng bằng Badge `outline`, định dạng `vi-VN`                                                                                                  | `rules/layout.md` (badge trung tính cho số đếm). Thành phần đầu vùng (`F7`) chưa có, chỗ và câu chữ chưa chốt                                                                                                                                     | Tự đoán – HTK                                  |
| 19  | Chờ tải                                 | Dưới 1 giây không chỉ báo. Từ 1 giây hiện khung chờ đúng bố cục (`isLoading` và `meta.skeleton` của data-grid). Không dùng `loading.tsx` hiện ngay                                          | `design/states.md`, `behaviors.md`, `components.md`. Cách hoãn 1 giây chưa có thành phần (`F6`)                                                                                                                                                   | Một phần – HTK                                 |
| 20  | Chưa có dữ liệu                         | `Empty` của shadcn, nói vì sao trống. Không có nút «Thêm liên hệ» vì tạo liên hệ không thuộc phạm vi. Có thể trỏ sang Bảng hàng, nơi chủ nhà sinh ra liên hệ                                | `states.md` (nói vì sao và làm gì tiếp), `rules/compose.md`. Hành động và câu chữ chưa ai quyết                                                                                                                                                   | Tự đoán – SP                                   |
| 21  | Tìm không ra                            | `Empty` kèm nút «Xoá lọc» bắt buộc                                                                                                                                                          | `states.md`. Nhãn «Xoá lọc» chưa có trong `labels.yaml`, phải thêm (đổi ontology, cần người duyệt)                                                                                                                                                | Một phần – HTK                                 |
| 22  | Lỗi tải                                 | Báo ngay trong vùng (`emptyMessage` của data-grid) bằng câu ba phần kèm «Thử lại». Sự cố cả màn báo bằng băng trên màn                                                                      | `states.md`, `design/language.md` (câu lỗi), `behaviors.md` (Kênh thông báo). Nhãn «Thử lại» chưa có trong `labels.yaml`                                                                                                                          | Một phần – HTK                                 |
| 23  | Một phần hỏng                           | Nếu riêng phần số căn hay người giữ lỗi: ô hiện «—» và băng nhỏ nói phần nào hỏng, bảng vẫn dùng được                                                                                       | `states.md` chỉ yêu cầu, không nói cách làm                                                                                                                                                                                                       | Tự đoán – HTK                                  |
| 24  | Không đủ quyền                          | Nói rõ, không lộ dữ liệu. Ai được vào và phạm vi Của tôi hay Toàn sàn chờ bảng quyền `9a`                                                                                                   | `states.md`, `wiki/decisions/0016-…md`                                                                                                                                                                                                            | Tự đoán – SP                                   |
| 25  | Chữ dài                                 | Cắt bằng `truncate`, đọc đủ qua chú thích nổi và trong hồ sơ                                                                                                                                | `states.md` («có cách đọc đủ»), `rules/layout.md`                                                                                                                                                                                                 | Một phần – HTK                                 |
| 26  | Định dạng số                            | `Intl.NumberFormat("vi-VN")` qua một hàm dùng chung                                                                                                                                         | `language.md`, `decisions.yaml` (`format-number-date`, chưa có lệnh kiểm), đề xuất mục 5. Bộ định dạng `F3` chưa dựng, lint cấm gọi thẳng chưa có                                                                                                 | Một phần – HTK                                 |
| 27  | Định dạng ngày                          | `Intl.DateTimeFormat("vi-VN")`, lưu theo ISO 8601. Kiểu hiện (ngày/tháng/năm hay «3 ngày trước») chưa chốt. Bản đầu không dùng                                                              | `language.md`, đề xuất mục 1                                                                                                                                                                                                                      | Một phần – HTK                                 |
| 28  | Số điện thoại: dữ liệu                  | Thêm trường số điện thoại của Contact (nhiều số, kiểu `phone`, đánh dấu dữ liệu cá nhân, lưu E.164) qua `/ontology-add`                                                                     | Wiki và mô-đun nói «nhiều số», nhưng `Contact.yaml` và `display.ts` không có trường này. Lưu dạng rõ theo 0014                                                                                                                                    | Tự đoán – SP (đổi ontology, mức cao)           |
| 29  | Số điện thoại: hiển thị                 | Danh sách hiện số đã che. Hồ sơ có nút «Hiện số», bấm mới gọi máy chủ và ghi nhật ký. Tìm theo số chạy ở máy chủ                                                                            | Đề xuất (bản che), hàng `13` («mở số»), `N10` (nhật ký mở số). Ai được mở và có che trên danh sách hay không chưa chốt; nhật ký chưa có                                                                                                           | Tự đoán – SP                                   |
| 30  | Màn trên điện thoại                     | Thanh bên thu gọn. Bảng cuộn ngang **trong** Frame (có `min-w`), cột Họ tên ghim, trang không cuộn ngang. Hồ sơ mở toàn màn                                                                 | `behaviors.md` (Mở hồ sơ, Điều hướng điện thoại), `components.md`, kiểm không cuộn ngang trong `shell.spec.ts`. Thẻ hay bảng trên điện thoại chưa chốt cho Lưới (Bảng hàng có thẻ riêng, `B3`)                                                    | Một phần – HTK                                 |
| 31  | Địa chỉ riêng của hồ sơ                 | `/contacts/[contactId]`. Bấm từ danh sách thì mở hồ sơ cạnh bảng (Sheet) bằng cơ chế chặn đường dẫn kèm vùng song song của Next. Tải lại hay mở link thì ra thẳng trang hồ sơ               | `behaviors.md` («Có địa chỉ riêng»), tài liệu Next `intercepting-routes.md`, `parallel-routes.md`. Cách dựng là việc của `1e`                                                                                                                     | Tự đoán – HTK                                  |
| 32  | Phím Esc và bàn phím                    | Esc đóng hồ sơ và trả tiêu điểm về dòng cũ. Mỗi dòng mở bằng liên kết ở ô Họ tên (Tab rồi Enter). Không bật di chuyển ô bằng phím mũi tên ở bản đọc. Đầu bảng dính không che dòng đang chọn | `behaviors.md`, `decisions.yaml` (`focus-not-obscured`). Trả tiêu điểm sau khi quay lại bằng URL phải tự làm                                                                                                                                      | Một phần – HTK                                 |
| 33  | Nhãn màn                                | «Liên hệ», không dùng «Danh bạ». Loại liên hệ: Chủ bán, Chủ cho thuê, Người mua, Người thuê. Cột người phụ trách: «Người giữ»                                                               | `ontology/labels.yaml`, `ontology/glossary.md`, `AGENTS.md` (giữ tách bên giao dịch, môi giới, chủ thể)                                                                                                                                           | Có căn cứ                                      |
| 34  | Nhãn còn thiếu                          | Thêm vào `labels.yaml`: Họ tên, Loại liên hệ, Số điện thoại, Số căn, ô tìm, Xoá lọc, Thử lại. Nêu trong mô tả PR                                                                            | `labels.yaml` không có các khái niệm trường và hành động này. `language.md` mục 7                                                                                                                                                                 | Một phần – HTK (đổi ontology, cần người duyệt) |
| 35  | Cột và thứ tự                           | Họ tên, Loại liên hệ, Số điện thoại, Số căn, Người giữ                                                                                                                                      | `decisions.yaml` xếp `information-order` là phán đoán                                                                                                                                                                                             | Tự đoán – SP                                   |
| 36  | Sắp xếp mặc định                        | Họ tên A–Z, so sánh theo `vi`                                                                                                                                                               | Kho không nói                                                                                                                                                                                                                                     | Tự đoán – SP                                   |
| 37  | Tìm                                     | Một ô tìm theo tên và số, có dấu hay không dấu đều khớp, chạy ở máy chủ, giữ trong URL (`?q=`)                                                                                              | `language.md` mục 4 chỉ nói tìm khớp cả nhãn thay thế. Phần tìm và lọc của `F7` chưa dựng                                                                                                                                                         | Tự đoán – HTK                                  |
| 38  | Lọc                                     | `filters` của ReUI, kiểu chip trên thanh công cụ. Trường lọc: Loại liên hệ (lựa chọn lấy từ nhãn), Người giữ. Bộ lọc giữ trong URL                                                          | `.claude/skills/reui/SKILL.md` (bộ lọc do `filters` đảm nhiệm). Chọn trường nào để lọc là việc sản phẩm                                                                                                                                           | Tự đoán – SP                                   |
| 39  | Hiển thị loại liên hệ                   | Badge `outline` (thẻ trung tính), một liên hệ nhiều loại thì nhiều badge                                                                                                                    | `rules/layout.md`. `contactTypes` hiện là một chuỗi, chưa rõ cách mã hoá nhiều giá trị                                                                                                                                                            | Một phần – SP (ontology)                       |
| 40  | Người giữ và các căn                    | Ghép ở `src/app` qua cửa `server.ts` của `contacts`, `identity`, `listings`, vì `contacts` không được phụ thuộc mô-đun khác                                                                 | `architecture/modules.yaml` (`depends_on` rỗng), `AGENTS.md` (Architecture). Thêm phụ thuộc thì phải có trang quyết định                                                                                                                          | Có căn cứ                                      |
| 41  | Nội dung hồ sơ                          | Họ tên, các loại, số điện thoại (che hoặc hiện), người giữ, các căn của người đó. Chỉ đọc, phần sửa thuộc `18b`                                                                             | `ontology/relations.yaml` (Contact owns Listing), `lo-trinh.json` hàng 18b. Thứ tự là phán đoán                                                                                                                                                   | Tự đoán – SP                                   |
| 42  | Chữ tiếng Việt của data-grid và filters | Truyền nhãn tiếng Việt qua prop nhãn của thành phần (phân trang, «không có kết quả»)                                                                                                        | `components.md` (`labels` của filters). Chữ này chưa có trong `labels.yaml`; chưa đọc mã nhà cung cấp theo luật inventory-ui                                                                                                                      | Tự đoán – HTK                                  |
| 43  | Sáng, tối, chuyển động                  | Cả hai giao diện. Không có hiệu ứng xuất hiện                                                                                                                                               | `behaviors.md` (Giao diện), `rules/compose.md` (màn vận hành)                                                                                                                                                                                     | Có căn cứ                                      |
| 44  | Kiểm thử                                | Thêm màn vào bài axe ở sáng và tối, bốn khổ 360, 414, 1024, 1440. Mỗi trạng thái có bài kiểm chứng minh đỏ được khi phá. Có khối Vai × Màn                                                  | `inventory-ui/SKILL.md`, `playwright.config.ts`, `wiki/decisions/0015-…md`, `wiki/decisions/0017-…md`                                                                                                                                             | Có căn cứ                                      |
| 45  | Dữ liệu thử                             | Tên `[Tên]`, số `0900 000 0xx`, nhãn MAU                                                                                                                                                    | `.claude/rules/personal-data.md`, `wiki/decisions/0020-…md`                                                                                                                                                                                       | Có căn cứ                                      |
| 46  | Mức tự chủ                              | Mức cao vì chạm `ontology/` (nhãn, trường số điện thoại). Phải có người duyệt trước khi bắt đầu                                                                                             | `governance/autonomy.yaml`, `AGENTS.md` (Autonomy tiers)                                                                                                                                                                                          | Có căn cứ                                      |
| 47  | Trang khách                             | Không đưa gì của `contacts` ra `src/app/s/**`                                                                                                                                               | `PRODUCT-INVARIANTS.md` (SP-4)                                                                                                                                                                                                                    | Có căn cứ                                      |

**Tổng: 47 quyết định.**

- Có căn cứ đầy đủ: 15 (gồm hai dòng phần lớn có căn cứ, chỉ một chi tiết còn hở: dòng 11 và 16).
- Một phần, hệ thiết kế: 15.
- Tự đoán, hệ thiết kế: 7.
- Tự đoán hoặc một phần, sản phẩm: 10.

**Chỗ hở lớn nhất của hệ thiết kế:**

- Chia trang chưa chốt.
- Hai công thức (bề rộng cột, mật độ) thiếu giá trị đầu vào.
- Chưa có cách dựng địa chỉ riêng, Esc và bản điện thoại cho hồ sơ cạnh bảng.
- Chưa có chỗ chứa câu chữ trạng thái và nhãn hành động chung.
- Danh mục thành phần thiếu cấu hình của DataGrid.

**Khuyến nghị:** lúc này chỉ khai màn Liên hệ vào sổ màn và họ Lưới như hàng `1d` yêu cầu. Dựng màn sau khi `1b`, `1e` và Bảng hàng xong. Khi đó khoảng 20 dòng tự đoán về hệ thiết kế sẽ có câu trả lời sẵn.

**Một quyết định cần người:** dựng màn Liên hệ ngay, hay chờ màn mẫu Bảng hàng?

---

**Số lượt gọi công cụ:** 21 lượt đọc (Bash), cộng lượt nộp báo cáo này là 22.

**Số tệp đã đọc:** 53. Một số tệp chỉ đọc một phần, có ghi ở cuối dòng.

1. AGENTS.md
2. CLAUDE.md
3. wiki/index.md
4. PRODUCT-INVARIANTS.md
5. PRODUCT-MAP.md
6. .claude/rules/ui.md
7. .claude/rules/personal-data.md
8. .claude/skills/inventory-ui/SKILL.md
9. .claude/skills/reui/SKILL.md
10. .claude/skills/reui/rules/compose.md
11. .claude/skills/reui/rules/layout.md
12. .claude/skills/reui/rules/components.md (phần data-grid, frame, base và radix)
13. ontology/glossary.md
14. ontology/entities/Contact.yaml
15. ontology/labels.yaml
16. ontology/relations.yaml
17. wiki/entities/contact.md
18. architecture/modules.yaml
19. design/behaviors.md
20. design/states.md
21. design/decisions.yaml
22. design/escapes.md
23. design/language.md
24. design/component-registry.json (tóm theo máy)
25. src/generated/display.ts
26. src/generated/labels.ts
27. src/generated/ontology.ts (đoạn Contact)
28. src/modules/contacts/index.ts
29. src/modules/company-config/index.ts
30. src/modules/workspace/index.ts
31. src/app/nav.ts
32. src/app/layout.tsx
33. src/app/page.tsx
34. src/app/proto/[slug]/page.tsx
35. src/components/templates/app-shell.tsx
36. wiki/decisions/0013-selective-scope-and-design-foundation.md
37. wiki/decisions/0014-mvp-product-rules.md
38. wiki/decisions/0015-measurable-design-gate.md
39. wiki/decisions/0016-permission-model.md
40. wiki/decisions/0017-actor-surface-coverage-pilot.md
41. wiki/decisions/0019-measurable-design-system-pilot.md
42. wiki/decisions/0020-linked-sample-data-ocean-park.md
43. docs/START-HERE.md
44. docs/plan/pham-vi-mvp-dot-1.md
45. docs/design-standard-proposal.md (mục 1 đến 5)
46. docs/plan/lo-trinh.json (lọc theo từ khoá và các hàng 1b, 1e, 1d, 2)
47. wiki/log.md (15 dòng cuối)
48. governance/autonomy.yaml (60 dòng đầu)
49. tests/e2e/shell.spec.ts
50. playwright.config.ts
51. node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/intercepting-routes.md (lướt)
52. node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/parallel-routes.md (lướt)
53. node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/loading.md (40 dòng đầu)

**Được trỏ tới nhưng không có trong kho:** `design/patterns/`, `design/recipes/`, `design/screens.yaml`, `ontology/roles.yaml`, `src/components/candidate/`.
