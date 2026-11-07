import { ImageResponse } from "next/og";
import type { CampsiteWithComposite } from "@/data";
import { campsites } from "@/data";
import { OG_FONT_FAMILY, ogFonts } from "@/lib/og-font";
import { formatComposite, RATING_MAX } from "@/lib/ratings";
import { site } from "@/lib/site";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const color = {
  cream: "#f7f5ee",
  forest: "#1b4332",
  pine: "#2d6a4f",
  leaf: "#40916c",
  sage: "#d8e6dc",
  muted: "#52675b",
} as const;

export const SITE_SUBTITLE = `漁護署 ${campsites.length} 個指定露營地點 · 編輯評分指南`;
const DISCLAIMER = "非官方資訊整理";

/** Layered hills, a tent and a few stars, drawn bottom-right. Pure SVG, no text. */
function Scenery() {
  return (
    <svg
      width="1200"
      height="630"
      viewBox="0 0 1200 630"
      style={{ position: "absolute", left: 0, top: 0 }}
    >
      {/* stars */}
      <g fill={color.leaf} opacity="0.55">
        <path d="M1010 92 l5 13 13 5 -13 5 -5 13 -5 -13 -13 -5 13 -5z" />
        <path d="M1110 150 l3.5 9 9 3.5 -9 3.5 -3.5 9 -3.5 -9 -9 -3.5 9 -3.5z" />
        <path d="M930 170 l3 7.5 7.5 3 -7.5 3 -3 7.5 -3 -7.5 -7.5 -3 7.5 -3z" />
        <circle cx="1065" cy="210" r="3" />
        <circle cx="880" cy="110" r="2.5" />
      </g>
      {/* crescent moon */}
      <path
        d="M1092 70 a34 34 0 1 0 30 52 a28 28 0 1 1 -30 -52z"
        fill={color.sage}
        transform="translate(-10 0)"
      />
      {/* far hills */}
      <path
        d="M560 630 L760 400 L860 470 L990 320 L1200 470 L1200 630 Z"
        fill={color.sage}
      />
      {/* mid hills */}
      <path
        d="M640 630 L820 470 L930 540 L1060 420 L1200 520 L1200 630 Z"
        fill={color.leaf}
        opacity="0.85"
      />
      {/* near ground */}
      <path d="M700 630 Q900 540 1200 575 L1200 630 Z" fill={color.forest} />
      {/* tent */}
      <g transform="translate(965 470)">
        <path d="M0 100 L62 0 L124 100 Z" fill={color.cream} />
        <path d="M62 0 L44 100 L80 100 Z" fill={color.pine} />
        <path d="M62 0 L62 100" stroke={color.forest} strokeWidth="3" />
        <path d="M-10 100 L134 100" stroke={color.cream} strokeWidth="4" strokeLinecap="round" />
      </g>
      {/* pines */}
      <g fill={color.forest}>
        <path d="M790 600 L815 520 L840 600 Z" />
        <path d="M830 610 L850 545 L870 610 Z" />
        <path d="M1130 590 L1150 520 L1170 590 Z" />
      </g>
    </svg>
  );
}

function Chip({ children, tone }: { children: React.ReactNode; tone: "solid" | "outline" }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "8px 20px",
        borderRadius: 999,
        fontSize: 24,
        fontWeight: 700,
        ...(tone === "solid"
          ? { background: color.forest, color: color.cream }
          : { border: `2px solid ${color.pine}`, color: color.pine }),
      }}
    >
      {children}
    </div>
  );
}

/** Shared frame: cream canvas, scenery, brand header and footer chips around `children`. */
function Frame({ children, footer }: { children: React.ReactNode; footer: React.ReactNode }) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: color.cream,
        color: color.forest,
        fontFamily: OG_FONT_FAMILY,
      }}
    >
      <Scenery />
      <div style={{ position: "absolute", left: 0, top: 0, width: 1200, height: 14, background: color.pine }} />
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: 920,
          height: "100%",
          padding: "70px 0 60px 80px",
        }}
      >
        {children}
        <div style={{ display: "flex", gap: 14 }}>{footer}</div>
      </div>
    </div>
  );
}

async function render(element: React.ReactElement, text: { regular: string; bold: string }) {
  return new ImageResponse(element, { ...ogSize, fonts: await ogFonts(text) });
}

export async function renderSiteOgImage() {
  const subtitle = SITE_SUBTITLE;
  return render(
    <Frame footer={<Chip tone="solid">{DISCLAIMER}</Chip>}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", fontSize: 30, color: color.leaf, letterSpacing: 1 }}>{site.nameEn}</div>
        <div style={{ display: "flex", marginTop: 18, fontSize: 88, fontWeight: 700, lineHeight: 1.1 }}>
          {site.name}
        </div>
        <div style={{ display: "flex", width: 96, height: 8, marginTop: 34, borderRadius: 4, background: color.leaf }} />
        <div style={{ display: "flex", marginTop: 34, fontSize: 34, color: color.pine, lineHeight: 1.4 }}>
          {subtitle}
        </div>
      </div>
    </Frame>,
    { regular: site.nameEn + subtitle, bold: site.name + DISCLAIMER },
  );
}

export async function renderCampsiteOgImage(c: CampsiteWithComposite | undefined) {
  if (!c) return renderSiteOgImage();
  const location = `${c.region} · ${c.parkZh}`;
  const scoreLabel = "綜合分";
  const score = `${formatComposite(c.composite)} / ${RATING_MAX}`;
  const nameSize = c.nameZh.length > 8 ? 76 : 92;
  return render(
    <Frame
      footer={
        <>
          <Chip tone="solid">{site.name}</Chip>
          <Chip tone="outline">{DISCLAIMER}</Chip>
        </>
      }
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", fontSize: 28, color: color.leaf }}>{location}</div>
        <div style={{ display: "flex", marginTop: 16, fontSize: nameSize, fontWeight: 700, lineHeight: 1.1 }}>
          {c.nameZh}
        </div>
        <div style={{ display: "flex", marginTop: 12, fontSize: 36, color: color.muted }}>{c.nameEn}</div>
        <div style={{ display: "flex", alignItems: "baseline", marginTop: 40, gap: 16 }}>
          <div style={{ display: "flex", fontSize: 30, color: color.pine }}>{scoreLabel}</div>
          <div style={{ display: "flex", fontSize: 64, fontWeight: 700, color: color.forest }}>{score}</div>
        </div>
      </div>
    </Frame>,
    {
      regular: location + c.nameEn + scoreLabel,
      bold: c.nameZh + score + site.name + DISCLAIMER,
    },
  );
}
