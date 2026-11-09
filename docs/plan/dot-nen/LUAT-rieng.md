## Luật riêng của kho onehub-inventory (chép vào LUAT.md của đợt nen)

1. Ba luật ở `PRODUCT-INVARIANTS.md` không hàng nào nới. Hàng T3 đọc lại trước Cổng Phạm vi và hợp đồng nêu luật nào nó chạm. Không sửa tệp luật.
2. Bảng mới bật cách ly theo dòng trong cùng migration, tạo bằng `/new-migration`. Bộ kiểm cách ly xanh trên Postgres của dãy trước khi trình Cổng Bằng chứng.
3. Migration lấy số kế tiếp tính trên `origin/main` lúc tạo. Trước khi gộp, gộp `origin/main` vào nhánh; trùng số thì đổi số của mình. Migration đã vào `main` thì không sửa.
4. Dữ liệu cá nhân thật không vào kho, kể cả dữ liệu mẫu: `[Tên]`, `0900 000 0xx`, mọi bản ghi mang nhãn MAU.
5. Cổng 3470 là của chủ kho. Mỗi dãy chạy dev và Postgres riêng: G → `PORT=3481`, D → `PORT=3483`, N → `PORT=3485` và `make db-up DB_LANE=n DB_PORT=5563`. Kiểm trình duyệt tự có cổng riêng theo từng worktree. Đầu mỗi lần thức, phiên giám sát kiểm Docker còn chạy trước khi cấp lượt `s4`.
6. Cấm `pkill -f`, `pkill -P`, `killall` lên `node`, `next`. Chỉ `kill <PID>` đúng tiến trình mình đã ghi lại. Cấm `docker rm` container không phải của dãy mình.
7. Gộp `main` mà có đổi `package.json` hay `package-lock.json` thì chạy `npm ci` trước khi lên làn đo.
8. Không bao giờ `gh pr merge --auto`. Gộp chỉ qua lệnh `gop` của đợt, dưới khoá `merge`.
9. `PRODUCT-MAP.md`, `LO-TRINH.html`, `design/component-registry.json` và `src/generated/` không sửa tay. Xung đột thì sinh lại sau khi gộp `origin/main`.
10. Tệp dùng chung (`_acceptance/config.yaml`, `design/decisions.yaml`, `.env.example`, `wiki/log.md`) chỉ thêm dòng, không sửa hay xoá dòng của người khác; xung đột thì giữ cả hai bên. Sửa dòng có sẵn thì gửi yêu cầu `cham-tep`.
11. Không sửa tay `src/components/ui` và `src/components/reui`. Lỗi kiểu trong đó không tính ở lượt kiểm chặt; đừng hạ cờ kiểm để qua.
12. Mỗi màn mới phải vào bài axe ở cả sáng và tối trước khi trình Cổng Bằng chứng, vì kit bản 2.38.0 chưa đo được tương phản màu Tailwind 4.
13. PR mở ở dạng nháp tới lúc trình Cổng Bằng chứng; chuyển sẵn sàng bằng `gh pr ready`.
14. Một kiểm tra CI đỏ ở phần PR không chạm: đối chiếu cùng kiểm tra trên `main`, chạy lại riêng trên máy; cả hai xanh thì chạy lại job đỏ một lần trước khi sửa gì.
15. Không nâng plugin của kit giữa một lượt S4.
16. Việc cần chủ kho cầm điện thoại (thử trong Zalo) gửi một yêu cầu `can-nguoi` gom đủ các bước, để chủ kho làm trong một lần ngồi.
