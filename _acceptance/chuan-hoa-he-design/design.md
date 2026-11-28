# Thiết kế — chuan-hoa-he-design (VP11)

Việc phụ VP11 của đợt `dieu-phoi-nen`. Ghi lại và dựng điều chủ kho đã quyết ngày 27/11/2026 tại phiên «BH · Điều chỉnh UX
Bảng hàng», trên ảnh dựng: «Duyệt cả ba lối A» cho màu trạng thái, bấm ô và dòng, lọc. Phiên này KHÔNG hỏi lại điều đã
quyết. Nó tự trả lời các câu luật kho hay lời chủ kho đã trả lời (mục «Mười bảy câu»), và chỉ hỏi những câu phải nhìn mới
quyết, cộng một câu bắt buộc: Enter và phím cách đổi luật đã ký.

Nguồn: mục «VP11 «Chuẩn hoá hệ design»», «VP11 — đầu vào Cổng Phạm vi», «Chỗ trùng cần VP11 và 3h cùng giữ» của sổ đợt
(`LUAT.md`, G-2711-16, G-2811-15); bàn giao `bh-ban-giao-2026-11-27.md` (mục VP11) và trang
`chuan-hoa-he-design-2026-11-27.html` (ảnh 1–16, đã đóng dấu) ở thư mục ghi chú chung của giám sát. Dựng chồng lên nhánh
VP10 lát 1 (`feat/khung-luoi-va-ngan-chi-tiet` @a1aa19c6).

## Nguồn — lời chủ kho, nguyên văn

| Câu phiên BH hỏi | Lời chủ kho |
| ---------------- | ----------- |
| «Anh chọn «Duyệt cả ba» theo các lối A, hay «Chọn từng phần»?» | «Duyệt cả ba lối A» |

Ba phần đã duyệt (chép từ sổ đợt, mục VP11; lối B của cả ba phần không chọn):

1. **Màu trạng thái (A):** mỗi trạng thái một màu riêng, như nhau ở sáng và tối; «Chưa đủ để rao» thành xám; «Đang giao
   dịch» thành tím (hôm nay ở nền sáng `--info` = `--primary` nên trùng màu «Đã bán»); các trạng thái khác giữ màu; không
   ổ khoá ở chỗ trạng thái đã nói căn bị khoá; vai của Thành viên về trung tính; một bài kiểm đỏ khi hai trạng thái trùng
   màu.
2. **Bấm ô / dòng (A):** bấm là chọn ô; mã căn là liên kết thật; nút mở hiện ở ô số thứ tự khi rê; ngăn hồ sơ đi theo dòng
   đang chọn; ô sửa được hiện bút chì khi rê; bấm ra ngoài là lưu; Tuỳ chỉnh sửa ngay trong ô; điện thoại theo hàng 3d;
   **Enter là sửa, Space là mở hồ sơ** (như Airtable) — đổi luật đã ký của hàng 2a và 4.
3. **Lọc (A):** giữ hàng ô lọc dưới tiêu đề (2e); thêm dải «Đang lọc» bằng lời thường, có «Xoá tất cả»; tiêu đề cột đang
   lọc có dấu; mọi bộ lọc vào URL; lọc số đọc «Từ … đến …» có đơn vị; mọi ô lọc một chiều cao; câu «không có kết quả» nêu
   các bộ lọc đang bật; mục trạng thái ở cột thứ hai chỉ đổi cột của nó, giữ các lọc khác.

Điểm duyệt Bảng hàng B5 (màu trạng thái), B6 (ổ khoá lặp), B7 (ô lọc khó hiểu) thuộc việc này.

## Cắt lát — một Cổng Phạm vi cho mọi lát

Thứ tự theo G-2811-15: lát đầu chứa đúng những thứ hàng 3h cần để dựng nhịp ba (cách sửa trên ô và bảng màu trạng thái),
để 3h khỏi dựng hai lần. Hồ sơ này là lát 1; lát 2 và lát 3 là hồ sơ riêng dẫn nguyên văn câu trả lời ở cổng này.

