---
schema_version: 1
feature: Từ truy vấn của Bảng hàng và của bản mẫu hành vi viết bằng tiếng Anh như luật kho; liên kết đã dán và góc nhìn đã lưu vẫn mở đúng chỗ
slug: english-query-words
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [ui]
screens: []
status: signed-off
approved_by: Manh Phan
approved_at: 2026-11-23T09:20:13Z
design_doc: docs/superpowers/specs/2026-11-23-english-query-words-design.md
---

# Acceptance Contract: english-query-words

## Context

Hàng lộ trình 1v, qua Cổng Đáng 2026-11-23. `AGENTS.md` đòi mã và định danh bằng tiếng Anh; PR #114 đã đổi hai địa chỉ và để
từ truy vấn của Bảng hàng sang hàng này. Bảng cũ → mới (chi tiết ai đọc, ai ghi: design doc; sáu từ không có trong từ điển chờ Hỏi-3):

| Cũ | Mới | Loại |
| --- | --- | --- |
| `?ma=` · `?toa=` · `?du-an=` | `?unit=` · `?building=` · `?subdivision=` | liên kết (ô tìm) |
| `?ho-so=<id>` | `?record=<id>` | liên kết (ngăn hồ sơ căn) — tên chờ Hỏi-3 |
| `?vung=<nơi>` | `?place=<nơi>` | liên kết (cây địa lý) |
| `?goc-nhin=<id>` | `?view=<id>` | liên kết (góc nhìn đã lưu) |
| `?vai=<Role>` | `?role=<Role>` | công tắc dev |
| `?mau=bien` | `?sample=edge` | công tắc dev |
| `/proto/[slug]?quyen=khong` | `?permission=denied` | công tắc dev |

Luật sản phẩm: không luật nào bị chạm — vòng không đổi truy vấn dữ liệu, cách gửi tin hay trang khách.

## Criteria

- **AC-1:** Given Bảng hàng có dữ liệu, When mở `/inventory` với `?unit=`, `?building=` hoặc `?subdivision=`, Then lưới mở
  với lọc cột như ô tìm đang mở bằng `?ma=`, `?toa=`, `?du-an=`; tìm ra đúng một căn thì địa chỉ chuyển sang
  `?record=<id>` và ngăn hồ sơ căn mở.
- **AC-2:** Given Bảng hàng, When mở với `?record=<id>`, `?place=<nơi>` hoặc `?view=<id>`, Then ngăn hồ sơ căn, nơi trên cây
  địa lý (lọc Dự án, Toà và nơi sáng) và góc nhìn đã lưu mở như từ cũ từng mở; id không còn thì câu báo như trước.
- **AC-3:** Given người dùng thao tác trên Bảng hàng, When mở hay đóng ngăn hồ sơ, chọn một nơi trên cây, mở hay lưu một góc
  nhìn, chọn một gợi ý ô tìm, hay chép tin hỏi đầu chủ, Then mọi địa chỉ sản phẩm ghi ra (thanh địa chỉ, liên kết cột thứ
  hai, đường dẫn trong tin nhắn) chỉ mang từ mới.
- **AC-4 (cross-layer):** Given một liên kết cũ mang một hay nhiều từ `ma`, `toa`, `du-an`, `ho-so`, `vung`, `goc-nhin`, When mở, Then
  trang chuyển hướng một lần sang cùng địa chỉ với từ mới, giữ nguyên giá trị (kể cả `?vung=` lặp lại) và mọi tham số khác,
  rồi mở đúng chỗ như AC-1, AC-2; có cả từ cũ lẫn từ mới cùng nghĩa thì từ mới thắng; chưa đăng nhập thì `next=` của trang
  đăng nhập mang địa chỉ từ mới, và đăng nhập xong về thẳng địa chỉ mới — đúng một bước chuyển hướng dịch. (Chờ Hỏi-1.)
- **AC-5:** Given công ty mẫu ngoài bản thật, When mở `/inventory?role=<Role>`, `/inventory?sample=edge` hay
  `/proto/hanh-vi-trong-luoi-khung?permission=denied`, Then trang đổi như `?vai=`, `?mau=bien`, `?quyen=khong` từng đổi; ba từ
  cũ không còn tác dụng và không được dịch; trên bản thật cả ba từ mới không đổi gì.
- **AC-6:** Given góc nhìn đã lưu trong cơ sở dữ liệu, When vòng này gộp, Then không có migration mới và không bảng nào lưu từ
  truy vấn: `saved_view.view` chỉ có `{query, filters, sort, grouped, hidden}`, `filters` khoá theo tên trường; góc nhìn đã lưu
  trước vòng mở được bằng `?view=<id>`.
- **AC-7:** Given cây sau vòng, When quét `src/`, `tests/`, `tools/deploy/`, `tools/e2e_templates/` và `design/` bằng chín từ cũ
  trong mười một ngữ cảnh đọc hay ghi truy vấn (kể cả `has`, `delete` và khoá của object dựng địa chỉ), Then số chỗ chạm ngoài danh sách giữ bằng 0; danh sách giữ (`rang/giu.txt`, ghim ở
  mục Notes) chỉ gồm bảng dịch của AC-4 và các ca bài kiểm chứng từ cũ được dịch hay không còn tác dụng.
