import { CalendarCheckIcon, LayoutGridIcon, SendIcon, UsersIcon } from "lucide-react";
import { createElement } from "react";

import type { NavItem } from "@/components/templates/app-shell";
import { FRAME_COPY } from "@/components/templates/frame-copy";
import { label } from "@/modules/company-config";

const icon = (Icon: typeof SendIcon) => createElement(Icon, { "aria-hidden": true });

/** Listing statuses in the order of ontology/labels.yaml; the shortcuts open the inventory screen (filters come with row 2). */
const STATUSES = [
  "StatusIncomplete",
  "StatusActive",
  "StatusPending",
  "StatusClosed",
  "StatusHold",
  "StatusWithdrawn",
] as const;

const COPY = FRAME_COPY.secondColumn;

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
        items: STATUSES.map((status) => ({ href: "/inventory", title: label(status) })),
      },
    ],
  },
  {
    href: "/sent",
    title: label("Sent"),
    icon: icon(SendIcon),
    sections: [{ items: [{ href: "/sent", title: COPY.allLinks }] }],
  },
  { href: "/members", title: label("Member"), icon: icon(UsersIcon), roles: ["CompanyAdmin"] },
];
