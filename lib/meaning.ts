export const CONFIDENCE_LEVELS = [
  { value: 10 },
  { value: 30 },
  { value: 50 },
  { value: 75 },
  { value: 100 },
] as const;

export type Confidence = (typeof CONFIDENCE_LEVELS)[number]["value"];

export const MEANING_FILTERS = ["all", "interpreted", "fulfilled"] as const;

export type MeaningFilter = (typeof MEANING_FILTERS)[number];

export function parseMeaningFilter(value: unknown): MeaningFilter {
  return typeof value === "string" &&
    MEANING_FILTERS.includes(value as MeaningFilter)
    ? (value as MeaningFilter)
    : "all";
}

export function matchesMeaningFilter(
  entry: { hasMeaning: boolean; fulfilledOn: string | null },
  filter: MeaningFilter,
): boolean {
  if (filter === "all") {
    return true;
  }
  if (filter === "interpreted") {
    return entry.hasMeaning && entry.fulfilledOn === null;
  }
  return entry.fulfilledOn !== null;
}

export function isConfidence(n: number): n is Confidence {
  return CONFIDENCE_LEVELS.some((level) => level.value === n);
}
