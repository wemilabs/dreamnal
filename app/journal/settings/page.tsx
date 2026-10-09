import { Settings } from "lucide-react";
import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/journal/placeholder-page";

export const metadata: Metadata = {
  title: "Settings",
  description: "Profile, recording preferences, and data export.",
};

export default function SettingsPage() {
  return (
    <PlaceholderPage
      title="Settings"
      description="Profile, recording preferences, and data export."
      icon={Settings}
    />
  );
}
