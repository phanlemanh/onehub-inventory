# Thiết kế — 1t «Phép kiểm vòng đời thao tác» (`kiem-vong-doi-thao-tac`)

Hàng nền, T3, không có màn. Trả lời nguyên nhân N3 của báo cáo rà soát RS2 (`.acceptance-runs/dieu-phoi-nen/trinh/ra-soat-crud/bao-cao.md`,
đề xuất 3.3): phép kiểm nút 9b chỉ so nút ĐÃ khai, không ai khai màn hiện thứ gì, nên thao tác chưa từng khai thì không ai
thấy thiếu.

## Ý chính

1. **Màn khai thứ nó hiện.** Mỗi màn người dùng của `design/screens.yaml` (audience `staff` hay `public`, `built` hay
   `planned`) có khoá mới `hien: [<Thực thể>, …]` — tên thực thể của `ontology/entities/`. Màn không hiện gì ghi `hien: []`.
   Khung App Shell (`khung`) cũng có `hien`. Khoá chỉ THÊM vào mỗi mục, dòng cũ giữ nguyên.
2. **Máy tự thấy màn hiện gì — không chỉ tin chỗ đã khai.** Phép kiểm suy thực thể mỗi màn hiện từ hai nguồn máy đọc:
   - chuỗi trường `"<Thực thể>.<trường>"` trong các tệp màn thật sự dùng — đi từ trang của màn theo đường nhập mà phép kiểm
     nút 9b đã đi (`tools/coverage_matrix/buttons.py`: `used_files`), khung đi từ `src/app/(app)/layout.tsx`;
   - thực thể của mọi thao tác trong bảng nút 9b của màn (nút khai ở `nut`, nút tìm thấy trong mã, cửa vào `vao`).
   Thực thể suy ra mà `hien` không kê → đỏ. `hien` kê thêm thực thể ngoài hai nguồn thì được (khai tay), và được kiểm như mọi
   thực thể. Giới hạn (Hỏi-2): thứ hiện chỉ bằng chữ viết tay, không chuỗi trường, không thao tác thì máy không thấy.
3. **Vòng đời khai một lần, ở thực thể.** Mỗi thực thể có mặt trong `hien` của ít nhất một màn phải có khối `vong_doi` ở
   `ontology/entities/<Thực thể>.yaml` với đủ bốn ô `them`, `xem`, `sua`, `go`, và tuỳ chọn `rieng: {<tên>: <ô>}` cho thao tác
   riêng (đưa lên bán, gộp, khoá…). Mỗi ô một trong ba dạng (đúng lời câu bật):
   - `{ co: <thao tác> }` — tên trong `ontology/actions.yaml`. Luật chặt (Hỏi-4): đúng loại (`them`→create, `xem`→query,
     `sua`→update, `go`→delete; `rieng` nhận mọi loại); với `them`, `sua`, `go`, `rieng` thao tác phải là nút mà bảng nút 9b
     biết trên ít nhất một màn có thực thể trong `hien`; thao tác `planned` phải kèm `hang: <mã>`, thao tác `live` kèm `hang`
     là sai dạng (`<X>.<ô>: <a> dang chay, bo hang`).
   - `{ hang: <mã>, ly_do: <câu> }` — một hàng của `docs/plan/lo-trinh.json` sẽ làm ô này.
   - `{ khong: <lý do>, duyet: <hồ sơ>#<mã dòng sổ> }` — dòng ấy có trong `_acceptance/<hồ sơ>/decisions.jsonl`, có
     `decided_by` và `stage` là một cổng (`gate1`, `gate2`); dòng hỏng trong sổ được bỏ qua.
   Một ô mang `co` cùng `khong`, hay `hang` cùng `khong`, là sai dạng.
   **Theo từng vai (Hỏi-4).** Vai mở được một màn là vai giữ cửa `vao` của màn (hay mọi vai khi `vao` rỗng; khung: mọi vai).
   Mọi vai mở được một màn hiện thực thể X phải giữ thao tác của ô `xem` của X; vai nào không giữ thì ô `xem` kê nó trong
   `chan: {<Vai>: <ô hang hoặc khong>}`, không thì đỏ `<X>.xem: <Vai> mo duoc <màn> ma khong xem duoc`. Ô `xem` dạng `hang`
   hay `khong` thì mọi vai coi như đã khai. Ở `them`, `sua`, `go`, `rieng` vai lấy từ phạm vi của thao tác trong bảng quyền
   (mỗi ô vai đã qua cổng 9a, 9e) và in ở báo cáo.
