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
import { inventoryStatusHref } from "@/modules/listings/ui";

import type { Role } from "@/generated/ontology";

import { PARTS, PROTO_7E } from "./proto/lop-rieng-cua-san/copy";

const icon = (Icon: typeof SendIcon) => createElement(Icon, { "aria-hidden": true });

const COPY = FRAME_COPY.secondColumn;

/**
 * The App Shell's entries for one person: the inventory's second column gains their saved views (row 2c) after the
 * status shortcuts when their roles can list them.
 */
export function navFor({ savedViews }: { savedViews?: NavSection | null } = {}): NavItem[] {
  return [...NAV, ...PROTO_NAV].map((item) =>
    item.href === "/inventory" && savedViews
      ? { ...item, sections: [...(item.sections ?? []), savedViews] }
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
];

// Row 7e scope-gate prototype only (development builds): the review screen's entry with its five parts in the second
// column, where shape A puts them. Removed before the row is graded; the build adds the real entry.
const PROTO_NAV: NavItem[] =
  process.env.NODE_ENV === "production"
    ? []
    : [
        {
          href: PROTO_7E.href,
          title: PROTO_7E.screen,
          icon: icon(SlidersHorizontalIcon),
          action: "readCompanyCodes",
          sections: [
            {
              items: PARTS.map((p) => ({
                href: `${PROTO_7E.href}?phan=${p}`,
                title: PROTO_7E.parts[p],
              })),
            },
          ],
        },
      ];
