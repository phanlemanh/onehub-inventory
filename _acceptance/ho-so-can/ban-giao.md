# Bàn giao — hàng 3 «ho-so-can» (dãy D, đợt «nen»)

Ngày 2026-11-12. Lý do: mức dùng tuần chạm 98%, chủ kho đổi tài khoản. Phiên mới nối hàng này trong chính worktree này.
Tệp này chỉ ghi điều git và hồ sơ chưa có; đọc `design.md`, `contract.md`, `evals.yaml`, `decisions.jsonl` cho phần còn lại.

## Đang ở đâu

- **Cổng Phạm vi, chờ chủ kho gõ** `/acceptance-gate:approve ho-so-can duyệt` (hoặc «Sửa: …») trong phiên của dãy D. Contract
  vẫn `draft`, chưa `approved_by`. Thẻ (`card.html`) đã dựng lại theo ngăn nổi; còn ba câu hỏi cho chủ kho (thẻ ánh số
  Hỏi-1..3): thẻ căn chưa ảnh và hướng · điện thoại chưa nút chính dính đáy · bấm ô chỉ chọn ô, mở bằng mã căn hoặc Enter.
- Trang thẻ tự chứa (thẻ + ảnh bốn khổ sáng tối nhúng sẵn) mới nhất:
  `/Users/manhphan/dev/onehub-inventory/.acceptance-runs/dieu-phoi-nen/trinh/ho-so-can-cong-pham-vi.html`. Dựng lại bằng
  `gate-card.js --plain _acceptance/ho-so-can/card-plain.json` rồi nhúng ảnh `evidence/ban-bam/ho-so-mo-*.png`
  (kịch bản chụp ở mục «Chạy lại» dưới).

## Lời chủ kho chốt trong phiên này (nguyên văn)

1. «Lấy B có ghim» — ngăn nổi (lối B) là cách chung cả ứng dụng để xem chi tiết một dòng và chỗ của lớp AI; ghim thành cột
   là hàng sau (3a), AI chưa thành hàng.
2. «Trừ thanh trên» — ngăn chạy từ ngay dưới thanh trên của App Shell tới đáy màn hình; toàn màn thì cao hết màn.
3. «Tôi thấy cụm nút trước sau đóng của sheet detail của trắng và đen đang không nhất quán. Tôi nghĩ như trắng hợp lý đặt
   top right.» — cụm Trước, Sau, Đóng luôn ở góc trên phải, mọi khổ.

Đã ghi: dòng `stage: gate1` trong `decisions.jsonl` (có `decided_by: Manh Phan`) và trang quyết định
`wiki/decisions/0024-ngan-noi-xem-chi-tiet.md` (1 và 2), cùng dòng `wiki/log.md` và mục lục `wiki/index.md`. G đã được báo
nguyên văn (tin D-1211-5, D-1211-7).

## Xong

- Bản bấm được trên Bảng hàng thật: `src/components/candidate/record-panel.tsx` (ngăn nổi tự đo thanh trên và vùng làm
  việc; điện thoại vẫn toàn màn bằng hộp thoại), `data-region.tsx` (khối `data-region-stage` bọc vùng các dòng và gắn ngăn),
  `src/modules/listings/ui/listing-record.tsx` (mô hình `listingView`, `ListingCard`, `ListingRecordBody`), `inventory-grid.tsx`
  nối `record`. Bài kiểm cũ `tests/behavior.test.tsx`, `tests/grid.test.tsx`, `tests/behavior-guard.test.ts` xanh 81/81.
- Lỗi ngày tràn ở 1024 (G-1211-27) đã sửa: ba thông số của thẻ xuống dòng khi ngăn hẹp.
- Trang quyết định 0024 (việc G-1211-31): đã viết; tin XONG cho G-1211-31 CHƯA gửi — gửi khi PR mở (việc giao là «trong PR
  của hàng 3»).

## Dở / bước kế (đúng thứ tự)

