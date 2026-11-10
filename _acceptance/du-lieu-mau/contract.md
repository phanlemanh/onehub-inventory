---
schema_version: 1
feature: du-lieu-mau
slug: du-lieu-mau
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [data]
status: verified
approved_by: Manh Phan
approved_at: 2026-11-11
design_doc: _acceptance/du-lieu-mau/design.md
---

# Acceptance Contract: du-lieu-mau

## Context

Các màn dựng trên dữ liệu mẫu trước khi có dữ liệu thật. Quyết định 0020: Bảng hàng và Liên hệ dùng chung dữ liệu từ đầu — chủ nhà của một căn là một liên hệ, số chủ nhà ghi vào liên hệ. Vòng này dựng một sàn mẫu trên Vinhomes Ocean Park 1, 2, 3: danh mục căn, lần chào và liên hệ nối sẵn với nhau, mọi bản ghi mang nhãn MAU. Kho chưa có cơ sở dữ liệu, nên dữ liệu mẫu là hàm dựng tất định ở ba mô-đun `catalog`, `listings`, `contacts`.

Source input: hàng `1` của `docs/plan/lo-trinh.json` (mã phạm vi N4), ô cơ hội `_acceptance/du-lieu-mau/opportunity.md` đã quyết build ngày 10/11/2026.

## Criteria

- AC-1: Given ba hàm dựng của danh mục, lần chào và liên hệ, When dựng toàn bộ sàn mẫu hai lần, một lần dưới múi giờ UTC và một lần dưới Asia/Ho_Chi_Minh, Then hai bản giống nhau từng byte khi viết ra JSON, và băm SHA-256 của bản ấy bằng đúng giá trị ghim trong bài kiểm.
- AC-2: Given danh mục mẫu, When đọc dự án và toà, Then có đúng ba dự án Vinhomes Ocean Park 1, Vinhomes Ocean Park 2 – The Empire, Vinhomes Ocean Park 3 – The Crown; toà Ocean Park 1 là S1.01, S1.02, S1.03, S1.05; mỗi căn có mã duy nhất, và đọc ngược mã căn (`S1.05-1208`) ra đúng toà, tầng, trục của căn.
- AC-3: Given 60 lần chào mẫu, When kiểm từng lần chào, Then đủ sáu trạng thái Incomplete, Active, Pending, Hold, Closed, Withdrawn; lần chào Closed có giá chốt và ngày chốt; lần chào Withdrawn có lý do; mỗi lần chào trỏ đúng một căn có trong danh mục, tên toà và mã căn khớp căn ấy, và không hai lần chào chung một căn.
- AC-4: Given toàn bộ sàn mẫu gồm đúng 1 sàn, 432 căn, 60 lần chào, 60 liên kết căn, 50 liên hệ, 60 liên kết chủ, When kiểm nhãn, Then mọi bản ghi mang nhãn MAU: sàn, lần chào, liên hệ và hai loại liên kết có mã mở đầu `4d415500-`, mọi căn có `upi` mở đầu `urn:onehub:upi:mau:`, tên sàn mở đầu `[MAU]`, tên liên hệ kết thúc `· MAU`; một bản sao bỏ nhãn ở một bản ghi của bất kỳ loại nào trong sáu loại bị báo đúng loại và mã bản ghi đó.
- AC-5: Given toàn bộ sàn mẫu, When quét mọi chuỗi của căn, lần chào, liên hệ và liên kết, Then đúng 53 số điện thoại tách từ `phones` và mỗi số khớp `0900 000 0xx`, mọi tên người mở đầu `[Tên]`, và ngoài số mẫu, mã, `upi`, mốc giờ, mã toà, mã căn thì không chuỗi nào còn từ 9 chữ số trở lên; bản sao có một số như số thật ở `phones`, viết liền trong tên liên hệ, hay viết chữ số toàn khổ trong tên toà của một căn đều bị báo kèm loại và mã bản ghi.
- AC-6: Given liên hệ và liên kết chủ nhà, When kiểm bốn ca nối, Then có ít nhất một chủ nhà có từ hai lần chào, một lần chào có từ hai chủ, một liên hệ vừa là chủ (Seller) vừa là khách (Buyer), một lần chào chưa có chủ; bản sao bỏ từng ca bị báo đúng tên ca.
- AC-7: Given kho liên hệ dựng từ sàn mẫu, When đổi số của một chủ nhà có nhiều lần chào, Then mọi lần chào của người đó đọc ra số mới, không lần chào nào còn đọc ra số cũ, liên hệ khác giữ nguyên số, và không bản ghi căn, lần chào hay liên kết nào mang trường số điện thoại.
- AC-8: Given danh mục, lần chào và liên hệ dựng nối nhau qua cửa `index.ts` của ba mô-đun, When kiểm liên kết, Then mọi liên kết lần chào → căn trỏ một căn có trong danh mục, mọi liên kết chủ nhà trỏ một liên hệ và một lần chào có thật, và mọi bản ghi thuộc sàn (lần chào, liên hệ, hai loại liên kết) mang cùng mã sàn mẫu; bản sao có liên kết trỏ mã không có, hay một bản ghi mang mã sàn khác, bị báo đúng bản ghi đó.
- AC-9: Given ontology của Liên hệ, When sinh lại kiểu và chạy bộ kiểm của kho, Then `Contact` có thuộc tính `phones` kiểu chuỗi đánh dấu dữ liệu cá nhân, kiểu sinh ra khớp ontology, dữ liệu mẫu thoả kiểu `Contact` sinh ra, và ba mô-đun không gọi nhau ngoài cửa công khai.

