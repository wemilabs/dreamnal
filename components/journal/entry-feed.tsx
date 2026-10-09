"use client";

import { Check, Mic, PenLine } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useSyncExternalStore, ViewTransition } from "react";
import { EntryListSkeleton } from "@/components/journal/entry-list-skeleton";
import { IntentPrefetchLink } from "@/components/journal/intent-prefetch-link";
import { Badge } from "@/components/ui/badge";
import type { AppHref } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { dayKey } from "@/lib/calendar";
import { formatDuration, titleFallback } from "@/lib/format";
import type { SymbolItem, SymbolKind } from "@/lib/symbols/schema";

export type FeedEntry = {
  id: string;
  title: string | null;
  excerpt: string;
  source: "voice" | "text";
  audioDurationSeconds: number | null;
  createdAt: string;
  symbols: SymbolItem[];
  meaningConfidence: number | null;
  fulfilledOn: string | null;
  hasMeaning: boolean;
};

const subscribeNoop = () => () => {};

const kindDot: Record<SymbolKind, string> = {
  person: "bg-kind-person",
  place: "bg-kind-place",
  thing: "bg-kind-thing",
  feeling: "bg-kind-feeling",
};

function dayLabel(
  date: Date,
  now: Date,
  locale: AppLocale,
  labels: { today: string; yesterday: string },
): string {
  const yesterday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 1,
  );
  if (dayKey(date) === dayKey(now)) {
    return labels.today;
  }
  if (dayKey(date) === dayKey(yesterday)) {
    return labels.yesterday;
  }
  const dayFmt = new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  return date.getFullYear() === now.getFullYear()
    ? dayFmt.format(date)
    : `${dayFmt.format(date)} ${date.getFullYear()}`;
}

function groupByLocalDay(entries: FeedEntry[]) {
  const groups = new Map<string, { date: Date; entries: FeedEntry[] }>();
  for (const entry of entries) {
    const date = new Date(entry.createdAt);
    const key = dayKey(date);
    const group = groups.get(key);
    if (group) {
      group.entries.push(entry);
    } else {
      groups.set(key, { date, entries: [entry] });
    }
  }
  return [...groups];
}

export function EntryFeed({ entries }: { entries: FeedEntry[] }) {
  const locale = useLocale() as AppLocale;
  const tJournal = useTranslations("Journal");
  const tEntry = useTranslations("Entry");
  const now = useSyncExternalStore(
    subscribeNoop,
    () => new Date().toDateString(),
    () => null,
  );

  if (now === null) {
    return <EntryListSkeleton />;
  }

  const today = new Date(now);
  const latestId = entries[0]?.id;

  return (
    <div className="flex flex-col gap-10">
      {groupByLocalDay(entries).map(([key, group]) => (
        <section key={key} aria-labelledby={`day-${key}`}>
          <h2
            id={`day-${key}`}
            className="mb-3 flex items-baseline justify-between gap-4 text-control font-medium text-muted-foreground"
          >
            <span>
              {dayLabel(group.date, today, locale, {
                today: tJournal("today"),
                yesterday: tJournal("yesterday"),
              })}
            </span>
            {group.entries.length > 1 && (
              <span className="tabular-nums text-xs font-normal">
                {tEntry("entryDreams", { count: group.entries.length })}
              </span>
            )}
          </h2>
          <ol className="relative ml-1.5 flex flex-col gap-3 border-l border-border">
            {group.entries.map((entry) => (
              <ViewTransition key={entry.id} enter="reveal-in" default="none">
                <li className="group relative pl-5 sm:pl-6">
                  <span
                    aria-hidden
                    className={`absolute top-4.75 sm:top-5.75 left-[-5.5px] size-2.5 rounded-full bg-fold shadow-dot-glow ring-3 ring-background transition-shadow duration-300 group-hover:shadow-dot-glow-hover dark:bg-petal ${entry.id === latestId ? "motion-safe:animate-glow" : ""}`}
                  />
                  <EntryCard entry={entry} />
                </li>
              </ViewTransition>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}

function EntryCard({ entry }: { entry: FeedEntry }) {
  const locale = useLocale() as AppLocale;
  const tEntry = useTranslations("Entry");
  const tMeaning = useTranslations("Meaning");
  const confidenceLabels: Record<number, string> = {
    10: tMeaning("confidenceUnsure"),
    30: tMeaning("confidenceHunch"),
    50: tMeaning("confidencePossible"),
    75: tMeaning("confidenceLikely"),
    100: tMeaning("confidenceCertain"),
  };
  const confidence =
    entry.meaningConfidence === null
      ? null
      : (confidenceLabels[entry.meaningConfidence] ?? null);
  const badge = entry.fulfilledOn ? (
    <Badge variant="secondary">
      <Check data-icon="inline-start" />
      {tEntry("fulfilled")}
    </Badge>
  ) : entry.hasMeaning && confidence ? (
    <Badge variant="outline">{confidence}</Badge>
  ) : null;
  const title = (
    <span className="text-lead font-semibold tracking-tight text-foreground sm:text-subhead">
      {entry.title ?? titleFallback(entry.excerpt)}
    </span>
  );

  return (
    <IntentPrefetchLink
      href={`/journal/${entry.id}` as AppHref}
      className="flex flex-col gap-1 rounded-2xl bg-card p-4 sm:gap-1.5 sm:p-5 shadow-card ring-1 ring-border/60 outline-none transition-[translate,box-shadow,scale] duration-200 ease-out hover:shadow-card-hover focus-visible:ring-2 focus-visible:ring-ring motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-[0.99]"
      testId="entry-link"
    >
      <span className="flex items-center justify-between gap-3 tabular-nums text-xs text-muted-foreground">
        <time dateTime={entry.createdAt}>
          {new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-GB", {
            hour: "numeric",
            minute: "2-digit",
            ...(locale === "en" ? { hour12: true } : { hour12: false }),
          })
            .format(new Date(entry.createdAt))
            .toLowerCase()}
        </time>
        <span className="flex items-center gap-2">
          {badge}
          {entry.source === "voice" ? (
            <span className="flex items-center gap-1">
              <Mic className="size-3.5" aria-label={tEntry("voice")} />
              {entry.audioDurationSeconds != null &&
                formatDuration(entry.audioDurationSeconds)}
            </span>
          ) : (
            <PenLine className="size-3.5" aria-label={tEntry("typed")} />
          )}
        </span>
      </span>
      {entry.title != null ? (
        <ViewTransition
          name={`entry-title-${entry.id}`}
          share="title-morph"
          default="none"
        >
          {title}
        </ViewTransition>
      ) : (
        title
      )}
      <span className="line-clamp-2 text-sm leading-body text-muted-foreground">
        {entry.excerpt}
      </span>
      {entry.symbols.length > 0 && (
        <span className="mt-2.5 flex flex-wrap gap-1.5">
          {entry.symbols.map((symbol) => (
            <span
              key={`${symbol.kind}:${symbol.label}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground ring-1 ring-border"
            >
              <span
                className={`size-1.5 rounded-full ${kindDot[symbol.kind]}`}
                aria-hidden
              />
              {symbol.label}
            </span>
          ))}
        </span>
      )}
    </IntentPrefetchLink>
  );
}
