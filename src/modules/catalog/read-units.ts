// Reads units of the shared catalog by UPI (row 10): what a listing of a company shows of the unit it offers — the
// tower, its project and complex, area, bedrooms, floor, direction and kind. Runs on a client the caller opened (the
// listings module's read, inside withCompany), so the catalog keeps no session code of its own; the API role reads
// the shared catalog with readCatalog.
import type { Unit } from "../../generated/ontology";

/** A catalog unit with the names of its project and complex, as a listing of it shows them. */
export interface CatalogUnitRead extends Pick<
  Unit,
  | "upi"
  | "unitNumber"
  | "buildingName"
  | "floor"
  | "livingArea"
  | "bedroomsTotal"
  | "directionFaces"
  | "propertySubType"
> {
  subdivisionName: string;
  complexName?: string;
}

/** The smallest client this needs: one query with values. */
export interface QueryClient {
  query(text: string, values?: unknown[]): Promise<{ rows: unknown[] }>;
}

interface Row {
  upi: string;
  unit_number: string;
  building_name: string;
  floor: string | null;
  living_area: string | null;
  bedrooms_total: number | null;
  direction_faces: string | null;
  property_sub_type: Unit["propertySubType"];
  subdivision_name: string;
  complex_name: string | null;
}

const READ_UNITS = `
  select u.upi, u.unit_number, u.building_name, u.floor, u.living_area, u.bedrooms_total, u.direction_faces,
         u.property_sub_type, p.name as subdivision_name, c.name as complex_name
    from catalog_units u
    join catalog_nodes p on p.slug = u.subdivision_key
    left join catalog_nodes c on c.slug = u.complex_key
   where u.upi = any($1::text[])`;

/** The units with these UPIs; a UPI the catalog does not have is simply absent. */
export async function readCatalogUnits(
  client: QueryClient,
  upis: readonly string[],
): Promise<CatalogUnitRead[]> {
  if (upis.length === 0) return [];
  const { rows } = await client.query(READ_UNITS, [[...new Set(upis)]]);
  return (rows as Row[]).map(toRead);
}

/**
 * The units with these unit keys, each with its key (row 3h): a company's pending unit, once matched, names the catalog
 * unit by its key, and its listing shows that unit's attributes where it has no own value.
 */
export async function readCatalogUnitsByKey(
  client: QueryClient,
  unitKeys: readonly string[],
): Promise<(CatalogUnitRead & { unitKey: string })[]> {
  if (unitKeys.length === 0) return [];
  const { rows } = await client.query(
    READ_UNITS.replace(
      "where u.upi = any($1::text[])",
      "where u.unit_key = any($1::text[])",
    ).replace("select u.upi,", "select u.unit_key, u.upi,"),
    [[...new Set(unitKeys)]],
  );
  return (rows as (Row & { unit_key: string })[]).map((r) => ({
    ...toRead(r),
    unitKey: r.unit_key,
  }));
}

function toRead(r: Row): CatalogUnitRead {
  return {
    upi: r.upi,
    unitNumber: r.unit_number,
    buildingName: r.building_name,
    subdivisionName: r.subdivision_name,
    ...(r.complex_name ? { complexName: r.complex_name } : {}),
    ...(r.floor !== null ? { floor: r.floor } : {}),
    ...(r.living_area !== null ? { livingArea: Number(r.living_area) } : {}),
    ...(r.bedrooms_total !== null ? { bedroomsTotal: r.bedrooms_total } : {}),
    ...(r.direction_faces !== null ? { directionFaces: r.direction_faces } : {}),
    propertySubType: r.property_sub_type,
  };
}
