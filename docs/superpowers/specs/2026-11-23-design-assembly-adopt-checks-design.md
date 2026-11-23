# Tiếp nhận design-assembly: nối tám quyết định vào kiểm tra sẵn có

Hồ sơ: `_acceptance/design-assembly-adopt-checks/`. Nhánh `chore/design-assembly-adopt`, PR 111.

## Vì sao

Lần kiểm tra hệ thiết kế ngày 2026-11-23 đếm được 29 trên 40 quyết định cốt lõi đã có câu trả lời. Tầng thành phần lõi
chưa đạt vì ba quyết định về bảng (căn lề cột, độ rộng cột, độ dày bảng) chỉ là «có dòng, không kiểm tra», dù kho đã có
bài kiểm thử mang nhãn `decision:` cho chúng. Công cụ tiếp nhận tìm thêm năm dòng cùng cảnh và hai quyết định về phông chữ
mà nó giữ được. Chủ kho chọn nối cả tám dòng.

## Thay đổi

- `design/decisions.yaml`: tám dòng có thêm một dòng `check:`:
  - cỡ chạm tối thiểu 24px → công cụ design-assembly đo chiều cao khai trong mã thành phần;
  - sáng/tối, điều hướng trên di động, màu trạng thái → bài thử trình duyệt của App Shell;
  - độ dày bảng → bài thử trình duyệt của lưới;
  - định dạng số, tiền, ngày → bài kiểm thử định dạng;
  - căn lề cột, độ rộng cột → bài kiểm thử lưới.
- Hai dòng mới: `font-loaded` (phông nào bảng kiểu nêu tên cũng phải được nạp) và `typeface` (tiêu đề dùng chung phông
  với thân bài).
- `design/theme.json`: ba mục kiểm tra cho cỡ chạm và hai dòng phông. Công cụ giữ 22 quyết định bằng 30 lệnh kiểm,
  trước là 19.
- `.claude/rules/design-assembly.md`: công cụ viết lại trang luật cho tác tử, thêm mục «Type», «Controls» và «Questions
  only the owner answers».

Không giá trị thiết kế, màn hay thành phần nào đổi.

## Cách chấm

Bốn tiêu chí, đo đúng những gì nhánh đổi: cổng `make check` in đúng con số; mười dòng trỏ đúng kiểm tra và đích có thật;
các bài kiểm thử được trỏ chạy xanh; và không gì khác trong bản ghi hay ngoài ba tệp sổ đổi. Hai phép đo mới nằm ở
`rang/`, mỗi phép đo có cặp hai chiều trên bản sao phá từ chính tệp của kho.

## Giới hạn đã biết

Trang luật do công cụ sinh có một dòng sai: phông thân bài ghi là `undefined`, dẫn tới `design/blueprint.json` không có
trong kho. Luật kho cấm sửa tay tệp này; bản sửa ở kho design-assembly, lần lên đời công cụ sau sẽ viết lại trang.
