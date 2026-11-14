# Kế hoạch — dang-nhap-chon-tu-reui (hàng 1p, T2)

Lối A `auth-15`, họ màn `dang-nhap` (chủ kho duyệt 2026-11-14).

| Người dùng thấy gì khác                                                             | Đụng đâu                                                                     | Phục vụ tiêu chí                                 |
| ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------ |
| Màn đăng nhập có logo trên, một cột hẹp giữa trang không khung, chân trang một dòng | `src/app/login/login-layout.tsx`, `page.tsx`                                 | AC-1 (dáng khối auth-15)                         |
| Ô email có biểu tượng thư, nút «Gửi mã» rộng hết cột kèm mũi tên                    | `src/app/login/login-form.tsx`                                               | AC-1 (dáng khối auth-15)                         |
| Hai câu mới: câu dẫn và dòng ©                                                      | `src/app/login/copy.ts`                                                      | AC-6 (chữ không ghim trong mã)                   |
| Máy giữ nguyên bài kiểm và câu đăng nhập cũ                                         | `tests/dang-nhap-giu-loi.test.ts`                                            | AC-2 (bài cũ không đổi), AC-4 (câu cũ không đổi) |
| Máy đo dáng khối ở bốn khổ, sáng và tối                                             | `tests/e2e/dang-nhap-khoi.spec.ts`                                           | AC-1, AC-5 (không cuộn ngang, nút trong màn đầu) |
| Kho có họ màn Đăng nhập và dòng sổ khối                                             | `design/patterns/dang-nhap.md`, `design/screens.yaml`, `design/so-khoi.yaml` | AC-7 (sổ khối, họ màn)                           |
| Bài đăng nhập có cơ sở dữ liệu chạy trên làn H                                      | `_acceptance/config.yaml` (một dòng)                                         | AC-3 (luồng xanh)                                |

Các việc phụ thuộc nhau (cùng màn), làm tuần tự trong phiên chính. Kiểm từng việc: `npx eslint src/app/login`,
`npx tsc --noEmit`, bài của chính hàng; cặp phá thử ở `_acceptance/dang-nhap-chon-tu-reui/pha-thu.md`.
