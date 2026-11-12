# Vá phần đăng nhập (hàng 1m) — thiết kế

Ngày: 2026-11-11 · Hồ sơ: `_acceptance/va-dang-nhap/` · Dựng trên hàng 8 (`dang-nhap-ma-email`).

## Vì sao

Ở Cổng Bằng chứng của hàng 8, chủ kho chọn mở hợp đồng mới cho bốn mục ngoài hợp đồng (Ngoài-1 đến Ngoài-4, sổ
`_acceptance/dang-nhap-ma-email/decisions.jsonl` dòng 18–21). Ba lỗ, phải vá trước hàng đầu tiên đọc dữ liệu thật:

1. **Trở về trang ngoài sau đăng nhập** (Ngoài-1, Ngoài-2 — cùng một lỗ). Kiểm đường trở về (`safeNext`) chỉ xét vài ký
   tự đầu. Đường như `/<tab>/example.com` qua được: trình duyệt bỏ ký tự tab khi đọc địa chỉ, còn lại `//example.com`,
   tức sang trang khác.
2. **Đăng xuất lỗi bị nuốt** (Ngoài-3). Menu tài khoản gọi đăng xuất, bỏ qua kết quả rồi đưa người về `/login`. Mạng
   đứt hay máy chủ lỗi thì phiên vẫn sống, màn đăng nhập thấy phiên có sàn và đưa người ngược vào ứng dụng, không một lời
   báo. Trên máy dùng chung, người sau vào được tài khoản ấy.
3. **Người hết sàn kẹt ở màn chọn sàn trống** (Ngoài-4). Người bị gỡ khỏi mọi sàn mà còn phiên: màn đăng nhập thấy phiên
   không sàn, mở bước chọn sàn với danh sách rỗng, không nút nào để thoát.

## Luật sản phẩm đã nạp

`PRODUCT-INVARIANTS.md` (3 luật). Hàng này không thêm truy vấn, bảng hay trình điều khiển: SP-1 không bị chạm (đăng xuất
và đọc phiên dùng nguyên các hàm của hàng 8). SP-3, SP-4 không liên quan (không gửi gì ra ngoài, không chạm trang
khách).

## Lựa chọn

### (a) Đường trở về chỉ là đường của chính trang

`safeNext` (tệp `src/modules/identity/next-path.ts`, chỗ duy nhất giữ luật này — màn đăng nhập, đường đổi mã và bước
chọn sàn đều gọi nó) đổi từ «xét vài ký tự đầu» sang **danh sách cho phép rồi đọc bằng chính bộ đọc địa chỉ của chuẩn
trình duyệt**:

- phải là chuỗi, bắt đầu bằng đúng một `/`;
- không chứa ký tự điều khiển (C0, DEL, C1), khoảng trắng nào (kể cả khoảng trắng Unicode) hay gạch ngược `\`;
- đọc bằng `new URL(next, gốc giả)` — bộ đọc WHATWG, cùng luật trình duyệt dùng (nó cũng bỏ tab, xuống dòng): gốc của
  kết quả phải đúng gốc giả, và đường sau khi chuẩn hoá không được bắt đầu bằng `//`;
- trượt bất kỳ điều nào → `/` (trang Hôm nay). Qua hết → trả nguyên chuỗi người gửi.

Lối bị loại: vá thêm từng ký tự vào danh sách cấm (cách của bản cũ — lọt đúng vì danh sách cấm không đủ); và trả đường
đã chuẩn hoá thay vì chuỗi gốc (`/..//example.com` chuẩn hoá thành `//example.com`, chính là đường sang trang khác).

Ma trận ca phá viết trước — **mỗi dạng một ca**, 14 dạng lách + 4 dạng hợp lệ:

