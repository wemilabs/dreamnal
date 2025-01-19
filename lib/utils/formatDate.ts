import {
  format,
  formatDistanceToNow,
  isToday,
  isYesterday,
  isThisWeek,
  isThisYear,
} from "date-fns";

/**
 * Formats a date in a relative way, similar to social media apps:
 * - For today: Shows time (e.g., "2:30 PM")
 * - For yesterday: Shows "Yesterday"
 * - For this week: Shows day name (e.g., "Wednesday")
 * - For this year: Shows month and day (e.g., "January 15")
 * - For older dates: Shows full date (e.g., "January 15, 2024")
 */
export function formatRelativeDate(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isToday(dateObj)) {
    return format(dateObj, "h:mm a"); // "2:30 PM"
  }

  if (isYesterday(dateObj)) {
    return "Yesterday";
  }

  if (isThisWeek(dateObj)) {
    return format(dateObj, "EEEE"); // "Wednesday"
  }

  if (isThisYear(dateObj)) {
    return format(dateObj, "MMMM d"); // "January 15"
  }

  return format(dateObj, "MMMM d, yyyy"); // "January 15, 2024"
}

/**
 * Returns a more detailed timestamp for dream details:
 * - For today: "Today at 2:30 PM"
 * - For yesterday: "Yesterday at 2:30 PM"
 * - For older dates: "January 15 at 2:30 PM"
 */
export function formatDetailedDate(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const timeStr = format(dateObj, "h:mm a");

  if (isToday(dateObj)) {
    return `Today at ${timeStr}`;
  }

  if (isYesterday(dateObj)) {
    return `Yesterday at ${timeStr}`;
  }

  return `${format(dateObj, "MMMM d")} at ${timeStr}`;
}
