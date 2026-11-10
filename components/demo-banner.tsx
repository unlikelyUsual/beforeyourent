import { FICTIONAL_BANNER } from "@/lib/copy";

/** Sticky reminder that every score and story on the site is sample data. */
export function DemoBanner() {
  return (
    <div className="demo-banner">
      <p className="mx-auto max-w-6xl px-4 py-2 text-xs leading-5 sm:px-6 sm:text-sm">{FICTIONAL_BANNER}</p>
    </div>
  );
}
