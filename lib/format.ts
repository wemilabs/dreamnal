const entryDateFmt = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

export function formatEntryDate(date: Date | string): string {
  const parts = Object.fromEntries(
    entryDateFmt.formatToParts(new Date(date)).map((p) => [p.type, p.value]),
  );
  return `${parts.weekday} ${parts.day} ${parts.month} · ${parts.hour}:${parts.minute} ${parts.dayPeriod}`.toUpperCase();
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function titleFallback(body: string): string {
  const words = body.trim().split(/\s+/);
  const first = words.slice(0, 8).join(" ");
  return words.length > 8 ? `${first}…` : first;
}
