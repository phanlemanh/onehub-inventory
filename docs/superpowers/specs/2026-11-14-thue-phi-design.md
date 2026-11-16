# Thuế phí — thiết kế (hàng 19)

Hàng 19 của `docs/plan/lo-trinh.json`, tầng T3, dãy N của đợt `dieu-phoi-nen`. Ô cơ hội `_acceptance/thue-phi/opportunity.md`
(build, Manh Phan, 13/11/2026). Câu giao: «Quản trị sàn đặt Thuế phí và thấy Bảng hàng tính theo mức đó». Vì sao: phải
đặt trước khi nhập tệp của sàn (hàng 11).

Nguồn đã đọc: trang tri thức `docs/tri-thuc/wiki/chu-de/cai-dat-san.md` (C1 của Quỹ hàng), hồ sơ `thue-phi` của Quỹ hàng ở
commit `1729b11f` (hợp đồng đã ký 06/11), mã và hồ sơ hàng 7e trên nhánh `claude/nervous-chaum-ec346e` (PR #53, chưa gộp),
`PRODUCT-INVARIANTS.md` (bản `8ee15fd`), `ontology/actions.yaml`.

## Mức thuế phí là gì — bằng lời của Quản trị sàn

«Giá bao phí» là giá chủ nhà chào đã gồm các khoản thuế phí bên bán phải trả; «về tay» là số chủ nhận sau khi trừ các khoản
ấy. Mỗi sàn nói «bao phí» gồm khoản nào và môi giới bao nhiêu phần trăm. Mức của sàn gồm đúng ba khoản, theo thứ tự:

| Khoản                 | Tỉ lệ                | Sàn đổi được gì                    | Mặc định |
| --------------------- | -------------------- | ---------------------------------- | -------- |
| Thuế thu nhập cá nhân | 2% giá — theo luật   | Chỉ bật/tắt «Tính vào giá bao phí» | Bật      |
| Lệ phí trước bạ       | 0,5% giá — theo luật | Chỉ bật/tắt                        | Bật      |
| Phí môi giới          | 0–5%, bước 0,1%      | Tỉ lệ và bật/tắt                   | 1%, bật  |

- Ít nhất một khoản phải bật. Sàn chưa đặt gì thì dùng mặc định (không có dòng nào ở cơ sở dữ liệu).
- Lưu bằng phần vạn số nguyên (2% = 200, 0,5% = 50, 1% = 100). Tiền là số nguyên đồng, làm tròn xuống tới đồng.
- Về tay của một hàng **Bao phí** = Giá chào × (1 − tổng tỉ lệ các khoản đang bật). Ví dụ mặc định: 3 tỷ → 2,895 tỷ. Hàng
  **Không bao phí**: Về tay = Giá chào. Thiếu Giá chào hay thiếu Điều kiện phí: trống.
- Ba khoản là thuế phí của chuyển nhượng. Mô hình chưa có loại giao dịch (mọi hàng hôm nay là bán); khi có hàng cho thuê,
  Về tay của hàng ấy để trống.
- Hỏi-7 (khuyến nghị, hợp đồng soạn theo lối này): sàn thêm, đổi tên, bỏ khoản riêng cùng khuôn (tên, phần trăm Giá chào,
  bật/tắt), tối đa 5 khoản riêng, tổng các khoản đang bật không quá 10%; hai khoản theo luật không bỏ, không đổi tên; bỏ là
  ngừng dùng, không xoá. Không cách tính khác (số tiền cố định, bậc thang, tính trên giá khác), không luật nếu-thì (ADR-0018 của Quỹ hàng, giới hạn chép vào AGENTS.md).

## Phương án đã chọn

1. **Lõi tính ở `company-config`** (`index.ts`, an toàn trên trình duyệt): hằng ba khoản, mặc định, khoảng 0–500 phần vạn
   bước 10, hàm kiểm một mức, hàm `netToSeller(listPrice, feeInclusion, schedule)`. Mỗi luật một chỗ.
2. **Lưu**: bảng mới `company_fee_items` (một dòng mỗi khoản sàn đã đổi hay thêm: mã, tên, tỉ lệ, bật/tắt, người và lúc, ngừng dùng). Migration
   mới số kế tiếp trên `origin/main` lúc tạo (hiện 012; 7e giữ 010), tạo bằng `/new-migration`: `company_id`, luật theo dòng
   ép buộc, luật vai thu hẹp — đọc theo `readFeeSchedule`, ghi theo `setFeeSchedule`. Ca mới ở bộ kiểm cách ly.
3. **Bảng quyền**: hai dòng mới ở `ontology/actions.yaml` — `readFeeSchedule` (Đầu chủ, Đầu khách, Trưởng nhóm, Quản trị sàn:
   company) và `setFeeSchedule` (chỉ Quản trị sàn: company). Không tự đặt quyền ở chỗ khác.
4. **API**: `GET /api/v1/company/fee-schedule` (mức đang áp, nguồn từng khoản: mặc định hay đã đổi, người, ngày) và
   `PUT /api/v1/company/fee-schedule` (cả mức một lần; sai thì 400 kèm khoản sai, không ghi gì; vai khác 403). Đi qua
   `withCompany`.
5. **Màn**: phần mới «Thuế phí» (`?phan=thue-phi`) trong màn «Tuỳ chỉnh của sàn» của 7e — một mục ở cột thứ hai của App
   Shell (Hỏi-2). Màn 7e mở theo dòng `readCompanyLayer`, vốn cho cả bốn vai (Đầu chủ, Đầu khách, Trưởng nhóm, Quản trị
   sàn) phạm vi sàn; ba vai đọc đã thấy các phần khác của 7e, hàng này không đổi quyền vào màn. Khối chung `FramedList` của họ danh sách khung (hàng 9c, `src/components/candidate/framed-list.tsx`) (mỗi dòng một khoản: tên, tỉ lệ hay «theo luật», công tắc, nguồn). Vai khác thấy
   chỉ đọc, không nút Lưu.
6. **Mô hình nghiệp vụ**: `Listing.feeInclusion` — Điều kiện phí, `Included` (Bao phí) / `Excluded` (Không bao phí), riêng
   của ta (RESO 2.1 không có) (Hỏi-1). Khái niệm mới `FeeSchedule` (Thuế phí) và ba khoản. Nhãn mới ở `labels.yaml`. Hàng
   mẫu của Bảng hàng được gắn điều kiện (có cả hai loại và một hàng thiếu).
7. **Bảng hàng**: cột hiện sẵn «Về tay» ngay sau «Giá chào», tính bằng `netToSeller` với mức của sàn đang đăng nhập; cột
   «Điều kiện phí» có trong menu Cột, ẩn sẵn (Hỏi-3). Về tay sắp, lọc như cột tiền. Đổi mức rồi mở lại Bảng hàng thấy số mới.
8. **Dấu định nghĩa lúc tính** (luật 13 của Quỹ hàng): chưa làm ở hàng này — hàng của Bảng hàng còn là dữ liệu mẫu tới hàng
   10; Bảng hàng tính theo mức đang áp (Hỏi-4).

Phương án đã loại: một điều kiện phí chung cho cả sàn (sai khi Sheet trộn hai loại; hàng 11 phải mở lại); gộp mức vào bảng
nhãn của 7e (nhét số vào bảng chữ); số thực phần trăm (lệch một đồng giữa hai nơi tính); màn Cài đặt sàn riêng (Hỏi-2).

## Luật sản phẩm chạm

- **SP-1** — chạm: bảng mới của sàn, có `company_id`, luật theo dòng ép buộc trong cùng migration, ca mới ở bộ kiểm cách ly,
  mọi truy vấn qua `withCompany` dưới vai không sở hữu bảng. Bộ kiểm cách ly xanh trên Postgres dãy N (`DB_PORT=5563`)
  trước Cổng Bằng chứng.
- **SP-4** — giữ: mức thuế phí, Về tay và Điều kiện phí là dữ liệu nội bộ. Kho chưa có trang khách; hàng này không thêm
  trường nào vào dữ liệu ra ngoài. Được ra trang khách: không gì của hàng này. Không bao giờ ra: tỉ lệ, khoản, Về tay.
  Điều kiện phí của một giá có ra trang khách hay không là việc của hàng trang khách.
- **SP-3** — không chạm.

## Vùng mã

`src/modules/company-config/**` (lõi, lưu, API, màn phần Thuế phí), `src/app/api/v1/company/fee-schedule/`,
`src/modules/listings/ui/` (cột Về tay, Điều kiện phí — chỉ `inventory-rows.ts`, `inventory-grid.tsx`),
`src/app/(app)/inventory/` và `src/app/(app)/inventory-sample-rows.ts` (đọc mức, gắn điều kiện mẫu),
`src/app/(app)/tuy-chinh-san/` và mục điều hướng ở `src/app/(app)/nav.ts`, `db/migrations/`, `db/tests/cach-ly.sql`,
`ontology/` (phần hợp đồng), `design/screens.yaml`, `design/vai-man-nut.md`, tests. Trùng vùng với 2b, 2d ở Bảng hàng —
giám sát xếp thứ tự gộp.

Tệp tầng cao có thể chạm: `ontology/**` (phần hợp đồng — chủ kho duyệt ở cổng này); `src/components/ui/switch.tsx` thêm bằng
lệnh shadcn (không sửa tay). Không sửa `tools/**`, `Makefile`, cấu hình bộ kiểm.

<!-- <<<UX-SPEC-TEMPLATE -->

## Đặc tả UX

### 1. Luồng

- Suôn sẻ: Quản trị sàn mở Tuỳ chỉnh của sàn → chọn «Thuế phí» ở cột thứ hai → đổi Phí môi giới thành 1,5 và tắt Lệ phí
  trước bạ → Lưu → thông báo «Đã lưu thuế phí» (điểm ra: dòng Phí môi giới mang «Đã đổi · [Tên] · 14/11/2026»).
- Đầu chủ mở Bảng hàng → cột «Về tay» cạnh «Giá chào» tính theo mức vừa lưu.
- Biên: sàn chưa đặt gì → mọi dòng «Mặc định»; vai không phải Quản trị → phần chỉ đọc, không nút Lưu, một dòng «Chỉ Quản trị
  sàn đổi được thuế phí».
- Lỗi & quay lại: môi giới ngoài 0–5 hay lẻ quá 0,1 → lý do dưới ô, Lưu khoá; tắt cả ba → lý do ở đầu khối; máy chủ lỗi →
  thông báo lỗi, giá trị gõ vẫn còn, bấm Lưu lại.

### 2. Kiểm kê màn

| Màn                          | MỘT việc của màn                                | Vào từ / ra tới                   |
| ---------------------------- | ----------------------------------------------- | --------------------------------- |
| Tuỳ chỉnh của sàn › Thuế phí | Đặt bao phí gồm khoản nào và môi giới bao nhiêu | Cột thứ hai của App Shell / ở lại |
| Bảng hàng                    | Xem hàng, nay có Về tay theo mức của sàn        | Thanh bên / hồ sơ căn             |

### 3. Bảng trạng thái

<!-- <<<UX-STATE-TABLE -->

| Trạng thái           | Màn       | Hiển thị gì                                                        | Người làm gì tiếp              |
| -------------------- | --------- | ------------------------------------------------------------------ | ------------------------------ |
| ST-thue-phi-loading  | Thuế phí  | Ba dòng khung xương                                                | Chờ                            |
| ST-thue-phi-default  | Thuế phí  | Ba dòng, nguồn «Mặc định»                                          | Đổi rồi Lưu                    |
| ST-thue-phi-changed  | Thuế phí  | Dòng đã đổi mang «Đã đổi · người · ngày»                           | Đổi tiếp hay «Trả về mặc định» |
| ST-thue-phi-invalid  | Thuế phí  | Lý do dưới ô hay đầu khối, Lưu khoá                                | Sửa ô                          |
| ST-thue-phi-readonly | Thuế phí  | Ba dòng không ô sửa, một dòng «Chỉ Quản trị sàn đổi được thuế phí» | Đọc                            |
| ST-thue-phi-error    | Thuế phí  | «Không tải được thuế phí» kèm Thử lại                              | Thử lại                        |
| ST-inventory-net     | Bảng hàng | Cột Về tay; hàng thiếu giá hay điều kiện thì ô trống               | Sắp, lọc                       |

<!-- UX-STATE-TABLE>>> -->

### 4. Hành vi

- Ô Phí môi giới nhận số thập phân kiểu Việt («1,5»), 0–5, một chữ số sau dấu phẩy; Enter là Lưu; Esc trả ô về giá đang áp.
- «Trả về mặc định» ở mỗi dòng đã đổi; Lưu gửi cả mức một lần.
- Màn chỉ trên máy tính như các màn cấu hình khác; Bảng hàng theo bốn khổ có sẵn.

### 5. Xuất xứ component

| Component                                  | Nấc  | Vì sao                                                                                   |
| ------------------------------------------ | ---- | ---------------------------------------------------------------------------------------- |
| `FramedList` (họ danh sách khung, hàng 9c) | dùng | Một nhóm cố định các khoản, mỗi khoản một dòng có chỗ chỉnh — luật đồng nhất (G-1411-87) |
| `Switch` (shadcn)                          | dùng | Công tắc «Tính vào giá bao phí»; thêm bằng lệnh shadcn                                   |
| `PermittedAction`                          | dùng | Nút Lưu theo `setFeeSchedule`                                                            |
| Cột tiền của lưới                          | dùng | Về tay hiện và sắp như Giá chào                                                          |

### 6. Khuôn IA đã chọn + căn cứ

Khuôn IA: trung-tâm-toả-nhánh (hub-and-spoke)
Căn cứ: Tuỳ chỉnh của sàn của 7e đã là trung tâm, mỗi phần một nhánh ở cột thứ hai; Thuế phí là một nhánh nữa. Luồng hiển
nhiên, không tra mẫu.

### 7. Thẻ việc

| Trường     | Giá trị                                                          |
| ---------- | ---------------------------------------------------------------- |
| Ai dùng    | Quản trị sàn (đặt); Đầu chủ, Đầu khách, Trưởng nhóm (đọc Về tay) |
| Việc chính | Đặt bao phí của sàn gồm khoản nào và môi giới bao nhiêu          |
| Tần suất   | hiếm                                                             |
| Số bản ghi | một                                                              |
| Thiết bị   | máy tính                                                         |

<!-- UX-SPEC-TEMPLATE>>> -->

## Câu hỏi cho chủ kho (Cổng Phạm vi)

- **Hỏi-1** Thêm Điều kiện phí cho từng hàng vào mô hình nghiệp vụ? Khuyên: có. Lối khác: một điều kiện chung cho cả sàn.
- **Hỏi-2** Đặt mức ở phần «Thuế phí» trong Tuỳ chỉnh của sàn? Khuyên: có. Lối khác: màn Cài đặt sàn riêng.
- **Hỏi-3** Bảng hàng hiện sẵn một cột Về tay, cột Điều kiện phí ẩn sẵn? Khuyên: có. Lối khác: hiện sẵn cả hai.
- **Hỏi-5** Mặc định môi giới 1%, bước 0,1%? Khuyên: có (theo Quỹ hàng). Lối khác: mặc định 0% — sàn chưa đặt thì Về tay
  chỉ trừ thuế và lệ phí.
- **Hỏi-4** Để dấu định nghĩa lúc tính cho hàng 10? Khuyên: có. Lối khác: dựng bảng dấu ngay.
- **Hỏi-6** Quản trị sàn thấy kết quả bằng một dòng ví dụ tính sẵn trong phần Thuế phí? Khuyên: có, Bảng hàng cho Quản
  trị sàn để hàng 10. Lối khác: thêm quyền xem Bảng hàng cho Quản trị sàn ngay ở hàng này.
