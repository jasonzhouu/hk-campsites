import { renderSiteOgImage } from "@/lib/og-image";

// Config exports are written as literals so Next can statically read them.
export const alt = "香港郊野營地指南｜漁護署指定露營地點及編輯評分";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function TwitterImage() {
  return renderSiteOgImage();
}
