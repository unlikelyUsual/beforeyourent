"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { FictionalStamp } from "@/components/fictional-stamp";
import { ReviewList } from "@/components/review-list";
import { ScoreMeter } from "@/components/score-meter";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { averageForKey, averageOverall, mergeReviews } from "@/lib/review-query";
import { formatScore } from "@/lib/format";
import { RATING_FIELDS } from "@/lib/ratings";
import { useDemoStore } from "@/lib/use-demo-store";
import type { Building, ReviewKind, SampleReview } from "@/lib/types";

const tabs: { id: ReviewKind; label: string }[] = [
  { id: "building", label: "Building" },
  { id: "unit", label: "Units" },
  { id: "owner", label: "Owners & agents" },
];

type BuildingDetailProps = {
  building: Building;
  sampleReviews: SampleReview[];
  initialTab: ReviewKind;
};

/** Building page: facts, three review tabs, and a path into the demo form. */
export function BuildingDetail({ building, sampleReviews, initialTab }: BuildingDetailProps) {
  const store = useDemoStore();
  const [tab, setTab] = useState<ReviewKind>(initialTab);

  const demoReviews = store.reviews.filter((review) => review.buildingSlug === building.slug);
  const merged = useMemo(
    () => mergeReviews(sampleReviews, demoReviews),
    [demoReviews, sampleReviews],
  );
  const buildingLevel = merged.filter((review) => review.kind === "building");
  const score = averageOverall(buildingLevel);

  return (
    <PageShell>
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden />
        All sample buildings
      </Link>

      <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <div>
          <div className="flex flex-wrap gap-2">
            <FictionalStamp />
            {building.illustrativeName ? <FictionalStamp>Illustrative name only</FictionalStamp> : null}
          </div>
          <h1 className="mt-3 font-heading text-4xl tracking-tight">{building.name}</h1>
          <p className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="size-3.5" aria-hidden />
            Sample area: {building.area}
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
            {building.illustrativeName
              ? "The name Life Asoke is only here so the sample has a familiar-style title. This page is not a review of a real building. The address, scores, amenities, unit notes, and personas were invented."
              : "This entire building record was invented for the sample list. It is not a listing and it does not describe a real visit."}
          </p>
          <div className="mt-5 flex flex-wrap items-end gap-4">
            <p>
              <span className="font-heading text-5xl tabular-nums">{formatScore(score)}</span>
              <span className="ml-2 text-sm text-muted-foreground">building score</span>
            </p>
            <p className="pb-1 text-sm text-muted-foreground">
              From {buildingLevel.length} building {buildingLevel.length === 1 ? "note" : "notes"}.
              {demoReviews.length > 0 ? " Includes reviews saved in this browser." : " Sample notes only, until you save one here."}
            </p>
          </div>
          <Button asChild className="mt-5 h-10 px-4">
            <Link href={`/buildings/${building.slug}/review`}>Write a demo review</Link>
          </Button>
        </div>

        <aside className="rounded-2xl border border-border bg-card p-4">
          <h2 className="font-heading text-lg">Invented building facts</h2>
          <dl className="mt-3 grid gap-3 text-sm">
            <div>
              <dt className="text-muted-foreground">Invented address</dt>
              <dd>{building.sampleAddress}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Invented year and floors</dt>
              <dd>
                {building.yearOpenedSample} · {building.floorsSample} floors
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Unit types in the sample</dt>
              <dd>{building.unitTypes.join(", ")}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Invented transit note</dt>
              <dd>{building.transitSample}</dd>
            </div>
          </dl>
          <h3 className="mt-4 text-sm font-medium">Invented amenities</h3>
          <ul className="mt-2 flex flex-wrap gap-2">
            {building.amenities.map((amenity) => (
              <li key={amenity} className="rounded-full bg-secondary px-2.5 py-1 text-xs">
                {amenity}
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <section className="mt-8" aria-labelledby="sample-scores">
        <h2 id="sample-scores" className="font-heading text-2xl">
          Sample score mix
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Averages of the notes currently on this page, including anything you saved in this browser.
        </p>
        <div className="mt-4 grid gap-6 md:grid-cols-3">
          {tabs.map((item) => {
            const group = merged.filter((review) => review.kind === item.id);
            return (
              <div key={item.id} className="rounded-2xl border border-border bg-card p-4">
                <h3 className="font-medium">{item.label}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{group.length} notes</p>
                <div className="mt-3 grid gap-3">
                  {RATING_FIELDS[item.id].map((field) => (
                    <ScoreMeter key={field.key} label={field.label} value={averageForKey(group, field.key)} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-heading text-2xl">Sample notes</h2>
        <Tabs
          value={tab}
          onValueChange={(value) => {
            if (value === "building" || value === "unit" || value === "owner") setTab(value);
          }}
          className="mt-4"
        >
          <TabsList className="!h-auto w-full justify-start">
            {tabs.map((item) => {
              const count = merged.filter((review) => review.kind === item.id).length;
              return (
                <TabsTrigger key={item.id} value={item.id} className="h-auto whitespace-normal px-3 py-2">
                  {item.label}
                  <span className="text-muted-foreground">({count})</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
          {tabs.map((item) => (
            <TabsContent key={item.id} value={item.id}>
              <ReviewList
                kind={item.id}
                reviews={merged}
                unitTypes={building.unitTypes}
                buildingSlug={building.slug}
              />
            </TabsContent>
          ))}
        </Tabs>
      </section>
    </PageShell>
  );
}
