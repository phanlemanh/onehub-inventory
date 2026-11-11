# App Shell chọn từ ReUI — thiết kế

Hàng 1o của lộ trình. Ô cơ hội: `_acceptance/app-shell-chon-tu-reui/opportunity.md` (chủ kho gõ build, 11/11/2026).
Quyết định nền: `wiki/decisions/0023-chon-truoc-tao-sau.md`. Bản bấm được: `/proto/app-shell` (chỉ chạy ở máy làm).

## Việc của người dùng

Nhân viên sàn mở ứng dụng là đứng trong App Shell: biết mình đang ở sàn nào, ở màn nào, chuyển màn bằng một lần
bấm, thấy băng báo khi mất mạng hay lưu hỏng, đổi sáng tối, đăng xuất. Người giữ nhiều vai thấy đủ mục của mọi vai.

## Từ Quỹ hàng

Đã đọc: `onehub-quy-hang/docs/design/vo-va-ia.md` mục 1, `docs/adr/0002-vo-va-ia-chon-tu-reui.md`, hồ sơ đã ký
`_acceptance/vo-ung-dung` (ký 31/10/2026).

| Quỹ hàng đã chọn | MVP này | Vì sao |
| --- | --- | --- |
| Máy tính: `app-shell-8` — cột biểu tượng, cột thứ hai đổi theo màn, thanh trên | Giữ | Chủ kho chốt 11/11/2026: `app-shell-8`, giữ cả hai cột |
| Cột thứ hai chứa góc nhìn đã lưu, mặc định mở, nhớ mở hay gập | Giữ chỗ cột, nội dung là câu hỏi 1 | MVP chưa có góc nhìn đã lưu (`docs/design-standard-proposal.md`, dòng «Giao diện») |
| Ô «Gõ mã căn» giữa thanh trên, phím ⌘K và `/` | Câu hỏi 2 | MVP chưa có màn hồ sơ căn để ô ấy mở tới |
| Chuông và ngăn thông báo | Câu hỏi 3 | MVP chưa có nguồn thông báo |
| Bộ chọn sàn ở đầu thanh trên, chỉ hiện khi người thuộc nhiều sàn | Câu hỏi 4 | Kho đã có đổi sàn trong menu tài khoản (hàng 8) |
| Nút «+ Lead», «Nhập Excel», «Xuất bảng hàng» ở thanh trên | Bỏ | MVP không có lead; thêm hàng làm ngay trên Bảng hàng (hàng 1e) |
| Bộ chọn dự án | Bỏ | Kho chưa có danh mục dự án |
| Điện thoại: thanh trên mảnh và bốn tab dưới ghép tay | Câu hỏi 5 | Bảng cắt gọn MVP ghi «điện thoại dùng thanh bên thu gọn»; bốn tab là bậc tạo tay |
| Màn không có vỏ: đăng nhập, chọn sàn, trang khách | Giữ | Đã đúng ở kho này: các màn ấy nằm ngoài nhóm `(app)` |

## Vùng của khối → lấy, bỏ, thêm

Thang của quyết định 0023: thành phần giữ nguyên như ReUI và shadcn giao; khối là điểm xuất phát cho cách xếp; nhu cầu
con kho đã có lời giải thì dùng của kho.

| Vùng của `app-shell-8` | Làm gì | Vì sao (việc của người dùng) |
| --- | --- | --- |
| `SidebarProvider` với cột hẹp và cột thứ hai | Lấy | Nhân viên chuyển màn bằng cột biểu tượng mà vẫn thấy mục con của màn đang mở ngay bên cạnh, không phải mở thêm menu (chủ kho chốt giữ cả hai cột) |
| Logo ở đầu cột biểu tượng | Lấy, thay dấu OneHub | Người dùng nhận ra sản phẩm; dấu lấy từ `public/brand/logo-mark.svg` |
| Cột biểu tượng (`NavMain`), chú thích khi rê chuột | Lấy | Chuyển màn bằng một lần bấm, chiếm ít chỗ cho bảng hàng |
| Mục của cột biểu tượng (`NAV_ITEMS`) | Lấy, nạp từ bảng điều hướng của kho | Một nguồn mục, lọc theo mọi vai người giữ (hàng 1i, quyết định 0016) |
| Cột thứ hai (`InnerSidebar`, `INNER_NAV`) | Lấy, nội dung theo câu hỏi 1 | Chỗ của lối tắt và góc nhìn đã lưu sau này |
| Thẻ chân cột thứ hai (số liệu sống, dung lượng, tin mới, nâng cấp) | Bỏ | Không phục vụ việc của nhân viên sàn ở MVP |
| Tay nắm gập cột thứ hai | Lấy | Người cần chỗ rộng cho bảng hàng thì gập cột |
| Bộ chọn Org / App / Env trên thanh trên | Bỏ App và Env; Org theo câu hỏi 4 | Sàn là thứ duy nhất người dùng đổi; không có ứng dụng hay môi trường |
| Ô tìm ⌘K giữa thanh trên | Theo câu hỏi 2 | Chỉ có ích khi có nơi để mở tới |
| Nút «Create» | Bỏ | Không có việc tạo chung cho mọi màn ở MVP |
| Chuông và ngăn thông báo của khối | Theo câu hỏi 3; nếu có thì ngăn dùng `Sheet` và trạng thái trống của kho | Ngăn mẫu của khối mang dữ liệu đơn hàng, không phải của sàn |
| Menu người dùng ở chân cột (`NavUser`) | Bỏ, dùng menu tài khoản của kho ở thanh trên | Kho đã có menu tài khoản kèm đổi sàn và đăng xuất (hàng 8) |
| Đổi sáng tối trong menu người dùng | Bỏ, dùng nút đổi giao diện của kho | Kho đã có (hàng 1a) |
| Vùng nội dung mẫu (thẻ gạch đứt) | Bỏ, thay bằng màn thật | Nhân viên cần thấy màn làm việc thật của mình (Hôm nay, Bảng hàng, Đã gửi) trong App Shell, không phải khung giữ chỗ trống |
| Thanh bên trong ngăn trượt trên điện thoại, cột thứ hai đi kèm | Lấy (câu 5 chủ kho chọn thanh bên thu gọn) | Nhân viên dùng điện thoại tìm màn và mục con ở cùng một chỗ, cùng cách như trên máy tính, nên không phải học hai cách điều hướng |

