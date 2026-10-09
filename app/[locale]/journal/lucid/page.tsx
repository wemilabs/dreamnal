import { Eye } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PlaceholderPage } from "@/components/journal/placeholder-page";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Journal");
  return { title: t("navLucid") };
}

export default async function LucidPage() {
  const t = await getTranslations("Journal");
  return (
    <PlaceholderPage
      title={t("navLucid")}
      description={t("lucidDescription")}
      icon={Eye}
    />
  );
}
