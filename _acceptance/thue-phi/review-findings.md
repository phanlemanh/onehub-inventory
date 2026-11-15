# Review findings: thue-phi (round 7)

## Trong hợp đồng

Không có.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Design / module boundaries: company-config reads identity's table directly**
  Người dùng thấy gì: Lưu Thuế phí hiện chạy đúng. Nhưng nếu sau này đội đổi cách lưu danh sách thành viên, việc lưu Thuế phí có thể hỏng mà không ai được báo trước.
  Căn cứ: Người dùng chưa gặp lỗi nào hôm nay, nên hậu quả nhẹ và chỉ hiện khi có thay đổi sau này; ghi lại để người sửa phần thành viên biết còn chỗ này phụ thuộc.
  file: `src/modules/company-config/fee-store.ts`
  severity: medium
  Đề xuất: known-limits

- **Records: an editor's name can be saved as a placeholder**
  Người dùng thấy gì: Hiếm khi, nếu hệ thống không đọc được tên người sửa, mức Thuế phí vẫn được lưu nhưng dòng nguồn hiện dấu gạch thay vì tên người đã đổi.
  Căn cứ: Số tiền và mức thuế phí vẫn đúng, chỉ thiếu tên người đổi ở một dòng và tình huống này hiếm; không mất dữ liệu tính toán nhưng không tự sửa lại được tên đã ghi.
  file: `src/modules/company-config/fee-store.ts`
  severity: low
  Đề xuất: known-limits

- **SP-1 touch record does not cover HEAD**
  Người dùng thấy gì: Sổ ghi các chỗ chạm luật cách ly dữ liệu giữa các sàn chưa tính hai lần sửa mới nhất, nên người ký phải tự nhớ rằng hai lần đó chỉ thêm bài kiểm.
  Căn cứ: Không ảnh hưởng gì tới người dùng cuối và hai lần sửa ấy là bài kiểm cố ý; chỉ cần tạo lại sổ trước khi ký nếu muốn gọn.
  file: `_acceptance/thue-phi/luat-cham.json`
  severity: low
  Đề xuất: known-limits

- **Evidence: CI is not green on the reviewed HEAD (r6 · tệp đã đổi)**
  Người dùng thấy gì: Một số bước kiểm tra tự động trên bản chờ gộp chưa xong hoặc chưa qua, nên chưa thể coi các thử nghiệm với cơ sở dữ liệu thật là đã đạt. Đây là việc chờ chạy xong, không phải lỗi người dùng sẽ gặp.
  Căn cứ: Chỉ là trạng thái chờ kiểm tra tự động, không làm mất dữ liệu hay hỏng chức năng, và sẽ tự rõ khi các bước chạy xong hoặc chạy lại.
  file: `_acceptance/thue-phi/evidence-report.md`
  severity: medium
  Đề xuất: wont-fix

- **CI and agent privileges / Tier: a protected check tool was loosened on a supervisor ruling that is not in any ledger (r6)**
  Người dùng thấy gì: Công cụ kiểm tra vòng đời thao tác đã được nới lỏng theo một phán quyết của giám sát chưa được ghi vào sổ quyết định. Người dùng cuối không thấy gì, nhưng chủ kho nên biết để duyệt rõ ràng.
  Căn cứ: Không ảnh hưởng dữ liệu hay màn hình của người dùng, chỉ thiếu dấu vết duyệt; ghi lại phán quyết vào sổ sau này là rẻ và không mất gì.
  file: `tools/coverage_matrix/lifecycle.py`
  severity: medium
  Đề xuất: known-limits

- **Records: wiki/log.md newest-first order (r6 · tệp đã đổi)**
  Người dùng thấy gì: Dòng ghi nhật ký của hàng này nằm lệch chỗ so với thứ tự mới nhất lên đầu. Chỉ ảnh hưởng người đọc nhật ký, không ảnh hưởng người dùng.
  Căn cứ: Chỉ là thứ tự dòng trong nhật ký, không mất dữ liệu, ai đọc cũng tự hiểu được, và sửa lúc nào cũng rẻ.
  file: `wiki/log.md`
  severity: low
  Đề xuất: wont-fix