- **AC-8:** Given mọi bài kiểm và cổng trỏ từ cũ, When chạy `make check`, `make e2e`, các bài có Postgres của Bảng hàng
  (`bang-hang-that`, `dia-ly`, `goc-nhin`, `hoi-dau-chu-bao-sai`) và `tools/deploy/thu-ban-dung.sh`, Then tất cả xanh với từ
  mới; `design/behaviors.md` và trang wiki thực thể nói từ mới, nhật ký wiki có một dòng cho vòng này.

## Vai × Màn

Hợp đồng không khai màn: vòng chỉ đổi từ truy vấn, không đổi dáng, chữ hay quyền của màn nào; khai `screens:` sẽ bắt dựng lại
tệp chứng minh màn của Bảng hàng cho một màn trông y như cũ. Quyền theo vai của Bảng hàng không đổi (hàng 2b, 4, 10).

## Coverage

Bỏ quét hình thái — xem dòng `descope` «bỏ coverage-scan» trong `decisions.jsonl`. Độ phủ là bảng cũ → mới ở mục Context: mỗi
dòng bảng có một tiêu chí đọc (AC-1, AC-2, AC-5), mọi chỗ ghi có AC-3, sáu từ liên kết có AC-4; lệnh quét chữ cũ (AC-7) đo
chín từ trên năm vùng, kèm cặp phá thử.

## Đường đo

- «Không còn từ truy vấn tiếng Việt nào được đọc trong src/ (lệnh quét có cặp phá thử)»: lệnh quét chữ cũ và chế độ tự thử của
  nó — AC-7.
- «make check, make e2e và bài trình duyệt có Postgres của Bảng hàng xanh với từ mới»: các lệnh của kho — AC-8.
- «góc nhìn đã lưu và liên kết có ?vung= cũ được xử lý theo lựa chọn của chủ kho»: bài đơn vị bảng dịch và ca trình duyệt mở
  liên kết cũ — AC-4, AC-6.

## Out of scope

- Tên tệp bài kiểm tiếng Việt (`tests/e2e/the-dien-thoai.spec.ts`, `tests/e2e-db/goc-nhin.spec.ts`…) và khoá `executors.*`
  trong `_acceptance/config.yaml`: hồ sơ đã ký chạy lại chúng bằng đúng tên ấy.
- Định danh tiếng Việt không phải từ truy vấn: tên nhóm bài `vung` của `tools/e2e_templates/suite.ts` (vùng của màn), cột
  `vai` của dòng kiểm vai nối (`src/modules/identity/health.ts`), mã dòng mẫu `bien-<n>`.
- `/proto/permitted-actions` và `?part=` của `/company-layer`: đã đổi ở PR #114.
- Thư mục `_acceptance/`, trang quyết định wiki cũ, kế hoạch và thiết kế cũ trong `docs/`: là sử liệu, giữ chữ lúc viết.

## Notes

- Bước làm bắt đầu sau khi PR #114 gộp (hoặc gộp nhánh của nó vào đây trước): hai bên cùng sửa
  `tools/deploy/thu-ban-dung.sh` và `tests/e2e/bo-nut.spec.ts`.
- Danh sách giữ ghim (`rang/giu.txt`; tệp : lý do) — viết hết ở bước làm, Cổng Bằng chứng soi lại:
  - tệp bảng dịch của module `listings` : bảng dịch sáu từ liên kết của AC-4
  - bài đơn vị của bảng dịch : ca chứng từ cũ được dịch, công tắc dev cũ không được dịch
  - bài trình duyệt mở liên kết cũ : ca AC-4
  - bài trình duyệt hay bài đơn vị chứng `?vai=`, `?mau=bien`, `?quyen=khong` không còn tác dụng : ca AC-5
- Known limits — chọn ở Cổng Bằng chứng 2026-11-23:
  - Ngoài-1: ca đối chứng liên kết tiếng Anh không thể đỏ; một lần tải lại thừa trên liên kết mới sẽ không bị bắt.
  - Ngoài-2: cùng ca đối chứng ấy là một khẳng định phủ định chưa có đối chứng dương thật.
  - Ngoài-3: ảnh bước 2 của bàn chấm liên kết cũ trùng ảnh bước 1, nên hồ sơ thiếu ảnh chứng địa chỉ mới.
  - Ngoài-4: bộ đếm bước dịch tính mọi lần tải trang không còn từ cũ đứng sau một trang có từ cũ, không kiểm đó đúng là bước dịch.
  - Ngoài-5: thay đổi chạm công cụ kiểm tra được bảo vệ của kho, nên gộp cần chủ mã duyệt.
  - Ngoài-6: luật giữ mã màn cũ khi đổi tên màn chưa có trang quyết định riêng.
  - Ngoài-7: từ công tắc quyền của bản mẫu hành vi được viết ở hai chỗ, đổi một chỗ có thể quên chỗ kia.
  - Ngoài-8: ca ghi của ngăn hồ sơ chỉ so hai hằng, chưa thử địa chỉ thật được ghi ra.
  - Ngoài-9: chưa có ca chứng từ tìm cũ đứng một mình không còn lọc Bảng hàng.
  - Ngoài-10: ca đi qua trang đăng nhập chưa nối hai bước với nhau; ca trình duyệt phủ phần còn lại.
  - Ngoài-12: ca liên kết cũ qua trang đăng nhập chỉ kiểm có từ nơi, không so giá trị nơi.