**Thêm bằng thành phần của kho:** lối nhảy tới nội dung (hàng 1a), băng báo trên màn và theo dõi mất mạng (hàng 1a),
trạng thái toàn trang lỗi, không tìm thấy, hết phiên (hàng 1a, 1e), thông báo kết quả (hàng 1e).

Đếm theo phương án (15 dòng của bảng): theo khuyên của máy (câu 2, 3 «chưa»; câu 4 «đầu thanh trên») lấy 8, bỏ 7 —
chưa quá nửa, vẫn là «khối làm điểm xuất phát». Câu 2 hay câu 3 chọn «có» thì lấy thêm một vùng mỗi câu. Câu 4 chọn
«trong menu tài khoản» mà câu 2, 3 vẫn «chưa» thì lấy 7, bỏ 8 — quá nửa, hàng phải gọi đúng tên là «ghép từ thành
phần», thẻ và sổ khối ghi như vậy.

Phần máy đã bỏ (thẻ chân cột, nút Create, bộ chọn ứng dụng và môi trường, menu người dùng ở chân cột, ngăn thông báo mẫu)
bày trên trang ảnh cạnh ảnh khối gốc; chủ kho muốn giữ phần nào thì gạch ở Cổng Phạm vi.

**Dòng nhập kho (ghi khi chủ kho duyệt):** App Shell · từ khối ReUI `app-shell-8` · cho nhu cầu «khung bọc mọi màn nội
bộ, điều hướng hai tầng theo vai» · chủ kho duyệt ngày 2026-11-11 (Cổng Phạm vi, nhận năm phương án A). Sổ khối `design/so-khoi.yaml` chưa có trên nhánh chính lúc hàng này gộp; dòng này chuyển sang sổ khi hàng 1n gộp.

**Bản đã dựng:** `src/components/templates/app-shell.tsx` (khung), `src/components/templates/app-shell/second-column.tsx` (cột thứ hai, nhớ gập bằng cookie đọc ở máy chủ), `src/app/(app)/company-switch.tsx` (tên sàn, cùng lối đổi sàn với menu tài khoản). Cột thứ hai đánh dấu chỗ đang mở bằng `aria-current="true"`; chỉ cột biểu tượng mang `aria-current="page"`. Nút mở thanh bên giữ ở mọi khổ (chỗ móc của bộ bài kiểm chung); trên máy tính nó mở rộng cột biểu tượng kèm tên màn.

## Thành phần cần cài thêm

Bản bấm được chỉ dùng thành phần đã có trong kho. Bản thật, tuỳ câu trả lời, cần cài từ shadcn đúng như nhà cung cấp
giao: `kbd` và `input-group` (nếu có ô gõ mã căn), `breadcrumb` (nếu tên sàn ở đầu thanh trên kèm tên màn). Xin chạm
tệp `src/components/ui/**` sau Cổng Phạm vi.

## Đặc tả UX

<!-- ux-spec:begin -->
**Thẻ việc.** Nhân viên sàn chuyển giữa Hôm nay, Bảng hàng, Đã gửi (và Thành viên nếu là quản trị sàn) bằng một lần
bấm, luôn thấy mình ở sàn nào và màn nào.

**Khuôn IA đã chọn + căn cứ.** Điều hướng hai tầng: cột biểu tượng cho màn, cột thứ hai cho mục trong màn. Căn cứ: chủ
kho chốt `app-shell-8` giữ cả hai cột (11/11/2026).

**Bảng trạng thái.**

| Trạng thái | App Shell hiện gì |
| --- | --- |
| Bình thường | Cột biểu tượng, cột thứ hai, thanh trên, màn |
| Mất mạng | Băng báo của kho trên màn, tự tắt khi có mạng |
| Lưu hỏng | Băng báo của kho, nút «Thử lại» |
| Màn lỗi, không tìm thấy, hết phiên | Trạng thái toàn trang của kho trong vùng màn; App Shell giữ nguyên để người đi tiếp |
| Người một vai | Cột biểu tượng chỉ hiện mục của vai ấy |
| Người nhiều vai | Cột biểu tượng hiện tổng mục của mọi vai |
| Cột thứ hai gập | Màn chiếm chỗ của cột; tay nắm vẫn còn để mở lại |
| Điện thoại | Theo câu hỏi 5 |

**Khổ.** 360, 414, 1024, 1440; sáng và tối.
<!-- ux-spec:end -->
