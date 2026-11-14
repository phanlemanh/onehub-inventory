---
slug: thue-phi
at: 2026-11-14T13:10:00Z
route: /tuy-chinh-san?phan=thue-phi và /inventory (dev server trên Postgres dãy N, bản mẫu dựng trên nhánh 7e ở worktree tạm, không gộp)
material: real-components
context: host-embedded
context_scenes: []
reaction: nac-1 (anh-gui-kem-the)
options: _acceptance/thue-phi/cong-pham-vi.html (A | B cho Hỏi-2, Hỏi-3, Hỏi-6 theo lời giám sát G-1411-81) · ảnh ở cong/ · khối gốc cong/reui-settings-3-goc.webp
divergence: opened
ds_skill: inventory-ui
states: [h2-a, h2-b, h3-a, h3-b, chi-doc, sai]
breakpoints: [mobile-360, desktop-1440]
themes: [light]
patched: 4
deferred: 0
---

# design-pass — thue-phi

- Giám sát yêu cầu (G-1411-81) mỗi câu Hỏi-2, Hỏi-3, Hỏi-6 một hàng ảnh A | B. Hỏi-3 khác nhau ở một cột — câu được giữ vì
  chủ kho cần thấy sức chứa của Bảng hàng ở 1440, không phải bố cục.
- Phần Thuế phí dựng trong cột thứ hai thật của App Shell, màn Tuỳ chỉnh của sàn của 7e (bản mẫu ở worktree tạm từ nhánh
  `claude/nervous-chaum-ec346e`, chưa gộp; bản dựng làm lại sau khi PR #53 vào nhánh chính).
- Khối ReUI `settings-3` dựng theo hình, chưa phải mã khối: máy chủ ReUI lỗi đăng nhập (401). Ảnh gốc chụp trước khi dựng:
  `cong/reui-settings-3-goc.webp`. Giữ khung ngoài nền nhạt có tiêu đề, thẻ trong chia dòng, mỗi dòng hai cột (tên và mô
  tả | điều khiển); bỏ nhãn Required/Pro.
- Bảng hàng: cột «Về tay» sau «Giá chào» trên hàng mẫu của sàn mẫu, mức mẫu: Thuế TNCN 2% + Phí môi giới 2%, Lệ phí trước
  bạ tắt.
- Ảnh chụp bằng Playwright, 1440 × 900 và 360 × 800, nền sáng (ảnh tối để sau khi chủ kho chọn lối), người đã đăng nhập của [Sàn mẫu Ocean]; nút «N» của công cụ dựng ẩn.

## Ma trận capture

| state | breakpoint | theme | file |
| --- | --- | --- | --- |
| h2-a (Tuỳ chỉnh của sàn › Thuế phí, Quản trị) | 1440, 360 | light | cong/h2-a-<khổ>-sang.webp |
| h2-b (Cài đặt sàn riêng, Quản trị) | 1440, 360 | light | cong/h2-b-<khổ>-sang.webp |
| h3-a (Bảng hàng, Về tay, Đầu chủ) | 1440, 360 | light | cong/h3-a-<khổ>-sang.webp |
| h3-b (Bảng hàng, Về tay + Điều kiện phí) | 1440, 360 | light | cong/h3-b-<khổ>-sang.webp |
| chi-doc (Trưởng nhóm) | 1440, 360 | light | cong/chi-doc-<khổ>-sang.webp |
| sai (gõ 6) | 1440 | light | cong/sai-1440-sang.webp |

## Findings

- Đã sửa: «0,5% · theo luật» xuống dòng (nới ô tỉ lệ); 360 dòng tràn, công tắc ra ngoài khung (xếp chồng ở khổ nhỏ, ẩn chữ
  cạnh công tắc, giữ tên cho trình đọc màn hình); ô «Gõ để tìm» còn hiện vì nền 7e chưa có 2e (gộp nhánh chính vào worktree
  tạm); ảnh lối A lộ mục «Cài đặt sàn» của lối B (ẩn mục ấy ở ảnh A).
- Rủi ro nêu đầu trang cổng: ở 1440 khi cột thứ hai mở, Về tay đẩy cột «Xác nhận lúc» ra sau mép phải; AC-6 viết lại theo
  ảnh (Về tay thấy ngay, cột sau cuộn ngang).
- Bảng hàng ở 360 giữ cách hiện sẵn có (cuộn ngang), Về tay không thấy ở khung đầu — đúng hành vi khổ nhỏ hôm nay.
