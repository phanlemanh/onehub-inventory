# Thiết kế: số đo mỗi vòng giao diện (hàng 1h)

Hồ sơ: `_acceptance/so-do-moi-vong/`. Căn cứ: quyết định 0019 (`wiki/decisions/0019-measurable-design-system-pilot.md`), bảng
«Làm lại vì gì» và phép đo ba tác tử của Quỹ hàng (`onehub-quy-hang` `docs/plan/ma-tran-kiem-ke-design-claude-code.md`).

## Vấn đề

Đợt `nen` là đợt chạy thật cho kit. Muốn biết các hàng 1c, 1e, 1f, 1g có làm agent bớt làm lại hay không thì mỗi vòng giao diện
phải để lại số, số phải gộp được theo tầng, và phải có một mốc đo trước khi khung của hàng 1a gộp. Hiện kho chỉ có một tỉ lệ
chung trong `tools/design_check.py` (quyết định có kiểm trên mọi quyết định), và tỉ lệ đó che mất tầng hành vi.

## Ba phần

### 1. Bản số đo của một vòng

Lệnh `python3 tools/round_metrics/round_metrics.py ghi --slug <slug> [--phan r<N>=<tầng>[,<tầng>]]...` đọc sổ chạy
`_acceptance/<slug>/run-log.jsonl` của kit và ghi `_acceptance/<slug>/so-do-vong.json`:

- số lượt chấm: số lượt khác nhau trong các dòng `round-tally`;
- kết quả từng lượt: `verdict` của dòng `round-tally` cuối cùng của lượt đó;
- đơn vị làm lại: mỗi lượt có kết quả `REJECT` nhân với mỗi tầng agent khai cho lượt đó; lượt `BLOCKED` tự tính một đơn vị tầng
  `bai-kiem-ha-tang`; mỗi dòng `repin-do` (ghim lại đỏ) cũng tự tính một đơn vị tầng đó;
- số đếm theo từng tầng, đủ 11 khoá kể cả khoá bằng 0;
- `chua_phan`: các lượt `REJECT` chưa được khai tầng;
- số vật, số thước và số nhát sửa thước từ dòng `thuoc-vat` cuối; giờ máy, giờ chờ và phần trăm hạn mức tuần từ dòng `gio-may`
  cuối (vắng thì `null`).

Chạy lại lệnh thì giữ tầng đã khai của các lượt cũ. Tầng ngoài danh sách, hay `--phan` cho một lượt không phải `REJECT`, thì lệnh
thoát 1, không ghi tệp.

Kết quả của một lượt là `verdict` của dòng `round-tally` CUỐI của lượt đó: lượt có dòng `REJECT` rồi dòng `PASS` (chấm lại cùng
lượt) không tính làm lại; `PASS` và `PENDING-JUDGMENT` không tính làm lại.

Mười một tầng là đúng 11 lý do của bảng Quỹ hàng, để đặt cạnh mốc: `bai-kiem-ha-tang`, `trang-thai-hanh-vi`, `du-lieu-api`,
`nghiep-vu`, `thanh-phan`, `bo-cuc`, `hop-dong-yeu-cau`, `link`, `chu-dinh-dang`, `mau-token`, `truy-cap`. Chọn khung này là câu
hỏi cho chủ kho ở Cổng Phạm vi (Hỏi trong sổ quyết định).

Bảng nối hàng với tầng nó nhắm giảm, để đọc báo cáo sau 10 vòng:

| Hàng                                 | Tầng nhắm giảm         |
| ------------------------------------ | ---------------------- |
| `1c` cổng chứng minh có màn mẫu      | `bo-cuc`, `thanh-phan` |
| `1e` hành vi nằm trong Lưới và khung | `trang-thai-hanh-vi`   |
| `1f` bộ bài kiểm sinh từ sổ màn      | `bai-kiem-ha-tang`     |
| `1g` danh mục ReUI máy đọc được      | `thanh-phan`           |

### 2. Lưới «thiếu bản số đo thì đỏ»

Lệnh `round_metrics.py kiem` duyệt mọi `_acceptance/*/contract.md`. Vòng giao diện là hồ sơ có `ui`, `web` hay `web-ui` trong
`surfaces`, hoặc có `design-pass.md`. Vòng giao diện có trạng thái `verified`, `machine-cleared`, `signed-off` hay
`da-cham-boi-thuc-te` thì phải có bản số đo hợp lệ: đủ 11 tầng, `chua_phan` rỗng, số lượt chấm bằng số lượt trong sổ chạy hiện
tại. Thiếu thì đỏ và in đúng lệnh `ghi` cần chạy.

