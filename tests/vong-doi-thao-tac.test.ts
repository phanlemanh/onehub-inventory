// Row 1t (kiem-vong-doi-thao-tac): every thing a screen shows has add, view, edit and remove, or an approved reason.
// tools/coverage_matrix/lifecycle.py reads design/screens.yaml (`hien`), the code of each screen, the button table of
// row 9b, the `vong_doi` block of each entity, the permission table, the roadmap and the gate ledger lines. Each case
// below breaks one rule on a copy of what the tool reads and pins the line it must print; the copy has no .git.
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { tempDir } from "./support/temp-dir";

const ROOT = join(import.meta.dirname, "..");
const TOOL = join(ROOT, "tools/coverage_matrix/lifecycle.py");
const GATE = "kiem-vong-doi-thao-tac#d-20261115T042837Z-14";

function run(root: string, ...args: string[]) {
  const r = spawnSync("python3", [TOOL, "--root", root, ...args], { encoding: "utf8" });
  return { status: r.status, out: `${r.stdout}${r.stderr}` };
}

interface Table {
  screens: Record<string, { hien: string[]; suy: Record<string, string>; mo: string[] }>;
  entities: Record<string, { man: string[]; vong_doi: Record<string, unknown> }>;
  errors: string[];
}
const table = (root: string): Table => JSON.parse(run(root, "--json").out) as Table;

/** Every temporary copy any case made, in order; the last case checks all of them are gone from disk. */
const made: string[] = [];
/** The copies of the group whose cases are running; null outside a cleaned group. */
let current: string[] | null = null;
/** Copies made outside a cleaned group: nothing removes them, so the last case names them. */
const orphans: string[] = [];

function release(list: string[]) {
  for (const dir of list) rmSync(dir, { recursive: true, force: true });
}

/**
 * The one cleanup every group of cases uses: copies made while the group runs are listed for it and removed after
 * its last case. A group that makes copies without calling this leaves them on disk, and the last case fails.
 */
function cleanedGroup() {
  const dirs: string[] = [];
  beforeAll(() => {
    current = dirs;
  });
  afterAll(() => {
    current = null;
    release(dirs);
  });
}

// Safety net only: runs after the last case has measured, so it never hides a leak from it.
afterAll(() => release(made));

const PARTS = [
  "ontology",
  "design/screens.yaml",
  "src/app",
  "src/modules",
  "src/components",
  "docs/plan/lo-trinh.json",
  "_acceptance/kiem-vong-doi-thao-tac/decisions.jsonl",
];

/** A copy of what the tool reads, without .git. */
function copy(): string {
  const dir = tempDir("vong-doi-");
  made.push(dir);
  (current ?? orphans).push(dir);
  for (const part of PARTS) {
    mkdirSync(dirname(join(dir, part)), { recursive: true });
    cpSync(join(ROOT, part), join(dir, part), { recursive: true });
  }
  return dir;
}

/** Applies one edit to a file of the copy; the edit must change the file. */
function breakFile(dir: string, file: string, edit: (text: string) => string) {
  const path = join(dir, file);
  const before = readFileSync(path, "utf8");
  const after = edit(before);
  expect(after, `the break did not change ${file}`).not.toBe(before);
  writeFileSync(path, after);
}

function expectRed(dir: string, line: string) {
  const r = run(dir, "--check");
  expect(r.out).toContain(line);
  expect(r.status).toBe(1);
}

const ent = (name: string) => `ontology/entities/${name}.yaml`;

