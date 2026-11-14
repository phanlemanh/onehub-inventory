# Đăng nhập chọn từ ReUI — thiết kế (hàng 1p)

Ngày: 2026-11-14 · Hồ sơ: `_acceptance/dang-nhap-chon-tu-reui/` · Dãy H · Tầng T2

## Vì sao

Màn đăng nhập (`src/app/login/**`) được ghép tay khi kho còn rỗng: một khung Frame nhỏ giữa trang. Quyết định 0023
«chọn trước, vẽ sau» đòi màn và khối mới chọn từ ReUI Pro trước, vẽ tay sau cùng; màn đăng nhập là một trong ba màn ghép
tay được chọn lại (App Shell 1o đã xong, Thành viên 9c sau). Quỹ hàng đã chọn `auth-15` cho màn này
(`onehub-quy-hang/docs/design/vo-va-ia.md` dòng Đăng nhập: bỏ nút Google/Apple/GitHub, giữ chân trang; ứng viên kế `auth-19`).

## Giữ nguyên

- Luồng của hàng 8 và luật an toàn của hàng 1m: email → mã 6 số → (chọn sàn) → vào; mã 5 phút, giới hạn xin mã, email lạ
  nhận cùng câu, «Tài khoản chưa thuộc sàn nào», lỗi máy chủ kèm «Thử lại», đăng xuất chắc. Không đổi đường API, không đổi
  `src/modules/identity/**`.
- Mọi bài kiểm đăng nhập của hàng 8 và 1m (`tests/e2e-db/login.spec.ts`, `tests/e2e-db/va-dang-nhap.spec.ts`,
  `tests/e2e-db/dang-nhap-vai.ts`, `tests/e2e/account.spec.ts`): không đổi một chữ.
- Chữ trên màn: tên khái niệm từ `label()` (Đăng nhập, Mã đăng nhập, Đăng xuất); câu trong `src/app/login/copy.ts`.

## Đổi

Chỉ khung trang quanh biểu mẫu và dáng ô email ở bước đầu. Ba lối, mỗi lối theo một khối ReUI Pro, bày ở Cổng Phạm vi
(trang `_acceptance/dang-nhap-chon-tu-reui/cong-pham-vi.html`):

| Lối        | Khối      | Người dùng thấy                                                                                | Lấy · bỏ · thêm                                                                                                                                                                                                                   |
| ---------- | --------- | ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A (khuyên) | `auth-15` | Logo trên cùng giữa, một cột hẹp giữa trang không khung, chân trang «© 2026 OneHub»            | lấy logo, tiêu đề + câu dẫn, ô email có biểu tượng thư, nút có mũi tên, chân trang; bỏ ba nút Google/Apple/GitHub và dải «Or continue with», bỏ câu điều khoản và ba liên kết chân trang (kho chưa có trang điều khoản)           |
| B          | `auth-19` | Thanh trên có logo và câu «Chưa có tài khoản? Nhờ quản trị sàn mời bạn.», một khung giữa trang | lấy thanh trên, khung giữa, ô email; thay Card của khối bằng Frame của kho (màn nhân viên dùng một họ khung Frame); bỏ nút đăng nhập ngoài và câu điều khoản; liên kết «Request invite» thành câu thường (không có trang xin mời) |
| C          | `auth-13` | Nửa trái là tấm ảnh lớn trong khung, nửa phải là biểu mẫu; nền nhiễu nhẹ                       | lấy lưới hai cột, khung ảnh, nền nhiễu, ô email thường có nhãn hiện; bỏ nút đăng nhập ngoài; ảnh trên điện thoại ẩn; ảnh phải là ảnh riêng của OneHub lưu trong kho (bản mẫu dùng ảnh của khối)                                   |

Bước nhập mã, chọn sàn, chưa thuộc sàn, lỗi máy chủ: nằm trong cùng cột/khung của lối được chọn, không đổi chữ.

<!-- <<<UX-SPEC-TEMPLATE -->

## Đặc tả UX

### 1. Luồng

- Suôn sẻ: `/login` (hay bị đưa về từ màn cần phiên) → gõ email → «Gửi mã» → gõ mã 6 số → «Đăng nhập» → (chọn sàn nếu thuộc
  nhiều sàn) → về `next` (điểm ra: Hôm nay hay màn đã xin).
- Biên: thuộc nhiều sàn (chọn sàn); chưa thuộc sàn nào; đã có phiên không sàn (chỉ còn «Đăng xuất»); đã có phiên đủ sàn
  (chuyển thẳng về `next`).
- Lỗi & quay lại: mã sai/hết hạn → lỗi dưới ô mã, «Gửi mã mới»; xin mã quá nhiều → câu 15 phút; máy chủ lỗi → câu lỗi
  kèm «Thử lại», phần đã gõ vẫn còn; «Dùng email khác» về bước email.

### 2. Kiểm kê màn

