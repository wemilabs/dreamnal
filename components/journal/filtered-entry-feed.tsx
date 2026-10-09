"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { EntryFeed, type FeedEntry } from "@/components/journal/entry-feed";
import { matchesMeaningFilter, parseMeaningFilter } from "@/lib/meaning";

export function FilteredEntryFeed({
  entries,
  empty,
}: {
  entries: FeedEntry[];
  empty: ReactNode;
}) {
  const t = useTranslations("Journal");
  const filter = parseMeaningFilter(useSearchParams().get("filter"));
  const visible = entries.filter((entry) =>
    matchesMeaningFilter(entry, filter),
  );

  if (visible.length === 0) {
    if (filter === "interpreted") {
      return (
        <p className="text-control text-muted-foreground">
          {t("noInterpretedDreams")}
        </p>
      );
    }
    if (filter === "fulfilled") {
      return (
        <p className="text-control text-muted-foreground">
          {t("noFulfilledDreams")}
        </p>
      );
    }
    return empty;
  }

  return <EntryFeed entries={visible} />;
}