| Lát | Hồ sơ | Gồm | Hạng | Vì sao tách |
| --- | ----- | --- | ---- | ----------- |
| 1 | `chuan-hoa-he-design` | màu trạng thái (trừ vai Thành viên), ổ khoá, Enter sửa / phím cách mở, bút chì khi rê, bấm ra ngoài là lưu, nền tối lớp nổi sáng hơn lưới nửa nấc (Hỏi-4), bộ trợ giúp bài trình duyệt mở sửa một ô | T2 | 3h đang chờ đúng những thứ này |
| 2 | `chuan-hoa-he-design-2` | mã căn là liên kết thật, nút mở ở ô số thứ tự, ngăn đi theo dòng đang chọn, Tuỳ chỉnh sửa trong ô, vai Thành viên trung tính | T3 (chạm `src/modules/identity/ui`) | không chặn 3h; cần cổng kế hoạch |
| 3 | `chuan-hoa-he-design-3` | cả phần lọc | T2 | lớn nhất, không chặn ai |

Lát 2 và 3 chạm cùng tệp với VP10 lát 2 (`data-region.tsx`, `region-header.tsx`): thứ tự giữa chúng do giám sát xếp.

## Từng chỗ và cách làm — lát 1

| Điều đã duyệt | Hôm nay | Sau | Chỗ làm |
| ------------- | ------- | --- | ------- |
| Màu: «Chưa đủ để rao» xám | cam (`warning-light`), trùng «Tạm ngừng» ở cả hai nền | xám (`invert-light`, như ảnh 2 và 5 đã duyệt) | `STATUS_TONE`, `src/lib/format/index.ts` |
| Màu: «Đang giao dịch» tím ở cả hai nền | `info-light`; nền sáng `--info` = `--onehub-blue` nên trùng «Đã bán», nền tối đã tím | `--info` đổi sang sắc tím chủ kho chọn ở Hỏi-2, như nhau ở hai nền; trong mã ứng dụng chỉ nhãn này đọc biến thể info (bài đơn vị giữ điều ấy) | `src/app/globals.css`, `src/styles/dark.css` |
| Màu: bốn trạng thái kia giữ | Đang bán xanh lá, Đã bán xanh thương hiệu, Tạm ngừng cam, Ngừng hẳn đỏ | không đổi | — |
| Màu: một nguồn cho mọi chỗ | lưới, thẻ điện thoại, ngăn chi tiết, lịch sử lần chào cùng đọc `STATUS_TONE` | giữ một nguồn; đổi một chỗ là đổi mọi chỗ | — |
| Màu: bài kiểm không hai trạng thái trùng màu | không có | bài đo màu hiện ra của sáu nhãn ở sáng và tối, đỏ khi hai trạng thái gần màu nhau; đỏ khi không tìm thấy nhãn nào | bài mới |
| Không ổ khoá ở chỗ trạng thái đã nói căn bị khoá | căn đã bán, ngừng hẳn: ổ khoá ở ô trạng thái, giá, phí, mọi cột riêng; hiện cả với người không quyền | không ổ khoá nào: hôm nay mọi khoá đều do trạng thái; lý do khoá vẫn có khi rê và cho trình đọc màn hình; ô vẫn không mở sửa | `typed-cell.tsx`, `lockedReasons` |
| Enter là sửa | Enter mở hồ sơ ở mọi ô (luật 2a, phân xử D-1211-19); F2, gõ, bấm đúp mở sửa | Enter trên ô sửa được mở sửa; trên ô không sửa được mở hồ sơ; màn không có hồ sơ vẫn đi xuống | `data-region.tsx` `onGridKeyDownCapture` |
| Space là mở hồ sơ | phím cách không làm gì | phím cách trên ô đang chọn mở hồ sơ dòng ấy, ở mọi ô; đang sửa thì gõ dấu cách | `data-region.tsx` |
| Bút chì khi rê | ô sửa được không có dấu gì | rê lên ô sửa được (người có quyền, dòng không khoá) thì hiện bút ở mép phải ô, có chữ gợi ý «Bấm Enter để đổi ô này» (chữ: máy chọn, chờ chủ kho veto, d-20261128T010409Z-56); ô khoá, ô không quyền không có | `data-region.tsx` (ô của lưới) |
| Bấm ra ngoài là lưu | bấm ra ngoài khung sửa là huỷ, mất chữ đã gõ | bấm ra ngoài là ghi như Enter (đọc lại, hỏi lại khi giá đổi quá 20 %, thông báo «Hoàn tác»); giá trị chưa hiểu thì khung ở lại và báo ở ô | `cell-editor.tsx` |
| Nền tối: lớp nổi sáng hơn lưới nửa nấc (Hỏi-4, chủ kho 2026-11-28) | trang 10, lưới 23, ngăn chi tiết 23: ngăn chỉ tách khỏi lưới bằng viền 1 px; trình đơn cùng màu lưới | ngăn chi tiết, trình đơn, hộp thoại, ô gợi ý sáng hơn lưới nửa nấc (nửa đường từ `neutral-900` tới `neutral-800`); dấu rê trong trình đơn vẫn sáng hơn nền trình đơn; nền sáng giữ như trước vòng | `src/styles/dark.css` (`--popover`) |
| Tín hiệu sẵn sàng chỉ bật khi lưới đã yên (giám sát đòi, G-2811-25 — chờ chủ kho veto) | lưới vẽ lại mọi ô ngay sau tín hiệu sẵn sàng: mất ô vừa bấm | tín hiệu chỉ bật khi lưới đã đo khung cuộn; cách sửa trên ô không dựng lại mỗi lần vẽ | `data-region.tsx` |
| Dấu «đã sửa» ở màn nhập tệp thôi dùng sắc info (máy chọn, chờ chủ kho veto) | `info-light`, nay là màu «Đang giao dịch» | `primary-light` — vẫn trùng «Đã bán»; hướng cho lát 2: badge `outline` vì «đã sửa» không phải trạng thái (giới hạn đã biết) | `src/modules/imports/ui/import-wizard.tsx` |
| Bộ trợ giúp cho 3h | mỗi bài tự mở sửa bằng F2 hay bấm đúp | một hàm dùng chung mở sửa một ô bằng Enter và trả khung sửa; đỏ có tên khi ô không mở sửa hay bộ chọn không khớp ô nào | `tests/e2e/support/` |
| Sổ hành vi | dòng «Sửa dữ liệu», «Phím trong lưới», «Chữ mở trong ô», «Ô không sửa được» theo luật cũ | đổi đúng lời chủ kho, có ngày 2026-11-27; ghi quyết định `wiki/decisions/0053-chuan-hoa-he-design.md` | `design/behaviors.md` |

