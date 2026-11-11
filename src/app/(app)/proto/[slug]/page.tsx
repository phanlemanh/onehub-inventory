import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { RAIL_COPY } from "@/components/templates/app-shell/rail-copy";
import { type ShellOptions, RailShell } from "@/components/templates/app-shell/rail-shell";
import { PageHeader } from "@/components/templates/page-header";
import { PageState } from "@/components/templates/page-state";
import { label } from "@/modules/company-config";

import { AccountMenu } from "../../account-menu";

import { BehaviorShowcase } from "./behavior-showcase";
import { BrokenOnClient, FrameShowcase } from "./frame-showcase";
import { GridShowcase } from "./grid-showcase";

const FRAME_SLUG = "khung-va-giao-dien";
const GRID_SLUG = "luoi-va-o-theo-kieu";
const BEHAVIOR_SLUG = "hanh-vi-trong-luoi-khung";
const SHELL_SLUG = "app-shell";
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
  const query = await searchParams;
  const { state, columns, quyen } = query;
  if (slug === SHELL_SLUG) return <ShellProto query={query} />;
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

function pick<T extends string>(value: unknown, allowed: readonly T[]): T {
  return typeof value === "string" && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : allowed[0]!;
}

/** Sample listing counts per status, so the second column shows real status labels. */
const SAMPLE_COUNTS = {
  StatusActive: 128,
  StatusPending: 14,
  StatusHold: 9,
  StatusIncomplete: 21,
  StatusClosed: 37,
  StatusWithdrawn: 6,
} as const;

/** Row 1o: the App Shell rearranged from ReUI app-shell-8, wrapping the screens that exist, with sample data. */
function ShellProto({ query }: { query: Record<string, string | string[] | undefined> }) {
  const options: ShellOptions = {
    man: pick(query.man, ["inventory", "today", "sent", "members"] as const),
    cot2: pick(query.cot2, ["trang-thai", "cho"] as const),
    tim: pick(query.tim, ["chua", "co"] as const),
    chuong: pick(query.chuong, ["chua", "co"] as const),
    ten: pick(query.ten, ["tren", "menu"] as const),
    dt: pick(query.dt, ["thanh-ben", "tab"] as const),
    vai: pick(query.vai, ["du", "dau-chu"] as const),
    gon: query.gon === "1",
  };
  const company = `An Phú (mẫu)`;
  const otherCompany = `Thủ Đức (mẫu)`;
  const titles = { today: label("Today"), inventory: label("Inventory"), sent: label("Sent") };
  return (
    <RailShell
      options={options}
      labels={{
        ...titles,
        company,
        otherCompany,
        companies: label("Company"),
        statuses: Object.entries(SAMPLE_COUNTS).map(([key, count]) => ({
          key,
          label: label(key as keyof typeof SAMPLE_COUNTS),
          count,
        })),
      }}
      account={
        <AccountMenu
          account={{
            name: "[Tên]",
            email: "ten@example.com",
            company: { id: "mau-1", name: company },
            companies: [
              { id: "mau-1", name: company },
              { id: "mau-2", name: otherCompany },
            ],
          }}
          labels={{ signIn: label("SignIn"), signOut: label("SignOut") }}
        />
      }
    >
      {options.man === "inventory" ? (
        <>
          <PageHeader title={titles.inventory} />
          <GridShowcase few={false} />
        </>
      ) : (
        <PageHeader title={options.man === "members" ? RAIL_COPY.members : titles[options.man]} />
      )}
    </RailShell>
  );
}
