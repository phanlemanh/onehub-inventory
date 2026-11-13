---
schema_version: 1
feature: "Đầu chủ ghim ngăn chi tiết thành một cột cạnh bảng khi làm lâu trên một căn, bỏ ghim thì ngăn nổi lại"
slug: ngan-chi-tiet-ghim-thanh-cot
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [ui]
screens: [inventory, sent]
status: approved
approved_by: Manh Phan
approved_at: 2026-11-13
design_doc: docs/superpowers/specs/2026-11-14-ngan-chi-tiet-ghim-thanh-cot-design.md
---

# Acceptance Contract: ngan-chi-tiet-ghim-thanh-cot

## Context

Hồ sơ căn của hàng 3 là ngăn nổi bên phải (quyết định 0024). Chủ kho chọn «Lấy B có ghim» và nói ở Cổng Phạm vi hàng 3:
«Nút ghim (ngăn thành cột, kéo đổi rộng) … làm ở hàng sau». Hàng này thêm nút Ghim vào khung hồ sơ chung `RecordPanel`:
ghim thì ngăn thành cột cạnh bảng, vạch chia kéo đổi rộng được (dáng khối ReUI `app-shell-11`, thành phần `Resizable`);
bỏ ghim thì nổi lại. Nút nằm ở dòng hai của đầu hồ sơ hai dòng mà hàng 3e làm (giám sát chốt, mục «Bộ nút của hồ sơ căn»).
Phần dựng chờ 3e, 4, 2e gộp.

Luật sản phẩm: không chạm SP-1 (không truy vấn), SP-3 (không nút gửi), SP-4 (không chạm trang khách). Luật ngoại tuyến
của kho: trạng thái ghim là lựa chọn giao diện, lưu bằng một cookie không mang dữ liệu sàn (AC-8).

Source input: hàng `3a` của `docs/plan/lo-trinh.json`, ô `_acceptance/ngan-chi-tiet-ghim-thanh-cot/opportunity.md`
(build), lời giao của giám sát đợt «nen».

## Criteria

- AC-1: Given Bảng hàng hay Đã gửi ở khổ 1024 hoặc 1440 với hồ sơ một dòng đang mở, When nhìn đầu hồ sơ, Then dòng hai có
  một nút chỉ biểu tượng tên «Ghim thành cột» đứng sau các nút của bản ghi và ngay trước «Trước», «Sau», «Đóng»; nút
  thuộc khung chung nên màn không phải khai gì thêm; ở khổ 360 và 414 không có nút ấy và hồ sơ mở toàn màn như cũ; ở khổ
  768 nút chỉ hiện khi vùng làm việc rộng ít nhất 800 px (đủ cho cột 320 px và bảng 480 px), không thì hồ sơ chỉ nổi.
- AC-2: Given hồ sơ đang nổi trên Bảng hàng hay Đã gửi ở 1440 hoặc 1024, When bấm Ghim, Then hồ sơ thành cột sát mép phải vùng làm việc (không còn
  bóng nổi), mép phải của vùng dữ liệu không vượt mép trái của cột, số cột của bảng đang hiện giữ nguyên như trước khi
  ghim (không cột nào bị tự giấu — cột không vừa thì bảng cuộn ngang), nút đổi tên thành «Bỏ ghim» với `aria-pressed`
  đúng; When bấm «Bỏ ghim», Then hồ sơ của cùng căn nổi lại và vùng dữ liệu về đủ rộng như lúc chưa mở hồ sơ; khi đổi
  dáng theo cả hai chiều, tiêu điểm ở lại nút vừa bấm và vị trí cuộn trong thân hồ sơ giữ nguyên.
- AC-3: Given đang ghim, When bấm «Sau», bấm mã căn của một dòng khác, bấm «Đóng» rồi mở lại một căn, tải lại trang, hoặc
  sang màn khác dùng khung chung và mở một dòng, Then hồ sơ mở thành cột ở mọi lần ấy, cùng độ rộng; khi đã đóng thì
  không có cột và vùng dữ liệu đủ rộng.
- AC-4: Given hồ sơ nổi hay ghim ở 1440 và 1024, When đo, Then thanh trên của App Shell và thanh công cụ của vùng không bị
  hồ sơ che, và bảng không bị khoá: bấm một ô bên trái chọn được ô ấy, phím mũi tên đi ô; khi vùng ở Toàn màn hình mà
  đang ghim, cột vẫn đứng cạnh và vùng vẫn nhường đúng bề rộng cột.
- AC-5: Given đang ghim ở 1440, When kéo vạch chia sang trái hay phải, hoặc đặt tiêu điểm vào vạch rồi bấm mũi tên trái,
  phải, Then cột rộng ra hay hẹp lại, không hẹp hơn 320 px và không rộng hơn ba phần năm vùng làm việc; độ rộng mới giữ
  sau khi tải lại trang.
