export type SearchEntry = {
  id: string;
  title: string | null;
  body: string;
  labels: string[];
  createdAt: string;
};

export const DREAM_VALUE_PREFIX = "dream:";

export function normalizeForSearch(s: string): string {
  return s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

export function scoreDream(search: string, keywords: string[]): number {
  const tokens = normalizeForSearch(search).split(/\s+/).filter(Boolean);
  if (tokens.length === 0) {
    return 1;
  }
  const joined = normalizeForSearch(keywords.join("\n"));
  for (const token of tokens) {
    if (!joined.includes(token)) {
      return 0;
    }
  }
  const title = normalizeForSearch(keywords[0] ?? "");
  if (tokens.every((token) => title.includes(token))) {
    return 1;
  }
  const titleAndLabels = `${title} ${keywords
    .slice(2)
    .map(normalizeForSearch)
    .join(" ")}`;
  return tokens.every((token) => titleAndLabels.includes(token)) ? 0.9 : 0.7;
}

export function matchSnippet(
  body: string,
  search: string,
  radius = 40,
): string | null {
  const tokens = normalizeForSearch(search).split(/\s+/).filter(Boolean);
  if (tokens.length === 0) {
    return null;
  }
  const chars = Array.from(body);
  let normalized = "";
  const indexMap: number[] = [];
  for (let i = 0; i < chars.length; i++) {
    const piece = normalizeForSearch(chars[i]);
    for (const c of Array.from(piece)) {
      normalized += c;
      indexMap.push(i);
    }
  }
  const hit = normalized.indexOf(tokens[0]);
  if (hit === -1) {
    return null;
  }
  const startChar = indexMap[hit];
  const endChar = indexMap[hit + tokens[0].length - 1] + 1;
  const start = Math.max(0, startChar - radius);
  const end = Math.min(chars.length, endChar + radius);
  const snippet = chars.slice(start, end).join("").replace(/\s+/g, " ").trim();
  return `${start > 0 ? "…" : ""}${snippet}${end < chars.length ? "…" : ""}`;
}
