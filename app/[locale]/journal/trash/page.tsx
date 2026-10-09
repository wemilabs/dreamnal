import { Trash2 } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PlaceholderPage } from "@/components/journal/placeholder-page";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Journal");
  return { title: t("navTrash") };
}

export default async function TrashPage() {
  const t = await getTranslations("Journal");
  return (
    <PlaceholderPage
      title={t("navTrash")}
      description={t("trashDescription")}
      icon={Trash2}
    />
  );
}
