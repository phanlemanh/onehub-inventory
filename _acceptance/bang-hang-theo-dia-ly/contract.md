---
schema_version: 1
feature: "Đầu chủ đi Bảng hàng theo địa lý: chọn dự án, phân khu, toà ở cột thứ hai của App Shell và lọc các cột địa lý trên bảng"
slug: bang-hang-theo-dia-ly
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [ui]
screens: [inventory]
status: draft
approved_by:
approved_at:
design_doc: _acceptance/bang-hang-theo-dia-ly/design.md
---

# Acceptance Contract: bang-hang-theo-dia-ly

## Context

Hàng 2d của lộ trình. Chủ kho 2026-11-12: đầu chủ nghĩ theo địa lý — dự án → phân khu → toà —, ở Sheet mỗi khu một tab và
lọc bằng cột. Hàng này đặt cây dự án → phân khu → toà kèm số căn ở cột thứ hai của App Shell trên Bảng hàng, và nối cây với
ô lọc cột Dự án, Toà thành một trạng thái lọc. Cấp phân khu lấy từ danh mục căn của hàng 7d (đã ở nhánh chính).

Source input: ô cơ hội `_acceptance/bang-hang-theo-dia-ly/opportunity.md` (chủ kho «build» 2026-11-12), lời giao của giám sát
(K-1411-27, G-1411-79), thiết kế `design.md`, bản bấm được (ảnh `figures/proto/`), trang cổng `cong-pham-vi.html`.

Luật sản phẩm chạm: SP-1 đọc lại — cây không thêm cách đọc dữ liệu nào (AC-1). SP-3, SP-4 không chạm.

Dáng cây (Hỏi-1), giữ lọc khác (Hỏi-2) và cách đếm (Hỏi-3) theo khuyến nghị; chủ kho chọn khác thì tiêu chí đổi theo lời
chọn trước khi duyệt.

## Criteria

- AC-1 (cross-layer): Given Bảng hàng của [Sàn mẫu Ocean] với 60 dòng mẫu, When Đầu chủ đã đăng nhập mở Bảng hàng ở 1440, Then cột thứ hai
  có nhóm «Theo địa lý» dưới «Theo trạng thái»: ba dự án theo thứ tự danh mục; Ocean Park 1 → phân khu The Sapphire 1 →
  bốn toà; Ocean Park 2, 3 → toà đứng thẳng dưới dự án; số trên mỗi nút bằng số dòng Bảng hàng ở nơi ấy (36, 36, 6, 9, 10,
  11, 12, 12, 12, 12); nơi không có dòng nào trên Bảng hàng không hiện; cây đọc chính các dòng bảng đã đọc và chỗ đứng của
  toà trong danh mục căn mẫu mà các dòng ấy đã dùng (`inventory-sample-rows.ts`), không thêm truy vấn hay lần đọc nào (SP-1).
  Sàn chưa có căn nào thì nhóm «Theo địa lý» vẫn hiện, không nút nào, kèm câu «Chưa có căn nào trên Bảng hàng.».
- AC-2: Given cây của AC-1, When Đầu chủ bấm một dự án, một phân khu, hay một toà, Then bảng còn đúng tập dòng của nơi ấy —
  so theo mã dòng, không thiếu không thừa —, chân bảng «x / 60 dòng» với x bằng số trên nút, nút ấy sáng và là mục sáng duy
  nhất của cột thứ hai.
- AC-3: Given một nơi vừa chọn, When nhìn hàng ô lọc dưới tiêu đề, Then ô Dự án hiện tên dự án trọn vẹn và ô Toà hiện tên
  toà (phân khu: các toà của nó, cách nhau dấu phẩy; dự án: ô Toà trống); lọc ấy khớp trọn tên — dự án tên «… Park 1» không
  lấy dòng của dự án «… Park 10».
- AC-4: Given bảng đang lọc theo một nơi, When Đầu chủ sửa ô lọc Dự án hay Toà, hay bấm «Xoá lọc», Then cây theo cùng trạng
  thái: một nút sáng khi và chỉ khi tập dòng lọc ra bằng đúng tập dòng của nơi ấy (chọn từ cây, hay chữ gõ tay mà lọc ra
  đúng những dòng ấy — gõ «… Park 1» khi có cả «… Park 10» thì không nút nào sáng); không trùng nơi nào thì không nút nào sáng;
  «Xoá lọc» thì «Tất cả hàng» sáng; không lúc nào cây sáng một nơi mà bảng hiện dòng của nơi khác.
- AC-5: Given lọc Trạng thái «Đang bán» đang bật, When Đầu chủ bấm một toà, Then lọc Trạng thái giữ nguyên, chỉ lọc Dự án và
  Toà đổi; số trên mỗi nút đếm theo các lọc khác đang bật nhưng KHÔNG theo chính lọc Dự án, Toà — nên số trên nút vừa bấm
  bằng số dòng bảng hiện ra, và bấm xong các nơi khác vẫn giữ số của mình; nơi còn 0 căn dưới các lọc khác vẫn hiện, ghi 0.
