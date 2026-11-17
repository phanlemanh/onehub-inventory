# Bàn giao — hàng 3g (sua-thong-tin-can), sau lượt chấm 1

Nhánh `feat/sua-thong-tin-can`, worktree `agitated-einstein-ff1c68`, dãy H. Cổng Phạm vi đã duyệt (lối C). Lượt 1 REJECT
(`evidence-report.md`, `review-findings.md`). Giám sát G-1711-37 cho sửa hết ở lượt 2. Lượt 2 chạy khi s4 trống (R đi trước).

## Đã sửa sau lượt 1 (chưa commit lúc ghi trang này thì commit cùng)

- Dán vào cột chi tiết rồi hoàn tác/hỏng làm mất giá trị cũ: `use-listing-cell-edit.tsx` giữ giá trị cũ cho mọi ô có kiểu.
- Bài DB chụp ảnh qua cửa chung (`chupAnh`): `tests/e2e-db/sua-thong-tin-can.spec.ts`.
- Bước E2-ui chỉ định căn 1101 (thiếu Tài chính).

## Còn phải làm trước lượt 2 (mục ở `review-findings.md`)

1. Bài «đạt giả được» (luật đợt 1, sửa trong hàng): ma trận 4 vai × PATCH details (`tests/sua-thong-tin-may-chu.test.ts`
   dùng cửa trả theo vai thật); ca `o-rieng-quan-tri-khong-mo` + đối chứng Đầu chủ; thông điệp ghim khớp ca phá; `khong-bang-ma-thu-hai`
   quét cả `case 403:` sau switch status; `dan-cot-rieng` thêm «không có lựa chọn»; `thong-bao-dung-cho-khi-khong-ho-so` đo vị
   trí thông báo thật; `quan-tri-khong-nut: ô` có đối chứng Đầu chủ mở được; đối chứng `doi-chung` gắn đúng ca phá.
2. Lỗi mã: 409 ở ô cột riêng hiện bản mới nhất (cellsOf/conflict cho ô có kiểu); hoàn tác sau sửa pháp lý dài từ tệp không báo
   sai (undoOf chỉ gửi phần đã đổi, và trường cũ dài không gửi lại); kết cục `invalid` có câu riêng («máy chủ không nhận»,
   không phải «Không đủ quyền»); route trả lỗi máy chủ khi không đọc được lớp riêng (không `field-retired`) + bài cho nhánh ấy.
3. Trần 500 và kiểm ngày: trang gửi trần của trường; ngày dùng một luật.
4. Câu mô tả hộp lấy chữ khái niệm từ nhãn (Hiện trạng) và chữ «căn» từ nhãn Unit.
5. Ontology (G mở): yêu cầu `cham-tep` cho `ontology/entities/listing.yaml` — CHỈ THÊM: luật `details-locked-when-closed`,
   trần 200 cho legalStatus/financing, ô vòng đời `sua_ngoai_gia` → `co: updateListing`; `make gen`; nêu ở PR và Cổng
   Bằng chứng «có đổi ontology, cần người xem». Dãy D gộp sau.

## Lệnh

- Bài đơn vị: lệnh `executors.test.sua_thong_tin_unit`; trình duyệt: `sua_thong_tin_e2e`; DB: `sua_thong_tin_e2e_db`
  (DB_LANE=h DB_PORT=5567, container `onehub-inventory-db-h` đang chạy). `make check` phải xanh.
- Lượt chấm: xin `s4` → `s4-args.mjs --slug sua-thong-tin-can --root . --out _acceptance/sua-thong-tin-can/s4-args.json
  --carry-anchor <sha lượt 1: 2e4292f>` → Workflow `acceptance-verify.js` (bản có nhúng tham số ở scratchpad là cách phiên
  này dùng để lời gọi nhỏ). Máy dev 3487 chế độ mẫu cho bài nhìn.
- Hồ sơ đã ghim lại ở lượt này: bang-hang-ban-doc, luu-goc-nhin-cot-hai, ho-so-du-thong-tin, da-gui-tren-luoi;
  bo-o-tim-cua-vung để nguyên (E18 gắn PR cũ).

