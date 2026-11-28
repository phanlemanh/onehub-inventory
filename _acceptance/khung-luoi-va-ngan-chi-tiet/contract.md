---
schema_version: 1
feature: Đầu chủ và Đầu khách dùng mọi màn họ Lưới với ngăn chi tiết nổi từ dưới thanh trên tới đáy, lưới khít màn, đầu ngăn một dòng, nút đúng chỗ và đủ cỡ ngón tay — điều chủ kho đã quyết ở phiên BH ngày 27/11/2026
slug: khung-luoi-va-ngan-chi-tiet
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [ui]
screens: []
status: signed-off
approved_by: Manh Phan
approved_at: 2026-11-27T09:04:51Z
design_doc: _acceptance/khung-luoi-va-ngan-chi-tiet/design.md
---

# Acceptance Contract: khung-luoi-va-ngan-chi-tiet

## Context

Chủ kho xem Bảng hàng thật ngày 27/11/2026 ở phiên xem trước «BH · Điều chỉnh UX Bảng hàng» và quyết, trên ảnh và bản
bấm được: khung ngăn chi tiết và lưới (Q1–Q4, «Chốt cả bốn»), đầu ngăn một dòng («Chốt một dòng»), chuẩn nút dùng chung
(«Duyệt cả ba câu»), luật «…» («Duyệt luật đã sửa») và sáu điểm nút Bảng hàng L1–L6 («Duyệt cả sáu điểm»). Hợp đồng này
GHI LẠI những lời ấy — nguyên văn và bảng trước/sau ở `design.md` — và đo điều đã dựng. Khung dùng chung cho mọi màn họ
Lưới (Bảng hàng, Đã gửi), nên nó gộp trước phần thi công của hàng 3h. Người dùng là nhân viên sàn trên máy tính và điện
thoại.

Source input: mục «VP10 — PHẠM VI GỘP» của sổ đợt `dieu-phoi-nen` · sổ phiên BH · `wiki/decisions/0051-khung-luoi-va-ngan-chi-tiet.md`.

## Criteria

- AC-1: Given Bảng hàng và Đã gửi ở 1024 và 1440, When mở chi tiết một dòng, Then ngăn nổi đứng từ đáy thanh trên App Shell (lệch ≤ 2
  px) tới đáy vùng làm việc hoặc cửa sổ, sát mép phải, cuộn trang vẫn giữ chỗ; thanh trên ẩn (toàn màn hình) thì ngăn từ
  mép trên cửa sổ; ô tìm, menu tài khoản, ô lọc cột Căn vẫn bấm được; ngăn mang nền lớp nổi, viền trái và bóng ở sáng và
  tối.
- AC-2: Given Bảng hàng ở 1024 và 1440 với cột thứ hai mở, When mở màn, Then trang không cuộn dọc thêm (≤ 1 px) và đáy
  vùng lưới cách đáy vùng làm việc 16 px (lệch ≤ 4 px).
- AC-3: Given ngăn nổi ở 1024 và 1440, When nhìn thanh công cụ của vùng, Then nút cuối của thanh công cụ dừng trước mép
  ngăn ≥ 16 px kể cả khi các nút dồn về mép phải; nút «Cột», «Toàn màn hình» rộng ≤ 40 px, có tên đọc và chữ gợi ý; ngăn
  trên Đã gửi thanh công cụ cũng dừng trước ngăn ≥ 16 px; ngăn ghim thành cột thì thân ngăn cuộn được và giữ chỗ cuộn khi
  đổi dáng, trên cả Bảng hàng lẫn Đã gửi (chữ nút khi ghim theo câu hỏi ở Cổng Phạm vi).
- AC-4: Given chi tiết một căn ở 360, 414, 1024, 1440, sáng và tối, When nhìn đầu ngăn, Then tên căn bên trái và mọi nút
  đầu ngăn cùng một dòng bên phải tên, kết bằng «Trước», «Sau», «Đóng» ở mép phải (≤ 24 px), đầu ngăn cao ≤ 64 px, tên
  không bị ép (≥ 64 px, một dòng), mọi nút ấy chỉ có hình với tên đọc trùng chữ gợi ý.
