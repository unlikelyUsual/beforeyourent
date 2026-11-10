import Link from "next/link";
import { MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FictionalStamp } from "@/components/fictional-stamp";
import { formatScore } from "@/lib/format";
import type { Building } from "@/lib/types";

type BuildingCardProps = {
  building: Building;
  score: number | null;
  sampleCount: number;
  demoCount: number;
};

/** One building in the searchable sample list. */
export function BuildingCard({ building, score, sampleCount, demoCount }: BuildingCardProps) {
  return (
    <Link
      href={`/buildings/${building.slug}`}
      className="block h-full rounded-xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <Card className="h-full bg-card transition hover:ring-foreground/20">
        <CardHeader>
          <div className="flex flex-wrap gap-2">
            <FictionalStamp />
            {building.illustrativeName ? <FictionalStamp>Illustrative name</FictionalStamp> : null}
          </div>
          <CardTitle className="font-heading text-xl">{building.name}</CardTitle>
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="size-3.5" aria-hidden />
            Sample area: {building.area}
          </p>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-3">
          <p className="text-sm leading-6 text-muted-foreground">{building.sampleSummary}</p>
          <p className="mt-auto text-sm">
            <span className="font-heading text-2xl tabular-nums text-foreground">{formatScore(score)}</span>
            <span className="text-muted-foreground"> building score from sample notes</span>
          </p>
          <p className="text-xs text-muted-foreground">
            {sampleCount} fictional sample {sampleCount === 1 ? "note" : "notes"}
            {demoCount > 0 ? ` · ${demoCount} saved in this browser` : ""}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
