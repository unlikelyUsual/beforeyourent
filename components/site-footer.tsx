import Link from "next/link";
import { APP_NAME } from "@/lib/copy";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-sm text-muted-foreground sm:px-6">
        <p>
          {APP_NAME} is a local prototype for clicking through a rental research layout. It is not a listing site,
          a background check, or a place that verifies reviews.
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          <Link className="underline-offset-4 hover:underline" href="/how-this-demo-works">
            How this demo works
          </Link>
          <Link className="underline-offset-4 hover:underline" href="/demo-reviews">
            Your demo reviews
          </Link>
          <Link className="underline-offset-4 hover:underline" href="/buildings/life-asoke">
            Life Asoke sample page
          </Link>
        </div>
      </div>
    </footer>
  );
}
