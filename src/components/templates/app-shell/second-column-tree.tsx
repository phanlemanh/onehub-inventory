"use client";

// A section of the second column whose entries hold entries (row 2d: project → complex → building). PROTOTYPE for the
// scope gate: `?loi=a|b|c` draws it three ways side by side; the build keeps the one the owner picks.
import { hotkeysCoreFeature, selectionFeature, syncDataLoaderFeature } from "@headless-tree/core";
import { useTree } from "@headless-tree/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import { Badge } from "@/components/reui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tree, TreeItem, TreeItemLabel } from "@/components/reui/tree";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

import type { NavLink, NavSection } from "../nav-menu";

const ROOT = "__root__";

/** Prototype only: the place keeps the drawing being compared (`?loi=`). */
function withLoi(href: string): string {
  if (typeof window === "undefined") return href;
  const loi = new URLSearchParams(window.location.search).get("loi");
  return loi ? `${href}&loi=${loi}` : href;
}

interface Node {
  link: NavLink | null;
  children: string[];
}

function nodeMap(items: readonly NavLink[]): Record<string, Node> {
  const map: Record<string, Node> = {};
  const walk = (links: readonly NavLink[]): string[] =>
    links.map((l) => {
      map[l.href] = { link: l, children: walk(l.children ?? []) };
      return l.href;
    });
  map[ROOT] = { link: null, children: walk(items) };
  return map;
}

function Count({ n, badge }: { n: number | undefined; badge?: boolean }) {
  if (n === undefined) return null;
  if (badge)
    return (
      <Badge data-slot="place-count" variant="secondary" className="ml-auto shrink-0 tabular-nums">
        {n}
      </Badge>
    );
  return (
    <span
      data-slot="place-count"
      className="ml-auto shrink-0 text-xs tabular-nums text-muted-foreground"
    >
      {n}
    </span>
  );
}

/** The places that hold the open one, so only its branch is unfolded (lối A). */
function pathTo(items: Record<string, Node>, href: string | null): string[] {
  const top = items[ROOT]?.children ?? [];
  if (!href || !items[href]) return [];
  const walk = (id: string, trail: string[]): string[] | null => {
    if (id === href) return trail;
    for (const c of items[id]?.children ?? []) {
      const found = walk(c, [...trail, id]);
      if (found) return found;
    }
    return null;
  };
  for (const t of top) {
    const found = walk(t, []);
    if (found) return [...found, ...(items[href]!.children.length > 0 ? [href] : [])];
  }
  return [];
}

/** Lối A — ReUI Tree «Basic» (c-tree-1): one tree, chevrons, only the open branch unfolded, the count at the end. */
function TreeA({ section, activeHref }: { section: NavSection; activeHref: string | null }) {
  const router = useRouter();
  const { isMobile, setOpenMobile } = useSidebar();
  const items = useMemo(() => nodeMap(section.items), [section.items]);
  const tree = useTree<Node>({
    initialState: {
      expandedItems: pathTo(items, activeHref),
      selectedItems: activeHref ? [activeHref] : [],
    },
    state: { selectedItems: activeHref && items[activeHref] ? [activeHref] : [] },
    setSelectedItems: () => undefined,
    indent: 14,
    rootItemId: ROOT,
    getItemName: (item) => item.getItemData().link?.title ?? "",
    isItemFolder: (item) => item.getItemData().children.length > 0,
    onPrimaryAction: (item) => {
      router.push(withLoi(item.getId()));
      if (isMobile) setOpenMobile(false);
    },
    dataLoader: {
      getItem: (id) => items[id]!,
      getChildren: (id) => items[id]?.children ?? [],
    },
    features: [syncDataLoaderFeature, selectionFeature, hotkeysCoreFeature],
  });
  return (
    <div data-slot="geo-tree" data-loi="a" className="px-2">
      <Tree indent={14} tree={tree}>
        {tree.getItems().map((item) => (
          <TreeItem
            key={item.getId()}
            item={item}
            aria-current={item.isSelected() ? "true" : undefined}
          >
            <TreeItemLabel className="gap-1.5 py-1 pe-1 text-start">
              <span className="min-w-0 break-words">{item.getItemName()}</span>
              <Count n={item.getItemData().link?.count} />
            </TreeItemLabel>
          </TreeItem>
        ))}
      </Tree>
    </div>
  );
}

/**
 * Lối B — each project a row of the column with its places nested under it, drawn with the column's own entries and
 * nothing restyled (the store's lint forbids it): names longer than the row are cut, the full name in the tooltip.
 */