describe("man-khai-hien", () => {
  cleanedGroup();
  it("every user screen and the App Shell list what they show; the real repository is green", () => {
    const r = run(ROOT, "--check");
    expect(r.out).toContain("vong-doi: du o");
    expect(r.status).toBe(0);
    expect(Object.keys(table(ROOT).screens).sort()).toEqual(
      [
        "contacts",
        "inventory",
        "khung",
        "members",
        "nhap-tep",
        "sent",
        "sign-in",
        "today",
        "company-layer",
      ].sort(),
    );
  });

  it("an untouched copy is green (control)", () => {
    expect(run(copy(), "--check").status).toBe(0);
  });

  it("a screen without hien is red", () => {
    const dir = copy();
    breakFile(dir, "design/screens.yaml", (t) => t.replace("    hien: [ShareLink]\n", ""));
    expectRed(dir, "sent: thieu khoa hien");
  });

  it("a name that is not an entity is red", () => {
    const dir = copy();
    breakFile(dir, "design/screens.yaml", (t) =>
      t.replace("hien: [Member]", "hien: [Member, Khach]"),
    );
    expectRed(dir, "members: hien Khach khong phai thuc the");
  });
});

describe("may-thay-man-hien", () => {
  cleanedGroup();
  it("what each screen shows, read from the code and the button table, is the table written beforehand", () => {
    const want: Record<string, string[]> = {
      khung: ["Listing", "SavedView", "Unit"],
      today: [],
      inventory: ["ImportRun", "Listing", "ListingOwner", "SavedView", "Unit"],
      sent: ["ShareLink"],
      contacts: ["Contact"],
      "company-layer": [
        "CompanyLabel",
        "CompanyValueAlias",
        "CustomField",
        "FeeItem",
        "ImportTemplate",
        "Listing",
        "PendingUnit",
        "Unit",
      ],
      "sign-in": [],
      members: ["Member"],
      "nhap-tep": ["ImportRun"],
    };
    const screens = table(ROOT).screens;
    expect(Object.keys(screens).length).toBe(9);
    for (const [sid, names] of Object.entries(want))
      expect(Object.keys(screens[sid]!.suy).sort(), sid).toEqual(names);
  });

  it("an entity read from the fields but not listed is red", () => {
    const dir = copy();
    breakFile(dir, "design/screens.yaml", (t) => t.replace("hien: [ShareLink]", "hien: []"));
    expectRed(dir, "sent: hien ShareLink ma chua khai (truong)");
  });

  it("an entity read from the button table but not listed is red", () => {
    const dir = copy();
    breakFile(dir, "design/screens.yaml", (t) => t.replace("hien: [Member]", "hien: []"));
    expectRed(dir, "members: hien Member ma chua khai (nut listMembers)");
  });

  it("a new file the page imports, showing a field of another entity, is red", () => {
    const dir = copy();
    writeFileSync(
      join(dir, "src/app/(app)/sent/extra-column.ts"),
      'export const EXTRA = "Contact.fullName";\n',
    );
    breakFile(
      dir,
      "src/app/(app)/sent/page.tsx",
      (t) => `import { EXTRA } from "./extra-column";\nvoid EXTRA;\n${t}`,
    );
    expectRed(dir, "sent: hien Contact ma chua khai (truong)");
  });
});

describe("du-bon-o", () => {
  cleanedGroup();
  it("an entity a screen shows without a vong_doi block is red", () => {
    const dir = copy();
    breakFile(
      dir,
      ent("ShareLink"),
      (t) => t.slice(0, t.indexOf("\n# Lifecycle of this entity")) + "\n",
    );
    expectRed(dir, "ShareLink: thieu vong_doi");
  });

  it("a missing cell is red", () => {
    const dir = copy();
    breakFile(dir, ent("Member"), (t) => t.replace("  sua: { co: changeMemberRoles }\n", ""));
    expectRed(dir, "Member: thieu o sua");
  });

  it("a cell in two forms is red", () => {
    const dir = copy();
    breakFile(dir, ent("SavedView"), (t) =>
      t.replace(
        "    co: listSavedViews\n",
        `    co: listSavedViews\n    khong: "x"\n    duyet: "${GATE}"\n`,
      ),
    );
    expectRed(dir, "SavedView.xem: o phai la co, hang hoac khong");
  });

  it("an empty own cell is red", () => {
    const dir = copy();
    breakFile(dir, ent("Contact"), (t) =>
      t.replace('gop: { co: mergeContacts, hang: "13a" }', "gop: {}"),
    );
    expectRed(dir, "Contact.gop: o phai la co, hang hoac khong");
  });

  it("a planned action with its row is green (control)", () => {
    expect(readFileSync(join(ROOT, ent("Listing")), "utf8")).toContain(
      'go: { co: removeListing, hang: "18b" }',
    );
    expect(table(ROOT).errors).toEqual([]);
  });
});

