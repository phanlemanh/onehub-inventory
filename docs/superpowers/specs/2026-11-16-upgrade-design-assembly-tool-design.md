# Lên đời công cụ design-assembly bằng lệnh upgrade của plugin

Ngày 2026-11-16. Hồ sơ nghiệm thu: `_acceptance/upgrade-design-assembly-tool/`.

## Vì sao

- Ngày 2026-11-16 chủ kho cho phép lên đời kho này bằng lệnh `upgrade` của plugin design-assembly, trên nhánh riêng, kèm
  hồ sơ nghiệm thu để duyệt và ký.
- Đây là mục 1.4 trong kế hoạch của kho design-assembly: kho đã nhận plugin phải nhận được hai bản sửa còn nợ bằng chính
  đường lên đời của plugin, không chép tay.
- Lần chép tay ngày 2026-11-15 (hồ sơ `refresh-design-assembly-tool`) để lại một hạn chế đã biết, Ngoài-3: sổ linh kiện
  không còn ghi «dựng từ» cho hai linh kiện bộ lọc. Bản 0.1.0 của plugin đọc được linh kiện một tệp gom nhập vào rồi xuất
  lại, nên ghi lại được quan hệ ấy.
- Kho chưa ghi mình đang chạy bản công cụ nào. Lần lên đời sau không nói được bản chép đến từ đâu, hay có bị sửa tay ở đây
  không.

## Thay đổi

Một commit trên nhánh `chore/upgrade-design-assembly`, `158cf51`, cắt từ `main` ở `b6f4f29`. Lệnh `upgrade` của plugin
bản 0.1.0 viết đúng tám tệp:

- **Sáu tệp công cụ trong `tools/design-assembly/`:**
  - Bộ đọc linh kiện vẽ được linh kiện mà tệp nhập vào rồi xuất lại.
  - Lint của kho được hỏi qua tệp thay vì qua đường ống, có giới hạn 120 giây.
  - Lệnh kiểm, sổ token và sổ cột có thêm một hàm cho bản xem trước của lệnh upgrade hỏi mà không ghi gì.
- **Sổ linh kiện:** thêm ba mục «dựng từ». Bộ lọc dựng từ bộ lọc nâng cao. Hàng lọc dựng từ ô lọc và bộ dựng lọc.
- **Dấu phiên bản mới:** `design/tool-stamp.json` ghi phiên bản 0.1.0 và mã cây của thư mục công cụ.

Lệnh không ghi stylesheet, `design/theme.json`, `design/tokens.json`, dòng sổ nào do người viết, hay bước cổng
`mk/design-assembly.mk`.

## Đã thấy trước khi làm

- **Bản xem trước khớp lần xem trước ngày 2026-11-15:**
  - sáu tệp công cụ đổi;
  - sổ linh kiện được thêm ba mục và không mất mục nào;
  - không quyết định nào đổi trạng thái;
  - phần design-assembly của cổng vẫn xanh.
- **Nhánh vừa tạo, chưa cài thư viện:** bản xem trước báo sổ token sẽ mất 37 mục và cổng sẽ đỏ, rồi dừng mà không ghi gì.
  - Nguyên nhân: stylesheet nhập bảng màu của Tailwind từ thư mục thư viện, thư mục này chưa có.
  - Cài thư viện bằng `make setup` xong thì bản xem trước sạch.
  - Lệnh dừng đúng lúc, nhưng lời báo đổ cho sổ token chứ không chỉ ra là thiếu thư viện. Chỗ này đã ghi ở sổ giới hạn
    của plugin, kho design-assembly, dòng `upgrade-blames-ledger-for-missing-dependencies`; sửa nó là việc của kho ấy.
- **Số quyết định máy giữ, «16 hay 18»:**
  - Lần đo ngày 2026-11-14 đếm 18.
  - Một dòng chênh là thang khoảng cách. Hồ sơ `adopt-design-assembly` gỡ có chủ ý phép kiểm lint của nó ngày 2026-11-15
    (commit `ca48707`), vì luật lint của kho không chặn được đoạn mã phạm nào.
  - Dòng chênh kia là sổ linh kiện. Nó lệch mã cho tới khi lên đời, và lên đời sửa nó.
  - Sau lên đời, công cụ của kho giữ 17 quyết định bằng 20 lệnh kiểm. Không có hồi quy ẩn.

## Đo thế nào

Hồ sơ chấm kết quả lệnh để lại, không chấm cách lệnh chạy. Hành vi của lệnh có bài kiểm ở kho design-assembly.

- **Cổng của kho, AC-1:** `make check` xanh, với đúng dòng 17 quyết định và dòng sổ linh kiện khớp mã.
- **Công cụ đúng bản, AC-2:**
  - Mã cây git của thư mục công cụ bằng mã plugin ghi cho bản 0.1.0 trong sổ phát hành của nó (`releases.json`, cột
    `tool`).
  - Dấu phiên bản ghi cùng phiên bản và cùng mã.
- **Sổ linh kiện, AC-3:** so với sổ trên `main` trước khi lên đời, đúng ba mục «dựng từ» được thêm, không linh kiện nào đến
  hay đi, không trường nào khác đổi.
- **Phạm vi của commit, AC-4:** commit lên đời đổi đúng tám tệp. Commit được ghim theo mã, nên phép đo vẫn đọc như vậy sau
  khi gộp.
- **Phạm vi của cả nhánh, AC-6:** từ chỗ rời `main` tới HEAD, nhánh chỉ đổi tám tệp ấy và tệp của chính hồ sơ.
- **Nguồn của mã cây ghim:** phép đo đọc sổ phát hành của plugin ở commit `34a7938` của kho design-assembly, nơi lệnh
  upgrade chạy từ đó, để hằng số không chỉ là con số chép từ nhánh.
- **Lỗi lượt chấm tìm ra ở công cụ:** không sửa tay trên nhánh, vì AC-2 ghim mã cây của bản 0.1.0. Lỗi ấy sửa ở plugin,
  ra bản mới, rồi lên đời lại; lỗi ở phép đo của hồ sơ thì sửa trong `rang/`.
- **Bên đọc sổ linh kiện, AC-5:** bài kiểm sổ linh kiện và cổng chứng minh màn vẫn đạt.

Mỗi phép đo mới có cặp hai chiều trong `rang/measures-two-way.mjs`: xanh trên kho, đỏ với thông điệp ghim trên một bản sao
bị phá.

## Hệ quả đã biết

- **Hồ sơ `refresh-design-assembly-tool`:** phép đo «khớp plugin ở feea58d» của nó sẽ đỏ nếu ai ghim lại hồ sơ đó sau khi
  nhánh này gộp. Chính hồ sơ ấy đã ghi trước điều này. Phép đo cây công cụ của hồ sơ này (E2) thay chỗ nó. Hồ sơ đã ký
  không bị sửa.
- **Không gì canh cây công cụ sau khi gộp:** không phép kiểm thường trực nào ở kho này giữ thư mục công cụ trùng với dấu
  phiên bản. Đây là câu hỏi cho chủ kho ở Cổng Phạm vi (Hỏi-1 trên thẻ); máy khuyên nhận rủi ro tới lần lên đời sau.
  - Lệnh `status` và `upgrade` của plugin đọc dấu ấy khi được gọi.
  - Bước cổng mới của plugin, có canh phiên bản, chưa được chép sang, vì lệnh upgrade không ghi bước cổng (giới hạn
    `upgrade-leaves-gate-step` của plugin).
