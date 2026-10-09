"use client";

import { useTranslations } from "next-intl";
import type { LabelStat } from "@/lib/insights";
import { LocalDay } from "./local-day";

export function capitalizeLabel(label: string): string {
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function LabelLine({ stat }: { stat: LabelStat }) {
  const t = useTranslations("Symbols");
  return (
    <>
      {capitalizeLabel(stat.label)}: {t("dreams", { count: stat.count })},{" "}
      {t("lastOn")} <LocalDay iso={stat.lastAt} />
    </>
  );
}