describe("o-co-tro-nut-that", () => {
  cleanedGroup();
  it("removing the remove-listing action from the permission table is red (the row's own case)", () => {
    const dir = copy();
    breakFile(dir, "ontology/actions.yaml", (t) =>
      t.replace(/ {2}- name: removeListing\n[\s\S]*?\n\n/, ""),
    );
    breakFile(dir, "design/screens.yaml", (t) => t.replace("      - removeListing\n", ""));
    expectRed(dir, "Listing.go: thao tac removeListing khong co trong bang quyen");
  });

  it("an action of the wrong kind is red", () => {
    const dir = copy();
    breakFile(dir, ent("Member"), (t) =>
      t.replace("them: { co: inviteMember }", "them: { co: listMembers }"),
    );
    expectRed(dir, "Member.them: listMembers la query, o nay can create");
  });

  it("an action that is no button on a screen showing the entity is red", () => {
    const dir = copy();
    breakFile(dir, ent("SavedView"), (t) =>
      t.replace("go: { co: removeView }", "go: { co: removeContact }"),
    );
    expectRed(dir, "SavedView.go: removeContact khong la nut o man nao hien SavedView");
  });

  it("a planned action without its row is red", () => {
    const dir = copy();
    breakFile(dir, ent("Listing"), (t) =>
      t.replace('go: { co: removeListing, hang: "18b" }', "go: { co: removeListing }"),
    );
    expectRed(dir, "Listing.go: removeListing con du kien, thieu hang");
  });

  it("a live action with a row is red", () => {
    const dir = copy();
    breakFile(dir, ent("Member"), (t) =>
      t.replace("them: { co: inviteMember }", 'them: { co: inviteMember, hang: "10" }'),
    );
    expectRed(dir, "Member.them: inviteMember dang chay, bo hang");
  });

  it("a role list on a cell other than a view cell is red, it would have no effect", () => {
    const dir = copy();
    breakFile(dir, ent("Member"), (t) =>
      t.replace(
        "them: { co: inviteMember }",
        'them:\n    co: inviteMember\n    chan:\n      TeamLead: { hang: "18a", ly_do: "x" }',
      ),
    );
    expectRed(dir, "Member.them: chan chi co hieu luc o o xem co thao tac");
  });

  it("a role list on a view cell without an action is red", () => {
    const dir = copy();
    breakFile(dir, ent("ShareLink"), (t) =>
      t.replace(
        'xem: { hang: "16", ly_do: "There is no read permission for sent links yet; row 16 adds it." }',
        'xem:\n    hang: "16"\n    ly_do: "x"\n    chan:\n      TeamLead: { hang: "16", ly_do: "x" }',
      ),
    );
    expectRed(dir, "ShareLink.xem: chan chi co hieu luc o o xem co thao tac");
  });

  it("a view cell pointing at a query that is no button stays green (control)", () => {
    expect(readFileSync(join(ROOT, ent("Member")), "utf8")).toContain("xem: { co: listMembers }");
    expect(run(ROOT, "--check").status).toBe(0);
  });
});

