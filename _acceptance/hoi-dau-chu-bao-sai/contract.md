---
schema_version: 1
feature: "Đầu khách bấm «Hỏi đầu chủ» trên hồ sơ căn để mở bảng chia sẻ của máy với tin soạn sẵn cho người giữ căn, và bấm «Báo sai thông tin căn» để soạn tin nêu trường sai cùng giá trị đúng; người tự bấm gửi"
slug: hoi-dau-chu-bao-sai
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [ui]
screens: [inventory]
status: signed-off
approved_by: Manh Phan
approved_at: 2026-11-13
design_doc: _acceptance/hoi-dau-chu-bao-sai/design.md
---

# Acceptance Contract: hoi-dau-chu-bao-sai

## Context

Hàng 3e của lộ trình (`docs/plan/lo-trinh.json`), tách từ bảng so Chi tiết căn Quỹ hàng ↔ Inventory (mục 25, 35). Hồ sơ căn
của hàng 3 chỉ đọc và cắt nút hỏi ra; hàng này thêm hai nút vào hồ sơ ấy: «Hỏi đầu chủ · [Tên]» dính đáy hồ sơ cho người
không giữ căn, và «Báo sai thông tin» ở mục thuộc tính. Cả hai chỉ soạn chữ rồi mở bảng chia sẻ của máy (hay chép khi máy
không có); người tự bấm gửi. Chạm SP-3 (người luôn là người bấm gửi) và giữ nó; không chạm SP-1 (không truy vấn cơ sở dữ
liệu), không chạm SP-4 (tin là tin nội bộ, không phải trang khách).

Ai giữ căn chưa có dữ liệu thật (hàng 10): hàng này dùng dữ liệu mẫu MAU — mỗi hàng mẫu do người khác giữ (`[Tên] 0x`), do
chính người đang xem giữ, hoặc chưa ai giữ. Hàng 10 thay nguồn; luật hiện nút không đổi.

Hạng T3 (không phải T2 như lộ trình ghi): hai nhãn nút mới vào `ontology/labels.yaml`, là đường T3 của kho.

Source input: hàng `3e` của lộ trình, ô `_acceptance/hoi-dau-chu-bao-sai/opportunity.md` (build), lời giao của giám sát đợt
«nen» cho dãy V, phân xử V-1311-2 (chỗ đặt mã), mã Quỹ hàng `1729b11f`.

## Criteria

- AC-1 (theo khuyến nghị của câu hỏi chỗ đặt nút hỏi; chủ kho chọn đầu hồ sơ thì AC-1 đổi thành nút chính ở đầu hồ sơ trước khi dựng): Given hồ sơ
  một căn do người khác giữ đang mở, người xem có quyền xem hàng, When nhìn đáy hồ sơ ở bốn khổ, Then có
  một thanh dính đáy (không cuộn theo thân) với một nút «Hỏi đầu chủ · <tên người giữ>»; ở 414 và 360 nút dùng cỡ lớn của bộ nút (cao 36 px; bộ nút của kho không có cỡ 44 px — sửa sau Cổng Phạm vi)
  và rộng hết hồ sơ toàn màn; thanh không che dòng cuối của thân khi cuộn hết.
- AC-2: Given thanh hỏi của AC-1 trên máy có bảng chia sẻ, When bấm nút, Then máy gọi bảng chia sẻ đúng một lần ngay trong
  lượt bấm với tin «Hỏi về căn <mã căn> · <toà>» và đường dẫn tuyệt đối `/inventory?ho-so=<mã hàng>` của chính căn ấy; mở
  đường dẫn ấy thì hồ sơ của đúng căn ấy hiện; người huỷ bảng chia sẻ thì không có thông báo nào.
- AC-3: Given máy không có bảng chia sẻ hoặc bảng chia sẻ từ chối (lỗi khác huỷ), When bấm «Hỏi đầu chủ», Then tin và
  đường dẫn được chép vào bộ nhớ tạm và hiện thông báo «Đã chép tin hỏi»; chép cũng không được thì báo lỗi kèm nguyên tin để
  chép tay; thông báo lỗi ở lại tới khi người đóng.
