"use client";

import type { ReactNode } from "react";
import { useComposer } from "@/components/journal/composer/composer-provider";

export function TypeInsteadButton({ children }: { children: ReactNode }) {
  const { startTyping } = useComposer();

  return (
    <button
      type="button"
      onClick={() => startTyping()}
      className="pressable text-cta font-medium text-foreground underline decoration-foreground/30 decoration-1 underline-offset-[5px]"
    >
      {children}
    </button>
  );
}
