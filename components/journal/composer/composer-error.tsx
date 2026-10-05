"use client";

import { useComposer } from "@/components/journal/composer/composer-provider";
import { cn } from "@/lib/utils";

export function ComposerError({ className }: { className?: string }) {
  const { state, startRecording, startTyping } = useComposer();

  return (
    <div className={cn("flex w-full flex-col items-start gap-5", className)}>
      <p role="alert" className="text-[15px] leading-body text-rec">
        {state.message}
      </p>
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={startRecording}
          className="pressable flex items-center rounded-full bg-primary px-6 py-2.5 text-[15px] font-semibold text-primary-foreground"
        >
          Try again
        </button>
        <button
          type="button"
          onClick={startTyping}
          className="pressable text-[15px] font-medium text-foreground underline decoration-foreground/30 underline-offset-[5px]"
        >
          type it instead
        </button>
      </div>
    </div>
  );
}
