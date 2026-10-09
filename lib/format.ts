import type { AppLocale } from "@/i18n/routing";

export function formatEntryDate(
  date: Date | string,
  locale: AppLocale = "en",
): string {
  const formatter = new Intl.DateTimeFormat(
    locale === "fr" ? "fr-FR" : "en-GB",
    {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
      ...(locale === "en" ? { hour12: true } : { hour12: false }),
    },
  );
  const parts = Object.fromEntries(
    formatter.formatToParts(new Date(date)).map((p) => [p.type, p.value]),
  );
  return locale === "en"
    ? `${parts.weekday} ${parts.day} ${parts.month} · ${parts.hour}:${parts.minute} ${parts.dayPeriod}`
    : `${parts.weekday} ${parts.day} ${parts.month} · ${parts.hour}:${parts.minute}`;
}

export function formatDay(isoDate: string, locale: AppLocale = "en"): string {
  return new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${isoDate}T00:00:00.000Z`));
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