describe("qua-luu-ca-bang", () => {
  cleanedGroup();
  const FEE = ent("FeeItem");
  it("an own fee item added and retired inside the one save of the whole schedule is green, listed apart", () => {
    expect(run(ROOT, "--check").status).toBe(0);
    const r = run(ROOT, "--report");
    expect(r.out).toContain("- them: qua lưu cả bảng · setFeeSchedule — ");
    const group = r.out.split("## Qua lưu cả bảng\n")[1] ?? "";
    expect(group).toContain("- FeeItem.them: setFeeSchedule — ");
    expect(group).toContain("- FeeItem.go: setFeeSchedule — ");
  });

  it("break: an update action that is not the edit cell's action is red", () => {
    const dir = copy();
    breakFile(dir, FEE, (t) =>
      t.replace("  them:\n    co: setFeeSchedule\n", "  them:\n    co: editCompanyLayer\n"),
    );
    expectRed(dir, "FeeItem.them: qua_luu can editCompanyLayer la thao tac o sua (setFeeSchedule)");
  });

  it("break: a whole-table cell without a reason is red", () => {
    const dir = copy();
    breakFile(dir, FEE, (t) =>
      t.replace(/( {2}go:\n {4}co: setFeeSchedule\n {4}qua_luu: true\n) {4}ly_do: .*\n/, "$1"),
    );
    expectRed(dir, "FeeItem.go: qua_luu thieu ly_do");
  });

  it("break: a whole-table cell with no button on a screen showing the entity is red", () => {
    const dir = copy();
    breakFile(dir, "design/screens.yaml", (t) =>
      t.replace(", matchPendingUnits, setFeeSchedule]", ", matchPendingUnits]"),
    );
    breakFile(dir, "src/modules/company-config/ui/fee-part.tsx", (t) =>
      t.replaceAll(
        '<PermittedAction action="setFeeSchedule">',
        '<PermittedAction action="readFeeSchedule">',
      ),
    );
    expectRed(dir, "FeeItem.them: setFeeSchedule khong la nut o man nao hien FeeItem");
  });

  it.each([
    [
      "xem",
      "  xem: { co: readFeeSchedule }\n",
      '  xem: { co: readFeeSchedule, qua_luu: true, ly_do: "x" }\n',
    ],
    [
      "sua",
      "  sua: { co: setFeeSchedule }\n",
      '  sua: { co: setFeeSchedule, qua_luu: true, ly_do: "x" }\n',
    ],
  ])("break: qua_luu on the %s cell is red", (cell, from, to) => {
    const dir = copy();
    breakFile(dir, FEE, (t) => t.replace(from, to));
    expectRed(dir, `FeeItem.${cell}: qua_luu chi dung o them va go`);
  });

  it("control: an ordinary co cell keeps its kind rule, qua_luu changes nothing for it", () => {
    const dir = copy();
    breakFile(dir, FEE, (t) => t.replace(/ {4}qua_luu: true\n/, ""));
    expectRed(dir, "FeeItem.them: setFeeSchedule la update, o nay can create");
  });
});

describe("o-hang-va-khong-co-can-cu", () => {
  cleanedGroup();
  const share = (dir: string, from: string, to: string) =>
    breakFile(dir, ent("ShareLink"), (t) => t.replace(from, to));

  it("an unknown row is red", () => {
    const dir = copy();
    share(dir, 'them: { hang: "16"', 'them: { hang: "99z"');
    expectRed(dir, "ShareLink.them: hang 99z khong co trong lo trinh");
  });

  it("a row without a reason is red", () => {
    const dir = copy();
    share(
      dir,
      'them: { hang: "16", ly_do: "Row 16 creates and sends the link." }',
      'them: { hang: "16" }',
    );
    expectRed(dir, "ShareLink.them: hang 16 thieu ly_do");
  });

  it("khong without a reason is red", () => {
    const dir = copy();
    share(dir, 'khong: "A sent link is not edited."', 'khong: ""');
    expectRed(dir, "ShareLink.sua: khong thieu ly do");
  });

  it("khong without duyet is red", () => {
    const dir = copy();
    share(dir, `    duyet: "${GATE}"\n  go`, "  go");
    expectRed(dir, "ShareLink.sua: khong thieu duyet");
  });

  it("duyet naming a line that does not exist is red", () => {
    const dir = copy();
    share(dir, `duyet: "${GATE}"\n  go`, 'duyet: "kiem-vong-doi-thao-tac#d-khong-co"\n  go');
    expectRed(dir, "ShareLink.sua: duyet kiem-vong-doi-thao-tac#d-khong-co khong co trong so");
  });

  it("duyet naming a machine line without decided_by is red", () => {
    const dir = copy();
    const ref = "kiem-vong-doi-thao-tac#d-20261115T030504Z-1";
    share(dir, `duyet: "${GATE}"\n  go`, `duyet: "${ref}"\n  go`);
    expectRed(dir, `ShareLink.sua: duyet ${ref} khong co decided_by`);
  });

  it("duyet naming a design line with decided_by is red, a gate line is needed", () => {
    const dir = copy();
    const ledger = join(dir, "_acceptance/kiem-vong-doi-thao-tac/decisions.jsonl");
    writeFileSync(
      ledger,
      `${readFileSync(ledger, "utf8")}{"id":"d-s1-gia","stage":"S1","decided_by":"[Tên]"}\n`,
    );
    share(dir, `duyet: "${GATE}"\n  go`, 'duyet: "kiem-vong-doi-thao-tac#d-s1-gia"\n  go');
    expectRed(dir, "ShareLink.sua: duyet kiem-vong-doi-thao-tac#d-s1-gia khong phai dong cong");
  });

  it("a broken line next to the named one keeps the check green (control)", () => {
    const dir = copy();
    const ledger = join(dir, "_acceptance/kiem-vong-doi-thao-tac/decisions.jsonl");
    writeFileSync(ledger, `not json\n${readFileSync(ledger, "utf8")}`);
    expect(run(dir, "--check").status).toBe(0);
  });
});

