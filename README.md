# BeforeYouRent prototype

A local Next.js prototype for browsing fictional rental notes and submitting a demo review that stays in the browser. Life Asoke is an illustrative building name only. Ratings, review text, counts, unit notes, owner and agent personas, amenities, and addresses in the app were invented.

This folder is the source to keep on your Mac, for example at:

`/Users/prabhat/Documents/Side Projects/beforeyourent`

There is no account, database, upload, payment, or public deployment in this prototype.

## Prerequisites

- Node.js 20 or newer
- npm 10 or newer (npm 10 ships with recent Node 20)

Check with:

```bash
node -v
npm -v
```

## Run it locally

From this folder:

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts:

```bash
npm run lint
npm run typecheck
npm run build
npm start
```

`npm start` serves the production build and also uses port 3000 unless you pass `-p`.

Fonts are system fonts. The app does not load a remote font or a remote image, so a build does not need Google Fonts. `npm ci` does need network access to install packages from the lockfile.

## Click through

1. Search the sample list. Try “Life”, an area such as “Ari”, or “zzzz” for the empty search.
2. Open **Life Asoke**. Use the Building, Units, and Owners & agents tabs. Change sort and the minimum score.
3. Choose **Write a demo review** and finish the five steps. The success screen says the note was saved in this browser only.
4. Open **Your demo reviews**, then **Reset all demo reviews** to clear localStorage.

The header menu is the mobile navigation under the desktop breakpoint.

## Demo limitations

- All shipped scores and stories are fictional sample data. They are not visits, listings, or complaints about real people.
- “Tenancy marked verified” is a simulated label. The app does not check a lease, an identity, or the text of a review.
- The attachment step offers placeholders. A chosen file is not read, uploaded, stored, or sent. Only the placeholder choice is saved with a demo review.
- Exact unit numbers are not collected. Unit notes use types such as “1-bedroom”.
- Demo reviews you submit are stored in `localStorage` under `beforeyourent.demoReviews.v1` on that browser. They are not on a server. Another browser, or a cleared site storage, will not show them.
- There is no auth, Supabase, email, payment, or tracking.
- Search, tabs, filters, and saving a review need JavaScript. The fictional copy is still in the page HTML.

## Architecture and files

```text
app/layout.tsx                         Header, fictional-data banner, footer
app/page.tsx                           Building search and list
app/buildings/[slug]/page.tsx          Building detail and review tabs
app/buildings/[slug]/review/page.tsx   Demo review form
app/demo-reviews/page.tsx              Reviews saved in this browser, plus reset
app/how-this-demo-works/page.tsx       Plain-language limits of the demo
app/not-found.tsx                      Unknown building or path
app/error.tsx                          Recoverable page error
components/building-explorer.tsx       Search, area filter, sort
components/building-detail.tsx         Facts and the three tabs
components/review-list.tsx             Per-tab filters and sort
components/review-form.tsx             Five-step submission and success state
components/demo-reviews-panel.tsx      localStorage list and reset
components/ui/                         shadcn components (button, card, tabs, dialog, …)
lib/sample-data.ts                     Invented buildings and reviews
lib/demo-storage.ts                    localStorage read, save, remove, reset
lib/validate-review.ts                 Form checks, including exact unit numbers
lib/ratings.ts                         Score fields for each review type
lib/copy.ts                            Shared fictional-data and tenancy wording
```

Sample reviews and browser reviews share one card (`components/review-card.tsx`). The card badge shows which source you are looking at.

## A later Supabase path

Not built here. A later version could replace the local pieces like this:

| Prototype | Later service |
| --- | --- |
| `lib/sample-data.ts` | `buildings` and published `reviews` read with the Supabase client |
| `lib/demo-storage.ts` | `reviews` insert after sign-in, instead of localStorage |
| Tenancy checkbox | A private `tenancy_checks` row. Do not let the writer turn the public badge on |
| Filename preview | A private Storage bucket after auth. Do not put documents on a public URL |
| No exact unit field | Keep it that way in the table. Store unit type only on public reviews |

Suggested tables: `buildings`, `reviews` (kind, ratings jsonb, text, unit_type, fictional or real author id), and private tables for evidence and tenancy checks. Row level security would decide who can read a public review versus a document. That work needs a project URL and a key, which this prototype does not use.
