"use client";

import { useEffect, useState } from "react";

import { Badge } from "@/components/reui/badge";
import { notifyResult } from "@/components/templates/notify";
import { PageHeader } from "@/components/templates/page-header";
import { PageSkeleton } from "@/components/templates/page-skeleton";
import { PageState } from "@/components/templates/page-state";
import type { Role } from "@/generated/ontology";
import { formatDate } from "@/lib/format";
import { MEMBERS_BASE_PATH } from "@/modules/identity";
import { PermittedAction } from "@/modules/identity/ui";

import { MEMBERS_COPY as COPY } from "./copy";
import { InviteDialog, RolesDialog } from "./member-dialogs";

export interface Member {
  userId: string;
  name: string;
  email: string;
  roles: Role[];
  invitedByName: string | null;
  invitedAt: string | null;
}

export interface MembersLabels {
  title: string;
  invite: string;
  changeRoles: string;
  companyAdmin: string;
  roles: Record<Role, string>;
}

type Load = { kind: "loading" } | { kind: "error" } | { kind: "ready"; members: Member[] };

function RoleBadges({ roles, labels }: { roles: Role[]; labels: MembersLabels }) {
  return (
    <span className="flex flex-wrap gap-1">
      {roles.map((r) => (
        <Badge key={r} variant="primary-light">
          {labels.roles[r]}
        </Badge>
      ))}
    </span>
  );
}

/** The people of the company: a table on wide screens, one card per person on phones. */
export function MembersScreen({ labels }: { labels: MembersLabels }) {
  const [load, setLoad] = useState<Load>({ kind: "loading" });

  const [tick, setTick] = useState(0);
  const reload = () => setTick((t) => t + 1);

  useEffect(() => {
    let alive = true;
    fetch(MEMBERS_BASE_PATH, { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) throw new Error(String(res.status));
        return ((await res.json()) as { members: Member[] }).members;
      })
      .then(
        (members) => alive && setLoad({ kind: "ready", members }),
        () => alive && setLoad({ kind: "error" }),
      );
    return () => {
      alive = false;
    };
  }, [tick]);

  const header = (
    <PageHeader
      title={labels.title}
      action={
        <PermittedAction action="inviteMember">
          <InviteDialog
            labels={labels}
            onInvited={(name) => {
              notifyResult({ message: COPY.invited(name) });
              reload();
            }}
          />
        </PermittedAction>
      }
    />
  );

  if (load.kind === "loading")
    return (
      <div className="flex flex-col gap-6" data-state="loading">
        {header}
        <PageSkeleton />
      </div>
    );

  if (load.kind === "error")
    return (
      <div className="flex flex-col gap-6" data-state="error">
        {header}
        <PageState
          kind="error"
          onRetry={() => {
            setLoad({ kind: "loading" });
            reload();
          }}
        />
      </div>
    );

  const changeRoles = (m: Member) => (
    <PermittedAction action="changeMemberRoles">
      <RolesDialog
        member={m}
        labels={labels}
        onSaved={() => {
          notifyResult({ message: COPY.rolesChanged(m.name) });
          reload();
        }}
      />
    </PermittedAction>
  );

  return (
    <div className="flex flex-col gap-6" data-state="ready">
      {header}
      <ul className="flex flex-col divide-y border-y" aria-label={labels.title}>
        {load.members.map((m) => (
          <li
            key={m.userId}
            data-member={m.email}
            className="grid grid-cols-1 gap-2 py-3 sm:grid-cols-5 sm:items-center sm:gap-4"
          >
            <div className="flex min-w-0 flex-col sm:col-span-2">
              <span className="truncate font-medium" title={m.name}>
                {m.name}
              </span>
              <span className="truncate text-sm text-muted-foreground" title={m.email}>
                {m.email}
              </span>
            </div>
            <div className="flex min-w-0 flex-col gap-1 sm:col-span-2">
              <RoleBadges roles={m.roles} labels={labels} />
              <span className="text-xs text-muted-foreground">
                {COPY.columns.invited}: {COPY.invitedBy(m.invitedByName, formatDate(m.invitedAt))}
              </span>
            </div>
            <div className="sm:justify-self-end">{changeRoles(m)}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
