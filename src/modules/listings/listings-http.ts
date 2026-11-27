// Listings over HTTP (row 10): PATCH /api/v1/listings/[id] changes one listing by one change — its price, its status
// with what the status needs, its fee inclusion, its four details, one custom value (row 3g) or its own unit values (row 3h). Plain Request in, Response out, so the route file stays one line and
// tests call this directly. The door opens with the action of the change (activateListing for a move to Active,
// updateListing otherwise) before any data is touched; the rules of the move are the ones of edit-rules, run through
// applyChange; the write names the version the person edited, so a change made in between is a conflict, never
// overwritten. The database checks the company, the permission table and the keeper rule again (migration 013).
import { z } from "zod";

import type { ActionName } from "@/modules/identity";
import type { DbClient, DbPool, DoorError, OpenedDoor } from "@/modules/identity/server";

import type { Listing } from "../../generated/ontology";

import { readCatalogUnits } from "../catalog/server";

import {
  LISTING_COLUMNS,
  LISTING_FROM,
  PENDING_UNIT,
  toListing,
  type ListingRow,
} from "./inventory-read";
import { applyChange, type CustomCheck, type Invalid, type ListingChange } from "./save-door";
import { STANDARD_STATUSES } from "./sample";
import { UNIT_ATTRIBUTE_FIELDS } from "./unit-attributes";
import {
  DETAILS_TEXT_LIMIT,
  FURNISHED_VALUES,
  OCCUPANT_VALUES,
  WITHDRAWN_REASONS,
} from "./edit-rules";

export type ListingsErrorCode = DoorError | "not-found" | "bad-request" | "invalid" | "conflict";

const STATUS: Record<ListingsErrorCode, number> = {
  unauthenticated: 401,
  forbidden: 403,
  "not-found": 404,
  "bad-request": 400,
  invalid: 400,
  conflict: 409,
  "server-error": 500,
};

function error(code: ListingsErrorCode, extra: Record<string, unknown> = {}): Response {
  return Response.json({ error: code, ...extra }, { status: STATUS[code] });
}

const Change = z.discriminatedUnion("field", [
  z.object({ field: z.literal("listPrice"), listPrice: z.number().int() }).strict(),
  z
    .object({ field: z.literal("feeInclusion"), feeInclusion: z.enum(["Included", "Excluded"]) })
    .strict(),
  z
    .object({
      field: z.literal("standardStatus"),
      standardStatus: z.enum(
        STANDARD_STATUSES as [Listing["standardStatus"], ...Listing["standardStatus"][]],
      ),
      closePrice: z.number().int().optional(),
      closeDate: z.iso.date().optional(),
      withdrawnReason: z
        .enum(WITHDRAWN_REASONS as [string, ...string[]])
        .optional()
        .transform((v) => v as Listing["withdrawnReason"]),
    })
    .strict(),
  // Row 3g: the four details of the record, each optional, null clears; words already trimmed, at most 200.
  z
    .object({
      field: z.literal("details"),
      legalStatus: z.string().trim().min(1).max(DETAILS_TEXT_LIMIT).nullable().optional(),
      furnished: z
        .enum(FURNISHED_VALUES as [string, ...string[]])
        .nullable()
        .optional()
        .transform((v) => v as Listing["furnished"] | null | undefined),
      financing: z.string().trim().min(1).max(DETAILS_TEXT_LIMIT).nullable().optional(),
      occupantType: z
        .enum(OCCUPANT_VALUES as [string, ...string[]])
        .nullable()
        .optional()
        .transform((v) => v as Listing["occupantType"] | null | undefined),
    })
    .strict(),
  // Row 3g: one value of one of the company's own fields; its kind is checked by the company layer's rule.
  z
    .object({
      field: z.literal("customField"),
      code: z.string().min(1).max(64),
      value: z.union([z.string(), z.number(), z.boolean(), z.null()]),
    })
    .strict(),
  // Row 3h: the listing's own unit values (migration 019). `null` takes the catalog's value again; a value's kind is
  // checked by the rule of edit (attributeFits in save-door), so the shapes here only keep out what is no value at all.
  z
    .object({
      field: z.literal("unitAttributes"),
      livingArea: z.number().nullable().optional(),
      floor: z.string().max(8).nullable().optional(),
      bedroomsTotal: z.number().int().nullable().optional(),
      directionFaces: z.string().max(16).nullable().optional(),
      propertySubType: z.string().max(32).nullable().optional(),
      // Only «Hoàn tác» names a source, to write back a value a file brought (plan decision, ledger d-…-23).
      sources: z.partialRecord(z.enum(UNIT_ATTRIBUTE_FIELDS), z.literal("File")).optional(),
    })
    .strict(),
  // Row 3h, «Gắn sang căn khác»: the unit of the shared catalog the listing points at from now on.
  z.object({ field: z.literal("unit"), upi: z.string().min(1).max(64) }).strict(),
]);
const Body = z.object({ version: z.number().int().min(1), change: Change }).strict();

