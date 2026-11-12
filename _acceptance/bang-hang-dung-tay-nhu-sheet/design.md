# Bảng hàng dùng tay như Sheet — thiết kế (hàng 2a)

## Mục tiêu

Đầu chủ dùng Bảng hàng bằng tay như Sheet: đi giữa các ô bằng phím, bôi một vùng ô rồi chép sang Zalo hay Excel, bấm tiêu
đề để sắp xếp, lọc từng cột, nhóm dòng theo toà, ẩn hiện cột; sáu lối tắt trạng thái ở cột thứ hai của App Shell mở Bảng
hàng đã lọc đúng trạng thái. Lớp hai của «thói quen Sheet» (LUAT 2026-11-11 13:50Z): hàng 2 đã cho «đọc như Sheet», hàng 4,
5 sẽ cho «sửa như Sheet». Mọi hành vi nằm trong khuôn Lưới dùng chung (`DataRegion`), để màn Đã gửi (hàng 6) và mọi màn
Lưới sau có ngay, không viết riêng cho Bảng hàng.

## Cách dựng

Thang «Chọn trước, tạo sau» (quyết định 0023), từng phần:

| Nhu cầu | Bậc | Lấy từ đâu |
|---|---|---|
| Ô chọn, đi bằng phím, bôi vùng, chép | 1 — kho | `DataGridCellSelection` của lưới ReUI đã cài (mũi tên, Tab, Home, End, Ctrl+Home/End, PageUp/Down, Shift mở rộng, Ctrl+A, Esc, Ctrl+C ra chữ tách tab) |
| Bấm tiêu đề để sắp xếp | 1 — kho | `DataGridColumnHeader`: bấm tiêu đề mở menu Tăng dần · Giảm dần · Ghim (Hỏi-3) |
| Lọc từng cột | 1 — kho, xếp theo `data-grid-editing-6` | nút «Lọc» mở hàng lọc dưới tiêu đề như khối Quỹ hàng đã chọn; ô chữ là `Input`, cột giá trị là `DataGridColumnFilter` (chọn nhiều, có số đếm) |
| Ẩn hiện cột | 1 — kho, xếp theo `data-grid-editing-6` | nút «Cột» là `DataGridColumnVisibility` |
| Nhóm dòng theo toà | 2 — kho + ReUI Pro | kho chưa có dáng dòng nhóm: chủ kho chọn ở Hỏi-1 (`data-grid-grouping-2` hay `data-grid-grouping-1`); gập mở bằng `DataGridTableRowExpand` của lưới |
| Lối tắt trạng thái | 1 — kho | cột thứ hai của App Shell (hàng 1o) đã có sáu mục; nay mỗi mục trỏ `/inventory?status=<trạng thái>` |

Lọc, sắp xếp và nhóm là hàm thuần trên các dòng vùng đang giữ (`src/components/candidate/grid-view.ts`), như Quỹ hàng làm,
không gọi mạng. Bảng chỉ hiện kết quả (`manualSorting`, `manualFiltering`). Thứ tự áp: tìm và lọc → sắp xếp → nhóm; số dòng
đếm theo thứ tự đọc, liền qua các nhóm; dòng nhóm không có số.

Vùng của `data-grid-editing-6` lấy thêm ở hàng này (hàng 2 đã lấy khung, ô tìm, cột số dòng, chân bảng):

| Vùng của khối | Lấy / bỏ | Vì sao |
|---|---|---|
| Nút Lọc mở hàng lọc theo cột | lấy | «lọc từng cột» của câu giao |
| Nút Cột | lấy | «ẩn hiện cột» |
| Thanh gợi ý chọn ô ở chân | lấy, đổi chữ | chân bảng ghi «n ô đã chọn · Ctrl+C để chép» khi đang bôi vùng |
| Hoàn tác, làm lại | bỏ | chưa sửa (hàng 4) |
| Cài đặt | bỏ | chưa có việc |
| Xuất | bỏ nếu chủ kho đồng ý (Hỏi-4) | câu giao nói chép sang Zalo, Excel; Ctrl+A rồi chép đưa cả bảng sang Excel |
| Dòng tổng ở chân | bỏ | câu giao không có; Quỹ hàng chưa có số tổng cho căn |
| Ô chọn dòng, chữ cái tên cột | bỏ | không chọn dòng, không công thức |

