---
schema_version: 1
feature: "Sổ màn khai mỗi màn hiện những thứ gì, và bộ kiểm của kho (make check) đỏ khi một thứ trên màn thiếu thêm, xem, sửa hoặc gỡ theo từng vai, trừ khi ô thiếu mang lý do đã duyệt trỏ tới một hàng lộ trình"
slug: kiem-vong-doi-thao-tac
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [cli]
screens: []
status: draft
approved_by:
approved_at:
design_doc: _acceptance/kiem-vong-doi-thao-tac/design.md
---

# Acceptance Contract: kiem-vong-doi-thao-tac

## Context

Hàng nền 1t của `docs/plan/lo-trinh.json`, ô `_acceptance/kiem-vong-doi-thao-tac/opportunity.md` (build, Manh Phan,
2026-11-15T02:47Z, «Cho cả đợt»). Báo cáo rà soát RS2 ngày 2026-11-14 (`.acceptance-runs/dieu-phoi-nen/trinh/ra-soat-crud/bao-cao.md`)
kê 7 thao tác thiếu thật và chỉ nguyên nhân N3: phép kiểm nút 9b (`tools/coverage_matrix/buttons.py`) chỉ so nút đã khai, sổ
màn không khai màn hiện thứ gì. Hàng này thêm khoá `hien` cho mỗi màn của `design/screens.yaml`, khối `vong_doi` cho mỗi thực
thể hiện trên màn ở `ontology/entities/`, và phép kiểm `tools/coverage_matrix/lifecycle.py` chạy trong `make test`. Hàng không
dựng màn. Hạng T3: tệp công cụ mới và đổi `ontology/` (nêu đích danh ở trang cổng). Thiết kế: `design.md` cùng hồ sơ.

## Criteria

- AC-1: Given sổ màn `design/screens.yaml`, When phép kiểm vòng đời chạy `--check`, Then mỗi màn người dùng (audience `staff`
  hay `public`, `built` hay `planned`) và khung App Shell có khoá `hien` là danh sách tên thực thể của `ontology/entities/`; màn
  thiếu khoá đỏ `<màn>: thieu khoa hien`, tên không phải thực thể đỏ `<màn>: hien <X> khong phai thuc the`; màn dev ngoài phép kiểm.
- AC-2: Given mã của một màn, When phép kiểm suy thực thể màn hiện từ chuỗi trường `"<Thực thể>.<trường>"` trong tệp màn dùng
  (đường nhập của 9b, từ trang của màn; khung từ `layout.tsx`) và từ thực thể của mọi thao tác trong bảng nút 9b của màn, Then
  thực thể suy ra mà `hien` không kê đỏ `<màn>: hien <X> ma chua khai` kèm nguồn; trên kho thật, tập suy ra của mỗi màn đã dựng
  bằng đúng bảng viết trước trong bài kiểm.
- AC-3: Given một thực thể có trong `hien` của ít nhất một màn, When phép kiểm chạy, Then tệp mô hình của nó có khối `vong_doi`
  với đủ bốn ô `them`, `xem`, `sua`, `go` (thiếu khối đỏ `<X>: thieu vong_doi`, thiếu ô đỏ `<X>: thieu o <ô>`), và mỗi ô — kể
  cả ô trong `rieng` — đúng một trong ba dạng `co`, `hang`, `khong`; `co` đi cùng `hang` chỉ khi thao tác còn dự kiến (AC-4), `khong` không đi cùng `co` hay `hang` (không thì đỏ `<X>.<ô>: o phai la co, hang hoac khong`).
- AC-4: Given ô dạng `co: <thao tác>`, When phép kiểm chạy, Then thao tác có trong `ontology/actions.yaml`, đúng loại của ô
  (`them` create · `xem` query · `sua` update · `go` delete · `rieng` mọi loại), với `them`, `sua`, `go`, `rieng` là nút mà bảng
  nút 9b biết trên ít nhất một màn có thực thể trong `hien`, thao tác `planned` mang `hang`, thao tác `live` không mang `hang` (đỏ `<X>.<ô>: <a> dang chay, bo hang`); ca phá gỡ `removeListing` khỏi
  bảng quyền trên bản sao đỏ đúng câu `Listing.go: thao tac removeListing khong co trong bang quyen`.
- AC-5: Given ô dạng `hang` hay `khong`, When phép kiểm chạy, Then `hang` là mã có trong `docs/plan/lo-trinh.json` và có
  `ly_do`; `khong` có lý do và `duyet: <hồ sơ>#<mã dòng sổ>` trỏ một dòng có thật trong `_acceptance/<hồ sơ>/decisions.jsonl`
  mang `decided_by` và có `stage` là một cổng (`gate1`, `gate2`); mỗi lỗi đỏ đúng câu ghim của bảng «Thông điệp đỏ» trong thiết kế.
- AC-6: Given kho sạch, When chạy `make check`, Then bài `tests/vong-doi-thao-tac.test.ts` (trong `make test`) chạy `--check`
  trên kho thật và xanh; phép kiểm chạy được trên một bản sao không có thư mục `.git`, không gọi `git`, và mọi thư mục tạm của
  bài được dọn sau lượt.
- AC-7: Given bảng vòng đời chủ kho duyệt ở Cổng Phạm vi (Hỏi-3), When đọc khối `vong_doi` trong kho, Then mỗi ô khớp bảng đã
  duyệt; bảy chỗ thiếu thật của báo cáo RS2 (sửa thông tin căn ngoài giá, nhận căn chưa ai giữ, đổi người giữ căn, màn Liên hệ,
  gộp liên hệ, tắt link đã gửi, gỡ chủ khỏi căn) mỗi chỗ trỏ hàng đã duyệt cho nó; mọi ô `khong` trỏ dòng sổ chữ duyệt của cổng.