- AC-4: Given hồ sơ một căn chưa ai giữ, When nhìn đáy hồ sơ, Then nút ở thanh đáy tắt, mang chữ «Căn chưa có đầu chủ giữ», và
  bấm không gọi bảng chia sẻ hay bộ nhớ tạm.
- AC-5: Given người xem chính là người giữ căn, hoặc vai của người xem không có ô xem hàng trong bảng quyền (Quản trị sàn),
  When mở hồ sơ căn, Then không có thanh đáy và không có nút hỏi; đổi sang căn người khác giữ (bấm «Sau») thì thanh hiện lại.
- AC-6: Given hồ sơ đang mở, người xem có quyền đọc danh mục căn, When bấm «Báo sai thông tin» ở mục thuộc tính, Then hộp
  «Báo sai thông tin căn <mã>» mở với danh sách năm thuộc tính danh mục (Căn, Toà, Dự án, Diện tích, Phòng ngủ) và dòng «Đang
  hiện: <giá trị trên hồ sơ>» theo thuộc tính đang chọn; ô giá trị đúng nhận tối đa 200 ký tự, ô căn cứ tối đa 500; bấm «Chép
  và mở bảng chia sẻ» khi giá trị đúng trống (sau khi cắt khoảng trắng) thì không soạn gì và ô ấy báo lỗi tại chỗ «Gõ giá trị
  đúng trước khi gửi.» (cách báo lỗi trường của hộp dùng chung).
- AC-7: Given hộp báo sai đã điền, When bấm «Chép và mở bảng chia sẻ», Then tin gồm đúng các dòng mã căn, toà, dự án, thuộc tính,
  đang hiện, đúng là, và ghi chú khi có, đi cùng đường của AC-2 và AC-3 (bảng chia sẻ; không có thì chép); hộp hiện «Đã mở bảng
  chia sẻ» / «Đã chép» / lỗi kèm ô chỉ đọc chứa tin; đóng hộp thì xoá các ô.
- AC-8: Given cả hai nút, When bấm qua mọi nhánh của AC-2, AC-3, AC-4, AC-7, Then trình duyệt không gửi yêu cầu mạng nào, dữ
  liệu căn trên Bảng hàng và hồ sơ không đổi, và mã của hàng không có đường gửi nào ngoài bảng chia sẻ của máy và bộ nhớ tạm
  (dấu hiệu SP-3 không khớp); hai nút chỉ hiện qua bộ nút theo quyền của hàng 9e (thao tác `viewListings`, `readCatalog`),
  bên ngoài khung nội bộ không nút nào hiện. (cross-layer)
- AC-9: Given Bảng hàng đang chạy với hồ sơ của căn người khác giữ đang mở, When nhìn ở bốn khổ, sáng và tối, cả thanh đáy và
  hộp báo sai, Then quét trợ năng không có lỗi mức nghiêm trọng hay nguy cấp, chữ hai nút lấy từ bảng nhãn và không quá 17
  ký tự, chữ không chồng chữ, ảnh tối đọc được. (judgment)

## Sửa sau Cổng Phạm vi

Chủ kho phê ở Cổng Bằng chứng (giám sát phân xử, LUAT của đợt).

- AC-10 (G-1311-39, chủ kho nguyên văn «Có, mọi khổ»): Given hồ sơ căn đang mở ở bốn khổ, sáng và tối, When nhìn đầu hồ
  sơ, Then đầu hồ sơ có hai dòng — tên căn một dòng riêng, các nút (Chép đường dẫn, «…», Trước, Sau, Đóng) một dòng dưới —
  «Chép đường dẫn» chỉ là biểu tượng có tên đọc được cho trình đọc màn hình và gợi ý khi rê; tên căn không bị bóp hay xuống
  dòng từng chữ và không nút nào tràn khỏi hồ sơ ở 360 và ở ngăn nổi 1024.
- Chỗ đặt (G-1311-38): thanh dính đáy là chỗ đặt thứ năm của bộ nút, chứa đúng một nút; ghi vào luật bộ nút.

## Vai × Màn

Vai của người xem đọc từ bảng quyền qua khuôn nút 9e. Người giữ căn là dữ liệu mẫu tới hàng 10.

