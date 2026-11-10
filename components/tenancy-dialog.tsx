"use client";

import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TENANCY_BODY, TENANCY_TITLE } from "@/lib/copy";

/** Explains the simulated tenancy badge. Opens on click so it works on a phone. */
export function TenancyDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm" className="h-7 rounded-full px-2 text-xs">
          <Shield className="size-3" />
          {TENANCY_TITLE}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{TENANCY_TITLE}</DialogTitle>
          <DialogDescription>{TENANCY_BODY}</DialogDescription>
        </DialogHeader>
        <p className="text-sm leading-6 text-muted-foreground">
          Nothing is sent to a landlord, an agent, or a payment service. On a fictional sample, the badge was
          switched on by the author of this prototype. On a review you submit, the badge appears only if you
          turn it on, and it still does not check anything.
        </p>
      </DialogContent>
    </Dialog>
  );
}