4. **Một tệp công cụ mới, chạy trong `make test`.** `tools/coverage_matrix/lifecycle.py` (thư viện chuẩn, nhập lại hàm của
   `buttons.py` và `registry.py`, không sửa chúng): `--check` đỏ với thông điệp ghim, `--report` in bảng thực thể × ô × vai
   (không bao giờ đỏ), `--json` cho bài kiểm. Bài `tests/vong-doi-thao-tac.test.ts` chạy `--check` trên kho thật và các ca phá
   trên bản sao trong thư mục tạm tự dọn; `make check` đỏ theo.
5. **Không đọc git, không đọc ngoài cây.** Chạy được trên bản sao nông của CI.

## Thông điệp đỏ (mỗi luật một câu ghim)

| Luật | Câu |
|---|---|
| màn người dùng thiếu khoá `hien` | `<màn>: thieu khoa hien` |
| `hien` kê tên không phải thực thể | `<màn>: hien <X> khong phai thuc the` |
| máy thấy thực thể mà `hien` không kê | `<màn>: hien <X> ma chua khai` (kèm nguồn: `truong` / `nut <thao tác>`) |
| thực thể hiện mà không có khối `vong_doi` | `<X>: thieu vong_doi` |
| thiếu một trong bốn ô | `<X>: thieu o <them|xem|sua|go>` |
| ô không đúng một dạng | `<X>.<ô>: o phai la co, hang hoac khong` |
| thao tác lạ | `<X>.<ô>: thao tac <a> khong co trong bang quyen` |
| sai loại | `<X>.<ô>: <a> la <kind>, o nay can <kind>` |
| không phải nút ở màn nào hiện thực thể | `<X>.<ô>: <a> khong la nut o man nao hien <X>` |
| thao tác dự kiến không có hàng | `<X>.<ô>: <a> con du kien, thieu hang` |
| mã hàng lạ | `<X>.<ô>: hang <m> khong co trong lo trinh` |
| `hang` thiếu lý do | `<X>.<ô>: hang <m> thieu ly_do` |
| `khong` thiếu lý do / thiếu `duyet` | `<X>.<ô>: khong thieu ly do` · `<X>.<ô>: khong thieu duyet` |
| `duyet` trỏ dòng không có / không có chữ người / không phải dòng cổng | `<X>.<ô>: duyet <ref> khong co trong so` · `<X>.<ô>: duyet <ref> khong co decided_by` · `<X>.<ô>: duyet <ref> khong phai dong cong` |
| thao tác đang chạy mà kèm hàng | `<X>.<ô>: <a> dang chay, bo hang` |
| vai mở được màn mà không xem được | `<X>.xem: <Vai> mo duoc <màn> ma khong xem duoc` |

## Vì sao lối A (khuyến nghị ở Hỏi-1)

Câu bật đã qua Cổng Đáng viết «Sổ màn có trường khai các thứ mỗi màn hiện; mô hình nghiệp vụ khai vòng đời của từng thứ».
Một thực thể hiện ở nhiều màn (căn ở Bảng hàng, App Shell, Tuỳ chỉnh của sàn), nên vòng đời theo thực thể là một luật một chỗ.
Lối B (sổ riêng `design/vong-doi.yaml` theo màn × thực thể) không chạm sổ màn và ontology, nhưng khai lại vòng đời mỗi màn và
là một danh sách màn thứ hai — G đã đặt ba điều kiện cho B (G-1511-2); ở A, luật (a) và (b) của G tự đúng vì `hien` nằm ngay
trong mục màn của sổ màn, luật (c) là ý 2 ở trên.

Va tệp: 2b, 2d, 19, 10, 5 đang sửa `design/screens.yaml`; 1t chỉ thêm một dòng `hien` mỗi màn. Hàng nào gộp sau 1t mà thêm
màn hay thực thể trên màn phải khai `hien` và `vong_doi` — G nhắn các dãy khi 1t gộp.

## Bảng vòng đời đề xuất (Hỏi-3 — chủ kho duyệt một lần)

Lần chạy thử trên main (0861fdc + nhánh lộ trình be8c93e): 9 màn người dùng, 12 thực thể hiện. «Thiếu thật» là chỗ báo cáo RS2
đếm (7). Mọi ô `khong` dưới đây sẽ trỏ dòng sổ chữ duyệt của Cổng Phạm vi 1t.

