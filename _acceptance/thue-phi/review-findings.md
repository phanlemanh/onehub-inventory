## Trong hợp đồng

- **Duplicate-name check against law items depends on item order in the draft**
  file: `src/modules/company-config/fee-schedule.ts:117`
  severity: low
  AC: AC-1
  source: bugs
  detail: checkFeeDraft adds a law item's name to `names` only when it reaches that law item in the loop. An own item whose name matches a law item's name (for example the personal income tax label) is only caught if it comes after that law item. A PUT to /api/v1 that puts the own item first passes the check and saves an own item with the same name as a law item. The DB does not stop this either, because name uniqueness is only checked in this function. Fix: put the law names into `names` before the loop.
  rationale: AC-1 đòi hàm kiểm mức từ chối tên khoản riêng trùng tên khoản khác, kể cả khoản luật; thứ tự trong bản nháp làm lọt ca trùng.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Product language: never hard-code a label in src/ (AGENTS.md)**
  Người dùng thấy gì: Một số câu trên màn Thuế phí viết cứng các từ như «thuế phí», «bao phí», «khoản». Nếu sau này đổi tên khái niệm hay sàn đặt từ riêng, các câu này vẫn giữ từ cũ.
  Căn cứ: Hiện từ đang đúng nên người dùng chưa thấy gì sai, chỉ lệch khi đổi tên về sau, và sửa lúc ấy cũng rẻ.
  file: `src/modules/company-config/ui/fee-copy.ts`
  severity: medium
  Đề xuất: known-limits

- **Domain: each business rule lives in one place**
  Người dùng thấy gì: Các thông báo lỗi ghi sẵn số giới hạn (5 khoản, 5%, 10%...). Nếu giới hạn đổi mà quên sửa chữ, màn sẽ báo con số cũ.
  Căn cứ: Hiện số khớp với luật nên không ai bị sai; chỉ là nguy cơ khi đổi giới hạn sau này và dễ phát hiện, nên không đáng mở việc riêng.
  file: `src/modules/company-config/ui/fee-copy.ts`
  severity: low
  Đề xuất: wont-fix

- **Design: follow existing patterns, one constant per API address**
  Người dùng thấy gì: Địa chỉ lưu thuế phí được gõ lại ở chỗ Lưu thay vì dùng chung một chỗ. Hôm nay vẫn chạy đúng.
  Căn cứ: Không có hậu quả cho người dùng hiện giờ; nếu đường dẫn đổi thì lỗi lộ ngay khi bấm Lưu và sửa rất nhanh.
  file: `src/modules/company-config/ui/fee-part.tsx`
  severity: low
  Đề xuất: wont-fix

- **Saving any change wipes the default brokerage item's custom name**
  Người dùng thấy gì: Nếu sàn đã đổi tên Phí môi giới, lần Lưu thuế phí kế tiếp (kể cả chỉ bật tắt một công tắc khác) sẽ lặng lẽ xoá tên riêng đó và không báo gì.
  Căn cứ: Mất dữ liệu âm thầm trên một khoản chính, quản trị sàn khó nhận ra ngay và phải gõ lại tên; nên sửa sớm bằng một việc riêng.
  file: `src/modules/company-config/fee-store.ts`
  severity: high
  Đề xuất: new-contract

- **Removing one own item and adding another in one save fails with 500 when the company is at the 5-item limit**
  Người dùng thấy gì: Khi sàn đã có đủ 5 khoản riêng, bỏ một khoản và thêm khoản khác trong cùng lần Lưu sẽ báo lỗi chung dù mức hợp lệ.
  Căn cứ: Không mất dữ liệu và người dùng tự tránh được bằng cách Lưu hai lần, bỏ khoản trước rồi thêm sau; chỉ gặp khi sàn đã đầy khoản.
  file: `src/modules/company-config/fee-store.ts`
  severity: high
  Đề xuất: known-limits

- **Shape 3/1: 'starts hidden' checked by looking for a string in the function's source, not by checking which column is hidden**
  Người dùng thấy gì: Bài kiểm cột Điều kiện phí ẩn sẵn chỉ dò chữ trong mã, nên sau này cột có thể hiện sẵn mà bài kiểm vẫn xanh.
  Căn cứ: Hôm nay người dùng thấy đúng; rủi ro chỉ là lỗi tương lai lọt qua, và vá bài kiểm có thể làm sau.
  file: `tests/thue-phi-cot.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Shape 1: 'draws no frame of its own' measured by searching fee-part.tsx's source instead of the rendered output**
  Người dùng thấy gì: Bài kiểm phần Thuế phí không tự vẽ khung chỉ đọc chữ trong mã nguồn chứ không nhìn màn đã dựng, nên có thể bỏ sót hoặc báo nhầm.
  Căn cứ: Người dùng không bị ảnh hưởng; đã có ảnh so với màn Thành viên làm lớp kiểm khác, nên không đáng tốn công sửa.
  file: `src/modules/company-config/ui/fee-part.test.tsx`
  severity: low
  Đề xuất: wont-fix

- **Shape 4: a renamed or missing law item is refused only by the 400 status, with neither the reason nor 'nothing written' pinned**
  Người dùng thấy gì: Bài kiểm việc từ chối đổi tên hay bỏ khoản theo luật chỉ xem mã trả về, không xem lý do và không xem dữ liệu có đứng yên không.
  Căn cứ: Hành vi thật chưa được chứng minh sai, chỉ là bài kiểm lỏng; không ảnh hưởng người dùng và bổ sung sau cũng rẻ.
  file: `tests/db/thue-phi.db.test.ts`
  severity: medium
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
