// Words of the saved views (row 2c). Concept and action names come from the label table through the screen (this
// module does not read company settings); the sentences around them are built here.
import { SAVED_VIEW_NAME_MAX, type SavedViewNameError } from "../saved-view";

/** The labels the screen passes down, each read with label() from the label table. */
export interface SavedViewLabels {
  /** SavedView */
  view: string;
  /** SaveView */
  save: string;
  /** SaveViewChanges */
  saveChanges: string;
  /** SaveAsNewView */
  saveAsNew: string;
  /** RenameView */
  rename: string;
  /** RemoveView */
  remove: string;
  /** Unit */
  unit: string;
  /** Inventory */
  inventory: string;
}

export function savedViewCopy(l: SavedViewLabels) {
  const view = l.view.toLocaleLowerCase("vi");
  return {
    labels: l,
    mine: `${l.view} của tôi`,
    empty: `Chưa có ${view} nào. Lọc, sắp xếp hay ẩn cột rồi bấm «${l.save}».`,
    unreadable: `Chưa đọc được ${view} của bạn. Tải lại trang sau ít phút.`,
    /** The mark of an open view whose arrangement moved since it was opened. */
    changed: "đã đổi",
    missing: `${l.view} này không còn`,
    missingWhy: `${l.view} đã bị xoá hoặc không phải của bạn. Bạn đang xem mọi ${l.unit.toLocaleLowerCase("vi")}.`,
    nameLabel: "Tên",
    saveDescription: `Đặt tên cho cách xem này: tìm, lọc, sắp xếp, nhóm và cột đang hiện. Chỉ bạn thấy ${view} này.`,
    saveAsNewDescription: `Cách xem đang có thành một ${view} mới; ${view} đang mở giữ nguyên.`,
    renameDescription: "Chỉ đổi tên, cách xem giữ nguyên.",
    submit: "Lưu",
    busy: "Đang lưu…",
    nameErrors: {
      "name-empty": "Bạn nhập tên.",
      "name-too-long": `Tên dài tối đa ${SAVED_VIEW_NAME_MAX} ký tự.`,
      "name-taken": `Bạn đã có một ${view} tên này.`,
    } satisfies Record<SavedViewNameError, string>,
    failed: "Chưa lưu được. Bạn kiểm tra mạng rồi bấm «Thử lại».",
    saved: (name: string) => `Đã lưu ${view} «${name}».`,
    changesSaved: (name: string) => `Đã lưu thay đổi của «${name}».`,
    removeWhat: (name: string) =>
      `${l.view} «${name}» sẽ mất khỏi cột thứ hai. Dữ liệu trên ${l.inventory} không đổi.`,
    removed: (name: string) => `Đã xoá ${view} «${name}».`,
  };
}

export type SavedViewCopy = ReturnType<typeof savedViewCopy>;
