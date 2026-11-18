# du-lieu-mau · Sửa sau chữ ký

Chủ kho đã ký Cổng Bằng chứng của hồ sơ này ngày 11/11/2026. Ở Cổng Phạm vi hồ sơ đã cắt «không nạp cơ sở dữ liệu»
(d-20261111T020241Z-40). Ngày 18/11/2026 chủ kho xin một lệnh nạp chính bộ hàng mẫu này vào cơ sở dữ liệu riêng của
người phát triển ở máy, để bấm thử ứng dụng. Thay đổi chạm `db/**` và `mk/**` là đường T3, nên chủ kho duyệt ghi nó
thành việc sửa sau chữ ký của hồ sơ này, nguyên văn «Duyệt, ghi vào du-lieu-mau» (d-20261118T073609Z-41). Phần đã cắt
ở hồ sơ gốc vẫn cắt với sản phẩm: lệnh chỉ chạy ở máy phát triển, không đổi màn nào, không đổi dữ liệu thật.

## Lệnh nạp mẫu vào cơ sở dữ liệu phát triển, 18/11/2026 (PR #85)

| Chỗ | Người dùng thấy khác gì | Bài kiểm | Phép |
| --- | --- | --- | --- |
| `make db-sample DB=<cơ sở dữ liệu>` trong `mk/db.mk`, gọi `db/scripts/nap-mau-dev.ts`: nạp vào cơ sở dữ liệu đã chạy migration trên lane; thiếu `DB=` thì in cách dùng | Không với người dùng; người phát triển có Bảng hàng 60 tin mẫu khi đăng nhập `dev@example.test` | Chạy tay ba trường hợp: cơ sở đã có tin thì từ chối, cơ sở mới thì nạp 60 tin, thiếu `DB=` thì in cách dùng | Chủ kho duyệt, d-20261118T073609Z-41 |
| `loadDevSample` trong `tests/db/can-mau.ts`: tạo «[Sàn thử local]» và `dev@example.test` đủ bốn vai nếu chưa có, rồi mọi tin mẫu qua `seedSampleInventory` có sẵn, trong một giao dịch; từ chối khi công ty đã có tin | Không | `tests/db/nap-mau-dev.db.test.ts`: ba ca (cơ sở mới, công ty có sẵn, lần chạy thứ hai bị từ chối và số dòng không đổi) | Chủ kho duyệt, d-20261118T073609Z-41 |
| Dòng `wiki/log.md` ngày 18/11/2026 | Không | — | Chủ kho duyệt, d-20261118T073609Z-41 |

Cách ly công ty (SP-1) không đổi: lệnh nạp bằng vai chủ bảng vào đúng công ty đã gọi tên. Bộ `db/scripts/cach-ly.sh`
chạy trên một lane mới: 38 ca đạt.
