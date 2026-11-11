---
schema_version: 1
feature: Ghim lại danh mục ReUI từ nguồn đã đổi cách ghi tiêu đề mục thì máy dừng và gọi tên nhóm bị mất thay vì lặng lẽ bỏ cả nhóm, và phép chặn mã hay khoá phủ đủ các dạng đã kê
slug: danh-muc-reui-doc-chac
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [cli]
status: draft
design_doc: _acceptance/danh-muc-reui-doc-chac/design.md
---

# Acceptance Contract: danh-muc-reui-doc-chac

## Context

Hàng 1g đưa danh mục ReUI vào kho theo một bản ghim. Ở Cổng Bằng chứng của nó, bốn mục ngoài hợp đồng cùng một gốc:
bộ đọc nguồn nhận tiêu đề mục quá hẹp, nên khi ReUI đổi cách ghi tiêu đề, lệnh ghim lại bỏ im lặng cả một nhóm mà vẫn
thoát 0 và lệnh kiểm vẫn xanh (Ngoài-2, Ngoài-8, Ngoài-20); và bộ kiểm chuỗi cấm chỉ thử 9 lần chèn mà con số ấy là
độ dài của chính danh sách (Ngoài-13). Chủ kho chọn mở hợp đồng mới ngày 11/11/2026; ô Cổng Đáng của hàng 1k đã quyết
«build».

Source input: hàng 1k của `docs/plan/lo-trinh.json`, ô cơ hội `_acceptance/danh-muc-reui-doc-chac/opportunity.md`, bốn
mục trong `_acceptance/danh-muc-reui/review-findings.md` và `decisions.jsonl`. Hạng T3 vì vùng nằm trong thư mục công
cụ.

Luật sản phẩm: vòng này không chạm SP-1, SP-3, SP-4 — không có tệp nào trong `src/**` hay `db/**`.

Ba nhóm bắt buộc của nguồn: `llms-full.txt` · «Pro blocks» (khối), `llms-full.txt` · «Free examples» (ví dụ),
`llms.txt` · «ReUI Primitives» (thành phần gốc). Bảy dạng đổi tiêu đề đã kê: đổi chữ hoa thường · bỏ số khai · số
khai có chữ · đổi cấp tiêu đề · khoảng trắng cuối dòng · xuống dòng kiểu Windows · đổi tên. Mười dạng chuỗi cấm đã
kê: dấu ba backtick · `import x from "y"` · `import { a } from 'y'` · `import * as a from "y"` · `export default` ·
`export const` · `export function` · `export class` · `Bearer` · `REUI_LICENSE`. Chỗ chèn: hai khoá cấp gốc chứa
giá trị (`pin`, `counts`) · bốn trường của nhóm (`kind`, `group`, `category`, `base`) và ba trường của mục (`name`,
`title`, `description`), mỗi trường ở nhóm và mục đầu tiên của cả ba loại (khối, thành phần gốc, ví dụ) · hai tệp ảnh
chụp, mỗi tệp ở dòng 3 và dòng cuối có chữ — tổng 27 chỗ. Chuỗi chèn được nối vào sau giá trị gốc, cách một dấu cách.

## Criteria

