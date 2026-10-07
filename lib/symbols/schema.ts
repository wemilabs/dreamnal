import { z } from "zod";

export const SYMBOL_KINDS = ["person", "place", "thing", "feeling"] as const;
export type SymbolKind = (typeof SYMBOL_KINDS)[number];

export const symbolItem = z.object({
  kind: z.enum(SYMBOL_KINDS),
  label: z.string(),
});
export type SymbolItem = z.infer<typeof symbolItem>;

export const symbolsPayload = z.object({
  v: z.literal(1),
  source: z.enum(["ai", "user"]),
  items: z.array(symbolItem).max(40),
});
export type SymbolsPayload = z.infer<typeof symbolsPayload>;

export function normalizeLabel(value: string): string | null {
  const label = value
    .normalize("NFC")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
  return label.length > 0 && label.length <= 60 ? label : null;
}

export function cleanItems(
  items: readonly SymbolItem[],
  max: number,
): SymbolItem[] {
  const seen = new Set<string>();
  const out: SymbolItem[] = [];
  for (const item of items) {
    const label = normalizeLabel(item.label);
    if (label === null) {
      continue;
    }
    const key = `${item.kind}${label}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    out.push({ kind: item.kind, label });
    if (out.length >= max) {
      break;
    }
  }
  return out;
}
