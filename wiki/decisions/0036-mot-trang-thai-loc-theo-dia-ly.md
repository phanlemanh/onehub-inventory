---
type: decision
title: Một trạng thái lọc cho cây địa lý và ô lọc của Bảng hàng
links:
  [
    src/modules/listings/ui/geo-tree.ts,
    src/modules/listings/ui/use-geo-place.ts,
    src/components/templates/app-shell/place-change.tsx,
    src/components/templates/app-shell/second-column.tsx,
    src/components/candidate/grid-view.ts,
    design/behaviors.md,
    _acceptance/bang-hang-theo-dia-ly/contract.md,
  ]
sources:
  [
    _acceptance/bang-hang-theo-dia-ly/decisions.jsonl,
    _acceptance/bang-hang-theo-dia-ly/cong-pham-vi.html,
  ]
---

# 0036 Một trạng thái lọc cho cây địa lý và ô lọc của Bảng hàng

## Status

Accepted, 2026-11-14, ở hàng 2d (Bảng hàng theo địa lý). Chủ kho duyệt Cổng Phạm vi với lối D và «giữ lọc khác».

## Context

Đầu chủ nghĩ theo dự án → phân khu → toà. Cột thứ hai của App Shell đã có lối tắt trạng thái (hàng 2a) và góc nhìn đã lưu
(hàng 2c); mục của nó là đường dẫn, bấm là mở trang lại từ đầu. Nếu chọn nơi cũng mở trang lại, lọc Trạng thái đang bật sẽ
mất, và cây với ô lọc Dự án, Toà sẽ là hai trạng thái có thể lệch nhau. Lọc chữ của lưới là «chứa chữ», nên lọc theo tên
«… Park 1» sẽ lấy cả «… Park 10».

## Decision

- Nhóm địa lý khai bằng khe `sections` của mục Bảng hàng như hàng 7e (mỗi dự án một nhóm, «Tất cả», phân khu lồng toà,
  toà); mục có `children` vẽ thành một danh sách con của chính mục cột thứ hai; không số đếm.
- Kênh `place-change` của App Shell thêm `pick`: màn đang mở nhận một mục tại chỗ. Bảng hàng nhận mục `?vung=` — chỉ thay
  lọc Dự án, Toà, giữ lọc khác, sắp xếp, nhóm, cột ẩn — thay vì mở trang lại.
- Chiều ngược: khi lọc Dự án, Toà lọc ra đúng tập dòng của một nơi (chọn hay gõ tay), lưới ghi `?vung=<nơi>` bằng
  `history.replaceState`; không trùng nơi nào thì bỏ. Góc nhìn đang mở thì không ghi. Cột thứ hai sáng mục theo địa chỉ như
  cũ; giữa hai mục cùng khớp bằng số tham số, mục sau sáng (nơi đứng sau trạng thái).
- Lưới dùng chung: danh sách tên trên cột chữ khớp trọn tên; chữ gõ tay vẫn «chứa chữ». Ô lọc chữ hiện danh sách nối «, ».

## Consequences

- Cây đọc chính các dòng bảng đã có và danh mục căn mẫu; không thêm lần đọc nào (SP-1, bài quét trong
  `tests/dia-ly.test.tsx`).
- Hạn chế đã biết, để hàng 10: hôm nay cây đọc dữ liệu mẫu, mọi sàn thấy cùng cây mẫu. Khi nối dữ liệu thật, cây phải
  dựng từ đúng các dòng bảng đọc cho sàn đang đăng nhập (qua `withCompany`, SP-1), không đọc riêng ở khung.
- Bấm mục khác của cùng màn («Tất cả hàng», lối tắt trạng thái) sau khi chọn nơi thì nơi bỏ đi, vùng mở lại theo lọc của
  địa chỉ mục ấy.
- Màn khác muốn nhận mục tại chỗ dùng cùng `pick`; không khai thì mục vẫn là đường dẫn như trước.
- Địa chỉ có thể còn `?status=` sau khi người đổi lọc Trạng thái bằng tay; tải lại thì lối tắt áp lại. Chưa sửa ở hàng này.
