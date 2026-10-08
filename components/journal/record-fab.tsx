"use client";

import { Mic } from "lucide-react";
import { useCaptureBarVisible } from "@/components/journal/capture-bar";
import { useComposer } from "@/components/journal/composer/composer-provider";
import { cn } from "@/lib/utils";

export function RecordFab() {
  const { startRecording } = useComposer();
  const captureBarVisible = useCaptureBarVisible();

  return (
    <div
      inert={captureBarVisible}
      className={cn(
        "fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom,0px))] left-1/2 z-40 -translate-x-1/2 transition-[opacity,scale] duration-200 ease-out md:right-8 md:bottom-8 md:left-auto md:translate-x-0",
        captureBarVisible && "pointer-events-none scale-90 opacity-0",
      )}
    >
      <button
        type="button"
        onClick={() => startRecording()}
        aria-label="Record a dream"
        className="pressable grid place-items-center rounded-full bg-primary p-2 text-primary-foreground shadow-[0_12px_28px_-12px_rgb(22_35_59/0.55)]"
      >
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-petal text-ink">
          <Mic className="size-4.5" aria-hidden />
        </span>
      </button>
    </div>
  );
}
