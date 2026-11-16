// Every sentence of the inventory grid's paste preview (row 5), in one file for the reviewer (design/language.md).
// Concept words (the unit, the price, the statuses) come from the label table through `word` and `statusLabel`; the
// shared preview's own words about cells live in src/components/candidate/paste-copy.ts.
import type { GridRow } from "@/components/candidate/data-region";
import type { ListingStandardStatus } from "@/generated/ontology";
import { statusLabel } from "@/lib/format";

import { statusWords, type PasteSkip } from "../paste-rules";

import { word, type CellEditLabels } from "./cell-edit-copy";

/** Every sentence of the plan, with the concept words of the label table. */
export function pasteWords(labels: CellEditLabels) {
  const unit = (tx?: GridRow["transaction"]) => word(labels, "Unit", tx);
  const lower = (text: string) => text.toLocaleLowerCase("vi");
  return {
    title: (count: number) => `Dán vào ${count} ${lower(unit())}`,
    where: (row: GridRow) => `${unit(row.transaction)} ${String(row["Listing.unitNumber"] ?? "")}`,
    unitFact: (tx?: GridRow["transaction"]) =>
      `thuộc tính ${lower(unit(tx))} — không sửa trên bảng`,
    confirmed: (tx?: GridRow["transaction"]) =>
      `máy tự ghi khi ${lower(word(labels, "ListPrice", tx))} hay ${lower(word(labels, "StandardStatus", tx))} đổi`,
    custom: "cột riêng của sàn chưa sửa được trên bảng",
    computed: "cột máy tính từ các cột khác — không dán được",
    other: "cột này không sửa trên bảng",
    notAllowed: "vai của bạn không sửa được ô này",
    price: "chưa hiểu — gõ như 4,65 tỷ hoặc 950 triệu",
    status: (tx?: GridRow["transaction"]) =>
      `chưa hiểu — gõ một trong: ${statusWords(tx).join(", ")}`,
    skip: (
      why: PasteSkip,
      from: ListingStandardStatus,
      to: string,
      tx?: GridRow["transaction"],
    ) => {
      const name = (s: ListingStandardStatus) => statusLabel(s, tx);
      if (why === "move") return `từ ${name(from)} không sang ${to} được`;
      if (why === "closed-needs")
        return `${name("Closed")} cần ${lower(word(labels, "ClosePrice", tx))} và ${lower(word(labels, "CloseDate", tx))} — mở ô để đổi`;
      if (why === "withdrawn-needs")
        return `${name("Withdrawn")} cần ${lower(word(labels, "WithdrawnReason", tx))} — mở ô để đổi`;
      return `${name(from)} — giữ nguyên như lúc bán`;
    },
    refused: `Vai của bạn chưa sửa được ${lower(unit())} trên bảng.`,
    records: (count: number) => `${count} ${lower(unit())}`,
  };
}