| Màn | Đầu chủ | Đầu khách | Trưởng nhóm | Quản trị sàn |
|---|---|---|---|---|
| inventory | được — hỏi người giữ căn của căn mình không giữ, báo sai thuộc tính căn | được — hỏi người giữ căn, báo sai thuộc tính căn | được — hỏi người giữ căn, báo sai thuộc tính căn | chặn — không có ô xem hàng nên không mở được hồ sơ căn; bảng quyền của hàng 9a quyết |

## Coverage

Quét theo khuôn «entity-feature» của bộ quét hình thái; bản đầy đủ ở mục «Quét không gian tiêu chí» của `design.md`.

- Trục A — người xem: không giữ căn · giữ căn · vai không có ô xem hàng · ngoài khung nội bộ.
- Trục B — căn: có người giữ · chưa ai giữ.
- Trục C — máy: có bảng chia sẻ · chỉ chép · không cả hai; kết cục: gửi · huỷ · từ chối · lỗi chép.
- Trục D — khổ: 1440 · 1024 · 414 · 360; sáng · tối.
- Trục E — nút: hỏi · báo sai (năm thuộc tính, ô trống, ô chạm trần).

Thước: AC-1, AC-4, AC-5 phủ A × B; AC-2, AC-3, AC-7 phủ C; AC-6 phủ E; AC-1, AC-9 phủ D; AC-8 phủ A (ngoài khung, không
quyền) và C (không mạng). [CE chưa kiểm chứng]: bảng chia sẻ thật của điện thoại (Zalo, Messenger trong danh sách) không đo
được trong trình duyệt kiểm thử — đo bằng hàm giả của `navigator.share`; thử trên máy thật vào danh sách nghiệm thu cuối lộ
trình.

## Đường đo

- bỏ đường đo — ô cơ hội chưa khai ngưỡng (sổ quyết định).

## Out of scope

- Không chỗ nhận báo sai trên máy chủ, không ghi nhật ký «đã hỏi», không thông báo trong ứng dụng (sổ quyết định, descope).
- Không dữ liệu người giữ căn thật (hàng 10); không đổi thực thể Listing.
- Không nút «Ghi cuộc gọi» ở đáy hồ sơ (hàng 14); thanh đáy của hàng này để chỗ cho nó nhưng không dựng.
- Không báo sai giá, trạng thái, ngày xác nhận (dữ liệu riêng của sàn, người giữ căn sửa) — câu hỏi các thuộc tính báo sai.
- Không thêm dòng bảng quyền; không chạm mô-đun sharing (hàng 6 giữ).

## Notes

