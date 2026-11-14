"use client";

import type { ReactNode } from "react";

import { FramedList, ListFace } from "@/components/candidate/framed-list";
import { Badge } from "@/components/reui/badge";

import type { Role } from "../../../generated/ontology";

/** What one row shows: who, their email, their roles. */
export interface ListedMember {
  userId: string;
  name: string;
  email: string;
  roles: readonly Role[];
}

/**
 * The people of the company on the shared framed list (row 9c): initials, name and email, who invited them, their
 * roles as tags, and the row's action at the end. No seat count, guests, invites or export: not in this product.
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
  title: string;
  /** The line under the title, e.g. «9 người trong sàn». */
  count: string;
  /** The inviter column's text for one person, e.g. «Người mời: [Tên] · 10/11/2026». */
  invited: (m: M) => string;
  roleLabels: Readonly<Record<Role, string>>;
  /** The row's action, at the end of the row. */
  action: (m: M) => ReactNode;
}) {
  return (
    <FramedList
      slot="members-frame"
      title={title}
      count={count}
      rows={members.map((m) => ({
        id: m.userId,
        data: { "data-member": m.email },
        main: <ListFace name={m.name} sub={m.email} />,
        secondary: invited(m),
        tags: m.roles.map((r) => (
          <Badge key={r} variant="primary-light">
            {roleLabels[r]}
          </Badge>
        )),
        control: action(m),
      }))}
    />
  );
}
