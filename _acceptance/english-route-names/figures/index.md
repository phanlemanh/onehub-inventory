# Hình tại Cổng Phạm vi — english-route-names

| Điểm | Đếm | Hình |
| --- | --- | --- |
| Hỏi-1 · mã màn và hồ sơ đã ký | 3 nhánh rẽ (old_ids · giữ mã cũ · sửa hồ sơ đã ký) | `hoi-1-ma-man.html` |
| Hỏi-2 · từ truy vấn của Bảng hàng | 2 nhánh rẽ (tách hàng · gộp) | `hoi-2-pham-vi.html` |
| Hỏi-3 · chấm từ bản chép ngoài | 2 nhánh rẽ (bản chép · chờ đợt) | `hoi-3-cham.html` |
| Bảng cũ → mới | dưới ngưỡng: một chiều, không rẽ — bảng trong hợp đồng | — |

## Đề bài

**hoi-1-ma-man** — sơ đồ luồng, trái sang phải. Nút: «Sổ màn: company-layer.yaml, old_ids: [tuy-chinh-san]» → hai bộ đọc
«coverage_matrix» và «proof_gate» → rẽ theo trạng thái hồ sơ: «hồ sơ đã ký khai tuy-chinh-san → qua» và «hồ sơ đang mở khai
tuy-chinh-san → đỏ, nêu company-layer». Dưới, hai lối khác trong hộp mờ: «Giữ mã cũ: không đụng tools/, còn 2 tên tệp tiếng
Việt» và «Sửa hồ sơ đã ký: phá luật hồ sơ đã ký không sửa». AC-6, AC-7.

**hoi-2-pham-vi** — hai cột so sánh. Trái «Vòng này (khuyên)»: /tuy-chinh-san, ?phan=, /proto/bo-nut-theo-quyen, mã màn.
Phải «Hàng riêng kế tiếp»: Bảng hàng ?vai= ?mau= ?ma= ?toa= ?du-an= ?ho-so= ?vung= ?goc-nhin=, /proto/[slug] ?quyen=; chú
«~20 tệp bài kiểm, tools/deploy/thu-ban-dung.sh». Contract Out of scope.

**hoi-3-cham** — hai nhánh từ «Đợt điều phối đang nghỉ — móc chặn chấm trong thư mục kho»: «Chấm từ bản chép
~/dev/onehub-inventory-cham-url (khuyên) → S4 chạy ngay» và «Chờ đợt chạy lại → vòng đứng sau S3».

| Hỏi-4 · chuyển hướng địa chỉ cũ (thêm sau phản biện) | 2 nhánh rẽ (404 · chuyển hướng 308) | chưa vẽ — hai lối nằm trọn trong câu hỏi trên thẻ |
