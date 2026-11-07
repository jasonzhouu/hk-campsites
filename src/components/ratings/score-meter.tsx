import { cn } from "@/lib/utils";
import { RATING_MAX } from "@/lib/ratings";

/** Five segment bar. Purely decorative; the numeric value is always shown as text. */
export function ScorePips({ value, className }: { value: number; className?: string }) {
  return (
    <span aria-hidden="true" className={cn("flex gap-0.5", className)}>
      {Array.from({ length: RATING_MAX }, (_, i) => (
        <span
          key={i}
          className={cn(
            "h-2 flex-1 rounded-[2px]",
            i < value ? "bg-primary" : "border border-border bg-muted",
          )}
        />
      ))}
    </span>
  );
}

export function ScoreMeter({
  label,
  value,
  hint,
  compact = false,
}: {
  label: string;
  value: number;
  hint?: string;
  compact?: boolean;
}) {
  const a11y = `${label}：${value} 分（滿分 ${RATING_MAX} 分）`;
  if (compact) {
    return (
      <div className="min-w-0" role="group" aria-label={a11y}>
        <div aria-hidden="true" className="flex items-baseline justify-between gap-1 text-xs">
          <span className="truncate text-muted-foreground">{label}</span>
          <span className="font-medium tabular-nums">{value}</span>
        </div>
        <ScorePips value={value} className="mt-1" />
      </div>
    );
  }
  return (
    <div role="group" aria-label={a11y}>
      <div aria-hidden="true" className="flex items-baseline justify-between gap-3">
        <span className="font-medium">{label}</span>
        <span className="tabular-nums">
          <span className="text-base font-semibold">{value}</span>
          <span className="text-sm text-muted-foreground"> / {RATING_MAX}</span>
        </span>
      </div>
      <ScorePips value={value} className="mt-1.5 max-w-none" />
      {hint && (
        <p aria-hidden="true" className="mt-1 text-xs text-muted-foreground">
          {hint}
        </p>
      )}
    </div>
  );
}
