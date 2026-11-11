---
schema_version: 1
feature: Agent tra được danh mục ReUI Pro ngay trong kho theo phiên bản đã ghim, không phụ thuộc kết nối ngoài
slug: danh-muc-reui
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [cli]
status: signed-off
approved_by: Manh Phan
approved_at: 2026-11-11
design_doc: _acceptance/danh-muc-reui/design.md
---

# Acceptance Contract: danh-muc-reui

## Context

Quyết định 0019 đặt thang dùng lại Trong kho → ReUI → Vẽ tay, và đòi agent rơi xuống bậc dưới phải nêu đã tra gì. Hôm nay ReUI chỉ tra được qua mạng, kết quả đổi theo ngày, nên «đã tra, không có» không ai kiểm lại được. Vòng này đưa danh mục ReUI vào kho theo một bản ghim, tra được tại máy.

Source input: hàng 1g của `docs/plan/lo-trinh.json` và ô cơ hội `_acceptance/danh-muc-reui/opportunity.md` (chủ kho quyết «build» ngày 10/11/2026). Hàng mang mức T2; vùng nằm trong thư mục công cụ nên cấu hình kho xếp T3, giám sát chốt T3 (tin R-1111-2).

Luật sản phẩm: vòng này không chạm SP-1, SP-3, SP-4 — không có tệp nào trong `src/**` hay `db/**`.

## Criteria

- AC-1: Given ảnh chụp nguồn và tệp ghim đã commit, When chạy lệnh sinh lại hai lần liên tiếp trong khi mọi lời gọi mạng bị chặn, Then cả hai lần thoát 0 và tệp danh mục giống từng byte với bản đã commit.
- AC-2: Given một bản sao kho có một byte của ảnh chụp bị đổi, When chạy lệnh sinh lại hoặc lệnh kiểm, Then lệnh thoát khác 0, không ghi tệp danh mục, và thông điệp gọi tên tệp ảnh chụp lệch băm; Given cùng bản sao chưa đổi byte nào, When chạy hai lệnh ấy, Then cả hai thoát 0 (đối chứng).
- AC-3: Given ảnh chụp ngày ghim, When sinh danh mục, Then danh mục có đúng 678 khối, 27 thành phần gốc và 1.264 ví dụ, và đầu tệp ghi tệp ghim cùng số đếm từng loại; Given một bản sao nguồn bị xoá một dòng mục, When sinh lại, Then lệnh dừng và gọi tên nhóm có số khai lệch số đọc được.
- AC-4: Given danh mục đã sinh, When tra một từ khoá trong khi mọi lời gọi mạng bị chặn, Then lệnh in tối đa 10 mục xếp hạng tất định (tên cài, loại, nhóm, tiêu đề, đường trang) kèm ngày ghim; When từ khoá không khớp mục nào, Then lệnh in «không có mục nào khớp» kèm ngày ghim và thoát 1.
- AC-5: Given danh mục đã sinh, When bộ kiểm tra từng mục bằng tên cài và bằng «tên nhóm + tiêu đề», Then mọi mục ra ở vị trí đầu với tên cài và trong 10 kết quả mặc định với tiêu đề; Given một bản danh mục có một mục mà tra không ra, When bộ kiểm chạy, Then đỏ và gọi tên mục ấy.
- AC-6: Given danh mục đã sinh và hai tệp ảnh chụp, When bộ kiểm duyệt trường và chuỗi, Then danh mục chỉ có các trường được phép, và cả danh mục lẫn ảnh chụp không có dấu khối mã, câu `import … from`, `export default/const/function/class`, `Bearer` hay `REUI_LICENSE`; Given một bản sao bị chèn một trong các thứ đó vào danh mục hoặc vào ảnh chụp, When bộ kiểm chạy, Then đỏ và gọi tên mục (hoặc tệp và dòng) cùng thứ bị chèn.
- AC-7: Given một thư mục nguồn tại máy có một mục thêm và một mục bớt so với bản ghim, When chạy ghim lại từ thư mục đó, Then ảnh chụp, tệp ghim và danh mục được cập nhật, và lệnh in đúng tên mục thêm và mục bớt; Given nguồn mới có chuỗi cấm, When ghim lại, Then lệnh thoát 1 và không tệp nào đổi.
- AC-8: Given kho sau vòng này, When chạy bộ kiểm của kho, Then đủ 33 ca của danh mục chạy trong đó và xanh, gồm các ca đỏ dựng trên bản sao bị phá và các ca cho thấy bộ chặn mạng chặn được fetch, http, https và net; và cây làm việc của kho không đổi sau khi chạy; Given tệp kiểm của danh mục không được bộ kiểm nhặt, When chạy bộ kiểm của kho, Then số ca của danh mục khác 33 và phép đo AC-8 đỏ.
- AC-9: Given tệp hướng dẫn của thư mục công cụ, When một agent chưa biết danh mục đọc nó (judgment), Then agent biết lệnh tra, cách chép câu «đã tra, không có» làm bằng chứng, và khi nào phải ghim lại; và mọi dòng lệnh trong tệp chạy thoát đúng mã tệp ghi, câu bằng chứng trùng chữ với đầu ra thật.

## Coverage

Thước đối chiếu: số khai ở tiêu đề mục của chính nguồn ReUI (`llms-full.txt`, `llms.txt`, chụp 11/11/2026); cách ghim theo băm của khoá `integrity` trong `package-lock.json` (npm) và Subresource Integrity của W3C; khuôn mục của registry shadcn (`@reui/<tên>`).

