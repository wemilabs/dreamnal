import { ChartSpline } from "lucide-react";
import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/journal/placeholder-page";

export const metadata: Metadata = {
  title: "Insights",
};

export default function InsightsPage() {
  return (
    <PlaceholderPage
      title="Insights"
      description="Themes that keep coming back, and how often you record."
      icon={ChartSpline}
    />
  );
}
