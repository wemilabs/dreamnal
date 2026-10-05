import { CalendarDays } from "lucide-react";
import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/journal/placeholder-page";

export const metadata: Metadata = {
  title: "Calendar",
};

export default function CalendarPage() {
  return (
    <PlaceholderPage
      title="Calendar"
      description="Every night you recorded, laid out by month, with your streaks."
      icon={CalendarDays}
    />
  );
}
