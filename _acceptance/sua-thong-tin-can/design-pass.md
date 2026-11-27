---
slug: sua-thong-tin-can
at: 2026-11-17T02:10:00Z
route: http://127.0.0.1:3487/inventory?vai=ListAgent&ho-so=4d415500-0001-4000-8000-000000000002
material: real-components
context: host-embedded
context_scenes: []
reaction: nac-1 (anh-gui-kem-the)
options:
divergence: skipped — một lối sống theo luật kho: chỗ đặt nút theo bảng «Bộ nút theo quyền» của design/behaviors.md, hộp là FormDialog của kho (dòng sổ S1)
ds_skill: inventory-ui
states: [co-nut-sua, hop-mo, da-luu, khong-quyen]
breakpoints: [mobile-360, desktop-1440]
themes: [light, dark]
patched: 0
deferred: 1
---
# design-pass — sua-thong-tin-can

Bản bấm được là Bảng hàng thật (`/inventory`) trong App Shell thật, máy dev dãy H cổng 3487, chế độ mẫu (không cơ sở dữ
liệu; `?vai=` thay vai). Hộp «Sửa» và ô cột riêng là mã thật của hàng, không phải bản vẽ. Chụp bằng Playwright, đã ẩn nút
«N» của công cụ dựng.

## Ma trận capture

| state | breakpoint | theme | file |
|---|---|---|---|
| co-nut-sua | desktop-1440 | light | evidence/design-pass/ho-so-1440-sang.png |
| co-nut-sua | mobile-360 | light | evidence/design-pass/ho-so-360-sang.png |
| hop-mo | desktop-1440 | light | evidence/design-pass/hop-1440-sang.png |
| hop-mo | desktop-1440 | dark | evidence/design-pass/hop-1440-toi.png |
| hop-mo | mobile-360 | light | evidence/design-pass/hop-360-sang.png |
| da-luu | desktop-1440 | light | evidence/design-pass/da-luu-1440-sang.png |
| da-luu | mobile-360 | light | evidence/design-pass/da-luu-360-sang.png |
| khong-quyen | desktop-1440 | light | evidence/design-pass/quan-tri-1440-sang.png |

## Findings

- Đạt: «Sửa» ở đầu mục «Lần chào đang mở», cùng dáng nút phụ không viền với «Báo sai thông tin» của mục Căn.
- Đạt: lưu xong mục đổi tại chỗ, thông báo «Đã đổi thông tin căn 1101.» kèm «Hoàn tác»; Quản trị sàn không có nút.
- Hoãn (1): ảnh bộ sửa ô của cột riêng cần sàn có trường riêng — chế độ mẫu không có lớp riêng của sàn; chụp ở S4 trên
  Postgres dãy H (E6-ui). Bộ sửa dùng khung «editing-2 + dòng dưới ô» chủ kho đã chọn ở hàng 4.
