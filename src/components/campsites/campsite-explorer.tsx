"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CampsiteWithComposite } from "@/data";
import {
  type CatalogFilters,
  filterCampsites,
  SORT_OPTIONS,
  type SortKey,
  sortCampsites,
} from "@/lib/catalog";
import { RATING_LABELS } from "@/lib/ratings";
import { REGIONS, type Region } from "@/types/campsite";
import { CampsiteCard } from "./campsite-card";

/** Label for the lead card: what the top result is "highest" in. None for A-Z sorts. */
function leadLabel(sort: SortKey): string | undefined {
  if (sort === "name") return undefined;
  if (sort === "composite") return "綜合分最高";
  return `${RATING_LABELS[sort].shortZh}最高`;
}

const DEFAULT_FILTERS: CatalogFilters = { region: "all", park: "all", bookingOnly: false };

export function CampsiteExplorer({ campsites }: { campsites: CampsiteWithComposite[] }) {
  const [filters, setFilters] = useState<CatalogFilters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortKey>("composite");

  const parkOptions = useMemo(() => {
    const scoped =
      filters.region === "all" ? campsites : campsites.filter((c) => c.region === filters.region);
    return Array.from(new Set(scoped.map((c) => c.parkZh)));
  }, [campsites, filters.region]);

  const results = useMemo(
    () => sortCampsites(filterCampsites(campsites, filters), sort),
    [campsites, filters, sort],
  );

  const lead = leadLabel(sort);

  const isFiltered =
    filters.region !== "all" || filters.park !== "all" || filters.bookingOnly;

  return (
    <section id="catalog" aria-labelledby="catalog-heading" className="scroll-mt-20 space-y-5">
      <h2 id="catalog-heading" className="sr-only">
        營地列表
      </h2>
      <div className="grid grid-cols-2 gap-x-3 gap-y-4 rounded-md border border-border bg-card p-4 sm:gap-x-4 lg:grid-cols-[1fr_1.4fr_1.2fr_auto] lg:items-end">
        <div className="grid min-w-0 gap-1.5">
          <Label htmlFor="filter-region">地區</Label>
          <Select
            value={filters.region}
            onValueChange={(v) =>
              setFilters((f) => ({ ...f, region: v as Region | "all", park: "all" }))
            }
          >
            <SelectTrigger id="filter-region" className="h-10 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部地區</SelectItem>
              {REGIONS.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid min-w-0 gap-1.5">
          <Label htmlFor="filter-park">郊野公園</Label>
          <Select
            value={filters.park}
            onValueChange={(v) => setFilters((f) => ({ ...f, park: v }))}
          >
            <SelectTrigger id="filter-park" className="h-10 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部郊野公園</SelectItem>
              {parkOptions.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-2 grid min-w-0 gap-1.5 lg:col-span-1">
          <Label htmlFor="sort">排序</Label>
          <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
            <SelectTrigger id="sort" className="h-10 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <label className="col-span-2 flex min-h-10 cursor-pointer lg:col-span-1 items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            className="size-4 accent-primary"
            checked={filters.bookingOnly}
            onChange={(e) => setFilters((f) => ({ ...f, bookingOnly: e.target.checked }))}
          />
          只顯示須預約營地
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          顯示 {results.length} / {campsites.length} 個營地
        </p>
        {isFiltered && (
          <Button variant="ghost" size="sm" onClick={() => setFilters(DEFAULT_FILTERS)}>
            清除篩選
          </Button>
        )}
      </div>

      {results.length > 0 ? (
        <ul className="grid gap-4 pt-3 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((c, i) => (
            <li key={c.slug} className={i === 0 && lead ? "sm:col-span-2" : undefined}>
              <CampsiteCard campsite={c} lead={i === 0 ? lead : undefined} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-md border border-dashed border-border p-8 text-center text-muted-foreground">
          沒有符合條件的營地，請調整篩選條件。
        </p>
      )}
    </section>
  );
}