- AC-1: Given bản sao nguồn có tiêu đề của một nhóm bắt buộc đổi theo một trong bảy dạng đã kê (3 nhóm × 7 dạng = 21 ca, ma trận viết trước), When chạy ghim lại từ thư mục nguồn ấy, Then lệnh thoát 1, stderr có đúng dòng `section missing in <tệp>: <tiêu đề> (<loại>)` của nhóm ấy và không có `count mismatch`, và ảnh chụp, tệp ghim, danh mục của bản sao không đổi byte nào.
- AC-2: Given bản sao nguồn chép nguyên từ ảnh chụp đã ghim (đối chứng của AC-1, cùng cách dựng), When chạy ghim lại từ thư mục ấy, Then lệnh thoát 0, in đủ 678 khối, 27 thành phần gốc, 1264 ví dụ và không in dòng thêm hay bớt mục nào.
- AC-3: Given bản sao kho có ảnh chụp bị sửa tay mất tiêu đề một nhóm bắt buộc và tệp ghim đã tính lại băm cho khớp, When chạy lệnh sinh lại hoặc lệnh kiểm, Then lệnh thoát 1, thông điệp có `section missing in <tệp>: <tiêu đề nhóm>`, và danh mục của bản sao không đổi byte nào — với cả ba nhóm.
- AC-4: Given nguồn mất tiêu đề của cả hai nhóm trong `llms-full.txt`, When chạy ghim lại, Then một lần chạy gọi tên cả hai nhóm, mỗi nhóm một dòng; và khi tệp có một dòng tiêu đề chỉ khác tên nhóm ở chữ hoa thường hay số khai, dòng lỗi chỉ ra số dòng và nội dung dòng ấy; khi tiêu đề bị đổi tên hẳn, dòng lỗi không chỉ dòng nào.
- AC-5: Given danh mục và ảnh chụp đã commit và ma trận viết trước 10 dạng chuỗi cấm × 27 chỗ chèn (270 ca), When chèn đúng một dạng vào đúng một chỗ rồi chạy hàm quét, Then hàm quét trả đúng một lỗi với thông điệp ghim gọi tên chỗ (với `category` và `name` là giá trị đã bị chèn) và nhãn của dạng; và tập nhãn của ma trận bằng tập nhãn cấm trong mã, khoá cấp gốc bằng các khoá được phép ở gốc trừ khoá chứa nhóm, trường nhóm và mục bằng các trường được phép, ba loại bằng danh sách loại, hai tệp bằng danh sách nguồn.
- AC-6: Given danh mục đã commit, When thêm một trường lạ ở mỗi cấp gốc, nhóm, mục (3 ca), Then hàm quét trả đúng một lỗi `forbidden field in <chỗ>: <trường>`; và ba cấp ấy bằng ba cấp của danh sách trường được phép trong mã.
- AC-7: Given danh mục và hai tệp ảnh chụp đã commit, và câu gần giống mà không cấm («Import data from a CSV file», «Export table rows»), When chạy hàm quét và lệnh kiểm, Then hàm quét trả không lỗi nào và lệnh kiểm thoát 0 với dòng `forbidden: 0` (đối chứng của AC-5, AC-6).
- AC-8: Given bản sao kho bị chèn một dạng chuỗi cấm vào một chỗ, When chạy lệnh kiểm của bản sao, Then lệnh thoát 1 và stderr có đúng thông điệp ghim của AC-5 cho chỗ và dạng ấy — 10 cặp chỗ–dạng kê trước, mỗi dạng đúng một lần, phủ cả bốn lớp chỗ (gốc, nhóm, mục, ảnh chụp).
- AC-9: Given kho sau vòng này, When sinh lại danh mục hai lần dưới bộ chặn mạng và chạy bộ kiểm của kho, Then danh mục giống từng byte với bản đã commit, tệp kiểm cũ của hàng 1g vẫn đủ 33 ca xanh, và tệp kiểm mới đủ 320 ca khai trước và không tên ca nào mang chuỗi `E<số> ·` mà hồ sơ 1g đếm; Given tệp kiểm mới không được bộ kiểm của kho nhặt, When chạy bộ kiểm, Then số ca khác 320 và phép đo đỏ.
- AC-10: Given tệp hướng dẫn của thư mục công cụ, When một agent chưa biết danh mục đọc mục ghim lại (judgment), Then agent biết lệnh ghim lại dừng và gọi tên nhóm khi nguồn đổi cách ghi tiêu đề, và phải làm gì khi gặp lỗi ấy.

## Coverage

