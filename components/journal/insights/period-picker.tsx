import { PERIODS, type Period } from "@/lib/insights-analytics";
import { insightsCopy } from "@/lib/insights-copy";
import { cn } from "@/lib/utils";

export function PeriodPicker({
  value,
  onChange,
}: {
  value: Period;
  onChange: (period: Period) => void;
}) {
  return (
    <fieldset className="inline-flex rounded-lg border border-border bg-card/60 p-0.5">
      <legend className="sr-only">{insightsCopy.periodLabel}</legend>
      {PERIODS.map((period) => (
        <button
          key={period}
          type="button"
          aria-pressed={period === value}
          aria-label={insightsCopy.periodNames[period]}
          onClick={() => onChange(period)}
          className={cn(
            "pressable h-8 min-w-11 rounded-md px-3 font-mono text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
            period === value &&
              "bg-foreground text-background hover:text-background",
          )}
        >
          {insightsCopy.periods[period]}
        </button>
      ))}
    </fieldset>
  );
}
