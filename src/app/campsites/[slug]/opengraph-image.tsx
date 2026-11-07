import { campsites, getCampsiteBySlug } from "@/data";
import { renderCampsiteOgImage } from "@/lib/og-image";

// `alt` must be static here; per-campsite alt text is set in the page's
// generateMetadata via pageMetadata({ imagePath, ... }).
export const alt = "香港郊野營地指南｜營地資料及編輯評分";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return campsites.map((c) => ({ slug: c.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return renderCampsiteOgImage(getCampsiteBySlug(slug));
}
