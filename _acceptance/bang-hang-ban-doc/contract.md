---
schema_version: 1
feature: "Đầu chủ mở Bảng hàng và thấy các căn của sàn trên Lưới, đủ trạng thái màn, ở bốn khổ màn hình"
slug: bang-hang-ban-doc
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [ui]
screens: [inventory]
status: signed-off
approved_by: Manh Phan
approved_at: 2026-11-12
design_doc: _acceptance/bang-hang-ban-doc/design.md
---

# Acceptance Contract: bang-hang-ban-doc

## Context

Màn Lưới thật đầu tiên: Bảng hàng (`/inventory`) đọc 60 lần chào mẫu của hàng 1 trên khuôn Lưới dùng chung (1b, 1e),
đủ trạng thái vùng ở bốn khổ, rồi thành màn mẫu của họ Lưới (chốt của chủ kho ở hàng 1c). Bản đọc: không sửa, không hồ
sơ căn, không dữ liệu thật, chưa bắt đăng nhập. Hạng T3 vì phải gỡ Bảng hàng khỏi danh sách «chưa có vùng» của bộ bài
sinh từ sổ màn (`tools/e2e_templates/`) và thêm năm nhãn cột vào `ontology/labels.yaml`. Không chạm SP-1 (không truy vấn
cơ sở dữ liệu), SP-3, SP-4 (không phải trang khách).

Source input: hàng `2` của `docs/plan/lo-trinh.json`, ô `_acceptance/bang-hang-ban-doc/opportunity.md` (build), lời giao
của giám sát đợt «nen» (tự kiểm phép kiểm ma trận trạng thái; khai màn và Vai × Màn; gỡ danh sách «chưa có vùng»; ghi bản
số đo), `design/behaviors.md` dòng «Chia trang — chốt ở lát cắt Bảng hàng».

## Criteria

- AC-1: Given dữ liệu mẫu của hàng 1 (căn của danh mục, lần chào và liên kết căn của sàn mẫu), When dựng dòng Bảng hàng,
  Then có đúng 60 dòng, mỗi dòng mang id của lần chào, mã căn, toà, khu, trạng thái, giá chào và lúc xác nhận của lần chào,
  cùng diện tích và số phòng ngủ của ĐÚNG căn mà liên kết căn của lần chào ấy trỏ tới; và When một liên kết trỏ căn
  không có trong danh mục, Then dòng ấy hiện diện tích và phòng ngủ trống, không lấy số của căn khác.
- AC-2: Given mở Bảng hàng ở bốn khổ, When trang sẵn sàng, Then đầu màn là «Bảng hàng», vùng dữ liệu có cột số dòng rồi đúng
  tám cột theo thứ tự Căn · Toà · Dự án · Trạng thái · Giá chào · Diện tích · Phòng ngủ · Xác nhận lúc với nhãn lấy từ
  `ontology/labels.yaml`; cả 60 dòng nằm trong một lần cuộn liền (không chia trang), đánh số 1 đến 60 không hở; tiêu đề cột
  đứng yên khi cuộn dọc, cột số dòng cùng Căn và Toà đứng yên khi cuộn ngang; chân bảng ghi «60 dòng»; giá hiện theo kiểu
  tiền, diện tích theo m², trạng thái là huy hiệu chữ của trạng thái ấy.
- AC-3: Given bộ bài sinh từ sổ màn (hàng 1f), When chạy bộ khung và bộ vùng trên Bảng hàng ở bốn khổ, Then màn có vùng nên
  không còn bị bỏ qua: bốn bài khung (đầu màn đúng nhãn, không cuộn ngang, không lỗi trình duyệt, axe sáng và tối) và bảy
  trạng thái vùng (chờ tải, trống, tìm không ra, lỗi, một phần hỏng, chữ dài, không đủ quyền) cùng bài tìm đều xanh, và mỗi
  ca phá của mỗi bài đỏ với thông điệp ghim của nó trên chính Bảng hàng.
- AC-4: Given danh sách «chưa có vùng» của bộ công thức, When Bảng hàng đã có vùng, Then danh sách không còn `inventory`
  (Đã gửi vẫn còn với lý do cũ); và Given một bản sao danh sách thêm lại `inventory`, When xếp loại Bảng hàng, Then đỏ
  «da co vung, go khoi danh sach: inventory».