Không có danh sách miễn: lúc thiết kế, kho không có hồ sơ giao diện nào đã qua lượt chấm (chỉ có `go-hoi-khi-gop`, mặt
`config`), nên luật áp từ vòng đầu. Một vòng giao diện của dãy khác sang `verified` trước khi hàng này gộp thì tự ghi bản số đo
bằng lệnh `ghi` (lệnh đọc sổ chạy, không cần đoán), không thêm ngoại lệ.

Bài `tools/round_metrics/round-metrics.test.ts` chạy `kiem` trên chính kho, nên lưới nằm trong `make test`, `make check` và CI.
Hàng không sửa Makefile, `mk/` hay `_acceptance/config.yaml` vì các tệp đó ngoài ranh giới của hàng.

### 3. Báo cáo gộp theo tầng

Lệnh `round_metrics.py gop [--json]` in ba khối:

1. **Làm lại theo tầng**: mỗi tầng một dòng gồm số đơn vị, phần trăm trên mọi đơn vị, phần trăm trên phần có đổi sản phẩm (bỏ
   `bai-kiem-ha-tang` và `hop-dong-yeu-cau`, như bảng Quỹ hàng), và phần trăm của Quỹ hàng đọc từ
   `docs/plan/do-he-design/moc-quy-hang.json`. Đầu khối ghi số vòng và số lượt chấm trung bình.
2. **Quyết định có kiểm theo tầng** của `design/decisions.yaml`: mỗi tầng ghi số quyết định có kiểm trên tổng, đếm bằng hàm
   `check_problem` của `tools/design_check.py`. Tổng các tầng bằng tỉ lệ chung mà `design_check` in.
3. **Mốc ba agent** mới nhất: số quyết định giống, giống mang lỗi, lệch, và số quyết định tự đoán của từng agent.

### 4. Mốc đối chứng

Đề bài cố định ở `de-bai-ba-agent.md`. Lần đo đầu nằm ở `moc-2026-11-11/`: ba phương án `agent-1.md` đến `agent-3.md`, bảng so
`so-sanh.md` do một agent thứ tư lập, và `moc.json` (commit của bản kho đã đọc, đường bản kho, ba agent, đường tệp, số đếm). Mỗi
tệp `agent-N.md` chép nguyên văn câu đã gửi cho agent, rút máy từ bản ghi của agent chứ không gõ lại.

Lệnh `round_metrics.py kiem-moc` kiểm `moc.json`:

- đủ ba agent với ba tệp phương án khác nhau và không rỗng, có bảng so;
- câu đã gửi trong mỗi `agent-N.md` bằng đúng câu giao của `de-bai-ba-agent.md` sau khi thay `<bản kho>` bằng đường bản kho của
  `moc.json`, và ba câu bằng nhau;
- commit có thật; ở commit đó hồ sơ `khung-va-giao-dien` chưa có hoặc chưa qua Cổng Bằng chứng; và thư mục mốc
  `docs/plan/do-he-design/moc-*/` chưa có ở commit đó (bản kho agent đọc là một worktree sạch tại commit, nên không agent nào đọc
  được phương án của agent khác).

CI chạy `make check` trên bản lấy nông (độ sâu 1), không có commit cũ. Khi kho nông và thiếu commit, `kiem-moc` in
`kho nong: bo qua kiem lich su git` và chỉ bỏ ba điều kiện cần lịch sử; mọi điều kiện khác vẫn kiểm. Ở máy, kho đủ lịch sử nên kiểm
đủ. Bài vitest chạy `kiem-moc` trên chính kho.

## Không làm

- Không ghi bản số đo ngược cho hồ sơ đã có, không đo các vòng ở Quỹ hàng.
- Không sửa `tools/design_check.py`: báo cáo theo tầng nhập hàm của nó.
- Không gửi số về kit trong vòng này: báo về issue 490 là việc sau 10 vòng.
- Không có giao diện: các lệnh in chữ và JSON.

## Rủi ro đã biết

- Đơn vị làm lại đếm theo lượt chấm và tầng agent khai, khác cách Quỹ hàng đếm (một agent đọc bản ghi). So với Quỹ hàng chỉ có
  nghĩa ở tỉ lệ theo tầng. Đây là câu hỏi cho chủ kho ở Cổng Phạm vi.
- Tầng do agent khai, nên có thể khai sai. Lưới chỉ kiểm có khai, không kiểm đúng.
- Lưới chạy trong bài kiểm nên lỗi hiện dưới tên bài kiểm. Muốn một bước make riêng thì gửi yêu cầu sửa `mk/design.mk`.
