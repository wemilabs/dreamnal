import type { AppHref } from "@/i18n/paths";
import { parseMeaningFilter } from "./meaning";

export const BACK_PATHS = [
  "/journal",
  "/journal/lucid",
  "/journal/favorites",
  "/journal/calendar",
  "/journal/symbols",
  "/journal/insights",
  "/journal/whispers",
] as const;

export type BackPath = (typeof BACK_PATHS)[number];
export type BackHref = BackPath | `/journal?filter=${string}`;

export function entryHref(id: string, from: BackHref): AppHref {
  return `/journal/${id}?from=${encodeURIComponent(from)}`;
}

export function parseBackHref(value: unknown): BackHref | null {
  if (typeof value !== "string" || !value.startsWith("/journal")) {
    return null;
  }
  if ((BACK_PATHS as readonly string[]).includes(value)) {
    return value as BackPath;
  }
  const match = /^\/journal\?filter=([a-z]+)$/.exec(value);
  if (match) {
    const filter = parseMeaningFilter(match[1]);
    return filter === "all" ? "/journal" : `/journal?filter=${filter}`;
  }
  return null;
}
