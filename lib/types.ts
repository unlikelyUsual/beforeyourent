/**
 * Shared types for the prototype.
 * Sample records and browser-only demo reviews use the same core shape
 * so the review cards can render either source.
 */

export type ReviewKind = "building" | "unit" | "owner";

export type PersonaRole = "Owner" | "Agent";

/** Pretend attachment choices. Nothing here is a real document. */
export type EvidenceChoice = "none" | "sample-lease" | "sample-bill" | "sample-chat";

export type Building = {
  slug: string;
  name: string;
  /**
   * Life Asoke uses a recognizable name only as an illustration.
   * Every other building name was invented for this sample list.
   */
  illustrativeName: boolean;
  /** Sample area label, such as "Asok". Not a verified location. */
  area: string;
  sampleAddress: string;
  /** Invented year. Not a historical claim. */
  yearOpenedSample: number;
  /** Invented floor count. */
  floorsSample: number;
  /** Unit types only. Exact unit numbers are intentionally absent. */
  unitTypes: string[];
  /** Invented amenity names. */
  amenities: string[];
  sampleSummary: string;
  /** Invented transit sentence. Not a measured walk time. */
  transitSample: string;
};

export type ReviewCore = {
  id: string;
  buildingSlug: string;
  kind: ReviewKind;
  authorLabel: string;
  stayLabel: string;
  unitType: string | null;
  personaName: string | null;
  personaRole: PersonaRole | null;
  /** Keys depend on the review kind. 1 is low and 5 is high. */
  ratings: Record<string, number>;
  title: string;
  body: string;
  pros: string;
  cons: string;
  /**
   * When true, the UI shows a simulated "tenancy marked verified" badge.
   * The flag is not evidence. The prototype never checks a document.
   */
  tenancyMarkedVerified: boolean;
  createdAt: string;
};

export type SampleReview = ReviewCore & {
  /** Invented count of "helpful" marks. Not a live counter. */
  sampleHelpfulMarks: number;
};

export type DemoReview = ReviewCore & {
  source: "browser-demo";
  evidenceChoice: EvidenceChoice;
};

/** One shape for cards that mix fictional samples and browser-saved demos. */
export type ListedReview = ReviewCore & {
  source: "fictional-sample" | "browser-demo";
  sampleHelpfulMarks: number | null;
  evidenceChoice: EvidenceChoice | null;
};

export type DemoStoreStatus = "ready" | "unreadable" | "unavailable";

export type DemoStore = {
  status: DemoStoreStatus;
  reviews: DemoReview[];
};