- Trục thao tác: sinh lại | ghim lại | tra | kiểm.
- Trục loại mục: khối Pro | thành phần gốc | ví dụ.
- Trục trạng thái nguồn: lành | lệch băm | thiếu mục so với số khai | có trường hay chuỗi cấm | không có mạng.
- Trục cách tra: theo tên cài | theo từ khoá | không khớp.
- Ô sinh lại × lành × không mạng đi AC-1. Lệch băm đi AC-2. Thiếu mục đi AC-3. Tra × ba cách đi AC-4. Kiểm × ba loại mục × tên và tiêu đề đi AC-5. Trường cấm đi AC-6. Ghim lại đi AC-7. Kiểm trong bộ kiểm của kho đi AC-8.
- Ô loại «biểu tượng» và «mẫu trang» gạch: ngoài giấy phép Pro hoặc không cài được bằng lệnh (sổ `d-20261111T012410Z-4`).
- Ô ghim lại × không mạng chỉ có đường `--from`; tải từ mạng thật không có eval vì bộ kiểm không gọi mạng.

## Đường đo

Ngưỡng ở ô cơ hội là chính câu «bật khi»: một lệnh sinh lại danh mục từ bản ReUI đã ghim; khối có trong danh mục mà tra không ra thì đỏ; danh mục chỉ có tên và mô tả.

- «Một lệnh sinh lại từ bản đã ghim»: số từ lần chạy lệnh sinh lại hai lần trên cây sạch — AC-1, AC-2.
- «Có trong danh mục mà tra không ra thì đỏ»: số mục tra ra trên tổng mục, in bởi bộ kiểm — AC-5.
- «Chỉ tên và mô tả»: số mục và dòng ảnh chụp vi phạm, in bởi bộ kiểm — AC-6.

## Out of scope

- Không tra biểu tượng chuyển động và mẫu trang.
- Không thêm máy chủ MCP, không thêm mô-đun trong `src/`.
- Không tự báo khi bản ghim cũ, không kiểm bản mới của ReUI trên CI.
- Không dịch từ khoá tiếng Việt.
- Không sửa skill `inventory-ui`, luật `.claude/rules/ui.md`, Makefile hay cấu hình prettier; dòng trỏ tới danh mục trong skill và luật đi qua yêu cầu việc phụ.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Hỏi-1 ở Cổng Phạm vi: kho công khai, nên chép tên và mô tả của ReUI vào kho là việc khó đảo (sổ `d-20261111T012410Z-7`).
- Tra xếp hạng theo chữ khớp, không theo nghĩa: từ đồng nghĩa không có trong mô tả sẽ không ra.
- Danh mục hôm nay ~410 KB. Khi ReUI lớn tới mức tệp vượt 500 KB, lệnh sinh lại dừng và nói rõ; lúc đó phải chọn chia tệp.
- Known limits — chọn ở Cổng Bằng chứng 2026-11-11:
  - Ngoài-1: Gõ lệnh ghim lại từ thư mục mà quên tên thư mục thì lệnh tải từ mạng và ghim lại, thay vì báo lỗi.
  - Ngoài-4: Gõ bộ lọc loại mà thiếu giá trị thì lệnh tra không lọc, vẫn trả kết quả mọi loại và báo thành công.
  - Ngoài-5: Bộ chặn mạng dùng trong phép đo không chặn mọi đường mạng cấp thấp (kết nối tự dựng, phân giải tên, gói UDP).
  - Ngoài-6: Bộ kiểm chạy lệnh sinh lại trên kho thật, nên danh mục đang lệch sẽ bị sinh lại khi chạy kiểm.
  - Ngoài-7: Phép đo sinh lại ngoại tuyến so với phần đang chuẩn bị lưu, không so với bản đã lưu.
  - Ngoài-9: Ghim lại thiếu tên thư mục thì tải từ mạng mà không báo (cùng lỗi với Ngoài-1).
  - Ngoài-10: Lệnh tra thiếu giá trị lọc thì bỏ lọc, và coi tuỳ chọn gõ sai là từ khoá.
  - Ngoài-11: Phép đo sinh lại ngoại tuyến so với phần đang chuẩn bị lưu (cùng lỗi với Ngoài-7).
  - Ngoài-12: Bộ chặn mạng không chặn kết nối tự dựng (cùng lỗi với Ngoài-5).
  - Ngoài-14: Phép đo hướng dẫn chỉ kiểm hướng dẫn có nói «cần mạng», không chạy thật lệnh ghim lại có mạng.
  - Ngoài-15: Bộ chặn mạng chỉ được thử ở bốn đường gọi mạng.
  - Ngoài-16: Tên lệnh tra và tên tuỳ chọn viết bằng tiếng Việt, lệch quy ước tiếng Anh của kho.
  - Ngoài-17: Chạy bộ kiểm có thể ghi đè danh mục đang sửa dở mà chưa lưu.
  - Ngoài-18: Lọc loại thiếu giá trị và ghim lại thiếu thư mục đều không báo lỗi (cùng lỗi với Ngoài-1, Ngoài-4).
  - Ngoài-19: Phép đo sinh lại ngoại tuyến so với phần đang chuẩn bị lưu (cùng lỗi với Ngoài-7).
  - Ngoài-21: Lệnh tra bỏ lọc khi thiếu giá trị loại (cùng lỗi với Ngoài-4).
  - Ngoài-22: Bộ kiểm sinh lại danh mục trên kho thật khi danh mục lệch (cùng lỗi với Ngoài-6).
  - Ngoài-23: Ma trận chuỗi cấm chưa thử mọi loại chuỗi cấm trên cả danh mục lẫn ảnh chụp nguồn.
  - Ngoài-24: Thứ tự kết quả tra và việc hai kiểu in cho cùng kết quả chưa được kiểm chặt.
