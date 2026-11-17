---
type: entity
title: Listing (Hàng)
links: [ontology/entities/Listing.yaml, db/migrations/013_bang_can_chao.sql]
sources: [onehub-quy-hang/CONTEXT.md, "https://dd.reso.org/DD2.1/Property/StandardStatus/"]
---

# Listing (Hàng)

## Definition

Một lần chào bán hay cho thuê của sàn trên một căn. Ứng với tài nguyên `Property` của RESO. Đây là «Hàng», không phải
«Tin» (tin là của Invest).

## Rules

Sáu trạng thái chuẩn là tập con hợp lệ của `StandardStatus` trong DD 2.1. Sàn thêm nhãn riêng neo vào sáu giá trị này,
không thêm giá trị thứ bảy. Đã bán bắt buộc giá chốt và ngày bán; Ngừng hẳn bắt buộc lý do.

Trong một sàn, một căn có nhiều nhất một lần chào đang mở (Chưa đủ để rao, Đang bán, Đang giao dịch, Tạm ngừng); lần
chào Đã bán hay Ngừng hẳn ở lại làm lần chào cũ của căn (`one-open-listing-per-unit`, chủ kho chốt Hỏi-5 ở Cổng Phạm vi
hàng 3b).

Điều kiện phí (`feeInclusion`, hàng 19): Giá chào đã gồm thuế phí của sàn (Bao phí) hay chưa (Không bao phí); riêng của
ta, RESO không có. Bảng hàng tính Về tay từ Giá chào, Điều kiện phí và thuế phí của sàn
([fee-schedule](fee-schedule.md)); trang khách không đọc cả hai.

Người giữ căn (`listAgentKey`, RESO `ListAgentKey`, hàng 10): một thành viên của chính sàn, hay trống — «chưa ai giữ»; tên sàn
gọi người ấy chép kèm (`listAgentFullName`). Đưa lên Đang bán cần `activateListing`: Đầu chủ với căn mình giữ hoặc chưa ai
giữ, Trưởng nhóm toàn sàn (`keeper-activates`).

Sửa thông tin của lần chào đang mở (hàng 3g): pháp lý, nội thất, tài chính, tình trạng sử dụng sửa từng phần trên ô của
Bảng hàng (bốn cột, chủ kho chọn lối C) hoặc nhiều phần một lần ở hộp «Sửa» của hồ sơ căn — cùng một thay đổi `details`,
cùng ô `updateListing`, mỗi lần sửa tính là vừa xác nhận với chủ nhà. Pháp lý, tài chính tối đa 200 ký tự (chỉ kiểm phần
vừa đổi); lần chào đã bán hay ngừng giữ nguyên. Giá trị trường riêng của sàn sửa trên ô theo kiểu, máy chủ kiểm bằng
`checkCustomValue` của lớp riêng.

## Where in the code

`src/modules/listings/`: luật sửa giá và trạng thái ở `edit-rules.ts`, cổng lưu ở `save-door.ts`, sửa trên ô của Bảng hàng ở
`ui/use-listing-cell-edit.tsx`. Bảng `listings`, `listing_units` ở `db/migrations/013_bang_can_chao.sql`; đọc ở
`inventory-read.ts`, ghi ở `listings-http.ts` (`PATCH /api/v1/listings/[id]`), cổng lưu của trình duyệt ở
`ui/http-save-door.ts`. Hàng 3g: hộp «Sửa» ở `ui/listing-details-edit.tsx`, bốn cột ở `ui/detail-cells.ts`, đọc giá trị
gõ hay dán của trường riêng ở `custom-rules.ts`; một luật đọc kết cục ghi ở `src/lib/write-failure.ts`.

## History

Lấy từ từ vựng của Quỹ hàng khi dựng kho, 09/11/2026.

Hàng 9e, 12/11/2026: bảng quyền có dòng nháp `removeListing` — «Xoá căn» là gỡ khỏi danh sách, giữ dấu vết (sửa đổi của [0016](../decisions/0016-permission-model.md)).

