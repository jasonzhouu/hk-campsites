import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { CampsiteWithComposite } from "@/data";
import { ACCESS_LABELS, CAPACITY_LABELS, WATER_LABELS } from "@/lib/labels";
import { formatComposite } from "@/lib/ratings";

export function CampsiteCard({ campsite: c }: { campsite: CampsiteWithComposite }) {
  return (
    <article className="group relative flex h-full flex-col rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/40 focus-within:border-primary/60 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">
            #{c.id} · {c.parkZh}
          </p>
          <h2 className="mt-1 text-lg font-semibold leading-snug">
            <Link
              href={`/campsites/${c.slug}`}
              className="after:absolute after:inset-0 after:rounded-lg focus-visible:outline-none group-focus-within:underline"
            >
              {c.nameZh}
            </Link>
          </h2>
          <p className="text-sm text-muted-foreground" lang="en">
            {c.nameEn}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-2xl font-semibold tabular-nums leading-none">{formatComposite(c.composite)}</p>
          <p className="mt-1 text-xs text-muted-foreground">編輯綜合分</p>
        </div>
      </div>
      <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="營地特點">
        {c.bookingRequired && (
          <li>
            <Badge className="bg-warning text-warning-foreground">須預約</Badge>
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
    </article>
  );
}
