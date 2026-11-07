import type { RatingScores } from "@/types/campsite";
import {
  COMPOSITE_FORMULA_ZH,
  QUIETNESS_NOTE_ZH,
  RATING_DIMENSIONS,
  RATING_LABELS,
  RATING_WEIGHTS,
} from "@/lib/ratings";
import { CompositeScore } from "./composite-score";
import { ScoreMeter } from "./score-meter";

const pct = (n: number) => `${Math.round(n * 100)}%`;

/** Full breakdown used on the detail page. */
export function RatingPanel({ ratings, composite }: { ratings: RatingScores; composite: number }) {
  return (
    <section aria-labelledby="scores" className="rounded-lg border border-border bg-card p-5">
      <h2 id="scores" className="text-lg font-semibold">
        編輯評分
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">本站編輯根據公開資料作出的主觀評估，並非用戶評價。</p>
      <CompositeScore value={composite} size="lg" className="mt-4" />
      <div className="mt-5 space-y-4">
        {RATING_DIMENSIONS.map((d) => (
          <ScoreMeter
            key={d}
            label={`${RATING_LABELS[d].zh}（${pct(RATING_WEIGHTS[d])}）`}
            value={ratings[d]}
            hint={RATING_LABELS[d].hintZh}
          />
        ))}
      </div>
      <div className="mt-5 space-y-2 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
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
export function RatingSummary({ ratings }: { ratings: RatingScores }) {
  return (
    <div className="grid grid-cols-4 gap-2" aria-label="編輯評分（各維度）" role="group">
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
