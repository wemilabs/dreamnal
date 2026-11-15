"use client";

import { Feather } from "lucide-react";
import { useTranslations } from "next-intl";
import { useComposer } from "@/components/journal/composer/composer-provider";
import { Button } from "@/components/ui/button";

export function NewWhisperButton() {
  const t = useTranslations("Journal");
  const { startTyping } = useComposer();

  return (
    <Button
      variant="outline"
      className="rounded-full"
      onClick={() => startTyping({ kind: "whisper" })}
    >
      <Feather aria-hidden />
      {t("newWhisper")}
    </Button>
  );
}
