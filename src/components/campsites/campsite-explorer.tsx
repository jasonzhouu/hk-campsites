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
import { REGIONS, type Region } from "@/types/campsite";
import { CampsiteCard } from "./campsite-card";

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

  const isFiltered =
    filters.region !== "all" || filters.park !== "all" || filters.bookingOnly;

  return (
    <section aria-labelledby="catalog-heading" className="space-y-5">
      <h2 id="catalog-heading" className="sr-only">
        營地列表
      </h2>
      <div className="grid gap-4 rounded-lg border border-border bg-card p-4 sm:grid-cols-2 lg:grid-cols-[1fr_1.4fr_1.2fr_auto] lg:items-end">
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
        <div className="grid min-w-0 gap-1.5">
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
        <label className="flex h-10 cursor-pointer items-center gap-2 text-sm font-medium">
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
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((c) => (
            <li key={c.slug}>
              <CampsiteCard campsite={c} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
          沒有符合條件的營地，請調整篩選條件。
        </p>
      )}
    </section>
  );
}
