"use client";

import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { ThemeProvider as NextThemes, useTheme } from "next-themes";
import type { ReactNode } from "react";
import { useSyncExternalStore } from "react";

import { Menu as MenuPrimitive } from "@base-ui/react/menu";

import { buttonVariants } from "@/components/ui/button";

import { cn } from "@/lib/utils";

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
  { value: "light", label: FRAME_COPY.theme.light, Icon: SunIcon },
  { value: "dark", label: FRAME_COPY.theme.dark, Icon: MoonIcon },
  { value: "system", label: FRAME_COPY.theme.system, Icon: MonitorIcon },
] as const;

const noSubscribe = () => () => {};

/**
 * The three looks as one row of icon choices inside the account menu (ReUI Verve template): light, dark, or following
 * the device. They are the menu's own radio items, so the arrow keys reach them and choosing keeps the menu open. The
 * chosen one is known only in the browser, so the server paints none chosen.
 */
export function ThemeMenuChoice() {
  const { theme, setTheme } = useTheme();
  const inBrowser = useSyncExternalStore(
    noSubscribe,
    () => true,
    () => false,
  );
  return (
    <MenuPrimitive.RadioGroup
      aria-label={FRAME_COPY.theme.button}
      value={inBrowser ? (theme ?? "system") : null}
      onValueChange={(value: string) => setTheme(value)}
      data-slot="theme-choice"
      className="inline-flex items-center gap-0.5 rounded-full bg-muted/60 p-0.5"
    >
      {CHOICES.map(({ value, label, Icon }) => (
        <MenuPrimitive.RadioItem
          key={value}
          value={value}
          closeOnClick={false}
          aria-label={label}
          title={label}
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon-xs" }),
            "rounded-full outline-hidden data-checked:bg-background data-checked:text-foreground data-highlighted:bg-accent data-highlighted:text-accent-foreground",
          )}
        >
          <Icon aria-hidden />
        </MenuPrimitive.RadioItem>
      ))}
    </MenuPrimitive.RadioGroup>
  );
}
