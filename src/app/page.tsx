import { AppShell } from "@/components/templates/app-shell";
import { label } from "@/modules/company-config";

import { NAV } from "./nav";

export default function HomePage() {
  return <AppShell nav={NAV} title={label("Today")} />;
}
