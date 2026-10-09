"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { setLocale } from "@/app/[locale]/journal/settings/actions";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

const languages: { locale: AppLocale; label: string }[] = [
  { locale: "en", label: "English" },
  { locale: "fr", label: "Français" },
];

export function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations("Settings");
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <fieldset
      aria-label={t("language")}
      className="min-w-0 inline-flex self-end sm:self-auto rounded-xl border border-border bg-muted/40 p-1"
    >
      <legend className="sr-only">{t("language")}</legend>
      {languages.map((language) => (
        <Button
          key={language.locale}
          aria-pressed={locale === language.locale}
          disabled={pending}
          onClick={() => {
            if (locale === language.locale) return;
            startTransition(async () => {
              await setLocale(language.locale);
              navigator.serviceWorker?.controller?.postMessage({
                type: "refresh-offline",
              });
              router.refresh();
            });
          }}
          size="sm"
          variant={locale === language.locale ? "default" : "ghost"}
        >
          {language.label}
        </Button>
      ))}
    </fieldset>
  );
}
