# Lên đời công cụ design-assembly từ 0.7.1 lên 0.36.1, chỉ phần máy

Ngày 2026-11-22. Hồ sơ nghiệm thu: `_acceptance/upgrade-design-assembly-0-33-0/`. PR #107.

## Vì sao

- Chủ kho bảo kiểm và cài design-assembly ngày 2026-11-22. Kho này còn chạy công cụ 0.7.1 từ PR #86. PR #107 lên 0.33.0;
  cùng ngày phiên design-assembly đổi đích thành **0.36.1**, bản mang bản sửa cảnh báo CodeQL (PR
  phanlemanh/design-assembly#99).
- Lên đời giữ công cụ của kho cùng bản với plugin mà các phiên dùng để đọc và viết sổ thiết kế. Theo plugin, bản 0.33.0
  cũng sửa một giới hạn mà hồ sơ 0.7.1 đã ghi (Ngoài-3, Ngoài-10): khi lấy `main` trên bản sao nông, công cụ không còn
  ghi đè cách kết nối SSH của máy. Hồ sơ này không đo điều ấy (bản sao của nó lấy qua đường dẫn cục bộ); nó ở ngoài
  phạm vi.
- Lần này **chỉ phần máy**: không nhận quyết định thiết kế mới nào, không đổi hàng sổ, bảng màu, bài kiểm hay luật nào
  của kho.

## Thay đổi

Một commit, `26ab13af`, trên nhánh `chore/upgrade-design-assembly-0.33.0`, cắt từ `main` ở `6ce94d9f`. Sau đó nhánh
gộp `origin/main` (`dda3487e`) để chấm trên đúng cây sẽ vào `main`. Commit đổi 28 tệp:

- 26 tệp công cụ trong `tools/design-assembly/`: 8 tệp mới (bộ đọc phông, khoá phụ thuộc, bản dựng Next.js, công thức
  màu, phông chữ, sổ nguồn, dấu thao tác đã thấy trên màn, kiểu của nó), 18 tệp sửa. Thư mục có 42 tệp, mã cây
  `00d41ed8`, đúng mã mà sổ phát hành của plugin ghi cho 0.33.0.
- `design/tool-stamp.json`: `0.33.0`, cây `00d41ed8`.
- Một dòng nhật ký wiki ở `wiki/log/`.
- `mk/design-assembly.mk` đã bằng mẫu của 0.33.0 (mã `d67aeb30`), không phải chép.

## Đã thấy trước khi làm (bản chạy thử của phiên design-assembly)

- `upgrade` xem trước: 26 tệp công cụ và dấu phiên bản; không mục nào của sổ máy viết bị thêm, mất hay đổi; không quyết
  định nào đổi trạng thái; bước cổng xanh sau khi chạy.
- `make check` trên nhánh: xanh; cổng báo 19 quyết định giữ bởi 27 phép kiểm, 294 linh kiện, độ tất định 47/67.
- CI của PR: 9 job xanh, kể cả `e2e` và `e2e-db`. Đỏ: `gate` (chưa có hồ sơ này) và CodeQL.

## Lần chạy lại với 0.36.1

- Khi phiên design-assembly báo 0.36.1 đã cài trên máy (không sớm hơn), nhánh chạy `upgrade` xem trước. Bản xem trước
  phải chỉ kê tệp trong `tools/design-assembly/`, `design/tool-stamp.json`, `mk/design-assembly.mk` (từ 0.35.0, `upgrade`
  viết lại bước cổng khi khác mẫu, quyết định 0086 của design-assembly), không mục sổ máy viết nào thêm, mất hay đổi,
  không quyết định nào đổi trạng thái. Có gì khác thì vòng dừng và trình chủ kho.
- Chạy thật, một commit; một dòng nhật ký wiki. `make check` xanh với cùng 19/27 và 47/67.
- Ma trận của hồ sơ ghim các số của 0.36.1 (mã cây, số tệp, mã bước cổng, danh sách tệp của commit, lời hai hàng trên
  bản sao nông) kèm một dòng sổ `fix`. Tiêu chí không đổi nghĩa, nên không duyệt lại Cổng Phạm vi (Hỏi-2).

## Cảnh báo CodeQL ở `adapters/vite.mjs`

CodeQL báo một cảnh báo mức cao: «làm sạch nhiều ký tự chưa trọn» ở dòng bỏ chú thích HTML khỏi `index.html` trước khi
đọc thẻ `<script type="module">`. Cách đọc của phiên design-assembly: báo nhầm. Kết quả không được hiển thị ở đâu, và
một lượt quét trái sang phải khớp đúng cách trình duyệt kết thúc chú thích, nên bỏ chú thích lặp lại mới là sai. Bản
0.36.1 viết lại dòng ấy, cùng nghĩa.

Luật của vòng: không tắt cảnh báo, không sửa `tools/design-assembly/` bằng tay. Tới lần chạy lại, cảnh báo là một mục
đã biết của hợp đồng; job CodeQL của PR chứng nó hết sau lần chạy lại.

## Đo thế nào

Mọi phép đo nằm ở `rang/` của hồ sơ, suy gốc kho từ vị trí của chính tệp và in mã HEAD của cây đã đo, gọi bằng
`node _acceptance/upgrade-design-assembly-0-33-0/rang/<tệp>.mjs`, không
thêm khoá nào vào `_acceptance/config.yaml`. Dữ liệu chung ở `rang/matrix.mjs`. Mỗi phép đo có cặp hai chiều: xanh trên
vật lành, đỏ với thông điệp ghim trên bản phá.

- **`make check` xanh** trên cây đã gộp `main`, với dòng cổng, dòng linh kiện và số bài.
- **Dòng cổng và độ tất định**: công cụ in 19/27 và 47/67. Chiều đỏ: bản chép có `design/theme.json` thiếu một phép kiểm.
- **Cây công cụ, dấu phiên bản và bước cổng** bằng bản 0.36.1 mà plugin đã cài trên máy ghi trong sổ phát hành, và thư
  mục mẫu của plugin có đúng cây ấy. Đọc từ thư mục bản của plugin trong bộ nhớ đệm, không đọc kho design-assembly.
- **Không quyết định nào đổi trạng thái**: trên cùng sổ của kho, công cụ ở HEAD và công cụ 0.7.1 cho mỗi quyết định
  cùng trạng thái (held, claimed, not held…). Chiều đỏ: một phía đọc sổ có một quyết định mất phép kiểm.
- **Bản sao nông**: `make design-assembly` chạy riêng trên bản sao sâu 1 commit, `origin` có `main` ở chỗ nhánh rời
  `main`; hai hàng `decision-sheet` và `owner-calls` tự lấy `main` rồi xanh. Chiều đỏ: `origin` không có `main`.
- **Danh sách tệp** của hai commit lên đời và của cả nhánh so với `origin/main`.

## Luật lựa chọn

- Phép đo ở `rang/` của hồ sơ, không thêm gì vào `tools/` hay `mk/` (cách của các hồ sơ 0.7.0, 0.7.1).
- Lượt chấm tìm ra lỗi trong `tools/design-assembly/` thì không sửa tay và không sửa kho plugin: vòng dừng, trình chủ
  kho, báo phiên giao việc như lỗi của plugin.
- Hồ sơ không sửa hồ sơ đã ký nào. Phép đo cây công cụ của hồ sơ 0.7.1 (E8, E9, ghim 0.7.1) sẽ đỏ nếu ai ghim lại hồ sơ
  ấy sau khi gộp; tiêu chí cây công cụ của hồ sơ này thay chỗ nó, như chủ kho đã nhận ở hồ sơ 0.7.1.
- Không chạy `db/scripts/ci-thu.sh`: không tệp nào của commit chạm cơ sở dữ liệu, và job `e2e-db` của CI đã xanh.
- Ngoài phạm vi theo việc giao: dòng chú thích cũ về 0.7.2 trong `Makefile`, và việc nhận 14 quyết định mà bản kiểm kê
  nói có bằng chứng nhưng chưa có con trỏ.

## Nền hạ tầng lúc mở vòng

Đợt điều phối `nen` đang nghỉ, móc chặn lượt nền và lượt chấm của mọi phiên đứng trong thư mục kho. Theo lệ ngày 21–22/11,
vòng chấm từ một bản chép nhánh bên ngoài kho nếu chủ kho cho (Hỏi-1 trên thẻ Cổng Phạm vi). Nền chạy ở đó trước lượt
chấm đầu.
