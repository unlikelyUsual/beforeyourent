import type { ReviewKind } from "@/lib/types";

/**
 * Score fields for each review tab.
 * Every scale runs from 1 to 5, and a higher number is the better experience.
 * Quietness means "more quiet", not "more noise".
 */
export const RATING_FIELDS: Record<
  ReviewKind,
  { key: string; label: string; hint: string }[]
> = {
  building: [
    { key: "overall", label: "Overall", hint: "The sample stay as a whole." },
    { key: "maintenance", label: "Maintenance", hint: "How repairs went in the story." },
    { key: "quietness", label: "Quietness", hint: "5 means a quiet sample story." },
    { key: "commonAreas", label: "Common areas", hint: "Lobby, pool, gym, and similar spots." },
    { key: "management", label: "Management", hint: "Building staff in the sample story." },
    { key: "value", label: "Value", hint: "How the sample rent felt." },
  ],
  unit: [
    { key: "overall", label: "Overall", hint: "This unit type in the sample story." },
    { key: "layout", label: "Layout", hint: "How the sample floor plan worked." },
    { key: "daylight", label: "Daylight", hint: "Light described in the sample." },
    { key: "quietness", label: "Quietness", hint: "5 means a quiet sample story." },
    { key: "storage", label: "Storage", hint: "Closets and leftover space." },
    { key: "condition", label: "Condition", hint: "Wear described in the sample." },
  ],
  owner: [
    { key: "overall", label: "Overall", hint: "This fictional persona overall." },
    { key: "responsiveness", label: "Responsiveness", hint: "Reply speed in the sample story." },
    { key: "fairness", label: "Fairness", hint: "How even the sample story felt." },
    { key: "communication", label: "Communication", hint: "How clear the sample notes were." },
    { key: "depositHandling", label: "Deposit handling", hint: "How the deposit was described." },
  ],
};
