# Đề xuất: lần nhập Sheet là lúc ánh xạ chuẩn với không chuẩn

Soạn ngày 12/11/2026 ở hàng 7d, theo lời chủ kho cùng ngày: «MVP sẽ cho người dùng bắt đầu bằng import file google sheet
hay excel mà họ đang làm việc quản lý bảng hàng vào. Tại thời điểm này là họ bắt đầu hoạt động trên onehub-inventory. Khi
Import vào thì đây chính là thời điểm mapping giữa sự chuẩn hoá của onehub-inventory và sự không chuẩn của người dùng.»

## Kết luận

Màn nhập là màn cấu hình của sàn trong MVP. Mỗi lần người ghép một cột, một giá trị, một mã căn, máy ghi lại thành nhãn
riêng, trường riêng, từ điển và mã riêng của sàn. Lần sau cùng dạng tệp thì không phải ghép lại. Sàn không cần mở màn
Cài đặt nào mà sản phẩm vẫn nói đúng chữ của sàn. Để được vậy, lộ trình hiện tại thiếu hai thứ: lớp riêng của sàn (đang
hoãn ở L4) và nhớ mẫu nhập (đang hoãn ở L5).

## Khung

Sheet của sàn không sai, chỉ khác chuẩn. Lần nhập phải đi một chiều: dữ liệu vào lõi chuẩn bằng mọi đường có thể, phần
không vào được thì giữ lại ở lớp của sàn, **không ô nào bị bỏ lặng lẽ**. Ba luật:

1. **Không mất ô nào.** Mỗi ô có một đích: trường chuẩn, trường riêng, hoặc giữ nguyên bản gốc kèm dấu «cần người».
2. **Máy đề xuất, người chốt.** Mỗi ô mang một trong bốn dấu của Quỹ hàng: giữ nguyên · máy sửa (kèm lý do) · cần người
   · chặn. Không có đường nhập thẳng.
3. **Ghép một lần, dùng mãi.** Mọi lựa chọn của người ở màn xem trước được ghi vào bộ nhớ của sàn khi lần nhập thành công.

## Năm chỗ ghép trong một lần nhập

| Chỗ ghép | Sheet của sàn | Lõi chuẩn | Phần không khớp đi đâu | Lưu ở |
|---|---|---|---|---|
| Cột | «Toà», «Block», «Giá KBP», «View» | Trường RESO: `BuildingName`, `ListPrice` kèm điều kiện phí… | Thành **trường riêng** của sàn (người đặt kiểu), hay người bấm «bỏ cột» có chủ ý | Mẫu nhập, định nghĩa trường riêng |
| Tên cột | Chữ sàn quen gọi | Nhãn chuẩn của sản phẩm | Chữ của sàn thành **nhãn riêng** của trường chuẩn (sàn vẫn thấy «Block») | Nhãn riêng |
| Giá trị | «ĐN», «KBP», «Phí CN», «còn» | Giá trị chuẩn: Đông Nam, không bao phí, Đang bán | Giá trị lạ giữ nguyên, dấu «cần người»; người chọn thì vào **từ điển** | Từ điển giá trị |
| Căn | «SA5-12.08», «S1.05 - 1208», «Sapphire 5 tầng 12» | Căn trong danh mục chung (khoá `unt_`) | Tra: mã riêng → mã gốc → 8 dạng của invest; không ra thì thành **căn chờ khớp** của sàn, giữ nguyên mã | Mã riêng (hàng 7d), căn chờ khớp |
| Dạng tệp | Thứ tự và tên cột của tệp | — | Cả bộ ghép thành **mẫu nhập**; lần sau tệp cùng dạng tự ghép | Mẫu nhập |

Căn chờ khớp quan trọng nhất cho ngày đầu: danh mục chung hôm nay chỉ có ba dự án mẫu, nên gần hết căn của một sàn thật
sẽ chưa có trong danh mục. Không có chỗ này thì hoặc chặn nhập (sàn bỏ đi), hoặc để sàn ghi thẳng vào danh mục chung
(danh mục bẩn, invest đọc phải rác). Căn chờ khớp là căn của sàn, có khoá sàn, sàn dùng được ngay; khi danh mục có căn ấy
thì khớp vào, sàn không phải nhập lại.

## Từ Quỹ hàng

