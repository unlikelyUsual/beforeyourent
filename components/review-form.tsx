"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { ReviewCard } from "@/components/review-card";
import { StarRating } from "@/components/star-rating";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EVIDENCE_OPTIONS, KIND_LABEL, TENANCY_BODY, TENANCY_TITLE } from "@/lib/copy";
import { STAY_OPTIONS } from "@/lib/copy";
import { saveDemoReview } from "@/lib/demo-storage";
import { RATING_FIELDS } from "@/lib/ratings";
import { toListedDemo } from "@/lib/review-query";
import { issuesForStep, type ReviewDraft } from "@/lib/validate-review";
import type { Building, DemoReview, EvidenceChoice, ReviewKind } from "@/lib/types";

const steps = ["About the stay", "Scores", "Written notes", "Demo extras", "Check and save"];

function freshDraft(): ReviewDraft {
  return {
    kind: "building",
    authorLabel: "",
    stayLabel: STAY_OPTIONS[0],
    unitType: "",
    personaName: "",
    personaRole: "Agent",
    ratings: {},
    title: "",
    body: "",
    pros: "",
    cons: "",
    tenancyMarkedVerified: false,
    evidenceChoice: "none",
    acknowledged: false,
  };
}

function pickedRatings(draft: ReviewDraft) {
  const ratings: Record<string, number> = {};
  for (const field of RATING_FIELDS[draft.kind]) {
    ratings[field.key] = draft.ratings[field.key] ?? 0;
  }
  return ratings;
}

