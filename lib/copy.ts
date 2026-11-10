/**
 * Shared wording so the fictional-data warning stays consistent
 * on the banner, the building page, and the review form.
 */

export const APP_NAME = "BeforeYouRent";

export const FICTIONAL_BANNER =
  "Fictional demo data. Life Asoke is an illustrative name only. Ratings, review text, counts, unit notes, owner and agent personas, amenities, and addresses were invented for this prototype.";

export const TENANCY_TITLE = "Tenancy marked verified";

export const TENANCY_BODY =
  "This is a simulated label. It does not prove a tenancy, check a lease or identity, or confirm anything written in the review. The prototype has no verification service.";

export const EVIDENCE_OPTIONS = [
  {
    id: "none",
    label: "No sample attachment",
    detail: "Skip the pretend attachment.",
  },
  {
    id: "sample-lease",
    label: "Sample lease excerpt",
    detail: "A labeled placeholder. Not a real lease, and nothing is uploaded.",
  },
  {
    id: "sample-bill",
    label: "Sample utility bill",
    detail: "A labeled placeholder. Not a real bill, and nothing is uploaded.",
  },
  {
    id: "sample-chat",
    label: "Sample message thread",
    detail: "A labeled placeholder. Not a real conversation, and nothing is uploaded.",
  },
] as const;

export const STAY_OPTIONS = [
  "Under 6 months",
  "About a year",
  "More than a year",
] as const;

export const KIND_LABEL = {
  building: "Building",
  unit: "Unit type",
  owner: "Owner or agent",
} as const;

export function evidenceLabel(choice: string | null) {
  return EVIDENCE_OPTIONS.find((option) => option.id === choice)?.label ?? "No sample attachment";
}
