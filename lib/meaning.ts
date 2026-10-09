export const CONFIDENCE_LEVELS = [
  { value: 10, label: "Unsure" },
  { value: 30, label: "Hunch" },
  { value: 50, label: "Possible" },
  { value: 75, label: "Likely" },
  { value: 100, label: "Certain" },
] as const;

export type Confidence = (typeof CONFIDENCE_LEVELS)[number]["value"];

export function confidenceLabel(value: number | null): string | null {
  return (
    CONFIDENCE_LEVELS.find((level) => level.value === value)?.label ?? null
  );
}

export const MEANING_FILTERS = ["all", "interpreted", "fulfilled"] as const;

export type MeaningFilter = (typeof MEANING_FILTERS)[number];

export function parseMeaningFilter(value: unknown): MeaningFilter {
  return typeof value === "string" &&
    MEANING_FILTERS.includes(value as MeaningFilter)
    ? (value as MeaningFilter)
    : "all";
}

export function isConfidence(n: number): n is Confidence {
  return CONFIDENCE_LEVELS.some((level) => level.value === n);
}