/** What the handler needs from the identity module: its shared door and its query door. */
export interface ListingsDeps {
  door(req: Request, action: ActionName): Promise<OpenedDoor | DoorError>;
  withCompany<T>(
    pool: DbPool,
    ctx: { userId: string; companyId: string },
    fn: (client: DbClient) => Promise<T>,
  ): Promise<T>;
  /** The time of the change; the server's clock, not the browser's. */
  now?: () => Date;
}

/** What one request brings besides the body (row 3g): how the company's own fields take a value. */
export interface ChangeOptions {
  /**
   * The company layer's value rule (checkCustomValue of company-config) for the signed-in company, handed in by the
   * route: listings does not depend on company-config (architecture/modules.yaml). Absent: no custom value is taken.
   */
  customCheck?: () => Promise<CustomCheck>;
}

export interface ListingsHandlers {
  change(req: Request, id: string, options?: ChangeOptions): Promise<Response>;
}

/** Without the company layer's rule no custom value goes in: the field reads as unknown. */
const NO_CUSTOM: CustomCheck = () => ({ ok: false, reason: "field-retired" });

const INSUFFICIENT_PRIVILEGE = "42501";

type Outcome =
  | { kind: "saved"; listing: Listing }
  | { kind: "not-found" }
  | { kind: "conflict"; current: Listing }
  | { kind: "invalid"; why: unknown }
  | { kind: "forbidden" };

/** The action of the permission table a change runs. */
export const actionOf = (change: ListingChange): ActionName =>
  change.field === "standardStatus" && change.standardStatus === "Active"
    ? "activateListing"
    : "updateListing";

/**
 * Moves the listing's unit link (row 3h, AC-10), or says why not: the unit is not in the catalog or is the same one, or
 * the company already has an open listing on it (named by its unit number). The unique index of 013 still guards a race.
 */
async function moveUnit(
  c: DbClient,
  id: string,
  from: string,
  to: string,
): Promise<Invalid | null> {
  // A listing on a pending unit (row 11) has no catalog link to move: the pending unit is matched instead.
  if (to === from || from.startsWith(PENDING_UNIT)) return { rule: "unit" };
  const [unit] = await readCatalogUnits(c, [to]);
  if (!unit) return { rule: "unit" };
  const taken = await c.query(
    "select 1 from listing_units where upi = $1 and open and listing_id <> $2 limit 1",
    [to, id],
  );
  if ((taken.rowCount ?? 0) > 0) return { rule: "unit-open", unitNumber: unit.unitNumber };
  await c.query("update listing_units set upi = $2 where listing_id = $1", [id, to]);
  return null;
}

