"use client";

import { useTranslations } from "next-intl";
import type { SymbolKind } from "@/lib/symbols/schema";

const kindKeys = {
  person: "people",
  place: "places",
  thing: "things",
  feeling: "feelings",
} as const satisfies Record<SymbolKind, string>;

export function useSymbolsCopy() {
  const t = useTranslations("Symbols");
  return {
    footer: t("footer"),
    empty: t("empty"),
    noRecurring: t("noRecurring"),
    kinds: Object.fromEntries(
      Object.entries(kindKeys).map(([kind, key]) => [kind, t(key)]),
    ) as Record<SymbolKind, string>,
    allSymbols: t("allSymbols"),
    dreams: (count: number) => t("dreams", { count }),
    lastOn: t("lastOn"),
    saveError: t("saveError"),
    entryTags: {
      heading: t("heading"),
      none: t("none"),
      addPlaceholder: t("addPlaceholder"),
      add: t("add"),
      kindLabel: t("kind"),
      remove: (label: string) => t("remove", { label }),
    },
    untitled: t("untitled"),
  };
}
