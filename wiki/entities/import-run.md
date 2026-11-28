---
type: entity
title: ImportRun (Lần nhập)
links:
  [
    ontology/entities/ImportRun.yaml,
    ontology/entities/ImportTemplate.yaml,
    ontology/entities/PendingUnit.yaml,
  ]
sources:
  [
    "_acceptance/nhap-excel/contract.md",
    "_acceptance/danh-muc-can-nhu-onehub-invest/de-xuat-nhap-la-luc-anh-xa.md",
    "docs/tri-thuc/wiki/chu-de/nhap-excel.md",
  ]
---

# ImportRun (Lần nhập)

## Definition

Một lần người trong sàn nạp tệp bảng tính (`.xlsx`, `.csv`) vào Bảng hàng: ai nạp, cho đầu chủ nào, dạng tệp, thêm bao
nhiêu căn, sàn học được gì từ lựa chọn của người, ô nào giữ chữ gốc, đã hoàn tác chưa. Không phải bản thân tệp — tệp được
đọc trên trình duyệt và không lên máy chủ.

## Rules

- Năm chỗ ghép: cột, tên cột, giá trị, căn, dạng tệp; mỗi ô đúng một dấu (giữ nguyên · máy sửa · cần người · chặn) và
  một đích; còn ô chặn thì không áp được.
- Áp theo gói 200 dòng; gửi lại một gói không ghi trùng; sàn học một lần sau gói cuối.
- Mỗi gói phải là đúng phần bảng đã mở: lúc mở máy ghi dấu vân tay của tên cột, lựa chọn và từng gói 200 dòng; gói lệch
  dấu, sai chỗ hay vượt số dòng thì 409 và không ghi gì. Dòng người đã bỏ tính theo vị trí trong cả tệp.
- Cột số hay tên chủ nhà chỉ có một lối là bỏ cột, kể cả khi mẫu nhập cũ trỏ nó đi đâu (Hỏi-12).
- Trưởng nhóm chọn Đầu chủ trên màn trước khi áp; danh sách chỉ có mã và tên (`GET /api/v1/imports/list-agents`,
  hàm `app.import_list_agents()` của migration 016). Từ migration 019, vai «của mình» gọi hàm thì chỉ thấy chính mình, và
  chỉ gắn được căn vào lần chào mình giữ (`db/migrations/019_nhap_excel_moi_noi_cua_minh.sql`).
- Mã căn dài quá 80 ký tự và trường riêng sàn không thêm được bị chặn ở bước xem trước; máy chủ không bao giờ bỏ lặng lẽ
  một dòng hay một cột đã hứa.
- Hoàn tác gỡ các căn của lần nhập chưa ai sửa, ngừng dùng những gì chính lần nhập dạy, và liệt kê căn được giữ.
- Cột thuộc tính căn (diện tích, phòng ngủ, hướng, tầng, loại hình) được nhận nhưng không ghi vào căn hay danh mục
  chung: chữ gốc giữ nguyên văn trong bản ghi lần nhập (`kept`, lý do `unit-attribute`) cho hàng 3h đọc lại (G-2711-4).
- Cột giá bán và ngày bán được đọc (để hỏi khi thiếu) nhưng không ghi lên căn, vì lần chào do nhập tạo ra không ở «Đã
  bán»: chữ gốc giữ trong bản ghi lần nhập (`kept`, lý do `close-field`).
- Chữ toà chỉ ghi lên căn chờ mới mà dòng tạo ra; dòng của căn đã có giữ chữ toà nguyên văn trong bản ghi lần nhập
  (`kept`, lý do `unit-attribute`).
- Giá trị người chọn cho một ô của trường chọn-một mới tạo khi nhập được ghi lên căn dù người không bấm «nhớ».
- Không AI.

## Where in the code

`src/modules/imports/` (luật dấu, lưu lần nhập, cửa `/api/v1/imports`), bảng `import_runs` ở migration 015, dấu vân
tay của bảng đã mở ở migration 017. Lần chào tạo
qua cửa server của `src/modules/listings/`; phần học qua `src/modules/company-config/` và `src/modules/catalog/`.

## History

- 2026-11-17 — Thêm ở hàng 11 «Nhập Excel» (`_acceptance/nhap-excel/`), chủ kho duyệt Cổng Phạm vi.
- 2026-11-27 — Thêm hai chỗ ghép Tầng và Loại hình, giữ chữ gốc trong bản ghi lần nhập (G-2711-4, lời chủ kho «Tin rao
  giữ giá trị riêng»); Bảng hàng có nút «Nạp tệp» cho vai được nhập và liên kết trong câu trạng thái trống.
- 2026-11-27 — Sau lượt chấm 1: gói gắn với bảng đã mở (migration 017), dòng bỏ theo vị trí trong tệp, cột chủ nhà
  chỉ bỏ được, Trưởng nhóm chọn Đầu chủ trên màn, chặn mã quá dài và trường riêng bị từ chối ở bước xem trước.
- 2026-11-28 — Từ hai phát hiện của lượt chấm 1 hàng VP11: giá trị đã chọn cho trường chọn-một mới không còn mất khi
  không bấm «nhớ»; ô giá bán, ngày bán giữ chữ gốc trong bản ghi lần nhập thay vì bị bỏ.
