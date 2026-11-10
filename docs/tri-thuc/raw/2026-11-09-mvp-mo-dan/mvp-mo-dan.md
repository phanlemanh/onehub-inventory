# Ra mắt MVP Quỹ hàng: khoanh vùng và mở dần — đề xuất 09/11/2026

Trạng thái: **Đề xuất**, chủ kho cho lưu 09/11. Chưa ký ngưỡng, chưa xếp lại hàng, chưa đổi lộ trình, chưa mở ô cơ hội. Soi trên `main` 09724fe6.

**Chưa kiểm được:** số liệu sống của bản thật (số sàn, số người, danh mục đã có khu chưa, lịch chia lead đã chạy chưa). Công
cụ dòng lệnh từ chối kết nối đọc, không dò mật khẩu để lách. Số «3 sàn, ít nhất một sàn không mang nhãn mẫu» lấy từ hồ sơ
bàn giao 08/11. Sao lưu và khôi phục của bản thật cũng chưa kiểm. `/api/v1/health` trả 200 lúc viết.

## Khuyến nghị một câu

Đừng mở theo thứ tự dây chuyền. **Mở từ giữa ra ngoài**: đợt đầu là «bỏ Sheet và gửi link cho khách» cho một sàn, một khu căn
hộ; cửa Telesales và lead sang đợt hai; phát rộng và để sàn tự cấu hình sang đợt ba. Cờ theo sàn, chỉ ba cờ, chặn ở máy chủ.

Căn cứ:

- Thước đã chốt là bỏ hẳn Sheet cho một khu trong hai tuần (Tham chiếu §1), và việc thật là gửi được căn trong vài phút. Cả hai
  nằm ở nửa sau dây chuyền.
- Cửa lead là đoạn yếu nhất hôm nay: rà soát ngày 0 ghi nhịp chia lead không chạy, cách chia mặc định kẹt khi sàn chưa có khu,
  và sáu việc gỡ (chia khi chưa có khu, toà của sàn ở lead…) chưa có hàng trong lộ trình.
- Khác với §10: §10 xếp ô nhận lead vào P0 của hai tuần thử. Đề xuất này chia hai tuần thử thành hai kỳ. Các số đo dòng vào
  (lead → cuộc gọi đầu) đo ở đợt hai.

## 1. Bảng khoanh vùng

Nguyên tắc: cờ theo nhóm tính năng, không theo hàng lộ trình. Thứ nhỏ hơn một nhà hay một nút thì không gắn cờ.

| Nhóm thật của kho | Gồm | Đợt | Cơ chế ẩn |
| --- | --- | --- | --- |
| Nền | Đăng nhập, mời người, vai, cách ly, luật ẩn, đồng bộ nhanh | 0, luôn bật | Không cờ |
| Đưa hàng vào | Nhập Excel không AI (xem trước, nhớ mẫu, hoàn tác), gõ mã căn một khu, **tạo căn tay (chưa dựng)** | 1 | Không cờ |
| Bảng hàng | Bảng kiểu Sheet, sửa ô, sửa hàng loạt, góc nhìn, cột hồ sơ, thẻ điện thoại, đổi đầu chủ hàng loạt | 1 | Không cờ |
| Giữ tươi | Hôm nay đầu chủ, kết quả gọi, gọi điều chỉnh giá, Sẵn sàng bán, ảnh ba ngăn, chụp ảnh, đổi giá nhanh | 1 | Không cờ |
| Phát cho khách | Luồng Gửi, trang khách riêng, Đã gửi, Hôm nay đầu khách, lưu khách | 1 | Không cờ |
| Trưởng nhóm | Hôm nay trưởng nhóm (phần lead tự rỗng khi chưa có lead) | 1 | Không cờ |
| Cửa lead | Vai Telesales, ô nhận lead, kiểm trùng, chia lead, thông báo, lead bốn nấc, màn gọi khai thác, nhà Liên hệ | 2 | Cờ `cua_lead` |
| Phát rộng | Xuất bảng hàng, trang nhóm môi giới, mẫu bảng và mẫu bài | 3 | Cờ `phat_rong` |
| Sàn tự cấu hình | Cách gọi, Trạng thái, Trường riêng, Mẫu, Từ điển. Đợt 1 chỉ mở Người dùng, Thuế phí | 3 | Cờ `cai_dat_san` |
| Nhập có AI | Đề xuất cột, ô lạ | 3 | Đã có thoả thuận theo sàn |
| Thấp tầng, nhà đất | Mã lô, căn ngoài khu, nhập file thấp tầng | Sau hàng 80 | Theo dữ liệu và luật nhận sàn |
| Xác nhận danh mục, tra thị trường | Hộp thư đi, thoả thuận từng sàn | Sau | Đã có thoả thuận theo sàn |
| Đội, Lịch xem | Hiện chỉ là trang giữ chỗ | Gỡ ngay | Bỏ khỏi điều hướng tới khi có màn |

