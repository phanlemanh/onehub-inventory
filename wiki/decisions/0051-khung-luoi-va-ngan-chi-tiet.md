---
type: decision
title: Khung lưới, ngăn chi tiết và nút dùng chung
links:
  [
    wiki/decisions/0024-ngan-noi-xem-chi-tiet.md,
    wiki/decisions/0031-them-goi-khung-chia-keo-duoc.md,
    design/behaviors.md,
    src/components/candidate/record-panel.tsx,
    src/components/candidate/data-region.tsx,
    src/components/candidate/region-header.tsx,
    src/components/candidate/phone-list.tsx,
    src/components/candidate/column-filter-cell.tsx,
    src/components/candidate/corner-close.tsx,
    src/components/templates/app-shell/second-column.tsx,
  ]
sources:
  [
    "user, 2026-11-27 (phiên BH «Điều chỉnh UX Bảng hàng»)",
    _acceptance/ho-so-can/decisions.jsonl,
    _acceptance/hoi-dau-chu-bao-sai/decisions.jsonl,
  ]
---

# 0051 Khung lưới, ngăn chi tiết và nút dùng chung

## Status

Accepted, 2026-11-27, tại phiên xem trước «BH · Điều chỉnh UX Bảng hàng», trên ảnh và bản bấm được. Lời chủ kho, nguyên
văn: «Chốt cả bốn» (ngăn và lưới), «Chỉ còn hình» (nút khi ngăn mở), «Chốt một dòng» (đầu ngăn), «Duyệt cả ba câu» (chuẩn
nút), «Duyệt luật đã sửa» (luật «…»), «Duyệt cả sáu điểm» (nút Bảng hàng L1–L6). Hồ sơ dựng: việc phụ VP10
`khung-luoi-va-ngan-chi-tiet`.

## Context

Quyết định 0024 đặt ngăn chi tiết nổi «Trừ thanh trên»: cao từ ngay dưới thanh trên tới đáy. Hàng 3a (AC-4, phân xử
D-1411-1) hạ ngăn xuống dưới thanh công cụ của vùng để các nút Lọc, Cột, Toàn màn hình không bị che. Hàng 3e chọn đầu ngăn
hai dòng ở mọi khổ (13/11). Chủ kho xem Bảng hàng thật ngày 27/11 và thấy: ngăn trông như một cột chứ không như lớp đè;
ngăn mất khoảng 140 px nội dung vì đứng dưới thanh công cụ; đầu ngăn hai dòng tốn khoảng 97 px; lưới không khít màn; và
các nút đặt mỗi chỗ một kiểu.

## Decision

- **Ngăn nổi trở lại 0024:** cao từ ngay dưới thanh trên App Shell tới đáy, sát mép phải, nổi trên nội dung (nền lớp nổi,
  viền trái, bóng). Thay chỗ đặt của hàng 3a (AC-4). Ghim (quyết định 0031) giữ nguyên.
- **Thanh công cụ nhường ngăn:** khi ngăn nổi, thanh công cụ của vùng dừng cách ngăn 16 px, nút của nó chỉ còn hình, có
  tên đọc và chữ gợi ý; không nút nào bị cắt đôi.
- **Lưới khít màn:** đáy lưới cách vùng làm việc 16 px; cột thứ hai không làm trang cuộn thừa.
- **Đầu ngăn một dòng ở mọi khổ:** tên bên trái; góc phải trên Chép đường dẫn, Ghim (từ 800 px), Trước, Sau, Đóng, chỉ
  hình, có tên đọc và chữ gợi ý. Thay «đầu hai dòng» của hàng 3e (AC-10).
- **Chuẩn nút dùng chung:** «Sửa» ở đầu mục nó sửa, đầu hồ sơ chỉ giữ đi lại và «…»; việc bị chặn vì trạng thái thì một
  dòng chữ nhạt có ổ khoá nói lý do; trên điện thoại nút ở đầu hồ sơ, đầu mục, đáy hồ sơ có vùng bấm từ 44 px, máy tính giữ
  28 px. Thay luật «đầu hồ sơ có nút chính Sửa» của hàng 9e. Hai câu đầu dựng trong ngăn chi tiết căn ở hàng 3h; câu ba là
  phần khung, dựng ở VP10.
- **Luật «…»:** đếm theo tập việc có thể có của chỗ ấy (mọi vai, mọi trạng thái); một hoặc hai việc thường thì hiện thẳng;
  từ ba việc, hoặc có việc xoá, thì cả chỗ ấy dùng «…», xoá đứng cuối, chữ đỏ; «…» luôn hiện, tên đọc «Việc với <tên bản
  ghi>». Thay R1 «một nút «…»» của hàng 9e.
- **Sáu điểm nút Bảng hàng:** L1 hàng công cụ điện thoại hiện thẳng «Lưu góc nhìn», bỏ «…»; L2 nút × của hộp thoại và ngăn
  đáy đọc «Đóng»; L3 ô gõ và nút «Chọn» của hàng lọc cùng 28 px; L4 ghim và bỏ ghim nằm trong trình đơn tiêu đề của mọi cột
  không còn nút «Bỏ ghim» riêng ở cột Toà, cột ghim cuối có bóng đổ; L5 nút hàng công cụ điện
  thoại cao 44 px, «Lọc» có chữ và số ô đang lọc; L6 nút gập cột thứ hai hiện rõ khi con trỏ ở mép cột, có chữ gợi ý.

## Consequences

- Ngăn nổi che nửa phải thanh công cụ của vùng; đánh đổi ấy chủ kho đã nghe một lần và chọn.
- Nút × của bộ kit đọc «Close» và không nhận nhãn: hộp thoại và ngăn đáy của ta tắt nút ấy và đặt nút của ta
  (`corner-close.tsx`) cùng chỗ, chữ «Đóng». Tệp của nhà cung cấp không sửa.
- Hồ sơ đã ký có bài đổi kỳ vọng, mỗi hồ sơ một dòng «sửa sau ký»: `ho-so-can` (3a, AC-4), `hoi-dau-chu-bao-sai` (3e,
  AC-10), `bang-hang-the-dien-thoai` (2b, nút điện thoại và «…»), `bang-hang-dung-tay-nhu-sheet` (2e, nút «Bỏ ghim Toà»);
  ghim lại cùng một làn.
- Câu hỏi mở 17/11 về chiều cao ngăn hồ sơ căn (`h-20261117T020115Z-93`) đóng theo quyết định này.
