---
schema_version: 1
feature: "Bộ kiểm chung sinh từ sổ màn chạy được trên màn cần đăng nhập và không lỡ nhịp khi máy chậm"
slug: bo-kiem-chung-khi-dang-nhap
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [cli]
screens: []
status: signed-off
approved_by: Manh Phan
approved_at: 2026-11-12
design_doc: _acceptance/bo-kiem-chung-khi-dang-nhap/design.md
---

# Acceptance Contract: bo-kiem-chung-khi-dang-nhap

## Context

Bộ kiểm chung của hàng 1f mở mỗi màn khi chưa đăng nhập. Hàng 9 cho màn Thành viên «bỏ qua có điều kiện»; khi hàng 10 nối
dữ liệu thật, mọi màn cần đăng nhập và bộ kiểm sẽ bỏ qua gần hết. Hàng 1o trượt cổng hai lần vì bài kiểm đo trước khi ngăn
trượt hay băng báo hiện hẳn trên máy chậm. Vòng này cho bộ kiểm chung một phiên thử ở lượt có cơ sở dữ liệu, gỡ danh sách bỏ
qua vì cần đăng nhập, và gom các bài chờ vào hai hàm dùng chung đã chứng đỏ được. Hạng T3 vì chạm `tools/e2e_templates/`.
Không chạm SP-1, SP-3, SP-4.

Hàng này THAY quyết định «màn cần đăng nhập: bỏ qua có điều kiện» chủ kho chọn ở hàng 9 (2026-11-11) bằng cơ chế mạnh hơn:
màn cần đăng nhập được đo thật bằng một phiên thử. Ba ca kiểm của cơ chế cũ được thay bằng ca của AC-1, AC-2, AC-4 (bảng ở
bản thiết kế, mục «Hàng này thay một quyết định của chủ kho ở hàng 9»). Duyệt phạm vi là duyệt việc thay.

Source input: hàng `1r` của `docs/plan/lo-trinh.json`, ô `_acceptance/bo-kiem-chung-khi-dang-nhap/opportunity.md` (build,
Manh Phan, 2026-11-12), quyết định «màn cần đăng nhập: bỏ qua có điều kiện» (`moi-nguoi-gan-vai#d-20261111T153259Z-34`), hồ
sơ hàng 1o (`_acceptance/app-shell-chon-tu-reui/evidence-report.md`, `review-findings.md`).

## Criteria

- AC-1: Given lượt kiểm có cơ sở dữ liệu của dãy, When lượt bắt đầu, Then một người thử mang đủ bốn vai ở một sàn thử đăng
  nhập đúng một lần qua màn đăng nhập thật và mọi bài của bộ kiểm chung trong lượt ấy mở màn bằng phiên đó; và Given phiên bị
  xoá trước khi mở một màn cần đăng nhập, When chạy chính hàm kiểm của ca chính, Then nó đỏ với thông điệp ghim
  `<màn>: phien-thu — bi day ve dang nhap`.
- AC-2: Given sổ màn có màn `built` với `audience` `staff` hay `public`, When chạy bộ kiểm chung ở lượt có phiên, Then mỗi màn
  ấy — kể cả màn Thành viên — có đủ bốn bài khung (tiêu đề, không cuộn ngang, không lỗi trình duyệt, axe sáng và tối) cùng
  bốn ca phá của hàng 1f ở bốn khổ, và đều xanh; màn lưới có thêm bộ vùng như ở lượt không phiên.
- AC-3: Given lượt có phiên, When liệt kê màn bị bỏ, Then không màn nào bị bỏ vì cần đăng nhập (dòng in
  `bo qua can dang nhap: 0`), danh sách `SESSION_SCREENS` không còn; màn dành cho người chưa đăng nhập chỉ được bỏ khi nằm
  trong danh sách khai có lý do và màn ấy thật sự đẩy người đã đăng nhập đi — khai mà không đẩy thì đỏ.
