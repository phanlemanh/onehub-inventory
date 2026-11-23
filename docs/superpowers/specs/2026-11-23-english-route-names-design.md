# Địa chỉ tiếng Anh cho màn Tuỳ chỉnh của sàn và bản mẫu bộ nút

Hồ sơ: `_acceptance/english-route-names/` · hạng T3 · 23/11/2026

## Vì sao

`AGENTS.md` đòi mã, định danh và tên tệp bằng tiếng Anh. Hai địa chỉ của ứng dụng phạm luật ấy: `/tuy-chinh-san` (hàng 7e)
và bản mẫu `/proto/bo-nut-theo-quyen` (hàng 9e). Không trang quyết định nào chọn địa chỉ tiếng Việt; API của cùng màn đã là
`/api/v1/company-layer/...`. MVP chưa tới UAT, nên đổi bây giờ không làm ai mất địa chỉ đã lưu.

## Đổi gì

| Cũ                                                                                  | Mới                                                                                    |
| ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| thư mục tuyến `src/app/(app)/tuy-chinh-san/`                                        | `src/app/(app)/company-layer/`                                                         |
| `?phan=nhan` · `truong` · `tu-dien` · `can-cho` · `mau` · `thue-phi`                | `?part=labels` · `fields` · `aliases` · `pending-units` · `templates` · `fee-schedule` |
| `GridPart`, `ShownPart`, khoá `PART_TITLE`, `LAYER_COPY.partWhy/empty`, `data-part` | cùng sáu tên API; bảng `API_PART` bỏ đi vì tên phần đã là tên API                      |
| `src/app/(app)/proto/bo-nut-theo-quyen/` với `bang=an`, `man`, `vai`, `mo`          | `src/app/(app)/proto/permitted-actions/` với `board=hidden`, `screen`, `role`, `open`  |
| `design/screens/tuy-chinh-san.yaml`, `proto-bo-nut.yaml`                            | `design/screens/company-layer.yaml`, `proto-permitted-actions.yaml`                    |

Đọc phần thành một hàm thuần `layerPartFrom(query)` trong `src/modules/company-config/ui/copy.ts`, để trang và bài kiểm dùng
chung một luật: tên lạ hay vắng thì mở `labels`.

Không giữ đường chuyển hướng từ địa chỉ cũ: đường ấy phải viết chữ cũ trong `src/`.

## Mã màn và hồ sơ đã ký (Hỏi-1)

Mã màn là khoá bền: ba hồ sơ đã ký (`lop-rieng-cua-san`, `thue-phi`, `upgrade-design-assembly-0-7-0`) khai `screens:
[tuy-chinh-san]`, và `tools/coverage_matrix/contracts.py` báo đỏ mã không có trong sổ. Sổ màn không có luật đổi mã. Khuyến
nghị: tệp sổ màn khai thêm `old_ids: [tuy-chinh-san]`; `tools/coverage_matrix/registry.py` và `tools/proof_gate/model.py`
nhận mã cũ CHỈ cho hồ sơ đã đóng (`signed-off`, `machine-cleared`); hồ sơ đang mở khai mã cũ thì đỏ và nêu mã mới. Công cụ
design-assembly (`tools/design-assembly/`) bỏ qua khoá lạ nên không phải sửa — nó phải khớp bản của plugin. Hồ sơ đã ký không
bị sửa byte nào, theo tiền lệ `adopt-design-assembly` («các dòng sổ trước giữ tên cũ»).

Lối khác: giữ mã màn cũ, chỉ đổi địa chỉ (không đụng `tools/`, còn hai tên tệp tiếng Việt trong `design/screens/`).

## Chỗ cố ý giữ chữ cũ

- Tên ảnh bằng chứng mà hồ sơ đã ký trích (`tuy-chinh-san-1440.png`… trong ca «proof images» của
  `tests/e2e-db/lop-rieng.spec.ts`): đổi tên thì tệp chứng minh đã ký trỏ vào ảnh không có.
- Mã hàng trong lời chú (`Row 9e (bo-nut-theo-quyen)`), thư mục `_acceptance/`, thư mục ảnh `.acceptance-runs/<hồ sơ>/`.
- Tên tệp bài kiểm và khoá `executors.*`: hồ sơ đã ký chạy lại chúng bằng đúng tên ấy.

Danh sách giữ nằm ở `_acceptance/english-route-names/rang/giu.txt`, mỗi dòng một tệp, một mẫu và một lý do; lệnh quét E1 đọc
nó.

## Dữ liệu đã lưu

Không bảng nào lưu địa chỉ màn hay tên phần: `saved_view.screen` chỉ nhận `inventory`, `view.query` là chữ tìm. Không cần
chuyển dữ liệu.

## Ngoài phạm vi

Tám từ truy vấn tiếng Việt của Bảng hàng và `quyen` của `/proto/[slug]` — đề nghị một hàng riêng (Hỏi-2).

## Hệ quả cho hồ sơ đã ký

Eval `ui-check` của `thue-phi` và `lop-rieng-cua-san` có `target` là địa chỉ cũ: chúng là sử liệu của lượt đã ký và không
chạy trong làn ghim lại máy; lần ghim lại kế của hai hồ sơ ấy gặp chúng ở `evals_not_machine_touched`. Ghi vào mô tả PR.
