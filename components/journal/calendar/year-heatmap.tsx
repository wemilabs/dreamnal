"use client";

import { dayKey, intensity, parseDayKey } from "@/lib/calendar";
import { calendarCopy } from "@/lib/calendar-copy";

const levelClasses = {
  0: "bg-muted",
  1: "bg-primary/30",
  2: "bg-primary/60",
  3: "bg-primary",
} as const;

type YearHeatmapProps = {
  year: number;
  counts: Map<string, number>;
  today: Date;
  onSelectDay: (date: Date) => void;
};

type HeatmapDay = { key: string; inYear: boolean };

function weeksInYear(year: number): HeatmapDay[][] {
  const firstDay = new Date(year, 0, 1);
  const firstSunday = new Date(year, 0, 1 - firstDay.getDay());
  return Array.from({ length: 53 }, (_, week) =>
    Array.from({ length: 7 }, (_, day) => {
      const date = new Date(
        firstSunday.getFullYear(),
        firstSunday.getMonth(),
        firstSunday.getDate() + week * 7 + day,
      );
      return {
        key: dayKey(date),
        inYear: date.getFullYear() === year,
      };
    }),
  );
}

export function YearHeatmap({
  year,
  counts,
  today,
  onSelectDay,
}: YearHeatmapProps) {
  const weeks = weeksInYear(year);
  const yearNights = [...counts].filter(
    ([key, count]) => key.startsWith(`${year}-`) && count > 0,
  ).length;
  const monthStarts = Array.from({ length: 12 }, (_, month) => {
    const firstDay = new Date(year, month, 1);
    const firstWeek = weeks.findIndex((week) =>
      week.some((day) => day.key === dayKey(firstDay)),
    );
    return { column: firstWeek, label: calendarCopy.monthShort(firstDay) };
  });

  return (
    <section className="flex flex-col gap-4 rounded-lg border border-border bg-card/60 p-4">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-subhead font-semibold text-foreground">{year}</h2>
        <p className="text-control text-muted-foreground">
          {calendarCopy.nights(yearNights)}
        </p>
      </div>
      <div
        className="overflow-x-auto pb-1"
        ref={(node) => {
          if (!node) {
            return;
          }
          if (year !== today.getFullYear()) {
            node.scrollLeft = 0;
            delete node.dataset.scrolledYear;
            return;
          }
          if (node.dataset.scrolledYear === String(year)) {
            return;
          }
          const todayCell = node.querySelector<HTMLElement>(
            `[data-heatmap-day="${dayKey(today)}"]`,
          );
          if (!todayCell) {
            return;
          }
          const containerBounds = node.getBoundingClientRect();
          const cellBounds = todayCell.getBoundingClientRect();
          const centeredScroll =
            node.scrollLeft +
            cellBounds.left -
            containerBounds.left -
            (node.clientWidth - cellBounds.width) / 2;
          node.scrollLeft = Math.max(
            0,
            Math.min(centeredScroll, node.scrollWidth - node.clientWidth),
          );
          node.dataset.scrolledYear = String(year);
        }}
      >
        <div className="flex w-max gap-2">
          <div
            className="mt-6 grid w-6 shrink-0 grid-rows-7 gap-y-[3px] font-mono text-xs text-muted-foreground"
            aria-hidden="true"
          >
            {calendarCopy.heatmapWeekdays.map(({ key, label }) => (
              <span key={key} className="flex h-3 items-center leading-3">
                {label}
              </span>
            ))}
          </div>
          <div>
            <div
              className="mb-2 grid h-4 gap-x-[3px] font-mono text-xs text-muted-foreground"
              style={{ gridTemplateColumns: "repeat(53, 0.75rem)" }}
              aria-hidden="true"
            >
              {monthStarts.map(({ column, label }) => (
                <span key={label} style={{ gridColumn: column + 1 }}>
                  {label}
                </span>
              ))}
            </div>
            <div
              className="grid gap-x-[3px]"
              style={{ gridTemplateColumns: "repeat(53, 0.75rem)" }}
            >
              {weeks.map((week) => (
                <div key={week[0].key} className="grid grid-rows-7 gap-y-[3px]">
                  {week.map(({ key, inYear }) => {
                    if (!inYear) {
                      return (
                        <span key={key} className="size-3" aria-hidden="true" />
                      );
                    }
                    const date = parseDayKey(key);
                    const count = counts.get(key) ?? 0;
                    const future = date > today;

                    return (
                      <button
                        key={key}
                        data-heatmap-day={key}
                        type="button"
                        disabled={future}
                        onClick={() => onSelectDay(date)}
                        className={`size-3 rounded-[2px] ${levelClasses[intensity(count)]} ${
                          future
                            ? "cursor-default opacity-30"
                            : "cursor-pointer hover:ring-1 hover:ring-ring focus-visible:outline-2 focus-visible:outline-ring"
                        }`}
                        aria-label={calendarCopy.dayWithCount(date, count)}
                        title={calendarCopy.dayWithCount(date, count)}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end gap-2 font-mono text-xs text-muted-foreground">
        <span>{calendarCopy.less}</span>
        {[0, 1, 2, 3].map((level) => (
          <span
            key={level}
            className={`size-3 rounded-[2px] ${levelClasses[level as 0 | 1 | 2 | 3]}`}
            aria-hidden="true"
          />
        ))}
        <span>{calendarCopy.more}</span>
      </div>
    </section>
  );
}