function GroupsB({ section, activeHref }: { section: NavSection; activeHref: string | null }) {
  const { isMobile, setOpenMobile } = useSidebar();
  const close = () => {
    if (isMobile) setOpenMobile(false);
  };
  const entry = (l: NavLink, size: "sm" | "md" = "md"): React.ReactNode => (
    <SidebarMenuSubItem key={l.href}>
      <SidebarMenuSubButton
        size={size}
        isActive={l.href === activeHref}
        render={
          <Link
            href={withLoi(l.href)}
            title={l.title}
            aria-current={l.href === activeHref ? "true" : undefined}
            onClick={close}
          />
        }
      >
        <Count n={l.count} badge />
        <span>{l.title}</span>
      </SidebarMenuSubButton>
      {(l.children ?? []).length > 0 ? (
        <SidebarMenuSub>
          {(l.children ?? []).map((c) => entry(c, (c.children ?? []).length > 0 ? "sm" : "md"))}
        </SidebarMenuSub>
      ) : null}
    </SidebarMenuSubItem>
  );
  return (
    <div data-slot="geo-tree" data-loi="b">
      <SidebarMenuSub>{section.items.map((p) => entry(p))}</SidebarMenuSub>
    </div>
  );
}

/** Lối C — ReUI Tree «Permissions» (c-tree-7): plus/minus, a box on each building, several buildings at once. */
function ChecksC({ section, activeHrefs }: { section: NavSection; activeHrefs: string[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const items = useMemo(() => nodeMap(section.items), [section.items]);
  const keyOf = (href: string) => new URL(href, "http://x").searchParams.get("vung") ?? "";
  const [checked, setChecked] = useState<Set<string>>(() => new Set(activeHrefs.map(keyOf)));
  const tree = useTree<Node>({
    initialState: { expandedItems: Object.keys(items).filter((id) => id !== ROOT) },
    indent: 16,
    rootItemId: ROOT,
    getItemName: (item) => item.getItemData().link?.title ?? "",
    isItemFolder: (item) => item.getItemData().children.length > 0,
    dataLoader: {
      getItem: (id) => items[id]!,
      getChildren: (id) => items[id]?.children ?? [],
    },
    features: [syncDataLoaderFeature, hotkeysCoreFeature],
  });
  const apply = (next: Set<string>) => {
    setChecked(next);
    const q = new URLSearchParams(params.toString());
    q.delete("vung");
    for (const k of next) q.append("vung", k);
    router.push(`/inventory?${q}`);
  };
  return (
    <Tree
      data-slot="geo-tree"
      data-loi="c"
      className="px-2"
      indent={16}
      tree={tree}
      toggleIconType="plus-minus"
    >
      {tree.getItems().map((item) => {
        const key = keyOf(item.getId());
        const leaf = !item.isFolder();
        return (
          <TreeItem key={item.getId()} item={item}>
            <TreeItemLabel className="gap-1.5 py-1 pe-1 text-start not-in-data-[folder=true]:ps-5">
              {leaf ? (
                <Checkbox
                  aria-label={item.getItemName()}
                  checked={checked.has(key)}
                  onCheckedChange={() => {
                    const next = new Set(checked);
                    if (next.has(key)) next.delete(key);
                    else next.add(key);
                    apply(next);
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
              ) : null}
              <span className="min-w-0 break-words">{item.getItemName()}</span>
              <Count n={item.getItemData().link?.count} />
            </TreeItemLabel>
          </TreeItem>
        );
      })}
    </Tree>
  );
}

function manyBuildings(section: NavSection): NavSection {
  const grow = (l: NavLink, depth: number): NavLink => {
    const kids = (l.children ?? []).map((c) => grow(c, depth + 1));
    if (depth === 1 && kids.length > 0 && kids.every((k) => (k.children ?? []).length === 0)) {
      const base = kids[0]!.title.replace(/[0-9]+$/, "");
      for (let i = kids.length + 1; kids.length < 16; i++)
        kids.push({
          href: `${l.href}-x${i}`,
          title: `${base}${String(i + 5).padStart(2, "0")}`,
          count: 3 + (i % 9),
        });
    }
    if (depth === 0 && kids.length > 0 && kids.every((k) => (k.children ?? []).length === 0)) {
      const base = kids[0]!.title.replace(/[0-9]+$/, "");
      for (let i = kids.length + 1; kids.length < 9; i++)
        kids.push({ href: `${l.href}-x${i}`, title: `${base}${i}`, count: 4 + (i % 7) });
    }
    return { ...l, children: kids };
  };
  return { ...section, items: section.items.map((l) => grow(l, 0)) };
}

/** The tree section of the second column. */
export function SecondColumnTree({
  section: given,
  activeHref,
}: {
  section: NavSection;
  activeHref: string | null;
}) {
  const params = useSearchParams();
  let section = given;
  const loi = params.get("loi") ?? "a";
  // Prototype only: `?nhieu=1` shows the tree as a company with many buildings would see it.
  if (params.get("nhieu") === "1") section = manyBuildings(section);
  const activeHrefs = params
    .getAll("vung")
    .map((k) => `/inventory?${new URLSearchParams({ vung: k })}`);
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
      <SidebarGroupContent>
        {loi === "b" ? (
          <GroupsB section={section} activeHref={activeHref} />
        ) : loi === "c" ? (
          <ChecksC section={section} activeHrefs={activeHrefs} />
        ) : (
          <TreeA section={section} activeHref={activeHref} />
        )}
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
