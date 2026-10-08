"use client";

import { Mic } from "lucide-react";
import { useComposer } from "@/components/journal/composer/composer-provider";

export function RecordFab() {
  const { startRecording } = useComposer();

  return (
    <button
      type="button"
      onClick={() => startRecording()}
      aria-label="Record a dream"
      className="pressable fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom,0px))] left-1/2 z-40 grid size-14 -translate-x-1/2 place-items-center rounded-full bg-primary text-primary-foreground shadow-[0_12px_28px_-12px_rgb(22_35_59/0.55)] md:hidden"
    >
      <span className="grid size-10 place-items-center rounded-full bg-petal text-ink">
        <Mic className="size-4.5" aria-hidden />
      </span>
    </button>
  );
}
