"use client";

import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";

import type { GridRow } from "@/components/candidate/data-region";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { ENTRY_COPY } from "./entry-copy";
import { searchHref, searchSuggestions, type SearchKind } from "./inventory-rows";

/** Typing in a field: «/» is a character there, not the search key. */
function typingIn(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement
  );
}

/**
 * The top-bar search of the App Shell (row 3f), the product's one search box: a unit code, a building or a
 * subdivision, suggested from the inventory rows already read. Choosing a suggestion or pressing Enter opens the
 * inventory with the text in the column filter of its kind; one unit found opens its record (the page does that).
 * Opens with a click, ⌘K or Ctrl+K anywhere, and «/» outside a field.
 */
const noSubscribe = () => () => {};

export function UnitJump({
  rows,
  words,
}: {
  rows: readonly GridRow[];
  /** Concept names from the label table. */
  words: { unit: string; building: string; subdivision: string; inventory: string };
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  // True once the box runs in the browser, after the first render that attaches the key listener below: from then on
  // ⌘K and «/» open the box (the same signal as the account menu's data-ready).
  const keysReady = useSyncExternalStore(
    noSubscribe,
    () => true,
    () => false,
  );
  const list = useMemo(() => searchSuggestions(rows, text), [rows, text]);
  const kindWord: Record<SearchKind, string> = {
    unit: words.unit,
    building: words.building,
    subdivision: words.subdivision,
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey && !typingIn(e.target)) {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const go = (kind: SearchKind, value: string) => {
    if (!value.trim()) return;
    setOpen(false);
    setText("");
    router.push(searchHref(kind, value));
  };

  return (
    <>
      <span data-slot="unit-jump" data-ready={keysReady || undefined} className="contents">
        <Button
          variant="outline"
          size="sm"
          aria-keyshortcuts="Meta+K Control+K /"
          onClick={() => setOpen(true)}
        >
          <SearchIcon aria-hidden="true" />
          <span className="text-muted-foreground max-sm:sr-only">
            {ENTRY_COPY.searchHint(words.unit)}
          </span>
          <kbd
            aria-hidden="true"
            className="rounded border px-1 text-xs text-muted-foreground max-sm:hidden"
          >
            ⌘K
          </kbd>
        </Button>
      </span>
      {/* Mounted only while open: the palette puts its hidden title outside the box, and a closed box must add no
          heading to the page. */}
      {open ? (
        <CommandDialog
          open
          onOpenChange={setOpen}
          title={ENTRY_COPY.search(words.unit)}
          description={ENTRY_COPY.searchWhy(words.unit, words.inventory)}
        >
          {/* The suggestions are already the matches; the palette keeps them in this order. */}
          <CommandInputBox
            text={text}
            onText={setText}
            placeholder={ENTRY_COPY.searchHint(words.unit)}
            label={ENTRY_COPY.search(words.unit)}
            onEnterWithout={list.length === 0 ? () => go("unit", text) : undefined}
          >
            <CommandList>
              {text.trim() ? (
                <CommandEmpty>{ENTRY_COPY.searchEmpty(words.unit, words.inventory)}</CommandEmpty>
              ) : null}
              {list.length > 0 ? (
                <CommandGroup>
                  {list.map((s) => (
                    <CommandItem
                      key={`${s.kind}|${s.value}`}
                      value={`${s.kind}|${s.value}`}
                      onSelect={() => go(s.kind, s.value)}
                    >
                      <span className="w-16 shrink-0 text-xs text-muted-foreground">
                        {kindWord[s.kind]}
                      </span>
                      <span className="min-w-0 flex-1 truncate">
                        {s.kind === "unit" ? ENTRY_COPY.inBuildings(s.value, s.buildings) : s.value}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : null}
            </CommandList>
          </CommandInputBox>
        </CommandDialog>
      ) : null}
    </>
  );
}

/** The palette's own box (filtering off: the suggestions are computed above), and Enter when nothing is suggested. */
function CommandInputBox({
  text,
  onText,
  placeholder,
  label,
  onEnterWithout,
  children,
}: {
  text: string;
  onText: (text: string) => void;
  placeholder: string;
  label: string;
  onEnterWithout?: () => void;
  children: React.ReactNode;
}) {
  return (
    <Command shouldFilter={false} data-slot="unit-jump-palette">
      <CommandInput
        value={text}
        onValueChange={onText}
        placeholder={placeholder}
        aria-label={label}
        onKeyDown={(e) => {
          if (e.key === "Enter" && onEnterWithout) {
            e.preventDefault();
            onEnterWithout();
          }
        }}
      />
      {children}
    </Command>
  );
}
