---
schema_version: 1
feature: Đầu chủ và Đầu khách lọc mọi bảng họ Lưới chỉ bằng cách gõ vào ô lọc dưới tiêu đề cột như ở Sheet; ô «Gõ để tìm» của vùng không còn trên màn nào của họ Lưới — Bảng hàng, Đã gửi, sau này Liên hệ; tìm thì dùng ô ⌘K ở thanh trên của App Shell (hàng 3f)
slug: bo-o-tim-cua-vung
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [ui]
screens: [inventory, sent]
status: verified
approved_by: Manh Phan
approved_at: 2026-11-13
design_doc: _acceptance/bo-o-tim-cua-vung/design.md
---

# Acceptance Contract: bo-o-tim-cua-vung

## Context

Hàng 2e của lộ trình. Bảng hàng có hai chỗ để gõ chữ lọc: ô «Gõ để tìm» của vùng và các ô dưới tiêu đề cột (hàng 2a). Chủ
kho thấy hai chỗ ấy làm người dùng rối và chốt 2026-11-13: «Đồng ý lối A, một điểm tôi muốn bổ sung là đưa search đúng vào
(⌘K) ở thanh trên đây cũng là nơi shell đã có ux?». Hàng này bỏ ô tìm của vùng ở lưới dùng chung — nên mọi màn họ Lưới
(Bảng hàng, Đã gửi, sau này Liên hệ) cùng mất nó —, đổi trạng thái «Tìm không ra» thành «Không có dòng nào khớp», sửa tài
liệu và mọi bài kiểm nhắc tới ô tìm mà không nới phép so. Việc tìm thuộc ô ⌘K ở thanh trên (hàng 3f). Kèm ba việc giám sát
gắn vào: gỡ dòng miễn «màn sent không chạy ca tìm» của hàng 6; sửa chữ tài liệu còn nói góc nhìn lưu chữ tìm (Ngoài-1, 4,
6, 9 của 2c); Ngoài-3 của 2c — mục miễn «khối có trước luật» của sổ khối phải có chứng từ thật.

Source input: ô cơ hội `_acceptance/bo-o-tim-cua-vung/opportunity.md` (chủ kho «build» 2026-11-13), sổ đợt mục «Ô tìm của
họ Lưới», thiết kế `design.md`, bản bấm được (ảnh `figures/proto/`), hồ sơ 2c `_acceptance/luu-goc-nhin-cot-hai/`
(`contract.md` mục Notes, `decisions.jsonl` dòng 35).

Luật sản phẩm chạm: không (SP-1, SP-3, SP-4 đọc lại, không luật nào bị chạm).

## Criteria

- AC-1: Given Bảng hàng và Đã gửi ở 1440, 1024, 414 và 360, sáng và tối, When vùng ở bất kỳ trạng thái nào (có dòng, đang
  lọc, không dòng nào khớp, đang tải, trống, lỗi, không đủ quyền), Then vùng không có ô tìm: không ô nào vai «searchbox»,
  không chữ «Gõ để tìm» hay «Tìm trong vùng»; thanh công cụ còn số dòng và các nút của hàng 2a.
- AC-2: Given Bảng hàng 60 dòng mẫu, When người gõ một chuỗi vào ô lọc dưới tiêu đề «Căn» (chuỗi có dòng khớp ở cả trong
  lẫn ngoài khung đầu, nhiều hơn một khung), Then bảng hiện đúng và đủ các dòng khớp — kể cả dòng phải cuộn mới thấy —,
  không dòng nào không khớp, chân bảng «x / 60 dòng» đúng số; gõ thêm ô lọc cột khác thì hai lọc chồng nhau như hàng 2a.
- AC-3: Given Bảng hàng đang lọc bằng ô đầu cột, When một ô lọc làm không còn dòng nào khớp, Then thân bảng hiện «Không có
  dòng nào khớp» với câu giải thích nói về ô lọc đầu cột (không nhắc ô tìm) và «Xoá lọc»; thanh công cụ và hàng ô lọc ở
  nguyên chỗ, ô đang gõ giữ chữ và focus; «Xoá lọc» xoá mọi ô lọc cột và trả lại đủ dòng; sửa riêng ô sai thì dòng hiện lại.
- AC-4: Given Bảng hàng và Đã gửi vừa mở, không lọc sẵn, When người nhìn vùng, Then hàng ô lọc dưới tiêu đề cột hiện sẵn ở
  mọi khổ và không còn nút «Lọc»; vùng mở với lọc sẵn (góc nhìn của 2c, địa chỉ có lọc) cũng vậy. (Theo khuyến nghị Hỏi-1;
  chủ kho chọn «sau nút Lọc» thì tiêu chí này đổi thành: hàng ô lọc ẩn tới khi bấm «Lọc», hiện sẵn khi vùng mở với lọc sẵn.)