1. Chờ chủ kho gõ lệnh duyệt. Duyệt xong: `status: approved`, seal trong sổ, dán dòng `/goal` (in ở thẻ, `goal_line`).
2. S2 kế hoạch → S3: viết `tests/ho-so-can.test.tsx` (E1, E5, E6) và `tests/e2e/ho-so-can.spec.ts` (E2, E3, E4, E7, E9) đúng
   `expected` của `evals.yaml`, mỗi phép đo kèm ca phá ghim thông điệp. Còn nợ trong `evals.yaml`: phép đo **không tràn
   ngang** cho ngăn ở 1024 (G-1211-27 đòi) — thêm vào E2 hoặc E7 trước lượt chấm (scrollWidth của ngăn bằng clientWidth).
3. Sau khi chủ kho duyệt: thêm ba dòng `design/so-khoi.yaml` (RecordPanel ← sheet-9, ListingRecordBody ← solution-crm-4,
   ListingCard ← product-grid-4; `ho_so: ho-so-can`, `duyet` = ngày duyệt) — điều kiện (3) của D-3.
4. `design/behaviors.md` dòng «Mở hồ sơ cạnh bảng»: thêm phần ngăn nổi theo 0024 (chỉ thêm, không sắp lại — điều kiện 4 D-3).
5. S4: xin lượt `s4`, chấm, Cổng Bằng chứng, PR, gộp bằng `dieu-phoi.mjs gop` theo thứ tự gộp của LUAT.

## Ranh giới và thoả thuận

- D-3 (G duyệt chạm tám tệp, năm điều kiện): (1) `record-panel.tsx` của dãy D; ở `data-region.tsx` chỉ khối bọc và chỗ đặt
  ngăn, phím/chọn ô/lọc/sắp xếp/nhóm/ẩn cột là của dãy K; (2) khuôn của kho — đổi ở mọi nơi dùng, chạy lại bài kiểm mọi màn
  dùng data-region và record-panel; (3) `design/so-khoi.yaml` chỉ thêm dòng sau khi chủ kho duyệt; (4) `inventory/page.tsx`,
  `grid-copy.ts`, `design/behaviors.md` chỉ thêm phần hồ sơ căn; (5) hàng ký sau gộp main về và chấm lại phần bị đụng.
  Thêm (G-1211-31): `wiki/decisions/0024-*.md`, `wiki/log.md`.
- Với dãy K (hàng 2a, tin K-1211-9, K-1211-13, D-1211-6, D-1211-8): bấm ô chỉ chọn ô, mở bằng mã căn hoặc Enter (Enter là lối
  «mở dòng» 2a dựng); khi hồ sơ mở cột số dòng, Căn, Toà đứng yên, không tự ẩn cột; giữ khối `data-region-stage` khi gộp;
  toàn màn giữ ngăn mở, Esc lúc toàn màn để trình duyệt thoát toàn màn trước, lần sau mới đóng hồ sơ; nút Lọc, Cột, Toàn màn
  đặt sát ô tìm vì ngăn che phần phải thanh công cụ.

## Ghi chú hạ tầng

- Đường nền (`duong-nen.md`) đỏ không phải lỗi hàng này: lượt đầu thiếu phụ thuộc (đã `make setup`); lượt hai bị chính phiên
  này sửa cây giữa lượt, `make e2e` 638/639 (ca `pha vung trong` ở 360). Lượt chấm phải đo lại trên cây sạch.
- Máy chủ dev của dãy D: cổng 3483 (`npx next dev -p 3483 -H 127.0.0.1`); đã tắt khi bàn giao. `.claude/launch.json` không
  commit cấu hình riêng của dãy.
- Chạy lại ảnh: kịch bản chụp đã dùng nằm ở scratchpad phiên cũ (mất khi bàn giao); viết lại bằng Playwright: bốn khổ
  1440×900, 1024×768, 414×896, 360×800, sáng tối, mở `/inventory`, bấm mã căn thứ năm, chụp; đếm đầu cột thấy trọn bên trái
  mép `aside` của ngăn.
- Commit có hook end-of-file: lần commit đầu có thể trượt; kiểm `git log -1` rồi commit lại, đừng dùng `git commit -a` với
  tiêu đề khác.
