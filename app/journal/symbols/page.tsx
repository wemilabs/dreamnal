import { Tags } from "lucide-react";
import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/journal/placeholder-page";

export const metadata: Metadata = {
  title: "Symbols & tags",
};

export default function SymbolsPage() {
  return (
    <PlaceholderPage
      title="Symbols & tags"
      description="The people, places, and motifs that keep showing up in your dreams."
      icon={Tags}
    />
  );
}