- Known limits — chọn ở Cổng Bằng chứng 2026-11-14:
  - Ngoài-1: Thẻ trình chủ kho ghi sai là nhiều phép đo chưa đạt và bảo quay lại sửa, trong khi thực tế chỉ một phép đo trượt. Chủ kho có thể đọc nhầm mức độ hỏng, nhưng tính năng cho người dùng cuối không bị ảnh hưởng.
  - Ngoài-2: Người dùng không thấy gì khác trên màn hình. Chỉ là bộ kiểm tra tự động của đội đang báo đỏ nên khó tin vào tín hiệu xanh trước khi phát hành.
  - Ngoài-4: Với căn nhập thật từ Sheet, nút hỏi sẽ luôn báo «Căn chưa có đầu chủ giữ» dù thực tế có người giữ, nên người dùng không hỏi được đầu chủ qua nút này.
  - Ngoài-7: Bài kiểm thử có thể không bắt được lỗi nếu «Đang hiện» trong hộp báo sai lệch với giá trị hồ sơ, nên một lỗi như vậy có thể lọt tới người dùng.
  - Ngoài-8: Bài kiểm thử không chứng minh dòng câu hỏi trong tin chép đúng căn, nên tin hỏi nhầm căn có thể không bị phát hiện.
  - Ngoài-9: Khi chép thất bại, ô chép tay có thể thiếu phần câu hỏi mà bài kiểm thử vẫn không báo, nên người dùng có thể chỉ nhận được đường dẫn.
  - Ngoài-10: Bài kiểm thử vai Quản trị sàn không chứng minh gì về luật ẩn nút, nên nếu nút lỡ hiện sai cho vai này thì sẽ không bị bắt.
  - Ngoài-11: Kiểm thử không phát hiện được trường hợp đổi sang căn khác mà thanh đáy vẫn giữ tên người giữ căn cũ, nên người dùng có thể hỏi nhầm người.
  - Ngoài-12: Một phép kiểm kiểu «đổi căn thì thanh đáy phải đổi người giữ» luôn xanh nên không bắt được lỗi nếu thanh đáy giữ nhầm tên người giữ cũ. Người dùng chưa thấy lỗi thật nào, chỉ là lưới an toàn ở chỗ này lỏng.
  - Ngoài-13: Phép kiểm cho vai Quản trị sàn có thể xanh dù trang tải lỗi, nên chưa chắc chứng minh được là nút hỏi bị ẩn đúng vì luật quyền. Hành vi thật với người dùng chưa thấy sai.
  - Ngoài-14: Nếu dòng «Đang hiện» trong hộp báo sai lấy nhầm giá trị của thuộc tính khác thì các phép kiểm hiện tại vẫn không báo. Chưa có bằng chứng người dùng đang thấy giá trị sai.
  - Ngoài-15: Phần câu hỏi trong tin chép (mã căn, toà) không được đối chiếu với hàng thật, chỉ đường dẫn được kiểm. Nếu tin hỏi nhầm căn, bài kiểm vẫn xanh, nhưng chưa thấy tin sai thật.
  - Ngoài-16: Một số ca kiểm «nếu bỏ luật thì phải đỏ» không thực sự bỏ luật nên không chứng minh được lưới bắt lỗi hoạt động. Người dùng không thấy khác biệt nào hiện nay.
  - Ngoài-17: Phép kiểm cho vai không có quyền đọc danh mục không phân biệt được «thiếu quyền đúng ô» với «thiếu cả khung quyền», nên nếu nút báo sai gắn nhầm quyền thì chưa chắc bị bắt. Chưa thấy ai bị hiện nút sai.
  - Ngoài-18: Một vài tổ hợp hiếm khi máy chia sẻ bị từ chối mà bộ nhớ tạm cũng hỏng hoặc không có chưa được kiểm tự động. Nếu có lỗi ở đó, người dùng có thể không nhận được thông báo đúng, nhưng chưa thấy lỗi thật.
  - Ngoài-19: Hai chỗ trong ứng dụng cùng viết một câu «Đang hiện» và một thông báo lỗi. Hôm nay người dùng thấy chữ giống nhau; nếu sau này sửa một chỗ quên chỗ kia thì hộp và tin chép đi sẽ lệch chữ.
  - Ngoài-21: Bài thử việc ai thấy nút hỏi tự tính đáp án từ chính bảng quyền, nên nếu bảng quyền đổi nhầm thì bài thử vẫn xanh. Người dùng có thể thấy hoặc mất nút sai mà không ai báo.
  - Ngoài-22: Bài thử chỉ kiểm dòng «Đang hiện» có chữ, chưa kiểm đúng giá trị của thuộc tính đang chọn. Nếu hiện nhầm giá trị của thuộc tính khác thì bài thử vẫn qua.
  - Ngoài-23: Bài thử chưa kiểm dòng đầu của tin hỏi có đúng căn và toà hay không, chỉ kiểm đường dẫn. Chép nhầm căn sẽ không bị bắt.
  - Ngoài-24: Mấy ca thử đối chứng không chứng minh được bài thử thật sẽ bắt được lỗi. Nếu sau này nút hiện sai chỗ, các ca này có thể không báo.
  - Ngoài-25: Một ca thử không đo được việc thanh đáy có còn giữ tên người giữ căn trước khi đổi sang căn khác hay không. Nếu lỗi này xảy ra, người dùng sẽ thấy tên người giữ sai.
  - Ngoài-26: Chưa chứng minh được nút báo sai ẩn đi đúng vì thiếu quyền đọc danh mục, chứ không phải vì lý do khác. Có thể có vai bị ẩn hoặc hiện nút sai mà không ai báo.
