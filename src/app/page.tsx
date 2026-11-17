import Link from "next/link";
import { CampsiteExplorer } from "@/components/campsites/campsite-explorer";
import { HeroContours } from "@/components/layout/hero-contours";
import { campsites } from "@/data";

const heroLink =
  "inline-flex h-11 items-center rounded-sm px-5 text-[15px] font-bold transition-colors focus-visible:outline-blaze focus-visible:outline-offset-4";

export default function HomePage() {
  return (
    <>
      <section aria-labelledby="home-title" className="relative overflow-hidden bg-signboard text-signboard-foreground">
        <HeroContours />
        {/* Signboard inset rule */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-2.5 border border-signboard-foreground/30 sm:inset-4" />
        <div className="relative mx-auto max-w-6xl px-6 pb-12 pt-10 sm:pb-14 sm:pt-14">
          <h1 id="home-title" className="text-[2rem] font-bold leading-[1.25] sm:text-6xl">
            香港郊野公園營地
            <span className="block text-blaze">水源、交通與景色一覽</span>
          </h1>
          <p className="mt-6 max-w-[34rem] text-[15px] leading-relaxed text-signboard-foreground/85 sm:text-base">
            整理漁農自然護理署在郊野公園及特別地區設立的 {campsites.length}{" "}
            個指定營地，附水源、營位、交通指引及「編輯評分」，預設按綜合分排序。評分屬本站編輯意見，並非用戶評價；
            <Link
              href="/about#ratings"
              className="font-medium underline decoration-signboard-foreground/50 underline-offset-4 hover:decoration-blaze focus-visible:outline-blaze"
            >
              了解評分方法
            </Link>
            。
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#catalog" className={`${heroLink} bg-blaze text-blaze-foreground hover:bg-blaze/90`}>
              瀏覽 {campsites.length} 個營地
            </a>
            <Link
              href="/map"
              className={`${heroLink} border border-signboard-foreground/50 text-signboard-foreground hover:border-signboard-foreground hover:bg-signboard-foreground/10`}
            >
              地圖總覽
            </Link>
          </div>
        </div>
        <div aria-hidden="true" className="relative h-1.5 bg-blaze" />
      </section>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <CampsiteExplorer campsites={campsites} />
      </div>
    </>
  );
}