### Đo màu trên màn thật (bước thiết kế, 28/11)

Màu chữ của nhãn đầu tiên mỗi trạng thái ở 1440, đo ΔE2000 từng cặp (15 cặp × 2 nền). Nền nhãn nhạt 10 % không tách được
cặp nào (cặp «Tạm ngừng» – «Ngừng hẳn» chủ kho bảo giữ chỉ 11,1), nên bài đo chữ nhãn. Ngưỡng 12 bắt đúng hai cặp hôm nay
trùng và để qua mọi cặp của bảng mới — trừ sắc tím trên ảnh 27/11 ở nền sáng.

| Cặp | Hôm nay sáng | Hôm nay tối | Tím ảnh 27/11 sáng | tối | Tím hồng sáng | tối |
| --- | --- | --- | --- | --- | --- | --- |
| «Chưa đủ để rao» – «Tạm ngừng» | 0,0 | 0,0 | 35,3 | 31,9 | 35,3 | 31,9 |
| «Đang giao dịch» – «Đã bán» | 9,4 | 16,0 | **10,4** | 16,0 | 20,4 | 30,1 |
| «Tạm ngừng» – «Ngừng hẳn» | 13,0 | 41,2 | 13,0 | 41,2 | 13,0 | 41,2 |
| «Đang giao dịch» – «Ngừng hẳn» | 42,3 | 35,9 | 42,6 | 35,9 | 36,1 | 31,0 |
| cặp thấp nhất còn lại | 11,1 | 18,1 | 34,0 | 31,9 | 34,0 | 31,0 |

Xanh thương hiệu (`#0246ff`) ngả tím, nên sắc tím trên ảnh chỉ cách nó 10,4 ở nền sáng — gần mức chủ kho gọi là trùng.
Tím hồng (fuchsia) cách 20,4 và 30,1. Chọn sắc là việc của chủ kho → Hỏi-2. Đổi `--info` thay vì thêm token: tìm khắp
`src` ngoài bộ kit, chỉ `STATUS_TONE` («Đang giao dịch») dùng biến thể info; trang khách không dùng; dấu «khác danh mục»
của 3h đã hẹn chọn màu khác.

