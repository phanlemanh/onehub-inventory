// The inventory's query words (row 1v, _acceptance/english-query-words): every word the inventory reads from or writes
// to its address, in English, and the six old link words a pasted or sent link may still carry.

/** Every query word of the inventory and of the behaviour prototype. */
export const QUERY_WORD = {
  /** The top-bar search by unit code (row 3f). */
  unit: "unit",
  /** The top-bar search by building (row 3f). */
  building: "building",
  /** The top-bar search by subdivision (row 3f). */
  subdivision: "subdivision",
  /** The open unit record (row 3); the same word as the record panel's RECORD_PARAM, which is a client file. */
  record: "record",
  /** A place of the geography tree (row 2d). */
  place: "place",
  /** A saved view (row 2c). */
  view: "view",
  /** Development only, on the sample company: the role that stands in for the session's (rows 4, 10). */
  role: "role",
  /** Development only, on the sample company: `?sample=edge` adds the edge rows (row 2b). */
  sample: "sample",
  /** Development only, on the behaviour prototype: `?permission=denied` takes «Thêm dòng» away. */
  permission: "permission",
  /** Development only, row 3h's prototype: `?columns=five` also shows floor, direction and sub type (variant B). */
  columns: "columns",
  /** Development only, row 3h's prototype: `?mark=dot|badge|icon`, the look of the catalog mark (Hỏi-6). */
  mark: "mark",
} as const;

/**
 * The six words an older link may carry, and the word that replaced each. The inventory translates them once (Hỏi-1
 * of the scope gate); the three development switches are not translated.
 */
export const OLD_LINK_WORD: Readonly<
  Record<"ma" | "toa" | "du-an" | "ho-so" | "vung" | "goc-nhin", string>
> = {
  ma: QUERY_WORD.unit,
  toa: QUERY_WORD.building,
  "du-an": QUERY_WORD.subdivision,
  "ho-so": QUERY_WORD.record,
  vung: QUERY_WORD.place,
  "goc-nhin": QUERY_WORD.view,
};

/**
 * The address's parameters with every old link word renamed, or null when there is none. Values and order are kept;
 * a repeated word keeps all its values; where the new word is also present it wins and the old one is dropped.
 */
export function englishQuery(
  query: Record<string, string | string[] | undefined>,
): URLSearchParams | null {
  const keys = Object.keys(query);
  if (!keys.some((key) => Object.hasOwn(OLD_LINK_WORD, key))) return null;
  const params = new URLSearchParams();
  for (const key of keys) {
    const renamed = Object.hasOwn(OLD_LINK_WORD, key)
      ? OLD_LINK_WORD[key as keyof typeof OLD_LINK_WORD]
      : undefined;
    if (renamed !== undefined && renamed in query) continue;
    const name = renamed ?? key;
    for (const value of ([] as (string | undefined)[]).concat(query[key])) {
      if (value !== undefined) params.append(name, value);
    }
  }
  return params;
}
