import Link from "next/link";
import { EmptyState } from "@/components/empty-state";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <PageShell>
      <EmptyState
        titleAs="h1"
        title="That page is not in the sample"
        body="This prototype only includes a handful of invented buildings. Life Asoke is the illustrative example."
        action={
          <Button asChild className="h-10">
            <Link href="/">Back to the sample list</Link>
          </Button>
        }
      />
    </PageShell>
  );
}
