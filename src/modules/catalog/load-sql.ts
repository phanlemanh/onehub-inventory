// Statements that load a catalog (the sample one, row 7d) into the shared catalog tables of migration 007. Run by the
// table owner, never by the API role: the API role only reads the shared catalog. Running them twice adds nothing.
import type { SampleCatalog } from "./sample";

export interface Statement {
  text: string;
  values: unknown[];
}

export function catalogLoadStatements(c: SampleCatalog): Statement[] {
  const out: Statement[] = [];
  for (const s of c.subdivisions)
    out.push({
      text: "insert into catalog_nodes (slug, node_type, name) values ($1, 'project', $2) on conflict (slug) do nothing",
      values: [s.slug, s.name],
    });
  for (const x of c.complexes)
    out.push({
      text:
        "insert into catalog_nodes (slug, node_type, name, subdivision_slug) values ($1, 'complex', $2, $3) " +
        "on conflict (slug) do nothing",
      values: [x.slug, x.name, x.subdivisionSlug],
    });
  for (const b of c.buildings)
    out.push({
      text:
        "insert into catalog_buildings (building_key, subdivision_key, complex_key, building_name, upi) " +
        "values ($1, $2, $3, $4, $5) on conflict (building_key) do nothing",
      values: [b.buildingKey, b.subdivisionKey, b.complexKey ?? null, b.buildingName, b.upi],
    });
  for (const s of c.stacks)
    out.push({
      text:
        "insert into catalog_stacks (stack_key, building_key, stack_code) values ($1, $2, $3) " +
        "on conflict (stack_key) do nothing",
      values: [s.stackKey, s.buildingKey, s.stackCode],
    });
  for (const u of c.units)
    out.push({
      text:
        "insert into catalog_units (unit_key, upi, subdivision_key, complex_key, building_key, building_name, " +
        "stack_key, stack, unit_number, floor, living_area, bedrooms_total, direction_faces, property_type, " +
        "property_sub_type) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) " +
        "on conflict (unit_key) do nothing",
      values: [
        u.unitKey,
        u.upi,
        u.subdivisionKey,
        u.complexKey ?? null,
        u.buildingKey,
        u.buildingName,
        u.stackKey ?? null,
        u.stack ?? null,
        u.unitNumber,
        u.floor ?? null,
        u.livingArea ?? null,
        u.bedroomsTotal ?? null,
        u.directionFaces ?? null,
        u.propertyType,
        u.propertySubType,
      ],
    });
  for (const a of c.aliases)
    out.push({
      text:
        "insert into catalog_aliases (object_key, kind, value, source, first_seen) " +
        "select $1, $2, $3, $4, $5 where not exists (select from catalog_aliases " +
        "where object_key = $1 and kind = $2 and value = $3 and source = $4 and retired_at is null)",
      values: [a.objectKey, a.kind, a.value, a.source, a.firstSeen],
    });
  return out;
}
