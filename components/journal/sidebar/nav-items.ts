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
import type { Route } from "next";

export type JournalNavItem = {
  title: string;
  href: Route;
  icon: LucideIcon;
};

export const JOURNAL_NAV_ITEMS: JournalNavItem[] = [
  { title: "Journal", href: "/journal", icon: BookOpen },
  { title: "Calendar", href: "/journal/calendar", icon: CalendarDays },
  { title: "Insights", href: "/journal/insights", icon: ChartSpline },
  { title: "Symbols & tags", href: "/journal/symbols", icon: Tags },
  { title: "Favorites", href: "/journal/favorites", icon: Star },
  { title: "Lucid dreams", href: "/journal/lucid", icon: Eye },
];

export const JOURNAL_BOTTOM_NAV_ITEMS: JournalNavItem[] = [
  { title: "Trash", href: "/journal/trash", icon: Trash2 },
  { title: "Settings", href: "/journal/settings", icon: Settings },
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
  | { kind: "nav"; title: string }
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
  return match ? { kind: "nav", title: match.title } : { kind: "entry" };
}
