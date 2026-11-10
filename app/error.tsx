"use client";

import { EmptyState } from "@/components/empty-state";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <PageShell>
      <EmptyState
        tone="error"
        titleAs="h1"
        title="This demo page hit a problem"
        body="Trying again reloads this view. The fictional sample data is part of the app and is still on this computer."
        action={
          <Button type="button" className="h-10" onClick={() => reset()}>
            Try again
          </Button>
        }
      />
    </PageShell>
  );
}
