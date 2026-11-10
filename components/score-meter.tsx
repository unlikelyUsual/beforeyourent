import { formatScore } from "@/lib/format";

/** Decorative bar. The number next to the label is the accessible value. */
export function ScoreMeter({ label, value }: { label: string; value: number | null }) {
  const width = value == null ? 0 : Math.max(0, Math.min(100, (value / 5) * 100));
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span>{label}</span>
        <span className="tabular-nums text-muted-foreground">{value == null ? "No score" : formatScore(value)}</span>
      </div>
      <div className="mt-1 h-1.5 rounded-full bg-muted" aria-hidden>
        <div className="h-1.5 rounded-full bg-primary" style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}