## Các đợt và ngưỡng

Mọi con số là đề xuất, chưa có số nền. Chủ kho ký trước khi bắt đầu; bộ nghi thức nghiệm thu cấm đổi sau khi thấy số.

| Đợt | Điều kiện vào | Tín hiệu | Đạt thì mở đợt kế | Làm lại một vòng | Dừng, xem lại |
| --- | --- | --- | --- | --- | --- |
| **0. Sẵn sàng** (khoảng 1 tuần) | Rà pháp lý xong; bản xem trước tách khỏi dữ liệu thật; ba cờ; đọc được số đo từng sàn; Hôm nay chịu lỗi; tạo căn tay | Diễn tập trọn đường với dữ liệu mẫu trên bản thật; mười người dùng cùng lúc không lỗi kết nối | Không lỗi chặn; bộ kiểm cách ly và rò rỉ xanh | — | — |
| **1. Bỏ Sheet, gửi link** (1 tuần chuyển nhà + 2 tuần đo) | Đợt 0 đạt; ký ngưỡng; thuế phí đặt trước khi nhập file | Số ngày Sheet không sửa; người quay lại; căn xác nhận trong 14 ngày; khách hỏi → gửi (bấm giờ 10 lần); link gửi và tỉ lệ mở | Sheet 14/14 ngày không sửa; ≥ 70% người dùng có việc ≥ 3 ngày ở tuần hai; ≥ 60% căn xác nhận trong 14 ngày; trung vị hỏi → gửi ≤ 5 phút; ≥ 30 link thật, ≥ 50% được mở | Sheet 10–13/14 | Sheet dưới 10/14 hay một lần rò nguồn |
| **2. Dòng vào** (2 tuần chuyển + đo, thêm sàn 2) | Đợt 1 đạt; nhịp chia lead chạy; chia được khi chưa có khu; chữ Lead/Cơ hội đã đổi | Lead → cuộc gọi đầu; nhận đúng hạn; lead → Đang bán; tỉ lệ lead nhập thẳng | Trung vị lead → cuộc gọi ≤ 30 phút; ≥ 80% nhận trong hạn; ≥ 30% lead đủ điều kiện lên Đang bán trong 7 ngày; ≥ 80% lead nhập thẳng thay Zalo | Một số hụt | Telesales không chịu nhập |
| **3. Phát rộng** (4 tuần, thêm sàn 3) | Đợt 2 đạt; luật ẩn thấp tầng xong nếu sàn có thấp tầng | Lần xuất; link môi giới; sàn tự cấu hình bao lâu; giữ chân 30 ngày | ≥ 2 sàn còn dùng sau 30 ngày; sàn mới vào guồng trong 1 ngày với ≤ 2 giờ hỗ trợ | Giữ chân 1 sàn | Không sàn nào giữ |

Lỗi chặn mở quá 24 giờ, rò chủ nhà và lộ giữa sàn là điều kiện dừng ở mọi đợt.

## 2. Cơ chế

**Kho đã có**

