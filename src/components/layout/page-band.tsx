import { cn } from "@/lib/utils";

/** Compact signboard band that opens inner pages: dark green board, amber blaze rule below. */
export function PageBand({
  children,
  narrow = false,
  className,
}: {
  children: React.ReactNode;
  /** Match a max-w-3xl reading column (about page). */
  narrow?: boolean;
  className?: string;
}) {
  return (
    <div className="bg-signboard text-signboard-foreground">
      <div
        className={cn(
          "mx-auto px-4 py-7 sm:px-6 sm:py-10",
          narrow ? "max-w-3xl" : "max-w-6xl",
          className,
        )}
      >
        {children}
      </div>
      <div aria-hidden="true" className="h-1 bg-blaze" />
    </div>
  );
}
