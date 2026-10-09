import { Eye } from "lucide-react";
import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/journal/placeholder-page";

export const metadata: Metadata = {
  title: "Lucid dreams",
  description: "Every dream you marked as lucid.",
};

export default function LucidPage() {
  return (
    <PlaceholderPage
      title="Lucid dreams"
      description="Every dream you marked as lucid."
      icon={Eye}
    />
  );
}