- Bảng nhà và nút theo vai ở một chỗ (`navigationFor`). Quyền thao tác theo vai có luật ở cơ sở dữ liệu.
- Cấu hình theo sàn có nhật ký (`company_settings`), nhưng quản trị sàn tự sửa được nên không dùng cho cờ mở dần.
- Thoả thuận bật tắt theo sàn: đã đủ cho AI và xác nhận danh mục.
- Danh sách vận hành kiểu «sàn tin cậy danh mục»: ứng dụng chỉ đọc, chỉ vận hành ghi. Đây là mẫu đúng cho cờ.
- Một điểm chặn chung ở API; test đã giữ mọi link nội bộ trỏ tới trang có thật.
- Cổng Giá trị và phiên nghiệm thu.

**Còn thiếu**

- **Không có cờ tính năng nào trong mã.**
- **Số đo hàng 52 chỉ là hàm tính.** Không gì gọi nó: không đọc sự kiện từ cơ sở dữ liệu, không lệnh, không màn. Ba số (khách hỏi →
  gửi, lượt mở, lượt quan tâm) vẫn ghi «chưa có sự kiện», dù lượt mở và quan tâm đã có từ hàng 35.
- **Chưa phiên nghiệm thu nào mở được.** 110/136 ô cơ hội còn ngưỡng dạng đề xuất; bộ nghi thức dừng khi gặp ngưỡng ấy. Không có
  phiên hay lần lái thử nào đã chạy. 133 việc đang chờ thì không thể chạy 133 phiên: cần một ô cơ hội cho mỗi đợt.

**Cách làm:** cờ theo sàn, không theo vai, không theo người. Quyền theo vai giữ nguyên, tính năng hiện = vai ∩ sàn. Dây chuyền
bàn giao giữa năm vai sẽ gãy nếu mở nửa công ty. Nhóm chưa khai thì đóng; riêng nền và đợt 1 không qua cờ nên lỗi đọc cờ không
làm trống app. Mỗi cờ có hạn dọn 120 ngày. Không dùng cờ này làm gói bán về sau.

**Trang vận hành (bổ sung 09/11, chủ kho hỏi):** một trang `/ops` đơn giản, là chỗ đổi cờ và đọc số đo.

- Có: bảng sàn × ba cờ, gạt phải ghi lý do; số đo từng sàn theo kỳ, chỉ là số tổng hợp; sổ ai đổi gì, lúc nào.
- Không có: xem căn, chủ nhà, số điện thoại, giá đáy; đăng nhập thay người; sửa dữ liệu sàn. Mở sàn và nạp danh mục giữ lối hiện tại.
- Ai vào: danh sách email ở biến môi trường của bản chính thức. Người khác thấy «không thấy trang». Không thêm vai thứ sáu, vì vai
  thuộc từng sàn còn vận hành thì không. Bản xem trước đang chung dữ liệu thật nên không mở trang này.
- Rào ở cơ sở dữ liệu: một vai riêng cho vận hành, chỉ được đọc tên sàn, số tổng hợp và ghi bảng cờ; bộ kiểm cách ly chứng vai này
  không đọc được bảng hàng, liên hệ, chủ nhà.
- Số đo: bấm «Tính lại», máy tính trong đúng vùng từng sàn rồi lưu bản số theo kỳ. Trang chỉ đọc bản số, và bản số là bằng chứng ở cổng.
- Bước sau, chỉ khi cần: đặt hộ cấu hình trước khi sàn vào, dựng form từ sổ điểm biến thiên, để OneHub khỏi giữ vai trong sàn thật.
- Hạng T3 vì có migration và vai mới; không hỏi lại bất biến nào.

**Ẩn mà không lộ — mười một chỗ phải cùng đóng:**

1. Cột nhà, tab, menu Tạo, nút trên điện thoại: đưa cờ vào `navigationFor`.
2. Cột thứ hai và mục Cài đặt.
3. Gõ tên nhà ở ô «Gõ mã căn»: tự đúng khi danh sách nhà đã lọc.
4. Địa chỉ màn: trả «không thấy trang» như trang không tồn tại, không phải «không có quyền». Một bảng địa chỉ → nhóm, thiếu là lỗi biên dịch.
5. API đọc và ghi: chặn ở điểm chung theo đường, trả 404. Test duyệt tài liệu API: đường nào cũng phải thuộc một nhóm.
6. Liên kết trong luồng: việc ở Hôm nay, nút hồ sơ căn, thông báo. Mở rộng bài test link.
7. Việc nền: nhịp chia lead bỏ qua sàn chưa bật; nhóm «Lead mới» không dựng.
8. Tick vai Telesales ở màn Người dùng.
9. Dữ liệu đồng bộ xuống máy và lần vẽ đầu: `/me` trả cờ để vỏ không nháy.
10. Câu dẫn ở trạng thái trống và trang giữ chỗ.
11. **Không chặn trang khách.** Tắt cờ không làm hỏng link đã gửi.