## Từ Quỹ hàng

Nguồn chỉ đọc, không chép mã: kho Quỹ hàng commit `1729b11f`, `apps/web/src/app/(app)/inventory/` (`bang-hang.tsx`, `loc.ts`,
`bieu-thuc-so.ts`, `nhom.ts`, `cot.ts`, `thanh-cong-cu.tsx`, `goc-nhin.ts`), hồ sơ đã ký `_acceptance/bang-hang-kieu-sheet/`,
`_acceptance/bang-hang-danh-sach-chi-tiet/`, `docs/adr/0004-luoi-bang-hang.md`, `packages/core/src/listing/status.ts`,
`components/shell/second-column.tsx`; trang sổ bối cảnh `docs/tri-thuc/wiki/chu-de/bang-hang.md`.

| Thói quen | Quỹ hàng làm | Hàng này | Vì sao |
|---|---|---|---|
| Phím trong lưới | để nguyên lưới ReUI; Enter đi xuống hay mở sửa | giữ nguyên; Enter mở dòng khi màn có hồ sơ (hàng 3 nối), không thì đi xuống | khớp hàng 3 (tin K-1211-9) |
| Home, End | lỗi: ô chọn ra ngoài màn mà bảng không cuộn (Ngoài-3 của họ) | giữ, có bài đo bảng cuộn theo ở bốn khổ | bản ReUI đang cài đã cuộn theo; bài đo khoá lại |
| Bôi vùng, chép | chữ đang hiện («4,65 tỷ»), tách tab, không dòng tiêu đề, không cột số dòng | giữ y | dán sang Zalo, Excel đọc đúng |
| Sắp xếp | một cột, tăng → giảm → bỏ; ô trống luôn cuối; chữ so như người đọc tiếng Việt | giữ; trạng thái theo thứ tự trạng thái chứ không theo chữ cái | thứ tự trạng thái là một (dưới) |
| Lọc từng cột | chữ chứa, bỏ dấu; chọn MỘT giá trị; số theo luật `<=5`, `2-5`, «hoặc», «và»; giá theo tỷ; cộng dồn; «Xoá lọc» | giữ, nhưng cột giá trị chọn NHIỀU (bộ lọc ReUI có sẵn, như danh sách tích của Sheet); ngày lọc theo số ngày đã qua (Hỏi-2) | lối tắt trạng thái và Sheet đều cần chọn nhiều |
| Luật sai | ô đỏ, không lọc gì | giữ | không âm thầm mất dòng |
| Nhóm | Toà → Loại căn mặc định; dòng nhóm có nút gập, nhãn, «n căn»; đếm liền qua nhóm | chỉ Toà (dữ liệu mẫu chưa có loại căn); tắt khi mở màn; đếm liền | màn mở ra giữ đúng dáng hàng 2 đã ký |
| Ẩn hiện cột | menu tự viết; chỉ Mã căn không tắt được | dùng `DataGridColumnVisibility`; cột đầu (Căn) không tắt được | thành phần có sẵn |
| Ghim | lỗi: mục ghim trong menu đầu cột bấm không tác dụng (Ngoài-5) | ghim đổi được thật (trạng thái ghim không bị khoá cứng) | sửa đúng lỗi họ gặp |
| Giữ cách xem | chỉ trong phiên; «góc nhìn» lưu trên máy | chỉ trong phiên; không lưu máy | góc nhìn lưu bị cắt khỏi MVP (L7); luật kho chưa giữ dữ liệu trên máy |
| Lối tắt trạng thái | không có; cột Liên hệ dùng `?status=` | `/inventory?status=<StandardStatus>` | cùng tên tham số, khác màn |
| Thứ tự trạng thái | một nguồn trong lõi (Chưa đủ để rao, Đang bán, Đang giao dịch, Đã bán, Tạm ngừng, Ngừng hẳn), nhưng bộ lọc lại xếp theo chữ cái | một nguồn `STATUS_ORDER` = thứ tự nhãn trong `ontology/labels.yaml` (trùng thứ tự lõi Quỹ hàng), cột thứ hai và bộ lọc cùng đọc | «thứ tự trạng thái ở hai nơi là một» |
| Cuộn 5.000 dòng | sát ngưỡng 33,4 ms; từng sập React #185 | không đo ở hàng này (60 dòng mẫu) | đo ở hàng nối dữ liệu thật |