| #   | Dạng                         | Ví dụ                          | Kỳ vọng                      |
| --- | ---------------------------- | ------------------------------ | ---------------------------- |
| L1  | Địa chỉ tuyệt đối            | `https://example.com`          | `/`                          |
| L2  | Giao thức khác               | `javascript:alert(1)`          | `/`                          |
| L3  | Hai gạch đầu                 | `//example.com`                | `/`                          |
| L4  | Gạch rồi gạch ngược          | `/\example.com`                | `/`                          |
| L5  | Gạch ngược đầu               | `\/example.com`                | `/`                          |
| L6  | Tab giữa hai gạch            | `/<tab>/example.com`           | `/`                          |
| L7  | Xuống dòng LF giữa hai gạch  | `/<LF>/example.com`            | `/`                          |
| L8  | Về đầu dòng CR giữa hai gạch | `/<CR>/example.com`            | `/`                          |
| L9  | Ký tự điều khiển khác (NUL)  | `/<NUL>/example.com`           | `/`                          |
| L10 | Khoảng trắng đầu             | `<space>//example.com`         | `/`                          |
| L11 | Khoảng trắng Unicode giữa    | `/<NBSP>/example.com`          | `/`                          |
| L12 | Chuẩn hoá ra hai gạch        | `/..//example.com`             | `/`                          |
| L13 | Gạch ngược giữa đường        | `/a\..\\example.com`           | `/`                          |
| L14 | Không phải chuỗi / rỗng      | `undefined`, `[]`, `42`, `""`  | `/`                          |
| H1  | Trang gốc                    | `/`                            | giữ nguyên                   |
| H2  | Trang trong                  | `/inventory`                   | giữ nguyên                   |
| H3  | Có truy vấn và neo           | `/inventory?q=S1&page=2#row-3` | giữ nguyên                   |
| H4  | Mã hoá phần trăm             | `/%2F%2Fexample.com`           | giữ nguyên, vẫn ở trang mình |

Ngoài kỳ vọng từng ca, bài đo kiểm **quan hệ** cho mọi ca: đọc kết quả bằng `new URL(kết quả, https://app.test)` thì gốc
luôn là `https://app.test`. Đối chứng: chạy cùng ma trận trên bản `safeNext` cũ (chép nguyên trong tệp kiểm) thì bản
cũ cho qua đúng bảy dạng L6, L7, L8, L9, L11, L12, L13, và ba dạng L6, L7, L8 đưa sang gốc khác — chứng ma trận cắn được.

Đường thật trên trình duyệt: mở `/login?next=%2F%09%2Fexample.com` (dạng L6) khi đã đăng nhập (máy chủ chuyển hướng),
khi đăng nhập một sàn (trình duyệt chuyển trang sau gõ mã) và khi đăng nhập hai sàn (sau bước chọn sàn) — cả ba kết
thúc ở trang của ứng dụng. Bản `safeNext` cũ làm ca máy chủ chuyển hướng đỏ.

### (b) Đăng xuất lỗi thì báo rõ là CHƯA thoát

Một hàm đăng xuất dùng chung cho mọi nút Đăng xuất: `src/app/login/sign-out.ts`. Nó gọi `DELETE /api/v1/auth/session`
và chỉ trả «đã thoát» khi máy chủ trả mã 2xx. Mạng đứt, máy chủ trả lỗi hay đọc không được → trả «chưa thoát» và báo
bằng kênh thông báo kết quả thao tác (toast, theo `design/behaviors.md` «Kênh thông báo», qua `notify("result", …)`
của khung — màn không tự dựng toast):

> Chưa đăng xuất được. Bạn vẫn đang đăng nhập trên máy này — kiểm tra mạng rồi bấm «Đăng xuất» lại.

Người ở nguyên trang đang mở, nút Đăng xuất bấm lại được. Chỉ khi «đã thoát» mới chuyển về `/login`.

Máy chủ của hàng 8: lỗi khi xoá phiên thì trả 500 và không xoá cookie, nên «chưa thoát» trên màn khớp với sự thật ở máy
chủ. Bài trình duyệt đo điều này bằng lỗi máy chủ thật (vai chủ thu quyền chạy hàm xoá phiên trong ca), không giả ở
trình duyệt. Giữ hay xoá cookie khi máy chủ không xoá được phiên là câu hỏi cho chủ kho (Hỏi ở Cổng Phạm vi).

