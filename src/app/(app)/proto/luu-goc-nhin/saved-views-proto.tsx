"use client";

import { BookmarkIcon, ChevronDownIcon, MoreHorizontalIcon, PlusIcon } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { DataRegion, type GridRow } from "@/components/candidate/data-region";
import { FormDialog } from "@/components/candidate/form-dialog";
import { useChange } from "@/components/candidate/use-change";
import { filterRows, type ColumnFilters } from "@/components/candidate/grid-view";
import { PageHeader } from "@/components/templates/page-header";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { INVENTORY_GROUP_BY, inventoryColumns, type InventoryField } from "@/modules/listings/ui";

/** Which candidate the prototype shows: list look, way to save, whose views. */
export interface ProtoVariant {
  list: "l1" | "l2";
  save: "s1" | "s2" | "s3";
  shared: boolean;
  /** Id of the view open on first paint (for screenshots). */
  open: string | null;
  /** Status shortcut open, from the address. */
  status: string | null;
  /** Dialog open on first paint (for screenshots): luu | doi-ten | xoa. */
  dialog: string | null;
  /** The candidate part of the address (ds, luu, chung), kept on every link. */
  base: string;
}

interface SavedView {
  id: string;
  name: string;
  owner: "toi" | "san";
  filters: ColumnFilters;
}

const NAME_MAX = 40;

// Prototype sentences; the built screen takes them from the label table and the screen's copy file.
const COPY = {
  byStatus: "Theo trạng thái",
  mine: "Góc nhìn của tôi",
  company: "Góc nhìn của sàn",
  noViews: "Chưa có góc nhìn nào. Lọc, sắp xếp hay ẩn cột rồi bấm «Lưu góc nhìn».",
  save: "Lưu góc nhìn",
  saveChanges: (name: string) => `Lưu thay đổi vào «${name}»`,
  views: "Góc nhìn",
  allViews: "Không góc nhìn",
  saveTitle: "Lưu góc nhìn",
  saveWhat: "Lưu lọc, ô tìm, sắp xếp, nhóm và các cột đang hiện thành một mục ở cột bên trái.",
  name: "Tên góc nhìn",
  nameHint: "Ví dụ: S1.01 đang bán. Tối đa 40 ký tự.",
  nameEmpty: "Đặt tên cho góc nhìn.",
  nameTaken: "Đã có góc nhìn mang tên này.",
  rename: "Đổi tên",
  renameTitle: "Đổi tên góc nhìn",
  renameWhat: "Chỉ đổi tên; lọc, sắp xếp, nhóm và cột giữ nguyên.",
  remove: "Xoá góc nhìn",
  removeTitle: (name: string) => `Xoá góc nhìn «${name}»?`,
  removeWhat: "Mục biến khỏi cột bên trái. Dữ liệu không đổi gì.",
  cancel: "Thôi",
  more: (name: string) => `Việc khác với «${name}»`,
  protoNote:
    "Bản mẫu: góc nhìn giữ trong trang này (tải lại là mất), chỉ lọc chạy thật; sắp xếp, nhóm, cột nối ở bước dựng.",
};

function seedViews(statusLabels: Record<string, string>): SavedView[] {
  return [
    {
      id: "s101-dang-ban",
      name: `S1.01 ${statusLabels.Active?.toLocaleLowerCase("vi") ?? ""}`.trim(),
      owner: "toi",
      filters: { "Listing.buildingName": "S1.01", "Listing.standardStatus": ["Active"] },
    },
    {
      id: "hai-phong-ngu",
      name: "Hai PN",
      owner: "toi",
      filters: { "Unit.bedroomsTotal": "2" },
    },
    {
      id: "giu-cho",
      name: `${statusLabels.Hold ?? ""}`.trim(),
      owner: "san",
      filters: { "Listing.standardStatus": ["Hold"] },
    },
  ];
}