- AC-4: Given lượt không có cơ sở dữ liệu (`make e2e`, CI), When một màn đẩy người chưa đăng nhập về trang đăng nhập, Then bài
  của màn ấy bị bỏ có tên với lý do `can dang nhap — do o luot co phien`, không bài nào xanh giả trên trang đăng nhập; các màn
  còn lại chạy như hàng 1f.
- AC-5: Given một trang có ngăn trượt trên điện thoại, When bài kiểm mở ngăn qua hàm dùng chung, Then hàm chỉ trả về khi ngăn
  hiện và mọi chuyển động trên trang đã dừng; và Given ngăn mang chuyển động không dừng hoặc nút mở bị gỡ, When gọi chính hàm
  ấy, Then nó đỏ với thông điệp ghim `ngan chua dung` hoặc `ngan khong mo`.
- AC-6: Given băng báo (như băng mất mạng) xuất hiện sau một sự kiện, When bài kiểm chờ nó qua hàm dùng chung, Then hàm chờ
  tới khi băng hiện và đứng yên với hạn đủ cho máy giảm tốc bốn lần; và Given băng không bao giờ hiện, When gọi chính hàm ấy,
  Then nó đỏ với thông điệp ghim `<tên>: khong hien`.
- AC-7: Given các bài kiểm có mở ngăn hay chờ băng báo (khung, App Shell, Thành viên), When đọc mã của chúng, Then mọi lần mở
  ngăn và chờ băng đi qua hai hàm dùng chung, không còn bản chép riêng.
- AC-8: Given máy giảm tốc bốn lần, When chạy các bài chờ ngăn và băng báo lặp hai mươi lần ở khổ 360 và 1024 (lượt không
  phiên) và bài mở ngăn của màn Thành viên lặp hai mươi lần (lượt có phiên), Then không lần nào đỏ; và Given bộ hãm không làm
  máy chậm được ít nhất 2,5 lần, When lượt lặp bắt đầu, Then lượt đỏ ngay `ham cpu khong co tac dung`, KHÔNG tính là đã lặp.
- AC-9: Given danh sách ca phá của hàng 1f trên nhánh chính, When liệt kê ca phá sau vòng này, Then không ca nào mất hay đổi
  thông điệp ghim; và `make check`, `make e2e` cùng toàn bộ lượt có cơ sở dữ liệu (mọi bài cũ của hàng 8, 9, 1m, 1o cộng bài
  mới) đều xanh.

## Coverage

Quét bằng skill `morphological-scan` (preset test-matrix, chế độ máy tự trả lời).

Chân sản phẩm: sổ màn và cách vào màn `[SUY-TỪ-REPO: design/screens.yaml]`, `[SUY-TỪ-REPO: src/app/(app)/members/page.tsx]`,
`[SUY-TỪ-REPO: src/app/login/page.tsx]`; hai cấu hình Playwright `[SUY-TỪ-REPO: playwright.config.ts]`,
`[SUY-TỪ-REPO: playwright.db.config.ts]`; CI không có Postgres `[SUY-TỪ-REPO: .github/workflows/ci.yml]`. Chân ngành: cách
tài liệu Playwright làm đăng nhập cho bài kiểm — một dự án chuẩn bị đăng nhập một lần rồi lưu trạng thái trình duyệt
`[NGÀNH: Playwright — Authentication, setup project + storageState]`; chờ bằng khẳng định tự đợi thay cho đếm ngay
`[NGÀNH: Playwright — auto-waiting, web-first assertions]`; lặp để bắt bài chập chờn `[NGÀNH: Playwright — --repeat-each]`.

| Trục | Giá trị | Thước CE |
|---|---|---|
| Cách vào màn | mở khi chưa đăng nhập · cần đăng nhập · dành cho người chưa đăng nhập · dev · planned | sổ màn + hành vi chuyển hướng của từng trang |
| Lượt chạy | không cơ sở dữ liệu (CI) · có cơ sở dữ liệu với phiên thử | hai cấu hình Playwright |
| Trạng thái phiên khi mở | còn phiên · mất phiên | ca chính + ca phá AC-1 |
| Chỗ chờ | ngăn trượt điện thoại · băng báo | hai lần trượt của 1o; hộp thoại và câu báo đăng nhập: Later |
| Nhịp máy | thường · giảm tốc 4×, lặp 20 | bộ hãm của 1f tự chứng hãm có tác dụng |

