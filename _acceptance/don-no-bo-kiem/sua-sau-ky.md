# 1u · Sửa sau chữ ký

Chủ kho đã ký Cổng Bằng chứng của hàng 1u và hàng đã vào nhánh chính. Hàng 22 «Môi trường thử và bản thật» thêm trang
quyết định 0043, đúng số kế tiếp giám sát giao (G-1611-70). Ca «different numbers are not caught» của
`tests/wiki-lint-so-trung.test.ts` chép trang 0042 sang số cứng 0043, coi đó là số trống, nên đỏ ngay khi 0043 có thật.
Giám sát duyệt lối sửa dưới đây (K-30, G-1611-71).

## Số đích của ca «số khác nhau», 16/11/2026

| Chỗ | Người dùng thấy khác gì | Bài kiểm | Phép |
| --- | --- | --- | --- |
| `tests/wiki-lint-so-trung.test.ts`: số đích của bản chép 0042 đổi từ 0043 sang 0999, số không bao giờ dùng | Không. Ý ca giữ nguyên: hai trang khác số, kể cả cùng tiêu đề, không bị bắt | Chính ca ấy; ca «same number is caught» không đổi | K-30, G-1611-71 |

Hồ sơ được ghim lại trên bản có thay đổi này, cùng lượt chấm của hàng 22.

## Bản sao phá của E6 nhắm vào sổ log trong git, 19/11/2026

Hồ sơ `split-log-ledger` tách sổ log của wiki: mỗi mục một tệp ở `wiki/log/`, `wiki/log.md` vẽ ra và nằm ngoài git.
`so-quyet-dinh.mjs` lấy danh sách tệp bằng `git ls-files`, nên không còn thấy `wiki/log.md`; bản sao phá chèn liên
kết cũ vào đúng tệp ấy và vì thế không bị bắt (`so-quyet-dinh: ban sao con lien ket cu ma khong do`).

| Chỗ | Người dùng thấy khác gì | Bài kiểm | Phép |
| --- | --- | --- | --- |
| `rang/so-quyet-dinh.mjs`: bản sao phá chèn liên kết cũ vào mục mới nhất của `wiki/log/` (vẫn là `wiki/log.md` khi sổ còn một tệp) và chờ đúng tên tệp ấy trong lời đỏ | Không. Ý phép đo giữ nguyên: một liên kết cũ trong sổ log bị bắt; nửa thật quét cả các mục của `wiki/log/` | E6 (`so_quyet_dinh`) thoát 0; AC-5 của `split-log-ledger` | Cổng Phạm vi của `split-log-ledger`, Hỏi-2 |
