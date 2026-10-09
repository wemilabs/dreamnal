"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("NotFound");
  return (
    <div
      className="flex min-h-svh flex-col items-center justify-center gap-6 px-6 text-center"
      style={{ backgroundImage: "var(--hero-bg)" }}
    >
      <h1 className="font-display text-headline tracking-display text-foreground">
        {t("title")}
      </h1>
      <p className="text-lead text-muted-foreground">{t("description")}</p>
      <Link
        href="/journal"
        className="pressable flex items-center rounded-full bg-primary px-6 py-2.5 text-control font-semibold text-primary-foreground"
      >
        {t("back")}
      </Link>
    </div>
  );
}
