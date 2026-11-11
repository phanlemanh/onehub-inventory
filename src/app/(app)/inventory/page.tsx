import type { Metadata } from "next";

import { PageHeader } from "@/components/templates/page-header";
import { label } from "@/modules/company-config";

export const metadata: Metadata = { title: label("Inventory") };

export default function Page() {
  return <PageHeader title={label("Inventory")} />;
}