- AC-5: Given Bảng hàng ở 360 và 414, When người cuộn ngang và gõ vào ô lọc của một cột, Then hàng ô lọc nằm dưới tiêu đề
  và cuộn cùng bảng, gõ thì bảng lọc như ở máy tính, không ô nào bị che hay cắt mất chỗ gõ.
- AC-6: Given một góc nhìn đã lưu của 2c, When người lưu, lưu thay đổi hay mở lại góc nhìn ấy — kể cả từ địa chỉ hay dữ liệu
  cũ còn mang chữ tìm —, Then cách xem trong lưới chỉ có bốn thứ (lọc cột, sắp xếp, nhóm, cột ẩn), yêu cầu gửi tới
  `/api/v1` không có chữ tìm, chữ tìm cũ bị bỏ qua và Bảng hàng mở đúng bốn thứ ấy; không migration mới. (cross-layer)
- AC-7: Given ma trận trạng thái, bảng hành vi, khuôn Lưới, mô tả Góc nhìn trong mô hình nghiệp vụ và nhật ký, When người
  đọc, Then trạng thái vùng tên «Không có dòng nào khớp» và vẫn bắt buộc «Xoá lọc»; không chỗ nào còn nói vùng có ô tìm hay
  góc nhìn giữ chữ tìm (Ngoài-1, Ngoài-6 của 2c); khuôn Lưới nói lọc bằng ô đầu cột và tìm ở ô ⌘K của thanh trên; nhật ký
  thay đổi và nhật ký chung có dòng ghi góc nhìn bỏ chữ tìm cùng bước dọn dữ liệu của migration 011 (Ngoài-4, Ngoài-9).
- AC-8: Given bộ bài kiểm sinh từ sổ màn, When nó chạy trên mọi màn họ Lưới có vùng (Bảng hàng, Đã gửi), Then ca «tìm» được
  thay bằng ca «lọc đầu cột» đo cùng điều trên ô lọc của cột đầu, ba ca phá của nó (giấu một dòng khớp · chỉ còn khung đầu ·
  thêm một dòng không khớp) đều đỏ với thông điệp ghim; ca trạng thái mang tên «Không có dòng nào khớp»; mọi ca vùng khẳng
  định không có ô tìm; danh sách miễn «màn sent không chạy ca tìm» và chỗ đọc nó không còn, Đã gửi chạy đủ bộ.
- AC-9: Given mọi bài kiểm đơn vị và trình duyệt từng gõ vào ô tìm hay nhắc «Tìm không ra», When hàng này viết lại chúng,
  Then mỗi khẳng định cũ có một khẳng định mới đo cùng điều trên ô đầu cột, hoặc thành khẳng định «không có ô tìm»; không
  bài nào bị xoá, bỏ qua hay nới ngưỡng; bảng đối chiếu cũ → mới nằm ở hồ sơ và có đủ một hàng cho mỗi dòng bài kiểm bị bỏ.
- AC-10: Given mục «khối có trước luật» của sổ khối, When công cụ chứng minh màn đọc từng cặp miễn, Then cặp chỉ được miễn
  khi commit khai có thật, commit ấy thêm đúng tệp của khối, ngày của commit bằng ngày khai và trước ngày sổ khối ra đời;
  sai một điều thì đỏ với mã riêng gọi tên khối và điều sai; bản sao thiếu lịch sử thì làm theo Hỏi-2 (khuyến nghị: tự lấy
  phần lịch sử còn thiếu — commit khai, cha của nó, lịch sử của sổ khối — từ kho gốc rồi kiểm, lấy không được thì đỏ nói
  rõ vì sao; không bao giờ lấy ngày hay danh sách tệp của commit gốc ghép của bản sao nông). Cặp FormDialog hôm nay qua được.
- AC-11 (sửa sau Cổng Phạm vi — G-1311-37, Ngoài-6 của 3f chủ kho chọn «mở hợp đồng mới» 2026-11-13; chủ kho phê ở Cổng
  Bằng chứng): Given ô lọc đầu cột của lưới chung và ô ⌘K của thanh trên, When người gõ chữ không dấu hay có dấu, Then cả
  hai so trên chữ đã bỏ dấu tiếng Việt («đ» coi như «d») qua MỘT hàm chuẩn hoá đặt ở một chỗ, hai nơi cùng gọi: «dong» khớp
  «Đông», «Đông» vẫn khớp «Đông», gõ đúng dấu chữ khác («Động») không bị coi là sai; phần ô ⌘K làm sau khi 3f ở nhánh chính.