| Thực thể (màn) | Thêm | Xem | Sửa | Gỡ | Riêng |
|---|---|---|---|---|---|
| SavedView (Bảng hàng, App Shell) | co saveView | co listSavedViews; chan Quản trị sàn → hàng 10 (cùng lý do) | co editView | co removeView | — |
| Listing (Bảng hàng, App Shell, Tuỳ chỉnh) | co createListing · hàng 12 | co viewListings · hàng 10; chan Quản trị sàn → hàng 10 (Bảng hàng mở cho mọi vai, bảng quyền không cho QT xem căn) | co updateListing · hàng 10 (giá, trạng thái) | co removeListing · hàng 18b | sửa ngoài giá: **thiếu thật** pháp lý, nội thất, tài chính, tình trạng → hàng 3g; đưa lên bán: co activateListing · hàng 15; nhận căn chưa ai giữ: **thiếu thật** → hàng 18a; đổi người giữ: **thiếu thật** → hàng 18a |
| ListingOwner (Bảng hàng) | hàng 13 | co viewOwnerPhone · hàng 13; chan Đầu khách, Quản trị sàn: không — số chủ chỉ người giữ căn và Trưởng nhóm thấy (bảng quyền 9e) | hàng 18b (sửa qua liên hệ) | **thiếu thật** gỡ chủ khỏi căn → hàng 13 | — |
| Unit — danh mục (Bảng hàng, App Shell, Tuỳ chỉnh) | hàng 12 (tạo căn tay khi danh mục chưa có) | co readCatalog | không — danh mục chung, sàn không sửa toà, căn (7d) | không — gộp, tách, ngừng toà căn ngoài MVP (7d Out of scope) | — |
| ShareLink (Đã gửi) | hàng 16 | **thiếu** dòng quyền đọc → hàng 16 | không — link đã gửi không sửa (Quỹ hàng chốt «đúng thiết kế») | **thiếu thật** tắt link → hàng 18 | — |
| Contact (Liên hệ, dự kiến) | co createContact · hàng 13a | co viewContacts · hàng 13a (**thiếu thật** màn Liên hệ) | co updateContact · hàng 13a | co removeContact · hàng 13a | gộp: co mergeContacts · hàng 13a (**thiếu thật**); xoá dữ liệu cá nhân: co eraseContactPersonalData · hàng 18b |
| CompanyLabel, CustomField, CompanyValueAlias (Tuỳ chỉnh) | co addCompanyLayer | co readCompanyLayer | co editCompanyLayer | co retireCompanyLayer (Ngừng dùng thay Xoá, chủ kho 13/11) | — |
| ImportTemplate (Tuỳ chỉnh) | hàng 11 (mẫu tự học khi nhập) | co readCompanyLayer | co editCompanyLayer (đổi tên; sửa ánh xạ hàng 11) | co retireCompanyLayer | — |
| PendingUnit (Tuỳ chỉnh) | hàng 12 (chủ kho chốt Hỏi-7 của 7e) | co readCompanyLayer | co editCompanyLayer | co retireCompanyLayer | khớp: co matchPendingUnits |
| Member (Thành viên) | co inviteMember | co listMembers | co changeMemberRoles | **thiếu** khoá, gỡ khỏi sàn — không có dòng quyền nháp → hàng 18a | — |

Ô «không» cần chữ: Unit sửa, Unit gỡ, ShareLink sửa, chủ nhà — vai Đầu khách và Quản trị sàn không xem (bốn ô). Hàng đích cần G thêm vế vào câu bật: 13 (gỡ chủ khỏi căn),
18 (tắt link), 18a (nhận căn, đổi người giữ, khoá và gỡ thành viên — thêm dòng quyền), 16 (dòng quyền đọc lần gửi).

Màn không hiện gì: Hôm nay (`today`), Đăng nhập (`sign-in`) → `hien: []`. Màn dev (`proto`, `proto-bo-nut`) ngoài phép kiểm.
Khoản thuế phí (hàng 19) chưa có trên main: dãy N khai `hien` và `vong_doi` khi gộp main sau 1t.

## Tệp chạm

| Tệp | Hạng | Làm gì |
|---|---|---|
| `tools/coverage_matrix/lifecycle.py` (MỚI) | cao | phép kiểm, báo cáo, JSON — tệp công cụ duy nhất của hàng |
| `design/screens.yaml` | vừa | thêm khoá `hien` mỗi mục màn và khung, thêm một dòng giải thích ở đầu tệp |
| `ontology/entities/*.yaml` (12 tệp) + `_template.yaml` | cao | thêm khối `vong_doi` theo bảng đã duyệt — chủ kho soi trong PR (AGENTS.md) |
| `tests/vong-doi-thao-tac.test.ts` (MỚI) | thấp | `--check` trên kho thật + ca phá trên bản sao tự dọn |
| `_acceptance/config.yaml` | — | thêm một dòng `executors.test.vong_doi` |
| `wiki/decisions/0038-lifecycle-check.md` (kèm ba dòng hướng dẫn khai cho các dãy), `wiki/log.md` | thấp | quyết định và nhật ký |

Không chạm `tools/proof_gate/`, `buttons.py`, `registry.py`, `check.py`, `.github/`, `governance/`.
