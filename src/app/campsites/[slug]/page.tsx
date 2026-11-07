import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RatingPanel } from "@/components/ratings/rating-panel";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { campsites, getCampsiteBySlug } from "@/data";
import { ACCESS_LABELS, CAPACITY_LABELS, MISSING, WATER_LABELS } from "@/lib/labels";
import { googleMapsUrl, osmUrl } from "@/lib/maps";
import { pageMetadata } from "@/lib/metadata";
import { formatComposite } from "@/lib/ratings";

export function generateStaticParams() {
  return campsites.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/campsites/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = getCampsiteBySlug(slug);
  if (!c) return { title: "找不到營地" };
  return pageMetadata({
    title: `${c.nameZh}（${c.nameEn}）`,
    description: `${c.introZh}編輯綜合分 ${formatComposite(c.composite)} / 5。`,
    path: `/campsites/${c.slug}`,
  });
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="space-y-3">
      <h2 id={id} className="text-lg font-semibold">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default async function CampsitePage({ params }: PageProps<"/campsites/[slug]">) {
  const { slug } = await params;
  const c = getCampsiteBySlug(slug);
  if (!c) notFound();

  return (
    <article className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <nav aria-label="麵包屑" className="text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="underline underline-offset-4 hover:text-foreground">
              營地
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>{c.region}</li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-foreground">
            {c.nameZh}
          </li>
        </ol>
      </nav>

      <header className="mt-5 space-y-2">
        <p className="text-sm text-muted-foreground">
          漁護署營地 #{c.id} · {c.parkZh}
          <span lang="en" className="hidden sm:inline">
            {" "}
            ({c.parkEn})
          </span>
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{c.nameZh}</h1>
        <p className="text-lg text-muted-foreground" lang="en">
          {c.nameEn}
        </p>
      </header>

      {c.bookingRequired && (
        <div
          role="note"
          className="mt-6 rounded-lg border border-warning-foreground/30 bg-warning px-4 py-3 text-sm text-warning-foreground"
        >
          <p className="font-semibold">此營地須預約使用</p>
          <p className="mt-1">{c.bookingNoteZh ?? MISSING}</p>
        </div>
      )}

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 space-y-8">
          <Section id="intro" title="簡介">
            <p className="leading-relaxed">{c.introZh}</p>
            <p className="leading-relaxed text-muted-foreground">
              <span className="font-medium text-foreground">景色：</span>
              {c.sceneryNotesZh ?? MISSING}
            </p>
          </Section>

          <Separator />

          <Section id="facilities" title="設施">
            <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-[8rem_1fr]">
              <dt className="text-sm text-muted-foreground">水源</dt>
              <dd>
                {WATER_LABELS[c.water]}
                <span className="ml-2 text-sm text-muted-foreground">
                  （漁護署：{c.waterZh}）
                </span>
              </dd>
              <dt className="text-sm text-muted-foreground">營位</dt>
              <dd>{CAPACITY_LABELS[c.tentCapacity]}</dd>
              <dt className="text-sm text-muted-foreground">備註</dt>
              <dd>{c.facilitiesNotesZh ?? MISSING}</dd>
            </dl>
            {c.water === "stream" && (
              <p className="text-sm text-muted-foreground">
                溪澗屬季節性水源，旱季可能乾涸；即使有水亦應煮沸或過濾後才飲用，並自備足夠食水。
              </p>
            )}
          </Section>

          <Separator />

          <Section id="transport" title="交通指引">
            <ul className="flex flex-wrap gap-1.5" aria-label="前往方式">
              {c.access.map((a) => (
                <li key={a}>
                  <Badge variant="outline">{ACCESS_LABELS[a]}</Badge>
                </li>
              ))}
            </ul>
            <p className="leading-relaxed">{c.transportZh}</p>
            <p className="text-sm text-muted-foreground">
              交通路線及班次或有變動，出發前請查閱運輸署、相關營辦商及漁護署的最新資料，並預留充足回程時間。
            </p>
          </Section>
        </div>

        <aside className="min-w-0 space-y-6">
          <RatingPanel ratings={c.ratings} composite={c.composite} />

          <section aria-labelledby="official" className="rounded-lg border border-border bg-card p-5">
            <h2 id="official" className="text-lg font-semibold">
              官方資料及位置
            </h2>
            <p className="mt-2 text-sm text-muted-foreground tabular-nums">
              座標：{c.lat.toFixed(5)}, {c.lng.toFixed(5)}
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a
                  href={osmUrl(c.lat, c.lng)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary underline underline-offset-4"
                >
                  在 OpenStreetMap 查看位置
                  <span className="sr-only">（於新分頁開啟）</span>
                </a>
              </li>
              <li>
                <a
                  href={googleMapsUrl(c.lat, c.lng)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  在 Google 地圖查看位置
                  <span className="sr-only">（於新分頁開啟）</span>
                </a>
              </li>
              <li>
                <a
                  href={c.afcdUrlZh}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary underline underline-offset-4"
                >
                  漁護署營地頁面（中文）
                  <span className="sr-only">（於新分頁開啟）</span>
                </a>
              </li>
              <li>
                <a
                  href={c.afcdUrlEn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                  lang="en"
                >
                  AFCD campsite page (English)
                  <span className="sr-only">（於新分頁開啟）</span>
                </a>
              </li>
            </ul>
          </section>
        </aside>
      </div>
    </article>
  );
}
