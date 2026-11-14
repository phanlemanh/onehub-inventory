"use client";

import type { ReactNode } from "react";
import { Badge } from "@/components/reui/badge";
import {
  Frame,
  FrameDescription,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@/components/reui/frame";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Item } from "@/components/ui/item";
import type { Role } from "../../../generated/ontology";

/** What one row shows: who, their email, their roles. */
export interface ListedMember {
  userId: string;
  name: string;
  email: string;
  roles: readonly Role[];
}

/**
 * One column spine for every row, from the ReUI block solution-users-8 (its people list): the person takes the rest
 * of the line, who invited sits in a fixed column, the roles and the row's action keep their place. Phones give the
 * person a line of their own.
 */
const COL = {
  person: "min-w-0 basis-full @2xl:basis-0 @2xl:flex-1",
  invited: "hidden w-56 shrink-0 @4xl:flex",
  roles: "me-auto flex min-w-0 shrink-0 flex-wrap gap-1 @2xl:me-0 @2xl:w-72",
  action: "flex shrink-0 justify-end @2xl:w-24",
};

/** The initials of a name: first letters of its first and last words. */
function initialsOf(name: string): string {
  // A bracketed placeholder such as «[Tên]» is not part of the name.
  const words = name.split(/\s+/).filter((w) => w && !w.startsWith("["));
  const first = words[0]?.[0] ?? "";
  const last = words.length > 1 ? (words.at(-1)?.[0] ?? "") : "";
  return (first + last).toLocaleUpperCase("vi");
}

function PersonFace({ name, email }: { name: string; email: string }) {
  return (
    <span className="flex min-w-0 items-center gap-3">
      <Avatar>
        <AvatarFallback>{initialsOf(name)}</AvatarFallback>
      </Avatar>
      <span className="flex min-w-0 flex-col gap-1">
        <span className="truncate text-sm font-medium" title={name}>
          {name}
        </span>
        <span className="truncate text-xs text-muted-foreground" title={email}>
          {email}
        </span>
      </span>
    </span>
  );
}

/**
 * The people of the company as one framed list (ReUI solution-users-8, its Members section): a person per row with
 * their initials, name and email, who invited them, their roles and the change-roles button. No seat count, guests, invites or
 * export: those are not in this product.
 */
export function MembersList<M extends ListedMember>({
  members,
  title,
  count,
  invited,
  roleLabels,
  action,
}: {
  members: readonly M[];
  /** The frame's name and the list's accessible name. */
  title: string;
  /** The sentence under the title, e.g. «9 người trong sàn». */
  count: string;
  /** The inviter column's text for one person, e.g. «Người mời: [Tên] · 10/11/2026». */
  invited: (m: M) => string;
  roleLabels: Readonly<Record<Role, string>>;
  /** The row's action, at the end of the row. */
  action: (m: M) => ReactNode;
}) {
  return (
    <Frame spacing="default" data-slot="members-frame">
      <FrameHeader className="flex-row flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-px">
          <FrameTitle>{title}</FrameTitle>
          <FrameDescription>{count}</FrameDescription>
        </div>
      </FrameHeader>
      <FramePanel className="@container p-0">
        {/* One line between rows, as the block draws it; Item keeps its own spacing. */}
        <div role="list" aria-label={title} className="flex flex-col divide-y">
          {members.map((m) => (
            <div key={m.userId} role="listitem" data-member={m.email} className="px-1">
              <Item size="sm">
                <div className="flex w-full flex-wrap items-center gap-3 @2xl:flex-nowrap @2xl:gap-4">
                  <span data-part="person" className={COL.person}>
                    <PersonFace name={m.name} email={m.email} />
                  </span>
                  <span
                    data-part="invited"
                    className={`${COL.invited} text-xs text-muted-foreground`}
                  >
                    {invited(m)}
                  </span>
                  <span data-part="roles" className={COL.roles}>
                    {m.roles.map((r) => (
                      <Badge key={r} variant="primary-light">
                        {roleLabels[r]}
                      </Badge>
                    ))}
                  </span>
                  <span data-part="action" className={COL.action}>
                    {action(m)}
                  </span>
                </div>
              </Item>
            </div>
          ))}
        </div>
      </FramePanel>
    </Frame>
  );
}
