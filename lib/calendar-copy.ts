import type { AppLocale } from "@/i18n/routing";

function dateLocale(locale: AppLocale) {
  return locale === "fr" ? "fr-FR" : "en-US";
}

export function formatCalendarDay(date: Date, locale: AppLocale): string {
  return new Intl.DateTimeFormat(dateLocale(locale), {
    weekday: "long",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function formatCalendarMonth(date: Date, locale: AppLocale): string {
  return new Intl.DateTimeFormat(dateLocale(locale), {
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatCalendarMonthShort(
  date: Date,
  locale: AppLocale,
): string {
  return new Intl.DateTimeFormat(dateLocale(locale), {
    month: "short",
  }).format(date);
}

export function formatCalendarDayShort(date: Date, locale: AppLocale): string {
  return new Intl.DateTimeFormat(dateLocale(locale), {
    month: "short",
    day: "numeric",
  }).format(date);
}

export function formatCalendarTime(date: Date, locale: AppLocale): string {
  return new Intl.DateTimeFormat(dateLocale(locale), {
    hour: "numeric",
    minute: "2-digit",
    ...(locale === "en" ? { hour12: true } : { hour12: false }),
  }).format(date);
}