describe("chay-tren-ban-sao-nong", () => {
  cleanedGroup();
  it("runs on a copy without .git", () => {
    const dir = copy();
    expect(existsSync(join(dir, ".git"))).toBe(false);
    const r = run(dir, "--check");
    expect(r.out).toContain("vong-doi: du o");
    expect(r.status).toBe(0);
  });
});

/** Lines of the tool's source that start another process or read git. */
function outsideCalls(source: string): string[] {
  return source.includes("subprocess") || /\bgit /.test(source) || /\bos\.system\b/.test(source)
    ? ["lifecycle.py: goi tien trinh ngoai"]
    : [];
}

describe("khong-goi-git", () => {
  it("the tool starts no other process", () => {
    expect(outsideCalls(readFileSync(TOOL, "utf8"))).toEqual([]);
  });

  it("a source that imports subprocess is caught", () => {
    expect(outsideCalls(`import subprocess\n${readFileSync(TOOL, "utf8")}`)).toEqual([
      "lifecycle.py: goi tien trinh ngoai",
    ]);
  });
});

describe("bang-da-duyet", () => {
  const approved: Record<string, Record<string, unknown>> = {
    SavedView: { them: "saveView", xem: "listSavedViews", sua: "editView", go: "removeView" },
    Listing: {
      them: "createListing",
      xem: "viewListings",
      sua: "updateListing",
      go: "removeListing·18b",
      sua_ngoai_gia: "hang 3g",
      dua_len_ban: "activateListing",
      nhan: "hang 18a",
      doi_nguoi_giu: "hang 18a",
    },
    ListingOwner: { them: "hang 13", xem: "viewOwnerPhone·13", sua: "hang 18b", go: "hang 13" },
    Unit: { them: "hang 12", xem: "readCatalog", sua: "khong", go: "khong" },
    ShareLink: { them: "hang 16", xem: "hang 16", sua: "khong", go: "hang 18" },
    Contact: {
      them: "createContact·13a",
      xem: "viewContacts·13a",
      sua: "updateContact·13a",
      go: "removeContact·13a",
      gop: "mergeContacts·13a",
      xoa_du_lieu_ca_nhan: "eraseContactPersonalData·18b",
    },
    CompanyLabel: {
      them: "addCompanyLayer",
      xem: "readCompanyLayer",
      sua: "editCompanyLayer",
      go: "retireCompanyLayer",
    },
    CustomField: {
      them: "addCompanyLayer",
      xem: "readCompanyLayer",
      sua: "editCompanyLayer",
      go: "retireCompanyLayer",
    },
    CompanyValueAlias: {
      them: "addCompanyLayer",
      xem: "readCompanyLayer",
      sua: "editCompanyLayer",
      go: "retireCompanyLayer",
    },
    ImportTemplate: {
      them: "hang 11",
      xem: "readCompanyLayer",
      sua: "editCompanyLayer",
      go: "retireCompanyLayer",
    },
    PendingUnit: {
      them: "hang 12",
      xem: "readCompanyLayer",
      sua: "editCompanyLayer",
      go: "retireCompanyLayer",
      khop: "matchPendingUnits",
    },
    // Row 11 (nhap-excel): an import is started, seen, continued and undone on the Nạp tệp screen; the owner sees these
    // cells at row 11's evidence gate.
    ImportRun: {
      them: "importListings",
      xem: "viewImports",
      sua: "continueImport",
      go: "undoImport",
    },
    Member: { them: "inviteMember", xem: "listMembers", sua: "changeMemberRoles", go: "hang 18a" },
    // Row 19 (G N-1511-3): added and retired inside the one save of the whole fee schedule; the owner sees these four
    // cells at row 19's evidence gate.
    FeeItem: {
      them: "setFeeSchedule·qua_luu",
      xem: "readFeeSchedule",
      sua: "setFeeSchedule",
      go: "setFeeSchedule·qua_luu",
    },
  };
  type Cell = {
    co?: string;
    hang?: string;
    khong?: string;
    duyet?: string;
    chan?: Record<string, Cell>;
    qua_luu?: boolean;
  };
  const short = (c: Cell) =>
    c.khong
      ? "khong"
      : c.co
        ? c.hang
          ? `${c.co}·${c.hang}`
          : c.qua_luu
            ? `${c.co}·qua_luu`
            : c.co
        : `hang ${c.hang}`;

  it("every cell in the repository is the cell approved at the scope gate", () => {
    const entities = table(ROOT).entities;
    expect(Object.keys(entities).sort()).toEqual(Object.keys(approved).sort());
    let cells = 0;
    for (const [name, want] of Object.entries(approved)) {
      const life = entities[name]!.vong_doi as Record<string, Cell> & {
        rieng?: Record<string, Cell>;
      };
      const have: Record<string, string> = {};
      for (const c of ["them", "xem", "sua", "go"]) have[c] = short(life[c]!);
      for (const [r, v] of Object.entries(life.rieng ?? {})) have[r] = short(v);
      expect(have, name).toEqual(want);
      cells += Object.keys(want).length;
    }
    expect(cells).toBe(63);
  });

  it("the seven real gaps of the 14/11 review each point to the row approved for it", () => {
    const e = table(ROOT).entities;
    const life = (n: string) =>
      e[n]!.vong_doi as Record<string, Cell> & { rieng: Record<string, Cell> } & Record<
          "them" | "xem" | "sua" | "go",
          Cell
        > & { rieng: Record<"sua_ngoai_gia" | "nhan" | "doi_nguoi_giu" | "gop", Cell> };
    expect(life("Listing").rieng.sua_ngoai_gia.hang).toBe("3g");
    expect(life("Listing").rieng.nhan.hang).toBe("18a");
    expect(life("Listing").rieng.doi_nguoi_giu.hang).toBe("18a");
    expect(life("Contact").xem.hang).toBe("13a");
    expect(life("Contact").rieng.gop.hang).toBe("13a");
    expect(life("ShareLink").go.hang).toBe("18");
    expect(life("ListingOwner").go.hang).toBe("13");
  });

  it("every khong cell names the scope gate line of this record, which carries the owner's name", () => {
    const ledger = readFileSync(
      join(ROOT, "_acceptance/kiem-vong-doi-thao-tac/decisions.jsonl"),
      "utf8",
    )
      .split("\n")
      .filter(Boolean)
      .map((l) => JSON.parse(l) as { id: string; stage?: string; decided_by?: string });
    const gate = ledger.find((l) => l.id === GATE.split("#")[1])!;
    expect(gate.stage).toBe("gate1");
    expect(gate.decided_by).toBeTruthy();
    const refs: string[] = [];
    const walk = (c: Cell) => {
      if (c.khong) refs.push(c.duyet ?? "");
      for (const v of Object.values(c.chan ?? {})) walk(v);
    };
    for (const item of Object.values(table(ROOT).entities)) {
      const life = item.vong_doi as Record<string, Cell> & { rieng?: Record<string, Cell> };
      for (const c of ["them", "xem", "sua", "go"]) walk(life[c]!);
      for (const v of Object.values(life.rieng ?? {})) walk(v);
    }
    expect(refs.length).toBe(5);
    expect(new Set(refs)).toEqual(new Set([GATE]));
  });
});

