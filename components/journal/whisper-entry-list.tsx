import { Feather } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { EntryFeed } from "@/components/journal/entry-feed";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { listWhisperEntries } from "@/lib/entries";

export async function WhisperEntryList() {
  const [entries, t] = await Promise.all([
    listWhisperEntries(),
    getTranslations("Journal"),
  ]);

  if (entries.length === 0) {
    return (
      <Empty className="rounded-lg border border-border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Feather aria-hidden />
          </EmptyMedia>
          <EmptyTitle>{t("noWhispers")}</EmptyTitle>
          <EmptyDescription>{t("noWhispersHint")}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <EntryFeed
      from="/journal/whispers"
      kind="whisper"
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
