"use client";

import { useTranslations } from "next-intl";
import { PERIODS, type Period } from "@/lib/insights-analytics";
import { cn } from "@/lib/utils";

const periodKeys = {
  "7d": ["periodShort7d", "period7d"],
  "30d": ["periodShort30d", "period30d"],
  "3m": ["periodShort3m", "period3m"],
  "12m": ["periodShort12m", "period12m"],
  all: ["periodShortAll", "periodAll"],
} as const satisfies Record<Period, readonly [string, string]>;

export function PeriodPicker({
  value,
  onChange,
}: {
  value: Period;
  onChange: (period: Period) => void;
}) {
  const t = useTranslations("Insights");
  return (
    <fieldset className="inline-flex rounded-lg border border-border bg-card/60 p-0.5">
      <legend className="sr-only">{t("period")}</legend>
      {PERIODS.map((period) => (
        <button
          key={period}
          type="button"
          aria-pressed={period === value}
          aria-label={t(periodKeys[period][1])}
          onClick={() => onChange(period)}
          className={cn(
            "pressable h-8 min-w-11 rounded-md px-3 text-sm font-medium tabular-nums text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
            period === value &&
              "bg-foreground text-background hover:text-background",
          )}
        >
          {t(periodKeys[period][0])}
        </button>
      ))}
    </fieldset>
  );
}