- AC-5: Given chi tiết một căn, When đo các nút ở đầu hồ sơ, đầu mục và đáy hồ sơ, Then ở 360 và 414 mỗi nút cao ≥ 44
  px (nút đầu hồ sơ rộng ≥ 44 px) và đầu ngăn vẫn một dòng; ở 1024 và 1440 nút đầu hồ sơ cao 28 px.
- AC-6: Given Bảng hàng ở 360 và 414, When nhìn hàng công cụ, Then «Lọc» có chữ (và số ô đang lọc khi có), nút «Lọc»,
  «Nhóm theo …» và «Lưu góc nhìn» cao ≥ 44 px, không chồng nhau, hàng không xuống dòng (≤ 60 px); không còn nút «…» tên
  «Thêm»; người không được lưu góc nhìn không thấy «Lưu góc nhìn» hay nút việc nào khác của vùng; Tab đi từ nút cuối hàng công cụ tới thẻ đầu.
- AC-7: Given ngăn lọc trên điện thoại và hộp lưu góc nhìn trên máy tính, When đọc nút × ở góc, Then nó tên «Đóng», bấm
  thì đóng; không nút nào trên trang tên «Close».
- AC-8: Given Bảng hàng ở 1024 và 1440, When nhìn hàng ô lọc dưới tiêu đề, Then mọi ô gõ và nút «Chọn» cùng một chiều
  cao (lệch ≤ 0,5 px) và các tên cột đứng cùng một dòng.
- AC-9: Given Bảng hàng ở 1024 và 1440, When nhìn tiêu đề cột, Then không tiêu đề nào có nút «Bỏ ghim …»; trình đơn của
  cột Toà đánh dấu «Ghim bên trái» và bấm vào thì Toà thôi ghim; ghim «Giá chào» từ trình đơn thì cột ấy ghim và cột ghim
  cuối đổ bóng lên cột cuộn dưới nó.
- AC-10: Given 1024 và 1440, When con trỏ đặt ở mép cột thứ hai, ở một phần tư chiều cao cửa sổ (xa nút gập), Then nút
  gập hiện khung rõ (có bóng) và chữ gợi ý «Gập cột thứ hai»; con trỏ ở xa thì nút không có khung.
- AC-11: Given cây sau vòng này, When chạy `make check`, bộ bài trình duyệt chung ở bốn khổ sáng và tối và bộ có đăng
  nhập trên Postgres, Then tất cả xanh, axe không lỗi serious hay critical, và không tệp nào dưới `src/components/ui`
  hay `src/components/reui` đổi.
- AC-12: Given `design.md`, `design/behaviors.md` và `wiki/decisions/0051-khung-luoi-va-ngan-chi-tiet.md`, When đặt cạnh
  lời chủ kho ở mục «Nguồn», Then mỗi điều chủ kho quyết có đúng một chỗ làm và một dòng sổ hành vi, không thêm việc ông
  không bảo; luật «…» và ba câu chuẩn nút nằm ở mục «Bộ nút theo quyền» với lời và ngày của ông; các câu ông chưa quyết
  ((a)–(f)) không lọt vào phần đã làm. (judgment)

## Coverage

Thước đối chiếu: các điều chủ kho đã quyết (Q1–Q4, A5, B1–B3, luật «…», L1–L6), bốn khổ, hai giao diện, các trạng thái của
ngăn (đóng, nổi, ghim, toàn màn hình, điện thoại).

- Trục điều đã quyết: Q1+Q3 (AC-1) | Q2 (AC-2) | Q4 (AC-3) | A5 (AC-4) | B3 (AC-5) | B1, B2, «…» (AC-12, sổ hành vi;
  dựng trong ngăn ở 3h) | L1+L5 (AC-6) | L2 (AC-7) | L3 (AC-8) | L4 (AC-9) | L6 (AC-10).
