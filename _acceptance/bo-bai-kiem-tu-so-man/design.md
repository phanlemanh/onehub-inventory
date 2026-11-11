# Bộ bài kiểm sinh từ sổ màn — thiết kế (hàng 1f)

Ngày: 2026-11-11 · Hạng T3 (chạm `tools/`) · Ô Cổng Đáng: `_acceptance/bo-bai-kiem-tu-so-man/opportunity.md` (build).

## Bài toán

Ở Quỹ hàng, 55% số lần làm lại nằm ở bài kiểm và hạ tầng (quyết định 0019). Mỗi màn mới hôm nay phải tự viết bài kiểm
trạng thái của mình, và bài viết tay để lại lỗ: hàng 1b ký với bốn lỗ trong `tests/e2e/grid.spec.ts` (bài chờ tải có thể treo
tới hết giờ, ca đối chứng của nó không chứng minh đỏ được, bài tìm không bắt được tìm bỏ sót dòng đúng, một bài đỏ giả khi
máy chậm). Hàng 1i để lại một lỗ cùng loại: bài kiểm thanh bên liệt bốn vai bằng tay.

Kết quả cần: thêm một màn vào sổ `design/screens.yaml` thì có bộ bài kiểm trạng thái mà không viết tay; phá từng trạng thái thì
bài kiểm tương ứng đỏ.

## Lối đã chọn

**Bài kiểm đọc sổ lúc chạy, không sinh tệp.** Một tệp kiểm trình duyệt `tests/e2e/screens/screens.spec.ts` đọc sổ màn và bản
khai vai mỗi lần chạy, rồi dựng bài cho từng màn từ các công thức trạng thái ở `tools/e2e_templates/`. Không có tệp sinh nào
để lệch khỏi sổ, nên không cần lệnh kiểm «đã sinh lại chưa».

- Đọc sổ bằng đúng bộ đọc của hàng 1d (`tools/coverage_matrix/registry.py`, qua một cầu nhỏ in JSON ở
  `tools/e2e_templates/register.py`). Sổ sai thì bộ đọc báo lỗi và tệp kiểm đỏ ngay, kèm lỗi ấy. Không viết bộ đọc YAML
  thứ hai. Tên màn hiển thị lấy từ `ontology/labels.yaml` qua cùng bộ đọc.
- Đường của sổ đổi được bằng biến môi trường (`SCREENS_ROOT`), để bài kiểm của bộ sinh dựng sổ giả có thêm màn, thêm vai.

**Công thức trạng thái.** Mỗi trạng thái là một công thức gồm: cách đưa màn vào trạng thái, MỘT hàm kiểm, một hay nhiều cách
phá, và thông điệp ghim của hàm kiểm. Ca chính chạy «đưa vào + kiểm»; ca phá chạy «đưa vào + phá + đòi chính hàm kiểm ấy đỏ
với đúng thông điệp ghim». Ca phá không có hàm kiểm riêng, nên lỗ «đối chứng thử một bộ kiểm mà ca chính không dùng» của 1b
không dựng được. Một bài kiểm đơn vị của bộ công thức đọc cấu trúc này: công thức thiếu cách phá hay thiếu thông điệp là đỏ.

**Hai bộ.**

1. Bộ khung — mọi màn `status: built`, `audience` là `staff` hay `public`: mở được và tiêu đề `h1` đúng nhãn của màn · không
   cuộn ngang ở bốn khổ · không lỗi trên trình duyệt · axe không có vi phạm nặng ở sáng và tối. Mỗi bài có ca phá trên chính
   màn ấy. Luật riêng 12 của đợt («mỗi màn mới phải vào bài axe ở cả sáng và tối») thành tự động.
2. Bộ vùng — màn họ `grid`: bảy trạng thái vùng của `design/states.md` (chờ tải, trống, tìm không ra, lỗi, một phần hỏng,
   chữ dài, không đủ quyền), đưa vào bằng `?state=<kiểu>` như bản mẫu Lưới đang làm. Danh sách bảy trạng thái là ma trận
   viết trước: bài kiểm đơn vị đọc bảng của `design/states.md` và đỏ khi sổ trạng thái có một trạng thái vùng mà bộ công thức
   không có.

**Màn họ Lưới chưa có vùng.** Bảng hàng và Đã gửi hôm nay chỉ có đầu màn; vùng dựng ở hàng 2. Bộ công thức giữ một danh sách
cố định các màn Lưới được phép chưa có vùng, mỗi màn kèm lý do; bộ vùng của màn trong danh sách bỏ qua có tên. Màn Lưới khác
chưa có vùng thì đỏ gọi tên màn; màn trong danh sách mà đã có vùng thì đỏ «gỡ khỏi danh sách»; màn có bảng mà không qua vùng
dùng chung (dựng thẳng lưới ReUI) thì đỏ «lưới dựng ngoài khuôn». Không có đường lặng lẽ thoát bộ vùng (phản biện context
sạch, sổ quyết định dòng 12).