Hàng 3b, 13/11/2026: thêm năm trường của lần chào — `furnished` và `occupantType` theo giá trị RESO, `legalStatus` và
`financing` chữ tự do (riêng của ta), `originalEntryTimestamp` để xếp các lần chào của căn; thêm luật một lần chào mở
trên một căn. Cơ sở dữ liệu chưa có bảng lần chào: cột đi cùng bảng ở hàng 10. Hồ sơ:
`_acceptance/ho-so-du-thong-tin/`.

Hàng 4, 13/11/2026: sửa Giá chào và Trạng thái trên ô của Bảng hàng. Mười hai lối chuyển trạng thái; Đã bán và Ngừng hẳn là nấc cuối, Đã bán khoá cả giá; Ngừng hẳn hỏi Lý do ngừng (ba lý do, khái niệm riêng). Mọi lần sửa đi qua một cổng lưu bốn kết cục; hôm nay ghi vào dữ liệu mẫu trong bộ nhớ, hàng 10 cắm đường ghi thật.

Hàng 5, 15/11/2026: dán một vùng từ Excel vào Bảng hàng — mỗi ô đọc bằng luật sửa trên ô của hàng 4, bản xem trước nói ô
nào đổi, ô nào bị bỏ và vì sao; áp một lần qua cùng cổng lưu, hoàn tác một lần. Hồ sơ: `_acceptance/dan-tu-excel/`,
quyết định [0040](../decisions/0040-dan-qua-ban-xem-truoc.md).

Hàng 3e, 13/11/2026: hồ sơ căn có nút «Hỏi đầu chủ» (người giữ căn) và «Báo sai thông tin» (thuộc tính danh mục). Ai giữ căn
chưa có trong mô hình: tới hàng 10 dùng dữ liệu mẫu `sampleKeeperOf` (`src/modules/listings/sample.ts`); hai tin soạn ở
`src/modules/listings/messages.ts`.

Hàng 2b, 14/11/2026: dưới 768 px Bảng hàng hiện mỗi lần chào thành thẻ căn ở dáng ngang (ô ảnh, mã căn và giá, nơi và
trạng thái, diện tích và phòng ngủ) — cùng `ListingCard` của đầu hồ sơ; chạm thẻ mở hồ sơ toàn màn, lùi về đúng chỗ.
Không sửa trên thẻ (hàng 3d). Hồ sơ: `_acceptance/bang-hang-the-dien-thoai/`.

Hàng 2d, 14/11/2026: Bảng hàng đi theo địa lý — cột thứ hai có mỗi dự án một nhóm (phân khu lồng toà), đọc từ chính
các dòng của bảng và chỗ đứng của toà trong danh mục; chọn một nơi chỉ thay lọc Dự án, Toà (danh sách tên khớp trọn),
giữ lọc khác; địa chỉ mang `?vung=<nơi>`. Không thêm trường hay luật của lần chào. Quyết định
[0036](../decisions/0036-mot-trang-thai-loc-theo-dia-ly.md); hồ sơ `_acceptance/bang-hang-theo-dia-ly/`.

Hàng 10, 16/11/2026: Bảng hàng trên dữ liệu thật — hai bảng của sàn, đọc theo sàn đang đăng nhập (lưới, hồ sơ, ô ⌘K, cây
địa lý từ một lần đọc), ghi qua `/api/v1` theo bảng quyền, xung đột trả bản hiện tại, hoàn tác chỉ trường đã đổi; sửa Điều
kiện phí trên ô; người giữ căn thật trên hồ sơ. Quyết định [0039](../decisions/0039-bang-hang-tren-du-lieu-that.md); hồ sơ
`_acceptance/bang-hang-du-lieu-that/`.

Hàng 3g, 17/11/2026: sửa bốn phần của lần chào trên ô và trong hồ sơ căn; sửa giá trị trường riêng trên ô và dán; kết cục ghi
«phiên hết hạn» và «máy chủ lỗi» thay vì «không đủ quyền» ([sua-thong-tin-can](../../_acceptance/sua-thong-tin-can/contract.md)).
