import { cn } from "@/lib/utils";
import { formatComposite, RATING_MAX } from "@/lib/ratings";

const sizes = {
  sm: { inner: "px-2.5 py-1.5", num: "text-2xl" },
  md: { inner: "px-3.5 py-2", num: "text-3xl" },
  lg: { inner: "px-5 py-3", num: "text-5xl" },
} as const;

/**
 * Signboard plate: dark green board, white inset rule, the score in trail-blaze amber.
 * The visible text is hidden from assistive tech in favour of one complete label.
 */
export function CompositeScore({
  value,
  size = "md",
  className,
}: {
  value: number;
  size?: keyof typeof sizes;
  className?: string;
}) {
  const text = formatComposite(value);
  const s = sizes[size];
  return (
    <div
      role="group"
      aria-label={`編輯綜合分：${text} 分（滿分 ${RATING_MAX} 分）`}
      className={cn(
        "inline-block rounded-md bg-signboard p-[3px] text-signboard-foreground shadow-[0_1px_2px_oklch(0.2_0.04_160/0.25)]",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className={cn("rounded-[4px] border border-signboard-foreground/45 text-center tabular-nums", s.inner)}
      >
        <p className="leading-none">
          <span className={cn("font-heading font-bold text-blaze", s.num)}>{text}</span>
          <span className="ml-0.5 text-sm text-signboard-foreground/75">/{RATING_MAX}</span>
        </p>
        <p className="mt-1.5 text-xs leading-none text-signboard-foreground/85">編輯綜合分</p>
      </div>
    </div>
  );
}
