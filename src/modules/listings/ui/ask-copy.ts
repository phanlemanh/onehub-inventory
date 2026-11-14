// Frame words of roadmap row 3e (_acceptance/hoi-dau-chu-bao-sai): asking the listing agent and reporting wrong unit
// details. Concept names (unit, listing agent, the two button labels) are passed in from the label table; only the words around
// them live here.

const lower = (noun: string) => noun.toLocaleLowerCase("vi");

/** The label words a screen passes in: label("AskListAgent"), label("ReportUnitError"), label("Unit"), label("ListAgent"). */
export interface AskWords {
  ask: string;
  report: string;
  unit: string;
  listAgent: string;
}

export const ASK_COPY = {
  /** The ask label, a middle dot, the keeper's name. */
  askWith: (ask: string, name: string) => `${ask} · ${name}`,
  /** The off button of a unit nobody keeps: the unit noun, «chưa có», the agent noun, «giữ». */
  unheld: (unit: string, listAgent: string) => `${unit} chưa có ${lower(listAgent)} giữ`,
  copied: "Đã chép tin hỏi",
  failed: "Máy này không chép hay chia sẻ được. Chép tay tin dưới đây rồi gửi.",
  messageLabel: "Tin để chép tay",
  report: {
    description:
      "Thuộc tính này lấy từ danh mục dùng chung, sàn không tự sửa. Tin báo để đội vận hành sửa; bạn tự chọn nơi gửi.",
    field: "Thuộc tính sai",
    shown: (value: string) => `Đang hiện: ${value}`,
    right: "Giá trị đúng",
    missing: "Gõ giá trị đúng trước khi gửi.",
    basis: "Ghi chú căn cứ",
    basisPlaceholder: "Sổ hồng, bản vẽ, hợp đồng…",
    submit: "Chép và mở bảng chia sẻ",
    opened: "Đã mở bảng chia sẻ",
    copied: "Đã chép",
    failed: "Máy này không chép hay chia sẻ được. Chép tay tin dưới đây rồi gửi.",
  },
} as const;
