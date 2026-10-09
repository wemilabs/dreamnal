import {
  BookOpen,
  CalendarDays,
  ChartSpline,
  Eye,
  type LucideIcon,
  Settings,
  Star,
  Tags,
  Trash2,
} from "lucide-react";
import type { AppHref } from "@/i18n/navigation";

export type JournalNavItem = {
  titleKey:
    | "navJournal"
    | "navCalendar"
    | "navInsights"
    | "navSymbols"
    | "navFavorites"
    | "navLucid"
    | "navTrash"
    | "navSettings";
  href: AppHref;
  icon: LucideIcon;
};

export const JOURNAL_NAV_ITEMS: JournalNavItem[] = [
  { titleKey: "navJournal", href: "/journal", icon: BookOpen },
  { titleKey: "navCalendar", href: "/journal/calendar", icon: CalendarDays },
  { titleKey: "navInsights", href: "/journal/insights", icon: ChartSpline },
  { titleKey: "navSymbols", href: "/journal/symbols", icon: Tags },
  { titleKey: "navFavorites", href: "/journal/favorites", icon: Star },
  { titleKey: "navLucid", href: "/journal/lucid", icon: Eye },
];

export const JOURNAL_BOTTOM_NAV_ITEMS: JournalNavItem[] = [
  { titleKey: "navTrash", href: "/journal/trash", icon: Trash2 },
  { titleKey: "navSettings", href: "/journal/settings", icon: Settings },
];

export const JOURNAL_NAV_LINKS = [
  ...JOURNAL_NAV_ITEMS,
  ...JOURNAL_BOTTOM_NAV_ITEMS,
];

const KNOWN_HREFS = new Set<string>(JOURNAL_NAV_LINKS.map((i) => i.href));

export function isNavItemActive(
  item: JournalNavItem,
  pathname: string,
): boolean {
  if (item.href !== "/journal") {
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  }
  return (
    pathname === "/journal" ||
    (/^\/journal\/[^/]+$/.test(pathname) && !KNOWN_HREFS.has(pathname))
  );
}

export type JournalCrumb =
  | { kind: "journal" }
  | { kind: "nav"; titleKey: JournalNavItem["titleKey"] }
  | { kind: "entry" };

export function crumbForPathname(pathname: string): JournalCrumb {
  if (pathname === "/journal") {
    return { kind: "journal" };
  }
  const match = JOURNAL_NAV_LINKS.find(
    (item) =>
      item.href !== "/journal" &&
      (pathname === item.href || pathname.startsWith(`${item.href}/`)),
  );
  return match ? { kind: "nav", titleKey: match.titleKey } : { kind: "entry" };
}