Các hồ sơ đã ký có bài đổi kỳ vọng vì Enter thôi mở hồ sơ ở ô sửa được (dự kiến, S3 xác định danh sách đúng): 2a
`bang-hang-dung-tay-nhu-sheet`, 3 `ho-so-can`, 4 `sua-tren-o`, 3g `sua-thong-tin-can`. Mỗi hồ sơ một dòng «sửa sau ký» và
ghim lại một làn trước khi gộp, như VP10.
S3 xác định danh sách thật: **tám** hồ sơ đã ký mang dòng «sửa sau ký» của vòng này — `bang-hang-dung-tay-nhu-sheet`,
`dan-tu-excel`, `design-assembly-adopt-checks`, `hanh-vi-trong-luoi-khung`, `ho-so-can`, `khung-va-giao-dien`,
`luoi-va-o-theo-kieu`, `sua-tren-o`; `sua-thong-tin-can` không có bài nào đổi kỳ vọng.

## Mười bảy câu của bàn giao — máy trả lời 15, hỏi 2

| Mã | Câu | Trả lời | Căn cứ |
| -- | --- | ------- | ------ |
| M1 | Cột lựa chọn riêng của sàn có được tô màu? | Không: giữ chữ thường như hôm nay | Lời duyệt «vai của Thành viên về trung tính» (nhãn không mang màu trạng thái); ADR-0018 không mở cấu hình hiển thị cho sàn |
| M2 | Ổ khoá nào còn giữ? | Hôm nay mọi khoá trên lưới do trạng thái (`lockedReasons`), nên không ổ khoá nào; khoá trạng thái không giải thích (chưa có) thì một ổ khoá mỗi dòng | Lời duyệt «không ổ khoá ở chỗ trạng thái đã nói căn bị khoá»; khoá năm thuộc tính căn của 3h (AC-11) cũng theo trạng thái |
| M3 | Màu trạng thái ngoài lưới? | Mọi màn nội bộ đọc một bảng `STATUS_TONE`; trang khách theo luật ẩn (SP-4), vòng này không đụng | Luật một nguồn (AGENTS.md «Every business rule should live in exactly one place»); SP-4 |
| K1 | Bấm ra ngoài khi giá trị sai? | Khung ở lại, báo ở ô, như Enter với giá trị sai hôm nay | Luật hàng 4 «báo chưa hiểu»; bấm ra ngoài = Enter |
| K2 | Phím cách với ô có/không? | Phím cách luôn mở hồ sơ; ô có/không đổi bằng Enter mở sửa | Lời duyệt «Space là mở hồ sơ» không có ngoại lệ |
| K3 | Enter ở ô khoá hay không quyền? | Mở hồ sơ | Lời duyệt (trang 27/11): «Enter là sửa ô sửa được, còn ở ô khác thì mở chi tiết» |
| K4 | Enter ghi xong thì đứng yên hay xuống dòng? | Đứng yên trên ô vừa sửa, như luật đã ký | Luật hàng 4 «Enter ghi … đóng khung thì tiêu điểm về ô vừa sửa»; lời duyệt không đổi điều này |
| K5 | Ngăn đi theo dòng khi đang sửa dở? | Không xảy ra: sửa nhiều trường đi qua hộp thoại chặn lưới; ngăn đi theo dòng là lát 2 | `listing-details-edit.tsx` là hộp thoại |
| K6 | Hoàn tác sau khi bấm ra ngoài đã ghi? | Cùng thông báo «Hoàn tác» như Enter | Luật lưu và hoàn tác của hàng 4 |
| K7 | Máy không rê được (máy tính bảng)? | Bút chì hiện trên ô đang chọn; nút mở ở ô số thứ tự hiện trên dòng đang chọn (lát 2) | Không rê thì dấu chỉ-khi-rê không bao giờ hiện — chỉ một lối sống — máy chọn, chờ chủ kho veto (d-20261127T211358Z-17) |
| L1 | Tên người trong địa chỉ? | Lọc theo người dùng mã mờ, không dùng tên | Luật riêng tư của kho (không dữ liệu cá nhân trong tham số), lưu ý của G |
| L2 | Đường dẫn gửi người khác vai, có lọc cột họ không xem được? | Bỏ lọc ấy và hiện chip «không áp được» | Nguyên tắc «không biến mất câm» của chuẩn nút câu 2 |
| L3 | ⌘K làm gì với lọc đang có? | Giữ luật đã ký: về Bảng hàng ở cách xem ban đầu, mã điền ở cột Căn | Lời chủ kho ở hàng «lối vào hồ sơ» (`loi-vao-ho-so`, Cổng Phạm vi) |
| L4 | «Xoá tất cả» xoá gì? | Xoá ô lọc và trạng thái; giữ toà hay dự án đang chọn ở cột thứ hai và góc nhìn | Cột thứ hai là chỗ đang ở (hàng 2c, 2d), không phải lọc |
| L5 | Đơn vị khi thuê? | Đơn vị theo cột và loại tin (tỷ hay triệu); tính cả hai đầu | `formatMoney` đã chọn tỷ hay triệu; luật «giá theo tỷ» của 2e nói cho tin bán |
| L6 | Lọc chữ: chứa hay bằng? | Chứa, không dấu; cột lựa chọn «là một trong» | Luật 2e đã ký «chữ chứa không dấu, giá trị chọn nhiều» |
| L7 | Lối A trên điện thoại | Hỏi ở cổng: chủ kho chưa xem ảnh | Phải nhìn mới quyết |