- `docs/adr/0011-nhap-du-lieu-tac-tu.md`, quyết định 1, 6: bộ ghép tất định (từ điển tiêu đề chuẩn + bộ nhớ của sàn) là
  chế độ nền; AI chỉ lấp phần bộ nhớ chưa biết; bộ nhớ là mẫu file và từ điển giá trị của sàn; mọi sửa của người ghi vào
  bộ nhớ khi lần nhập thành công. **Giữ** cả khuôn, **để sau** phần AI (H5).
- Số đo chế độ không AI trên tám tệp thử: không ô lỗi nào lọt, ghép cột đúng hết trừ một tệp bẩn (11/12 cột)
  (`_acceptance/nhap-loi-tat-dinh/so-nen.json`). Nghĩa là MVP không cần AI để ghép, cần bộ nhớ của sàn.
- `052_can_ngoai_khu.sql`: căn của sàn ngoài danh mục, có khoá sàn. **Giữ** ý, mở rộng thành căn chờ khớp cho mọi căn
  chưa có trong danh mục, không chỉ căn ngoài khu.
- `043_truong_rieng.sql`, `039_cach_goi_rieng.sql`, `051_tu_dien_cua_san.sql`: trường riêng, nhãn riêng, từ điển — xem
  thiết kế hàng 7d mục «Từ Quỹ hàng».
- Quỹ hàng **không có**: nối mã riêng của sàn với danh mục (hàng 7d lấp), và luật «không ô nào mất» thành phép đo.

## Lộ trình hôm nay thiếu gì

| Hàng | Hôm nay | Thiếu cho lần nhập |
|---|---|---|
| 7d | Lõi chuẩn + mã riêng của sàn (đang ở Cổng Phạm vi) | Đủ phần của nó: bước «tra căn» của lần nhập dùng thẳng hàm tra ba nguồn |
| 11 «Nhập Excel» | Nạp tệp, xem trước, áp, hoàn tác (10 tiêu chí) | Ghép vào trường riêng, nhãn riêng, từ điển; căn chờ khớp; nhớ mẫu nhập; luật «không ô nào mất» |
| H4 (L4) | Hoãn tới đợt 3 «khi có sàn thứ hai» | Lớp riêng của sàn là nơi lần nhập ghi vào |
| H5 (L5) | Hoãn nhập có AI và nhớ mẫu nhập | Nhớ mẫu nhập là tất định, không cần AI — tách ra khỏi H5 |

## Đề xuất

1. **Hàng 7e — Lớp riêng của sàn** (sau 7d, trước 10): nhãn riêng, trường riêng (chữ, số, ngày, chọn một, có/không; trần
   20 trường, 30 lựa chọn), từ điển giá trị, căn chờ khớp, mẫu nhập — lưu, đọc, cách ly theo sàn; Bảng hàng hiện trường
   riêng sau cột chuẩn và đọc nhãn riêng. Rào ADR-0018: không đối tượng tự tạo, không công thức.
2. **Hàng 11 mở rộng — Nhập Sheet là lúc ghép**: năm chỗ ghép ở bảng trên, bốn dấu mỗi ô, ghi bộ nhớ khi thành công.
   Thước nhận: trên bộ tệp thử bẩn có đáp án, 100% ô có đích (không ô nào mất), lần nhập thứ hai cùng dạng tệp không hỏi
   lại câu nào đã trả lời, hoàn tác gỡ cả ô lẫn bộ nhớ vừa học.
3. **Tách «nhớ mẫu nhập» khỏi H5**: AI vẫn hoãn; bộ nhớ tất định vào MVP.
4. **Màn Cài đặt sàn (H4) vẫn để sau**: trong MVP, sửa nhãn, trường, từ điển đi qua màn nhập và một bảng xem lại tối giản
   trong 7e; màn cấu hình đầy đủ chờ sàn thứ hai.

Hàng 7d không đổi phạm vi vì đề xuất này: bước tra căn của lần nhập đã là AC-9.

## Cái giá

Thêm một hàng (7e) và nới hàng 11 từ 10 lên khoảng 12 tiêu chí, nên khả năng phải tách hàng 11 làm hai (ghép cột + giá
trị · ghép căn + mẫu). Đổi lại, ngày đầu của sàn không gặp «sản phẩm bỏ cột của tôi» hay «căn của tôi không có trong danh
mục nên không nhập được» — đúng hai lý do khiến triển khai cứng thất bại.
