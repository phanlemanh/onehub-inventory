---
schema_version: 1
feature: Mọi vùng dữ liệu dùng chung Lưới, ô theo kiểu, đầu vùng và đủ trạng thái
slug: luoi-va-o-theo-kieu
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [ui]
screens: []
status: signed-off
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-11-11T01:45:53Z
design_doc: _acceptance/luoi-va-o-theo-kieu/design.md
---

# Acceptance Contract: luoi-va-o-theo-kieu

## Context

Mọi màn danh sách của MVP (Bảng hàng, Đã gửi) đọc dữ liệu qua một Lưới chung. Hàng này khoá ở một chỗ những gì các tác tử từng làm lệch nhau ở Quỹ hàng: canh lề, bề rộng, định dạng và mật độ theo kiểu của trường, đầu vùng, bốn trạng thái vùng, tìm và chia trang, luật ô chỉ đọc. Hàng dựng trên khung và bộ định dạng của hàng 1a.

Source input: hàng 1b của `docs/plan/lo-trinh.json` (mã F6, F7 của `docs/plan/pham-vi-mvp-dot-1.md`), ô cơ hội `_acceptance/luoi-va-o-theo-kieu/opportunity.md` do chủ kho quyết «build» ngày 10/11/2026.

## Criteria

- AC-1: Given một cột khai theo kiểu `display`, When Lưới hiện giá trị, Then ô dùng đúng bộ định dạng của kiểu đó (giá «4,85 tỷ», diện tích «75,5 m²», ngày «05/11/2026», số điện thoại «0900 000 001»), ô trạng thái là huy hiệu màu của 1a với chữ từ `label()`, ô đúng/sai hiện «Có» hoặc «Không», và ô trống hiện «—».
- AC-2: Given màn khai cột bằng tên trường của ontology (vd `Listing.listPrice`), When Lưới dựng, Then kiểu của cột tra từ bảng kiểu sinh từ ontology, hai cột cùng kiểu có cùng canh lề — `money`, `area`, `count` canh phải, mọi kiểu khác canh trái — ở cả đầu cột lẫn ô, và màn không khai được kiểu, canh lề hay bề rộng riêng (bước kiểm kiểu của kho từ chối).
- AC-3: Given một cột, When Lưới dựng, Then bề rộng cột bằng `max(độ dài nhãn, độ dài mẫu của kiểu) × 1ch + đệm hai bên`, nên hai cột cùng kiểu cùng độ dài nhãn có cùng bề rộng; và chữ dài hơn ô không vỡ bố cục, bị cắt có dấu ba chấm và đọc đủ được khi rê chuột hay đưa tiêu điểm vào.
- AC-4: Given tổng bề rộng tối thiểu các cột và bề rộng vùng nội dung, When tổng vượt vùng, Then Lưới dày (dòng `h-10`, chữ `text-sm`); When tổng không vượt, Then Lưới thường (dòng `h-12`, chữ `text-base`).
- AC-5: Given một vùng dữ liệu, When vùng hiện, Then đầu vùng có một `h2` tên vùng, số dòng, ô tìm và chỗ cho nút chính của vùng; khi đang lọc thì số dòng ghi số khớp trên tổng.
- AC-6: Given vùng có dữ liệu, When nhân viên gõ vào ô tìm, Then chỉ các dòng có chữ khớp ở một cột chữ còn lại và số dòng đổi theo; When không dòng nào khớp, Then vùng nói «Không có dòng nào khớp» kèm nút «Xoá lọc», và bấm nó thì đủ dòng quay lại.
- AC-7: Given số dòng nhiều hơn cỡ trang, When Lưới dựng, Then có thanh chia trang bằng tiếng Việt và mỗi trang có không quá cỡ trang dòng; When số dòng không vượt cỡ trang, Then không có thanh chia trang.
- AC-8: Given vùng đang tải, bị lỗi, chưa có dữ liệu, tải được một phần, hay người xem không đủ quyền, When vùng hiện, Then: đang tải thì dưới 1 giây không chỉ báo và từ 1 giây có dòng khung chờ đúng số cột; lỗi thì câu ba phần và «Thử lại» gọi lại việc tải; trống thì nói vì sao trống và hiện việc làm tiếp do màn khai; một phần hỏng thì các dòng đã tải vẫn dùng được và vùng nói rõ phần nào chưa tải được kèm «Thử lại»; không đủ quyền thì nói rõ và không hiện dòng hay số dòng nào — và phần còn lại của màn vẫn dùng được.
- AC-9: Given một ô mà người đang xem không có quyền sửa, When ô hiện, Then ô hiện như chữ thường, không có dấu hiệu sửa được; Given một ô tạm khoá, When ô hiện, Then ô có biểu tượng khoá và lý do khoá đọc được bằng trình đọc màn hình và hiện khi rê chuột.
- AC-10: Given bản mẫu Lưới ở bốn khổ 360, 414, 1024, 1440, When mở ở giao diện sáng và tối, Then trang không cuộn ngang (Lưới cuộn ngang trong vùng của nó) và không có vi phạm axe mức nghiêm trọng ở mọi trạng thái vùng.