/** Finds the App Shell's second column (desktop) and the phone sheet's column, to show the candidate list there. */
function useColumnTargets(): Element[] {
  const [targets, setTargets] = useState<Element[]>([]);
  useEffect(() => {
    const find = () => {
      const found = [
        document.querySelector('[data-slot="app-shell-second-column"] > div'),
        document.querySelector('[data-slot="sidebar"] .md\\:hidden'),
        document.querySelector('[data-mobile="true"] .md\\:hidden'),
      ].filter((el, i, all): el is Element => el !== null && all.indexOf(el) === i);
      setTargets((old) =>
        old.length === found.length && old.every((el, i) => el === found[i]) ? old : found,
      );
    };
    find();
    const observer = new MutationObserver(find);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);
  return targets;
}

export function SavedViewsProto({
  variant,
  title,
  regionTitle,
  headers,
  rows,
  statusLabels,
  allLabel,
}: {
  variant: ProtoVariant;
  title: string;
  regionTitle: string;
  headers: Readonly<Record<InventoryField, string>>;
  rows: readonly GridRow[];
  statusLabels: Record<string, string>;
  allLabel: string;
}) {
  const columns = useMemo(() => inventoryColumns(headers), [headers]);
  const [views, setViews] = useState<SavedView[]>(() => seedViews(statusLabels));
  const router = useRouter();
  const openId = variant.open;
  const status = variant.status;
  /** Address of this prototype with the candidate choice kept and one place open. */
  const href = (place: { mo?: string; st?: string }) => {
    const q = new URLSearchParams(variant.base);
    if (place.mo) q.set("mo", place.mo);
    if (place.st) q.set("st", place.st);
    return `?${q.toString()}`;
  };
  const [saving, setSaving] = useState(variant.dialog === "luu");
  const [renaming, setRenaming] = useState<SavedView | null>(() =>
    variant.dialog === "doi-ten" ? (seedViews(statusLabels)[0] ?? null) : null,
  );
  const change = useChange();
  const runChange = change.run;
  function askRemove(v: SavedView) {
    void runChange({
      verb: COPY.remove,
      what: `${COPY.removeTitle(v.name)} ${COPY.removeWhat}`,
      done: `Đã xoá góc nhìn «${v.name}».`,
      reversible: false,
      apply: () => {
        setViews((vs) => vs.filter((x) => x.id !== v.id));
        if (openId === v.id) openView(null);
      },
    });
  }
  const askedOnFirstPaint = useRef(false);
  useEffect(() => {
    if (variant.dialog !== "xoa" || askedOnFirstPaint.current) return;
    askedOnFirstPaint.current = true;
    const first = seedViews(statusLabels)[0];
    if (first)
      void runChange({
        verb: COPY.remove,
        what: `${COPY.removeTitle(first.name)} ${COPY.removeWhat}`,
        done: "",
        reversible: false,
        apply: () => undefined,
      });
  }, [variant.dialog, statusLabels, runChange]);
  const targets = useColumnTargets();

  const open = views.find((v) => v.id === openId) ?? null;
  const filters: ColumnFilters = open
    ? open.filters
    : status
      ? { "Listing.standardStatus": [status] }
      : {};
  const visible = views.filter((v) => variant.shared || v.owner === "toi");
  const mine = visible.filter((v) => v.owner === "toi");
  const company = visible.filter((v) => v.owner === "san");

  function openView(id: string | null) {
    router.push(href(id ? { mo: id } : {}));
  }

  function nameProblem(name: string, except?: string): string | undefined {
    const n = name.trim();
    if (n === "") return COPY.nameEmpty;
    const taken = views.some(
      (v) =>
        v.id !== except &&
        v.owner === "toi" &&
        v.name.toLocaleLowerCase("vi") === n.toLocaleLowerCase("vi"),
    );
    return taken ? COPY.nameTaken : undefined;
  }

  const saveButton = (
    <Button size="sm" variant="outline" onClick={() => setSaving(true)} data-slot="save-view">
      <BookmarkIcon aria-hidden />
      {COPY.save}
    </Button>
  );

  const viewsMenu = (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button size="sm" variant="outline" data-slot="views-menu" />}>
        <BookmarkIcon aria-hidden />
        {open ? open.name : COPY.views}
        <ChevronDownIcon aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{COPY.mine}</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={openId ?? ""} onValueChange={(v) => openView(v || null)}>
            <DropdownMenuRadioItem value="">{COPY.allViews}</DropdownMenuRadioItem>
            {mine.map((v) => (
              <DropdownMenuRadioItem key={v.id} value={v.id}>
                {v.name}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setSaving(true)}>{COPY.save}…</DropdownMenuItem>
        <DropdownMenuItem disabled={!open}>
          {open ? COPY.saveChanges(open.name) : COPY.saveChanges("…")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const action = variant.save === "s1" ? saveButton : variant.save === "s3" ? viewsMenu : undefined;

  const viewItems = (list: SavedView[], own: boolean) =>
    list.map((v) => {
      const active = v.id === openId;
      const count = variant.list === "l2" ? filterRows(rows, columns, v.filters).length : null;
      return (
        <SidebarMenuSubItem key={v.id}>
          {/* The App Shell's sub-item, unchanged; a plain wrapper places the item's «…» over its right edge. */}
          <div className="group/view relative">
            <SidebarMenuSubButton
              isActive={active}
              aria-current={active ? "true" : undefined}
              render={<Link href={href({ mo: v.id })} />}
            >
              <span className="truncate">{v.name}</span>
              {count !== null && !(own && active) ? (
                <span className="ml-auto text-xs text-muted-foreground tabular-nums group-focus-within/view:invisible group-hover/view:invisible">
                  {count}
                </span>
              ) : null}
            </SidebarMenuSubButton>
            {own ? (
              <span
                className={
                  active
                    ? "absolute inset-y-0 right-0.5 flex items-center"
                    : "absolute inset-y-0 right-0.5 flex items-center opacity-0 group-focus-within/view:opacity-100 group-hover/view:opacity-100"
                }
              >
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button variant="ghost" size="icon-xs" aria-label={COPY.more(v.name)} />
                    }
                  >
                    <MoreHorizontalIcon aria-hidden />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="right" align="start">
                    <DropdownMenuItem onClick={() => setRenaming(v)}>
                      {COPY.rename}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive" onClick={() => askRemove(v)}>
                      {COPY.remove}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </span>
            ) : null}
          </div>
        </SidebarMenuSubItem>
      );
    });

  const column = (
    <nav aria-label={title} className="flex flex-col" data-slot="proto-second-column">
      <SidebarGroup>
        <SidebarGroupLabel>{title}</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenuSub>
            <SidebarMenuSubItem>
              <SidebarMenuSubButton isActive={!openId && !status} render={<Link href={href({})} />}>
                <span>{allLabel}</span>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          </SidebarMenuSub>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarGroup data-slot="saved-views">
        <SidebarGroupLabel>{COPY.mine}</SidebarGroupLabel>
        {variant.save === "s2" ? (
          <SidebarGroupAction aria-label={COPY.save} onClick={() => setSaving(true)}>
            <PlusIcon aria-hidden />
          </SidebarGroupAction>
        ) : null}
        <SidebarGroupContent>
          {mine.length === 0 ? (
            <p className="px-2 text-xs text-muted-foreground">{COPY.noViews}</p>
          ) : (
            <SidebarMenuSub>{viewItems(mine, true)}</SidebarMenuSub>
          )}
        </SidebarGroupContent>
      </SidebarGroup>
      {variant.shared ? (
        <SidebarGroup data-slot="company-views">
          <SidebarGroupLabel>{COPY.company}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenuSub>{viewItems(company, false)}</SidebarMenuSub>
          </SidebarGroupContent>
        </SidebarGroup>
      ) : null}
      <SidebarGroup>
        <SidebarGroupLabel>{COPY.byStatus}</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenuSub>
            {Object.entries(statusLabels).map(([code, text]) => (
              <SidebarMenuSubItem key={code}>
                <SidebarMenuSubButton
                  isActive={!openId && status === code}
                  render={<Link href={href({ st: code })} />}
                >
                  <span>{text}</span>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </SidebarGroupContent>
      </SidebarGroup>
    </nav>
  );

  return (
    <>
      {targets.map((t, i) => createPortal(column, t, `col-${i}`))}
      <PageHeader title={open ? `${title} · ${open.name}` : title} />
      <p className="text-xs text-muted-foreground" data-slot="proto-note">
        {COPY.protoNote}
      </p>
      <DataRegion
        key={`${openId ?? ""}|${status ?? ""}`}
        title={regionTitle}
        columns={columns}
        rows={rows}
        initialFilters={filters}
        groupBy={INVENTORY_GROUP_BY}
        action={action ? { node: action, allowed: true } : undefined}
      />
      <NameDialog
        open={saving}
        onOpenChange={setSaving}
        title={COPY.saveTitle}
        description={COPY.saveWhat}
        submitLabel={COPY.save}
        initial={open ? `${open.name} (2)` : ""}
        problem={(n) => nameProblem(n)}
        onSubmit={(name) => {
          const id = `v-${Date.now()}`;
          setViews((vs) => [...vs, { id, name: name.trim(), owner: "toi", filters }]);
          openView(id);
          setSaving(false);
        }}
      />
      <NameDialog
        open={renaming !== null}
        onOpenChange={(o) => (o ? undefined : setRenaming(null))}
        title={COPY.renameTitle}
        description={COPY.renameWhat}
        submitLabel={COPY.rename}
        initial={renaming?.name ?? ""}
        problem={(n) => nameProblem(n, renaming?.id)}
        onSubmit={(name) => {
          setViews((vs) =>
            vs.map((v) => (v.id === renaming?.id ? { ...v, name: name.trim() } : v)),
          );
          setRenaming(null);
        }}
      />
      {change.dialog}
    </>
  );
}

function NameDialog({
  open,
  onOpenChange,
  title,
  description,
  submitLabel,
  initial,
  problem,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  submitLabel: string;
  initial: string;
  problem: (name: string) => string | undefined;
  onSubmit: (name: string) => void;
}) {
  const id = useId();
  const [name, setName] = useState(initial);
  const [shown, setShown] = useState<string | undefined>();
  const [lastOpen, setLastOpen] = useState(open);
  if (open !== lastOpen) {
    setLastOpen(open);
    if (open) {
      setName(initial);
      setShown(undefined);
    }
  }
  return (
    <FormDialog
      trigger={{
        render: <Button type="button" variant="ghost" hidden tabIndex={-1} />,
        label: null,
      }}
      title={title}
      description={description}
      submitLabel={submitLabel}
      busyLabel={submitLabel}
      busy={false}
      open={open}
      onOpenChange={onOpenChange}
      slot="name-view-dialog"
      onSubmit={() => {
        const p = problem(name);
        if (p) {
          setShown(p);
          return;
        }
        onSubmit(name);
      }}
    >
      <Field data-invalid={shown ? true : undefined}>
        <FieldLabel htmlFor={id}>{COPY.name}</FieldLabel>
        <Input
          id={id}
          value={name}
          maxLength={NAME_MAX}
          autoFocus
          aria-invalid={shown ? true : undefined}
          onChange={(e) => {
            setName(e.target.value);
            setShown(undefined);
          }}
        />
        {shown ? (
          <FieldError>{shown}</FieldError>
        ) : (
          <FieldDescription>{COPY.nameHint}</FieldDescription>
        )}
      </Field>
    </FormDialog>
  );
}
