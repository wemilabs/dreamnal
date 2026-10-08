"use client";

import { Mic, PenLine } from "lucide-react";
import type { Route } from "next";
import { useSyncExternalStore, ViewTransition } from "react";
import { EntryListSkeleton } from "@/components/journal/entry-list-skeleton";
import { IntentPrefetchLink } from "@/components/journal/intent-prefetch-link";
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
};

const subscribeNoop = () => () => {};

const timeFmt = new Intl.DateTimeFormat("en-GB", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});
const dayFmt = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

const kindDot: Record<SymbolKind, string> = {
  person: "bg-kind-person",
  place: "bg-kind-place",
  thing: "bg-kind-thing",
  feeling: "bg-kind-feeling",
};

function dayLabel(date: Date, now: Date): string {
  const yesterday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 1,
  );
  if (dayKey(date) === dayKey(now)) {
    return "Today";
  }
  if (dayKey(date) === dayKey(yesterday)) {
    return "Yesterday";
  }
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
            <span>{dayLabel(group.date, today)}</span>
            {group.entries.length > 1 && (
              <span className="tabular-nums text-xs font-normal">
                {group.entries.length} dreams
              </span>
            )}
          </h2>
          <ol className="relative ml-1.5 flex flex-col gap-3 border-l border-border">
            {group.entries.map((entry) => (
              <ViewTransition key={entry.id} enter="reveal-in" default="none">
                <li className="group relative pl-5 sm:pl-6">
                  <span
                    aria-hidden
                    className={`absolute top-4.75 sm:top-5.75 -left-[5.5px] size-2.5 rounded-full bg-fold shadow-dot-glow ring-3 ring-background transition-shadow duration-300 group-hover:shadow-dot-glow-hover dark:bg-petal ${entry.id === latestId ? "motion-safe:animate-glow" : ""}`}
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
  const title = (
    <span className="text-lead font-semibold tracking-tight text-foreground sm:text-subhead">
      {entry.title ?? titleFallback(entry.excerpt)}
    </span>
  );

  return (
    <IntentPrefetchLink
      href={`/journal/${entry.id}` as Route}
      className="flex flex-col gap-1 rounded-2xl bg-card p-4 sm:gap-1.5 sm:p-5 shadow-card ring-1 ring-border/60 outline-none transition-[translate,box-shadow,scale] duration-200 ease-out hover:shadow-card-hover focus-visible:ring-2 focus-visible:ring-ring motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-[0.99]"
      testId="entry-link"
    >
      <span className="flex items-center justify-between gap-3 tabular-nums text-xs text-muted-foreground">
        <time dateTime={entry.createdAt}>
          {timeFmt.format(new Date(entry.createdAt)).toLowerCase()}
        </time>
        {entry.source === "voice" ? (
          <span className="flex items-center gap-1">
            <Mic className="size-3.5" aria-label="Voice" />
            {entry.audioDurationSeconds != null &&
              formatDuration(entry.audioDurationSeconds)}
          </span>
        ) : (
          <PenLine className="size-3.5" aria-label="Typed" />
        )}
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
