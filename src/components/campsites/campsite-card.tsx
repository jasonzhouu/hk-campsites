import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { CampsiteWithComposite } from "@/data";
import { ACCESS_LABELS, CAPACITY_LABELS, WATER_LABELS } from "@/lib/labels";
import { cn } from "@/lib/utils";
import { CompositeScore } from "@/components/ratings/composite-score";
import { RatingSummary } from "@/components/ratings/rating-panel";

function Facts({ campsite: c }: { campsite: CampsiteWithComposite }) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label="營地特點">
      {c.bookingRequired && (
        <li>
          <Badge variant="blaze">須預約</Badge>
        </li>
      )}
      <li>
        <Badge variant="secondary">水源：{WATER_LABELS[c.water]}</Badge>
      </li>
      <li>
        <Badge variant="secondary">{CAPACITY_LABELS[c.tentCapacity]}</Badge>
      </li>
      {c.access.map((a) => (
        <li key={a}>
          <Badge variant="outline">{ACCESS_LABELS[a]}</Badge>
        </li>
      ))}
    </ul>
  );
}

/**
 * `lead` marks the top result of the current sort (e.g. "綜合分最高"): it gets a wider
 * layout with the intro and a larger score plate so the list has a clear first stop.
 */
export function CampsiteCard({
  campsite: c,
  lead,
}: {
  campsite: CampsiteWithComposite;
  lead?: string;
}) {
  const title = (
    <h2 className={cn("mt-1 font-heading font-bold leading-snug", lead ? "text-2xl sm:text-3xl" : "text-xl")}>
      <Link
        href={`/campsites/${c.slug}`}
        className="after:absolute after:inset-0 after:rounded-md focus-visible:outline-none group-focus-within:underline group-focus-within:decoration-blaze group-focus-within:decoration-2 group-focus-within:underline-offset-4"
      >
        {c.nameZh}
      </Link>
    </h2>
  );

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col rounded-md border bg-card p-4 transition-[border-color,box-shadow] duration-200 ease-out hover:border-primary/60 hover:shadow-[0_2px_8px_oklch(0.3_0.05_160/0.12)] focus-within:border-primary sm:p-5",
        lead ? "border-primary/50 pt-6 sm:pt-7" : "border-border",
      )}
    >
      {lead && (
        <p className="absolute -top-3 left-4 inline-flex h-7 items-center rounded-sm bg-blaze px-3 text-[13px] font-bold text-blaze-foreground sm:left-5">
          {lead}
        </p>
      )}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[13px] text-muted-foreground">
            #{c.id} · {c.parkZh}
          </p>
          {title}
          <p className="text-sm text-muted-foreground" lang="en">
            {c.nameEn}
          </p>
        </div>
        <CompositeScore value={c.composite} size={lead ? "md" : "sm"} className="shrink-0" />
      </div>
      {lead && <p className="mt-3 line-clamp-3 max-w-prose text-[15px] text-foreground/85">{c.introZh}</p>}
      <div className={cn("mt-5", lead && "sm:mt-6")}>
        <RatingSummary ratings={c.ratings} className={lead ? "sm:grid-cols-4" : undefined} />
      </div>
      <div className="mt-5 sm:mt-auto sm:pt-5">
        <Facts campsite={c} />
      </div>
    </article>
  );
}
