import { Star } from "lucide-react";
import { cn } from "cn";

type StarRatingProps = {
  label: string;
  hint?: string;
  value: number;
  onChange?: (value: number) => void;
  name?: string;
};

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <Star
      aria-hidden
      className={cn("size-5", filled ? "fill-current text-[oklch(0.62_0.12_75)]" : "text-border")}
    />
  );
}

/** Read-only stars, or a real radio group when onChange is provided. */
export function StarRating({ label, hint, value, onChange, name }: StarRatingProps) {
  if (!onChange) {
    const rounded = Math.round(value);
    return (
      <div className="inline-flex items-center gap-1" aria-label={`${label}: ${value.toFixed(1)} out of 5`}>
        {Array.from({ length: 5 }, (_, index) => (
          <StarIcon key={index} filled={index < rounded} />
        ))}
      </div>
    );
  }

  return (
    <fieldset>
      <legend className="text-sm font-medium text-foreground">{label}</legend>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
      <div className="mt-2 flex items-center gap-1">
        {Array.from({ length: 5 }, (_, index) => {
          const score = index + 1;
          return (
            <label key={score} className="cursor-pointer rounded-md">
              <input
                className="peer sr-only"
                type="radio"
                name={name ?? label}
                value={score}
                checked={value === score}
                onChange={() => onChange(score)}
              />
              <span className="grid size-9 place-items-center rounded-md peer-focus-visible:ring-3 peer-focus-visible:ring-ring/50">
                <StarIcon filled={score <= value} />
              </span>
              <span className="sr-only">{score} out of 5</span>
            </label>
          );
        })}
        <span className="ml-2 text-sm text-muted-foreground">{value > 0 ? `${value} / 5` : "Choose 1 to 5"}</span>
      </div>
    </fieldset>
  );
}
