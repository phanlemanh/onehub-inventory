import { notFound } from "next/navigation";

import { AppShell } from "@/components/templates/app-shell";

import { NAV } from "../../nav";

/** Development-only clickable prototype, opened by the kit's design pass as /proto/<slug>. */
export default async function ProtoPage({ params }: { params: Promise<{ slug: string }> }) {
  if (process.env.NODE_ENV === "production") notFound();
  const { slug } = await params;
  return <AppShell nav={NAV} title={slug} />;
}
