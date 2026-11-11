import type { NavItem } from "@/components/templates/app-shell";
import { label } from "@/modules/company-config";

export const NAV: NavItem[] = [
  { href: "/", title: label("Today") },
  { href: "/inventory", title: label("Inventory") },
  { href: "/sent", title: label("Sent") },
  { href: "/members", title: label("Member"), roles: ["CompanyAdmin"] },
];
