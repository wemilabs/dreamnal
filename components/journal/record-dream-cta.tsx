"use client";

import { Mic } from "lucide-react";
import type { ReactNode } from "react";
import { useComposer } from "@/components/journal/composer/composer-provider";
import { recordCtaClasses } from "@/components/landing/record-cta";

export function RecordDreamCta({ children }: { children?: ReactNode }) {
  const { startRecording } = useComposer();
  const classes = recordCtaClasses("ink");

  return (
    <button type="button" onClick={startRecording} className={classes.pill}>
      <span className={classes.disc}>
        <Mic className="size-4.5" aria-hidden />
      </span>
      <span className={classes.label}>{children ?? "Record a dream"}</span>
    </button>
  );
}

export function TypeInsteadButton({ children }: { children?: ReactNode }) {
  const { startTyping } = useComposer();

  return (
    <button
      type="button"
      onClick={startTyping}
      className="pressable text-[17px] font-medium leading-6 text-foreground underline decoration-foreground/30 decoration-1 underline-offset-[5px]"
    >
      {children ?? "or type it instead"}
    </button>
  );
}
