import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/templates/page-header";
import { PageState } from "@/components/templates/page-state";

import { BrokenOnClient, FrameShowcase } from "./frame-showcase";

const FRAME_SLUG = "khung-va-giao-dien";
const SLOW_MS = 4000;

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: (await params).slug };
}

/** Development-only clickable prototype, opened by the kit's design pass as /proto/<slug>. */
export default async function ProtoPage({ params, searchParams }: Props) {
  if (process.env.NODE_ENV === "production") notFound();
  const { slug } = await params;
  if (slug !== FRAME_SLUG) return <PageHeader title={slug} />;

  const { state } = await searchParams;
  if (state === "slow") await new Promise((resolve) => setTimeout(resolve, SLOW_MS));
  if (state === "session-expired") {
    return <PageState kind="session-expired" returnTo={`/proto/${slug}?state=session-expired`} />;
  }
  return (
    <>
      {state === "error" ? <BrokenOnClient /> : null}
      <PageHeader title="Bản mẫu khung" />
      <FrameShowcase slug={slug} />
    </>
  );
}