- Trục khổ: 360 | 414 (AC-4, AC-5, AC-6, AC-7) | 1024 | 1440 (AC-1..AC-5, AC-7..AC-10).
- Trục giao diện: sáng | tối (AC-1, AC-4, AC-11).
- Trục trạng thái ngăn: nổi (AC-1, AC-3) | ghim (AC-3) | toàn màn hình (AC-1) | điện thoại (AC-4, AC-5) | đóng (AC-2).
- Trục màn: Bảng hàng (mọi AC) | Đã gửi (AC-1, AC-3, AC-11).
- Trục không hồi quy: kiểm cả kho, bộ chung, bộ có đăng nhập (AC-11).
- Later: các câu (a)–(f) — chủ kho trả lời ở Cổng Phạm vi, phần dựng ở lát 2; ba đề xuất «máy giữ» chủ kho đã duyệt, thành
  việc công cụ VP12. VP11 «Chuẩn hoá hệ design» (màu trạng thái, bấm ô, lọc) là việc riêng sau vòng này.

## Vai × Màn

Hợp đồng không khai màn sản phẩm mới (`screens: []`): vòng này đổi khung dùng chung của họ Lưới và App Shell, không dựng
màn nào và không đổi ai vào màn nào. Bảng quyền giữ nguyên; «Lưu góc nhìn» vẫn đi qua bảng quyền (L1 chỉ đổi chỗ hiện).

## Out of scope

- Không dựng phần trong ngăn: chỗ đặt «Sửa» ở đầu mục, dòng khoá có lý do (chuẩn nút câu 1, 2) — hàng 3h dựng trên khung
  này.
- Không làm VP11 (màu trạng thái, Enter/Space trên ô, lọc): việc riêng, chủ kho duyệt «cả ba lối A».
- Không đổi luật «cột đầu luôn ghim» của hàng 2a: trình đơn của cột Căn đã cho bỏ ghim từ trước vòng này; hỏi chủ kho.
- Không sửa tệp của bộ kit dưới `src/components/ui` và `src/components/reui`.
- Không dựng D1, D2, D4 và phần các câu (a)–(f) cùng hai câu mới đòi: lát 2 `khung-luoi-va-ngan-chi-tiet-2` (G-2711-19)
  dẫn nguyên văn câu trả lời của chủ kho ở Cổng Phạm vi này.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Đường đo

- Bỏ đường đo — vòng không có ô cơ hội và ngưỡng; xem dòng sổ «bỏ đường-đo».

## Notes

- Mã dựng trước khi mở hồ sơ, theo lệnh giám sát (G-2711-12…14): sáu commit xem trước của nhánh BH vào nguyên vẹn, rồi
  phần còn lại dựng ở phiên dãy H.
- Hồ sơ đã ký có bài đổi kỳ vọng, mỗi hồ sơ một dòng «sửa sau ký» và ghim lại một làn trước khi gộp:
  `ngan-chi-tiet-ghim-thanh-cot` (3a, AC-4: ngăn dưới thanh công cụ), `hoi-dau-chu-bao-sai` (3e, AC-10: đầu hai dòng),
  `ho-so-can` (3, bài E2 dùng chung), `bang-hang-the-dien-thoai` (2b: nút 36 px trong vùng chạm, «…» tên «Thêm»),
  `bo-o-tim-cua-vung` (2e: nút «Bỏ ghim Toà», phân xử K-1411-7), `bang-hang-dung-tay-nhu-sheet` (2a: điểm dừng Tab trên
  điện thoại). Cùng làn ghim lại: `sua-tren-o` (hàng 4) và `lop-rieng-cua-san` (7e) đã cũ trên main từ 13/11.
