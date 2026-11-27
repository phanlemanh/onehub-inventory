# Xuất hệ thiết kế ra DESIGN.md và gói cho Claude Design

Ngày 2026-11-27. Hồ sơ: `_acceptance/bring-out-claude-design/`. PR #125, nhánh `claude/design-bring-out-44e6df`.

## Vì sao

Chủ kho muốn đưa hệ thiết kế của kho sang Claude Design, để thứ gì làm ở đó theo đúng màu, chữ, bo góc và linh kiện của kho.
Claude Design không đọc sổ thiết kế của kho, nên kho viết sổ ra thành tệp nó đọc được, và cổng giữ để bản xuất không cũ đi so
với sổ.

## Đã làm

- `/design-assembly:bring-out` viết `DESIGN.md` ở gốc kho và gói hệ thiết kế bốn tệp trong `design/export/system/`
  (`README.md`, `tokens.json`, `components.md`, `assets.json`), mỗi tệp ghi trạng thái sổ mà nó được viết từ đó.
- Sổ quyết định thêm dòng `design-exports`; `design/theme.json` thêm năm phép kiểm bản xuất, nên cổng đỏ khi sổ đổi mà bản
  xuất chưa viết lại (`make design-exports`).
- Chủ kho cho phép gửi gói sang Claude Design (dòng `send-claude-design`, 2026-11-26). Gói đã gửi vào một artifact riêng tư
  của tài khoản chủ kho; mỗi lần gửi ghi vào `design/export/pushed.json`.
- Lần gửi đầu cho trang trống vì gói ở khuôn cũ; plugin sửa ở design-assembly#164 (0.76.0), kho lên đời ở PR #128, gói gửi lại.
- 2026-11-27: gộp main (PR #124, #126, #128) vào nhánh làm sổ linh kiện có thêm linh kiện, sổ sang trạng thái `f1f0bbbc4e26`;
  bản xuất viết lại, gói gửi lại theo phép đã có, lần gửi ghi lại.
- Câu «đặt hệ này làm mặc định ở Claude Design» chờ chủ kho (`design/waiting/default-claude-design.json`); chủ kho đã nói
  «Chưa đặt», máy không ghi câu trả lời nào.

## Cách đo

Sáu phép đo ở `rang/`, mỗi phép đo có cặp hai chiều ở `rang/two-way.mjs` (39 ca: xanh trên bản lành, đỏ với thông điệp ghim
trên bản sao bị phá):

- bản xuất đúng bằng thứ sổ viết ra ở HEAD, cổng giữ chúng;
- gói nói đúng điều nguồn nói: 40 màu hai giao diện (giá trị tối so qua một bộ đổi màu riêng của hồ sơ), kiểu chữ, bậc bo góc, đơn vị khoảng cách, 298 linh kiện;
- thứ đã gửi là thứ chủ kho cho phép, tới đúng chỗ riêng tư đã cho phép, và lần gửi cuối ghi đúng trạng thái của gói;
- không có hệ mặc định nào được đặt thay chủ kho;
- bản xuất không mang địa chỉ thư, số điện thoại, khoá hay đường dẫn trên máy;
- nhánh không đổi gì ngoài bản xuất, hai sổ (chỉ thêm dòng), câu chờ, nhật ký wiki và hồ sơ này.

`make check` của kho chạy kèm.

## Không làm

- Trang Claude Design hiện gói thế nào: ngoài kho, cần đăng nhập tài khoản chủ kho. Lần gửi đầu cho trang trống trong khi
  phía kho đo xanh, nên chủ kho xem ở đường dẫn artifact trước khi ký Cổng Bằng chứng.
- Trả lời câu đặt mặc định: của chủ kho.
- Sửa cách lệnh `bring-out` hay cổng của plugin làm việc: việc của kho design-assembly.
- Công cụ `tools/design-assembly/`: sau khi gộp main, nhánh không đổi tệp công cụ nào.

## Câu chờ chủ kho

- Hỏi-1: chấm từ bản chép kho bên ngoài, vì đợt `dieu-phoi-nen` đang chạy chỉ cấp lượt chấm cho dãy của nó.
- Hỏi-2: giữ lần gửi lại ngày 2026-11-27 (gói ở trạng thái `f1f0bbbc4e26`).