## Coverage

Bỏ quét không gian — ngưỡng bật của hàng lộ trình đã liệt kê đủ ca nối và luật dữ liệu (sổ quyết định: «bỏ coverage-scan»). Ánh xạ ngưỡng bật → tiêu chí:

- «Dựng lại hai lần ra cùng dữ liệu» → AC-1.
- «Mọi bản ghi mang nhãn MAU» → AC-4.
- «Không có tên hay số thật» → AC-5.
- «Đủ ca một chủ nhiều căn, một căn nhiều chủ, một người vừa là chủ vừa là khách, căn chưa có chủ» → AC-6.
- «Đổi số của một liên hệ thì mọi căn của người đó cùng thấy số mới» → AC-7.
- Câu giao «trên Vinhomes Ocean Park 1, 2, 3, căn và liên hệ nối sẵn với nhau» → AC-2, AC-3, AC-8.
- Quyết định 0020 «số chủ nhà ghi vào liên hệ» → AC-7, AC-9.

## Đường đo

Ngưỡng của ô cơ hội là ngưỡng bật của hàng; số đo đến từ bài kiểm của kho chạy trong `make test`, không cần người dùng thật.

- Dựng lại ra cùng dữ liệu: băm ghim, AC-1.
- Nhãn MAU: số bản ghi thiếu nhãn = 0, AC-4.
- Không dữ liệu thật: số lỗi quét = 0, AC-5.
- Đủ bốn ca nối: số ca thiếu = 0, AC-6.
- Đổi số thấy ở mọi căn: số lần chào còn đọc số cũ = 0, AC-7.

## Out of scope