- **Design / module boundary: company-config reads identity's company_members table directly (r5)**
  Người dùng thấy gì: Khi Quản trị sàn lưu thuế phí, hệ thống lấy tên người lưu bằng đường tắt không chính thức. Người dùng vẫn thấy đúng tên, chỉ khi không tìm ra tên thì dòng nguồn ghi «—».
  Căn cứ: Dữ liệu vẫn không lọt sang sàn khác và người dùng hầu như không thấy khác biệt; chỉ là nợ cấu trúc, sửa sau vẫn rẻ.
  file: `src/modules/company-config/fee-store.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2 (fixture viết tay đúng khuôn bên đọc): bên gửi «màn» trong bảng tên-qua-một-lần-Lưu được chép tay, không lấy từ màn (r5)**
  Người dùng thấy gì: Bài kiểm chưa tự bắt được trường hợp màn thôi gửi tên của khoản không đổi. Nếu lỗi đó quay lại, người dùng có thể thấy tên khoản riêng bị đặt về mặc định mà không có cảnh báo từ kiểm thử.
  Căn cứ: Hiện chưa có lỗi nào xảy ra với người dùng, hai đầu vẫn được đo riêng; thêm bài đo vòng kín có thể làm sau và không mất dữ liệu.
  file: `src/modules/company-config/fee-store.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (âm-tính-một-mình, không ghim thông điệp): «is up to date with the code» chỉ đo mã thoát 0, mà công cụ cũng thoát 0 khi không kiểm gì (r5)**
  Người dùng thấy gì: Bài kiểm danh mục thành phần giao diện có thể báo xanh dù công cụ không kiểm gì. Người dùng không thấy gì khác; chỉ là danh mục có thể lệch với mã mà không ai hay.
  Căn cứ: Không ảnh hưởng người dùng và không mất dữ liệu; lệch danh mục sẽ lộ ra ở lượt sau và sửa lúc đó không tốn kém.
  file: `tests/design-registry.test.ts`
  severity: medium
  Đề xuất: wont-fix

- **SP-1 touch record (luat-cham) does not cover HEAD (r4 · tệp đã đổi)**
  Người dùng thấy gì: Bản ghi các luật sản phẩm bị chạm chưa được cập nhật tới bản cuối, nhưng nội dung vẫn đúng. Người dùng không thấy gì khác.
  Căn cứ: Hậu quả nhẹ: chỉ là sổ ghi chép chưa làm mới, không mất hay lộ dữ liệu, rà lại sau rất rẻ.
  file: `_acceptance/thue-phi/luat-cham.json`
  severity: low
  Đề xuất: known-limits

- **Contract names the wrong SP-1 table (r4 · tệp đã đổi)**
  Người dùng thấy gì: Đoạn mô tả luật chạm trong hợp đồng gọi sai tên bảng lưu mức thuế phí của sàn. Người ký đọc thấy tên không khớp với bảng thật, nhưng cách ly giữa các sàn vẫn đúng.
  Căn cứ: Chỉ là chữ sai trong tài liệu, không ảnh hưởng người dùng cuối hay dữ liệu, và sửa một dòng là xong.
  file: `_acceptance/thue-phi/contract.md`
  severity: low
  Đề xuất: known-limits

- **Domain / Product language: tên khái niệm viết cứng trong câu chữ của phần Thuế phí (r3)**
  Người dùng thấy gì: Một vài câu hướng dẫn ở phần Thuế phí viết sẵn chữ «giá chào», «bao phí», «thuế phí». Nếu sau này sàn đổi tên gọi các khái niệm này, những câu đó có thể lệch với tiêu đề cột.
  Căn cứ: Hậu quả nhẹ: chỉ lệch chữ khi nhãn đổi, không mất hay lộ dữ liệu, và sửa lúc đó rất rẻ.
  file: `src/modules/company-config/ui/fee-copy.ts`
  severity: medium
  Đề xuất: known-limits

