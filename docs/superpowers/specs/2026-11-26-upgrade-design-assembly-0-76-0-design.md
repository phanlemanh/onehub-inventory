# Lên đời design-assembly 0.69.0 → 0.76.0 và chữ trang logo của sổ thiết kế

Ngày 2026-11-26. Hồ sơ: `_acceptance/upgrade-design-assembly-0-76-0/`. PR #128.

## Vì sao

Máy chủ kho đã lên plugin design-assembly 0.76.0 trong khi kho vẫn ghi 0.69.0. Khuôn chữ của sổ thiết kế ở 0.76.0 có thêm
13 khoá cho trang logo và bộ biểu tượng, nên phép đo khuôn chữ của hồ sơ `design-decisions-40-of-40` đỏ với bản mới, và sổ
của kho chưa có chữ tiếng Việt cho trang ấy.

## Đã làm (commit `afcb1ca2`)

- Chạy `upgrade` của plugin, xem trước rồi ghi: 11 tệp công cụ trong `tools/design-assembly/`, dấu phiên bản. Bản xem trước
  thoát 0: không mục nào của sổ mất, cổng design-assembly xanh, bước cổng `mk/design-assembly.mk` giữ nguyên.
- Thêm 13 chữ tiếng Việt vào `design/book-words.json`, theo `design/language.md`: chỉ viết hoa chữ đầu câu, dấu thanh kiểu
  mới, không dấu chấm than, không giá trị màu hay tên kho. «Floor» dịch là «mức tối thiểu», không phải «mức sàn», vì «sàn»
  là loại hình theo luật.
- Một dòng nhật ký wiki.

## Cách đo

Theo khuôn hồ sơ `upgrade-design-assembly-0-69-0`: cây công cụ bằng bản phát hành, cổng xanh cùng số, mỗi quyết định giữ
trạng thái giữa công cụ cũ và mới, nhánh không đổi gì ngoài danh sách. Bỏ ba phép đo của chỗ sửa kho mà lần này không có
(bản sao nông, tầm luật lint, `choose-first`). Thêm ba phép đo cho phần mới: kiểm tra của plugin vẫn 40/40, chữ của sổ đủ
khoá và đúng luật chữ, sổ vẽ trang logo bằng chữ tiếng Việt trên bản sao có dòng mẫu. Một hội đồng đọc nghĩa và giọng của
13 câu cạnh câu tiếng Anh.

Mỗi phép đo ở `rang/` có cặp hai chiều trong `rang/two-way.mjs`: xanh trên vật lành, đỏ với thông điệp ghim trên bản phá.

## Không làm

- Dịch phần chữ trang logo mà plugin tự viết không qua khuôn chữ: việc của plugin.
- Ghi dòng logo hay bộ biểu tượng cho kho: chủ kho quyết, kèm giấy phép.
- Sửa công cụ bằng tay hay sửa hồ sơ đã ký.

## Câu chờ chủ kho

- Hỏi-1: chấm từ bản chép kho bên ngoài (đợt `dieu-phoi-nen` đang chạy chỉ cấp khoá cho dãy của nó).
- Hỏi-2: gộp Gate 1.5 vào Cổng Phạm vi.
- Hỏi-3: giữ 13 chữ như bảng `rang/brand-words.md`.
