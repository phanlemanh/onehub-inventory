# tat-plugin-cho-cu · Sửa sau chữ ký

## Ca «E4 red (a)» nhắm vào sổ log trong git, 19/11/2026

Hồ sơ `split-log-ledger` tách sổ log của wiki: mỗi mục một tệp ở `wiki/log/`, `wiki/log.md` vẽ ra và nằm ngoài git.
Phép quét tên chợ cũ (của `nang-kit-3-0`) chỉ đọc tệp git giữ, nên dòng ca phá thêm vào `wiki/log.md` không còn bị
thấy và ca đỏ thành xanh (`expected red, got green`).

| Chỗ | Người dùng thấy khác gì | Bài kiểm | Phép |
| --- | --- | --- | --- |
| `rang/two-way.mjs`, ca «E4 red (a)»: dòng nhắc tên chợ cũ thêm vào mục mới nhất của `wiki/log/` (vẫn là `wiki/log.md` khi sổ còn một tệp), lời đỏ chờ đúng tên tệp ấy | Không. Ý ca giữ nguyên: tên chợ cũ trong sổ log bị phép quét bắt | Ca ấy đạt; AC-5 của `split-log-ledger` | Cổng Phạm vi của `split-log-ledger`, Hỏi-2 |

Ba ca «E1 red» của tệp này đã đỏ trên `main` trước khi tách («E1 not green on HEAD»); lần sửa này không chạm chúng.
