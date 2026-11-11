"use client";

import { ChevronsUpDownIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AUTH_BASE_PATH } from "@/modules/identity";

import { LOGIN_COPY as COPY } from "../login/copy";

interface CompanyRef {
  id: string;
  name: string;
}

/**
 * The one way to change the company a person works in: the session moves to it and the screen reloads its data.
 * The account menu and the company name of the App Shell (row 1o) both use it.
 */
export function useSwitchCompany(currentId: string | undefined) {
  const router = useRouter();
  const [switching, setSwitching] = useState(false);
  async function switchTo(companyId: string) {
    if (companyId === currentId) return;
    setSwitching(true);
    const res = await fetch(`${AUTH_BASE_PATH}/session/company`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ companyId }),
    });
    setSwitching(false);
    if (res.ok) router.refresh();
  }
  return { switching, switchTo };
}

/** The company being worked in, at the start of the App Shell's top bar; a person in several companies changes it here. */
export function CompanySwitch({
  company,
  companies,
}: {
  company: CompanyRef | null;
  companies: readonly CompanyRef[];
}) {
  const { switching, switchTo } = useSwitchCompany(company?.id);
  if (!company) return null;
  if (companies.length < 2) {
    return (
      <span className="truncate px-2 text-sm font-medium" data-slot="company-name">
        {company.name}
      </span>
    );
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" size="sm" disabled={switching} data-slot="company-name" />}
      >
        <span className="max-w-40 truncate">{company.name}</span>
        <ChevronsUpDownIcon aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{COPY.switchCompany}</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={company.id}
            onValueChange={(value) => void switchTo(String(value))}
          >
            {companies.map((c) => (
              <DropdownMenuRadioItem key={c.id} value={c.id}>
                {c.name}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
