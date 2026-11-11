"use client";

import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { ThemeProvider as NextThemes, useTheme } from "next-themes";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { FRAME_COPY } from "./frame-copy";

/** Light and dark, following the device until the person chooses (design/behaviors.md). */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemes attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
    </NextThemes>
  );
}

const CHOICES = [
  { value: "light", label: FRAME_COPY.theme.light },
  { value: "dark", label: FRAME_COPY.theme.dark },
  { value: "system", label: FRAME_COPY.theme.system },
] as const;

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" size="icon-sm" aria-label={FRAME_COPY.theme.button} />}
      >
        <SunIcon className="dark:hidden" />
        <MoonIcon className="hidden dark:block" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={theme ?? "system"}
          onValueChange={(value) => setTheme(value)}
        >
          {CHOICES.map((choice) => (
            <DropdownMenuRadioItem key={choice.value} value={choice.value}>
              {choice.value === "system" ? <MonitorIcon /> : null}
              {choice.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
