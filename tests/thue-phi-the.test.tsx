// @vitest-environment jsdom
// Row 19 after row 2b (_acceptance/thue-phi, sixth fix after the scope gate): the phone card shows the net-to-seller
// amount at the right end of its facts line, only for a sale whose price includes the fees. Every other card, and every
// card while the option is off, is the row 2b card unchanged.
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { label } from "../src/modules/company-config";
import { formatByKind } from "../src/lib/format";
import type { GridRow } from "../src/components/candidate/data-region";
import {
  ListingCard,
  NET_TO_SELLER_FIELD,
  cardNetOf,
  listingView,
} from "../src/modules/listings/ui";

afterEach(cleanup);

const HEADERS = {
  "Listing.unitNumber": "Căn",
  "Listing.buildingName": "Toà",
  "Listing.subdivisionName": "Dự án",
  "Listing.standardStatus": "Trạng thái",
  "Listing.listPrice": "Giá chào",
  "Unit.livingArea": "Diện tích",
  "Unit.bedroomsTotal": "Phòng ngủ",
  "Listing.lastConfirmedAt": "Xác nhận lúc",
} as const;

const NET = label("NetToSeller");
const row = (over: Partial<GridRow> = {}): GridRow => ({
  id: "l-1",
  "Listing.unitNumber": "A-12.05",
  "Listing.buildingName": "[MAU] A",
  "Listing.subdivisionName": "[MAU] Dự án",
  "Listing.standardStatus": "Active",
  "Listing.listPrice": 5_700_000_000,
  "Unit.livingArea": 110.4,
  "Unit.bedroomsTotal": 3,
  [NET_TO_SELLER_FIELD]: 5_480_000_000,
  ...over,
});

const card = (r: GridRow, net?: ReturnType<typeof cardNetOf>) =>
  render(
    <ListingCard
      layout="row"
      view={listingView(r, HEADERS)}
      priceLabel="Giá chào"
      building="[MAU] A"
      net={net}
    />,
  ).container;

describe("ve-tay-tren-the (row 19 × 2b)", () => {
  it("a sale with the fees in its price shows «Về tay» and the amount at the right end of the facts line", () => {
    const r = row();
    const c = card(r, cardNetOf(r, "Included", NET));
    const amount = c.querySelector('[data-slot="listing-card-net"]');
    expect(amount?.textContent).toBe(`${NET} ${formatByKind("money", 5_480_000_000)}`);
    // Same line as the facts, after them, so it lines up with the price and status on the right.
    const line = amount!.parentElement!;
    expect(line.querySelector('[data-slot="listing-card-facts"]')?.textContent).toContain("110,4");
    expect(line.lastElementChild).toBe(amount);
    expect(amount!.className).toContain("shrink-0");
    expect(line.querySelector('[data-slot="listing-card-facts"]')!.className).toContain("truncate");
  });

  it.each([
    ["Excluded", "Excluded" as const, row()],
    ["no fee condition", undefined, row()],
    [
      "no price",
      "Included" as const,
      row({ "Listing.listPrice": null, [NET_TO_SELLER_FIELD]: null }),
    ],
    ["a rent", "Included" as const, row({ transaction: "lease", [NET_TO_SELLER_FIELD]: null })],
  ])("%s: nothing at that spot, the card is the row 2b card", (_, inclusion, r) => {
    expect(cardNetOf(r, inclusion, NET)).toBeNull();
    const before = card(r).innerHTML;
    cleanup();
    expect(card(r, cardNetOf(r, inclusion, NET)).innerHTML).toBe(before);
  });

  it("the option is off by default: no prop, no amount", () => {
    expect(card(row()).querySelector('[data-slot="listing-card-net"]')).toBeNull();
  });

  it("break: a zero amount is not shown as «Về tay 0»", () => {
    expect(cardNetOf(row({ [NET_TO_SELLER_FIELD]: 0 }), "Included", NET)).toBeNull();
  });
});
