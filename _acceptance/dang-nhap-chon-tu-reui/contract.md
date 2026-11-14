---
schema_version: 1
feature: Nhân viên sàn đăng nhập bằng mã email trên màn đăng nhập chọn từ ReUI Pro, luồng và luật an toàn giữ nguyên
slug: dang-nhap-chon-tu-reui
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [ui]
screens: [sign-in]
status: signed-off
approved_by: Manh Phan
approved_at: 2026-11-14T05:13:12Z
design_doc: docs/superpowers/specs/2026-11-14-dang-nhap-chon-tu-reui-design.md
---

# Acceptance Contract: dang-nhap-chon-tu-reui

## Context

Hàng 1p của lộ trình. Màn đăng nhập được ghép tay khi kho còn rỗng; quyết định 0023 «chọn trước, vẽ sau» đòi chọn lại từ
ReUI Pro. Chủ kho chọn MỘT trong ba khối ở Cổng Phạm vi (`cong-pham-vi.html`): A `auth-15` (khuyên, Quỹ hàng đã chọn),
B `auth-19`, C `auth-13`. Các tiêu chí dưới viết cho lối A; chọn B hay C thì AC-1 đổi theo bảng «Lối khác» và ký lại ở
cổng này. Luồng mã email của hàng 8 và luật an toàn của hàng 1m giữ nguyên; không chạm ba luật sản phẩm (không truy vấn,
không gửi gì, không ra trang khách).

Source input: ô cơ hội `_acceptance/dang-nhap-chon-tu-reui/opportunity.md` (build, Manh Phan, 2026-11-13) · hàng 1p của
`docs/plan/lo-trinh.json` · trang `docs/tri-thuc/wiki/chu-de/dang-nhap.md` · lời giao của giám sát (`trinh/loi-giao-1p.md`).

## Criteria

- AC-1: Given khổ 1440, nền sáng, chưa đăng nhập, When mở `/login` và gõ email, Then màn có dáng `auth-15`: dấu hình và chữ
  «OneHub» trên cùng giữa; một cột hẹp giữa trang không khung, đúng một tiêu đề cấp một «Đăng nhập» và câu dẫn; ô Email có
  biểu tượng thư, gợi ý dưới ô; nút «Gửi mã» rộng hết cột kèm mũi tên; chân trang «© <năm> OneHub»; không nút đăng nhập
  bằng dịch vụ ngoài (Google, Apple, GitHub), không khung bọc biểu mẫu.
- AC-2: Given bốn tệp bài kiểm đăng nhập của hàng 8 và 1m (`tests/e2e-db/login.spec.ts`, `tests/e2e-db/va-dang-nhap.spec.ts`,
  `tests/e2e-db/dang-nhap-vai.ts`, `tests/e2e/account.spec.ts`), When so với bản ở commit `42a231f`, Then không tệp nào đổi
  một byte.
- AC-3: Given Postgres làn H, When chạy trọn bộ bài trình duyệt có cơ sở dữ liệu (đăng nhập, chọn sàn, mã sai, xin mã quá
  nhiều, chưa thuộc sàn, đăng xuất, vá đăng nhập 1m), Then mọi bài xanh. (cross-layer)
- AC-4: Given các bước sau bước email (nhập mã, mã sai, xin mã quá nhiều, chọn sàn, chưa thuộc sàn, phiên không còn sàn,
  lỗi máy chủ), When mỗi bước hiện ở khổ 1440, Then nó nằm trong cùng cột giữa trang của AC-1, dưới cùng logo và trên cùng
  chân trang; mọi câu đã có trong `src/app/login/copy.ts` ở commit `42a231f` giữ nguyên từng chữ (chỉ được thêm câu mới).
- AC-5: Given khổ 360, 414, 1024, 1440, nền sáng và tối, When mở `/login`, Then không cuộn ngang, đáy nút «Gửi mã» nằm
  trong khung nhìn đầu tiên, chữ «OneHub» của logo đạt tương phản trên nền tối, và quét trợ năng `/login` ở cả bốn khổ, sáng
  và tối, không ra lỗi nào.
- AC-6: Given chữ người dùng thấy trên màn, When `make check` chạy, Then xanh: tên khái niệm lấy từ `label()`, câu mới nằm
  trong `src/app/login/copy.ts`, không chữ ghim trong mã giao diện.