export function createListingsHandlers(deps: ListingsDeps): ListingsHandlers {
  return {
    async change(req, id, options = {}) {
      try {
        if (!z.uuid().safeParse(id).success) return error("not-found");
        let input: z.infer<typeof Body>;
        try {
          const parsed = Body.safeParse(await req.json());
          if (!parsed.success) return error("bad-request");
          input = parsed.data;
        } catch {
          return error("bad-request");
        }
        const change = input.change as ListingChange;
        const door = await deps.door(req, actionOf(change));
        if (typeof door === "string") return error(door);
        const at = (deps.now?.() ?? new Date()).toISOString();
        const custom =
          change.field === "customField"
            ? ((await options.customCheck?.()) ?? NO_CUSTOM)
            : undefined;
        const outcome = await deps.withCompany<Outcome>(door.pool, door.ctx, async (c) => {
          const { rows } = await c.query(
            `select ${LISTING_COLUMNS} from ${LISTING_FROM}
              where l.id = $1 for update of l`,
            [id],
          );
          const row = (rows as ListingRow[])[0];
          if (!row) return { kind: "not-found" };
          const listing = toListing(row, undefined);
          if (listing.version !== input.version) return { kind: "conflict", current: listing };
          // Own scope of activateListing: the unit one keeps, or one nobody keeps yet (the database checks it too).
          if (
            actionOf(change) === "activateListing" &&
            door.scope === "own" &&
            listing.listAgentKey !== undefined &&
            listing.listAgentKey !== door.ctx.userId
          )
            return { kind: "forbidden" };
          const next = applyChange(listing, change, at, custom);
          if (!next.ok) return { kind: "invalid", why: next.why };
          const l = next.listing;
          if (change.field === "unit") {
            const moved = await moveUnit(c, id, row.upi, change.upi);
            if (moved) return { kind: "invalid", why: moved };
          }
          const r = await c.query(
            `update listings
                set list_price = $3, standard_status = $4, close_price = $5, close_date = $6, withdrawn_reason = $7,
                    fee_inclusion = $8, last_confirmed_at = $9, legal_status = $10, furnished = $11,
                    financing = $12, occupant_type = $13, custom_fields = $14::jsonb,
                    living_area = $15, living_area_source = $16, floor = $17, floor_source = $18,
                    bedrooms_total = $19, bedrooms_total_source = $20, direction_faces = $21,
                    direction_faces_source = $22, property_sub_type = $23, property_sub_type_source = $24,
                    version = version + 1, updated_at = now()
              where id = $1 and version = $2
            returning id`,
            [
              id,
              input.version,
              l.listPrice ?? null,
              l.standardStatus,
              l.closePrice ?? null,
              l.closeDate ?? null,
              l.withdrawnReason ?? null,
              l.feeInclusion ?? null,
              at,
              l.legalStatus ?? null,
              l.furnished ?? null,
              l.financing ?? null,
              l.occupantType ?? null,
              JSON.stringify(l.customFields ?? {}),
              l.livingArea ?? null,
              l.livingAreaSource ?? null,
              l.floor ?? null,
              l.floorSource ?? null,
              l.bedroomsTotal ?? null,
              l.bedroomsTotalSource ?? null,
              l.directionFaces ?? null,
              l.directionFacesSource ?? null,
              l.propertySubType ?? null,
              l.propertySubTypeSource ?? null,
            ],
          );
          // A role whose cell does not let it change listings sees no row to change.
          if (r.rowCount !== 1) return { kind: "forbidden" };
          return { kind: "saved", listing: l };
        });
        switch (outcome.kind) {
          case "saved":
            return Response.json({ listing: outcome.listing });
          case "conflict":
            return error("conflict", { current: outcome.current });
          case "invalid":
            return error("invalid", { why: outcome.why });
          default:
            return error(outcome.kind);
        }
      } catch (err) {
        if ((err as { code?: string }).code === INSUFFICIENT_PRIVILEGE) return error("forbidden");
        console.error("[bang-hang] lỗi máy chủ:", err instanceof Error ? err.message : "không rõ");
        return error("server-error");
      }
    },
  };
}