## Coverage

Thước đối chiếu: mã F6 và F7 của `docs/plan/pham-vi-mvp-dot-1.md`, các dòng «Canh cột», «Bề rộng cột», «Mật độ bảng», «Chia trang», «Ô không sửa được» của `design/behaviors.md`, các dòng «Chờ tải», «Trống», «Tìm không ra», «Lỗi», «Chữ dài» của `design/states.md`, và mười một kiểu của `DisplayKind`.

- Trục kiểu hiển thị: `money` | `area` | `count` | `date` | `datetime` | `phone` | `status` | `boolean` | `text` | `person` | `select` — mỗi kiểu một hàng trong ma trận của AC-1, AC-2, AC-3.
- Trục phần của F7: ô theo kiểu (AC-1, AC-2, AC-3) | mật độ (AC-4) | đầu vùng (AC-5) | tìm lọc (AC-6) | chia trang (AC-7) | ô chỉ đọc (AC-9).
- Trục trạng thái vùng F6 và `design/states.md`: chờ tải | trống | lỗi | một phần hỏng | không đủ quyền (AC-8) | tìm không ra (AC-6) | chữ dài (AC-3).
- Trục khổ và giao diện: 360 | 414 | 1024 | 1440 × sáng | tối (AC-10).
- Ô «Xung đột khi lưu» của `design/states.md` không có AC: cần thao tác lưu, chưa có ở Lưới chỉ đọc; xem Out of scope.

## Đường đo

- Thước: hai cột cùng kiểu cùng canh lề, bề rộng và định dạng · số từ: ma trận kiểu × thuộc tính trong `tests/grid.test.tsx`, dựng từ chính hàm của Lưới · bảo đảm bởi: AC-1, AC-2, AC-3
- Thước: mỗi trạng thái vùng có bài kiểm đỏ được khi phá · số từ: các ca đối chứng có thông điệp ghim trong `tests/grid.test.tsx` và `tests/e2e/grid.spec.ts` · bảo đảm bởi: AC-6, AC-8

## Vai × Màn

Vòng này dựng thành phần dùng chung (Lưới, ô theo kiểu, đầu vùng, trạng thái vùng) và chỉ chạm bản mẫu dành cho người phát triển, chưa chạm màn nào của nhân viên sàn; bảng Vai × Màn thuộc hàng đầu tiên đặt Lưới lên một màn (hàng 2, Bảng hàng).

## Out of scope

