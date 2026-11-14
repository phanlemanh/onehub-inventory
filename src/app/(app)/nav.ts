import {
  CalendarCheckIcon,
  LayoutGridIcon,
  SendIcon,
  SlidersHorizontalIcon,
  UsersIcon,
} from "lucide-react";
import { createElement } from "react";

import type { NavItem, NavSection } from "@/components/templates/app-shell";
import { visibleNav } from "@/components/templates/nav-items";
import { STATUS_ORDER } from "@/components/candidate/grid-view";
import { FRAME_COPY } from "@/components/templates/frame-copy";
import { label } from "@/modules/company-config";
import { LAYER_PARTS_SHOWN, PART_TITLE } from "@/modules/company-config/ui";
import { inventoryStatusHref } from "@/modules/listings/ui";

import type { Role } from "@/generated/ontology";

const icon = (Icon: typeof SendIcon) => createElement(Icon, { "aria-hidden": true });

const COPY = FRAME_COPY.secondColumn;

/**
 * The App Shell's entries for one person: the inventory's second column gains their saved views (row 2c) after the
 * status shortcuts when their roles can list them.
 */
export function navFor({
  savedViews,
  geography,
}: { savedViews?: NavSection | null; geography?: NavSection | null } = {}): NavItem[] {
  return NAV.map((item) =>
    item.href === "/inventory"
      ? {
          ...item,
          sections: [
            ...(item.sections ?? []),
            ...(geography ? [geography] : []),
            ...(savedViews ? [savedViews] : []),
          ],
        }
      : item,
  );
}

/** The top-bar search (row 3f) leads to the inventory, so it shows by the same rule as the inventory's entry. */
export function searchShownFor(nav: readonly NavItem[], roles: readonly Role[]): boolean {
  return visibleNav(nav, roles).some((item) => item.href === "/inventory");
}

export const NAV: NavItem[] = [
  { href: "/", title: label("Today"), icon: icon(CalendarCheckIcon) },
  {
    href: "/inventory",
    title: label("Inventory"),
    icon: icon(LayoutGridIcon),
    sections: [
      {
        items: [
          {
            href: "/inventory",
            title: `${COPY.all} ${label("Listing").toLocaleLowerCase("vi")}`,
          },
        ],
      },
      {
        title: COPY.byStatus,
        // One order for statuses everywhere (STATUS_ORDER); each shortcut opens the grid filtered to its status.
        items: STATUS_ORDER.map((status) => ({
          href: inventoryStatusHref(status),
          title: label(`Status${status}`),
        })),
      },
    ],
  },
  {
    href: "/sent",
    title: label("Sent"),
    icon: icon(SendIcon),
    sections: [{ items: [{ href: "/sent", title: COPY.allLinks }] }],
  },
  // Shows when the permission table gives the session listMembers (row 9e), not by a role's name.
  { href: "/members", title: label("Member"), icon: icon(UsersIcon), action: "listMembers" },
  // The company's own layer (row 7e): one entry per part in the second column.
  {
    href: "/tuy-chinh-san",
    title: label("CompanyLayer"),
    icon: icon(SlidersHorizontalIcon),
    action: "readCompanyLayer",
    sections: [
      {
        items: LAYER_PARTS_SHOWN.map((p) => ({
          href: p === "nhan" ? "/tuy-chinh-san" : `/tuy-chinh-san?phan=${p}`,
          title: label(PART_TITLE[p]),
        })),
      },
    ],
  },
];