Lối bị loại: máy chủ xoá cookie dù không xoá được phiên — máy này trông như đã thoát nhưng mã phiên vẫn sống ở máy chủ,
và người dùng không biết; ý định của hàng đòi báo đúng sự thật.

Tệp chạm ngoài ranh giới giao: `src/app/(app)/account-menu.tsx` (nút Đăng xuất của khung) — đã hỏi giám sát (R-1111-15).

### (c) Người hết sàn có lối thoát

Màn đăng nhập thấy phiên không sàn và **không còn sàn nào** để chọn → không mở bước chọn sàn rỗng nữa mà mở trạng thái
mới «hết sàn khi còn phiên»:

> Tài khoản của bạn không còn thuộc sàn nào. Nhờ quản trị sàn mời lại, hoặc đăng xuất để dùng email khác.

kèm nút «Đăng xuất» (nhãn `SignOut` của bảng nhãn). Bấm → hàm đăng xuất dùng chung ở (b): thoát được thì về bước nhập
email (tải lại `/login`, phiên đã xoá); lỗi thì toast «chưa thoát» như (b), người ở lại màn.

Trạng thái «chưa thuộc sàn nào» có sẵn của hàng 8 (gõ mã đúng nhưng chưa thuộc sàn, không phiên nào được tạo) giữ nguyên:
không có phiên nên «Dùng email khác» là đủ.

## Đặc tả UX

<!-- ux-spec:start -->

### Thẻ việc

Người dùng: nhân viên sàn đang đăng nhập hoặc vừa xong việc. Việc: thoát an toàn khỏi tài khoản, và không bị một đường
link dẫn sang trang lạ khi đăng nhập.

### Khuôn IA đã chọn + căn cứ

Không khuôn mới: hai màn có sẵn (màn đăng nhập một khối giữa màn, menu tài khoản trên khung) chỉ thêm một trạng thái và
một phản hồi lỗi. Bản đồ khuôn của kho chỉ có nhóm «lưới», không nhận màn này.

### Bảng trạng thái

| Màn            | Trạng thái              | Khi nào                               | Người thấy                                     | Lối ra            |
| -------------- | ----------------------- | ------------------------------------- | ---------------------------------------------- | ----------------- |
| Menu tài khoản | đăng xuất lỗi           | `DELETE` phiên lỗi mạng hay không 2xx | toast «Chưa đăng xuất được…», ở nguyên trang   | bấm Đăng xuất lại |
| Menu tài khoản | đăng xuất được          | 2xx                                   | về `/login` bước email                         | —                 |
| Đăng nhập      | hết sàn khi còn phiên   | phiên không sàn, danh sách sàn rỗng   | câu «không còn thuộc sàn nào» + nút Đăng xuất  | Đăng xuất         |
| Đăng nhập      | hết sàn — đăng xuất lỗi | như trên, `DELETE` lỗi                | toast «Chưa đăng xuất được…», ở lại trạng thái | bấm Đăng xuất lại |
| Đăng nhập      | đường trở về lách       | `next` không qua kiểm                 | không thấy gì khác: sau đăng nhập về Hôm nay   | —                 |

Nút bận: chỉ khoá nút, không đổi chữ, không tự vẽ biểu tượng quay (bài rào hành vi của hàng 1e).

### Khổ và giao diện

Bốn khổ 360, 414, 1024, 1440; sáng và tối; kiểm tiếp cận (axe) không lỗi ở trạng thái mới.

<!-- ux-spec:end -->

## Ngoài phạm vi

- Thu mọi phiên của người khi khoá người hay gỡ khỏi sàn (hàng N8).
- Đổi sàn lỗi mạng làm menu kẹt (Ngoài-6 của hàng 8 — đã ghi giới hạn đã biết).
- Báo «email không hợp lệ» thay vì lỗi máy chủ (Ngoài-11 của hàng 8 — giới hạn đã biết).
- Bắt đăng nhập ở các màn dữ liệu mẫu (hàng N5).
