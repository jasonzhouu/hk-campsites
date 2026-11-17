import type { Metadata, Viewport } from "next";
import { Chiron_Hei_HK, Chiron_Sung_HK } from "next/font/google";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { site } from "@/lib/site";
import "./globals.css";

const defaultTitle = `${site.name}｜漁護署 41 個指定露營地點`;

// Hong Kong-standard glyph forms (not Japanese/Simplified shapes). Self-hosted by
// next/font; CJK faces ship as unicode-range slices, so a page only downloads the
// characters it actually uses. Hei is the UI/reading voice, Sung is the guidebook
// voice for page titles, campsite names and scores.
const chironHei = Chiron_Hei_HK({
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
  preload: false,
  variable: "--font-hei",
  fallback: ["PingFang HK", "Noto Sans TC", "Microsoft JhengHei", "sans-serif"],
});

const chironSung = Chiron_Sung_HK({
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
  preload: false,
  variable: "--font-sung",
  fallback: ["PMingLiU", "Noto Serif TC", "Songti TC", "serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: defaultTitle,
    template: `%s｜${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "zh_HK",
    siteName: site.name,
    title: defaultTitle,
    description: site.description,
    url: "/",
  },
  twitter: { card: "summary_large_image", title: defaultTitle, description: site.description },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1f3a2c",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-HK" className={`${chironHei.variable} ${chironSung.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
        >
          跳至主要內容
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
