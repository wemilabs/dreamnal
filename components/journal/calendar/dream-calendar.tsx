"use client";

import { useSearchParams } from "next/navigation";
import {
  createContext,
  useContext,
  useState,
  useSyncExternalStore,
} from "react";
import type { DayButtonProps } from "react-day-picker";
import { CalendarSkeleton } from "@/components/journal/calendar/calendar-skeleton";
import { DayPanel } from "@/components/journal/calendar/day-panel";
import { YearHeatmap } from "@/components/journal/calendar/year-heatmap";
import { Button } from "@/components/ui/button";
import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import {
  type CalendarDream,
  dayKey,
  groupByDay,
  intensity,
  monthKey,
  parseDayKey,
  parseMonthKey,
  streaks,
} from "@/lib/calendar";
import { calendarCopy } from "@/lib/calendar-copy";

const subscribeNoop = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => null;
const monthName = new Intl.DateTimeFormat("en-US", { month: "long" });
const DreamsByDayContext = createContext<Map<string, CalendarDream[]> | null>(
  null,
);

function clampMonth(date: Date, earliest: Date, latest: Date): Date {
  const key = monthKey(date);
  if (key < monthKey(earliest)) {
    return earliest;
  }
  if (key > monthKey(latest)) {
    return latest;
  }
  return date;
}

function CalendarDay({ day, children, ...props }: DayButtonProps) {
  const dreamsByDay = useContext(DreamsByDayContext);
  const key = dayKey(day.date);
  const count = dreamsByDay?.get(key)?.length ?? 0;
  const dayIntensity = intensity(count);
  const opacity = ["opacity-0", "opacity-40", "opacity-70", "opacity-100"][
    dayIntensity
  ];

  return (
    <CalendarDayButton
      day={day}
      {...props}
      aria-label={calendarCopy.dayWithCount(day.date, count)}
    >
      {children}
      <i
        className={`inline-block size-1 rounded-full bg-current ${opacity}`}
        aria-hidden="true"
      />
    </CalendarDayButton>
  );
}

export function DreamCalendar({ dreams }: { dreams: CalendarDream[] }) {
  const isReady = useSyncExternalStore(
    subscribeNoop,
    clientSnapshot,
    serverSnapshot,
  );
  const searchParams = useSearchParams();
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  if (isReady === null) {
    return <CalendarSkeleton />;
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const earliestYear = dreams.reduce(
    (year, dream) => Math.min(year, new Date(dream.createdAt).getFullYear()),
    today.getFullYear(),
  );
  const earliestMonth = new Date(
    Math.min(earliestYear, today.getFullYear()),
    0,
    1,
  );
  const requestedMonth =
    parseMonthKey(searchParams.get("month")) ?? currentMonth;
  const displayedMonth = clampMonth(
    requestedMonth,
    earliestMonth,
    currentMonth,
  );
  const dreamsByDay = groupByDay(dreams);
  const dayCounts = new Map<string, number>();
  for (const [key, entries] of dreamsByDay) {
    dayCounts.set(key, entries.length);
  }
  const monthNights = [...dreamsByDay.keys()].filter(
    (key) => monthKey(parseDayKey(key)) === monthKey(displayedMonth),
  ).length;
  const { current, longest } = streaks(new Set(dreamsByDay.keys()), today);

  const changeMonth = (requested: Date) => {
    const nextMonth = clampMonth(requested, earliestMonth, currentMonth);
    setSelectedDay(null);
    window.history.replaceState(null, "", `?month=${monthKey(nextMonth)}`);
  };

  const selectHeatmapDay = (date: Date) => {
    changeMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    setSelectedDay(dayKey(date));
  };

  const onSelectDay = (date: Date | undefined) => {
    if (!date) {
      setSelectedDay(null);
      return;
    }
    const dayMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    if (monthKey(dayMonth) !== monthKey(displayedMonth)) {
      changeMonth(dayMonth);
    }
    setSelectedDay(dayKey(date));
  };

  const goToToday = () => {
    changeMonth(currentMonth);
    setSelectedDay(dayKey(today));
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            label: calendarCopy.currentStreak,
            value: calendarCopy.days(current),
          },
          {
            label: calendarCopy.longestStreak,
            value: calendarCopy.days(longest),
          },
          {
            label: calendarCopy.nightsIn(monthName.format(displayedMonth)),
            value: monthNights,
          },
        ].map((tile) => (
          <div
            key={tile.label}
            className="rounded-lg border border-border bg-card/60 p-4"
          >
            <p className="font-mono text-xs uppercase tracking-caps text-muted-foreground">
              {tile.label}
            </p>
            <p className="mt-3 font-display text-section-title leading-none text-foreground">
              {tile.value}
            </p>
          </div>
        ))}
      </div>

      <YearHeatmap
        year={displayedMonth.getFullYear()}
        counts={dayCounts}
        today={today}
        onSelectDay={selectHeatmapDay}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <DreamsByDayContext.Provider value={dreamsByDay}>
          <section className="rounded-lg border border-border bg-card/60 p-4">
            <div className="mb-3 flex justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={goToToday}
              >
                {calendarCopy.today}
              </Button>
            </div>
            <Calendar
              mode="single"
              selected={selectedDay ? parseDayKey(selectedDay) : undefined}
              onSelect={onSelectDay}
              month={displayedMonth}
              onMonthChange={changeMonth}
              captionLayout="dropdown"
              startMonth={earliestMonth}
              endMonth={currentMonth}
              disabled={{ after: today }}
              showOutsideDays
              className="w-full [--cell-size:--spacing(11)] md:[--cell-size:--spacing(14)]"
              classNames={{
                months: "relative flex w-full flex-col gap-4 md:flex-row",
                month: "flex w-full flex-col gap-4",
                month_grid: "w-full border-collapse",
                weekdays: "flex w-full",
                week: "mt-2 flex w-full",
              }}
              components={{ DayButton: CalendarDay }}
            />
          </section>
        </DreamsByDayContext.Provider>
        <DayPanel
          selectedDay={selectedDay}
          displayedMonth={displayedMonth}
          groups={dreamsByDay}
          today={today}
        />
      </div>
    </div>
  );
}