Thước đối chiếu: các tiêu đề mục của chính nguồn ReUI trong ảnh chụp ghim 11/11/2026 (`llms-full.txt` dòng 7 và 926,
`llms.txt` dòng 53 — `llms.txt` hôm nay đã ghi «Pro Blocks» hoa chữ B ở dòng 180, là chứng cứ nguồn có đổi chữ hoa
thường thật); danh sách `FORBIDDEN`, `ALLOWED_FIELDS`, `SOURCES` của `tools/reui_catalog/catalog.mjs`.

- Trục nhóm bắt buộc: Pro blocks | Free examples | ReUI Primitives.
- Trục dạng đổi tiêu đề: bảy dạng đã kê ở Context.
- Trục lệnh: ghim lại | sinh lại | kiểm.
- Trục dạng chuỗi cấm: mười dạng đã kê. Trục chỗ chèn: 27 chỗ đã kê. Trục cấp trường: gốc | nhóm | mục.
- Ô nhóm × dạng × ghim lại đi AC-1 (21 ô), đối chứng AC-2. Ô nhóm × một dạng × {sinh lại, kiểm} đi AC-3. Nhiều nhóm
  cùng mất và dòng gần giống đi AC-4. Dạng × chỗ đi AC-5 (270 ô). Cấp trường đi AC-6. Đối chứng dương AC-7. Chỗ × lệnh
  kiểm đi AC-8. Không thoái lui đi AC-9.
- Ô nhóm × sáu dạng còn lại × {sinh lại, kiểm} không có ca riêng: cùng một hàm đọc với AC-1, và AC-3 chứng hai lệnh ấy
  đi qua hàm đó.
- Ô dạng chuỗi cấm × chỗ × lệnh kiểm chỉ có 10 ô: 270 ô đo trên hàm quét trong tiến trình (AC-5), AC-8 chứng lệnh
  kiểm gọi hàm ấy ở cả bốn lớp chỗ.

## Đường đo

Ô cơ hội của hàng phát sinh không khai ngưỡng nghiệm thu (bốn ô ngưỡng để «…»); chủ kho cũng đã quyết không chạy
nghiệm thu giá trị trong đợt. Không có thước nào để nối.

## Out of scope

- Không nới khuôn tiêu đề để tự nhận dạng mới; nguồn đổi thì người ghim lại sửa bộ đọc trong một PR.
- Không sửa `tools/reui_catalog/catalog.test.mjs` của hàng 1g, không sửa hồ sơ `danh-muc-reui`.
- Không đổi các biểu thức của danh sách chuỗi cấm, trừ khi một ca của ma trận cho thấy một dạng đã kê không bị bắt.
- Không làm các mục ngoài hợp đồng khác của 1g (ghim lại thiếu tên thư mục, lọc loại thiếu giá trị, bộ chặn mạng cấp
  thấp) — đã ghi Known limits ở hồ sơ ấy.
- Không bắt nhóm lặp hai lần trong cùng tệp.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Bộ đọc `llms.txt` hôm nay đã dừng khi mất nhóm thành phần gốc, nhưng thông điệp «count mismatch: ReUI Primitives
  section not found» đổi sang khuôn chung `section missing in llms.txt: ReUI Primitives (component)`. Không ca kiểm hay
  hồ sơ nào ghim câu cũ.
- Hàm quét chuỗi cấm hôm nay không quét khoá `counts` của danh mục (chỉ kiểm tên khoá). Ma trận có chỗ `counts` nên
  vòng này thêm `counts` vào phần quét chữ; đây là sửa trong phạm vi «phủ đủ», không thêm dạng cấm mới.
- Hồ sơ đã ký `danh-muc-reui` đếm ca theo tên mở đầu `E<số> ·` và theo tệp `catalog.test.mjs` (đúng 33), không eval nào
  của nó so tổng số ca của cả thư mục; ca mới mở đầu `DC<số> ·` nên không lọt vào phép đếm nào của hồ sơ ấy (AC-9).
