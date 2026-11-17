"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "營地" },
  { href: "/map", label: "地圖" },
  { href: "/about", label: "關於" },
];

export function SiteNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="主要導覽">
      <ul className="flex shrink-0 items-center sm:gap-1">
        {nav.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/" || pathname.startsWith("/campsites")
              : pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative inline-flex h-11 items-center whitespace-nowrap px-2.5 text-[15px] font-medium transition-colors sm:px-3.5",
                  "after:absolute after:inset-x-2.5 after:bottom-1.5 after:h-0.5 after:origin-left after:scale-x-0 after:bg-blaze after:transition-transform after:duration-200 after:ease-out sm:after:inset-x-3.5",
                  "focus-visible:outline-blaze",
                  active
                    ? "text-signboard-foreground after:scale-x-100"
                    : "text-signboard-foreground/75 hover:text-signboard-foreground hover:after:scale-x-100",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
