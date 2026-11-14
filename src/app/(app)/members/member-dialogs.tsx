"use client";

import { useRouter } from "next/navigation";
import { useId, useState } from "react";

import { FormDialog } from "@/components/candidate/form-dialog";
import { Badge } from "@/components/reui/badge";
import { FRAME_COPY } from "@/components/templates/frame-copy";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { Role } from "@/generated/ontology";
import { MEMBER_NAME_MAX, MEMBERS_BASE_PATH, ROLES } from "@/modules/identity";

import { MEMBERS_COPY as COPY } from "./copy";
import type { Member, MembersLabels } from "./members-screen";

const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * A 403 from the server (row 9e): the dialog shows the «not allowed» sentence, apart from the general error, and when
 * it closes the page refreshes, so the frame and its buttons follow the permission table again.
 */
function useRefusal(): { refused: () => void; onClose: () => void; is: boolean } {
  const router = useRouter();
  const [is, setIs] = useState(false);
  return {
    is,
    refused: () => setIs(true),
    onClose: () => {
      if (!is) return;
      setIs(false);
      router.refresh();
    },
  };
}

/** Four checkboxes in register order; the set is what is checked. */
function RolePicker({
  value,
  onChange,
  labels,
  error,
}: {
  value: Role[];
  onChange: (roles: Role[]) => void;
  labels: MembersLabels;
  error?: string | undefined;
}) {
  const base = useId();
  return (
    <FieldSet>
      <FieldLegend variant="label">{COPY.rolesLabel}</FieldLegend>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {ROLES.map((r) => (
          <Field key={r} orientation="horizontal">
            <Checkbox
              id={`${base}-${r}`}
              name="roles"
              value={r}
              checked={value.includes(r)}
              aria-invalid={error ? true : undefined}
              onCheckedChange={(on) =>
                onChange(ROLES.filter((x) => (x === r ? on : value.includes(x))))
              }
            />
            <FieldLabel htmlFor={`${base}-${r}`}>{labels.roles[r]}</FieldLabel>
          </Field>
        ))}
      </div>
      {error ? <FieldError>{error}</FieldError> : null}
    </FieldSet>
  );
}

/** «Invite»: email, the company's name for the person, roles. One press sends one invitation mail. */
export function InviteDialog({
  labels,
  onInvited,
}: {
  labels: MembersLabels;
  onInvited: (name: string) => void;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [roles, setRoles] = useState<Role[]>([]);
  const [errors, setErrors] = useState<{
    email?: string;
    name?: string;
    roles?: string;
    form?: string;
  }>({});
  const [busy, setBusy] = useState(false);
  const refusal = useRefusal();

  function reset() {
    setEmail("");
    setName("");
    setRoles([]);
    setErrors({});
  }

  async function submit() {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const found = {
      ...(EMAIL_SHAPE.test(cleanEmail) ? {} : { email: COPY.emailInvalid }),
      ...(cleanName ? {} : { name: COPY.nameEmpty }),
      ...(roles.length ? {} : { roles: COPY.rolesEmpty }),
    };
    setErrors(found);
    if (Object.keys(found).length) return;
    setBusy(true);
    try {
      const res = await fetch(MEMBERS_BASE_PATH, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, name: cleanName, roles }),
      });
      if (res.ok) {
        setOpen(false);
        reset();
        onInvited(cleanName);
      } else if (res.status === 409) setErrors({ email: COPY.alreadyMember });
      else if (res.status === 400) setErrors({ email: COPY.emailInvalid });
      else if (res.status === 403) {
        refusal.refused();
        setErrors({ form: FRAME_COPY.refusedAction });
      } else setErrors({ form: COPY.failed });
    } catch {
      setErrors({ form: COPY.failed });
    } finally {
      setBusy(false);
    }
  }

  return (
    <FormDialog
      slot="invite-dialog"
      trigger={{ render: <Button />, label: labels.invite }}
      badge={
        <Badge size="sm" variant="warning-light">
          {labels.company}
        </Badge>
      }
      title={labels.invite}
      description={COPY.inviteDescription}
      submitLabel={COPY.inviteSubmit}
      busyLabel={COPY.sending}
      busy={busy}
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          reset();
          refusal.onClose();
        }
      }}
      onSubmit={() => void submit()}
      formError={errors.form}
      refused={refusal.is}
    >
      <Field data-invalid={errors.email ? true : undefined}>
        <FieldLabel htmlFor={`${id}-email`}>{COPY.emailLabel}</FieldLabel>
        <Input
          id={`${id}-email`}
          type="email"
          autoComplete="off"
          value={email}
          aria-invalid={errors.email ? true : undefined}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email ? <FieldError>{errors.email}</FieldError> : null}
      </Field>
      <Field data-invalid={errors.name ? true : undefined}>
        <FieldLabel htmlFor={`${id}-name`}>{COPY.nameLabel}</FieldLabel>
        <Input
          id={`${id}-name`}
          autoComplete="off"
          maxLength={MEMBER_NAME_MAX}
          value={name}
          aria-invalid={errors.name ? true : undefined}
          onChange={(e) => setName(e.target.value)}
        />
        {errors.name ? <FieldError>{errors.name}</FieldError> : null}
      </Field>
      <RolePicker value={roles} onChange={setRoles} labels={labels} error={errors.roles} />
    </FormDialog>
  );
}

/** «Change roles» of one member; the last company admin cannot drop the role. */
export function RolesDialog({
  member,
  labels,
  onSaved,
}: {
  member: Member;
  labels: MembersLabels;
  onSaved: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [roles, setRoles] = useState<Role[]>(member.roles);
  const [errors, setErrors] = useState<{ roles?: string; form?: string }>({});
  const [busy, setBusy] = useState(false);
  const refusal = useRefusal();

  async function submit() {
    if (!roles.length) {
      setErrors({ roles: COPY.rolesEmpty });
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`${MEMBERS_BASE_PATH}/${member.userId}/roles`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ roles }),
      });
      if (res.ok) {
        setOpen(false);
        setErrors({});
        onSaved();
      } else if (res.status === 409) setErrors({ roles: COPY.lastAdmin(labels.companyAdmin) });
      else if (res.status === 403) {
        refusal.refused();
        setErrors({ form: FRAME_COPY.refusedAction });
      } else setErrors({ form: COPY.failed });
    } catch {
      setErrors({ form: COPY.failed });
    } finally {
      setBusy(false);
    }
  }

  return (
    <FormDialog
      slot="roles-dialog"
      trigger={{
        render: (
          <Button
            variant="outline"
            size="sm"
            aria-label={`${labels.changeRoles} · ${member.name}`}
          />
        ),
        label: labels.changeRoles,
      }}
      title={labels.changeRoles}
      description={COPY.rolesDescription(member.name)}
      submitLabel={COPY.save}
      busyLabel={COPY.saving}
      busy={busy}
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) setRoles(member.roles);
        else refusal.onClose();
        setErrors({});
      }}
      onSubmit={() => void submit()}
      formError={errors.form}
      refused={refusal.is}
    >
      <RolePicker value={roles} onChange={setRoles} labels={labels} error={errors.roles} />
    </FormDialog>
  );
}
