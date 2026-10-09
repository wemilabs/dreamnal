import type { Metadata } from "next";
import { RetryButton } from "@/components/pwa/retry-button";

export const metadata: Metadata = {
  title: "Offline",
  description: "Dreamnal needs a connection to transcribe and save dreams.",
  robots: { index: false },
};

export const ensureStatic = "navigation";

export default function OfflinePage() {
  return (
    <div
      className="flex min-h-svh flex-col items-center justify-center gap-6 px-6 text-center"
      style={{ backgroundImage: "var(--hero-bg)" }}
    >
      <h1 className="font-display text-headline tracking-display text-foreground">
        You’re offline.
      </h1>
      <p className="text-lead text-muted-foreground">
        Dreamnal needs a connection to transcribe and save dreams. We’ll be here
        when you’re back.
      </p>
      <RetryButton />
    </div>
  );
}
