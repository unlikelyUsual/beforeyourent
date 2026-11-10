import { averageOf } from "@/lib/format";
import type { DemoReview, ListedReview, ReviewKind, SampleReview } from "@/lib/types";

export type ReviewSort = "newest" | "highest" | "lowest";

export function toListedSample(review: SampleReview): ListedReview {
  return {
    ...review,
    source: "fictional-sample",
    evidenceChoice: null,
  };
}

export function toListedDemo(review: DemoReview): ListedReview {
  return {
    ...review,
    sampleHelpfulMarks: null,
  };
}

export function mergeReviews(sampleReviews: SampleReview[], demoReviews: DemoReview[]) {
  return [
    ...demoReviews.map(toListedDemo),
    ...sampleReviews.map(toListedSample),
  ];
}

export function averageOverall(reviews: { ratings: Record<string, number> }[]) {
  return averageOf(
    reviews
      .map((review) => review.ratings.overall)
      .filter((value): value is number => typeof value === "number"),
  );
}

export function averageForKey(reviews: { ratings: Record<string, number> }[], key: string) {
  return averageOf(
    reviews
      .map((review) => review.ratings[key])
      .filter((value): value is number => typeof value === "number"),
  );
}

export function filterAndSortReviews(
  reviews: ListedReview[],
  options: {
    kind: ReviewKind;
    minimum: number;
    sort: ReviewSort;
    unitType: string;
  },
) {
  const filtered = reviews.filter((review) => {
    if (review.kind !== options.kind) return false;
    const overall = review.ratings.overall ?? 0;
    if (options.minimum > 0 && overall < options.minimum) return false;
    if (options.kind === "unit" && options.unitType !== "all" && review.unitType !== options.unitType) {
      return false;
    }
    return true;
  });

  return filtered.sort((a, b) => {
    if (options.sort === "newest") return b.createdAt.localeCompare(a.createdAt);
    const difference = (b.ratings.overall ?? 0) - (a.ratings.overall ?? 0);
    if (options.sort === "highest") {
      return difference || b.createdAt.localeCompare(a.createdAt);
    }
    return -difference || b.createdAt.localeCompare(a.createdAt);
  });
}
