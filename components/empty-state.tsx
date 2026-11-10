import { cn } from "cn";

type EmptyStateProps = {
  title: string;
  body: string;
  action?: React.ReactNode;
  titleAs?: "h1" | "h2" | "p";
  tone?: "default" | "error";
};

/** Shared empty and error panel. */
export function EmptyState({ title, body, action, titleAs = "h2", tone = "default" }: EmptyStateProps) {
  const Title = titleAs;
  return (
    <div
      role={tone === "error" ? "alert" : undefined}
      className={cn(
        "rounded-2xl border border-dashed px-6 py-10 text-center",
        tone === "error" ? "border-destructive/40 bg-destructive/5" : "border-border bg-card",
      )}
    >
      <Title className="font-heading text-2xl text-foreground">{title}</Title>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">{body}</p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}