- Nạp dữ liệu mẫu vào cơ sở dữ liệu — kho chưa có `db/`; việc của hàng `7` và `21`.
- Dựng bất kỳ màn nào — Bảng hàng, hồ sơ căn, Đã gửi là hàng `2`, `3`, `6`.
- Lần chào cho thuê (chủ nhà là bên cho thuê) và thấp tầng Ocean Park 2, 3.
- Người dùng mẫu và vai trong sàn mẫu.
- Hiện nhãn mẫu trên màn và trang khách — việc của các hàng dựng màn.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Tên toà Ocean Park 2 và 3 chưa đối chiếu được nguồn công khai; bản nháp dùng tên giả mang nhãn `[MAU]` (Hỏi-2 ở Cổng Phạm vi).
- Chủ nhà gắn với lần chào theo quan hệ `Contact owns Listing` đang có (Hỏi-1 ở Cổng Phạm vi, quyết định 0020 để mở).
- Nhãn MAU đi hai lớp: tiền tố mã của từng bản ghi và mã sàn mẫu (Hỏi-3 ở Cổng Phạm vi).
- Nhiều số của một liên hệ nối bằng `", "` trong một chuỗi `phones`, vì ontology chưa có kiểu danh sách.
- Thuộc tính `phones` của `Contact` là đổi ontology duy nhất của vòng, giám sát đợt duyệt (tin D-1011-2); mô tả PR có mục «Đổi ontology — chủ kho soi».
- Ngoài-1 (máy định tuyến 2026-11-10, đề xuất S4 known-limits): Một dãy số trông giống số điện thoại di động thật nằm trong bài kiểm và tài liệu của kho. Nếu trùng số của người thật thì số đó lộ ra ở kho công khai. — `tests/sample-data.test.ts`
- Ngoài-3 (máy định tuyến 2026-11-10, đề xuất S4 known-limits): Cách đánh mã cho dữ liệu mẫu được viết ở hai nơi, nên sau này sửa một nơi mà quên nơi kia có thể làm hai loại bản ghi trùng mã. — `src/modules/contacts/sample.ts`
- Ngoài-4 (máy định tuyến 2026-11-10, đề xuất S4 known-limits): Vài chữ như tầng, trục và một số thông báo lỗi của dữ liệu mẫu được viết cứng, nên nếu đổi cách gọi thì phải sửa tay thay vì đổi ở một chỗ. — `src/modules/catalog/sample.ts`
- Ngoài-5 (máy định tuyến 2026-11-10, đề xuất S4 known-limits): Mã ví dụ của Ocean Park 1 đọc ra đúng toà, tầng, trục nhưng không có căn nào mang mã đó, nên nếu ai gõ thử mã này để tìm căn sẽ không thấy gì. — `src/modules/catalog/sample.ts`
- Ngoài-6 (máy định tuyến 2026-11-10, đề xuất S4 known-limits): Trong bài kiểm và tài liệu có một số điện thoại trông như số thật, và kho đang công khai. Nếu số đó thuộc về một người thật thì người đó bị lộ số trong lịch sử kho. — `tests/sample-data.test.ts`
- Ngoài-8 (máy định tuyến 2026-11-10, đề xuất S4 known-limits): Quy tắc gắn nhãn MAU được viết lặp ở hai nơi. Nếu sau này sửa một nơi mà quên nơi kia thì nhãn có thể lệch nhau, nhưng bài kiểm hiện đã bắt trường hợp này. — `src/modules/contacts/sample.ts`
- Ngoài-9 (máy định tuyến 2026-11-10, đề xuất S4 known-limits): Trường số điện thoại của liên hệ gộp nhiều số nhưng lại mượn tên chuẩn ngành vốn chỉ dành cho từng số có vai riêng. Việc này dễ gây hiểu sai khi đối chiếu với chuẩn hoặc trao đổi dữ liệu sau này. — `ontology/entities/Contact.yaml`
- Ngoài-10 (máy định tuyến 2026-11-10, đề xuất S4 known-limits): Nếu sau này một liên kết chủ nhà bị nhân đôi nhầm, bộ kiểm có thể báo đủ ca nối dù thực tế chưa đủ. Dữ liệu mẫu hiện nay không bị ảnh hưởng. — `src/modules/contacts/sample.ts`
- Ngoài-11 (máy định tuyến 2026-11-10, đề xuất S4 known-limits): Tài liệu đánh giá nhắc tên một bước kiểm không tồn tại, nên người đối chiếu có thể không tìm thấy bằng chứng đúng chữ. Sản phẩm không bị ảnh hưởng. — `_acceptance/du-lieu-mau/evals.yaml`
- Ngoài-12 (máy định tuyến 2026-11-10, đề xuất S4 known-limits): Một số lỗi của lần chào, như thiếu ngày chốt hay lần chào không có căn, chưa có bài kiểm chứng minh bộ kiểm sẽ bắt. Nếu bước kiểm đó bị lỡ xoá thì không ai biết. — `tests/sample-data.test.ts`
- Ngoài-13 (máy định tuyến 2026-11-10, đề xuất S4 known-limits): Bài kiểm nói không bản ghi nào mang số điện thoại chưa có ca đối chứng cho thấy nó sẽ bắt khi có số lọt vào. Hiện dữ liệu vẫn đúng. — `tests/sample-data.test.ts`
