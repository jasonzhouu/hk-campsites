import type { Campsite } from "@/types/campsite";
import { REGIONS } from "@/types/campsite";

export const EXPECTED_CAMPSITE_COUNT = 41;

/** Returns a list of problems; empty list means the catalog is valid. */
export function validateCampsites(list: Campsite[]): string[] {
  const errors: string[] = [];
  if (list.length !== EXPECTED_CAMPSITE_COUNT) {
    errors.push(`Expected ${EXPECTED_CAMPSITE_COUNT} campsites, found ${list.length}`);
  }
  const seenSlugs = new Set<string>();
  const seenIds = new Set<number>();
  for (const c of list) {
    if (seenSlugs.has(c.slug)) errors.push(`Duplicate slug: ${c.slug}`);
    seenSlugs.add(c.slug);
    if (seenIds.has(c.id)) errors.push(`Duplicate id: ${c.id}`);
    seenIds.add(c.id);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(c.slug)) errors.push(`Invalid slug format: ${c.slug}`);
    if (!REGIONS.includes(c.region)) errors.push(`${c.slug}: unknown region ${c.region}`);
    for (const [dim, v] of Object.entries(c.ratings)) {
      if (!Number.isInteger(v) || v < 1 || v > 5) {
        errors.push(`${c.slug}: rating ${dim}=${v} outside 1–5`);
      }
    }
    if (c.lat < 22.1 || c.lat > 22.6 || c.lng < 113.8 || c.lng > 114.5) {
      errors.push(`${c.slug}: coordinates outside Hong Kong (${c.lat}, ${c.lng})`);
    }
    if (c.access.length === 0) errors.push(`${c.slug}: no access mode`);
  }
  const twisk = list.find((c) => c.id === 24);
  if (!twisk || twisk.slug !== "twisk" || !twisk.bookingRequired) {
    errors.push("Campsite #24 荃錦 (twisk) must exist with bookingRequired: true");
  }
  return errors;
}

export function assertValidCampsites(list: Campsite[]): void {
  const errors = validateCampsites(list);
  if (errors.length > 0) {
    throw new Error(`Invalid campsite catalog:\n- ${errors.join("\n- ")}`);
  }
}