**Chứng minh công thức đỏ được ngay hôm nay.** Vì chưa màn thật nào có vùng, bộ vùng còn chạy trên bản mẫu Lưới
(`/proto/luoi-va-o-theo-kieu`, trang thử dành cho người phát triển) như một đích hiệu chuẩn: mọi ca chính và ca phá của bảy
công thức chạy ở đó mỗi lượt. Khi hàng 2 dựng vùng cho Bảng hàng, cùng các ca ấy tự chạy trên Bảng hàng.

**Màn không sinh bài.** Màn `planned` (chưa có trang) và màn `dev` (trang thử, đường có tham số) không có bộ khung; tệp kiểm in
một dòng nêu từng màn bị bỏ và vì sao, để không có màn nào im lặng rơi khỏi bộ.

## Bốn lỗ của 1b thành luật của công thức

| Lỗ | Luật trong công thức |
|---|---|
| Bài chờ tải có thể treo tới hết giờ | Mọi chờ trong hàm kiểm có hạn ngắn và thông điệp riêng; ca phá «khung chờ không bao giờ hiện» phải đỏ với thông điệp ghim trước 15 giây |
| Ca đối chứng chờ tải chưa chứng minh đỏ được | Ca phá đánh vào cơ chế thật — bỏ độ trễ của đồng hồ vùng (hẹn giờ chạy ngay) — và gọi đúng hàm kiểm của ca chính |
| Bài tìm không bắt được bỏ sót dòng đúng | Chuỗi tìm chọn sao cho khớp ít nhất hai dòng trên ít nhất hai trang; hàm kiểm so hai tập: tập dòng hiện sau khi tìm (qua mọi trang) bằng đúng tập dòng khớp tính từ toàn bộ dòng trước khi tìm; ca phá bỏ một dòng khớp, hay chỉ để lại trang đầu, thì đỏ «tìm bỏ sót dòng khớp» |
| Đỏ giả khi máy chậm | Bộ chạy (không phải công thức) mở trang, chờ bản truyền dòng đã thay và màn sẵn sàng tương tác rồi mới đưa cho công thức; cả bộ chạy lại dưới hãm CPU 4 lần vẫn xanh, và mỗi trang đo được là đã chậm thật (vòng tính cố định chậm ít nhất 2,5 lần) |

## Vai

Bộ sinh đọc danh sách vai từ `ontology/roles.yaml` (qua cùng bộ đọc), không liệt tay. Nhưng `make e2e` không có cơ sở dữ liệu
nên chưa đặt được vai vào trình duyệt, và bảng quyền (hàng 9a) chưa có, nên chưa có gì khác nhau giữa các vai để kiểm. Khuyến
nghị (Hỏi-1): tệp kiểm in bảng Vai × Màn từ bản khai với ô «chờ bảng quyền», và bài kiểm đơn vị chứng minh thêm vai thứ năm thì
bảng thêm cột — không chạy bài theo vai ở vòng này.

## Thời hạn và tốn kém

Bốn khổ × bốn màn × bộ khung, cộng bảy công thức ở đích hiệu chuẩn; ca phá chạy ở cả bốn khổ như ca chính (sổ quyết định
dòng 13). Mỗi bài trình duyệt mang thời hạn riêng đủ rộng (90 giây,
bài axe 240 giây như bài Lưới có sẵn); bài kiểm đơn vị gọi Python có hạn 60 giây.

## Ranh giới

Chạm: `tools/e2e_templates/**`, `tests/e2e/screens/**`, hồ sơ `_acceptance/bo-bai-kiem-tu-so-man/**`; thêm dòng ở
`_acceptance/config.yaml` (lệnh chấm) và `wiki/log.md`. Không sửa bài kiểm trình duyệt có sẵn của hàng khác (kể cả
`tests/e2e/grid.spec.ts` mang bốn lỗ: lỗ được đóng trong bộ mới, bài cũ giữ nguyên). Không sửa `src/`, sổ màn, bộ đọc của 1d.

Luật sản phẩm: không chạm SP-1, SP-3. SP-4 (phần nội bộ không ra trang khách): bộ khung chạy cả màn `public` khi có, nhưng
vòng này không thêm bài kiểm che dữ liệu — bài ấy thuộc hàng trang khách.

## Không làm

- Không chạy bài theo vai (Hỏi-1).
- Không trạng thái cần đường lưu thật hay đăng nhập: xung đột khi lưu, mất mạng khi lưu, phiên hết hạn, link hết hạn.
- Không sửa `tests/e2e/grid.spec.ts`, `tests/e2e/behavior.spec.ts` hay bài nào của hàng khác.
- Không thêm cách đưa màn thật vào trạng thái (`?state=`): đó là việc của màn khi nó dựng vùng (hàng 2).

## Đặc tả UX

Bỏ — vòng không dựng màn nào (sổ quyết định).
