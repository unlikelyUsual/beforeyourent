"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { BuildingCard } from "@/components/building-card";
import { EmptyState } from "@/components/empty-state";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { averageOverall } from "@/lib/review-query";
import { useDemoStore } from "@/lib/use-demo-store";
import type { Building, SampleReview } from "@/lib/types";

type SortKey = "name" | "score" | "count";

type BuildingExplorerProps = {
  buildings: Building[];
  sampleReviews: SampleReview[];
  areas: string[];
};

/** Search, neighborhood filter, and sort for the sample building list. */
export function BuildingExplorer({ buildings, sampleReviews, areas }: BuildingExplorerProps) {
  const store = useDemoStore();
  const [query, setQuery] = useState("");
  const [area, setArea] = useState("all");
  const [sort, setSort] = useState<SortKey>("name");

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const next = buildings
      .filter((building) => (area === "all" ? true : building.area === area))
      .filter((building) => {
        if (!needle) return true;
        const haystack = `${building.name} ${building.area} ${building.sampleSummary}`.toLowerCase();
        return haystack.includes(needle);
      })
      .map((building) => {
        const samples = sampleReviews.filter((review) => review.buildingSlug === building.slug);
        const demos = store.reviews.filter((review) => review.buildingSlug === building.slug);
        const buildingLevel = [...samples, ...demos].filter((review) => review.kind === "building");
        return {
          building,
          score: averageOverall(buildingLevel),
          sampleCount: samples.length,
          demoCount: demos.length,
        };
      });

    next.sort((a, b) => {
      if (sort === "name") return a.building.name.localeCompare(b.building.name);
      if (sort === "count") return b.sampleCount + b.demoCount - (a.sampleCount + a.demoCount);
      return (b.score ?? -1) - (a.score ?? -1) || a.building.name.localeCompare(b.building.name);
    });
    return next;
  }, [area, buildings, query, sampleReviews, sort, store.reviews]);

  const filtersActive = query.trim().length > 0 || area !== "all" || sort !== "name";

  return (
    <PageShell>
      <section className="hero-wash rounded-3xl border border-border px-5 py-8 sm:px-8 sm:py-10">
        <p className="text-sm font-medium text-primary">Sample rental research</p>
        <h1 className="mt-2 max-w-2xl font-heading text-4xl tracking-tight text-foreground sm:text-5xl">
          Read the building before the lease.
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
          Search the sample set, open a building, and read separate notes for the building, a unit type, and a
          fictional owner or agent. Start with the Life Asoke page if you want the fullest example.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button asChild className="h-10 px-4">
            <Link href="/buildings/life-asoke">Open the Life Asoke sample</Link>
          </Button>
          <Button asChild variant="outline" className="h-10 px-4">
            <Link href="/how-this-demo-works">What is real in this demo</Link>
          </Button>
        </div>
      </section>

      <form
        className="mt-6 grid gap-3 rounded-2xl border border-border bg-card p-4 sm:grid-cols-[1fr_12rem_12rem_auto] sm:items-end"
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          document.getElementById("building-results")?.focus();
        }}
      >
        <div className="grid gap-1.5">
          <Label htmlFor="building-search">Search sample buildings</Label>
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="building-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Try Life Asoke, Ari, or pool"
              className="h-10 pl-8"
              type="search"
            />
          </div>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="area-filter">Sample area</Label>
          <Select value={area} onValueChange={setArea}>
            <SelectTrigger id="area-filter" className="h-10 w-full">
              <SelectValue placeholder="All sample areas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All sample areas</SelectItem>
              {areas.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="sort-buildings">Sort</Label>
          <Select value={sort} onValueChange={(value) => setSort(value as SortKey)}>
            <SelectTrigger id="sort-buildings" className="h-10 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="score">Highest building score</SelectItem>
              <SelectItem value="count">Most notes</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" className="h-10">
          Search
        </Button>
      </form>

      {store.status === "unavailable" ? (
        <p className="mt-4 text-sm text-muted-foreground" role="status">
          This browser did not allow local storage. You can still browse the fictional samples. A demo review
          cannot be saved until storage is available.
        </p>
      ) : null}
      {store.status === "unreadable" ? (
        <p className="mt-4 text-sm text-destructive" role="alert">
          Demo reviews saved in this browser could not be read. Use Your demo reviews to reset them.
        </p>
      ) : null}

      <div className="mt-5 flex items-center justify-between gap-3">
        <h2 id="building-results" tabIndex={-1} className="font-heading text-2xl outline-none">
          {rows.length} sample {rows.length === 1 ? "building" : "buildings"}
        </h2>
        {filtersActive ? (
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setQuery("");
              setArea("all");
              setSort("name");
            }}
          >
            Clear search
          </Button>
        ) : null}
      </div>

      {rows.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            title="No sample building matches"
            body="Try a shorter word, or clear the search. The list only includes the invented buildings shipped with this prototype. Searching for zzzz is a reliable way to see this empty state."
            action={
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setQuery("");
                  setArea("all");
                }}
              >
                Clear search
              </Button>
            }
          />
        </div>
      ) : (
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((row) => (
            <li key={row.building.slug}>
              <BuildingCard
                building={row.building}
                score={row.score}
                sampleCount={row.sampleCount}
                demoCount={row.demoCount}
              />
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}
