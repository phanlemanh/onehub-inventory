---
type: decision
title: Mô-đun nhập tệp dựa vào bốn mô-đun khác
links:
  [
    architecture/modules.yaml,
    src/modules/imports/store.ts,
    src/modules/imports/server.ts,
    tests/link-types.test.ts,
    _acceptance/nhap-excel/contract.md,
  ]
sources: [_acceptance/nhap-excel/decisions.jsonl]
---

# 0055 Mô-đun nhập tệp dựa vào bốn mô-đun khác

## Status

Accepted, 2026-11-28, cùng hàng 11 «Nhập Excel xem trước» (PR #130). Chủ kho duyệt phạm vi và kế hoạch ngày 17/11;
trang này ghi lại phần phụ thuộc giữa các mô-đun mà luật kho đòi có trang quyết định.

## Context

Hàng 11 thêm mô-đun `imports`: đọc một tệp Excel hay CSV, xem trước từng ô, rồi tạo lần chào hàng và dạy lớp riêng của
sàn những gì người đã chọn. Việc ấy chạm bốn khái niệm của bốn mô-đun khác: người và vai của sàn, danh mục căn, lớp riêng
của sàn, lần chào hàng. AGENTS.md cho phép một mô-đun dùng mô-đun khác chỉ qua cửa công khai của nó và chỉ khi
`depends_on` cho phép; thêm một phụ thuộc là đổi thiết kế, cần một trang quyết định.

## Decision

`imports` phụ thuộc vào `identity`, `catalog`, `company-config` và `listings`, khai ở `architecture/modules.yaml`:

- `identity`: mở cửa hành động (`openDoor`), đọc người đang đăng nhập và danh sách Đầu chủ mà Trưởng nhóm được nhập hộ.
- `catalog`: tra mã căn trong danh mục chung (mã gốc, mã riêng của sàn, bộ đọc mã).
- `company-config`: đọc lớp riêng của sàn để đánh dấu ô, và ghi những gì lần nhập dạy (nhãn, trường riêng, cách viết,
  mẫu nhập, căn chờ khớp) qua luật của hàng 7e.
- `listings`: tạo lần chào hàng qua cửa máy chủ của mô-đun ấy, để một luật tạo lần chào chỉ nằm ở một chỗ.

Không phụ thuộc nào đi ngược lại: không mô-đun nào trong bốn mô-đun trên gọi `imports`. Không có lời gọi AI trên đường
nhập (luật H5 của hàng 11).

## Consequences

- `tools/boundaries.py` và `tests/link-types.test.ts` giữ đúng bốn cạnh này; một cạnh mới làm `make check` đỏ.
- Mã của `imports` hiện còn viết thẳng câu SQL trên vài bảng của mô-đun khác (danh sách ở mục «Ngoài hợp đồng» của thẻ
  hàng 11). Việc chuyển hết sang cửa công khai của từng mô-đun nằm trong hàng riêng «Siết cửa máy chủ của nhập tệp».
- Dòng mô tả của `imports` trong `modules.yaml` còn ghi «AI-assisted planning call» từ bản dựng kho; hàng 11 không gọi AI.
