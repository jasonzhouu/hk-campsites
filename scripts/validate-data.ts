/**
 * pnpm validate:data
 * Checks the campsite catalog: 41 sites, unique slugs/ids, ratings 1–5,
 * #24 荃錦 bookingRequired, and composite formula sanity.
 */
import { campsites } from "../src/data/campsites";
import { computeComposite } from "../src/lib/ratings";
import { validateCampsites } from "../src/lib/validate";

const errors = validateCampsites(campsites);

// Formula sanity checks against known seed values.
const checks: [Parameters<typeof computeComposite>[0], number][] = [
  [{ facilities: 3, scenery: 3, quietness: 4, transport: 4 }, 3.45],
  [{ facilities: 2, scenery: 5, quietness: 4, transport: 1 }, 3.05],
  [{ facilities: 5, scenery: 5, quietness: 5, transport: 5 }, 5],
];
for (const [r, expected] of checks) {
  const got = computeComposite(r);
  if (got !== expected) errors.push(`computeComposite(${JSON.stringify(r)}) = ${got}, expected ${expected}`);
}

if (errors.length) {
  console.error(`Campsite data invalid:\n- ${errors.join("\n- ")}`);
  process.exit(1);
}
console.log(`OK: ${campsites.length} campsites, unique slugs, ratings within 1–5, #24 requires booking.`);