## 3. Rủi ro

**Phụ thuộc giữa tính năng**

- Lưu khách là một phần của Gửi, nên ẩn nhà Liên hệ không tắt dữ liệu liên hệ.
- Hàng 80 chưa làm: chưa có luật ẩn riêng cho nhà phố, đất khi gửi khách. Hai đợt đầu chỉ căn hộ, đúng §1.
- Thuế phí phải đặt trước khi nhập, vì mỗi giá mang dấu định nghĩa lúc vào máy.

**Dữ liệu khi tắt rồi bật**

- Cờ chỉ ẩn lối vào, không xoá gì; sự kiện vẫn chỉ thêm.
- Bật lại cửa lead: lead đang chờ có thể quá hạn đồng loạt và dồn báo vào trưởng nhóm. Luật đề xuất: không tắt nhóm đang có dữ liệu chạy trừ sự cố; bật lại thì hạn tính từ lúc bật.
- Không đổi cờ trong kỳ đo; ghi mốc bật tắt vào số đo.
- **Ngày đầu có thể ngập việc.** Theo luật đã chốt, căn nhập từ Sheet lên Đang bán dù thiếu ảnh; ngày xác nhận lấy theo file. Cả
  khu có thể rơi vào «Bổ sung ảnh» và «Cần gọi lại» ngay. Suy từ luật, chưa thử với file thật. Thử trước ở đợt 0; màn Hôm nay một danh sách việc phải xử được.

**Dùng chung bản thật**

- Mỗi lần gộp vào main lên thẳng bản thật và áp migration; từ tối 07/11 tới sáng 08/11 có chín lần gộp. Đề xuất một cửa phát hành mỗi ngày ngoài giờ làm trong kỳ đo, trừ vá khẩn.
- Hôm nay vừa đổi chế độ kết nối sau sự cố, mới theo dõi 30 phút. Phải đo với mười người cùng lúc.
- Nạp một khu thật vào danh mục sẽ tắt gói mẫu cho mọi sàn, không đường lui ngoài quyền chủ bảng. Sàn mẫu diễn tập mất mã mẫu.
- OneHub không giữ vai làm việc trong sàn thật: trao Quản trị là trao luôn bốn vai và thấy chủ nhà. Chỉ dùng tài khoản đã gỡ bớt, có hạn, chủ sàn tự nhập file có OneHub ngồi cạnh.

**Việc trong đợt dau-khach-nhap**

| Việc | Khuyến nghị | Lý do |
| --- | --- | --- |
| Hôm nay chịu lỗi từng phần; Hôm nay một danh sách việc | Đẩy lên | Màn đầu tiên của mọi người; lỗi đang xảy ra trên bản thật |
| Tạo căn tay (T3, chưa mở) | Đẩy lên | Chủ kho coi là điều kiện để không quay lại Sheet |
| Cờ theo sàn và trang vận hành (đọc số đo), tách bản xem trước | Mở mới | Chưa có hàng nào |
| Các hàng vá đang có PR | Làm tiếp | Đã gần xong |
| Đổi chữ Lead → Cơ hội | Trước đợt 2 | Đợt 1 không có màn lead |
| Cài đặt một cách lưu, bảng đúng khung, tải nhanh, lưới mẫu hành vi | Lùi sau đợt 1 | Đợt 1 ẩn gần hết Cài đặt sàn; giữ hướng đã chốt 09/11, chỉ đổi thứ tự. Việc vá Cài đặt đang dở thì làm xong |
| Hộp thư, thoả thuận, thuộc tính của sàn, sinh xác nhận, tra thị trường, khuôn v2, token máy | Dừng sau hàng đang dở | Không giúp đo giá trị; gói v1 đủ nạp một khu; cần rà pháp lý. Trừ khi đã cam kết với Invest |
| Thấp tầng còn lại (77, 78, 80) | Trước khi có sàn thấp tầng | Đợt 1 chỉ căn hộ |