## Sống chung với hàng 3 (dãy D, hồ sơ căn cạnh bảng)

Đã thống nhất qua tin K-1211-9; thiết kế hàng 3 ghi cùng nội dung (`ho-so-can/design.md`, mục «Sống chung với hàng 2a»).

- Bấm chuột vào một ô chỉ chọn ô, như Sheet. Mở hồ sơ bằng bấm mã căn, hoặc Enter trên một ô của dòng: khuôn Lưới có đúng
  một lối «mở dòng» (`record` của `DataRegion`), Enter đi qua lối ấy; màn chưa nối hồ sơ thì Enter đi xuống ô dưới như Sheet.
  Hàng 4 sau này mới đổi Enter thành sửa ô ở cột sửa được.
- Hồ sơ mở: mũi tên vẫn đi ô trong lưới; «Trước», «Sau» của hồ sơ đi theo thứ tự đọc của bảng đang hiện (sau lọc, sắp, nhóm).
  Esc trong hồ sơ đóng hồ sơ (hàng 3); Esc trong lưới bỏ vùng chọn (hàng này).
- Hồ sơ chiếm chỗ: cột số dòng, Căn, Toà vẫn đứng yên, bảng cuộn ngang trong phần còn lại; không tự ẩn cột (bài học Quỹ hàng
  «chỉ còn 5 trong 15 cột»), người tự ẩn bằng nút Cột.
- Chia tệp: hàng 3 đổi khối bọc ngoài cùng của `data-region.tsx` và `record-panel.tsx`; hàng này đổi phần lưới bên trong.
  Hàng ký sau gộp nhánh chính về và chấm lại phần bị đụng.

## Vai × Màn

Như hàng 2: chưa có vai thật trong khung. Mọi thói quen ở đây là cách xem của người đang xem, không ghi gì, nên không đổi
quyền nào; Quản trị sàn vẫn thấy vùng «không đủ quyền» như bản khai vai.

## Ngoài phạm vi

Sửa trên ô (hàng 4), dán từ Excel (hàng 5), bảng thẻ điện thoại (hàng 2b), góc nhìn lưu và lọc theo dự án, phân khu (sau MVP
hoặc chờ chủ kho), kéo đổi thứ tự hay đổi rộng cột, dòng tổng, xuất tệp, đo 5.000 dòng.

<!-- <<<UX-SPEC-TEMPLATE -->
## Đặc tả UX

### 1. Luồng

- Suôn sẻ: cột thứ hai «Đang bán» → Bảng hàng mở với hàng lọc hiện, cột Trạng thái chọn «Đang bán», «24 / 60 dòng» → gõ
  `<=5` ở ô lọc Giá chào → bấm một ô, Shift+mũi tên bôi vùng → Ctrl+C → dán sang Zalo, Excel (điểm ra: ứng dụng khác).
- Suôn sẻ 2: «Nhóm theo Toà» → dòng nhóm «S1.01 · 6 dòng»… số dòng vẫn 1 đến 60 liền → gập một toà → bấm tiêu đề Giá chào,
  chọn Tăng dần → giá xếp tăng trong từng toà.
- Biên: lọc ra rỗng → trạng thái «Không có dòng nào khớp» với «Xoá lọc»; luật số gõ sai → ô lọc báo đỏ, không lọc gì;
  `?status=` lạ → bảng không lọc; ẩn cột Toà khi đang nhóm → nhãn nhóm sang cột đầu còn hiện.
- Lỗi & quay lại: «Xoá lọc» ở thanh công cụ trả về đủ dòng; bấm lại «Nhóm theo Toà» bỏ nhóm; bấm «Tất cả hàng» bỏ lọc trạng thái.

### 2. Kiểm kê màn

| Màn | MỘT việc của màn | Vào từ / ra tới |
|---|---|---|
| Bảng hàng (`inventory`) | xem, lọc, chép danh sách căn như Sheet | từ cột thứ hai (Tất cả hàng, sáu lối tắt) / ra hồ sơ căn (hàng 3), ra ứng dụng khác qua chép |

### 3. Bảng trạng thái

