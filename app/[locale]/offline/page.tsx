import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { RetryButton } from "@/components/pwa/retry-button";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Offline");
  return { title: t("title"), robots: { index: false } };
}

export const ensureStatic = "navigation";

export default async function OfflinePage() {
  const t = await getTranslations("Offline");
  return (
    <div
      className="flex min-h-svh flex-col items-center justify-center gap-6 px-6 text-center"
      style={{ backgroundImage: "var(--hero-bg)" }}
    >
      <h1 className="font-display text-headline tracking-display text-foreground">
        {t("title")}
      </h1>
      <p className="text-lead text-muted-foreground">{t("description")}</p>
      <RetryButton />
    </div>
  );
}
