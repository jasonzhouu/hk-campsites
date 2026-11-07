import type { Metadata } from "next";
import Link from "next/link";
import { campsites } from "@/data";
import {
  COMPOSITE_FORMULA_ZH,
  QUIETNESS_NOTE_ZH,
  RATING_DIMENSIONS,
  RATING_LABELS,
  RATING_WEIGHTS,
} from "@/lib/ratings";
import { site, sources } from "@/lib/site";

export const metadata: Metadata = {
  title: "關於本站、資料來源及露營守則",
  description:
    "本站資料來源（漁護署、康文署、青年網站）、編輯評分方法、露營守則提示及免責聲明。本站並非政府官方網站。",
};

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="break-words font-medium text-primary underline underline-offset-4"
    >
      {children}
      <span className="sr-only">（於新分頁開啟）</span>
    </a>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-20 space-y-3">
      <h2 id={`${id}-title`} className="text-xl font-semibold">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-4xl">關於{site.name}</h1>
        <p className="leading-relaxed text-muted-foreground">
          本站把漁農自然護理署（漁護署）在郊野公園及特別地區設立的 {campsites.length}{" "}
          個指定露營地點整理成易讀的列表，方便比較水源、營位、交通及景色。</p>
      </header>

      <div
        role="note"
        className="mt-8 rounded-lg border border-warning-foreground/30 bg-warning px-4 py-4 text-sm leading-relaxed text-warning-foreground"
      >
        <p className="font-semibold">免責聲明</p>
        <p className="mt-1">
          本站為非官方的資訊整理網站，<strong>並非政府網站</strong>，與漁農自然護理署（漁護署）及康樂及文化事務署（康文署）並無任何關係。營地資料整理自漁護署公開資料，<strong>可能已經過時或有所變更</strong>；評分為編輯主觀意見，僅供參考。出發前請查閱漁護署最新公告、天氣及交通資訊，並遵守《郊野公園及特別地區規例》及露營守則。如本站內容與官方資料有出入，一概以官方資料為準。</p>
      </div>

      <div className="mt-10 space-y-10">
        <Section id="sources" title="資料來源">
          <ul className="list-disc space-y-3 pl-5 leading-relaxed">
            <li>
              <ExternalLink href={sources.afcdCampsites.url}>{sources.afcdCampsites.labelZh}</ExternalLink>
              ：營地名稱、所屬郊野公園及各營地官方頁面。</li>
            <li>
              <ExternalLink href={sources.afcdCsv.url}>{sources.afcdCsv.labelZh}</ExternalLink>
              ：座標、水源及營位數目。</li>
            <li>
              <ExternalLink href={sources.afcdWater.url}>{sources.afcdWater.labelZh}</ExternalLink>
              ：各營地最新水源情況，旱季出發前尤其應查閱。</li>
            <li>
              <ExternalLink href={sources.lcsd.url}>{sources.lcsd.labelZh}</ExternalLink>
              ：康文署管理的度假營及營地屬另一類設施，須另行申請，並<strong>不包括</strong>在本站的漁護署營地目錄內，只作參考。</li>
            <li>
              <ExternalLink href={sources.youth.url}>{sources.youth.labelZh}</ExternalLink>
              ：政府為青年人整理的文娛及戶外活動資訊，可作延伸參考。</li>
          </ul>
          <p className="text-sm leading-relaxed text-muted-foreground">
            每個營地的簡介、交通指引及評分由本站編輯撰寫。交通路線及班次可能變動，請以運輸署及營辦商最新資料為準。地圖連結使用免費的 OpenStreetMap 及 Google 地圖，本站不使用任何付費地圖服務。</p>
        </Section>

        <Section id="ratings" title="編輯評分方法">
          <p className="leading-relaxed">
            所有分數均為「編輯評分」，由本站編輯根據公開資料（水源、營位、位置、交通方式）作出主觀評估，<strong>並非用戶評價</strong>。每個維度為 1 至 5 分，分數越高越好。</p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[20rem] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th scope="col" className="py-2 pr-4 font-semibold">維度</th>
                  <th scope="col" className="py-2 pr-4 font-semibold">權重</th>
                  <th scope="col" className="py-2 font-semibold">考慮因素</th>
                </tr>
              </thead>
              <tbody>
                {RATING_DIMENSIONS.map((d) => (
                  <tr key={d} className="border-b border-border">
                    <th scope="row" className="py-2 pr-4 font-medium">{RATING_LABELS[d].zh}</th>
                    <td className="py-2 pr-4 tabular-nums">{Math.round(RATING_WEIGHTS[d] * 100)}%</td>
                    <td className="py-2 text-muted-foreground">{RATING_LABELS[d].hintZh}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="leading-relaxed">{COMPOSITE_FORMULA_ZH}。</p>
          <p className="rounded-lg border border-border bg-card px-4 py-3 leading-relaxed">
            <span className="font-semibold">清靜度慣例：</span>
            {QUIETNESS_NOTE_ZH}
          </p>
        </Section>

        <Section id="rules" title="露營守則提示">
          <ul className="list-disc space-y-2 pl-5 leading-relaxed">
            <li>只可在漁護署指定露營地點露營。</li>
            <li>只可在指定地點生火，離開前徹底熄滅所有火種；山火危險警告生效期間切勿生火。</li>
            <li>自備足夠食水；溪澗水源屬季節性，飲用前必須煮沸或過濾。</li>
            <li>「自己垃圾自己帶走」，保持營地清潔，切勿餵飼野生動物。</li>
            <li>部分營地（例如荃錦營地）須預約使用，請先查閱官方安排。</li>
            <li>留意天氣警告；颱風、暴雨或酷熱天氣下應取消行程。</li>
          </ul>
          <p className="leading-relaxed">
            以上只屬摘要，詳細守則及相關法例請參閱{" "}
            <ExternalLink href={sources.afcdCampingRules.url}>{sources.afcdCampingRules.labelZh}</ExternalLink>
            {" "}及{" "}
            <ExternalLink href={sources.afcdCamperGuide.url}>{sources.afcdCamperGuide.labelZh}</ExternalLink>
            。</p>
        </Section>

        <Section id="contact" title="更正資料">
          <p className="leading-relaxed">
            本站為開源項目。如發現資料錯誤，歡迎到{" "}
            <ExternalLink href="https://github.com/jasonzhouu/hk-campsites/issues">GitHub</ExternalLink>{" "}
            提出。返回{" "}
            <Link href="/" className="font-medium text-primary underline underline-offset-4">
              營地列表
            </Link>
            。</p>
        </Section>
      </div>
    </div>
  );
}
