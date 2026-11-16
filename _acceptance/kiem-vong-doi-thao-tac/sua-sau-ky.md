# 1t · Sửa sau chữ ký

Hàng 1t đã gộp vào nhánh chính (PR #68). Khi hàng 19 (Thuế phí, PR #64) gộp nhánh chính, phép kiểm vòng đời đỏ hai ô
của thực thể mới `FeeItem`: «thêm» và «gỡ». Ở phần Thuế phí, thêm và bỏ khoản riêng đều nằm trong một lần Lưu cả bảng
(thao tác `setFeeSchedule`, loại sửa), không có thao tác thêm hay xoá riêng; ô «không» sẽ nói sai vì tính năng có thật.
Giám sát phán N-1511-3 (theo Quyền, lần năm): thêm một dạng ô mới ngay trong PR #64.

## Đã đổi, giám sát cho

| Chỗ | Người dùng thấy khác gì | Phép |
| --- | --- | --- |
| Dạng ô «qua lưu cả bảng» cho ô thêm và gỡ: `{ co: <thao tác>, qua_luu: true, ly_do: "…" }` (`tools/coverage_matrix/lifecycle.py`). Hợp lệ khi đủ bốn điều: thao tác là loại sửa và chính là thao tác ở ô sửa của cùng thực thể; có lý do; vẫn là nút bảng nút biết trên màn hiện thực thể; báo cáo in các ô này thành nhóm riêng «Qua lưu cả bảng». Thiếu một điều thì đỏ, câu đỏ nói ô nào thiếu gì. Ô `co` thường giữ luật cũ. | Không: đây là cách phép kiểm đọc sổ | XONG N-1511-3 |
| `FeeItem` khai vòng đời (`ontology/entities/FeeItem.yaml`): thêm và gỡ qua lưu cả bảng bằng `setFeeSchedule`, xem bằng `readFeeSchedule`, sửa bằng `setFeeSchedule`; màn «Tuỳ chỉnh của sàn» khai hiện `FeeItem` (`design/screens.yaml`). | Không | XONG N-1511-3 |
| Bài kiểm (`tests/vong-doi-thao-tac.test.ts`, mục `qua-luu-ca-bang`): ca xanh của `FeeItem` và nhóm riêng trong báo cáo; bốn ca phá đều đỏ — thao tác loại sửa nhưng khác ô sửa, thiếu lý do, không có nút trên màn, dùng `qua_luu` ở ô xem hay ô sửa; một ca đối chứng: bỏ `qua_luu` thì luật loại của ô `co` thường áp lại. Bảng ô đã duyệt thêm bốn ô của `FeeItem` (55 → 59), màn «Tuỳ chỉnh của sàn» đọc thêm `FeeItem`. | Không | XONG N-1511-3 |

Trang quyết định 0038 đã duyệt không đổi. Chủ kho soi bốn ô của `FeeItem` ở Cổng Bằng chứng của hàng 19.
