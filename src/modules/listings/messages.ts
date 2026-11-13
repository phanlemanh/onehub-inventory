// The two internal messages about a listing (row 3e, _acceptance/hoi-dau-chu-bao-sai): asking the listing agent, and
// reporting a wrong catalog detail. Pure: built only from what the record shows and what the person typed — nothing of
// the owner, no network. The person sends them through the device's share sheet (SP-3).

/** The link of one listing: the inventory address that opens its record (row 3), absolute so it can be pasted. */
export function recordLink(id: string, origin: string): string {
  return new URL(`/inventory?ho-so=${encodeURIComponent(id)}`, origin).toString();
}

const lower = (noun: string) => noun.toLocaleLowerCase("vi");

/** «Hỏi về <đơn vị> <mã> · <toà>» and the link to the listing's record; `unitLabel` is label("Unit"). */
export function askListAgentMessage(
  listing: { id: string; unitNumber: string; buildingName: string },
  unitLabel: string,
  origin: string,
): { text: string; url: string } {
  const where = [listing.unitNumber, listing.buildingName]
    .filter((part) => part !== "")
    .join(" · ");
  return { text: `Hỏi về ${lower(unitLabel)} ${where}`, url: recordLink(listing.id, origin) };
}

/** label(ReportUnitError), the unit noun and its number: the report's first line and its dialog's title. */
export function reportTitle(reportLabel: string, unitLabel: string, unitNumber: string): string {
  return `${reportLabel} ${lower(unitLabel)} ${unitNumber}`;
}

/** The right value is required, 1–200 characters once trimmed; the basis is at most 500. */
export const REPORT_RIGHT_MAX = 200;
export const REPORT_BASIS_MAX = 500;

export function reportReady(right: string): boolean {
  const value = right.trim();
  return value.length > 0 && value.length <= REPORT_RIGHT_MAX;
}

export interface UnitErrorReport {
  /** label("ReportUnitError") and label("Unit"), for the first line. */
  reportLabel: string;
  unitLabel: string;
  unitNumber: string;
  building: string;
  subdivision: string;
  /** Labels of the building and subdivision lines, from the label table. */
  buildingLabel: string;
  subdivisionLabel: string;
  field: string;
  shown: string;
  right: string;
  basis: string;
}

/** The report, one fact per line; «Ghi chú» only when the person gave a basis. */
export function unitErrorReport(r: UnitErrorReport): string {
  const lines = [
    reportTitle(r.reportLabel, r.unitLabel, r.unitNumber),
    `${r.buildingLabel}: ${r.building}`,
    `${r.subdivisionLabel}: ${r.subdivision}`,
    `Thuộc tính: ${r.field}`,
    `Đang hiện: ${r.shown}`,
    `Đúng là: ${r.right.trim()}`,
  ];
  if (r.basis.trim() !== "") lines.push(`Ghi chú: ${r.basis.trim()}`);
  return lines.join("\n");
}