- AC-8: Given một vai mở được một màn hiện thực thể X (vai giữ cửa `vao`, hay mọi vai khi `vao` rỗng), When phép kiểm chạy,
  Then vai ấy giữ thao tác của ô `xem` của X, hoặc ô `xem` kê vai ấy trong `chan` với một ô `hang` hay `khong` hợp lệ — không
  thì đỏ `<X>.xem: <Vai> mo duoc <màn> ma khong xem duoc`; và `lifecycle.py --report` in mỗi thực thể một mục với vai và phạm
  vi của từng ô `co` theo bảng quyền (vai không có ô in «chặn»), ô `hang` và `khong` kèm hàng và lý do, không bao giờ đỏ.

## Coverage

Quét theo khuôn test-matrix (preset của morphological-scan), không rút gọn. Trục và mỗi ô của tích:

- Trục 1 — chỗ khai: `hien` của màn (AC-1) · khối `vong_doi` của thực thể (AC-3) · ô `rieng` (AC-3).
- Trục 2 — nguồn nhận diện: chuỗi trường (AC-2) · nút khai `nut` (AC-2) · nút tìm thấy trong mã (AC-2) · cửa `vao` (AC-2) ·
  khai tay ngoài hai nguồn (AC-3 kiểm như mọi thực thể).
- Trục 3 — dạng ô: `co` live · `co` planned (AC-4) · `hang` (AC-5) · `khong` (AC-5) · sai dạng (AC-3).
- Trục 4 — lỗi của ô `co`: lạ · sai loại · không là nút · dự kiến thiếu hàng (AC-4).
- Trục 5 — lỗi của ô `hang`/`khong`: hàng lạ · thiếu lý do · thiếu duyệt · duyệt trỏ dòng không có · dòng không có chữ người (AC-5).
- Trục 6 — loại màn: built · planned · dev (ngoài) · khung App Shell (AC-1, AC-2).
- Trục 7 — môi trường: kho thật · bản sao không `.git` · thư mục tạm dọn (AC-6).
- Trục 8 — vai: vai mở được màn × ô xem (đỏ, AC-8) · vai × thêm, sửa, gỡ theo bảng quyền (báo cáo, AC-8) · vai khai `chan` (AC-8).
- Ô gạch có lý do: «thực thể hiện chỉ bằng chữ, không chuỗi trường, không thao tác» — ngoài nhận diện máy (Hỏi-2, Known limits).

## Đường đo

Ô cơ hội khai ngưỡng sống là câu «Bật khi» của hàng. Mỗi vế một thước:

- «Sổ màn có trường khai các thứ mỗi màn hiện» → AC-1 (E1).
- «mô hình nghiệp vụ khai vòng đời của từng thứ … trỏ một trong ba» → AC-3, AC-4, AC-5 (E3, E4, E5).
- «phép kiểm chạy trong make check và đỏ đúng câu» → AC-6 (E6) cùng câu ghim của E1–E5.
- «ca phá gỡ thao tác gỡ căn khỏi bảng quyền làm phép kiểm đỏ đúng câu» → AC-4 (E4).
- «lần chạy đầu kê đúng các chỗ thiếu thật … trỏ tới hàng nhận nó hoặc thành câu hỏi» → AC-7 (E7) và Hỏi-3 ở cổng.
- «theo từng vai» → AC-8 (E8): đỏ ở ô xem, báo cáo ở các ô còn lại (Hỏi-4).

## Vai × Màn

Hàng nền, không dựng hay đổi màn nào (`screens: []`): nó thêm một phép kiểm trong `make check` và dữ liệu khai (khoá `hien`
của sổ màn, khối `vong_doi` của mô hình nghiệp vụ). Vai chỉ đi vào phép kiểm qua bảng quyền (AC-8).

## Out of scope

- Kiểm câu bật của hàng đích có nhắc vế được trỏ (vd gộp liên hệ trỏ 13a mà câu bật 13a không nhắc) — bước sau của đề xuất 3.3 RS2; ai quyết: máy (không loại thao tác nào của thứ trên màn; G rà câu bật theo LUAT vii).
- Kiểm hàng đích đã xong mà ô vẫn trỏ hàng (lời hứa cũ) — cần biết hàng nào xong, ngoài dữ liệu trong cây; ai quyết: máy (như trên).
- Đỏ cho từng vai bị chặn ở thêm, sửa, gỡ (26 ô lần đầu) — vai ở các ô ấy lấy từ bảng quyền đã qua cổng 9a, 9e và in ở báo cáo; ai quyết: chủ kho, ở Hỏi-4.
- Dựng nút, màn, dòng quyền cho các ô thiếu — thuộc các hàng đích (13, 13a, 3g, 16, 18, 18a, 18b…); ai quyết: chủ kho, ở Hỏi-3.
- Khoản thuế phí và màn của các hàng chưa gộp — dãy của hàng ấy khai khi gộp main sau 1t; ai quyết: G.

## Notes

- Không chạm `tools/proof_gate/`, `buttons.py`, `registry.py`, `check.py`. Tệp công cụ duy nhất: `tools/coverage_matrix/lifecycle.py` (mới).
- Đổi `ontology/` (khối `vong_doi`) cần chủ kho soi trong PR (AGENTS.md); mô tả PR có mục «Đổi ontology — chủ kho soi».
- Known limits (đề xuất, Hỏi-2): thứ hiện chỉ bằng chữ, không chuỗi trường, không thao tác thì máy không thấy.
