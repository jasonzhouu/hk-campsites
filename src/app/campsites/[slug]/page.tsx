import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageBand } from "@/components/layout/page-band";
import { CompositeScore } from "@/components/ratings/composite-score";
import { RatingPanel } from "@/components/ratings/rating-panel";
import { Badge } from "@/components/ui/badge";
import { campsites, getCampsiteBySlug } from "@/data";
import { ACCESS_LABELS, CAPACITY_LABELS, MISSING, WATER_LABELS } from "@/lib/labels";
import { googleMapsUrl, osmUrl } from "@/lib/maps";
import { pageMetadata } from "@/lib/metadata";
import { formatComposite } from "@/lib/ratings";
import { site } from "@/lib/site";

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
    imagePath: `/campsites/${c.slug}/opengraph-image`,
    imageAlt: `${c.nameZh}｜${site.name}`,
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
    <section aria-labelledby={id} className="space-y-4">
      <h2 id={id} className="border-b border-border pb-2 font-heading text-xl font-bold">
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
    <article>
      <PageBand>
        <nav aria-label="麵包屑" className="text-sm text-signboard-foreground/80">
          <ol className="flex flex-wrap items-center gap-x-1.5">
            <li>
              <Link
                href="/"
                className="inline-flex min-h-8 items-center underline decoration-signboard-foreground/50 underline-offset-4 hover:text-signboard-foreground hover:decoration-blaze focus-visible:outline-blaze"
              >
                營地
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>{c.region}</li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-signboard-foreground">
              {c.nameZh}
            </li>
          </ol>
        </nav>

        <header className="mt-4 flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
          <div className="min-w-0 space-y-1">
            <p className="text-sm text-signboard-foreground/80">
              漁護署營地 #{c.id} · {c.parkZh}
              <span lang="en" className="hidden sm:inline">
                {" "}
                ({c.parkEn})
              </span>
            </p>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">{c.nameZh}</h1>
            <p className="text-lg text-signboard-foreground/85" lang="en">
              {c.nameEn}
            </p>
          </div>
          <CompositeScore value={c.composite} size="md" className="shrink-0 ring-1 ring-signboard-foreground/30" />
        </header>
      </PageBand>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        {c.bookingRequired && (
          <div role="note" className="mb-8 rounded-md border-2 border-blaze bg-warning px-4 py-4 text-warning-foreground">
            <Badge variant="blaze">須預約</Badge>
            <p className="mt-2 font-semibold">此營地須預約使用</p>
            <p className="mt-1 text-[15px]">{c.bookingNoteZh ?? MISSING}</p>
          </div>
        )}

        <dl className="grid grid-cols-1 divide-y divide-border rounded-md border border-border bg-card sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <div className="flex items-baseline justify-between gap-4 px-4 py-3 sm:block">
            <dt className="text-[13px] text-muted-foreground">水源</dt>
            <dd className="font-heading text-lg font-bold">{WATER_LABELS[c.water]}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4 px-4 py-3 sm:block">
            <dt className="text-[13px] text-muted-foreground">營位</dt>
            <dd className="font-heading text-lg font-bold">{CAPACITY_LABELS[c.tentCapacity]}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4 px-4 py-3 sm:block">
            <dt className="text-[13px] text-muted-foreground">前往方式</dt>
            <dd className="font-heading text-lg font-bold">{c.access.map((a) => ACCESS_LABELS[a]).join("、")}</dd>
          </div>
        </dl>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="min-w-0 space-y-10">
          <Section id="intro" title="簡介">
            <p className="leading-relaxed">{c.introZh}</p>
            <p className="leading-relaxed text-muted-foreground">
              <span className="font-medium text-foreground">景色：</span>
              {c.sceneryNotesZh ?? MISSING}
            </p>
          </Section>

          <Section id="facilities" title="設施">
            <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-[8rem_1fr]">
              <dt className="text-[15px] text-muted-foreground">水源</dt>
              <dd>
                {WATER_LABELS[c.water]}
                <span className="ml-2 text-sm text-muted-foreground">
                  （漁護署：{c.waterZh}）
                </span>
              </dd>
              <dt className="text-[15px] text-muted-foreground">營位</dt>
              <dd>{CAPACITY_LABELS[c.tentCapacity]}</dd>
              <dt className="text-[15px] text-muted-foreground">備註</dt>
              <dd>{c.facilitiesNotesZh ?? MISSING}</dd>
            </dl>
            {c.water === "stream" && (
              <p className="text-sm text-muted-foreground">
                溪澗屬季節性水源，旱季可能乾涸；即使有水亦應煮沸或過濾後才飲用，並自備足夠食水。
              </p>
            )}
          </Section>

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
          <RatingPanel ratings={c.ratings} />

          <section aria-labelledby="official" className="rounded-md border border-border bg-card p-5">
            <h2 id="official" className="font-heading text-xl font-bold">
              官方資料及位置
            </h2>
            <p className="mt-2 text-sm text-muted-foreground tabular-nums">
              座標：{c.lat.toFixed(5)}, {c.lng.toFixed(5)}
            </p>
            <ul className="mt-2 text-sm">
              <li>
                <a
                  href={osmUrl(c.lat, c.lng)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium inline-flex min-h-11 items-center text-primary underline underline-offset-4"
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
                  className="inline-flex min-h-11 items-center text-primary underline underline-offset-4"
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
                  className="font-medium inline-flex min-h-11 items-center text-primary underline underline-offset-4"
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
                  className="inline-flex min-h-11 items-center text-primary underline underline-offset-4"
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
      </div>
    </article>
  );
}
