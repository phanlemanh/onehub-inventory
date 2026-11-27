---
schema_version: 1
feature: Xuất hệ thiết kế của kho ra DESIGN.md và gói hệ thiết kế cho Claude Design, cổng giữ bản xuất, gửi gói theo phép của chủ kho và ghi lần gửi
slug: bring-out-claude-design
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [config, docs]
status: approved
approved_by: Manh Phan
approved_at: 2026-11-27
design_doc: docs/superpowers/specs/2026-11-27-bring-out-claude-design-design.md
---

# Acceptance Contract: bring-out-claude-design

## Context

PR #125, nhánh `claude/design-bring-out-44e6df`. `/design-assembly:bring-out` viết `DESIGN.md` và gói hệ thiết kế bốn tệp
trong `design/export/system/`, đặt chúng dưới cổng (dòng sổ `design-exports`, năm phép kiểm trong `design/theme.json`), và
gửi gói vào một artifact riêng tư của tài khoản chủ kho ở Claude Design theo phép chủ kho cho (dòng `send-claude-design`,
2026-11-26). Mỗi lần gửi ghi vào `design/export/pushed.json`. Câu đặt hệ này làm mặc định chờ chủ kho.

Mã có trên nhánh trước hồ sơ. Sau khi gộp main (`fe9afc7f`), nhánh chỉ đổi tệp thiết kế, nhật ký wiki và hồ sơ này; cổng
trước khi gộp vẫn đòi hồ sơ vì `design/**` và `DESIGN.md` không thuộc hạng T1.

Source input: phiên «Design assembly audit» giao việc bring-out, và lời chủ kho «Có, sau #124» cho vòng nghiệm thu; design
doc ở `design_doc`.

## Criteria

- AC-1: Given nhánh ở HEAD, When chạy `make check`, Then lệnh thoát 0, và đầu ra có dòng
  `design-assembly: 26 decisions held by 41 checks, each seen failing on a changed copy` cùng dòng số bài ghim ở ma trận
  (cây hiện tại: `Tests  2743 passed | 2 skipped (2745)`).
- AC-2: Given một bản sao của HEAD đã viết các tệp kho để ngoài git, When viết lại bản xuất bằng `make design-exports`,
  Then không byte nào của năm bản xuất đổi; cả năm ghi trạng thái sổ `f1f0bbbc4e26`; `design/theme.json` giữ đúng năm tệp ấy
  dưới quyết định `design-exports`; và cổng trên bản sao xanh với dòng của AC-1. Khi `DESIGN.md` bị sửa tay, khi một màu
  của `design/tokens.json` đổi mà bản xuất không viết lại, hay khi `design/theme.json` bỏ một bản xuất, phép đo đỏ và gọi
  tên chỗ ấy.
- AC-3: Given gói ở HEAD, When so với nguồn của nó, Then `tokens.json` có màu dạng danh sách với hai giao diện sáng và tối;
  đủ 40 vai màu của `design/tokens.json`, mỗi vai có đúng giá trị sáng của nguồn, giá trị tối bằng giá trị tối của nguồn (đổi từ chữ CSS của nguồn sang mã màu bằng một bộ đổi riêng của hồ sơ, lệch tối đa 2/255 mỗi kênh) và một câu dùng; kiểu chữ
  sans và heading là Inter do bộ nạp phông trong `src/app/layout.tsx` nạp; mỗi bậc bo góc của nguồn ra đúng số điểm ảnh;
  đơn vị khoảng cách 4px; `components.md` kê đúng 298 linh kiện của sổ linh kiện, mỗi linh kiện một lần; và `DESIGN.md` ghi
  cùng giá trị sáng của 40 màu. Mỗi lệch ấy trên một bản sao làm phép đo đỏ và gọi tên màu, bậc hay linh kiện.
- AC-4: Given HEAD, When đọc phép gửi và lần gửi, Then dòng sổ `send-claude-design` là quyết định của người
  (`judgment`), cho phép gửi đúng bốn tệp của gói tới artifact riêng tư của tài khoản Claude, ghi
  `confirmed by Manh Phan on 2026-11-26`, và chỗ nhận là một artifact riêng tư; bước gửi của plugin đã cài, chạy khô, gửi đúng bốn tệp ấy tới chỗ ấy và nói phép
  đã có; và lần gửi cuối tới Claude Design ghi trạng thái `f1f0bbbc4e26` của gói, ngày 2026-11-27; mọi lần gửi đi tới một chỗ có phép. Lần gửi ở
  trạng thái cũ, phép không có chữ xác nhận, phép cho ba tệp, phép trỏ chỗ không riêng tư, một lần gửi tới chỗ không có phép,
  hay không có lần gửi nào làm phép đo đỏ.
- AC-5: Given HEAD, When đọc câu chờ, Then câu `default-claude-design` còn chờ chủ kho với hai lựa chọn có và không, không
  ghi câu trả lời nào, và sổ quyết định không có dòng cho nó. Một câu trả lời được ghi, câu chờ mất, hay sổ có dòng cho nó
  làm phép đo đỏ.
