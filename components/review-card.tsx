import { FictionalStamp } from "@/components/fictional-stamp";
import { StarRating } from "@/components/star-rating";
import { TenancyDialog } from "@/components/tenancy-dialog";
import { KIND_LABEL, evidenceLabel } from "@/lib/copy";
import { formatDisplayDate } from "@/lib/format";
import { RATING_FIELDS } from "@/lib/ratings";
import type { ListedReview } from "@/lib/types";

/** One fictional sample or one review saved in this browser. */
export function ReviewCard({ review }: { review: ListedReview }) {
  const fields = RATING_FIELDS[review.kind];
  const savedHere = review.source === "browser-demo";

  return (
    <article id={`review-${review.id}`} className="review-anchor rounded-2xl border border-border bg-card p-4 sm:p-5">
      <div className="flex flex-wrap items-center gap-2">
        {savedHere ? <FictionalStamp>Saved in this browser</FictionalStamp> : <FictionalStamp />}
        <span className="text-xs text-muted-foreground">{KIND_LABEL[review.kind]}</span>
        {review.tenancyMarkedVerified ? <TenancyDialog /> : null}
      </div>

      <h3 className="mt-3 font-heading text-xl text-foreground">{review.title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {savedHere ? review.authorLabel : review.authorLabel}
        {" · "}
        {review.stayLabel}
        {review.unitType ? ` · ${review.unitType}` : ""}
        {review.personaName ? ` · Fictional ${review.personaRole?.toLowerCase()}: ${review.personaName}` : ""}
        {" · "}
        {formatDisplayDate(review.createdAt)}
        {savedHere ? " · entered on this browser" : ""}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <StarRating label="Overall" value={review.ratings.overall ?? 0} />
        <p className="text-sm tabular-nums text-muted-foreground">{(review.ratings.overall ?? 0).toFixed(1)} overall</p>
      </div>

      <dl className="mt-3 grid gap-2 sm:grid-cols-2">
        {fields
          .filter((field) => field.key !== "overall")
          .map((field) => (
            <div key={field.key} className="flex items-baseline justify-between gap-3 text-sm">
              <dt className="text-muted-foreground">{field.label}</dt>
              <dd className="tabular-nums">{review.ratings[field.key] ?? "–"} / 5</dd>
            </div>
          ))}
      </dl>

      <p className="mt-4 text-sm leading-6 text-foreground">{review.body}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <p className="rounded-xl bg-secondary px-3 py-2 text-sm leading-6">
          <span className="font-medium">Pro. </span>
          {review.pros}
        </p>
        <p className="rounded-xl bg-secondary px-3 py-2 text-sm leading-6">
          <span className="font-medium">Con. </span>
          {review.cons}
        </p>
      </div>

      {savedHere ? (
        <p className="mt-4 text-xs leading-5 text-muted-foreground">
          Demo attachment choice: {evidenceLabel(review.evidenceChoice)}. No file was uploaded.
        </p>
      ) : (
        <p className="mt-4 text-xs text-muted-foreground">
          Sample helpful marks: {review.sampleHelpfulMarks ?? 0}. This number was invented with the note.
        </p>
      )}
    </article>
  );
}
