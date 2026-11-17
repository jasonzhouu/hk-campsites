import { cn } from "@/lib/utils";
import type { RatingScores } from "@/types/campsite";
import {
  COMPOSITE_FORMULA_ZH,
  QUIETNESS_NOTE_ZH,
  RATING_DIMENSIONS,
  RATING_LABELS,
  RATING_WEIGHTS,
} from "@/lib/ratings";
import { ScoreMeter } from "./score-meter";

const pct = (n: number) => `${Math.round(n * 100)}%`;

/** Full breakdown used on the detail page. */
export function RatingPanel({ ratings }: { ratings: RatingScores }) {
  return (
    <section aria-labelledby="scores" className="rounded-md border border-border bg-card p-5">
      <h2 id="scores" className="font-heading text-xl font-bold">
        編輯評分
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">本站編輯根據公開資料作出的主觀評估，並非用戶評價。</p>
      <div className="mt-5 space-y-5">
        {RATING_DIMENSIONS.map((d) => (
          <ScoreMeter
            key={d}
            label={`${RATING_LABELS[d].zh}（${pct(RATING_WEIGHTS[d])}）`}
            value={ratings[d]}
            hint={RATING_LABELS[d].hintZh}
          />
        ))}
      </div>
      <div className="mt-5 space-y-2 border-t border-border pt-4 text-[13px] leading-relaxed text-muted-foreground">
        <p>
          <span className="font-medium text-foreground">清靜度怎樣計算？</span>
          {QUIETNESS_NOTE_ZH}
        </p>
        <p>{COMPOSITE_FORMULA_ZH}。</p>
      </div>
    </section>
  );
}

/** Compact four-dimension grid used on list cards. */
export function RatingSummary({
  ratings,
  className,
}: {
  ratings: RatingScores;
  className?: string;
}) {
  return (
    <div
      className={cn("grid grid-cols-2 gap-x-6 gap-y-3", className)}
      aria-label="編輯評分（各維度）"
      role="group"
    >
      {RATING_DIMENSIONS.map((d) => (
        <ScoreMeter
          key={d}
          compact
          label={RATING_LABELS[d].shortZh}
          value={ratings[d]}
        />
      ))}
    </div>
  );
}
