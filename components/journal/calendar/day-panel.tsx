"use client";

import { Mic, PenLine } from "lucide-react";
import type { Route } from "next";
import { useComposer } from "@/components/journal/composer/composer-provider";
import { IntentPrefetchLink } from "@/components/journal/intent-prefetch-link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CalendarDream } from "@/lib/calendar";
import { dayKey, parseDayKey } from "@/lib/calendar";
import { calendarCopy } from "@/lib/calendar-copy";
import { formatDuration } from "@/lib/format";

function DreamRow({ dream }: { dream: CalendarDream }) {
  const createdAt = new Date(dream.createdAt);
  return (
    <li className="border-b border-border py-3 last:border-0">
      <IntentPrefetchLink
        href={`/journal/${dream.id}` as Route}
        className="pressable flex w-full flex-col items-start gap-1.5"
      >
        <span className="block w-full text-control text-foreground">
          {dream.title}
        </span>
        <span className="flex items-center font-mono text-xs text-muted-foreground">
          {dream.source === "voice" ? (
            <Mic className="size-3.5" aria-hidden />
          ) : (
            <PenLine className="size-3.5" aria-hidden />
          )}
          <time dateTime={dream.createdAt} className="ml-1.5 tabular-nums">
            {calendarCopy.time(createdAt)}
          </time>
          {dream.source === "voice" && dream.audioDurationSeconds != null ? (
            <span> · {formatDuration(dream.audioDurationSeconds)}</span>
          ) : null}
        </span>
        {dream.symbols.length > 0 ? (
          <span className="flex w-full flex-wrap gap-1.5">
            {dream.symbols.map((symbol) => (
              <Badge
                key={symbol}
                variant="outline"
                className="h-auto px-1.5 py-0.5 text-xs"
              >
                {symbol}
              </Badge>
            ))}
          </span>
        ) : null}
      </IntentPrefetchLink>
    </li>
  );
}

type DayPanelProps = {
  selectedDay: string | null;
  displayedMonth: Date;
  groups: Map<string, CalendarDream[]>;
  today: Date;
};

export function DayPanel({
  selectedDay,
  displayedMonth,
  groups,
  today,
}: DayPanelProps) {
  const { startRecording, startTyping } = useComposer();
  const selectedDate = selectedDay ? parseDayKey(selectedDay) : null;
  const selectedDreams = selectedDay ? (groups.get(selectedDay) ?? []) : [];
  const selectedDateIsPastOrToday =
    selectedDate !== null && selectedDate <= today;
  const monthGroups = [...groups.entries()]
    .filter(([key]) =>
      key.startsWith(
        `${displayedMonth.getFullYear()}-${String(displayedMonth.getMonth() + 1).padStart(2, "0")}`,
      ),
    )
    .sort(([a], [b]) => b.localeCompare(a));

  return (
    <section className="flex min-h-72 flex-col rounded-lg border border-border bg-card/60 p-4">
      {selectedDate ? (
        <>
          <h2 className="font-display text-subhead text-foreground">
            {calendarCopy.dayTitle(selectedDate)}
          </h2>
          {selectedDreams.length > 0 ? (
            <ul className="mt-2 flex flex-col">
              {selectedDreams.map((dream) => (
                <DreamRow key={dream.id} dream={dream} />
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-control text-muted-foreground">
              {calendarCopy.noDreamsThisDay}
            </p>
          )}
          {selectedDateIsPastOrToday ? (
            <div className="mt-auto pt-6">
              {selectedDay !== dayKey(today) ? (
                <p className="mb-3 font-mono text-xs uppercase tracking-caps text-muted-foreground">
                  {calendarCopy.addDreamForDay}
                </p>
              ) : null}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    startRecording({ day: selectedDay ?? undefined })
                  }
                >
                  <Mic aria-hidden />
                  {calendarCopy.record}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => startTyping({ day: selectedDay ?? undefined })}
                >
                  <PenLine aria-hidden />
                  {calendarCopy.type}
                </Button>
              </div>
            </div>
          ) : null}
        </>
      ) : (
        <>
          <h2 className="font-display text-subhead text-foreground">
            {calendarCopy.monthTitle(displayedMonth)}
          </h2>
          {monthGroups.length > 0 ? (
            <div className="mt-2 flex flex-col">
              {monthGroups.map(([key, dreams]) => {
                const date = parseDayKey(key);
                return (
                  <section
                    key={key}
                    className="border-b border-border py-2 last:border-0"
                  >
                    <h3 className="font-mono text-xs tracking-caps text-muted-foreground">
                      {calendarCopy.dayTitle(date)}
                    </h3>
                    <ul className="flex flex-col">
                      {dreams.map((dream) => (
                        <DreamRow key={dream.id} dream={dream} />
                      ))}
                    </ul>
                  </section>
                );
              })}
            </div>
          ) : (
            <p className="mt-4 text-control text-muted-foreground">
              {calendarCopy.noDreamsThisMonth}
            </p>
          )}
        </>
      )}
    </section>
  );
}
