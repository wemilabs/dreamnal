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
import type { EntryKind } from "@/lib/entry-kind";

export async function FavoriteEntryList({ kind }: { kind: EntryKind }) {
  const [entries, t] = await Promise.all([
    listFavoriteEntries(kind),
    getTranslations("Journal"),
  ]);

  if (entries.length === 0) {
    const isDream = kind === "dream";
    return (
      <Empty className="rounded-lg border border-border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Star aria-hidden />
          </EmptyMedia>
          <EmptyTitle>
            {t(isDream ? "noFavoriteDreams" : "noFavoriteWhispers")}
          </EmptyTitle>
          <EmptyDescription>
            {t(isDream ? "noFavoriteDreamsHint" : "noFavoriteWhispersHint")}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <EntryFeed
      kind={kind}
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
