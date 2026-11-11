---
schema_version: 1
feature: Một nhân viên giữ nhiều vai cùng lúc thấy đủ mục điều hướng của mọi vai mình giữ
slug: thanh-ben-nhieu-vai
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [ui]
screens: [today, inventory, sent]
status: approved
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-11-11T03:47:37Z
design_doc: _acceptance/thanh-ben-nhieu-vai/design.md
---

# Acceptance Contract: thanh-ben-nhieu-vai

## Context

Hàng 1a dựng thanh bên lọc mục điều hướng theo một vai. Quyết định 0016 cho một người kiêm nhiều vai và cộng quyền của các vai ấy; hàng 1d khai bốn vai cho máy đọc và khai một người giữ được nhiều vai. Hàng này đổi luật lọc để thanh bên nhận danh sách vai người ấy giữ và hiện đủ mục của mọi vai. Người dùng là nhân viên sàn giữ hai vai trở lên, trên máy tính và điện thoại.

Source input: hàng 1i của `docs/plan/lo-trinh.json`, ô cơ hội `_acceptance/thanh-ben-nhieu-vai/opportunity.md` do chủ kho quyết «build» ngày 11/11/2026 (mục Ngoài-3 của hàng 1a), quyết định `wiki/decisions/0016-permission-model.md`, bản khai vai `ontology/roles.yaml` của hàng 1d.

## Criteria

- AC-1: Given danh sách mục điều hướng có mục không giới hạn vai, mục chỉ dành cho một vai và mục dành cho nhiều vai, When thanh bên dựng cho một người giữ hai, ba hoặc bốn vai, Then thanh bên hiện mục không giới hạn vai và mọi mục dành cho ít nhất một vai người ấy giữ, mỗi mục đúng một lần, theo thứ tự khai; mục chỉ dành cho vai người ấy không giữ thì không hiện.
- AC-2: Given người giữ đúng một vai, When thanh bên dựng cho người ấy, Then thanh bên hiện đúng những mục luật của hàng 1a cho vai đó, theo thứ tự khai.
- AC-3: Given chưa biết vai của người (chưa đăng nhập) hoặc danh sách vai rỗng, When thanh bên dựng, Then chỉ mục không giới hạn vai hiện.
- AC-4: Given một mục điều hướng khai một vai không nằm trong bốn vai của `ontology/roles.yaml`, When kiểm kiểu chạy trong `make check`, Then kiểm kiểu báo lỗi ở mục đó; mục khai đúng vai đã khai thì kiểm kiểu xanh.
- AC-5: Given khung của ứng dụng dựng cho một người giữ nhiều vai, When khung hiện, Then thanh bên trong khung hiện đúng các mục theo AC-1 cho danh sách vai khung nhận.

## Coverage

Thước đối chiếu: bốn vai của `ontology/roles.yaml` (hàng 1d), câu «Người kiêm nhiều vai được cộng quyền» của `wiki/decisions/0016-permission-model.md`, AC-4 của hàng 1a.

- Trục số vai người giữ: không rõ (AC-3) | rỗng (AC-3) | một (AC-2) | hai | ba | bốn (AC-1) — đo đủ 16 tổ hợp của bốn vai.
- Trục loại mục: không giới hạn | một vai | nhiều vai (AC-1, AC-2, AC-3); mục nhiều vai có hai vai cùng được giữ thì hiện một lần (AC-1).
- Trục khai vai của mục: đúng bản khai | ngoài bản khai (AC-4).
- Trục chỗ dựng: thanh bên riêng (AC-1–AC-3) | thanh bên trong khung (AC-5).
- Trục khổ: máy tính và điện thoại dùng cùng một thanh bên nên cùng danh sách mục; không có bài riêng theo khổ.
- Later: khung nhận vai thật của người đăng nhập (hàng đăng nhập, dãy N); mục giới hạn vai trên danh sách điều hướng thật (bảng quyền, hàng 9a).

## Vai × Màn

Thanh bên là của khung, nên hàng chạm mục điều hướng của mọi màn nội bộ. Danh sách điều hướng thật hôm nay chưa có mục giới hạn vai: ba mục đều hiện với mọi vai.

| Màn | Đầu chủ | Đầu khách | Trưởng nhóm | Quản trị sàn |
|---|---|---|---|---|
| today | được — mục chung, hiện với mọi vai | được — mục chung, hiện với mọi vai | được — mục chung, hiện với mọi vai | được — mục chung, hiện với mọi vai |
| inventory | được — mục chung, hiện với mọi vai | được — mục chung, hiện với mọi vai | được — mục chung, hiện với mọi vai | được — mục chung hôm nay; vai này có thấy hàng hay không là bảng quyền của hàng 9a |
| sent | được — mục chung, hiện với mọi vai | được — mục chung, hiện với mọi vai | được — mục chung, hiện với mọi vai | được — mục chung hôm nay; bảng quyền của hàng 9a quyết |

## Out of scope

- Không nối vai thật của người đăng nhập vào khung: kho chưa có đăng nhập; hàng đăng nhập truyền danh sách vai vào khung.
- Không thêm mục giới hạn vai vào danh sách điều hướng thật và không quyết vai nào vào màn nào: bảng quyền của hàng 9a là nguồn duy nhất (0016).
- Không sinh thanh bên từ sổ màn `design/screens.yaml`: cần đổi bộ sinh trong `tools/` (hạng T3) và sổ màn chưa khai vai.
- Không có vai «chính» hay nút đổi vai: 0016 cộng quyền, người không phải chọn vai.
- Không đổi khuôn chung của khung (đầu màn, trạng thái toàn trang): phần của hàng 1e.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Ô cơ hội không khai ngưỡng nghiệm thu, và chủ kho dời nghiệm thu giá trị tới cuối lộ trình; hàng này không có mục Đường đo. Người dùng thật chỉ thấy khác biệt khi hàng đăng nhập truyền vai và bảng quyền (9a) thêm mục giới hạn vai.
- Kiểu vai của mục điều hướng là `Role` sinh từ `ontology/roles.yaml`; thêm vai ở bản khai thì `make gen` mở rộng kiểu, không sửa tay danh sách vai ở thanh bên.
