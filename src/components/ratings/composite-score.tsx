import { cn } from "@/lib/utils";
import { formatComposite, RATING_MAX } from "@/lib/ratings";

export function CompositeScore({
  value,
  size = "md",
  className,
}: {
  value: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const text = formatComposite(value);
  return (
    <div
      role="group"
      aria-label={`編輯綜合分：${text} 分（滿分 ${RATING_MAX} 分）`}
      className={cn("tabular-nums", className)}
    >
      <p aria-hidden="true" className="leading-none">
        <span
          className={cn(
            "font-semibold tracking-tight",
            size === "sm" && "text-xl",
            size === "md" && "text-2xl",
            size === "lg" && "text-4xl",
          )}
        >
          {text}
        </span>
        <span className="ml-0.5 text-sm text-muted-foreground">/{RATING_MAX}</span>
      </p>
      <p aria-hidden="true" className="mt-1 text-xs text-muted-foreground">
        編輯綜合分
      </p>
    </div>
  );
}