## 4. Người thử

- **Số sàn:** tổng 3, lần lượt. Đợt 1 một sàn quen, ưu tiên chính đội theo §1; mỗi đợt thêm đúng một sàn.
- **Vai đợt 1:** 6–10 người: một trưởng nhóm, 2–3 đầu chủ, 3–5 đầu khách, một chủ sàn. Đợt 2 thêm 1–2 telesales.
- **Thời lượng:** khoảng 10 tuần cả ba đợt (suy luận, không có chuẩn đã kiểm cho B2B).
- **Thu phản hồi:** số từ sự kiện mỗi tuần; quan sát tại chỗ ngày 1 và ngày 10, ba người mỗi vai; một đầu mối OneHub, một nhóm chat,
  ghi vào cửa tín hiệu hằng ngày, không chép tên thật vào kho; hết đợt một phiên nghiệm thu gom theo nhóm, chấm kín trước khi bàn.
- Câu «nếu mai không còn Quỹ hàng» chỉ để tham khảo vì dưới 40 người.

## Đối chiếu ngành

Sự thật từ nguồn:

- KW Command: beta theo đợt trong 2018, hơn 20.000 môi giới, mở toàn hệ thống 02/2019. [KW](https://kwri.kw.com/press/keller-williams-named-among-fast-companys-most-innovative-companies). Sau đó vẫn bị chê rối, thiếu quyền cho trợ lý. [RealTrends](https://www.realtrends.com/blog/2022/04/21/inside-keller-williamss-revolutionary-app/)
- Compass: beta cho nhóm chọn lọc, không công bố số. [HousingWire](https://www.housingwire.com/articles/compass-robert-reffkin-ai-platform-agent-advocacy/)
- HubSpot: Super Admin đăng ký, chọn phạm vi cả tài khoản. [HubSpot](https://knowledge.hubspot.com/account-management/opt-your-hubspot-account-into-a-public-beta-feature)
- Pipedrive: một lần đăng ký cho cả công ty. [Pipedrive](https://support.pipedrive.com/en/article/beta-program)
- Linear: quản trị bật Preview cho cả workspace. [Linear](https://linear.app/changelog/2022-01-20-linear-preview-new-sidebar-and-team-icons)
- Slack: bắt đầu khoảng 6–10 công ty quen, xem trước kín hơn sáu tháng, mời theo đợt. [First Round](https://review.firstround.com/from-0-to-1b-slacks-founder-shares-their-epic-launch-strategy/). Đội cần chừng 8 người hoạt động mới bám. [Building Slack](https://buildingslack.com/good-enough/)
- Superhuman: ngưỡng 40%, khoảng 40 phản hồi. [First Round](https://review.firstround.com/how-superhuman-built-an-engine-to-find-product-market-fit/)
- Cờ có tuổi thọ và phải dọn. [Fowler](https://martinfowler.com/articles/feature-toggles.html), [LaunchDarkly](https://launchdarkly.com/docs/guides/flags/technical-debt)
- Chặn ở máy chủ, mặc định từ chối. [OWASP](https://top10.owasp.org/2021/A01_2021-Broken_Access_Control)
- 3–4 người mỗi nhóm khi có nhiều nhóm người dùng. [NN/g](https://www.nngroup.com/articles/why-you-only-need-to-test-with-5-users/)

Không tìm thấy: KW Command thí điểm theo market center; tài liệu beta của Lofty, Sierra; trang Power-Ups của Follow Up Boss (403);
tài liệu gốc Salesforce; trang nào tả người chưa được bật thấy gì; nghiên cứu số tuần hình thành thói quen ở B2B.

Suy luận của phiên này: cờ theo sàn thay vì theo vai; ba cờ; mở từ giữa ra ngoài; mọi ngưỡng số; 10 tuần.