- AC-5: Given bài «tìm» của bộ công thức và lưới cuộn liền, When đọc dòng và chọn chuỗi thử, Then bài đọc mọi dòng bằng cách
  lăn chuột cuộn khung lưới từ đầu tới cuối (không dựa vào trang), và chọn chuỗi theo số dòng khung đầu dựng sẵn: trên 60 dòng
  của Bảng hàng có chuỗi đạt (khớp nhiều hơn khung đầu, ít hơn mọi dòng, có dòng khớp nằm ngoài khung đầu); và When phá bằng
  ẩn một dòng kết quả, hay khoá khung cuộn để kết quả không cuộn được quá khung đầu, Then bài đỏ «tim: bo sot dong khop».
- AC-6 (cross-layer): Given bản thật (`NODE_ENV=production`), When mở Bảng hàng với `?state=error` (hay `loading`, `empty`, `partial`,
  `forbidden`), Then vùng ở trạng thái có dữ liệu; Given bản phát triển hay bản chạy thử, When mở với từng tham số ấy, Then
  vùng ở đúng trạng thái ấy, và tham số lạ thì có dữ liệu; đo ở chính trang Bảng hàng (trang đọc tham số và môi trường), không chỉ ở bộ đọc thuần, và trang có dữ liệu thì dòng của một lần chào biết trước mang diện tích và phòng ngủ của đúng căn liên kết.
- AC-7: Given tệp chứng minh màn của hồ sơ này, When chạy lưới chứng minh màn, Then mục `## Màn inventory` theo lối màn mẫu
  mới có ma trận đủ mười một trạng thái của `design/states.md` (bảy «đạt» trỏ bài kiểm có thật, bốn «không áp» có lý do)
  và bảng khối, lưới xanh, và `design/patterns/luoi.md` ghi `Màn: inventory` không còn ngoại lệ của trang Bảng hàng.
- AC-8: Given kho thật, When chạy bài tự kiểm phép kiểm ma trận, Then nó chứng rằng: lưới chứng minh màn đọc được đúng mười
  một trạng thái từ `design/states.md` (không phải bảng rỗng), hợp đồng này nằm trong diện được chấm ở trạng thái của nó
  (không bị bỏ qua vì trạng thái lạ), và trên một bản sao kho xoá dòng «Lỗi» khỏi ma trận của Bảng hàng thì lưới đỏ «ma
  trận thiếu trạng thái 'Lỗi'»; khi lưới đọc bảng trạng thái rỗng thì chính bài tự kiểm đỏ «bảng trạng thái rỗng».
- AC-9: Given năm khái niệm nhãn mới (giá chào, trạng thái, diện tích, phòng ngủ, xác nhận lúc), When chạy bộ kiểm ngôn ngữ
  và sinh lại, Then mỗi khái niệm có tên RESO hay ghi là của mình, nhãn ưu tiên duy nhất, có trong bảng thuật ngữ, và không
  tệp nào dưới `src/` gõ cứng các nhãn ấy.
- AC-10: Given Bảng hàng đang chạy, When nhìn ở bốn khổ với trạng thái có dữ liệu, sáng và tối, Then thấy đầu màn, tám cột
  đọc được (lưới dày và cuộn ngang trong vùng ở khổ hẹp), tên khu dài bị cắt gọn, trang không cuộn ngang. (judgment)
- AC-11: Given Bảng hàng với 60 căn mẫu ở khổ 1440, When trang sẵn sàng, Then cả tám cột hiện đủ trong vùng và vùng không
  cuộn ngang; và Given một cột chữ của Lưới dùng chung, When vùng giữ các dòng của nó, Then cột rộng bằng chuỗi dài nhất
  vùng đang giữ (không hẹp hơn nhãn, không quá độ dài đọc của kiểu) cộng đệm — mã căn bốn ký tự không chiếm chỗ của tên khu —
  và bề rộng không đổi khi gõ tìm hay chuyển trang.

## Vai × Màn

Bản khai vai nói Quản trị sàn không thấy hàng theo mặc định. Hôm nay khung chưa có vai thật của người đăng nhập (chưa bắt
đăng nhập), nên ô dưới là ý định; vùng đã có trạng thái «không đủ quyền», nối vai thật vào vùng là bảng quyền của hàng 9a.

| Màn | Đầu chủ | Đầu khách | Trưởng nhóm | Quản trị sàn |
|---|---|---|---|---|
| inventory | được — đọc và tìm mọi căn của sàn | được — đọc và tìm mọi căn của sàn | được — đọc và tìm mọi căn của sàn | chặn — vùng báo không đủ quyền theo bản khai vai; bảng quyền của hàng 9a quyết |

## Coverage

Quét trục tại chỗ theo khuôn «entity-feature» của bộ quét hình thái, không gọi bộ quét (sổ quyết định):

