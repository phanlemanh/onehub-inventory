# Review findings: loi-vao-ho-so (round 2)

## Trong hợp đồng

(không có)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Product language: a concept word is hard-coded instead of coming from label() (ui.md / AGENTS.md 'Never hard-code a label')**
  Người dùng thấy gì: Nếu một sàn đổi tên «Toà» hoặc «Dự án» thành chữ khác, dòng mô tả trong ô tìm vẫn ghi chữ cũ, trong khi các gợi ý bên dưới dùng chữ mới. Ô tìm vẫn chạy đúng.
  Căn cứ: Chỉ lệch chữ ở một dòng mô tả khi sàn đổi tên nhãn, không mất dữ liệu và không cản việc tìm; sửa sau rẻ.
  file: `src/modules/listings/ui/entry-copy.ts`
  severity: medium
  Đề xuất: known-limits

- **Invariant 1 (company isolation): the top-bar search reads the sample company for every session, on every screen**
  Người dùng thấy gì: Hôm nay ô tìm ở thanh trên luôn gợi ý từ dữ liệu mẫu của một sàn, không phân biệt người dùng thuộc sàn nào. Khi dữ liệu thật vào, phải gắn lại theo sàn đang mở, nếu không sàn này có thể thấy mã căn của sàn khác.
  Căn cứ: Hiện chỉ có dữ liệu mẫu nên chưa lộ gì của ai; rủi ro chỉ xuất hiện khi chuyển sang dữ liệu thật ở hàng 10, nên ghi lại để làm đúng lúc đó.
  file: `src/app/(app)/layout.tsx`
  severity: low
  Đề xuất: known-limits

- **The new E9 screenshot step hides Next.js's whole dev overlay, including its error dialog and issue badge, not just the 'N' badge**
  Người dùng thấy gì: Ảnh chụp kiểm tra giao diện có thể trông sạch dù trang đang báo lỗi lúc chạy, vì khung báo lỗi của môi trường phát triển bị ẩn. Người dùng thật không bị ảnh hưởng.
  Căn cứ: Chỉ làm bộ kiểm tra bỏ sót lỗi hiển thị khi chạy thử, không đụng tới sản phẩm đến tay người dùng; sửa sau rẻ.
  file: `_acceptance/loi-vao-ho-so/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (âm tính một mình, không đối chứng dương): E10 coi «không in dòng lệch:» là bằng chứng Bảng hàng dựng trong DataRegion**
  Người dùng thấy gì: Phép kiểm khuôn giao diện báo đạt dù chính nó ghi nhận Bảng hàng chưa theo khuôn từ trước, nên kết quả đạt này không chứng minh được điều nó hứa. Người dùng không thấy khác biệt nào.
  Căn cứ: Chỉ làm một phép kiểm nội bộ nói quá điều nó đo, không ảnh hưởng người dùng; ghi lại để không tin quá vào kết quả đó.
  file: `_acceptance/loi-vao-ho-so/evals.yaml`
  severity: high
  Đề xuất: known-limits

- **Product language: never hard-code a label in src/ (AGENTS.md, Product language) (r1)**
  Người dùng thấy gì: Dòng mô tả của ô tìm ⌘K luôn viết «toà» và «dự án», nên nếu một sàn đổi tên hai khái niệm này thì dòng mô tả vẫn hiện chữ cũ.
  Căn cứ: Chỉ sai một dòng chữ phụ, không mất dữ liệu và không cản việc tìm; chỉ lộ ra khi sàn đổi tên khái niệm, và sửa sau cũng rẻ.
  file: `src/modules/listings/ui/entry-copy.ts`
  severity: medium
  Đề xuất: known-limits

- **Search suggestions skip Vietnamese mark folding that the grid filter uses, so typing without marks finds no building or project and Enter searches the wrong column (r1)**
  Người dùng thấy gì: Gõ tên toà hay dự án không dấu (ví dụ «dong» cho «Đông») thì ô tìm không gợi ý gì, và bấm Enter đưa người dùng tới một bảng rỗng dù bảng có toà khớp.
  Căn cứ: Không mất dữ liệu và người dùng tự gõ lại có dấu được, nhưng người dùng Việt hay gõ không dấu nên dễ gặp; nên làm thành việc riêng.
  file: `src/modules/listings/ui/inventory-rows.ts`
  severity: low
  Đề xuất: new-contract

- **Search that finds one unit adds the record to the address on the server, so a page reload or router.refresh after closing the record opens it again (r1)**
  Người dùng thấy gì: Sau khi tìm một căn rồi đóng hồ sơ, nếu tải lại trang hoặc lưu cách xem thì hồ sơ căn đó tự mở lại dù người dùng đã đóng.
  Căn cứ: Không mất dữ liệu và chỉ cần đóng hồ sơ lần nữa là xong; chỉ gây phiền nhẹ trong một đường đi hẹp.
  file: `src/app/(app)/inventory/page.tsx`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4: kiểm tra âm tính đứng một mình, không có ca đối chứng và không ghim thông điệp, ở «Enter khi ô rỗng thì không đi đâu» (r1)**
  Người dùng thấy gì: Người dùng không thấy gì sai hôm nay: Enter trên ô rỗng vẫn không đi đâu. Chỉ là phép đo tự động có thể bỏ sót nếu sau này có lỗi làm trang chuyển chậm.
  Căn cứ: Không ảnh hưởng người dùng hiện tại, và ca kiểm đơn vị đã bắt được lỗi này ở tầng khác; sửa lúc nào cũng rẻ.
  file: `tests/e2e/loi-vao-ho-so.spec.ts`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 2/4 lỗi rơi vào file không bộ đo nào phủ (_acceptance/loi-vao-ho-so/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