- AC-6: Given một nơi đang chọn, When Đầu chủ tải lại trang, mở đường dẫn đã chép, hay lưu góc nhìn rồi mở lại góc nhìn ấy,
  Then bảng mở với đúng lọc Dự án, Toà ấy và cây sáng đúng nơi ấy (góc nhìn sáng ở «Góc nhìn của tôi», nơi tương ứng không
  tranh sáng); đường dẫn trỏ nơi không còn căn thì bảng mở như thường và không nút nào sáng.
- AC-7: Given ô lọc chữ của Bảng hàng (Căn, Toà, Dự án) và của Đã gửi, When người gõ chữ tay, Then lọc vẫn là «chứa chữ, bỏ
  dấu và hoa thường» như hàng 2a và 2e — kiểu khớp trọn tên chỉ áp cho danh sách tên đến từ cây; luật ghi ở
  `design/behaviors.md`.
- AC-8: Given điện thoại 414 và 360, When Đầu chủ mở ngăn App Shell, Then cây nằm trong ngăn dưới «Theo trạng thái», bấm một
  nơi thì ngăn đóng và bảng lọc như AC-2; ở 1024 và 1440 tên nơi dài xuống dòng, không cắt — ba dự án «Vinhomes Ocean Park
  …» phân biệt được.
- AC-9: Given Bảng hàng có cây ở 1440 và 360, sáng và tối, When chạy bài trợ năng axe và đi bằng phím, Then không vi phạm
  nào; Tab vào cây, mũi tên tới được từng nơi, Enter mở nơi ấy, nút đang chọn mang `aria-current`.
- AC-10: Given các màn khác dùng cột thứ hai của App Shell (Đã gửi; Tuỳ chỉnh của sàn khi hàng 7e đã gộp), When mở các màn ấy
  ở 1440 và 360, Then cột thứ hai của chúng như trước (cùng mục, cùng mục sáng, không cây), bài kiểm App Shell cũ vẫn xanh
  không đổi lời; ảnh trước/sau trên trang Cổng Bằng chứng.

## Coverage

Bỏ quét hình thái theo trục — xem dòng sổ «bỏ coverage-scan»: không gian của hàng khép bởi ba trục viết sẵn dưới đây.

- Ba cấp nơi × kiểu đứng: dự án; phân khu; toà trong phân khu; toà đứng thẳng dưới dự án; toà danh mục không biết (AC-1,
  AC-2, AC-3).
- Hai chiều của một trạng thái: cây → ô lọc (AC-2, AC-3), ô lọc → cây (AC-4), cùng các lọc khác (AC-5), địa chỉ và góc nhìn
  (AC-6), chữ gõ tay giữ nguyên luật (AC-7).
- Bốn khổ × sáng tối × phím và trợ năng (AC-8, AC-9); màn khác dùng cột thứ hai (AC-10).

## Vai × Màn

Hàng này không đổi quyền: cây hiện cho đúng các vai đọc được Bảng hàng, theo cùng ô của bảng quyền như mục Bảng hàng.

| Màn | Đầu chủ | Đầu khách | Trưởng nhóm | Quản trị sàn |
|---|---|---|---|---|
| inventory | được — cây ở cột thứ hai, chọn nơi lọc bảng | được — như Đầu chủ | được — như Đầu chủ | chặn — không có mục Bảng hàng, không cây |

## Đường đo

Bỏ — xem dòng sổ «bỏ đường-đo»: chủ kho dời nghiệm thu giá trị tới cuối lộ trình MVP; ngưỡng của ô cơ hội chính là các tiêu
chí trên.

## Out of scope

- Cột Phân khu trên Bảng hàng: không thêm (giữ tám cột của hàng 2); phân khu lọc qua cột Toà.
- Cấp tầng và trục trong cây: không làm; lọc tầng bằng ô lọc Căn.
- Ô «Gõ để tìm» trong cây hay trong vùng: không (2e); tìm ở ⌘K (3f).
- Nợ cột «Căn» cắt mã căn: đã hết trên nhánh chính sau 3a và 2e (ảnh trên trang cổng), không làm ở đây.
- Cây trên màn khác ngoài Bảng hàng (Đã gửi, Liên hệ): không.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Trình tự (điều kiện của giám sát): bản bấm được và Cổng Phạm vi làm trên nhánh chính f905ded; phần DỰNG chỉ bắt đầu khi PR
  #53 (7e) đã gộp và `origin/main` đã gộp về; hàng 2b (dãy V) chạm cùng thư mục — hỏi G thứ tự gộp trước khi dựng.
- Tệp ngoài vùng (G-1411-79 cho ở mức bản bấm được, nêu đích danh): `src/components/templates/nav-items.ts`, `nav-menu.tsx`
  (mục con và số của cột thứ hai); `src/components/candidate/grid-view.ts`, `column-filter-cell.tsx` (khớp trọn tên cho danh
  sách, hiện danh sách); `package.json`, `package-lock.json`, `src/components/reui/tree.tsx`, `design/component-registry.json`
  (khối Cây của ReUI, cả hai lối còn lại đều dùng); `_acceptance/config.yaml` (hai dòng lệnh chấm, chỉ thêm).
- Bản bấm được có tham số chỉ để so (`?loi=`, `?nhieu=`); gỡ khi dựng.