/** Multi-step demo review. The saved result never leaves this browser. */
export function ReviewForm({ building }: { building: Building }) {
  const [draft, setDraft] = useState<ReviewDraft>(freshDraft);
  const [step, setStep] = useState(0);
  const [issues, setIssues] = useState<string[]>([]);
  const [saved, setSaved] = useState<DemoReview | null>(null);
  const [saveError, setSaveError] = useState("");
  const [previewName, setPreviewName] = useState<string | null>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    document.getElementById("review-flow")?.scrollIntoView({ block: "start" });
  }, [step, saved]);

  function update(patch: Partial<ReviewDraft>) {
    setDraft((current) => ({ ...current, ...patch }));
  }

  function goNext() {
    const nextIssues = issuesForStep(draft, step);
    setIssues(nextIssues);
    if (nextIssues.length === 0) setStep((current) => Math.min(current + 1, steps.length - 1));
  }

  function save() {
    const nextIssues = issuesForStep(draft, 4);
    setIssues(nextIssues);
    setSaveError("");
    if (nextIssues.length > 0) return;

    const review: DemoReview = {
      id: `demo-${crypto.randomUUID()}`,
      buildingSlug: building.slug,
      kind: draft.kind,
      authorLabel: draft.authorLabel.trim(),
      stayLabel: draft.stayLabel,
      unitType: draft.kind === "unit" ? draft.unitType : null,
      personaName: draft.kind === "owner" ? draft.personaName.trim() : null,
      personaRole: draft.kind === "owner" ? draft.personaRole : null,
      ratings: pickedRatings(draft),
      title: draft.title.trim(),
      body: draft.body.trim(),
      pros: draft.pros.trim(),
      cons: draft.cons.trim(),
      tenancyMarkedVerified: draft.tenancyMarkedVerified,
      evidenceChoice: draft.evidenceChoice,
      createdAt: new Date().toISOString(),
      source: "browser-demo",
    };

    const result = saveDemoReview(review);
    if (!result.ok) {
      setSaveError(result.message);
      return;
    }
    setSaved(review);
  }

  if (saved) {
    return (
      <PageShell>
        <div id="review-flow" className="mx-auto max-w-2xl">
          <div className="rounded-3xl border border-border bg-card px-5 py-8 sm:px-8">
            <span className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground">
              <Check aria-hidden />
            </span>
            <h1 className="mt-4 font-heading text-3xl">Saved in this browser only</h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              The demo review for {building.name} is in local storage on this computer. It was not uploaded, emailed,
              or checked. Refreshing the page keeps it. Clearing site data, or the reset button under Your demo
              reviews, removes it.
            </p>
            {previewName ? (
              <p className="mt-3 text-sm text-muted-foreground">
                You previewed the filename “{previewName}” on the previous step. That name was not saved.
              </p>
            ) : null}
            <div className="mt-5 flex flex-wrap gap-2">
              <Button asChild className="h-10">
                <Link href={`/buildings/${building.slug}?tab=${saved.kind}#review-${saved.id}`}>
                  See it on the building page
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-10">
                <Link href="/demo-reviews">Your demo reviews</Link>
              </Button>
            </div>
          </div>
          <div className="mt-6">
            <ReviewCard review={toListedDemo(saved)} />
          </div>
          <Button
            type="button"
            variant="ghost"
            className="mt-4"
            onClick={() => {
              setSaved(null);
              setDraft(freshDraft());
              setStep(0);
              setPreviewName(null);
              setIssues([]);
            }}
          >
            Write another demo review
          </Button>
        </div>
      </PageShell>
    );
  }

  const listedPreview: DemoReview = {
    id: "preview",
    buildingSlug: building.slug,
    kind: draft.kind,
    authorLabel: draft.authorLabel.trim() || "Your nickname",
    stayLabel: draft.stayLabel,
    unitType: draft.kind === "unit" ? draft.unitType || null : null,
    personaName: draft.kind === "owner" ? draft.personaName.trim() || null : null,
    personaRole: draft.kind === "owner" ? draft.personaRole : null,
    ratings: pickedRatings(draft),
    title: draft.title.trim() || "Untitled demo",
    body: draft.body.trim() || "Your note will appear here.",
    pros: draft.pros.trim() || "Pro",
    cons: draft.cons.trim() || "Con",
    tenancyMarkedVerified: draft.tenancyMarkedVerified,
    evidenceChoice: draft.evidenceChoice,
    createdAt: new Date().toISOString(),
    source: "browser-demo",
  };

  return (
    <PageShell>
      <form
        id="review-flow"
        className="mx-auto max-w-2xl"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          if (step < steps.length - 1) goNext();
          else save();
        }}
      >
        <p className="text-sm text-muted-foreground">
          <Link href={`/buildings/${building.slug}`} className="underline-offset-4 hover:underline">
            {building.name}
          </Link>
          {" · fictional sample page"}
        </p>
        <h1 className="mt-2 font-heading text-3xl tracking-tight">Write a demo review</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Five short steps. The result stays in this browser. Do not include an exact unit number or a real
          person’s name.
        </p>

        <ol className="mt-5 flex flex-wrap gap-2" aria-label="Progress">
          {steps.map((label, index) => (
            <li
              key={label}
              aria-current={index === step ? "step" : undefined}
              className={
                index === step
                  ? "rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground"
                  : "rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground"
              }
            >
              {index + 1}. {label}
            </li>
          ))}
        </ol>

        <div className="mt-5 rounded-2xl border border-border bg-card p-4 sm:p-6">
          {step === 0 ? <AboutStep building={building} draft={draft} update={update} /> : null}
          {step === 1 ? <ScoreStep draft={draft} update={update} /> : null}
          {step === 2 ? <NotesStep draft={draft} update={update} /> : null}
          {step === 3 ? (
            <ExtrasStep
              draft={draft}
              update={update}
              previewName={previewName}
              onPreviewName={setPreviewName}
            />
          ) : null}
          {step === 4 ? (
            <div className="grid gap-4">
              <h2 className="font-heading text-xl">Check the demo review</h2>
              <p className="text-sm leading-6 text-muted-foreground">
                This is how the card will look. It will be labeled as saved in this browser, on the {building.name}{" "}
                sample page.
              </p>
              <ReviewCard review={toListedDemo(listedPreview)} />
              {previewName ? (
                <p className="text-sm text-muted-foreground">
                  Filename preview “{previewName}” stays on this page only and will not be stored.
                </p>
              ) : null}
              <label className="flex items-start gap-2 text-sm leading-6">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={draft.acknowledged}
                  onChange={(event) => update({ acknowledged: event.target.checked })}
                />
                <span>I understand this demo review stays in this browser and is not sent anywhere.</span>
              </label>
            </div>
          ) : null}

          {issues.length > 0 ? (
            <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-3" role="alert">
              <p className="text-sm font-medium">Please fix this before continuing</p>
              <ul className="mt-1 list-disc pl-5 text-sm leading-6">
                {issues.map((issue) => (
                  <li key={issue}>{issue}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {saveError ? (
            <p className="mt-4 text-sm text-destructive" role="alert">
              {saveError}
            </p>
          ) : null}
        </div>

        <div className="sticky bottom-0 mt-4 flex gap-2 border-t border-border bg-background/95 py-3 backdrop-blur">
          {step > 0 ? (
            <Button
              type="button"
              variant="outline"
              className="h-10"
              onClick={() => {
                setIssues([]);
                setStep((current) => current - 1);
              }}
            >
              Back
            </Button>
          ) : (
            <Button asChild variant="outline" className="h-10">
              <Link href={`/buildings/${building.slug}`}>Cancel</Link>
            </Button>
          )}
          <Button type="submit" className="h-10">
            {step === steps.length - 1 ? "Save on this browser" : "Continue"}
          </Button>
        </div>
      </form>
    </PageShell>
  );
}

function AboutStep({
  building,
  draft,
  update,
}: {
  building: Building;
  draft: ReviewDraft;
  update: (patch: Partial<ReviewDraft>) => void;
}) {
  return (
    <div className="grid gap-5">
      <h2 className="font-heading text-xl">What are you reviewing?</h2>
      <fieldset>
        <legend className="text-sm font-medium">Review type</legend>
        <div className="mt-2 grid gap-2">
          {(
            [
              ["building", "The building", "Shared spaces, staff, and the stay in general."],
              ["unit", "A unit type", "Studio, 1-bedroom, and similar. No exact unit number."],
              ["owner", "An owner or agent", "Use a fictional label. This is not a complaint form."],
            ] as const
          ).map(([value, label, detail]) => (
            <label key={value} className="flex gap-2 rounded-xl border border-border px-3 py-2 text-sm">
              <input
                type="radio"
                name="kind"
                value={value}
                checked={draft.kind === value}
                onChange={() => update({ kind: value as ReviewKind })}
              />
              <span>
                <span className="font-medium">{label}</span>
                <span className="mt-0.5 block text-muted-foreground">{detail}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-1.5">
        <Label htmlFor="author-label">Nickname to show on this browser</Label>
        <Input
          id="author-label"
          value={draft.authorLabel}
          onChange={(event) => update({ authorLabel: event.target.value })}
          autoComplete="off"
          maxLength={40}
          placeholder="Alex"
          className="h-10"
        />
        <p className="text-xs text-muted-foreground">Stored only in this browser. A first name or nickname is enough.</p>
      </div>

      <fieldset>
        <legend className="text-sm font-medium">How long was the stay in this demo?</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {STAY_OPTIONS.map((option) => (
            <label key={option} className="flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm">
              <input
                type="radio"
                name="stay"
                value={option}
                checked={draft.stayLabel === option}
                onChange={() => update({ stayLabel: option })}
              />
              {option}
            </label>
          ))}
        </div>
      </fieldset>

      {draft.kind === "unit" ? (
        <fieldset>
          <legend className="text-sm font-medium">Unit type</legend>
          <p className="mt-1 text-xs text-muted-foreground">
            This form does not ask for an exact unit number. Pick a type from the {building.name} sample.
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {building.unitTypes.map((type) => (
              <label key={type} className="flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm">
                <input
                  type="radio"
                  name="unit-type"
                  value={type}
                  checked={draft.unitType === type}
                  onChange={() => update({ unitType: type })}
                />
                {type}
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}

      {draft.kind === "owner" ? (
        <div className="grid gap-4">
          <fieldset>
            <legend className="text-sm font-medium">Fictional role</legend>
            <div className="mt-2 flex gap-2">
              {(["Agent", "Owner"] as const).map((role) => (
                <label key={role} className="flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm">
                  <input
                    type="radio"
                    name="persona-role"
                    value={role}
                    checked={draft.personaRole === role}
                    onChange={() => update({ personaRole: role })}
                  />
                  {role}
                </label>
              ))}
            </div>
          </fieldset>
          <div className="grid gap-1.5">
            <Label htmlFor="persona-name">Fictional {draft.personaRole.toLowerCase()} label</Label>
            <Input
              id="persona-name"
              value={draft.personaName}
              onChange={(event) => update({ personaName: event.target.value })}
              autoComplete="off"
              maxLength={40}
              placeholder="Sample agent A."
              className="h-10"
            />
            <p className="text-xs text-muted-foreground">
              Invent a label. Do not enter a real person’s name. This prototype is not a place to publish a complaint.
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ScoreStep({ draft, update }: { draft: ReviewDraft; update: (patch: Partial<ReviewDraft>) => void }) {
  return (
    <div className="grid gap-5">
      <h2 className="font-heading text-xl">{KIND_LABEL[draft.kind]} scores</h2>
      <p className="text-sm text-muted-foreground">1 is a poor sample experience and 5 is a strong one.</p>
      {RATING_FIELDS[draft.kind].map((field) => (
        <StarRating
          key={field.key}
          name={`rating-${draft.kind}-${field.key}`}
          label={field.label}
          hint={field.hint}
          value={draft.ratings[field.key] ?? 0}
          onChange={(value) => update({ ratings: { ...draft.ratings, [field.key]: value } })}
        />
      ))}
    </div>
  );
}

function NotesStep({ draft, update }: { draft: ReviewDraft; update: (patch: Partial<ReviewDraft>) => void }) {
  return (
    <div className="grid gap-4">
      <h2 className="font-heading text-xl">Written notes</h2>
      <p className="text-sm leading-6 text-muted-foreground">
        Describe the sample stay in your own words. Leave out exact unit numbers, such as “unit 1204”.
      </p>
      <div className="grid gap-1.5">
        <Label htmlFor="review-title">Title</Label>
        <Input
          id="review-title"
          value={draft.title}
          onChange={(event) => update({ title: event.target.value })}
          maxLength={80}
          className="h-10"
        />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="review-body">Note</Label>
        <Textarea
          id="review-body"
          value={draft.body}
          onChange={(event) => update({ body: event.target.value })}
          className="min-h-32"
          maxLength={800}
        />
        <p className="text-xs text-muted-foreground">{draft.body.length} / 800</p>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="review-pros">Pro</Label>
        <Textarea
          id="review-pros"
          value={draft.pros}
          onChange={(event) => update({ pros: event.target.value })}
          className="min-h-20"
          maxLength={280}
        />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="review-cons">Con</Label>
        <Textarea
          id="review-cons"
          value={draft.cons}
          onChange={(event) => update({ cons: event.target.value })}
          className="min-h-20"
          maxLength={280}
        />
      </div>
    </div>
  );
}

function ExtrasStep({
  draft,
  update,
  previewName,
  onPreviewName,
}: {
  draft: ReviewDraft;
  update: (patch: Partial<ReviewDraft>) => void;
  previewName: string | null;
  onPreviewName: (name: string | null) => void;
}) {
  return (
    <div className="grid gap-5">
      <h2 className="font-heading text-xl">Demo extras</h2>
      <fieldset>
        <legend className="text-sm font-medium">Simulated attachment</legend>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          Pick a placeholder to show the idea of evidence. The prototype does not upload, store, or send a document.
        </p>
        <div className="mt-3 grid gap-2">
          {EVIDENCE_OPTIONS.map((option) => (
            <label key={option.id} className="flex gap-2 rounded-xl border border-border px-3 py-2 text-sm">
              <input
                type="radio"
                name="evidence"
                value={option.id}
                checked={draft.evidenceChoice === option.id}
                onChange={() => update({ evidenceChoice: option.id as EvidenceChoice })}
              />
              <span>
                <span className="font-medium">{option.label}</span>
                <span className="mt-0.5 block text-muted-foreground">{option.detail}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="rounded-xl border border-dashed border-border p-4">
        <Label htmlFor="file-preview">Preview a filename on this page</Label>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          Choosing a file only displays its name here. The file is not read, uploaded, or saved with the review.
        </p>
        <Input
          id="file-preview"
          className="mt-3 h-10"
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,.txt"
          onChange={(event) => {
            const file = event.target.files?.[0];
            onPreviewName(file ? file.name : null);
            event.target.value = "";
          }}
        />
        {previewName ? (
          <p className="mt-2 text-sm">
            Showing “{previewName}” in memory for this page only.{" "}
            <button type="button" className="underline-offset-4 hover:underline" onClick={() => onPreviewName(null)}>
              Clear name
            </button>
          </p>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">No filename is being previewed.</p>
        )}
      </div>

      <label className="flex items-start gap-2 rounded-xl border border-border px-3 py-3 text-sm leading-6">
        <input
          type="checkbox"
          className="mt-1"
          checked={draft.tenancyMarkedVerified}
          onChange={(event) => update({ tenancyMarkedVerified: event.target.checked })}
        />
        <span>
          <span className="font-medium">Add the simulated label “{TENANCY_TITLE}”</span>
          <span className="mt-1 block text-muted-foreground">{TENANCY_BODY}</span>
        </span>
      </label>
    </div>
  );
}