| Màn                   | MỘT việc của màn                            | Vào từ / ra tới                              |
| --------------------- | ------------------------------------------- | -------------------------------------------- |
| Đăng nhập (`sign-in`) | Vào được sàn đang làm bằng mã gửi qua email | liên kết «Đăng nhập», màn cần phiên / `next` |

### 3. Bảng trạng thái

<!-- <<<UX-STATE-TABLE -->

| Trạng thái                    | Màn       | Hiển thị gì                                                                                             | Người làm gì tiếp       |
| ----------------------------- | --------- | ------------------------------------------------------------------------------------------------------- | ----------------------- |
| ST-sign-in-email              | Đăng nhập | Tiêu đề «Đăng nhập», câu dẫn, ô Email + gợi ý, nút «Gửi mã»                                             | gõ email, Enter hay bấm |
| ST-sign-in-sending            | Đăng nhập | Nút «Đang gửi», ô khoá                                                                                  | chờ                     |
| ST-sign-in-code               | Đăng nhập | «Nếu … có tài khoản, mã đã được gửi…», ô Mã đăng nhập, nút «Đăng nhập», «Gửi mã mới», «Dùng email khác» | gõ hay dán mã           |
| ST-sign-in-code-invalid       | Đăng nhập | Lỗi dưới ô mã                                                                                           | gõ lại hay «Gửi mã mới» |
| ST-sign-in-rate-limited       | Đăng nhập | «Đã xin mã quá nhiều lần. Thử lại sau 15 phút.»                                                         | chờ                     |
| ST-sign-in-server-error       | Đăng nhập | Câu lỗi máy chủ + «Thử lại»                                                                             | bấm «Thử lại»           |
| ST-sign-in-choose             | Đăng nhập | «Bạn thuộc nhiều sàn…», mỗi sàn một nút                                                                 | chọn sàn                |
| ST-sign-in-no-company         | Đăng nhập | «Tài khoản chưa thuộc sàn nào…», «Dùng email khác»                                                      | đổi email               |
| ST-sign-in-no-company-session | Đăng nhập | Câu không còn thuộc sàn, «Đăng xuất»                                                                    | đăng xuất               |

<!-- UX-STATE-TABLE>>> -->

### 4. Hành vi

- Enter ở ô email gửi mã (chỉ khi trang đã chạy trong trình duyệt — `data-ready`); ô mã nhận dán «123 456», chỉ giữ số.
- Khổ 360–1440: một cột, không cuộn ngang; lối C ẩn ảnh dưới 1024.
- Sáng và tối: logo là dấu hình + chữ «OneHub» theo màu chữ của chủ đề (tệp logo ngang chỉ có chữ tối).

### 5. Xuất xứ component

| Component                        | Nấc (dùng / ghép / mở rộng / tạo) | Vì sao (1 dòng)                                        |
| -------------------------------- | --------------------------------- | ------------------------------------------------------ |
| Khối ReUI của lối được chọn      | ghép                              | khối Pro là điểm xuất phát, lấy/bỏ vùng theo bảng trên |
| Field, InputGroup, Input, Button | dùng                              | đã cài trong kho, giữ nguyên                           |
| Frame (lối B, C)                 | dùng                              | họ khung của màn nhân viên                             |
| Biểu mẫu `LoginForm`             | mở rộng                           | giữ logic, chỉ đổi dáng ô email và nút                 |

### 6. Khuôn IA đã chọn + căn cứ

Khuôn IA: một-cột-cuộn
Căn cứ: màn một việc, một luồng hai bước; Quỹ hàng chọn một cột hẹp giữa trang (`auth-15`, `qh:design/patterns/xac-thuc.md`).

### 7. Thẻ việc

| Trường     | Giá trị                                |
| ---------- | -------------------------------------- |
| Ai dùng    | Mọi vai trong sàn                      |
| Việc chính | Vào sàn đang làm bằng mã gửi qua email |
| Tần suất   | hiếm (phiên 30 ngày trượt)             |
| Số bản ghi | một                                    |
| Thiết bị   | cả hai                                 |

<!-- UX-SPEC-TEMPLATE>>> -->

## Vùng tệp

Trong vùng: `src/app/login/**`, `_acceptance/dang-nhap-chon-tu-reui/**`, trang thiết kế này.
Ngoài vùng (báo giám sát trước khi chạm): `tests/e2e/dang-nhap-khoi.spec.ts` (mới), `tests/dang-nhap-giu-loi.test.ts`
(mới), `design/so-khoi.yaml` (một dòng nhập kho), `design/screens.yaml` (họ của màn `sign-in`), `design/patterns/dang-nhap.md`
(tệp họ mới nếu chủ kho tạo nhóm), `wiki/log.md`. Lối C thêm ảnh ở `public/`. Không gói mới, không chạm
`src/components/ui/**`, `src/components/reui/**`.
