---
schema_version: 1
feature: Mọi màn và mọi vai được khai cho máy đọc, màn chưa khai hay hợp đồng thiếu vai thì kiểm tra báo đỏ
slug: khai-vai-va-man
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [config]
status: draft
approved_by:
approved_at:
design_doc: _acceptance/khai-vai-va-man/design.md
---

# Acceptance Contract: khai-vai-va-man

## Context

Quyết định 0017 thử khối Vai × Màn ở cấp kho: máy của kit chỉ kiểm mục Độ phủ có mặt, không kiểm đủ vai và đủ màn. Hàng này khai danh sách vai và sổ màn cho máy đọc, thêm máy kiểm vào `make check` để trang chưa khai và hợp đồng thiếu vai báo đỏ, và một lệnh in số đo cho đợt thử. Hàng đặt trước hàng 2 để có số đo từ vòng giao diện đầu tiên. Người dùng là người làm kho (người và tác tử) ở mỗi vòng sau; không có màn nào cho nhân viên sàn đổi.

Source input: hàng 1d của `docs/plan/lo-trinh.json` (mã N11 của `docs/plan/pham-vi-mvp-dot-1.md`), ô cơ hội `_acceptance/khai-vai-va-man/opportunity.md` do chủ kho quyết «build» ngày 10/11/2026, quyết định `wiki/decisions/0016-permission-model.md` và `wiki/decisions/0017-actor-surface-coverage-pilot.md`.

## Criteria

- AC-1: Given `ontology/roles.yaml`, When máy kiểm Vai × Màn chạy, Then danh sách có đúng bốn vai giao được `ListAgent`, `BuyerAgent`, `TeamLead`, `CompanyAdmin`, mỗi vai có nhãn `kind: role` trong `ontology/labels.yaml` (Đầu chủ, Đầu khách, Trưởng nhóm, Quản trị sàn), tệp khai một người giữ được nhiều vai (`holds: many`), và kiểu `Role` sinh ra ở `src/generated/ontology.ts` liệt đúng bốn tên; một vai không có nhãn vai thì máy kiểm đỏ và gọi tên vai đó.
- AC-2: Given sổ màn `design/screens.yaml`, When có một trang `page.tsx` dưới `src/app` mà sổ chưa khai, Then máy kiểm đỏ và gọi tên đường dẫn của trang; sổ hiện tại khai đủ Hôm nay (`/`), Bảng hàng (`/inventory`), Đã gửi (`/sent`) và bản mẫu (`/proto/[slug]`, đối tượng `dev`) nên máy kiểm xanh trên kho.
- AC-3: Given sổ màn, When một màn khai `built` mà không có trang, một màn khai `planned` mà đã có trang, hai màn trùng mã hay trùng đường dẫn, hoặc một màn ghi họ, đối tượng, trạng thái ngoài danh sách khai hay nhãn tên màn không có trong `labels.yaml`, Then máy kiểm đỏ và gọi tên màn cùng lỗi.
- AC-4: Given sổ màn, When đọc màn Liên hệ, Then nó có mặt ở trạng thái `planned`, họ `grid` (Lưới), nhãn `Contact`, cùng họ với Bảng hàng và Đã gửi, và máy kiểm xanh dù chưa có trang Liên hệ.
- AC-5: Given hợp đồng của một vòng đang mở (`draft`, `approved`, `implemented` hoặc `verified`) có `surfaces` chứa `ui`, `web` hoặc `web-ui`, When hợp đồng thiếu khoá `screens` hoặc thiếu mục `## Vai × Màn`, Then máy kiểm đỏ và gọi tên hồ sơ; khai `screens: []` mà mục không có dòng lý do cũng đỏ; và Given hợp đồng không chạm giao diện nhưng khai `screens` khác rỗng, When thiếu mục `## Vai × Màn`, Then cũng đỏ; trạng thái ngoài bảy trạng thái của kit thì đỏ.
- AC-6: Given khối Vai × Màn của một hợp đồng, When bỏ một cột vai, thêm cột không phải vai, để trống một ô, ghi một ô không mở đầu bằng `được`, `chặn` hay `không liên quan`, ghi `không liên quan` không kèm lý do, thiếu dòng của một màn trong `screens`, hoặc có dòng của màn không nằm trong `screens` hay không có trong sổ, Then máy kiểm đỏ và gọi tên hồ sơ, màn và vai.
- AC-7: Given hồ sơ đã đóng (`signed-off`, `machine-cleared`, `da-cham-boi-thuc-te`) không có mục `## Vai × Màn`, như `khung-va-giao-dien`, When máy kiểm chạy, Then hồ sơ không đỏ và được đếm là «trước khối»; hồ sơ đã đóng mà có mục thì vẫn bị kiểm đủ như AC-6; hồ sơ không chạm giao diện và không khai `screens` thì không bị đòi khối.
- AC-8: Given các hồ sơ trong `_acceptance/`, When chạy `make coverage-report`, Then lệnh in số vòng chạm màn, số vòng đủ ô, số vòng thiếu ô, số vòng trước khối, số vòng khai `screens: []`, số ô `không liên quan` trên tổng số ô kèm tỉ lệ phần trăm, và mốc Quỹ hàng 33/98; lệnh thoát 0 kể cả khi có vòng thiếu ô, và số in ra khớp bảng đếm viết trước trên bộ hồ sơ mẫu.
- AC-9: Given kho, When chạy `make check`, Then máy kiểm Vai × Màn chạy trong đó qua `mk/coverage.mk` và xanh trên kho hiện tại; phá như AC-2 hay AC-6 trên một bản sao kho thì `make check` thoát khác 0.

