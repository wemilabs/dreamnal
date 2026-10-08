export const calendarCopy = {
  title: "Calendar",
  currentStreak: "Current streak",
  longestStreak: "Longest streak",
  nightsIn: (month: string) => `Nights in ${month}`,
  days: (count: number) => (count === 1 ? "day" : "days"),
  heatmapWeekdays: [
    { key: "sun", label: "" },
    { key: "mon", label: "Mon" },
    { key: "tue", label: "" },
    { key: "wed", label: "Wed" },
    { key: "thu", label: "" },
    { key: "fri", label: "Fri" },
    { key: "sat", label: "" },
  ],
  dreams: (count: number) => `${count} ${count === 1 ? "dream" : "dreams"}`,
  nights: (count: number) => `${count} ${count === 1 ? "night" : "nights"}`,
  less: "Less",
  more: "More",
  noDreamsThisDay: "No dreams recorded this day.",
  noDreamsThisMonth: "No dreams this month yet.",
  addDreamForDay: "Add a dream for this day",
  record: "Record",
  type: "Type",
  today: "Today",
  forDay: (date: string) => `For ${date}`,
  dayTitle: (date: Date) =>
    new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    }).format(date),
  monthTitle: (date: Date) =>
    new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
    }).format(date),
  monthShort: (date: Date) =>
    new Intl.DateTimeFormat("en-US", { month: "short" }).format(date),
  time: (date: Date) =>
    new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
    }).format(date),
  dayWithCount: (date: Date, count: number) =>
    `${new Intl.DateTimeFormat("en-US", {
      month: "short",
    }).format(date)} ${date.getDate()}: ${count} ${
      count === 1 ? "dream" : "dreams"
    }`,
};
