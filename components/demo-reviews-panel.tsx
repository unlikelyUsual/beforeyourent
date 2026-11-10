"use client";

import { useState } from "react";
import Link from "next/link";
import { EmptyState } from "@/components/empty-state";
import { PageShell } from "@/components/page-shell";
import { ReviewCard } from "@/components/review-card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { clearDemoReviews, removeDemoReview } from "@/lib/demo-storage";
import { getBuilding } from "@/lib/sample-data";
import { toListedDemo } from "@/lib/review-query";
import { useDemoStore } from "@/lib/use-demo-store";

/** Lists demo reviews from localStorage and can reset them. */
export function DemoReviewsPanel() {
  const store = useDemoStore();
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);

  function resetAll() {
    const result = clearDemoReviews();
    setMessage(result.ok ? "Demo reviews on this browser were cleared." : result.message);
    setOpen(false);
  }

  return (
    <PageShell>
      <h1 className="font-heading text-4xl tracking-tight">Your demo reviews</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
        These are reviews you saved from the form. They live in local storage on this browser and nowhere else.
        The fictional sample notes stay on the building pages even after a reset.
      </p>

      {store.status === "unavailable" ? (
        <div className="mt-6">
          <EmptyState
            tone="error"
            title="Local storage is unavailable"
            body="This browser did not allow saving. You can still read the fictional sample notes. Demo reviews cannot be stored until storage works, for example outside a private mode that blocks it."
            action={
              <Button asChild variant="outline">
                <Link href="/">Browse sample buildings</Link>
              </Button>
            }
          />
        </div>
      ) : null}

      {store.status === "unreadable" ? (
        <div className="mt-6">
          <EmptyState
            tone="error"
            title="Saved demo reviews could not be read"
            body="The data under this site’s local storage key is not in the expected shape. Resetting removes that data from this browser."
            action={
              <Button type="button" variant="destructive" onClick={resetAll}>
                Reset unreadable demo data
              </Button>
            }
          />
        </div>
      ) : null}

      {store.status === "ready" && store.reviews.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="No demo reviews on this browser yet"
            body="Open a sample building and use Write a demo review. Life Asoke is the fullest example. After you save, the review shows up here and on that building’s tab."
            action={
              <Button asChild className="h-10">
                <Link href="/buildings/life-asoke/review">Write a Life Asoke demo review</Link>
              </Button>
            }
          />
        </div>
      ) : null}

      {store.status === "ready" && store.reviews.length > 0 ? (
        <div className="mt-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {store.reviews.length} saved in this browser
            </p>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button type="button" variant="outline">
                  Reset all demo reviews
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reset demo reviews?</DialogTitle>
                  <DialogDescription>
                    This removes every review you saved in this browser. Fictional sample notes on the building pages
                    stay as they are. Nothing is sent to a server, because nothing was stored on one.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Keep them
                  </Button>
                  <Button type="button" variant="destructive" onClick={resetAll}>
                    Reset all
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <ul className="mt-4 grid gap-4">
            {store.reviews.map((review) => {
              const building = getBuilding(review.buildingSlug);
              return (
                <li key={review.id} className="grid gap-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Link
                      href={`/buildings/${review.buildingSlug}?tab=${review.kind}#review-${review.id}`}
                      className="text-sm underline-offset-4 hover:underline"
                    >
                      {building?.name ?? "Sample building no longer in the list"}
                    </Link>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const result = removeDemoReview(review.id);
                        setMessage(result.ok ? "Removed that demo review from this browser." : result.message);
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                  <ReviewCard review={toListedDemo(review)} />
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      {message ? (
        <p className="mt-4 text-sm" role="status">
          {message}
        </p>
      ) : null}
    </PageShell>
  );
}
