import Link from "next/link";
import { site } from "@/lib/site";
import { SiteNav } from "./site-nav";

/** Trail waymarker: a tent on a post-cap, drawn in the trail-blaze colour. */
function TentMark() {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className="size-7 shrink-0 text-blaze"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      <path d="M3 26 16 6l13 20Z" />
      <path d="M16 6v20M12 26l4-7 4 7" />
    </svg>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-signboard text-signboard-foreground">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-3 sm:gap-4 sm:px-6">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2.5 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blaze"
        >
          <TentMark />
          <span className="truncate font-heading text-base font-bold sm:text-lg">{site.name}</span>
        </Link>
        <SiteNav />
      </div>
    </header>
  );
}