- AC-6: Given trạng thái ghim đã lưu, When đọc kho lưu của trình duyệt, Then chỉ có một cookie `ho_so_ghim` mang trạng
  thái và độ rộng (dạng `1:<số px>`), không mang mã căn, mã sàn hay chữ nào của dữ liệu; cookie hỏng hay ngoài giới hạn
  đọc như chưa ghim với độ rộng mặc định.
- AC-7: Given hồ sơ ghim ở 1440 sáng và tối, When quét trợ năng, Then không lỗi nào; nút Ghim có tên và `aria-pressed`,
  vạch chia có vai `separator`, có tên và giá trị hiện tại; Esc khi tiêu điểm trong hồ sơ ghim thì đóng hồ sơ và tiêu
  điểm về dòng đã mở nó; Esc khi tiêu điểm ở bảng (kể cả ô đang sửa) không đóng hồ sơ ghim — trong ô đang sửa nó chỉ huỷ
  lần sửa.
- AC-8: Given sổ màn `design/screens.yaml`, When chạy công cụ sinh bảng vai × màn × nút, Then nút «Ghim» có trong nút
  chung của Bảng hàng và Đã gửi, bảng sinh ra khớp với tệp đã commit, và `make check` xanh.
- AC-9: (judgment) Given ảnh hồ sơ ghim ở bốn khổ (1440, 1024 sáng và tối; 360 sáng) cạnh ảnh khối ReUI `app-shell-11`,
  When người chấm so, Then dáng cột ghim và vạch chia giống khối (cột liền mép phải, vạch mảnh có tay cầm), nút Ghim nằm
  đúng chỗ đã chốt ở đầu hồ sơ, và ảnh 360 cho thấy hồ sơ toàn màn không có nút Ghim.

## Vai × Màn

Nút Ghim không theo quyền (nút chung của khung): mọi vai mở được hồ sơ thì có nút.

| Màn | Đầu chủ | Đầu khách | Trưởng nhóm | Quản trị sàn |
|---|---|---|---|---|
| inventory | được — có nút Ghim | được — có nút Ghim | được — có nút Ghim | như Bảng hàng hôm nay (hàng 10 chặn theo quyền xem) |
| sent | được — có nút Ghim | được — có nút Ghim | được — có nút Ghim | như Đã gửi hôm nay |

## Coverage

Bỏ quét hình thái — bài toán một chiều (một nút hai trạng thái trên một khung có sẵn); xem dòng `descope` «bỏ
coverage-scan» trong sổ quyết định. Thay vào đó, các trục cố định đã phủ bằng tiêu chí:

- Dáng: nổi · ghim · đã đóng khi đang ghim (AC-2, AC-3).
- Đường đi qua căn: Trước/Sau · bấm dòng khác · đóng/mở · tải lại · màn khác (AC-3).
- Khổ: 360 · 414 không có ghim; 768 có khi vùng làm việc đủ 800 px; 1024 · 1440 có (AC-1, AC-4, AC-9); sáng · tối
  (AC-7, AC-9); Toàn màn hình (AC-4).
- Tiêu điểm và phím: đổi dáng giữ tiêu điểm và cuộn (AC-2); Esc từ hồ sơ · từ bảng · từ ô đang sửa (AC-7).
- Kéo: chuột · phím; biên hẹp · rộng (AC-5).
- Lưu: có · hỏng · ngoài giới hạn (AC-6).

## Đường đo

- bỏ đường đo — ô cơ hội chưa khai ngưỡng số (sổ quyết định).

## Out of scope

- Lớp trò chuyện với AI trong ngăn (thẻ thứ hai) — hàng sau, chưa có ô.
- Ghim trên điện thoại hay biến hồ sơ thành trang riêng (Hỏi-1; trái lời chủ kho ở Cổng Phạm vi 3f).
- Lưu trạng thái ghim lên máy chủ để theo người qua thiết bị khác.
- Ghim nhiều hồ sơ cùng lúc, ghim sang trái, kéo đổi rộng ngăn khi đang nổi.
- Sửa đầu hồ sơ hai dòng, thanh đáy hay nút trong hồ sơ — của hàng 3e.

## Notes

- Hỏi cho chủ kho ở Cổng Phạm vi: Hỏi-1 điện thoại; Hỏi-2 ghim ở màn hẹp khi cột thứ hai App Shell mở (thiết kế, mục
  «Câu cho chủ kho»). Chọn B ở Hỏi-2 thì thêm tiêu chí tự gập và trả cột thứ hai.
- Gói mới `react-resizable-panels` (MIT) cài cùng thành phần `resizable` bằng lệnh shadcn; giám sát cho chạm ba tệp ngoài
  vùng (tin D-1311-31) với năm điều kiện, trang quyết định 0031.
- Phần dựng chờ 3e, 4, 2e gộp vào nhánh chính.