- AC-7: Given quyết định 0023, When hợp đồng sang `implemented`, Then `design/so-khoi.yaml` có dòng nhập kho khuôn màn
  đăng nhập (khối được chọn ở Hỏi-1, `ho_so: dang-nhap-chon-tu-reui`) và `chung-minh-man.md` qua lưới chứng minh màn. Theo
  Hỏi-2: «tạo họ» → `design/screens.yaml` gắn họ `dang-nhap` cho màn `sign-in`, có tệp `design/patterns/dang-nhap.md` ghi
  `Màn: sign-in`; «để ngoài bản đồ» → `family` của `sign-in` giữ rỗng, không tệp họ, chứng minh màn đi lối «họ mới».

## Lối khác (chỉ áp khi chủ kho chọn ở Cổng Phạm vi)

Chọn B hay C thì AC-1, AC-4 và các phép đo E1, E1b, E4 đổi theo dòng dưới, ghi ở `evals.yaml` mục «Lối khác»; chữ ký Cổng
Phạm vi cho lối ấy là chữ ký cho bộ đo đã đổi.

- B `auth-19`: AC-1 đổi thành «thanh trên có logo trái và câu "Chưa có tài khoản? Nhờ quản trị sàn mời bạn." phải; một
  khung Frame giữa trang chứa tiêu đề, câu dẫn và biểu mẫu; chân trang dưới khung».
- C `auth-13`: AC-1 đổi thành «từ 1024 trở lên, cột trái rộng 32rem là khung ảnh cao hết màn, cột phải là logo, tiêu đề,
  câu dẫn, ô Email có nhãn hiện; nền nhiễu nhẹ; dưới 1024 ẩn ảnh»; thêm một tệp ảnh riêng của OneHub ở `public/`.

## Out of scope

- Đăng nhập bằng Google, Apple, GitHub, mật khẩu, Zalo hay số điện thoại (kho chỉ đăng nhập bằng mã email, quyết định 0021).
- Trang điều khoản, trang xin mời vào sàn — chưa có trang nào để trỏ tới.
- Mọi đổi ở luồng, đường API, mô-đun `identity`, thư gửi mã.
- Menu tài khoản và đổi sàn trong App Shell (hàng 8, 1m, 1o).

## Coverage

Bỏ quét không gian tiêu chí — xem dòng `descope` «bỏ coverage-scan» trong sổ quyết định: hàng đổi khung một màn đã có,
luồng và trạng thái đã khai đủ ở hàng 8 và 1m; độ phủ trạng thái nằm ở bảng trạng thái của đặc tả UX và AC-4.

## Vai × Màn

Màn đăng nhập mở cho mọi người chưa vào sàn; vai chỉ có sau khi chọn sàn, nên mọi vai thấy cùng một màn (hàng 8).

| Màn | Đầu chủ | Đầu khách | Trưởng nhóm | Quản trị sàn |
|---|---|---|---|---|
| sign-in | được — cùng màn, chưa có vai | được — cùng màn, chưa có vai | được — cùng màn, chưa có vai | được — cùng màn, chưa có vai |

## Đường đo

- Ngưỡng «thẻ Phạm vi bày hai đến ba khối ReUI kèm ảnh, có auth-15» · số từ trang `cong-pham-vi.html` (ba lối, ảnh khối
  gốc dưới từng lối), người soi tại Cổng Phạm vi, giám sát soi ảnh trước khi trình · nhóm `màn` của `### Ứng viên ReUI` trong
  `chung-minh-man.md` (ba khối, mỗi khối một ảnh) được lưới chứng minh màn đọc (AC-7).
- Ngưỡng «mọi bài kiểm đăng nhập hàng 8 và 1m vẫn xanh, không đổi lời» · số từ lượt chấm · bảo đảm bởi AC-2 và AC-3.

## Notes

- Ngoài-1 (máy định tuyến 2026-11-14, đề xuất S4 known-limits): Người dùng không thấy gì khác: màn đăng nhập vẫn báo lỗi máy chủ đúng chỗ. Hậu quả chỉ là bài kiểm này có thể chập chờn trên máy chậm mà bộ lặp kiểm không bắt được. — `tests/e2e/dang-nhap-khoi.spec.ts`
- Ngoài-2 (máy định tuyến 2026-11-14, đề xuất S4 known-limits): Dáng của màn đăng nhập (logo, cột không khung, biểu tượng thư, nút rộng) chưa được kiểm tự động ở nền tối, nên nếu nền tối vỡ bố cục thì có thể không ai báo sớm. — `tests/e2e/dang-nhap-khoi.spec.ts`
- Known limits — chọn ở Cổng Bằng chứng 2026-11-14:
  - Ngoài-1: Bài kiểm «lỗi máy chủ trong cột» chờ bằng tay thay hàm chờ chung, có thể chập chờn trên máy chậm; người dùng không thấy gì khác.
  - Ngoài-2: Dáng khối (logo, cột không khung, biểu tượng thư, nút rộng) chưa được đo tự động ở nền tối.
