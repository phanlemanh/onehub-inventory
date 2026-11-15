#!/usr/bin/env python3
"""Builds the self-contained scope-gate page of row 9c from the shots (images embedded as data URIs)."""
import base64, sys, pathlib

anh = pathlib.Path(sys.argv[1])
out = pathlib.Path(sys.argv[2])


def img(name, alt):
    data = base64.b64encode((anh / name).read_bytes()).decode()
    return f'<img loading="lazy" alt="{alt}" src="data:image/webp;base64,{data}">'


def fig(name, alt, cap):
    return f"<figure>{img(name, alt)}<figcaption>{cap}</figcaption></figure>"


html = f"""<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Chọn khuôn màn Thành viên</title><style>
:root{{--bg:#fff;--fg:#1a1a1a;--mut:#5c5c5c;--line:#e3e3e3;--card:#f7f7f8;--acc:#1d4ed8}}
@media (prefers-color-scheme:dark){{:root:not([data-theme="light"]){{--bg:#121212;--fg:#ececec;--mut:#a3a3a3;--line:#2c2c2c;--card:#1b1b1b;--acc:#7aa2ff}}}}
*{{box-sizing:border-box}}body{{margin:0;background:var(--bg);color:var(--fg);font:16px/1.55 system-ui,-apple-system,"Segoe UI",sans-serif}}
main{{max-width:1240px;margin:0 auto;padding:24px 16px 64px}}h1{{font-size:24px;margin:0 0 4px}}h2{{font-size:18px;margin:28px 0 8px}}h3{{font-size:15px;margin:16px 0 6px;color:var(--mut)}}
p,li{{max-width:80ch}}.mut{{color:var(--mut)}}.card{{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:14px 16px;margin:12px 0}}
.row{{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}}.row3{{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}}
@media(max-width:760px){{.row,.row3{{grid-template-columns:1fr}}}}
figure{{margin:0}}img{{width:100%;height:auto;border:1px solid var(--line);border-radius:6px}}figcaption{{font-size:13px;color:var(--mut);margin-top:4px}}
.goc{{margin-top:10px}}.goc figcaption b{{color:var(--fg)}}
table{{border-collapse:collapse;width:100%;font-size:14px}}th,td{{border-bottom:1px solid var(--line);padding:6px 8px;text-align:left;vertical-align:top}}
pre{{background:var(--card);border:1px solid var(--line);border-radius:8px;padding:10px;white-space:pre-wrap}}
</style></head><body><main>
<p class="mut">Hàng 9c · Thành viên chọn từ ReUI · Cổng Phạm vi · khổ 1440, nền sáng, vai Quản trị sàn đã đăng nhập, cùng một sàn chín người</p>
<h1>Màn Thành viên: chọn khuôn cho danh sách người</h1>
<p><b>Kết luận.</b> Một câu cần chủ kho: danh sách người theo khuôn Lưới của kho hay theo khối <code>solution-users-8</code>.
Máy khuyên <code>solution-users-8</code>. Hộp mời theo <code>dialog-2</code> đã chốt theo luật mời của hàng 9 (phần dưới).</p>

<div class="card">
<p><b>Câu 1 · Danh sách người theo khuôn nào?</b></p>
<p><b>Khuyến nghị: B · solution-users-8</b> — một khung «Thành viên», mỗi người một dòng, «Đổi vai» ngay trên dòng.</p>
<p><b>Lối khác: A · khuôn Lưới của kho</b> — bảng tính như Bảng hàng, lọc ở ô đầu cột, «Đổi vai» trong «…» cuối dòng.</p>
<table><tr><th>Lối</th><th>Người dùng được</th><th>Người dùng mất</th></tr>
<tr><td>B · solution-users-8 (khuyến nghị)</td><td>Thấy ngay ai, vai gì, ai mời vào; đổi vai một lần bấm; dáng trang quản người quen thuộc</td><td>Không lọc theo cột; sàn trên trăm người phải cuộn</td></tr>
<tr><td>A · khuôn Lưới</td><td>Lọc theo vai, người mời ngay ô đầu cột như Sheet; cùng thói quen Bảng hàng</td><td>Vài chục người mà có cả bộ máy bảng tính (cột ghim, số dòng); đổi vai mất hai lần bấm</td></tr>
</table>
</div>
<div class="row">
<div>{fig("lo-b-users8.png", "Lối B — solution-users-8", "<b>B · solution-users-8</b> · một khung, chữ cái đầu, người mời, vai, «Đổi vai» trên dòng")}
<div class="goc">{fig("goc-users8.png", "Khối gốc solution-users-8", "<b>Gốc của B:</b> khối ReUI solution-users-8 (trang xem trước của ReUI). Giữ khung Members; bỏ ô tìm, thẻ Alerts, chỗ ngồi, xuất CSV, khung Guests và Invites — sản phẩm không có")}</div></div>
<div>{fig("lo-a-luoi.png", "Lối A — khuôn Lưới", "<b>A · khuôn Lưới của kho</b> · năm cột, ô lọc dưới tiêu đề, «…» cuối dòng")}
<div class="goc">{fig("goc-luoi.png", "Khuôn Lưới đang chạy — Bảng hàng", "<b>Gốc của A:</b> khuôn Lưới đang chạy ở Bảng hàng (màn mẫu của họ Lưới)")}</div>
<p class="mut">Chọn lối này thì mô hình nghiệp vụ thêm bốn trường của Thành viên: Email (<code>Member.email</code>, RESO MemberEmail), Vai (<code>Member.roles</code>), Người mời (<code>Member.invitedBy</code>), Ngày mời (<code>Member.invitedAt</code>).</p></div>
</div>
<h2>Trả lời</h2>
<pre>Câu 1 · Danh sách người: B · solution-users-8 · hay sửa: ___</pre>

<h2>Đã chốt</h2>
<div class="card">
<p><b>Hộp mời theo dialog-2, giữ luật mời của hàng 9.</b> Nhãn tên sàn cạnh tiêu đề (một người có thể quản trị nhiều sàn),
trường xếp dọc, dải chân «Thôi» · «Mời». Giữ ba trường của hàng 9: một email, tên trong sàn, ít nhất một vai (bốn ô đánh dấu).
Không lấy hộp mời của chính solution-users-8: nó mời nhiều email một lần và chọn «khách» — trái luật mời một người, nhiều vai.</p>
</div>
<div class="row3">
{fig("hop-moi.png", "Hộp mời sẽ dựng", "<b>Sẽ dựng</b> · hộp mời theo dialog-2 với ba trường của hàng 9")}
{fig("goc-dialog2.png", "Khối gốc dialog-2", "<b>Gốc:</b> khối ReUI dialog-2")}
{fig("goc-users8-moi.png", "Hộp mời của solution-users-8", "<b>Không lấy:</b> hộp mời của solution-users-8")}
</div>
<div class="card">
<p><b>Giữ nguyên:</b> ai vào màn, ai thấy nút «Mời người» và «Đổi vai» theo bảng quyền; câu lỗi mời, đổi vai và từ chối như hàng 9 và 9e.
Bài kiểm của hàng 9 không đổi lời; chỉ đổi cách tìm dòng người, liệt từng chỗ ở Cổng Bằng chứng.</p>
<p><b>Chạm ngoài vùng (G cho 14/11):</b> cài hai thành phần gốc avatar và item; hộp dùng chung thêm ô nhãn tuỳ chọn, mặc định tắt —
ba màn khác dùng hộp không đổi dáng, có ảnh trước/sau ở Cổng Bằng chứng.</p>
</div>
<h3>Màn hôm nay (trước hàng này)</h3>
<div class="row">{fig("truoc.png", "Màn Thành viên hôm nay", "<b>Hôm nay</b> · danh sách ghép tay khi kho còn rỗng")}</div>
</main></body></html>
"""
out.write_text(html)
print(out, len(html))
