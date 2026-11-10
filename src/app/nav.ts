import { label } from "@/modules/company-config";

import type { NavItem } from "@/components/templates/app-shell";

export const NAV: NavItem[] = [
  { href: "/", title: label("Today") },
  { href: "/inventory", title: label("Inventory") },
  { href: "/sent", title: label("Sent") },
];