Core: cần đăng nhập × có phiên × còn phiên (AC-2) · cần đăng nhập × có phiên × mất phiên (AC-1) · cần đăng nhập × không cơ
sở dữ liệu (AC-4) · dành cho người chưa đăng nhập × có phiên (AC-3) · ngăn và băng × giảm tốc lặp 20 (AC-5, AC-6, AC-8).
Later: hộp thoại và câu báo của màn đăng nhập (đang dùng `waitForTimeout` ở `tests/e2e-db/`) đổi sang hàm chờ — mục riêng ·
ma trận vai × màn (hàng 9b). Never: phiên giả không cần cơ sở dữ liệu trong mã sản phẩm — mở đường tắt vào mô-đun danh tính.

## Đường đo

- «Mở được màn cần đăng nhập, đo khung và trợ năng như màn thường»: số bài khung xanh của từng màn ở lượt có phiên — từ lệnh
  `kiem_chung_phien` · AC-1, AC-2 bảo đảm.
- «Danh sách bỏ qua vì cần đăng nhập về rỗng»: dòng `bo qua can dang nhap: 0` của lượt có phiên · AC-3 bảo đảm.
- «Chờ hiện hẳn rồi mới đo, lặp hai mươi lần dưới máy giảm tốc vẫn xanh»: số lần đỏ trên tổng số lần chạy — từ lệnh
  `kiem_chung_lap` và `kiem_chung_lap_phien` · AC-5, AC-6, AC-8 bảo đảm.

## Vai × Màn

Không áp: hàng này dùng một phiên mang đủ bốn vai để mở mọi màn ở trạng thái thường. Đi từng cặp vai × màn là hàng 9b
(`kiem-vai-theo-man`), cần bảng quyền của hàng 9a. Dòng «Vai × Màn» của bộ kiểm chung vẫn in «chờ bảng quyền».

## Out of scope

- Ma trận vai × màn, bài «vai này thấy gì trên màn kia» — hàng 9b.
- Theo câu trả lời Hỏi-1: nếu chủ kho chọn khuyến nghị thì việc thêm Postgres vào CI là một hàng lộ trình riêng (máy gửi
  yêu cầu hàng mới cho giám sát ngay sau Cổng Phạm vi, đứng trước hàng 10); nếu chủ kho chọn lối khác thì hợp đồng thêm một
  tiêu chí cho bước e2e của CI chạy lượt có phiên và mục này bỏ.
- Đổi `waitForTimeout` trong các bài đăng nhập của hàng 8, 1m sang hàm chờ — mục riêng, không làm lệch phép đo đã ký.
- Sửa mã sản phẩm (màn, App Shell, mô-đun danh tính): vòng này chỉ sửa bài kiểm và công cụ kiểm.

## Notes

- Known limits: lượt không phiên trên CI không đo màn cần đăng nhập; nó giao màn ấy cho lượt có phiên bằng tên. Gỡ khi CI có
  Postgres.
- Known limits — chọn ở Cổng Bằng chứng 2026-11-12:
  - Ngoài-1: mỗi lượt kiểm trình duyệt để lại một thư mục dựng tạm trên máy làm việc, không ai dọn, nên đĩa đầy dần.
  - Ngoài-2: khi chờ ngăn hay băng báo hỏng vì lý do khác (trang sập), câu báo vẫn là câu cố định, che nguyên nhân thật.
  - Ngoài-3: cùng gốc với Ngoài-1 — lượt kiểm thường lệ cũng để lại thư mục dựng tạm không dọn.
  - Ngoài-5: phép thử chiều đỏ của nhãn lặp dựng trên danh sách đã lọc sẵn, chưa thử gỡ nhãn thật trên bản sao bài kiểm.
