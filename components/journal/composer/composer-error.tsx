"use client";

import { useTranslations } from "next-intl";
import { useComposer } from "@/components/journal/composer/composer-provider";
import { cn } from "@/lib/utils";

export function ComposerError({ className }: { className?: string }) {
  const t = useTranslations("Composer");
  const tJournal = useTranslations("Journal");
  const { state, startRecording, startTyping } = useComposer();

  return (
    <div className={cn("flex w-full flex-col items-start gap-5", className)}>
      <p role="alert" className="text-control leading-body text-rec">
        {state.message}
      </p>
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={() =>
            startRecording({ day: state.backdateDay ?? undefined })
          }
          className="pressable flex items-center rounded-full bg-primary px-6 py-2.5 text-control font-semibold text-primary-foreground"
        >
          {t("retry")}
        </button>
        <button
          type="button"
          onClick={() => startTyping({ day: state.backdateDay ?? undefined })}
          className="pressable text-control font-medium text-foreground underline decoration-foreground/30 underline-offset-[5px]"
        >
          {tJournal("emptyPromptAction")}
        </button>
      </div>
    </div>
  );
}
