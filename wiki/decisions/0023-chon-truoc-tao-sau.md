---
type: decision
title: Chọn trước, tạo sau — kho lớn dần
links:
  [
    wiki/decisions/0019-measurable-design-system-pilot.md,
    wiki/decisions/0013-selective-scope-and-design-foundation.md,
    design/reui-catalog.json,
    tools/proof_gate/khuon-chung-minh.md,
    docs/plan/lo-trinh.json,
  ]
sources:
  [
    "user, 2026-11-11",
    docs/design-standard-proposal.md,
    "onehub-quy-hang docs/adr/0002-vo-va-ia-chon-tu-reui.md",
    "onehub-quy-hang docs/adr/0019-cong-chon-khoi.md",
    "onehub-quy-hang docs/design/vo-va-ia.md",
    "onehub-quy-hang docs/plan/dong-nhat-bang-hang-lien-he.md",
  ]
---

# 0023 Chọn trước, tạo sau — kho lớn dần

## Status

Accepted, 2026-11-11. Chủ kho nêu hai ý và thứ tự ba bậc, rồi xác nhận bản diễn đạt dưới đây («Đúng ý.»). Thay dòng
«Thang dùng lại đổi thứ tự» của `docs/design-standard-proposal.md`, vốn ghi «cần một bản ghi quyết định» mà chưa có. Sửa
phần thang trong 0019. Sửa ADR-0002 và ADR-0019 của Quỹ hàng khi áp vào kho này.

## Context

Mục đích: cùng một nhu cầu thì ở mọi màn người dùng gặp cùng một thứ, học một lần là dùng được khắp nơi; đội làm cũng
dùng lại thay vì làm mới.

Quỹ hàng để ReUI đứng trước kho và chọn khối theo từng màn. Cùng nhu cầu «bảng nhiều dòng» mà Bảng hàng, Liên hệ, Hôm nay
và trang nhóm môi giới mỗi nơi một khối. Luật «chuyển thể khối chỉ đổi dữ liệu, chữ, tham số» giữ nguyên ở cấp khối,
trong khi khối là cách xếp cho bài toán của người khác: bảng chọn khối của chính Quỹ hàng đã phải ghi «bỏ vùng biểu đồ»,
«bỏ giỏ», «bỏ màu, cỡ, sao»; màn Hôm nay của đầu chủ làm lại vì đổi khối; Bảng hàng và Liên hệ lệch 43 chỗ, 25 chỗ không
có lý do, ở lớp ngay dưới khung.

Kho này đảo thứ tự (kho trước) nhưng không ghi quyết định và mất bước bày cho chủ kho chọn. App Shell, màn đăng nhập, màn
Thành viên và hộp thoại biểu mẫu được ghép tay khi kho còn rỗng, chưa từng bày ứng viên ReUI. Cổng chứng minh màn
(`tools/proof_gate`) cho qua vì khối tự tạo trong vòng, đăng ký vào sổ khối xong, được tính là «trong kho»; cổng chỉ tra
từng khối nhỏ, không tra cả màn. Năm hồ sơ màn không trích tài liệu Quỹ hàng lần nào.

## Decision

**Nguyên tắc.**

1. Chọn hơn tạo. Gặp một nhu cầu giao diện, việc đầu tiên là tìm thứ có sẵn để chọn; tạo tay là lối cuối.
2. Thang ba bậc, đi từ trên xuống, chỉ xuống bậc khi bậc trên không đáp ứng: (1) lắp ghép từ kho; (2) lắp ghép từ kho
   kết hợp ReUI Pro — phần kho có thì dùng của kho, phần thiếu chọn từ ReUI Pro; (3) tạo tay.
3. Kho lớn dần. Thứ gì dùng lần đầu, chọn từ ReUI hay tạo tay, thì từ đó thuộc về kho; lần sau gặp cùng nhu cầu là bậc 1.
4. Kho khởi đầu rỗng, nên lần đầu của mỗi loại (ví dụ App Shell) bắt đầu ở ReUI.

**Để nguyên tắc không bị lách.**

1. «Thuộc kho» phải qua thang và qua mắt chủ kho: vào bằng bậc 2 hay bậc 3 và đã được bày ở Cổng Phạm vi. Thứ tạo trong
   chính vòng đang làm không tự tính là «trong kho».
