import Link from "next/link";
import { site } from "@/lib/site";

const nav = [
  { href: "/", label: "營地" },
  { href: "/map", label: "地圖" },
  { href: "/about", label: "關於" },
];

function TentMark() {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className="size-7 shrink-0 text-primary"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
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
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-3 sm:gap-4 sm:px-6">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <TentMark />
          <span className="truncate text-[15px] font-semibold tracking-tight sm:text-lg">
            {site.name}
          </span>
        </Link>
        <nav aria-label="主要導覽">
          <ul className="flex shrink-0 items-center sm:gap-1">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex h-10 items-center whitespace-nowrap rounded-md px-2.5 text-sm sm:px-3 font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