## Cập nhật sau các commit sửa lượt 1 (tới d97869c)

Đã xong: route trả 500 khi không đọc được lớp riêng (+ `tests/sua-thong-tin-route.test.ts`); hai luật trong
`ontology/entities/listing.yaml` (G-1711-38 duyệt H-12, make gen); 409 ở ô cột riêng hiện giá trị máy chủ; hộp nói «máy chủ
báo lỗi» thay vì «Không đủ quyền» khi 400; không có «Hoàn tác» khi chữ dài từ tệp không ghi lại được; thông điệp ghim khớp ca
phá; quét bắt `switch (response.status)`; dán sai kiểu số; ca vai của ô riêng.

Còn lại trước lượt 2:
- Ma trận 4 vai × PATCH details ở `tests/sua-thong-tin-may-chu.test.ts` (cửa trả theo `allowedScope(roles, "updateListing")`).
- `thong-bao-dung-cho-khi-khong-ho-so` đo vị trí thông báo thật (sửa giá trên ô ở khổ rộng, đáy thông báo cách đáy cửa sổ ≤ 40px).
- `quan-tri-khong-nut: ô` thêm đối chứng Đầu chủ mở được ô (cùng bài DB).
- Một ca nối thật cửa lưu → móc sửa → hộp (thay đáp viết tay): `httpSaveDoor` qua handler thật trả 401 → hộp nói phiên hết hạn.
- Trần 500: trang gửi `TEXT_VALUE_LIMIT` của lớp riêng cho cột chữ; bỏ hằng sao chép trong `custom-rules.ts`.
- Câu mô tả hộp và câu «căn vừa đổi» lấy chữ từ nhãn (DetailsWords, Unit).
- Rồi: `make check`, bài trình duyệt và DB của hàng, xin s4, s4-args `--carry-anchor 2e4292f`, chấm lượt 2.

## Trạng thái tại 450d92e

Mọi mục G-1711-37 cho sửa đã làm; `make check` xanh. Việc kế: xin `s4`, sinh tham số với `--carry-anchor 2e4292f`, chấm lượt 2
(trần 3 lượt). Lượt 2 xanh → thẻ Cổng Bằng chứng (nêu: đổi ontology cần người xem; năm hồ sơ sửa sau ký; ảnh trước/sau
của nền mờ và thông báo), PR sẵn sàng, trình tại phiên H.

## Lượt chấm 2 (bàn giao đợt bg-20261117T080658Z)

Lượt 2 REJECT (`evidence-report.md`, `review-findings.md`, run-log đã ghi). Chỉ một bài trượt: **E13-ui** — ở 1024, cuộn sang
phải không thấy cùng lúc cả bốn cột Nội thất, Pháp lý, Tài chính, Hiện trạng (hai cột ghim Căn, Toà chiếm chỗ); ở 1440 đạt.
Mọi bài máy khác đạt. Không mục nào trong hợp đồng bị trả.

Việc kế cho phiên nối (lượt 3 là lượt cuối theo trần):
1. E13-ui: chọn MỘT — (a) bước đo ở 1024 cuộn tới từng cột và chụp từng cột (không nới lời kiểm «có đủ bốn cột»), hay (b)
   cột chi tiết hẹp hơn để vừa khung 1024. Khuyên (a) nếu G cho, vì 1024 thấy trọn bốn cột là điều chủ kho chưa hứa.
2. Sáu mục ngoài hợp đồng mới: một lỗi thật nên sửa — hoàn tác ô chi tiết / dán khi pháp lý hay tài chính cũ dài hơn 200 vẫn
   gửi lại chữ dài (máy chủ từ chối); thêm: `customProblem` bỏ mặc định 500; xoá giá trị riêng không đổi gì thì không ghi; hồ sơ
   ở mức cao vì chạm ontology — PR phải nêu cần người xem.
3. Xin `s4`, `s4-args.mjs ... --carry-anchor <sha lượt 2: generated_sha trong s4-args.json>`, chấm lượt 3.
