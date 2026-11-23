---
schema_version: 1
feature: Địa chỉ màn Tuỳ chỉnh của sàn và bản mẫu bộ nút, từ chọn phần và mã màn của chúng viết bằng tiếng Anh như luật kho
slug: english-route-names
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [ui]
screens: [company-layer]
status: approved
approved_by: Manh Phan
approved_at: 2026-11-23T01:53:33Z
design_doc: docs/superpowers/specs/2026-11-23-english-route-names-design.md
---

# Acceptance Contract: english-route-names

## Context

Chủ kho thấy `/tuy-chinh-san` trong sổ bàn giao thiết kế và hỏi nó có phạm luật kho không. `AGENTS.md` đòi mã, định danh và
tên tệp bằng tiếng Anh; không trang quyết định hay biên bản cổng nào chọn địa chỉ tiếng Việt, và phía API của cùng màn đã là
tiếng Anh (`/api/v1/company-layer/...`, `/api/v1/company/fee-schedule`). Hai địa chỉ phạm luật: `/tuy-chinh-san` (hàng 7e,
b819a3b3) và bản mẫu `/proto/bo-nut-theo-quyen` (hàng 9e, 9376a898). MVP chưa tới UAT nên không người ngoài nào lưu địa chỉ
cũ. Hạng T3 vì phải đổi khoá màn trong `tools/e2e_templates/recipes.ts` và hai bộ đọc sổ màn trong `tools/`.

Bảng cũ → mới:

| Cũ | Mới |
| --- | --- |
| `/tuy-chinh-san` | `/company-layer` |
| `?phan=nhan` (mặc định) | `/company-layer` (mặc định), `?part=labels` |
| `?phan=truong` · `tu-dien` · `can-cho` · `mau` · `thue-phi` | `?part=fields` · `aliases` · `pending-units` · `templates` · `fee-schedule` |
| `/proto/bo-nut-theo-quyen?bang=an&man=…&vai=…&mo=…` | `/proto/permitted-actions?board=hidden&screen=…&role=…&open=…` |
| mã màn `tuy-chinh-san`, `proto-bo-nut` | `company-layer`, `proto-permitted-actions` |

Luật sản phẩm: không luật nào bị chạm — vòng không đổi truy vấn, gửi tin hay trang khách.

## Criteria

- **AC-1:** Given một người đã đăng nhập mà bảng quyền cho `readCompanyLayer`, When mở `/company-layer`, Then thấy màn Tuỳ
  chỉnh của sàn ở phần Nhãn riêng như trước; khi chưa đăng nhập thì về trang đăng nhập với `next=/company-layer`; vai không
  có `readCompanyLayer` thấy «không được phép» như trước.
- **AC-2:** Given màn `/company-layer`, When mở với `?part=` là `labels`, `fields`, `aliases`, `pending-units`, `templates`
  hoặc `fee-schedule`, Then mở đúng phần ấy (khung của phần mang `data-part` cùng tên); `?part=` vắng hay lạ thì mở `labels`;
  `?phan=` không còn được đọc.
- **AC-3:** Given cột thứ hai của App Shell, When người có `readCompanyLayer` mở mục Tuỳ chỉnh của sàn, Then sáu mục trỏ
  `/company-layer` và `/company-layer?part=<tên API>` theo thứ tự cũ, tiêu đề vẫn lấy từ bảng nhãn; mục đang mở được đánh dấu
  như trước.
- **AC-4:** Given bản dev, When mở `/proto/permitted-actions` với `board=hidden`, `screen`, `role`, `open`, Then bản mẫu bộ
  nút hiện như `/proto/bo-nut-theo-quyen` từng hiện với `bang=an`, `man`, `vai`, `mo`; bản chạy thật trả trang không có.
- **AC-5:** Given địa chỉ cũ `/tuy-chinh-san` và `/proto/bo-nut-theo-quyen`, When mở, Then trả mã 404 với trang chung cho địa chỉ lạ
  của ứng dụng; `src/app` chỉ còn hai tuyến mới `/company-layer` và `/proto/permitted-actions` cho hai màn này. (Chờ Hỏi-4.)
- **AC-6:** Given sổ màn, When đọc, Then có `design/screens/company-layer.yaml` (`id: company-layer`, `route: /company-layer`,
  `vao_vung: /company-layer?part=pending-units`) và `design/screens/proto-permitted-actions.yaml` (`id:
  proto-permitted-actions`, `route: /proto/permitted-actions`); hai tệp cũ không còn; bảng vai × màn × nút sinh ra
  (`design/role-screen-buttons.md`) mang mục theo mã mới.
