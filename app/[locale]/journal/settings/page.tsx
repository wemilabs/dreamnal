import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LanguageSwitcher } from "@/components/journal/settings/language-switcher";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Settings");
  return { title: t("title"), description: t("metadataDescription") };
}

export default async function SettingsPage() {
  const t = await getTranslations("Settings");
  return (
    <main>
      <h1 className="text-page-title font-semibold tracking-tight text-foreground">
        {t("title")}
      </h1>
      <section
        aria-labelledby="language-heading"
        className="mt-8 rounded-2xl border border-border bg-card p-6"
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2
              className="text-control font-semibold text-foreground"
              id="language-heading"
            >
              {t("language")}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("languageDescription")}
            </p>
          </div>
          <LanguageSwitcher />
        </div>
      </section>
    </main>
  );
}
