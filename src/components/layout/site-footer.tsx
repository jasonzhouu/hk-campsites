import Link from "next/link";
import { site, sources } from "@/lib/site";

const linkClass =
  "break-words underline decoration-signboard-foreground/40 underline-offset-4 transition-colors hover:decoration-blaze hover:text-white focus-visible:outline-blaze";

export function SiteFooter() {
  return (
    <footer className="mt-20 bg-signboard text-signboard-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 text-sm sm:px-6 md:grid-cols-[1.4fr_1fr]">
        <div className="space-y-3">
          <p className="font-heading text-lg font-bold">{site.name}</p>
          <p className="max-w-prose text-signboard-foreground/80">
            {"本站為非官方資訊整理網站，與漁農自然護理署（漁護署）及康樂及文化事務署並無任何關係。" +
              "營地資料整理自漁護署公開資料，可能有所變更；所有分數均為「編輯評分」，屬主觀意見，僅供參考。" +
              "出發前請查閱官方最新公告及天氣資訊。"}
          </p>
          <p>
            <Link href="/about" className={`${linkClass} font-medium`}>
              資料來源及免責聲明
            </Link>
          </p>
        </div>
        <div className="space-y-3">
          <p className="font-heading text-lg font-bold">資料來源</p>
          <ul className="space-y-1">
            {[sources.afcdCampsites, sources.afcdCsv, sources.afcdCampingRules].map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${linkClass} inline-flex min-h-9 items-center text-signboard-foreground/80`}
                >
                  {s.labelZh}
                  <span className="sr-only">（於新分頁開啟）</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