- **Domain: mỗi luật nghiệp vụ ở đúng một chỗ, nhưng các ngưỡng thuế phí bị chép thành số cứng trong câu báo lỗi (r3)**
  Người dùng thấy gì: Các câu báo lỗi ghi sẵn số như tối đa 5 khoản, tối đa 5%. Nếu về sau đổi các ngưỡng này mà quên sửa câu, màn hình sẽ báo sai con số.
  Căn cứ: Ngưỡng hiếm khi đổi và các con số hiện đang đúng, người dùng không bị thiệt gì lúc này; chỉ cần nhớ sửa chữ khi đổi ngưỡng.
  file: `src/modules/company-config/ui/fee-copy.ts`
  severity: low
  Đề xuất: wont-fix

- **Domain: khuôn của khoản riêng trong migration chưa đủ, thiếu ràng buộc tên bắt buộc (r3)**
  Người dùng thấy gì: Chỉ khi ai đó ghi thẳng vào cơ sở dữ liệu, bỏ qua màn hình và API, mới tạo được khoản riêng không có tên và hiện ra một dòng trống. Đi qua màn hình thì không xảy ra.
  Căn cứ: Không mất hay lộ dữ liệu, người dùng bình thường không gặp, và chỉ đường ghi thẳng mới gây ra; thêm ràng buộc sau này vẫn rẻ.
  file: `db/migrations/012_thue_phi.sql`
  severity: low
  Đề xuất: known-limits

- **Design: địa chỉ API viết lặp, không dùng hằng FEE_API đã khai (r3)**
  Người dùng thấy gì: Địa chỉ lưu thuế phí được viết lặp ở hai chỗ trong mã. Người dùng không thấy gì khác; chỉ gây nhầm cho người sửa mã nếu sau này đổi đường dẫn.
  Căn cứ: Không ảnh hưởng người dùng, chi phí sửa nhỏ nhưng cũng không đáng mở việc riêng.
  file: `src/modules/company-config/ui/fee-part.tsx`
  severity: low
  Đề xuất: wont-fix

- **Committed E10-them.png comes from a failed repeat run: it shows a duplicate «Phí dịch vụ hồ sơ» row with «Đã có khoản cùng tên.» and Lưu disabled (r3)**
  Người dùng thấy gì: Một ảnh chụp làm bằng chứng cho bước thêm khoản đang hiện trạng thái lỗi tên trùng thay vì trạng thái thêm thành công. Người dùng cuối không thấy, nhưng người chấm có thể mở nhầm ảnh sai.
  Căn cứ: Không ảnh hưởng người dùng cuối, người chấm tự kiểm lại được bằng cách chạy lại và chụp lại ảnh, sửa rất rẻ.
  file: `_acceptance/thue-phi/evidence/E10-them.png`
  severity: high
  Đề xuất: known-limits

- **Decision d-34 says three repeats at 1440 were all green, but the frames on disk show the repeat failed at the save step (r3 · tệp đã đổi)**
  Người dùng thấy gì: Sổ quyết định nói ba lần chạy lặp đều xanh, nhưng ảnh còn lại cho thấy lần lặp dừng giữa chừng. Người dùng không bị ảnh hưởng, chỉ có nguy cơ tin nhầm rằng lỗi đã hết.
  Căn cứ: Chỉ là sai lệch trong hồ sơ nội bộ, không mất dữ liệu; chạy lại rồi cập nhật ghi chú là xong.
  file: `_acceptance/thue-phi/decisions.jsonl`
  severity: high
  Đề xuất: known-limits