Câu hỏi chủ kho ở Cổng Phạm vi (đủ ở `decisions.jsonl`, dòng `chi-nguoi`):

- **Hỏi-1 (bắt buộc):** «Enter là sửa, phím cách là mở hồ sơ» đổi luật đã ký của hàng 2a («Enter mở dòng khi màn có hồ
  sơ») và hàng 4, cùng phân xử D-1211-19 («Enter trên ô đang chọn cũng mở»). Khuyên: đổi như đã duyệt. Giữ luật cũ thì
  AC-4, AC-5 rơi khỏi lát 1 và bộ trợ giúp của 3h mở sửa bằng F2.
- **Hỏi-2:** «Đang giao dịch» tím nào — tím như ảnh 27/11 (cách «Đã bán» 10,4 ở nền sáng) hay tím hồng (20,4)? Cùng câu:
  bảng màu ở những chỗ chủ kho chưa thấy — ngăn chi tiết, lịch sử lần chào, thẻ điện thoại — sáng và tối. Khuyên: tím
  hồng, ngưỡng bài 12.
- **Hỏi-4 (giám sát thêm, G-2811-17):** ở nền tối, ngăn nổi và mọi lớp nổi (trình đơn, hộp thoại) cùng màu với lưới (độ
  sáng trang 10, lưới 23, ngăn 23), chỉ tách bằng viền 1 px. Nâng nửa nấc (`--popover` nền tối pha nửa giữa neutral-900 và
  neutral-800): ngăn 30, dấu rê trong trình đơn (neutral-800, 38) vẫn thấy. Nâng trọn nấc (neutral-800): ngăn 38 nhưng
  dấu rê trong trình đơn trùng nền, mất. Khuyên: nửa nấc. Nền sáng không đổi.
- **Hỏi-3 (lát 3):** dải «Đang lọc» trên điện thoại — chủ kho chưa xem ảnh. Khuyên: cùng chữ thường như máy tính, chip bỏ
  được từng cái, đặt dưới hàng công cụ.

<!-- <<<UX-SPEC-TEMPLATE -->
## Đặc tả UX

### 1. Luồng

- Suôn sẻ: Bảng hàng → chọn ô giá (rê thấy bút chì) → Enter → khung sửa trên ô, đọc lại «Hiểu là…» → bấm sang ô khác →
  giá được ghi, thông báo «Hoàn tác» (điểm ra: ô vừa bấm là ô đang chọn). Chọn ô bất kỳ → phím cách → ngăn chi tiết.
- Biên: người không có quyền sửa (không bút, Enter mở hồ sơ); căn đã bán (không ổ khoá, rê thấy lý do, Enter mở hồ sơ);
  Đã gửi (không ô sửa được: Enter và phím cách đều mở); màn không có hồ sơ (Enter đi xuống như cũ).