## Coverage

Thước đối chiếu: câu «bật khi» của hàng 1d (`docs/plan/lo-trinh.json`); phần Decision và Consequences của `wiki/decisions/0017-actor-surface-coverage-pilot.md`; OWASP WSTG-ATHZ-02 (kiểm từng vai trên từng tài nguyên) làm chân ngành `[NGÀNH: OWASP WSTG-ATHZ-02]`.

- Trục vật được khai: vai (AC-1) | màn (AC-2, AC-3, AC-4).
- Trục lệch giữa sổ và thực: trang chưa khai (AC-2) | khai đã dựng mà không có trang (AC-3) | khai trước khi dựng (AC-4) | khai sắp làm mà đã có trang (AC-3).
- Trục trạng thái hồ sơ (bảy trạng thái của khuôn hợp đồng kit — mở: `draft`, `approved`, `implemented`, `verified`; đóng: `signed-off`, `machine-cleared`, `da-cham-boi-thuc-te`; lạ: đỏ): mở chạm giao diện (AC-5, AC-6) | mở không chạm giao diện nhưng khai màn (AC-5) | đóng không khối (AC-7) | đóng có khối (AC-7) | không chạm giao diện, không khai màn (AC-7).
- Trục lỗi của khối: thiếu khối | thiếu `screens` | `screens: []` không lý do (AC-5) | thiếu cột vai | cột lạ | ô trống | ô sai lời | không liên quan thiếu lý do | thiếu dòng màn | dòng màn lạ (AC-6).
- Trục mặt phơi: máy kiểm trong `make check` (AC-9) | lệnh số đo (AC-8).
- Later: bài kiểm trình duyệt theo từng cặp vai và màn (hàng 9b); bảng quyền (hàng 9a); thanh bên theo nhiều vai đọc sổ (hàng riêng sau 1d); khách không đăng nhập ở trang khách (hàng 17).
- Never: máy chấm ô đúng hay sai — 0017 để việc này cho người ở Cổng Phạm vi.

## Đường đo

- «Thêm một trang chưa khai thì đỏ» — số từ: mã thoát của máy kiểm trên bản sao có trang lạ · bảo đảm bởi AC-2, AC-9.
- «Bỏ một vai khỏi khối Vai × Màn thì đỏ» — số từ: mã thoát và thông điệp của máy kiểm trên hồ sơ mẫu thiếu cột · bảo đảm bởi AC-6.
- «Một lệnh in số vòng đủ ô, thiếu ô và số ô ghi không liên quan» — số từ: `make coverage-report` · bảo đảm bởi AC-8.
- «Màn Liên hệ dù làm sau vẫn được khai trước vào họ Lưới» — số từ: dòng `contacts` của `design/screens.yaml` · bảo đảm bởi AC-4.

## Out of scope

- Không chạy bài kiểm trình duyệt theo vai: hàng 9b, cần đăng nhập thật và bảng quyền.
- Không khai quyền hay kế thừa giữa vai (`inherits`) và không khai vai nào được vào màn nào trong sổ: bảng quyền của hàng 9a là nguồn duy nhất (0016).
- Không sinh thanh bên từ sổ màn và không đổi cách lọc thanh bên theo nhiều vai: hàng riêng xếp sau 1d.
- Không thêm vai cho khách không đăng nhập hay cho tác tử AI: trang khách (hàng 17) khai đối tượng `public`; chưa có tác tử nào thao tác trên hệ thống.
- Không ép khối với vòng chạm quyền mà không khai mặt giao diện: máy chưa có dấu hiệu chắc cho «chạm quyền».
- Không sửa tệp ontology nào ngoài `ontology/roles.yaml` (phán quyết của giám sát); bảng thuật ngữ cho vai để hàng 9a.
- Không sửa hồ sơ của vòng khác để thêm khối.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Đổi ontology — chủ kho soi: tệp mới `ontology/roles.yaml` (bốn vai, `holds: many`); `src/generated/ontology.ts` sinh lại bằng `make gen`, kiểu `Role` từ `string` thành hợp của bốn tên.
- Vòng chạm giao diện đang chạy ở dãy khác (như 1b) sẽ cần khối khi gộp nhánh chính sau hàng này; giám sát được báo trước.
- Mốc Quỹ hàng 33/98 là ước lượng theo từ khoá (0017); lệnh số đo in nó làm mốc, không tính lại.
