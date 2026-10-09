"use client";

import { useTranslations } from "next-intl";
import type { Period } from "@/lib/insights-analytics";
import type { SymbolKind } from "@/lib/symbols/schema";

const periodKeys = {
  "7d": "periodShort7d",
  "30d": "periodShort30d",
  "3m": "periodShort3m",
  "12m": "periodShort12m",
  all: "periodShortAll",
} as const satisfies Record<Period, string>;

const periodNameKeys = {
  "7d": "period7d",
  "30d": "period30d",
  "3m": "period3m",
  "12m": "period12m",
  all: "periodAll",
} as const satisfies Record<Period, string>;

const previousPeriodKeys = {
  "7d": "vs7d",
  "30d": "vs30d",
  "3m": "vs3m",
  "12m": "vs12m",
  all: null,
} as const satisfies Record<Period, string | null>;

const kindKeys = {
  person: "person",
  place: "place",
  thing: "thing",
  feeling: "feeling",
} as const satisfies Record<SymbolKind, string>;

export function useInsightsCopy() {
  const t = useTranslations("Insights");
  return {
    periodLabel: t("period"),
    periods: Object.fromEntries(
      Object.entries(periodKeys).map(([period, key]) => [
        period,
        t(key as (typeof periodKeys)[Period]),
      ]),
    ) as Record<Period, string>,
    periodNames: Object.fromEntries(
      Object.entries(periodNameKeys).map(([period, key]) => [
        period,
        t(key as (typeof periodNameKeys)[Period]),
      ]),
    ) as Record<Period, string>,
    vsPrevious: (period: Period) => {
      const key = previousPeriodKeys[period];
      return key ? t(key) : "";
    },
    kpis: {
      dreams: t("dreamsLogged"),
      recallRate: t("recallRate"),
      recallHint: t("recallHint"),
      avgWords: t("avgWords"),
      longestStreak: t("longestStreak"),
      currentStreak: (count: number) => t("currentStreak", { count }),
    },
    nights: (count: number) => t("nights", { count }),
    noChange: t("noChange"),
    timeline: {
      title: t("timelineTitle"),
      series: t("dreams"),
    },
    habits: {
      title: t("whenYouLog"),
      hours: t("timeOfDay"),
      weekdays: t("dayOfWeek"),
      series: t("dreams"),
      weekdayNames: t.raw("weekdays") as string[],
    },
    sources: {
      title: t("voiceVsTyped"),
      voice: t("voice"),
      text: t("typed"),
      avgRecording: t("avgRecording"),
      noRecordings: t("noRecordings"),
    },
    length: {
      title: t("dreamLength"),
      series: t("wordsPerDream"),
    },
    tone: {
      title: t("emotionalTone"),
      hint: t("toneHint"),
      empty: t("noFeelings"),
    },
    mix: {
      title: t("symbolMix"),
      empty: t("noSymbols"),
    },
    top: {
      title: t("topSymbols"),
      series: t("dreams"),
      empty: t("noSymbols"),
      rising: t("rising"),
      fading: t("fading"),
      noRising: t("noRising"),
      noFading: t("noFading"),
      isNew: t("new"),
      change: (current: number, previous: number) => `${previous} → ${current}`,
    },
    pairs: {
      title: t("seenTogether"),
      hint: t("seenTogetherHint"),
      empty: t("noSymbolsTogether"),
    },
    drilldown: {
      appearances: t("appearances"),
      inPeriod: (count: number) => t("inPeriod", { count }),
      firstSeen: t("firstSeen"),
      lastSeen: t("lastSeen"),
      dreams: t("dreams"),
      series: t("dreams"),
    },
    kindNames: Object.fromEntries(
      Object.entries(kindKeys).map(([kind, key]) => [kind, t(key)]),
    ) as Record<SymbolKind, string>,
    emptyPeriod: t("noDreams"),
    tapHint: t("tapHint"),
  };
}