- AC-12 (sửa sau Cổng Phạm vi — phán quyết G K-1411-1, K-1411-2, K-1411-5, K-1411-7 ngày 2026-11-14; đổi một điều đã ký của
  hàng 3 «hồ sơ căn», chủ kho phê ở Cổng Bằng chứng 2e hoặc chọn lối thu ngăn hồ sơ hẹp lại ở 1024): Given hàng ô lọc luôn
  hiện, When Bảng hàng mở ở bất kỳ khổ nào, có hay không có hồ sơ căn đang mở, Then cột số rộng ít nhất 11 ký tự, cột chữ
  ít nhất 8,3 ký tự, cột đầu đủ chỗ cho tên và nút sắp xếp; mã căn hiện trọn (không còn «0…»); cột Căn (luôn ghim) không
  còn nút «Bỏ ghim» — nút ấy trên nhánh chính nằm khuất dưới tiêu đề Toà; mọi nút ở tiêu đề cột ghim còn lại nằm trọn trên
  cùng và bấm được ở cả bốn khổ khi thanh bên mở; ở 1440 vẫn vừa đủ 8 cột như hàng 2 đã ký; cạnh hồ sơ đang mở thấy ít
  nhất 3 cột ở 1440 (Căn, Toà ghim) và 1 cột ở 1024 (Căn ghim; Toà nằm dưới ngăn hồ sơ) — thay cho 4 và 2 của hàng 3; cột
  ghim vẫn đứng yên khi cuộn ngang.

## Coverage

Bỏ quét hình thái theo trục — xem dòng sổ «bỏ coverage-scan»: hàng này bớt một ô đã có và đổi tên một trạng thái; không gian
đã khép bởi ma trận viết sẵn của kho. Thước đối chiếu thay cho quét:

- Màn họ Lưới có vùng: Bảng hàng, Đã gửi (AC-1, AC-8); Liên hệ chưa dựng — dùng lưới chung khi tới lượt.
- Bảy trạng thái vùng của `design/states.md` (AC-1, AC-3, AC-8).
- Bốn khổ × sáng tối (AC-1, AC-4, AC-5).
- Mọi nơi trong kho nhắc ô tìm của vùng — tài liệu, mô hình nghiệp vụ, mã, bài kiểm, bộ bài chung (AC-6 … AC-9); danh sách
  lấy bằng tìm chữ ở S1 và chép vào kế hoạch.
- Bốn điều của một cặp miễn (có commit · thêm đúng tệp · đúng ngày · trước luật) và ca bản sao nông (AC-10).

## Vai × Màn

Hàng này không đổi quyền. Ô tìm biến mất với mọi vai như nhau; vai không đọc được vùng vẫn chỉ thấy câu không đủ quyền.

| Màn | Đầu chủ | Đầu khách | Trưởng nhóm | Quản trị sàn |
|---|---|---|---|---|
| inventory | được — lọc bằng ô đầu cột, không ô tìm | được — như Đầu chủ | được — như Đầu chủ | chặn — vùng báo không đủ quyền, không ô lọc, không ô tìm |
| sent | được — lọc link bằng ô đầu cột, không ô tìm | được — như Đầu chủ | được — như Đầu chủ | chặn — vùng báo không đủ quyền; bảng quyền của hàng 18 quyết |

## Đường đo

Bỏ — xem dòng sổ «bỏ đường-đo»: chủ kho dời nghiệm thu giá trị tới cuối lộ trình MVP; ngưỡng của ô cơ hội chính là các tiêu
chí trên.

## Out of scope

- Ô ⌘K ở thanh trên và việc nó điền sẵn ô lọc cột Căn: hàng 3f.
- Lọc cả bảng bằng một chữ ở bất kỳ chỗ nào khác trong vùng: không làm — trái lời chốt của chủ kho.
- Màn Liên hệ: chưa dựng.
- Đổi luật lọc của từng kiểu cột (chứa, khoảng, chọn nhiều) hay phím của Bảng hàng: giữ như hàng 2a và hàng 2.
- Ngoài-11, Ngoài-12, Ngoài-15 của 2c: chủ kho đã ghi hạn chế đã biết.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Trình tự (điều kiện của giám sát): mã lưới dùng chung (`src/components/candidate/**`) và các bài kiểm theo nó chỉ dựng
  SAU khi hàng 4 «Sửa trên ô» gộp; khi ấy gộp `origin/main` một lần rồi mới dựng. Phần không chạm lưới (AC-7 phần tài liệu,
  AC-10) dựng được ngay sau hai chữ ký (Cổng Phạm vi, kế hoạch).
- Đã gửi (`sent`) có vùng Lưới từ hàng 6 (PR #44, chưa gộp). Lượt chấm (S4) của hàng này chờ hàng 6 gộp: bài của AC-1 và
  AC-8 đỏ khi màn sent chưa có vùng, không được xanh trên một mình Bảng hàng.
- Đổi `ontology/entities/SavedView.yaml` (chỉ chữ mô tả, Ngoài-1 và Ngoài-6) phải xin giám sát; PR có mục «Đổi ontology —
  chủ kho soi».
- Không migration mới: migration 011 của 2c đã bỏ chữ tìm khỏi dữ liệu.
