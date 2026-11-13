import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/templates/page-header";
import { PageState } from "@/components/templates/page-state";

import { BehaviorShowcase } from "./behavior-showcase";
import { BrokenOnClient, FrameShowcase } from "./frame-showcase";
import { GridShowcase } from "./grid-showcase";

const FRAME_SLUG = "khung-va-giao-dien";
const GRID_SLUG = "luoi-va-o-theo-kieu";
const BEHAVIOR_SLUG = "hanh-vi-trong-luoi-khung";
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
  const { state, columns, quyen } = await searchParams;
  if (slug === BEHAVIOR_SLUG) {
    return (
      <>
        <PageHeader title="Bản mẫu hành vi" />
        <BehaviorShowcase
          state={typeof state === "string" ? state : undefined}
          denied={quyen === "khong"}
        />
      </>
    );
  }
  if (slug === GRID_SLUG) {
    return (
      <>
        <PageHeader title="Bản mẫu Lưới" />
        <GridShowcase
          state={typeof state === "string" ? state : undefined}
          few={columns === "few"}
        />
      </>
    );
  }
  if (slug !== FRAME_SLUG) return <PageHeader title={slug} />;

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
