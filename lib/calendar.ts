export type CalendarDream = {
  id: string;
  title: string;
  source: "voice" | "text";
  audioDurationSeconds: number | null;
  createdAt: string;
  symbols: string[];
};

function localDate(year: number, month: number, day: number): Date {
  const date = new Date(year, month, day);
  if (year >= 0 && year < 100) {
    date.setFullYear(year);
  }
  return date;
}

export function dayKey(date: Date): string {
  const year = String(date.getFullYear()).padStart(4, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function monthKey(date: Date): string {
  const year = String(date.getFullYear()).padStart(4, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export function parseMonthKey(s: string | null): Date | null {
  if (s === null || !/^\d{4}-(0[1-9]|1[0-2])$/.test(s)) {
    return null;
  }
  const [year, month] = s.split("-").map(Number);
  return localDate(year, month - 1, 1);
}

export function parseDayKey(s: string): Date {
  const [year, month, day] = s.split("-").map(Number);
  return localDate(year, month - 1, day);
}

export function groupByDay(
  dreams: CalendarDream[],
): Map<string, CalendarDream[]> {
  const groups = new Map<string, CalendarDream[]>();
  for (const dream of dreams) {
    const key = dayKey(new Date(dream.createdAt));
    const group = groups.get(key);
    if (group) {
      group.push(dream);
    } else {
      groups.set(key, [dream]);
    }
  }
  for (const group of groups.values()) {
    group.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  }
  return groups;
}

function stepDay(date: Date, amount: number): Date {
  return localDate(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + amount,
  );
}

export function streaks(
  days: Set<string>,
  today: Date,
): { current: number; longest: number } {
  const todayKey = dayKey(today);
  let cursor = days.has(todayKey) ? today : stepDay(today, -1);
  let current = 0;
  while (days.has(dayKey(cursor))) {
    current += 1;
    cursor = stepDay(cursor, -1);
  }

  const sortedDays = [...days].sort();
  let longest = 0;
  let run = 0;
  let previous: Date | null = null;
  for (const key of sortedDays) {
    const date = parseDayKey(key);
    if (previous && dayKey(stepDay(previous, 1)) === key) {
      run += 1;
    } else {
      run = 1;
    }
    longest = Math.max(longest, run);
    previous = date;
  }

  return { current, longest };
}

export function intensity(count: number): 0 | 1 | 2 | 3 {
  if (count <= 0) {
    return 0;
  }
  if (count === 1) {
    return 1;
  }
  if (count === 2) {
    return 2;
  }
  return 3;
}
