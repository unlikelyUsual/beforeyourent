import { Badge } from "@/components/ui/badge";

/** Small label so a card cannot be mistaken for a live review. */
export function FictionalStamp({ children = "Fictional sample" }: { children?: React.ReactNode }) {
  return (
    <Badge variant="outline" className="h-auto border-amber-900/20 bg-amber-50 px-2 py-0.5 text-amber-950">
      {children}
    </Badge>
  );
}
