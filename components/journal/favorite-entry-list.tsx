import { Star } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { EntryFeed } from "@/components/journal/entry-feed";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { listFavoriteEntries } from "@/lib/entries";

export async function FavoriteEntryList() {
  const [entries, t] = await Promise.all([
    listFavoriteEntries(),
    getTranslations("Journal"),
  ]);

  if (entries.length === 0) {
    return (
      <Empty className="rounded-lg border border-border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Star aria-hidden />
          </EmptyMedia>
          <EmptyTitle>{t("noFavoriteDreams")}</EmptyTitle>
          <EmptyDescription>{t("noFavoriteDreamsHint")}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <EntryFeed
      entries={entries.map((entry) => ({
        id: entry.id,
        title: entry.title,
        excerpt: entry.excerpt,
        source: entry.source,
        audioDurationSeconds: entry.audioDurationSeconds,
        createdAt: entry.createdAt.toISOString(),
        symbols: entry.symbols.slice(0, 3),
        meaningConfidence: entry.meaningConfidence,
        fulfilledOn: entry.fulfilledOn,
        hasMeaning: entry.hasMeaning,
        lucid: entry.lucid,
        favorite: entry.favorite,
      }))}
    />
  );
}