- Hàng 11 (nhập Excel) dùng cùng `data-region.tsx`: ai xanh trước gộp trước, người sau gộp main và chạy lại.
- Known limits — chọn ở Cổng Bằng chứng 2026-11-28:
  - Ngoài-1: Thẻ ký duyệt vẫn hiện câu cũ nói khung tách khỏi lưới ở cả nền sáng lẫn tối, trong khi ở nền tối chỉ còn đường viền. Chủ kho có thể ký trên một câu mô tả hơi quá so với thực tế.
  - Ngoài-2: Thẻ ký tự mâu thuẫn: câu đầu nói nền tối chỉ có viền, nhưng dòng tiêu chí đầu vẫn hứa có viền và bóng ở cả sáng lẫn tối. Chủ kho đọc thẻ có thể không rõ nên tin câu nào.
  - Ngoài-3: Thẻ ký hiện cờ đỏ báo không phép kiểm nào đạt dù mọi kiểm đều đã đạt. Chủ kho có thể hoang mang hoặc quen bỏ qua cờ đỏ thật sau này.
  - Ngoài-4: Thẻ đang trình cho chủ kho vẫn ghi câu cũ về nền tối, lệch với câu đã sửa. Ký trên thẻ này là duyệt đúng câu định bỏ.
  - Ngoài-5: Bảng kết quả của vòng có thể ghi một bài kiểm tra là đạt dù lần chạy mới nhất của cùng lệnh đã lỗi. Người dùng không thấy gì ở màn hình; chỉ người đọc báo cáo có thể bị hiểu nhầm về mức xanh của vòng.
  - Ngoài-6: Thẻ trình chủ kho ghi bảy tiêu chí chưa đạt trong khi thực tế chỉ bốn tiêu chí hỏng. Chủ kho có thể hiểu nhầm và bỏ cả ba tiêu chí đang đạt khi chọn lối thu phạm vi.
  - Ngoài-7: Trang bằng chứng báo hai lượt chấm trong khi thẻ nói năm lượt. Chủ kho có thể không thấy là đã vượt trần ba lượt.
  - Ngoài-8: Thẻ trình chủ kho tính ba tiêu chí đã đạt là hỏng, nên bảy thay vì bốn tiêu chí bị nêu chưa đạt. Quyết định lối ra của chủ kho có thể dựa trên danh sách sai.
  - Ngoài-9: Phép đối chiếu cho giao diện tối có thể không phân biệt được ngăn có viền trái với ngăn thiếu viền. Bài chấm có thể cho kết quả không đáng tin dù màn hình thật không đổi.
  - Ngoài-10: Trang bằng chứng vẫn ghi hai lượt chấm dù đã chấm năm lượt, nên che việc đã vượt trần ba lượt.
  - Ngoài-11: Ảnh đối chiếu của giao diện tối được vẽ tay và không ai dựng lại được khi màn hình đổi. Kết quả chấm có thể chỉ phản ánh lời mô tả chứ không phải khả năng phân biệt bằng mắt.
  - Ngoài-12: Nút ở đáy hồ sơ trên điện thoại vẫn được đo đúng như hợp đồng. Chỉ là chưa có bài thử chứng minh phép đo sẽ báo lỗi nếu nút ấy biến mất, nên một lúc nào đó phép đo có thể lặng lẽ không đo gì mà vẫn báo đạt.
  - Ngoài-13: Nếu phần đáy hồ sơ trên điện thoại biến mất hoặc nút ở đó bị thu nhỏ, bài kiểm hiện có có thể vẫn báo đạt vì không đo gì ở đó. Người dùng điện thoại có thể gặp nút khó bấm mà không ai được cảnh báo trước.
  - Ngoài-14: Người dùng không thấy gì khác đi. Chỉ là bài kiểm tra bóng đổ của cột ghim chưa chắc bắt được lỗi nếu phần thân bảng mất bóng, nên sau này một lỗi như vậy có thể lọt qua mà không báo đỏ.
  - Ngoài-15: Ở giao diện tối, bài kiểm tự động nói bóng của ngăn bị cắt thì không chứng minh được gì, vì bóng ở nền tối vốn đã quá nhạt. Người dùng có thể thấy bóng ngăn bị cắt ở giao diện tối mà bài kiểm không báo.
  - Ngoài-16: Hai ảnh dùng làm mẫu «ngăn không tách khỏi lưới» được làm tay, nên khó chụp lại đúng cùng điều kiện về sau. Người dùng không bị ảnh hưởng, chỉ việc kiểm lại bằng mắt có thể kém chắc.
  - Ngoài-17: Bài kiểm tra việc lưới khít màn có thể vẫn xanh nếu sau này lưới dừng sai chỗ, nên một lỗi về chỗ dừng của lưới có thể lọt qua mà không ai biết. Hiện màn vẫn chạy đúng.
  - Ngoài-18: Nếu sau này ngăn chi tiết mất bóng hoặc viền trái, bài kiểm tra có thể không báo, nên nhân viên sàn có thể thấy ngăn nhìn phẳng và khó tách khỏi lưới.
  - Ngoài-19: Khi ngăn được ghim thành cột, nếu nút lại hiện chữ hoặc rộng quá thì bài kiểm tra có thể không bắt được, làm hàng nút chật và khó bấm trên màn nhỏ.
