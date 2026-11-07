import { cacheLife } from "next/cache";

/**
 * Loads a subset of Noto Sans TC (fallback: Noto Sans SC) from Google Fonts for
 * `ImageResponse`. Satori's bundled font has no CJK glyphs, so every OG image
 * must pass this font in `fonts`.
 *
 * - `text=` subsets the font to the glyphs actually drawn, keeping the payload
 *   far below the ImageResponse asset limit.
 * - Results are memoised per (family, weight, text) in a module-level Map so
 *   build-time generation of many images only downloads each subset once, and
 *   `'use cache'` lets Cache Components prerender the image routes at build time.
 * - Failures throw loudly: falling back to a Latin-only font would silently
 *   render tofu boxes.
 */

export const OG_FONT_FAMILY = "Noto Sans TC";

export type OgFontWeight = 400 | 700;

const FAMILIES = ["Noto Sans TC", "Noto Sans SC"] as const;

const memo = new Map<string, Promise<ArrayBuffer>>();

function uniqueChars(text: string): string {
  return Array.from(new Set(Array.from(text))).sort().join("");
}

async function fetchSubset(family: string, weight: OgFontWeight, text: string): Promise<ArrayBuffer> {
  const cssUrl =
    `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family).replace(/%20/g, "+")}` +
    `:wght@${weight}&text=${encodeURIComponent(text)}`;
  // No browser User-Agent: Google Fonts then serves TrueType, which Satori can read (it cannot read woff2).
  const cssRes = await fetch(cssUrl);
  if (!cssRes.ok) throw new Error(`CSS request failed: HTTP ${cssRes.status} for ${cssUrl}`);
  const css = await cssRes.text();
  const match = css.match(/src:\s*url\(([^)]+)\)\s*format\('(truetype|opentype)'\)/);
  if (!match) throw new Error(`No TrueType/OpenType src in Google Fonts CSS for ${family} ${weight}`);
  const fontRes = await fetch(match[1]);
  if (!fontRes.ok) throw new Error(`Font download failed: HTTP ${fontRes.status} for ${match[1]}`);
  return fontRes.arrayBuffer();
}

async function loadFontCached(weight: OgFontWeight, text: string): Promise<ArrayBuffer> {
  "use cache";
  cacheLife("max");
  const errors: string[] = [];
  for (const family of FAMILIES) {
    try {
      return await fetchSubset(family, weight, text);
    } catch (err) {
      errors.push(`${family}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
  throw new Error(
    `[og-font] Could not load a CJK font for OG image generation (weight ${weight}). ` +
      `Chinese text would render as tofu, so refusing to continue.\n  ${errors.join("\n  ")}`,
  );
}

export function loadOgFont(weight: OgFontWeight, text: string): Promise<ArrayBuffer> {
  const subset = uniqueChars(text);
  const key = `${weight}:${subset}`;
  let pending = memo.get(key);
  if (!pending) {
    pending = loadFontCached(weight, subset);
    // Drop failed attempts so a later call can retry.
    pending.catch(() => memo.delete(key));
    memo.set(key, pending);
  }
  return pending;
}

/** Font entries for `ImageResponse` options, subset to the given regular / bold text. */
export async function ogFonts({ regular, bold }: { regular: string; bold: string }) {
  const [regularData, boldData] = await Promise.all([loadOgFont(400, regular), loadOgFont(700, bold)]);
  return [
    { name: OG_FONT_FAMILY, data: regularData, weight: 400 as const, style: "normal" as const },
    { name: OG_FONT_FAMILY, data: boldData, weight: 700 as const, style: "normal" as const },
  ];
}