- **AC-7:** Given ba hồ sơ đã ký còn khai mã màn cũ (`lop-rieng-cua-san`, `thue-phi`, `upgrade-design-assembly-0-7-0`), When
  chạy `make check`, Then chúng vẫn qua nhờ khoá `old_ids` của sổ màn, và chỉ hồ sơ đã đóng được dùng mã cũ: một hồ sơ đang mở
  khai `tuy-chinh-san` thì đỏ, nêu mã mới. (Chờ Hỏi-1.)
- **AC-8:** Given cây sau vòng, When quét `src/`, `design/screens/`, `tools/e2e_templates/` và `tests/` bằng bảng cũ → mới,
  Then mọi chỗ còn chữ cũ ở địa chỉ, từ truy vấn, giá trị `data-part` hay mã màn đều nằm trong danh sách giữ có tên và lý do
  (`rang/giu.txt`, ghim đúng các dòng tệp:mẫu ở mục Notes: ảnh bằng chứng hồ sơ đã ký trích, mã hàng trong lời chú, thư mục
  `_acceptance/`), số chỗ chạm ngoài danh sách bằng 0, và trang không còn đọc khoá `phan` từ tham số truy vấn; migration nào lưu địa chỉ cũng chỉ lưu tên màn `inventory`.
- **AC-9:** Given mọi bài kiểm và cổng trỏ tên cũ, When chạy `make check`, `make e2e` và các bài trình duyệt có Postgres của
  hai màn (`tests/e2e-db/lop-rieng.spec.ts`, `thue-phi.spec.ts`, `screens.spec.ts`, `bo-nut-members.spec.ts`), Then tất cả xanh
  với địa chỉ mới; trang wiki thực thể và một dòng nhật ký wiki nói địa chỉ mới.

## Vai × Màn

| Màn | Đầu chủ | Đầu khách | Trưởng nhóm | Quản trị sàn |
| --- | --- | --- | --- | --- |
| company-layer | được — như trước ở `/tuy-chinh-san`: xem sáu phần; Thêm, Sửa, Ngừng dùng; Khớp; Đổi tên mẫu nhập | được — như trước: chỉ xem, không nút ghi | được — như Đầu chủ | được — như Đầu chủ; đặt mức ở phần Thuế phí |

Quyền không đổi: vòng chỉ đổi địa chỉ. Bản mẫu `proto-permitted-actions` là trang dev, không thuộc bảng này.

## Coverage

Bỏ quét hình thái — xem dòng `descope` «bỏ coverage-scan» trong `decisions.jsonl`. Độ phủ là bảng cũ → mới ở mục Context, đo
bằng lệnh quét chữ cũ E1 (mỗi dòng của bảng một mẫu) và cặp phá thử của nó.

## Out of scope

- Tám từ truy vấn tiếng Việt của Bảng hàng (`vai`, `mau`, `ma`, `toa`, `du-an`, `ho-so`, `vung`, `goc-nhin`) và `quyen` của
  `/proto/[slug]` — hàng riêng (Hỏi-2).
- Tên tệp bài kiểm tiếng Việt (`tests/e2e/bo-nut.spec.ts`, `tests/e2e-db/lop-rieng.spec.ts`, `thue-phi.spec.ts`…) và khoá
  `executors.*` trong `_acceptance/config.yaml`: hồ sơ đã ký chạy lại chúng bằng đúng tên ấy.
- Thư mục `_acceptance/` và mã hàng lộ trình (`bo-nut-theo-quyen`, `lop-rieng-cua-san`): là bản ghi của bộ nghiệm thu.
- Trang quyết định wiki cũ (0016, 0025, 0032) và kế hoạch, thiết kế cũ trong `docs/`: là sử liệu, giữ nguyên chữ lúc viết.
- `ontology/`: chỉ lời chú nhắc mã hàng, không phải địa chỉ.

## Notes

- Không bảng nào lưu địa chỉ màn hay tên phần: `saved_view.screen` chỉ nhận `inventory` (`db/migrations/009_goc_nhin.sql`),
  `view.query` là chữ tìm. Dữ liệu đã lưu không cần đổi.
- Danh sách giữ ghim (`rang/giu.txt`, tệp : mẫu : lý do) — chỉ hai dòng, đều là tên ảnh bằng chứng mà tệp chứng minh màn của
  hồ sơ đã ký trích (`evidence/tuy-chinh-san-<khổ>.png`), ghi khi chạy với cờ chụp ảnh:
  - `tests/e2e-db/lop-rieng.spec.ts` : `tuy-chinh-san-` : ảnh của `_acceptance/lop-rieng-cua-san/chung-minh-man.md`
  - `tests/e2e-db/thue-phi.spec.ts` : `tuy-chinh-san` (tên khung `proof`) : ảnh của `_acceptance/thue-phi/chung-minh-man.md`
  Mã hàng trong lời chú và đường `.acceptance-runs/<hồ sơ>/` không khớp mẫu nào nên không cần dòng giữ.
