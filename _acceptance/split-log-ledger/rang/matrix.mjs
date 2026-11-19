// The fixed facts the measures of split-log-ledger read. Each is written here once.

/** The commit `make split L=log` ran on: main after PR #90, the last commit with wiki/log.md in git. */
export const SPLIT_FROM = "c79189dd267eb7f29fcc13faf02f3171a4a91227";

/** Entry lines of wiki/log.md at SPLIT_FROM, and how many differ: two entries were there twice, word for word. */
export const ENTRIES_BEFORE = 110;
export const DISTINCT_BEFORE = 108;

/** The date of the split: an entry the split did not carry must be of this day or later. */
export const SPLIT_DAY = "2026-11-19";

/** Where upgrade-repo-setup-0-9-0 took mk/design-role-table.mk from (its BASE). */
export const RS090_BASE = "bd32d73e";

/** The two live instructions that told the reader to write wiki/log.md by hand, and their old words. */
export const INSTRUCTIONS = [
  {
    file: "docs/van-hanh/xoay-khoa.md",
    old: "ghi một dòng vào `wiki/log.md`: ngày, khoá nào, môi trường nào",
  },
  {
    file: "docs/plan/dot-nen/LUAT-rieng.md",
    old: "`.env.example`, `wiki/log.md`) chỉ thêm dòng",
  },
];

/** Docs left as they are: plans, specs and measurements of past work are records of their day. */
export const HISTORY = ["docs/superpowers/", "docs/plan/do-he-design/"];

/** A sentence that tells the reader to put a line into wiki/log.md by hand (Vietnamese or English). */
export const HAND_WRITE = [/(?:ghi|thêm)[^.\n]{0,40}`wiki\/log\.md`/i, /(?:add|append|write)[^.\n]{0,40}`?wiki\/log\.md/i];

/** The three measures of signed records this split broke, fixed after signature (sua-sau-ky.md). */
export const FIXED = {
  soQuyetDinh: "node _acceptance/don-no-bo-kiem/rang/so-quyet-dinh.mjs --root .",
  tpcCase: "E4 red",
  tpcTwoWay: "_acceptance/tat-plugin-cho-cu/rang/two-way.mjs",
  rs090Case: "^ledgers",
  rs090TwoWay: "_acceptance/upgrade-repo-setup-0-9-0/rang/two-way.mjs",
};

/** The eval of upgrade-repo-setup-0-9-0 this record stands for. */
export const SUPERSEDES = { evals: "_acceptance/upgrade-repo-setup-0-9-0/evals.yaml", id: "E10", pointer: "split-log-ledger#AC-3" };

/** The three jobs that must end in success on the pull request's head; e2e-db and gate are read and printed (gate waits for the owner's signature). */
export const CI_REQUIRED = ["quick", "e2e", "check"];
export const CI_REPORTED = ["e2e-db", "gate"];