- Không chốt cỡ trang thật hay chọn chia trang thay cuộn ảo: `design/behaviors.md` để quyết định này cho lát cắt Bảng hàng (hàng 2); hàng này có chia trang với cỡ mặc định 50.
- Không sửa ô (sửa trên ô là B4) và không hồ sơ cạnh bảng (hàng 3); ô chỉ đọc chỉ là cách hiện.
- Không dữ liệu thật hay dữ liệu mẫu của sàn: bản mẫu dùng dòng giả tại chỗ; Bảng hàng nối dữ liệu ở hàng 2.
- Không trạng thái «Xung đột khi lưu»: cần thao tác lưu; đi cùng sửa trên ô (B4).
- Không lọc theo cột, không chọn dòng, không ghim hay kéo cột.
- Không sửa `design/behaviors.md`, `design/states.md` (vùng của hàng 1e) hay bộ định dạng của 1a.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Mọi câu chữ của Lưới và trạng thái vùng nằm trong `src/components/candidate/grid-copy.ts`; tên vùng và tên cột do màn đưa vào qua `label()`.
- Mục Ngoài-6 của hàng 1a (ô trạng thái hay đúng/sai hiện mã tiếng Anh) được giải ở lớp ô của hàng này.
- Known limits — chọn ở Cổng Bằng chứng 2026-11-11:
  - Ngoài-1: Một số tên cột và tên trang trên bản mẫu Lưới đang gõ tay thay vì lấy từ bộ nhãn chung.
  - Ngoài-3: Bản ghi kiểm tra quy tắc sản phẩm chưa phủ lần sửa cuối cùng, dù kiểm lại tay thì không có vi phạm.
  - Ngoài-4: Khi vùng bị lỗi tải, đầu vùng vẫn hiện số dòng và ô tìm phía trên thông báo lỗi, có thể khiến người xem tưởng vùng đang trống hoặc có dữ liệu.
  - Ngoài-5: Một số tên cột và nút trên trang mẫu dành cho người phát triển được viết cứng, nhân viên sàn không nhìn thấy trang này.
  - Ngoài-6: Với một số trình đọc màn hình, lý do khoá ô có thể bị đọc lặp hai lần cho người khiếm thị.
  - Ngoài-7: Bài kiểm tự động cho trạng thái đang tải có thể treo tới hết giờ thay vì báo lỗi rõ ràng, và ca đối chứng không còn chứng minh được nó đỏ được.
  - Ngoài-8: Trong trường hợp hiếm khi vùng tải hỏng một phần mà không có dòng nào, màn có thể nói sai rằng chưa ai nhập dữ liệu trong khi dữ liệu có nhưng chưa tải được.
  - Ngoài-9: Bài kiểm tự động cho trạng thái đang tải chưa chứng minh được là nó sẽ báo đỏ đúng lúc khi lỗi xảy ra.
  - Ngoài-10: Bài kiểm tự động cho ô tìm chưa bắt được trường hợp tìm bỏ sót bớt dòng đúng; nếu lỗi như vậy xảy ra, nhân viên có thể thấy thiếu dòng mà test không báo.
  - Ngoài-11: Một số tên cột và nút trên trang mẫu dành cho người phát triển được viết cứng, nên sau này đổi tên khái niệm có thể bị lệch.
  - Ngoài-12: Người không có quyền xem một vùng vẫn thấy nút làm việc như «Thêm dòng» trên vùng đó.
  - Ngoài-13: Khi vùng báo lỗi tải, đầu vùng vẫn ghi số dòng và có ô tìm, nói ngược với thân vùng.
  - Ngoài-14: Hai danh sách giống nhau được viết ở hai nơi, nên sau này sửa một nơi có thể quên nơi kia và hai ô hiển thị lệch nhau.
  - Ngoài-16: Nếu một màn quên nối việc tải lại, nút «Thử lại» sẽ bấm không có tác dụng gì mà không báo lỗi.
  - Ngoài-17: Khi tải lỗi, đầu vùng có thể ghi «0 dòng» như thể vùng thật sự trống, và ô tìm vẫn gõ được mà không có tác dụng.
  - Ngoài-18: Một bài kiểm tự động có thể thỉnh thoảng đỏ giả khi máy chậm.
