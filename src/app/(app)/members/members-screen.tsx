"use client";

import { useEffect, useState } from "react";

import { notifyResult } from "@/components/templates/notify";
import { PageHeader } from "@/components/templates/page-header";
import { PageSkeleton } from "@/components/templates/page-skeleton";
import { PageState } from "@/components/templates/page-state";
import type { Role } from "@/generated/ontology";
import { formatDate } from "@/lib/format";
import { MEMBERS_BASE_PATH } from "@/modules/identity";
import { MembersList, PermittedAction } from "@/modules/identity/ui";

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
  /** The company being worked in: whom an invitation lets in. */
  company: string;
  invite: string;
  changeRoles: string;
  companyAdmin: string;
  roles: Record<Role, string>;
}

type Load = { kind: "loading" } | { kind: "error" } | { kind: "ready"; members: Member[] };

/** The people of the company in one framed list (ReUI solution-users-8, row 9c), with the invite button at the head. */
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
      <MembersList
        members={load.members}
        title={labels.title}
        count={COPY.peopleCount(load.members.length)}
        invited={(m) =>
          `${COPY.columns.invited}: ${COPY.invitedBy(m.invitedByName, formatDate(m.invitedAt))}`
        }
        roleLabels={labels.roles}
        action={changeRoles}
      />
    </div>
  );
}
