# Kế hoạch dựng — Hỏi đầu chủ và Báo sai thông tin căn (hàng 3e)

Dựng khi bộ phát lịch giao hàng (sau 6, 2c, 3f — trùng tệp thân hồ sơ). Trước khi dựng: gộp `origin/main` một lần, `make gen`,
`npm ci` nếu tệp khoá đổi. Mọi việc tuần tự trong một nhánh (các việc chạm chung tệp hồ sơ), nên không việc nào `independent`.
Viết theo khuyến nghị của Hỏi-1…Hỏi-3; chủ kho chọn khác thì sửa kế hoạch trước khi dựng.

| # | Việc | Tệp | Kiểm từng việc | Phục vụ | independent |
|---|---|---|---|---|---|
| 1 | Hai nhãn hành động `AskListAgent` «Hỏi đầu chủ», `ReportUnitError` «Báo sai thông tin» (kind action, own: true); `make gen` commit riêng chỉ gồm tệp sinh | `ontology/labels.yaml`, `src/generated/**` | `make ontology`, `npx vitest run tests/language.test.ts` | E9c | false |
| 2 | Tiện ích bảng chia sẻ: `openShare({text,url?}, device)` → `chia-se · da-chep · huy · loi`, gọi share trước mọi await; bài kiểm ma trận ba máy × kết cục, mỗi ô một assert, cặp phá thử | `src/lib/share/index.ts`, `src/lib/share/share.test.ts` | `npx vitest run src/lib/share` | E3, E8b | false |
| 3 | Người giữ căn mẫu MAU: hàm thuần `sampleHolderOf(listingId)` → người khác (`[Tên] 0x`) · chính người xem · chưa ai, xác định theo số hàng; dòng Bảng hàng mang thêm trường ẩn `holder` | `src/modules/listings/sample.ts`, `src/modules/listings/ui/inventory-rows.ts` | `make test` | E1, E4, E5 | false |
| 4 | Hàm soạn chữ hai tin (thuần) ở cửa `listings/index.ts`: `askListAgentMessage(view, origin)`, `unitErrorReport({...})`, `canSendReport`, trần 200/500; năm thuộc tính danh mục báo sai được | `src/modules/listings/messages.ts`, `src/modules/listings/index.ts` | `npx vitest run tests/hoi-dau-chu-bao-sai.test.tsx` | E2, E6, E7 | false |
| 5 | Khe `footer` của khung hồ sơ dùng chung: vẽ ngoài vùng cuộn ở cả hai cách mở, `data-slot="record-footer"` (chạm tệp xin ở V-7) | `src/components/candidate/record-panel.tsx`, `src/components/candidate/data-region.tsx` (chỉ truyền khe) | `npx vitest run tests/ho-so-can.test.tsx`, `make test` | E1, E5b | false |
| 6 | Nút «Hỏi đầu chủ»: đọc `useActionPermission('viewListings', false)`, ẩn khi người xem giữ căn, tắt khi chưa ai giữ, gọi `openShare`, thông báo qua `notify`; chữ câu báo ở tệp chữ | `src/modules/listings/ui/ask-list-agent.tsx`, `src/modules/listings/ui/listing-copy.ts`, `src/modules/listings/ui/listing-record.tsx` (trả `footer`) | `npx vitest run tests/hoi-dau-chu-bao-sai.test.tsx` | E2, E3, E4, E5 | false |
| 7 | Nút và hộp «Báo sai thông tin»: dòng đầu mục thuộc tính, `FormDialog`, Select năm thuộc tính, hai ô có trần, ba dòng báo kết cục, đóng là xoá | `src/modules/listings/ui/report-unit-error.tsx`, `src/modules/listings/ui/listing-record.tsx` | như việc 6 | E6, E7 | false |
| 8 | Bài trình duyệt bốn khổ: thanh đáy dính, chạm 44 px, đường dẫn mở đúng căn, không yêu cầu mạng, axe sáng tối 8 lượt; bài luật SP-3 và cửa quyền; thêm `/inventory` hồ sơ vào bài trợ năng | `tests/e2e/hoi-dau-chu-bao-sai.spec.ts`, `tests/hoi-dau-chu-bao-sai-luat.test.ts` | `npx playwright test tests/e2e/hoi-dau-chu-bao-sai.spec.ts` | E1, E2b, E5b, E8, E8b, E9 | false |
| 9 | Ghi chép: một dòng `wiki/log.md`; `design/behaviors.md` thêm hai dòng vào bảng «Bộ nút theo quyền» (nút dính đáy hồ sơ; nút của một mục trong hồ sơ); `wiki/entities` của Listing ghi người giữ căn là dữ liệu mẫu tới hàng 10 | `wiki/log.md`, `design/behaviors.md`, `wiki/entities/listing.md` | `make ontology` | — | false |
| 10 | `make check` xanh; ảnh bốn khổ sáng tối cho Cổng Bằng chứng | — | `make check`, `make e2e` | mọi E | false |

Vùng mã của hàng: `src/lib/share/**`, `src/modules/listings/**` (chỉ chỗ gắn ở thân hồ sơ), `src/components/candidate/record-panel.tsx`
(khe đáy), `ontology/labels.yaml` (hai dòng), `tests/hoi-dau-chu-bao-sai*`, `tests/e2e/hoi-dau-chu-bao-sai.spec.ts`.
