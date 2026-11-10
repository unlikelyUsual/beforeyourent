import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { TENANCY_BODY, TENANCY_TITLE } from "@/lib/copy";

export const metadata: Metadata = {
  title: "How this demo works",
};

export default function HowThisDemoWorksPage() {
  return (
    <PageShell>
      <article className="max-w-2xl">
        <h1 className="font-heading text-4xl tracking-tight">How this demo works</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          BeforeYouRent is a clickable prototype. It has no account, no database, and no upload service.
        </p>

        <h2 className="mt-8 font-heading text-2xl">What you can do</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6">
          <li>Search the sample buildings and filter by area.</li>
          <li>Open a building and switch among building, unit, and owner or agent notes.</li>
          <li>Sort those notes and raise the minimum score.</li>
          <li>Submit a demo review. It is saved in this browser only.</li>
          <li>Reset those saved reviews from Your demo reviews.</li>
        </ol>

        <h2 className="mt-8 font-heading text-2xl">What is fictional</h2>
        <p className="mt-3 text-sm leading-6">
          Life Asoke is an illustrative building name. Ratings, review text, counts, unit notes, owner and agent
          personas, amenities, years, floor counts, and addresses were invented. The amber “Fictional sample” label
          and the banner at the top of every page mark that data.
        </p>

        <h2 className="mt-8 font-heading text-2xl">{TENANCY_TITLE}</h2>
        <p className="mt-3 text-sm leading-6">{TENANCY_BODY}</p>

        <h2 className="mt-8 font-heading text-2xl">Attachments</h2>
        <p className="mt-3 text-sm leading-6">
          The form can show a sample lease, bill, or message placeholder. A file picker only displays a filename on
          that page. The file is not read, uploaded, stored, or sent.
        </p>

        <h2 className="mt-8 font-heading text-2xl">Where a demo review goes</h2>
        <p className="mt-3 text-sm leading-6">
          New reviews use the browser’s localStorage key <code>beforeyourent.demoReviews.v1</code>. Another computer
          will not see them. Sample notes shipped with the app are unaffected by Reset.
        </p>

        <h2 className="mt-8 font-heading text-2xl">Empty and missing pages</h2>
        <p className="mt-3 text-sm leading-6">
          Search for “zzzz” to see an empty building list. Open a building that is not in the sample to see the
          missing-page screen.
        </p>
        <p className="mt-3">
          <Link className="text-sm underline-offset-4 hover:underline" href="/buildings/not-in-the-sample">
            Open a building that is not in the sample set
          </Link>
        </p>
      </article>
    </PageShell>
  );
}
