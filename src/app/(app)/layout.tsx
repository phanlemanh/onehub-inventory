import { AppShell } from "@/components/templates/app-shell";

import { NAV } from "./nav";

/** Every internal screen stands in the frame; its error, loading and not-found states too. */
export default function FrameLayout({ children }: { children: React.ReactNode }) {
  return <AppShell nav={NAV}>{children}</AppShell>;
}