<!-- <<<UX-STATE-TABLE -->
| Trạng thái | Màn | Hiển thị gì | Người làm gì tiếp |
|---|---|---|---|
| ST-inventory-mac-dinh | Bảng hàng | lưới như hàng 2, thanh công cụ thêm Lọc · Nhóm theo Toà · Cột | dùng phím, bấm tiêu đề, mở lọc |
| ST-inventory-loc-mo | Bảng hàng | hàng lọc dưới tiêu đề, mỗi cột một ô đúng kiểu; nút «Lọc (n)», «Xoá lọc», «n / 60 dòng» | gõ thêm luật, xoá lọc |
| ST-inventory-loi-tat | Bảng hàng | mở từ lối tắt: hàng lọc hiện, trạng thái đã chọn, lối tắt sáng ở cột thứ hai | lọc thêm, bỏ lọc |
| ST-inventory-luat-sai | Bảng hàng | ô lọc số viền đỏ, gợi ý cách gõ khi rê; bảng không lọc theo ô ấy | sửa luật |
| ST-inventory-khong-khop | Bảng hàng | «Không có dòng nào khớp» + «Xoá lọc» (trạng thái vùng có sẵn) | xoá lọc |
| ST-inventory-nhom | Bảng hàng | dòng nhóm: nút gập, tên toà, «n dòng»; số dòng liền qua nhóm | gập, mở, sắp trong nhóm |
| ST-inventory-chon-vung | Bảng hàng | vùng ô tô màu, chân «n ô đã chọn · Ctrl+C để chép» | chép, Esc bỏ chọn |
| ST-inventory-menu-cot | Bảng hàng | menu «Hiện cột» có tích, Căn không tắt được | tắt, bật cột |
<!-- UX-STATE-TABLE>>> -->

### 4. Hành vi

- Phím: mũi tên một ô; Tab, Shift+Tab sang ô kế, ở mép thì ra khỏi lưới; Home, End đầu, cuối dòng; Ctrl+Home, Ctrl+End góc
  bảng; PageUp, PageDown một khung; Shift cộng phím mở rộng vùng; Ctrl+A cả bảng; Esc bỏ vùng; ô chọn luôn nằm trọn trong
  khung (bảng cuộn theo, cả ngang ở 360 và 414).
- Bàn phím vào lưới bằng một điểm dừng (bảng mang vai `grid`, tên vùng), trước và sau khi trang chạy; nút tiêu đề, ô lọc,
  nút công cụ nằm trong thứ tự Tab.
- Khổ: bốn khổ 1440, 1024, 414, 360; ở 414, 360 thanh công cụ xuống dòng, lưới cuộn ngang trong vùng, ba cột đầu đứng yên.
- Hàng lọc mở thì mỗi cột rộng ít nhất 11 ký tự để gõ được luật ngắn.

### 5. Xuất xứ component

| Component | Nấc (dùng / ghép / mở rộng / tạo) | Vì sao (1 dòng) |
|---|---|---|
| DataRegion | mở rộng | khuôn Lưới của kho; mọi màn Lưới nhận thói quen Sheet cùng lúc |
| DataGridCellSelection, DataGridColumnHeader, DataGridColumnFilter, DataGridColumnVisibility, DataGridTableRowExpand | dùng | thành phần ReUI đã cài, giữ nguyên như nhà cung cấp giao |
| ColumnFilterCell | ghép | chọn ô lọc theo kiểu cột từ `Input` và `DataGridColumnFilter` |
| grid-view (lọc, sắp, nhóm, chữ chép) | tạo | luật thuần của kho, như Quỹ hàng tự viết; không thành phần nào giữ luật nghiệp vụ này |
| Dòng nhóm | ghép theo khối chủ kho chọn ở Hỏi-1 | kho chưa có dáng dòng nhóm |

### 6. Khuôn IA đã chọn + căn cứ

Khuôn IA: danh-sách-chi-tiết (master-detail)
Căn cứ: giữ khuôn của hàng 2 và hàng 3 (lưới, hồ sơ cạnh bảng); hàng này chỉ thêm thao tác trên danh sách, không thêm màn.

### 7. Thẻ việc

| Trường | Giá trị |
|---|---|
| Ai dùng | Đầu chủ giữ sổ hàng |
| Việc chính | xem, lọc và chép danh sách căn thay cho Sheet |
| Tần suất | mỗi ngày nhiều lần |
| Số bản ghi | hàng trăm trở lên |
| Thiết bị | máy tính |
<!-- UX-SPEC-TEMPLATE>>> -->
