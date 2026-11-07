import Link from "next/link";
import { site, sources } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-muted/60">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 text-sm sm:px-6 md:grid-cols-[1.4fr_1fr]">
        <div className="space-y-3">
          <p className="font-semibold">{site.name}</p>
          <p className="max-w-prose leading-relaxed text-muted-foreground">
            本站為非官方資訊整理網站，與漁農自然護理署（漁護署）及康樂及文化事務署並無任何關係。
            營地資料整理自漁護署公開資料，可能有所變更；所有分數均為「編輯評分」，屬主觀意見，僅供參考。
            出發前請查閱官方最新公告及天氣資訊。
          </p>
          <p>
            <Link href="/about" className="font-medium text-primary underline underline-offset-4">
              資料來源及免責聲明
            </Link>
          </p>
        </div>
        <div className="space-y-3">
          <p className="font-semibold">資料來源</p>
          <ul className="space-y-2">
            {[sources.afcdCampsites, sources.afcdCsv].map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-words text-muted-foreground underline underline-offset-4 hover:text-foreground"
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
