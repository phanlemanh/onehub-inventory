# Ma trận trạng thái

Mỗi vùng dữ liệu phải khai đủ các trạng thái dưới đây, ở bốn khổ 360, 414, 1024, 1440. Màn chưa đạt đủ thì chưa được khai là màn mẫu.

| Trạng thái       | Yêu cầu                                                                            | Kiểm bằng                  |
| ---------------- | ---------------------------------------------------------------------------------- | -------------------------- |
| Chờ tải          | Dưới 1 giây không chỉ báo; từ 1 giây có khung chờ đúng bố cục                      | Playwright giả lập trễ     |
| Trống            | Nói vì sao trống và làm gì tiếp                                                    | Bài kiểm của vùng          |
| Tìm không ra     | Bắt buộc có lối thoát «Xoá lọc»                                                    | Prop bắt buộc              |
| Lỗi              | Câu ba phần, có «Thử lại» khi thử lại được                                         | Bài kiểm của vùng          |
| Một phần hỏng    | Phần còn lại vẫn dùng được, nói rõ phần nào hỏng                                   | Bài kiểm của vùng          |
| Chữ dài          | Không vỡ bố cục, có cách đọc đủ                                                    | Playwright với dữ liệu dài |
| Không đủ quyền   | Nói rõ, không để lộ dữ liệu                                                        | Bài kiểm của vùng          |
| Xung đột khi lưu | Báo người khác đã sửa, cho chọn lối                                                | Bài kiểm của vùng          |
| Phiên hết hạn    | Giữ phần đang nhập, mời đăng nhập lại rồi quay về đúng chỗ                         | Bài kiểm của khung         |
| Mất mạng khi lưu | Băng trên màn nói chưa lưu được, không mất phần đang nhập, có «Thử lại»            | Playwright ngắt mạng       |
| Link hết hạn     | Trang khách nói rõ link không còn dùng và cách liên hệ người gửi, không lộ dữ liệu | Bài kiểm của trang khách   |

Mỗi bài kiểm giao diện phải chứng minh được là đỏ khi phá đúng chỗ nó đo.

Các trạng thái vùng (chờ tải, trống, tìm không ra, lỗi, một phần hỏng, chữ dài, không đủ quyền) dựng sẵn trong `DataRegion`; bài kiểm của vùng là `tests/grid.test.tsx` và `tests/behavior.test.tsx`, bài trình duyệt là `tests/e2e/grid.spec.ts` và `tests/e2e/behavior.spec.ts`. Khi vùng đang tải, lỗi hay không đủ quyền, đầu vùng chỉ có tên vùng: không số dòng, không ô tìm.