- Lỗi & quay lại: giá trị chưa hiểu → khung ở lại, dòng dưới ô báo chưa hiểu; Esc huỷ, tiêu điểm về ô.

### 2. Kiểm kê màn

| Màn | MỘT việc của màn | Vào từ / ra tới |
|---|---|---|
| Bảng hàng (inventory) | xem và sửa nhanh hàng của sàn trên lưới, mở chi tiết một căn | thanh biểu tượng, ⌘K / ngăn chi tiết |
| Đã gửi (sent) | xem các lần đã gửi, mở chi tiết | thanh biểu tượng / ngăn chi tiết |

### 3. Bảng trạng thái

<!-- <<<UX-STATE-TABLE -->
| Trạng thái | Màn | Hiển thị gì | Người làm gì tiếp |
|---|---|---|---|
| ST-inventory-o-chon | inventory | ô có viền chọn; ô sửa được có bút chì khi rê | Enter (sửa hay mở), phím cách (mở), gõ, F2 |
| ST-inventory-o-dang-sua | inventory | khung nhập trên ô, dòng «Hiểu là…» dưới ô | Enter, Tab, bấm ra ngoài (ghi), Esc (huỷ) |
| ST-inventory-o-chua-hieu | inventory | khung ở lại, dòng dưới ô báo chưa hiểu | sửa chữ, Esc |
| ST-inventory-o-khoa | inventory | chữ thường, không ổ khoá; rê thấy lý do | Enter hay phím cách mở hồ sơ |
| ST-inventory-nhan-trang-thai | inventory | sáu nhãn sáu màu ở lưới, thẻ điện thoại, ngăn chi tiết, như nhau ở sáng và tối | — |
| ST-sent-o-chon | sent | ô có viền chọn, không ô nào sửa trên ô | Enter hay phím cách mở chi tiết |
<!-- UX-STATE-TABLE>>> -->

### 4. Hành vi

- Phím: Enter trên ô sửa được mở sửa, trên ô khác mở hồ sơ; phím cách mở hồ sơ ở mọi ô; F2, gõ, bấm đúp mở sửa như cũ;
  Enter ghi và đứng yên; Tab ghi rồi sang ô kế; Esc huỷ; bấm ra ngoài ghi.
- Từ 768 px mới sửa trên ô (điện thoại theo hàng 3d, không đổi ở vòng này).
- Bút chì chỉ khi rê và chỉ với người có quyền; máy không rê được thì trên ô đang chọn.

### 5. Xuất xứ component

| Component | Nấc (dùng / ghép / mở rộng / tạo) | Vì sao (1 dòng) |
|---|---|---|
| `DataRegion` | mở rộng | cửa phím và ô của lưới dùng chung |
| `CellEditor` | mở rộng | bấm ra ngoài đi đường ghi thay vì huỷ |
| `TypedCell` | mở rộng | khoá do trạng thái không vẽ ổ khoá |
| `Badge` (ReUI) | dùng | đổi biến thể theo `STATUS_TONE`, không sửa tệp của bộ kit |

### 6. Khuôn IA đã chọn + căn cứ

Khuôn IA: danh-sách-chi-tiết (master-detail)
Căn cứ: quyết định 0024 và Bảng hàng đã dựng; vòng này không đổi bố cục, chỉ đổi phím, màu và cách sửa.

### 7. Thẻ việc

| Trường | Giá trị |
|---|---|
| Ai dùng | Đầu chủ, Đầu khách, Trưởng nhóm |
| Việc chính | sửa nhanh giá và trạng thái trên lưới, mở chi tiết một căn |
| Tần suất | mỗi ngày nhiều lần |
| Số bản ghi | hàng trăm trở lên |
| Thiết bị | máy tính |
<!-- UX-SPEC-TEMPLATE>>> -->

## Chỗ ảnh dựng ngày 27/11 chưa phủ

- Ngăn chi tiết, lịch sử lần chào và thẻ điện thoại ở màu mới: chủ kho chưa thấy (ảnh 1–9 chỉ có lưới và thẻ) → Hỏi-2.
- Enter, phím cách, bấm ra ngoài: phím không chụp được → Hỏi-1 nêu thẳng điều đổi; trang cổng có bản bấm được.
- Lối A trên điện thoại cho phần lọc → Hỏi-3.