- Trục 1 — nguồn dòng: lần chào có căn · liên kết trỏ căn không có.
- Trục 2 — trạng thái vùng: có dữ liệu + bảy trạng thái của `design/states.md` · bốn trạng thái không áp (xung đột khi
  lưu, mất mạng khi lưu: bản đọc không lưu; phiên hết hạn: của khung; link hết hạn: của trang khách).
- Trục 3 — khổ: 360 · 414 · 1024 · 1440; sáng · tối.
- Trục 4 — môi trường: bản phát triển · bản thật.
- Trục 5 — chiều đo: ca chính xanh · ca phá đỏ với thông điệp ghim.
- Trục 6 — vai: bốn vai của bản khai.

Thước: AC-1 phủ trục 1; AC-3 phủ trục 2 (bảy trạng thái) và trục 5; AC-7 phủ trục 2 (bốn không áp); AC-2, AC-3, AC-10, AC-11 phủ
trục 3; AC-6 phủ trục 4; AC-4, AC-5, AC-8 phủ trục 5; Vai × Màn phủ trục 6 bằng ý định. [CE chưa kiểm chứng]: trục 6 chưa
có phép đo — vai thật chưa nối vào khung.

## Đường đo

- bỏ đường đo — ô cơ hội chưa khai ngưỡng (sổ quyết định).

## Out of scope

- Không «dùng tay như Sheet» ở hàng này (hàng mới sau hàng 2): đi giữa các ô bằng phím mũi tên, bôi vùng và chép, sắp xếp,
  lọc từng cột, nhóm theo toà, ẩn hiện cột; sửa trên ô là hàng 4, 5.
- Không đo ngưỡng 5.000 dòng của Quỹ hàng ở hàng này: đo ở hàng nối dữ liệu thật; hàng này có 60 dòng mẫu.

- Không sửa trên ô (B4), không hồ sơ căn cạnh bảng (hàng 3), không lọc hay sắp xếp theo cột, không chọn dòng; khung xếp
  theo `data-grid-editing-6` mà chưa thêm chức năng nào của nó (Hỏi-4): không nút lọc, chọn cột, xuất, không dòng tổng.
- Không nút «Thêm dòng» hay nhập tệp ở trạng thái trống: chưa có lối nhập; câu trống chỉ nói vì sao.
- Không đọc cơ sở dữ liệu, không bắt đăng nhập, không gắn vai thật vào vùng (hàng 8, 9a).
- Không màn Đã gửi: vẫn trong danh sách «chưa có vùng».
- Không bảng thẻ trên điện thoại (khối Quỹ hàng `product-grid-4`): chủ kho chốt là hàng riêng sau hàng 3 (Hỏi-5); hàng này
  trên điện thoại là lưới cuộn ngang trong vùng.
- Không sửa hai lỗi nhỏ đã biết của bản chạy chậm của bộ bài (1f): gặp đỏ giả ở đó thì báo giám sát.

## Notes

- Hỏi-1 (cỡ trang 25) hết hiệu lực: chủ kho đổi hàng này thành «đọc như Sheet» (cuộn liền). Hỏi-2 (năm nhãn cột) đã hỏi giám sát đợt; lời đáp ghi vào sổ quyết
  định.
- Known limits — chọn ở Cổng Bằng chứng 2026-11-12:
  - Ngoài-1: Thẻ trình chủ kho còn xin phê một giới hạn cũ là bàn phím chưa vào được bảng trước khi trang nhận thao tác, dù lỗi này đã sửa xong.
  - Ngoài-2: Câu hỏi cho người chấm ảnh vẫn nói bốn ảnh dù đã có ảnh thứ năm.
  - Ngoài-3: Bài kiểm trợ năng có thể quét quá sớm, trước khi khung cuộn của bảng sẵn sàng.
  - Ngoài-4: Trên trang mẫu nội bộ, tiêu đề phần trạng thái toàn trang dùng chữ của trạng thái căn.
  - Ngoài-5: Khi sàn chưa có căn nào, câu báo trống viết sẵn chữ «căn».
  - Ngoài-6: Số dòng hiện hai lần, cạnh ô tìm và ở chân bảng.
  - Ngoài-7: Trên trang mẫu Lưới, hai cột còn mang tên cũ khác với Bảng hàng thật.
  - Ngoài-8: Số «60 dòng» hiện cạnh ô tìm và lặp lại ở chân bảng.
  - Ngoài-9: Bài kiểm chỉ xác nhận có huy hiệu trạng thái, chưa kiểm huy hiệu khớp đúng trạng thái của từng dòng.
  - Ngoài-10: Bài kiểm bề rộng cột khi gõ tìm không chứng minh ô tìm thật sự đã lọc dòng.