- AC-6: Given năm bản xuất ở HEAD, When quét, Then không có địa chỉ thư, số điện thoại (viết liền, có cách, từ 0 hay +84),
  khoá hay mã truy cập, hay đường dẫn trên máy (`/Users/`, `/home/`, `/private/tmp/`, `/var/folders/`). Mỗi dạng ấy chèn vào
  một bản xuất trên bản sao làm phép đo đỏ và gọi tên tệp.
- AC-7: Given nhánh, When kê tệp đổi từ chỗ nhánh rời `origin/main` tới HEAD, Then nhánh đổi năm bản xuất, sổ lần gửi,
  `design/decisions.yaml` và `design/theme.json` (chỉ thêm dòng), câu chờ, các dòng nhật ký wiki mới, hồ sơ này và design
  doc của nó, không gì khác — trừ `PRODUCT-MAP.md` và `LO-TRINH.html` khi mỗi trang đúng bằng bản bộ vẽ của kit vẽ lại từ hồ
  sơ ở HEAD. Nhánh đổi một tệp ngoài danh sách, bỏ một dòng của hai sổ, hay sửa một dòng nhật ký đã có làm phép đo đỏ.

## Coverage

Phủ theo tệp nhánh đổi và từng bên đọc chúng. Không quét không gian tiêu chí: dòng sổ `descope` «bỏ coverage-scan».

| Tệp, hoặc bên đọc | Tiêu chí, hoặc lý do ngoài phạm vi |
| --- | --- |
| `DESIGN.md` | AC-2 (đúng bằng sổ viết ra); AC-3 (40 màu); AC-6; AC-7 |
| Bốn tệp gói trong `design/export/system/` | AC-2; AC-3 (màu, kiểu chữ, bo góc, khoảng cách, linh kiện); AC-6; AC-7 |
| `design/decisions.yaml` (`design-exports`, `send-claude-design`) | AC-2 (cổng giữ bản xuất); AC-4 (phép gửi); AC-7 (chỉ thêm dòng) |
| `design/theme.json` (năm phép kiểm bản xuất) | AC-2; AC-7 (chỉ thêm dòng) |
| `design/export/pushed.json` | AC-4 |
| `design/waiting/default-claude-design.json` | AC-5 |
| Dòng nhật ký `wiki/log/` | AC-7 (chỉ dòng mới) |
| Cả kho sau khi gộp main | AC-1 |
| Trang Claude Design hiện gói | Ngoài phạm vi: ngoài kho, cần đăng nhập tài khoản chủ kho (Notes) |
| Cách `bring-out` và cổng của plugin làm việc | Ngoài phạm vi: có bài kiểm ở kho design-assembly; cổng tự chứng mỗi phép kiểm đỏ trên bản phá |

## Out of scope

- Trang Claude Design hiện gói ra sao, và mọi thứ làm ở Claude Design sau đó.
- Trả lời câu đặt hệ này làm mặc định ở Claude Design: của chủ kho.
- Sửa `tools/design-assembly/` hay hành vi của lệnh `bring-out`: việc của plugin.
- Mọi thay đổi giao diện, mã sản phẩm, mô hình dữ liệu hay luật sản phẩm.

## Notes

- Số ghim (26 quyết định, 41 phép kiểm, 2743 bài, 40 màu, 298 linh kiện, trạng thái `f1f0bbbc4e26`) đọc từ cây sau khi gộp
  main ở `fe9afc7f` và viết lại bản xuất. Gộp main lần nữa thì số linh kiện, số bài và trạng thái sổ có thể đổi: viết lại bản
  xuất, gửi lại theo phép, một dòng sổ `fix`, tiêu chí giữ nguyên nghĩa.
- Trạng thái sổ tính cả sổ linh kiện kho để ngoài git; phép đo AC-2 viết nó trên bản sao như `make check` làm.
- Phép đo AC-4 chạy bước gửi của plugin đã cài trên máy chủ kho (`/Users/manhphan/dev/design-assembly/plugins/design-assembly`);
  biến `DA_PLUGIN` trỏ chỗ khác khi chấm trên máy khác. Chạy khô không gửi và không ghi tệp.
- Mọi phép đo ở `rang/` suy gốc kho từ vị trí của chính tệp đo và in mã HEAD của cây đã đo, nên chấm từ bản chép bên ngoài đo
  đúng cây của bản chép. `rang/two-way.mjs` chạy 39 ca (đã chạy trước cổng).
- Trang Claude Design đã nhận bản 4 của artifact ngày 2026-11-27; máy không mở được trang vì cần đăng nhập, nên không chứng
  trang hiện gói đúng. Lần gửi đầu cho trang trống trong khi phía kho đo xanh. Trước khi ký Cổng Bằng chứng, chủ kho mở
  đường dẫn artifact và nhìn màu, chữ và linh kiện; thẻ ghi việc này chưa ai chứng cho tới khi chủ kho nói đã xem (dòng sổ
  `descope` «bỏ chứng trang Claude Design bằng máy»).
- Cổng Bằng chứng chỉ trình khi job `e2e` của PR đã xanh trên đúng commit đã chấm.