- **anh-ui-check is not idempotent: adding the item «Phí dịch vụ hồ sơ» fails on any second run against the same company/DB (r3 · tệp đã đổi)**
  Người dùng thấy gì: Bài kiểm tra bằng trình duyệt chỉ chạy đúng lần đầu trên một sàn mẫu; chạy lại trên cùng dữ liệu sẽ báo lỗi tên trùng dù sản phẩm đúng. Người dùng cuối không gặp.
  Căn cứ: Chỉ ảnh hưởng người chạy kiểm thử, tránh được bằng cách dựng lại dữ liệu mẫu trước mỗi lần, không ảnh hưởng người dùng.
  file: `tests/e2e-db/thue-phi.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **9. Design: errors are handled — a valid save at the five-item limit fails with 500 (r2)**
  Người dùng thấy gì: Khi sàn đã có đủ năm khoản riêng, quản trị bỏ một khoản và thêm khoản mới trong cùng một lần Lưu sẽ báo lỗi chung chung, thử lại vẫn không được.
  Căn cứ: Không mất dữ liệu và có đường vòng: lưu việc bỏ khoản trước rồi thêm khoản mới ở lần lưu sau; chỉ gặp ở sàn đã dùng hết năm khoản.
  file: `src/modules/company-config/fee-store.ts`
  severity: medium
  Đề xuất: known-limits

- **Saving drops the custom name of a renamed brokerage item (r2)**
  Người dùng thấy gì: Quản trị đổi tên Phí môi giới rồi về sau bật tắt một công tắc và Lưu, tên tự đặt bị lặng lẽ đổi lại tên mặc định mà không báo.
  Căn cứ: Mất tên đã đặt mà không có cảnh báo, người dùng phải tự phát hiện và đặt lại; không mất số liệu tiền, sửa rẻ nhưng cần quyết định riêng vì ngoài tiêu chí hiện có.
  file: `src/modules/company-config/fee-store.ts`
  severity: high
  Đề xuất: new-contract

- **Swapping an own item at the five-item limit fails with a server error (r2)**
  Người dùng thấy gì: Ở sàn đã đủ năm khoản riêng, bỏ một khoản và thêm một khoản khác cùng lúc không lưu được và chỉ hiện thông báo lỗi chung.
  Căn cứ: Không mất dữ liệu, tách thành hai lần lưu là qua được, và chỉ xảy ra ở sàn dùng đủ năm khoản.
  file: `src/modules/company-config/fee-store.ts`
  severity: high
  Đề xuất: known-limits

- **A 400 with no problem list is silently ignored when saving (r2)**
  Người dùng thấy gì: Hiếm khi máy chủ từ chối lần lưu mà không nói lý do, khi đó bấm Lưu không thấy gì xảy ra và không có thông báo.
  Căn cứ: Chỉ xảy ra khi yêu cầu bị hỏng bất thường chứ không do người dùng nhập sai; không mất dữ liệu và tải lại rồi thử lại được.
  file: `src/modules/company-config/ui/fee-part.tsx`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 1 (đo chỉ dẫn thay vì đầu ra): «cột Điều kiện phí ẩn sẵn» được đo bằng cách tìm chữ trong mã nguồn hàm (r2 · tệp đã đổi)**
  Người dùng thấy gì: Kiểm tra tự động chưa chứng minh thật rằng cột Điều kiện phí ẩn lúc đầu và bật được, nên nếu cột này hỏng có thể không ai biết ngay.
  Căn cứ: Chỉ là kiểm tra lỏng, người dùng không gặp lỗi hiện tại; rủi ro là bỏ sót hỏng hóc về sau và có thể bổ sung kiểm tra sau.
  file: `tests/thue-phi-cot.test.ts`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 4 (assert âm tính đứng một mình): cột Điều kiện phí vắng mặt trong bon-kho, không có đối chứng dương ở đường luôn chạy (r2 · tệp đã đổi)**
  Người dùng thấy gì: Lời hứa cột Điều kiện phí ẩn sẵn nhưng bật được chỉ được kiểm đầy đủ khi chạy ca ảnh đặc biệt, lần chạy thường chỉ kiểm vế ẩn.
  Căn cứ: Không ảnh hưởng người dùng hôm nay; chỉ làm giảm độ tin của phép đo thường và bổ sung sau không tốn nhiều.
  file: `tests/e2e-db/thue-phi.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (assert âm tính đứng một mình): «mã đã bỏ không bị cấp lại» qua cả khi việc thêm thất bại (r2)**
  Người dùng thấy gì: Kiểm tra tự động về việc khoản đã bỏ không bị dùng lại mã có thể vẫn xanh dù việc thêm khoản thất bại, nên không bắt được lỗi này nếu xảy ra.
  Căn cứ: Người dùng không gặp gì hôm nay; chỉ là lưới kiểm lỏng và làm chặt thêm là việc rẻ, làm khi tiện.
  file: `src/modules/company-config/fee-store.test.ts`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 4 (không ghim thông điệp, không đối chứng): khoản luật bị đổi tên hay bị bỏ chỉ kiểm status 400 (r2)**
  Người dùng thấy gì: Kiểm tra việc từ chối đổi tên hay bỏ khoản theo luật chỉ xem có báo lỗi hay không, chưa xem có nêu đúng khoản và dữ liệu có giữ nguyên không.
  Căn cứ: Người dùng không bị ảnh hưởng hôm nay; nếu về sau hỏng, lỗi có thể lọt qua kiểm tra nhưng sửa phần kiểm rẻ.
  file: `tests/db/thue-phi.db.test.ts`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 4 (thông điệp ghim không khớp assert): chiều đỏ của E1 ghim một chuỗi mà bài không bao giờ in ra (r2 · tệp đã đổi)**
  Người dùng thấy gì: Sổ ghi cách kiểm tra mô tả một thông báo lỗi mà bài kiểm thật không in ra, nên người đọc sổ khó đối chiếu một lần đỏ thật.
  Căn cứ: Chỉ là ghi chép lệch, không đụng tới người dùng hay số liệu; sửa rẻ nhưng không cấp bách.
  file: `_acceptance/thue-phi/evals.yaml`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 5 (tuyên cả lớp nhưng chỉ đo một điểm): E6-e2e hứa «ở bốn khổ» nhưng ca chỉ chạy ở 1440 (r2 · tệp đã đổi)**
  Người dùng thấy gì: Số Về tay cụ thể chỉ được kiểm ở màn hình lớn; ở ba cỡ màn hình nhỏ chỉ kiểm có cột chứ chưa kiểm giá trị.
  Căn cứ: Giá trị tính cùng một lõi cho mọi cỡ màn hình nên rủi ro thấp, và bổ sung kiểm tra là việc rẻ.
  file: `tests/e2e-db/thue-phi.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (thông điệp ghim không khớp assert): chiều đỏ của E2 ghim «Lệ phí trước bạ», nhưng assert sẽ hỏng trước lại so mã (r2)**
  Người dùng thấy gì: Nếu thứ tự ba khoản bị đảo, bài kiểm vẫn báo đỏ nhưng thông báo không nêu tên khoản như sổ ghi, nên người đọc khó hiểu ngay.
  Căn cứ: Không ảnh hưởng người dùng; chỉ làm thông báo lỗi khó đọc hơn mong đợi nên chấp nhận được.
  file: `src/modules/company-config/ui/fee-part.test.tsx`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 1 (đo chỉ dẫn thay vì đầu ra): «phần không tự vẽ khung» được đo bằng grep tệp nguồn (r2)**
  Người dùng thấy gì: Việc phần Thuế phí dùng đúng khung chung chỉ được kiểm bằng đọc chữ trong mã, chưa kiểm giao diện thật, nên một viền tự thêm bằng cách khác có thể lọt.
  Căn cứ: Hiện chưa có lỗi hiển thị nào được chỉ ra, rủi ro là lệch giao diện nhẹ mà người dùng tải lại vẫn dùng được; làm chặt kiểm tra sau là rẻ.
  file: `src/modules/company-config/ui/fee-part.test.tsx`
  severity: medium
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

Không có.

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