2. Một nhu cầu, một lời giải. Thứ trong kho chưa đủ thì mở rộng chính nó, không đặt thêm thứ thứ hai bên cạnh.
3. «Không đáp ứng» là một câu trỏ vào việc người dùng cần làm hay luật sản phẩm. «Trông chưa đẹp» hay «ghép tay nhanh
   hơn» không phải lý do xuống bậc.
4. «Giữ nguyên hình» theo ba tầng:
   - Thành phần (một món đơn của ReUI hay shadcn): giữ nguyên như nhà cung cấp giao — hình, hành vi, chuyển động.
   - Khối ReUI (nhiều thành phần xếp sẵn cho bài toán của người khác): là điểm xuất phát để chọn cách xếp. Vùng nào phục
     vụ việc của người dùng thì lấy, không thì bỏ, thiếu thì thêm bằng thành phần của kho; mỗi vùng lấy, bỏ, thêm một dòng
     lý do. Khối phải cắt quá nửa số vùng thì gọi đúng tên là «ghép từ thành phần».
   - Khuôn của kho (bản đã xếp cho bài toán của mình, chủ kho đã duyệt): đây mới là thứ nhập kho. Từ đó giữ nguyên; màn sau
     chỉ điền dữ liệu, chữ, tham số.
   - Nhu cầu con kho đã có lời giải (báo lỗi, thông báo, trạng thái trống) thì dùng của kho, không dùng bản trong khối.
5. Chọn đúng cấp: thang áp cho khung và bố cục của màn, vùng trong màn, và khối nhỏ. Khối cỡ cả màn không nhét vào một ô.
6. Chủ kho chỉ bị gọi khi kho sắp có thứ mới. Bậc 1 máy tự làm. Bậc 2 lần đầu và bậc 3 thì thẻ Cổng Phạm vi bày hai đến
   ba ứng viên kèm ảnh để chủ kho chọn.
7. Nhập kho là một dòng ghi sổ: thứ gì, từ khối ReUI nào hay tạo tay, cho nhu cầu gì, chủ kho duyệt ngày nào.
8. Đổi thứ đã ở trong kho thì đổi ở mọi nơi dùng nó, không tách nhánh riêng cho một màn.
9. Tài liệu Quỹ hàng là sách tham khảo bắt buộc đọc cho mỗi màn và là ứng viên đầu khi phải chọn từ ReUI; không phải một
   bậc đứng trên kho. Thẻ Cổng Phạm vi của màn có mục «Từ Quỹ hàng»: khối đã chọn bên đó, giữ gì, bỏ gì, vì sao.
10. Họ của màn (cột `family` của `design/screens.yaml`) là chốt của chủ kho ở Cổng Phạm vi, vì lối của cổng chứng minh
    màn suy từ nó.

Không chọn:

- ReUI trước kho (thứ tự của Quỹ hàng): mỗi màn chọn một khối riêng, cùng nhu cầu ra nhiều lời giải.
- Giữ nguyên ở cấp khối: khối mang vùng của bài toán khác, cắt thì trái luật, không cắt thì sai việc của người dùng.

## Consequences

- Cổng chứng minh màn và luật giao diện của kho (`.claude/skills/inventory-ui`, dòng «Adapting a ReUI block changes its
  data, text and props only») chưa khớp quyết định này; sửa ở hàng 1n của lộ trình.
- App Shell, màn đăng nhập, màn Thành viên và hộp thoại biểu mẫu chưa «thuộc kho» đúng nghĩa; chọn lại ở các hàng 1o,
  1p, 9c.
- App Shell: chủ kho chốt ngày 2026-11-11 dùng `app-shell-8` và giữ cả hai cột điều hướng. Các phần còn lại của App Shell
  quyết trên bản bấm được ở Cổng Phạm vi của hàng 1o.
- Khuôn Lưới dựng trên thành phần lưới dữ liệu của ReUI; phần khung, thanh công cụ và chân bảng xếp theo khối Quỹ hàng đã
  chọn (`data-grid-editing-6`) ở hàng 2, không thêm chức năng. Bảng thẻ trên điện thoại là hàng riêng sau hàng 3.
- Trong đợt «nen», các dãy theo quyết định này qua luật đợt cho tới khi hàng 1n gộp.
- Chủ kho gọi khung bọc mọi màn là App Shell; tài liệu và thẻ dùng chữ ấy.
