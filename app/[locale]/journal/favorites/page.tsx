import { Star } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PlaceholderPage } from "@/components/journal/placeholder-page";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Journal");
  return { title: t("navFavorites") };
}

export default async function FavoritesPage() {
  const t = await getTranslations("Journal");
  return (
    <PlaceholderPage
      title={t("navFavorites")}
      description={t("favoritesDescription")}
      icon={Star}
    />
  );
}
