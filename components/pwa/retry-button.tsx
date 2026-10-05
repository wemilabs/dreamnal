"use client";

import { Button } from "@/components/ui/button";

export function RetryButton() {
  return (
    <Button
      size="lg"
      onClick={() => window.location.reload()}
      className="pressable rounded-full px-6 text-[15px] font-semibold"
    >
      Try again
    </Button>
  );
}
