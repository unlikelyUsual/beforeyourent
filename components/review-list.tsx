"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { EmptyState } from "@/components/empty-state";
import { ReviewCard } from "@/components/review-card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { filterAndSortReviews, type ReviewSort } from "@/lib/review-query";
import type { ListedReview, ReviewKind } from "@/lib/types";

type ReviewListProps = {
  kind: ReviewKind;
  reviews: ListedReview[];
  unitTypes: string[];
  buildingSlug: string;
};

const intro: Record<ReviewKind, string> = {
  building: "Notes about shared spaces, staff, and the stay in general. All of the shipped notes are fictional.",
  unit: "Notes about a unit type, such as a 1-bedroom. Exact unit numbers are left out on purpose.",
  owner:
    "Owner and agent names here are fictional personas. They are not real people, and the notes are not allegations.",
};

/** Filters and sort for one review tab. */
export function ReviewList({ kind, reviews, unitTypes, buildingSlug }: ReviewListProps) {
  const [minimum, setMinimum] = useState("0");
  const [sort, setSort] = useState<ReviewSort>("newest");
  const [unitType, setUnitType] = useState("all");

  const visible = useMemo(
    () =>
      filterAndSortReviews(reviews, {
        kind,
        minimum: Number(minimum),
        sort,
        unitType,
      }),
    [kind, minimum, reviews, sort, unitType],
  );

  const totalForKind = reviews.filter((review) => review.kind === kind).length;

  useEffect(() => {
    const id = window.location.hash.replace("#", "");
    if (!id) return;
    document.getElementById(id)?.scrollIntoView({ block: "center" });
  }, [visible]);

  return (
    <div className="mt-4">
      <p className="text-sm leading-6 text-muted-foreground">{intro[kind]}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="grid gap-1.5">
          <Label htmlFor={`${kind}-minimum`}>Minimum overall</Label>
          <Select value={minimum} onValueChange={setMinimum}>
            <SelectTrigger id={`${kind}-minimum`} className="h-10 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Any score</SelectItem>
              <SelectItem value="3">3 and up</SelectItem>
              <SelectItem value="4">4 and up</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor={`${kind}-sort`}>Sort notes</Label>
          <Select value={sort} onValueChange={(value) => setSort(value as ReviewSort)}>
            <SelectTrigger id={`${kind}-sort`} className="h-10 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="highest">Highest overall</SelectItem>
              <SelectItem value="lowest">Lowest overall</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {kind === "unit" ? (
          <div className="grid gap-1.5">
            <Label htmlFor="unit-type-filter">Unit type</Label>
            <Select value={unitType} onValueChange={setUnitType}>
              <SelectTrigger id="unit-type-filter" className="h-10 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All unit types</SelectItem>
                {unitTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : null}
      </div>

      <p className="mt-3 text-sm text-muted-foreground" aria-live="polite">
        Showing {visible.length} of {totalForKind} {kind === "owner" ? "owner and agent" : kind} notes.
      </p>

      {visible.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            title="No notes match these filters"
            body="Lower the minimum score, choose all unit types, or write a demo review. Shipped notes stay fictional either way."
            action={
              <div className="flex flex-wrap justify-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setMinimum("0");
                    setUnitType("all");
                  }}
                >
                  Reset filters
                </Button>
                <Button asChild>
                  <Link href={`/buildings/${buildingSlug}/review`}>Write a demo review</Link>
                </Button>
              </div>
            }
          />
        </div>
      ) : (
        <ul className="mt-4 grid gap-4">
          {visible.map((review) => (
            <li key={review.id}>
              <ReviewCard review={review} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
