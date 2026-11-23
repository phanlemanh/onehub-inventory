# Từ truy vấn của Bảng hàng viết bằng tiếng Anh — thiết kế

Hàng lộ trình 1v · hồ sơ `_acceptance/english-query-words/` · hạng T3 · 2026-11-23.

## Vì sao

`AGENTS.md` đòi mã, định danh và tên tệp bằng tiếng Anh. Hồ sơ `english-route-names` (PR #114) đã đổi `/tuy-chinh-san` và
`/proto/bo-nut-theo-quyen`; ở Cổng Phạm vi của nó chủ kho tách tám từ truy vấn của Bảng hàng và `?quyen` của `/proto/[slug]`
sang hàng này. Chủ kho qua Cổng Đáng ngày 2026-11-23 («build»).

## Bảng cũ → mới

| Cũ                          | Mới                  | Ai đọc                                          | Ai ghi                                                                                    | Loại         |
| --------------------------- | -------------------- | ----------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------ |
| `?ma=`                      | `?unit=`             | trang Bảng hàng (ô tìm trên thanh trên)         | `searchHref`                                                                              | liên kết     |
| `?toa=`                     | `?building=`         | trang Bảng hàng                                 | `searchHref`, cây địa lý (xoá khi chọn nơi)                                               | liên kết     |
| `?du-an=`                   | `?subdivision=`      | trang Bảng hàng                                 | `searchHref`, cây địa lý                                                                  | liên kết     |
| `?ho-so=<id>`               | `?record=<id>`       | trang Bảng hàng, ngăn hồ sơ căn                 | `useRecordAddress`, chuyển hướng «tìm được một căn», tin nhắn hỏi đầu chủ (`messages.ts`) | liên kết     |
| `?vung=<nơi>`               | `?place=<nơi>`       | trang Bảng hàng (cây địa lý)                    | `use-geo-place`, liên kết của cây                                                         | liên kết     |
| `?goc-nhin=<id>`            | `?view=<id>`         | trang Bảng hàng, menu góc nhìn                  | `savedViewHref`                                                                           | liên kết     |
| `?vai=<Role>`               | `?role=<Role>`       | trang Bảng hàng, chỉ công ty mẫu ngoài bản thật | bài kiểm, `thu-ban-dung.sh`                                                               | công tắc dev |
| `?mau=bien`                 | `?sample=edge`       | trang Bảng hàng, chỉ công ty mẫu ngoài bản thật | bài kiểm thẻ điện thoại                                                                   | công tắc dev |
| `/proto/[slug]?quyen=khong` | `?permission=denied` | bản mẫu hành vi                                 | bài kiểm hành vi                                                                          | công tắc dev |

Ba từ của ô tìm theo từ điển; sáu từ còn lại theo tên trong mã và là câu hỏi cho chủ kho (Hỏi-3: lối khác là `listing=<id>`,
`saved-view=<id>` theo khái niệm dữ liệu). Căn cứ: `unit` · `building` · `subdivision` là ba loại tìm (`SearchKind`) và tên RESO
trong `ontology/glossary.md`; `record` là `RECORD_PARAM`/`recordId` của ngăn hồ sơ; `place` là `places` của cây địa lý;
`view` là `viewId` của góc nhìn đã lưu (`SavedView`); `role` khớp từ `role` của `/proto/permitted-actions` (PR #114);
`denied` là tên prop `denied` mà `?quyen=khong` đang bật.

## Liên kết đã dán (Hỏi-1)

Sáu từ «liên kết» có thể nằm trong liên kết người đã chép hay đã gửi: «Chép đường dẫn» của ngăn hồ sơ, tin nhắn hỏi đầu chủ
qua bảng chia sẻ của máy, liên kết góc nhìn, ô tìm. Khuyến nghị: trang Bảng hàng dịch các từ ấy một lần ở đầu trang — gặp
từ cũ thì chuyển hướng sang cùng địa chỉ với từ mới, giữ nguyên giá trị và mọi tham số khác; có cả từ cũ lẫn từ mới thì từ
mới thắng. Bảng dịch nằm ở MỘT tệp của module `listings` (danh sách giữ của lệnh quét gọi tên nó). Ba công tắc dev không
dịch: chúng chỉ chạy trên công ty mẫu, không ai gửi chúng cho người khác, và bản thật đã tắt chúng.

Lối khác: không dịch gì, như Hỏi-4 của PR #114 — rẻ hơn (không bảng dịch, không ca chuyển hướng), nhưng liên kết cũ mở Bảng
hàng trơn: ngăn hồ sơ không mở, góc nhìn không mở, lọc nơi mất. Câu giao của hàng đòi «liên kết đã dán và góc nhìn đã lưu
vẫn mở đúng chỗ», nên máy khuyên dịch.

## Góc nhìn đã lưu

Không cần đổi dữ liệu. Bảng `saved_view` (`db/migrations/009_goc_nhin.sql`) chỉ nhận `screen = 'inventory'` và cột `view`
là `{query, filters, sort, grouped, hidden}`; `filters` khoá theo tên trường (`Listing.buildingName`…), không theo từ truy
vấn. Góc nhìn mở bằng địa chỉ `?view=<id>` mà cột thứ hai dựng mới mỗi lần; liên kết góc nhìn cũ đi qua bảng dịch.

## Phụ thuộc PR #114

PR #114 đổi `/proto/bo-nut-theo-quyen` (đọc `?vai=`) thành `/proto/permitted-actions` (đọc `?role=`) và sửa
`tools/deploy/thu-ban-dung.sh`, `tests/e2e/bo-nut.spec.ts` — cùng các tệp hàng này phải sửa. Bước làm bắt đầu trên nhánh chính
sau khi #114 gộp (hoặc gộp nhánh của nó vào đây nếu nó chưa gộp lúc ấy); làm song song là xung đột chắc chắn.

## Đo

- Lệnh quét chữ cũ (`_acceptance/english-query-words/rang/query-words.mjs`): chín từ × các ngữ cảnh đọc/ghi truy vấn
  — mười một ngữ cảnh: `?w=`, `&w=`, `query.w`, `query["w"]`, `get("w")`, `getAll("w")`, `set("w"`, `has("w")`,
  `delete("w")`, hằng `…PARAM = "w"`, khoá `"w":` của object dựng địa chỉ hay của bảng `SEARCH_PARAM`) trên `src/`, `tests/`, `tools/deploy/`, `tools/e2e_templates/`, `design/`. Chỗ được giữ có tên và lý do
  ghim trong lệnh (`rang/giu.txt`). Có `--self-test`: một bản sao cho mỗi ô từ × ngữ cảnh (99 ô, xoay qua năm vùng), mỗi bản sao đỏ đúng ô đã cấy.
- Bài đơn vị cho bảng dịch: ma trận sáu từ liên kết × (chỉ cũ → chuyển · cả hai → mới thắng · không từ cũ → không chuyển),
  cộng hai công tắc dev của Bảng hàng không dịch. Bảng dịch chạy trước cổng đăng nhập của trang (proxy chỉ khớp `/proto`), nên
  `next=` mang từ mới và chỉ có một bước dịch; một ca trình duyệt trên Postgres chứng điều ấy.
- Góc nhìn: khứ hồi qua bộ ghi thật (`storedView` → `gridView`) với lọc theo nơi, toà, dự án — vật lưu không mang từ truy vấn nào.
- Bài trình duyệt hiện có của Bảng hàng (thẻ điện thoại, ngăn hồ sơ, cây địa lý, góc nhìn, hỏi đầu chủ, ô tìm) chạy với từ
  mới; một ca mở liên kết cũ và thấy địa chỉ mới với ngăn hồ sơ mở.
- `make check`, `make e2e`, bài có Postgres của Bảng hàng, và `thu-ban-dung.sh` (bản thật tắt `?role=`, `?sample=`).

## Không đổi

Dáng, chữ, quyền và trạng thái của mọi màn. Không bước thiết kế giao diện (design-pass) và không đặc tả UX: không dòng giao
diện nào đổi. Tên tệp bài kiểm tiếng Việt và khoá `executors.*` giữ nguyên vì hồ sơ đã ký chạy lại chúng bằng đúng tên ấy.
