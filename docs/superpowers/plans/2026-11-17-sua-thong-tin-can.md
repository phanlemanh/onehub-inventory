# Kế hoạch — sua-thong-tin-can (hàng 3g, sau Cổng Phạm vi)

Phần lõi đã dựng trước cổng (bản bấm được): hộp «Sửa» trong hồ sơ, bốn cột sửa trên ô (lối C), ô cột riêng theo kiểu,
dán theo kiểu, một luật lỗi ghi, nền mờ hộp lồng, thông báo trên thanh đáy. Còn lại:

| Người dùng thấy gì khác                                                                                                  | Đụng đâu                                          | Phục vụ tiêu chí                               |
| ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------- | ---------------------------------------------- |
| Sửa xong, tải lại trang vẫn còn; Quản trị sàn không thấy «Sửa» trên dữ liệu thật; ô cột riêng mở đúng kiểu trên sàn thật | `tests/e2e-db/sua-thong-tin-can.spec.ts`          | AC-2 (tải lại còn), AC-1 (vai), AC-6 (ô riêng) |
| Bảng hàng chứng minh đủ trạng thái với khối mới                                                                          | `_acceptance/sua-thong-tin-can/chung-minh-man.md` | AC-9 (đúng dáng họ Lưới)                       |
| Kho xanh toàn bộ, sổ khối và sổ thành phần sinh lại                                                                      | `make check`, `make gen`/`design-components`      | mọi tiêu chí                                   |
| Bài của các hồ sơ đã ký đếm cột đúng lưới mười hai cột                                                                   | bài của hàng 2, 3, 3b, 4, 5 (sửa sau ký)          | AC-11 (lật tám cột)                            |
| Wiki ghi việc của hàng                                                                                                   | `wiki/log.md`, `wiki/entities/listing.md`         | —                                              |

Việc 1–3 độc lập về tệp nhưng chạy tuần tự trong phiên (dãy giữ một lượt nặng một lúc). Kiểm từng việc: lệnh của
`executors.test.sua_thong_tin_*` và `make check`.
