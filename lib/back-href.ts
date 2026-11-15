import type { AppHref } from "@/i18n/paths";
import { parseMonthKey } from "./calendar";
import { PERIODS } from "./insights-analytics";
import { MEANING_FILTERS } from "./meaning";

const BACK_QUERY = {
  "/journal": { filter: MEANING_FILTERS },
  "/journal/lucid": {},
  "/journal/favorites": {},
  "/journal/calendar": { month: (v: string) => parseMonthKey(v) !== null },
  "/journal/symbols": {},
  "/journal/insights": { period: PERIODS },
  "/journal/whispers": {},
} satisfies Record<
  string,
  Record<string, readonly string[] | ((value: string) => boolean)>
>;

export type BackPath = keyof typeof BACK_QUERY;
export type BackHref = BackPath | `${BackPath}?${string}`;

export function entryHref(id: string, from: BackHref): AppHref {
  return `/journal/${id}?from=${encodeURIComponent(from)}`;
}

export function backHref(
  path: BackPath,
  params: Record<string, string | null> = {},
): BackHref {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== null) {
      query.set(key, value);
    }
  }
  const search = query.toString();
  return search ? `${path}?${search}` : path;
}

export function parseBackHref(value: unknown): BackHref | null {
  if (
    typeof value !== "string" ||
    !value.startsWith("/journal") ||
    value.includes("#")
  ) {
    return null;
  }
  const [path, search = ""] = value.split("?", 2);
  if (!Object.hasOwn(BACK_QUERY, path)) {
    return null;
  }
  const allowed: Record<
    string,
    readonly string[] | ((value: string) => boolean)
  > = BACK_QUERY[path as BackPath];
  const params: Record<string, string> = {};
  for (const [key, param] of new URLSearchParams(search)) {
    const rule = allowed[key];
    if (
      !rule ||
      key in params ||
      !(typeof rule === "function" ? rule(param) : rule.includes(param))
    ) {
      return null;
    }
    params[key] = param;
  }
  const { filter, ...rest } = params;
  return backHref(path as BackPath, {
    ...rest,
    filter: filter === "all" ? null : (filter ?? null),
  });
}