describe("xem-theo-vai", () => {
  cleanedGroup();
  it("who may open each screen is the matrix written beforehand", () => {
    const all = ["ListAgent", "BuyerAgent", "TeamLead", "CompanyAdmin"];
    const want: Record<string, string[]> = {
      khung: all,
      inventory: all,
      sent: all,
      "company-layer": all,
      members: ["CompanyAdmin"],
      contacts: ["ListAgent", "BuyerAgent", "TeamLead"],
    };
    const screens = table(ROOT).screens;
    for (const [sid, roles] of Object.entries(want)) expect(screens[sid]!.mo, sid).toEqual(roles);
  });

  it("a role that opens a screen and may not view what it shows is red", () => {
    const dir = copy();
    // Row 10 lets the admin view listings (Hỏi-1 A); a copy that takes the admin's cell away while the screen stays open
    // to every role is red.
    breakFile(dir, "ontology/actions.yaml", (t) =>
      t.replace(
        '    scope: { ListAgent: company, BuyerAgent: company, TeamLead: company, CompanyAdmin: company }\n    doors:\n      db: ["table listings select"',
        '    scope: { ListAgent: company, BuyerAgent: company, TeamLead: company }\n    doors:\n      db: ["table listings select"',
      ),
    );
    expectRed(dir, "Listing.xem: CompanyAdmin mo duoc inventory ma khong xem duoc");
  });

  it("opening the members screen to every role is red", () => {
    const dir = copy();
    breakFile(dir, "design/screens.yaml", (t) =>
      t.replace("    vao: listMembers\n", "    vao: null\n"),
    );
    expectRed(dir, "Member.xem: ListAgent mo duoc members ma khong xem duoc");
  });

  it("the report lists each cell with its roles and never fails", () => {
    const r = run(ROOT, "--report");
    expect(r.status).toBe(0);
    expect(r.out).toContain(
      "- them: inviteMember — Đầu chủ chặn, Đầu khách chặn, Trưởng nhóm chặn, Quản trị sàn toàn sàn",
    );
    expect(r.out).toContain(
      "- go: removeView — Đầu chủ của tôi, Đầu khách của tôi, Trưởng nhóm của tôi, Quản trị sàn chặn",
    );
    expect(r.out).toContain("- go: hàng 18 — Turning a sent link off.");
    const dir = copy();
    breakFile(dir, ent("Member"), (t) => t.replace("  sua: { co: changeMemberRoles }\n", ""));
    expect(run(dir, "--report").status).toBe(0);
    expect(run(dir, "--check").status).toBe(1);
  });
});

describe("don-thu-muc-tam", () => {
  let broken: string[] = [];
  describe("group that skips the shared cleanup (broken case)", () => {
    it("a group that makes a copy without the shared cleanup", () => {
      broken = [copy()];
      expect(existsSync(broken[0]!)).toBe(true);
    });
  });

  it("every copy the other groups made is gone; the one the broken group left is named", () => {
    const left = made.filter((dir) => existsSync(dir));
    expect(made.length).toBeGreaterThan(20);
    expect(orphans, "copies made outside a cleaned group").toEqual(broken);
    expect(left, `copies left on disk: ${left.join(", ")}`).toEqual(broken);
    release(broken);
    expect(made.filter((dir) => existsSync(dir))).toEqual([]);
  });
});
