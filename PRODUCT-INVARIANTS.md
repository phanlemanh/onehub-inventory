# Luật sản phẩm

Tệp của chủ kho, sửa bằng commit riêng. Ba luật dưới đây không thoả thuận, cấu hình hay yêu cầu nào mở được. Kit đọc tệp này ở bước thiết kế. Dòng mã mới chạm dấu hiệu của một luật thì vòng đó phải có người duyệt ở Cổng Bằng chứng. Khuôn: `product-invariants-template.md` của Acceptance Gate Kit.

Dấu hiệu chỉ bắt được kiểu vi phạm đã biết. Không chạm dấu hiệu không có nghĩa là không phạm luật. Dòng «Giữ bằng» đổi sang tên bộ kiểm khi bộ kiểm cách ly và bộ kiểm rò rỉ được chuyển sang.

## SP-1 · Dữ liệu của mỗi sàn được cách ly: mọi truy vấn đi qua một cửa, dưới vai không sở hữu bảng

- Mức: khó đảo
- Chủ luật: Manh Phan
- Giữ bằng: giữ bằng mắt
- Dấu hiệu: `new (pg\.)?(Pool|Client)\(|[Pp]ool\.(query|connect)\(|(disable|no force) row level security|(DISABLE|NO FORCE) ROW LEVEL SECURITY|[Bb][Yy][Pp][Aa][Ss][Ss][Rr][Ll][Ss]`
- Phạm vi: `src/**`, `db/**`
- Vì sao: Một lần lộ dữ liệu giữa hai sàn là mất niềm tin của cả hai sàn.

## SP-3 · Người luôn là người bấm gửi

- Mức: khó đảo
- Chủ luật: Manh Phan
- Giữ bằng: giữ bằng mắt
- Dấu hiệu: `openapi\.zalo\.me|oa\.zalo\.me|[Zz]alo.*([Ss]end|[Pp]ost)(Message)?\(|(send|post)[A-Za-z]*[Zz]alo`
- Phạm vi: `src/**`
- Vì sao: Không tích hợp gửi qua Zalo cá nhân, không đăng vào nhóm, không tự trả lời; sản phẩm chỉ mở bảng chia sẻ của thiết bị.

## SP-4 · Phần nội bộ không ra trang khách

- Mức: khó đảo
- Chủ luật: Manh Phan
- Giữ bằng: giữ bằng mắt
- Dấu hiệu: `modules/contacts|modules/identity/server|label\(["'](ListAgent|BuyerAgent|ListSide|BuyerSide|OwnerMember)["']`
- Phạm vi: `src/app/s/**`, `src/modules/sharing/ui/**`
- Vì sao: Dữ liệu ra ngoài được dựng từ luật ẩn, không phải giấu ở giao diện.
