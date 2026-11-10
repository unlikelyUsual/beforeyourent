/**
 * Checks for the demo review form.
 * Exact unit numbers are refused so the prototype never asks people
 * to publish a private unit identifier.
 */

import { RATING_FIELDS } from "@/lib/ratings";
import type { EvidenceChoice, ReviewKind } from "@/lib/types";

const EXACT_UNIT =
  /\b(?:units?|rooms?|apts?|apartments?|flats?)\s*(?:no\.?|number|#)?\s*\d{2,5}\b|#\s*\d{3,5}\b/i;

export type ReviewDraft = {
  kind: ReviewKind;
  authorLabel: string;
  stayLabel: string;
  unitType: string;
  personaName: string;
  personaRole: "Owner" | "Agent";
  ratings: Record<string, number>;
  title: string;
  body: string;
  pros: string;
  cons: string;
  tenancyMarkedVerified: boolean;
  evidenceChoice: EvidenceChoice;
  acknowledged: boolean;
};

export function textMentionsExactUnit(value: string) {
  return EXACT_UNIT.test(value);
}

export function issuesForStep(draft: ReviewDraft, step: number) {
  const issues: string[] = [];

  if (step === 0) {
    if (draft.authorLabel.trim().length < 2) {
      issues.push("Add a short nickname to show on this browser.");
    }
    if (draft.authorLabel.trim().length > 40) {
      issues.push("Keep the nickname under 40 characters.");
    }
    if (!draft.stayLabel) {
      issues.push("Choose how long the sample stay was.");
    }
    if (draft.kind === "unit" && !draft.unitType) {
      issues.push("Choose a unit type. Exact unit numbers are not collected.");
    }
    if (draft.kind === "owner") {
      if (draft.personaName.trim().length < 2) {
        issues.push("Add a fictional owner or agent label, such as Sample agent A.");
      }
      if (draft.personaName.trim().length > 40) {
        issues.push("Keep the fictional label under 40 characters.");
      }
    }
  }

  if (step === 1) {
    for (const field of RATING_FIELDS[draft.kind]) {
      const score = draft.ratings[field.key] ?? 0;
      if (score < 1 || score > 5) {
        issues.push(`Choose a ${field.label.toLowerCase()} score from 1 to 5.`);
      }
    }
  }

  if (step === 2) {
    if (draft.title.trim().length < 8) issues.push("Add a title of at least 8 characters.");
    if (draft.title.trim().length > 80) issues.push("Keep the title under 80 characters.");
    if (draft.body.trim().length < 40) issues.push("Write a note of at least 40 characters.");
    if (draft.body.trim().length > 800) issues.push("Keep the note under 800 characters.");
    if (draft.pros.trim().length < 8) issues.push("Add a short pro.");
    if (draft.pros.trim().length > 280) issues.push("Keep the pro under 280 characters.");
    if (draft.cons.trim().length < 8) issues.push("Add a short con.");
    if (draft.cons.trim().length > 280) issues.push("Keep the con under 280 characters.");

    const combined = `${draft.title}\n${draft.body}\n${draft.pros}\n${draft.cons}\n${draft.personaName}`;
    if (textMentionsExactUnit(combined)) {
      issues.push("Remove exact unit numbers. This demo only keeps unit types such as 1-bedroom.");
    }
  }

  if (step === 4 && !draft.acknowledged) {
    issues.push("Confirm that this demo review stays in this browser.");
  }

  return issues;
}
