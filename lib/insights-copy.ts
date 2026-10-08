import type { Period } from "./insights-analytics.ts";
import type { SymbolKind } from "./symbols/schema.ts";

export const insightsCopy = {
  periodLabel: "Period",
  periods: {
    "7d": "7D",
    "30d": "30D",
    "3m": "3M",
    "12m": "12M",
    all: "All",
  } satisfies Record<Period, string>,
  periodNames: {
    "7d": "Last 7 days",
    "30d": "Last 30 days",
    "3m": "Last 3 months",
    "12m": "Last 12 months",
    all: "All time",
  } satisfies Record<Period, string>,
  vsPrevious: (period: Period) =>
    ({
      "7d": "vs prior 7 days",
      "30d": "vs prior 30 days",
      "3m": "vs prior 3 months",
      "12m": "vs prior 12 months",
      all: "",
    })[period],
  kpis: {
    dreams: "Dreams logged",
    recallRate: "Recall rate",
    recallHint: "Nights with a dream",
    avgWords: "Words per dream",
    longestStreak: "Longest streak",
    currentStreak: (n: number) =>
      n === 1 ? "Current streak: 1 night" : `Current streak: ${n} nights`,
  },
  nights: (n: number) => (n === 1 ? "night" : "nights"),
  noChange: "No change",
  timeline: {
    title: "Dreams over time",
    series: "Dreams",
  },
  habits: {
    title: "When you log",
    hours: "Time of day",
    weekdays: "Day of week",
    series: "Dreams",
    weekdayNames: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  sources: {
    title: "Voice vs typed",
    voice: "Voice",
    text: "Typed",
    avgRecording: "Average recording",
    noRecordings: "No recordings yet",
  },
  length: {
    title: "Dream length",
    series: "Words per dream",
  },
  tone: {
    title: "Emotional tone",
    hint: "Feelings that show up most, over time",
    empty: "No feelings tagged in this period.",
  },
  mix: {
    title: "Symbol mix",
    empty: "No symbols in this period.",
  },
  top: {
    title: "Top symbols",
    series: "Dreams",
    empty: "No symbols in this period.",
    rising: "Rising",
    fading: "Fading",
    noRising: "Nothing new is rising.",
    noFading: "Nothing is fading.",
    isNew: "new",
    change: (current: number, previous: number) => `${previous} → ${current}`,
  },
  pairs: {
    title: "Seen together",
    hint: "Symbols that appear in the same dreams",
    empty: "No symbols appear together yet.",
  },
  drilldown: {
    appearances: "Appearances",
    inPeriod: (n: number) => (n === 1 ? "1 dream" : `${n} dreams`),
    firstSeen: "First seen",
    lastSeen: "Last seen",
    dreams: "Dreams",
    series: "Dreams",
  },
  kindNames: {
    person: "Person",
    place: "Place",
    thing: "Thing",
    feeling: "Feeling",
  } satisfies Record<SymbolKind, string>,
  emptyPeriod: "No dreams in this period.",
  tapHint: "Tap a symbol to see its dreams",
};
