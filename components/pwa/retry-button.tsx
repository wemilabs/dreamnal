"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export function RetryButton() {
  const t = useTranslations("Offline");
  return (
    <Button
      size="lg"
      onClick={() => window.location.reload()}
      className="pressable rounded-full px-6 text-control font-semibold"
    >
      {t("retry")}
    </Button>
  );
}
