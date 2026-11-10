/**
 * Browser-only storage for demo reviews.
 *
 * Reviews typed into the form stay in localStorage on this computer.
 * They are never uploaded. Clearing site data, or the reset button,
 * removes them. Sample reviews in lib/sample-data.ts are separate
 * and are not stored here.
 */

import type { DemoReview, DemoStore } from "@/lib/types";

export const STORAGE_KEY = "beforeyourent.demoReviews.v1";
export const STORAGE_EVENT = "beforeyourent-demo-reviews";

const EMPTY: DemoReview[] = [];
const SERVER_STORE: DemoStore = { status: "ready", reviews: EMPTY };
const UNAVAILABLE = Symbol("local-storage-unavailable");

let cacheRaw: string | null | symbol | undefined;
let cacheValue: DemoStore = SERVER_STORE;

function isEvidenceChoice(value: unknown) {
  return value === "none" || value === "sample-lease" || value === "sample-bill" || value === "sample-chat";
}

function isDemoReview(value: unknown): value is DemoReview {
  if (!value || typeof value !== "object") return false;
  const review = value as Partial<DemoReview>;
  if (review.source !== "browser-demo") return false;
  if (!isEvidenceChoice(review.evidenceChoice)) return false;
  if (typeof review.id !== "string" || typeof review.buildingSlug !== "string") return false;
  if (review.kind !== "building" && review.kind !== "unit" && review.kind !== "owner") return false;
  if (typeof review.authorLabel !== "string" || typeof review.title !== "string") return false;
  if (typeof review.body !== "string" || typeof review.pros !== "string" || typeof review.cons !== "string") {
    return false;
  }
  if (typeof review.stayLabel !== "string" || typeof review.createdAt !== "string") return false;
  if (typeof review.tenancyMarkedVerified !== "boolean") return false;
  if (!(review.unitType === null || typeof review.unitType === "string")) return false;
  if (!(review.personaName === null || typeof review.personaName === "string")) return false;
  if (!(review.personaRole === null || review.personaRole === "Owner" || review.personaRole === "Agent")) {
    return false;
  }
  if (!review.ratings || typeof review.ratings !== "object") return false;
  return Object.values(review.ratings).every((score) => typeof score === "number");
}

function parseStore(raw: string | null): DemoStore {
  if (raw == null || raw === "") return SERVER_STORE;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return { status: "unreadable", reviews: EMPTY };
    const reviews: DemoReview[] = [];
    for (const item of parsed) {
      if (!isDemoReview(item)) return { status: "unreadable", reviews: EMPTY };
      reviews.push(item);
    }
    return { status: "ready", reviews };
  } catch {
    return { status: "unreadable", reviews: EMPTY };
  }
}

export function getServerSnapshot(): DemoStore {
  return SERVER_STORE;
}

export function getSnapshot(): DemoStore {
  if (typeof window === "undefined") return SERVER_STORE;

  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    if (cacheRaw === UNAVAILABLE) return cacheValue;
    cacheRaw = UNAVAILABLE;
    cacheValue = { status: "unavailable", reviews: EMPTY };
    return cacheValue;
  }

  if (raw === cacheRaw) return cacheValue;
  cacheRaw = raw;
  cacheValue = parseStore(raw);
  return cacheValue;
}

export function subscribe(onStoreChange: () => void) {
  const notify = () => onStoreChange();
  window.addEventListener(STORAGE_EVENT, notify);
  window.addEventListener("storage", notify);
  return () => {
    window.removeEventListener(STORAGE_EVENT, notify);
    window.removeEventListener("storage", notify);
  };
}

function commit(reviews: DemoReview[]) {
  const raw = JSON.stringify(reviews);
  window.localStorage.setItem(STORAGE_KEY, raw);
  cacheRaw = raw;
  cacheValue = { status: "ready", reviews };
  window.dispatchEvent(new Event(STORAGE_EVENT));
}

export function saveDemoReview(review: DemoReview): { ok: true } | { ok: false; message: string } {
  try {
    const current = getSnapshot();
    if (current.status === "unavailable") {
      return {
        ok: false,
        message: "This browser did not allow local storage, so the demo review was not saved.",
      };
    }
    if (current.status === "unreadable") {
      return {
        ok: false,
        message: "Saved demo data on this browser could not be read. Reset it, then try the form again.",
      };
    }
    commit([review, ...current.reviews]);
    return { ok: true };
  } catch {
    return {
      ok: false,
      message: "This browser blocked saving. The demo review was not stored.",
    };
  }
}

export function removeDemoReview(id: string): { ok: true } | { ok: false; message: string } {
  try {
    const current = getSnapshot();
    if (current.status !== "ready") {
      return { ok: false, message: "Demo reviews could not be updated in this browser." };
    }
    commit(current.reviews.filter((review) => review.id !== id));
    return { ok: true };
  } catch {
    return { ok: false, message: "This browser blocked removing that demo review." };
  }
}

export function clearDemoReviews(): { ok: true } | { ok: false; message: string } {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    cacheRaw = null;
    cacheValue = SERVER_STORE;
    window.dispatchEvent(new Event(STORAGE_EVENT));
    return { ok: true };
  } catch {
    return { ok: false, message: "This browser blocked the reset." };
  }
}
