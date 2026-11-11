# Kế hoạch thi công — thang-chon-khoi-vao-cong

Thiết kế: `_acceptance/thang-chon-khoi-vao-cong/design.md`. Hợp đồng: `contract.md`. Làm tuần tự trong phiên (các việc cùng sửa
`check.py` và `proof-gate-0023.test.ts`; tệp bài của 1c `proof-gate.test.ts` không sửa byte nào, nên không chạy song song). Mỗi việc: bài kiểm đỏ trước, rồi mã, rồi bài xanh, rồi phá thử.
Kiểm từng việc bằng lệnh hẹp `npx vitest run tools/proof_gate --coverage.enabled=false`; `make check` một lần ở cuối.

| # | Việc | Tệp | Kiểm | Phục vụ | Độc lập |
| --- | --- | --- | --- | --- | --- |
| 1 | Bộ đọc: sổ khối (có sổ thì bật luật 0023), danh sách chuyển tiếp, danh sách khuôn bọc, `khuon_boc`, `approved_at`, mục `## Khuôn`, thư mục thành phần nhà cung cấp | `tools/proof_gate/model.py`, `chuyen-tiep.yaml`, `khuon-boc.yaml`, `design/so-khoi.yaml` | bài cũ vẫn xanh; kho thật xanh | E1, E5, E9 | không |
| 2 | Hai lớp luật và nấc trạng thái (ma trận 2 × 5) | `check.py`, `proof-gate-0023.test.ts` | bài «hai lớp luật» đỏ được | E1 | không |
| 3 | Bậc trong kho tra sổ khối | `check.py`, `proof-gate-0023.test.ts` | ca tự vòng, chưa nhập, không có; đối chứng | E2 | không |
| 4 | Sổ khối: kiểm từng dòng, trùng nhu cầu, chứng từ, ngày duyệt, nhập kho thiếu sổ | `check.py`, `proof-gate-0023.test.ts` | mười ca phá | E5 | không |
| 5 | Ứng viên ReUI kèm ảnh | `check.py`, `proof-gate-0023.test.ts` | mười ca phá, đối chứng theo mẫu | E3 | không |
| 6 | Vùng và Cách, cắt quá nửa | `check.py`, `proof-gate-0023.test.ts` | ma trận bỏ × cách | E4 | không |
| 7 | Từ Quỹ hàng, Họ | `check.py`, `proof-gate-0023.test.ts` | ca phá từng cột; ma trận ba lối | E6, E7 | không |
| 8 | Khuôn bọc | `model.py`, `check.py`, `proof-gate-0023.test.ts` | sáu ca của E8 | E8 | không |
| 9 | Khuôn tệp chứng minh: thêm mục mới, khối KHUON-BOC, thang ba bậc; bài khuôn điền qua lưới | `khuon-chung-minh.md`, `proof-gate-0023.test.ts` | bốn khối khuôn xanh, đổi tên mục thì đỏ | E9 | không |
| 10 | Luật giao diện: luật ba tầng, thang, thứ tự đọc Quỹ hàng, sổ khối | `.claude/skills/inventory-ui/SKILL.md` | bài «skill trỏ đúng» còn xanh | E10 | có |
| 11 | Kho thật: bài «thêm vòng luật 0023 thì đỏ», `--report` thêm số đếm | `proof-gate-0023.test.ts`, `check.py` | bài kho thật | E1, E9 | không |
| 12 | Chạy cổng mới chỉ đọc trên hồ sơ Bảng hàng của nhánh dãy K, liệt dòng sẽ đỏ kèm cách sửa (G-1111-20); `make check`; một dòng `wiki/log.md`; BÁO giám sát | — | `make check` xanh | tất cả | không |

Trình cho người, bằng tiếng sản phẩm: mười hai việc, làm lần lượt; cổng học thêm bảy điều, mỗi điều có bài kiểm đỏ được khi phá;
sổ khối mở rỗng; ba hồ sơ đang chạy đã qua Cổng Phạm vi giữ luật cũ; luật giao diện đổi dòng «chuyển thể chỉ đổi dữ liệu» thành
luật ba tầng.
