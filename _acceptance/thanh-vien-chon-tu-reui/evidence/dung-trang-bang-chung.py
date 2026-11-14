import base64, sys, pathlib
d = pathlib.Path(sys.argv[1]); out = pathlib.Path(sys.argv[2])
def fig(n, cap):
    b = base64.b64encode((d / f"{n}.webp").read_bytes()).decode()
    return f'<figure><img loading="lazy" alt="{cap}" src="data:image/webp;base64,{b}"><figcaption>{cap}</figcaption></figure>'
html = f"""<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Bằng chứng màn Thành viên</title><style>
:root{{--bg:#fff;--fg:#1a1a1a;--mut:#5c5c5c;--line:#e3e3e3;--card:#f7f7f8}}
@media (prefers-color-scheme:dark){{:root:not([data-theme="light"]){{--bg:#121212;--fg:#ececec;--mut:#a3a3a3;--line:#2c2c2c;--card:#1b1b1b}}}}
*{{box-sizing:border-box}}body{{margin:0;background:var(--bg);color:var(--fg);font:16px/1.55 system-ui,-apple-system,"Segoe UI",sans-serif}}
main{{max-width:1240px;margin:0 auto;padding:24px 16px 64px}}h1{{font-size:24px;margin:0 0 4px}}h2{{font-size:18px;margin:28px 0 8px}}
p,li{{max-width:84ch}}.mut{{color:var(--mut)}}.card{{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:14px 16px;margin:12px 0}}
.row{{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}}.row3{{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}}
@media(max-width:760px){{.row,.row3{{grid-template-columns:1fr}}}}
figure{{margin:0}}img{{width:100%;height:auto;border:1px solid var(--line);border-radius:6px}}figcaption{{font-size:13px;color:var(--mut);margin-top:4px}}
table{{border-collapse:collapse;width:100%;font-size:14px}}th,td{{border-bottom:1px solid var(--line);padding:6px 8px;text-align:left;vertical-align:top}}
pre{{background:var(--card);border:1px solid var(--line);border-radius:8px;padding:10px;white-space:pre-wrap}}
</style></head><body><main>
<p class="mut">Hàng 9c · Thành viên chọn từ ReUI · Cổng Bằng chứng · lượt chấm 2 đạt (16/16 phép đo), PR #60</p>
<h1>Màn Thành viên đã dựng theo lối chủ kho chọn</h1>
<p><b>Kết luận.</b> Danh sách người theo khối solution-users-8 và hộp mời theo dialog-2 đã dựng đúng ảnh đã duyệt; quyền và luật mời giữ nguyên, bài kiểm của hàng 9 không đổi lời.
Một câu cho chủ kho: có cần sửa tên trong sàn của một người ngay ở hàng này không — máy khuyên để hàng sau.</p>

<div class="card">
<p><b>Câu 1 · Quản trị sàn có cần sửa «tên trong sàn» của một người đã mời không?</b></p>
<p><b>Khuyến nghị: để hàng sau</b> — hàng này giữ quyền và luật mời của hàng 9; thêm việc sửa tên là thêm một thao tác vào bảng quyền.</p>
<p><b>Lối khác: làm ngay</b> — mở lại phạm vi hàng 9c (ký lại Cổng Phạm vi), thêm thao tác vào bảng quyền.</p>
<p><b>Người dùng mất gì nếu để sau:</b> gõ sai tên lúc mời thì chưa sửa được; phải nhờ người kỹ thuật tới khi có hàng ấy.</p>
</div>
<h2>Trả lời</h2>
<pre>Câu 1 · Sửa tên trong sàn: để hàng sau · hay sửa: ___</pre>

<h2>Đã dựng — màn cạnh khối gốc</h2>
<div class="row">{fig("sau-members-1440-sang","Màn Thành viên đã dựng · 1440 sáng, Quản trị sàn")}{fig("lo-b-users8","Ảnh đã duyệt ở Cổng Phạm vi (lối B)")}</div>
<div class="row" style="margin-top:12px">{fig("goc-users8","Khối gốc solution-users-8")}{fig("sau-hop-moi-1440-sang","Hộp mời đã dựng — tên sàn cạnh tiêu đề")}</div>
<div class="row" style="margin-top:12px">{fig("goc-dialog2","Khối gốc dialog-2")}<div></div></div>

<h2>Ba hộp ở màn khác không đổi dáng</h2>
<p class="mut">Hộp dùng chung có thêm ô nhãn tuỳ chọn, mặc định tắt. Ảnh «trước» chụp với hộp của nhánh chính, «sau» với nhánh này, cùng dữ liệu: ba cặp giống hệt từng điểm ảnh.</p>
<div class="row3">{fig("truoc-form-dialog-dat-ten-goc-nhin","Trước · đặt tên góc nhìn")}{fig("truoc-form-dialog-trang-thai","Trước · đổi trạng thái trên ô")}{fig("truoc-form-dialog-bao-sai","Trước · báo sai thông tin")}</div>
<div class="row3" style="margin-top:12px">{fig("sau-form-dialog-dat-ten-goc-nhin","Sau · đặt tên góc nhìn")}{fig("sau-form-dialog-trang-thai","Sau · đổi trạng thái trên ô")}{fig("sau-form-dialog-bao-sai","Sau · báo sai thông tin")}</div>

<h2>Thao tác trên Thành viên</h2>
<table><tr><th>Thứ người dùng thấy</th><th>Thêm</th><th>Xem</th><th>Sửa</th><th>Xoá / Gỡ</th></tr>
<tr><td>Người trong sàn</td><td>có — «Mời người» ở đầu màn, Quản trị sàn</td><td>có — danh sách khung, ai được xem danh sách người</td><td>vai: có — «Đổi vai» cuối dòng, Quản trị sàn · tên trong sàn: <b>không — Câu 1</b></td><td>để hàng 18a (Quản trị sàn khoá người đã nghỉ và bàn giao)</td></tr>
</table>

<h2>Đủ bộ phận của họ danh sách khung</h2>
<table><tr><th>Bộ phận</th><th>Màn Thành viên</th></tr>
<tr><td>Đầu khung (tên, dòng đếm)</td><td>có — «Thành viên», «N người trong sàn»</td></tr>
<tr><td>Nút đầu khung theo quyền</td><td>bỏ — nút mời đứng ở đầu màn theo luật bộ nút</td></tr>
<tr><td>Chỗ chỉnh cuối dòng theo quyền</td><td>có — «Đổi vai», chỉ hiện khi bảng quyền cho</td></tr>
<tr><td>Chân khung khi có lưu</td><td>bỏ — mỗi việc lưu trong hộp riêng, màn không có lưu chung</td></tr>
<tr><td>Bốn trạng thái (chờ tải, lỗi, không đủ quyền, chữ dài)</td><td>có — kiểm cả nội dung và trợ năng sáng tối</td></tr>
</table>
<p class="mut">Khối khung dùng chung đã đưa ra cho mọi màn của họ (hàng 19 dùng lại), đủ khe đầu khung, dòng, chân khung.</p>

<h2>Máy đã lo</h2>
<ul>
<li>Bài kiểm của hàng 9 chỉ đổi cách tìm dòng người ở ba tệp (danh sách người, bộ nút, đổi sàn); một bài khoá bảo đảm không đổi gì khác.</li>
<li>Sáu mục ngoài phạm vi máy đã xếp: bốn ghi hạn chế đã biết (các phép đo còn lỏng, màn không sai), hai không sửa — xem thẻ kỹ thuật.</li>
<li>Lượt chấm 1 bị trả vì kiểm toàn kho đỏ (máy đặt kịch bản chấm sai chỗ; một bài khoá lỗi khi máy chủ kiểm không có lịch sử) — đã sửa, lượt 2 đạt.</li>
<li>Chạm ngoài vùng (giám sát cho): hai thành phần gốc avatar và item cài bằng lệnh; hộp dùng chung thêm ô nhãn tắt mặc định.</li>
</ul>
</main></body></html>
"""
out.write_text(html); print(out, len(html))
