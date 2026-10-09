import { Star } from "lucide-react";
import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/journal/placeholder-page";

export const metadata: Metadata = {
  title: "Favorites",
  description: "The dreams you starred.",
};

export default function FavoritesPage() {
  return (
    <PlaceholderPage
      title="Favorites"
      description="The dreams you starred."
      icon={Star}
    />
  );
}
