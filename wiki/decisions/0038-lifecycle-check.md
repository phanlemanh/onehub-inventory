---
type: decision
title: Mỗi thứ hiện trên màn có đủ thêm, xem, sửa, gỡ — máy đọc mã màn và đỏ khi thiếu
links:
  [
    tools/coverage_matrix/lifecycle.py,
    tests/vong-doi-thao-tac.test.ts,
    design/screens.yaml,
    _acceptance/kiem-vong-doi-thao-tac/contract.md,
  ]
sources:
  [
    _acceptance/kiem-vong-doi-thao-tac/decisions.jsonl,
    _acceptance/kiem-vong-doi-thao-tac/opportunity.md,
    _acceptance/kiem-vong-doi-thao-tac/design.md,
  ]
---

# 0038 Mỗi thứ hiện trên màn có đủ thêm, xem, sửa, gỡ — máy đọc mã màn và đỏ khi thiếu

## Status

Accepted, 2026-11-15, ở hàng 1t. Chủ kho duyệt Cổng Phạm vi theo khuyến nghị (Hỏi-1 đến Hỏi-4) và duyệt kế hoạch.

## Context

Bản rà soát thêm · xem · sửa · xoá theo vai ngày 2026-11-14 đếm bảy thao tác thiếu thật trên các màn, và chủ kho đã tự bắt
ba lần (7e, 2b, 19). Nguyên nhân máy: phép kiểm nút của hàng 9b chỉ so các nút đã khai; sổ màn không nói màn hiện thứ gì,
nên một thao tác chưa từng khai thì không ai thấy thiếu. Luật bằng chữ đã có ba lần mà vẫn rơi.

## Decision

- Mỗi màn người dùng của sổ màn, kể cả màn dự kiến, và khung App Shell khai `hien`: các thực thể màn hiện.
- Phép kiểm không chỉ tin chỗ đã khai: nó đọc chuỗi trường `"<Thực thể>.<trường>"` trong các tệp trang của màn dùng (theo
  đường nhập của 9b) và thực thể của mọi thao tác trong bảng nút 9b của màn; thực thể thấy được mà `hien` không kê thì đỏ.
  Giới hạn đã chấp nhận (Hỏi-2): thứ hiện chỉ bằng chữ, không có chuỗi trường và không có thao tác, thì máy không thấy.
- Vòng đời khai một lần ở thực thể (khối `vong_doi` của `ontology/entities/<Thực thể>.yaml`), không theo từng màn: bốn ô
  `them`, `xem`, `sua`, `go` và tuỳ chọn `rieng`. Mỗi ô một trong ba dạng: thao tác của bảng quyền (đúng loại, là nút ở một
  màn hiện thực thể; còn dự kiến thì kèm hàng sẽ mở nó), hàng lộ trình kèm lý do, hoặc «không» kèm lý do và dòng cổng có
  chữ người trong sổ quyết định của một hồ sơ.
- Theo vai: vai mở được một màn phải xem được mọi thứ màn ấy hiện, hoặc ô xem kê vai ấy dưới `chan` với hàng hay «không».
  Thêm, sửa, gỡ theo vai giữ ở bảng quyền (đã qua cổng 9a, 9e); `--report` in vai của từng ô.
  `chan` đặt ở ô khác ô xem có thao tác thì đỏ, vì ở đó nó không có hiệu lực.
- Phép kiểm chỉ đọc tệp trong cây — không gọi git, không đọc sổ đợt ngoài kho — nên chạy được trên bản sao nông của CI. Nó
  chạy trong `make test` qua `tests/vong-doi-thao-tac.test.ts`.

## Consequences

- Lần chạy đầu khai 8 màn, 12 thực thể, 55 ô; bảy chỗ thiếu thật trỏ hàng 3g, 13, 13a, 18, 18a; bốn ô «không» và một ô vai
  bị chặn trỏ dòng cổng của hàng 1t.
- Hàng nào thêm màn, hay thêm thứ hiện trên màn, phải khai trong cùng PR — `make check` đỏ nếu quên. Cách khai, ba dòng:
  1. Sổ màn, mục của màn: `hien: [Listing, Contact]` — mọi thực thể màn hiện.
  2. Tệp mô hình của thực thể mới hiện: `vong_doi:` với `them`, `xem`, `sua`, `go`, ví dụ `them: { co: createContact }`,
     `sua: { hang: "13a", ly_do: "…" }`, `go: { khong: "…", duyet: "<hồ sơ>#<dòng gate1>" }`.
  3. Chạy `python3 tools/coverage_matrix/lifecycle.py --check`; ô «không» mới phải được chủ kho duyệt ở Cổng Phạm vi của hàng.
- Hàng đích hết lời hứa (đã xong mà ô vẫn ghi hàng) và câu bật của hàng đích có nhắc vế được giao hay không: chưa kiểm bằng
  máy — để bước sau.
