import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "New entry — Dreamnal",
};

export default function NewEntryPage() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <h1 className="font-display text-5xl italic tracking-[-0.03em] text-foreground">
        New entry
      </h1>
      <p className="text-muted-foreground">Coming in the next build.</p>
      <Link
        href="/"
        className="pressable text-sm font-medium text-foreground underline decoration-foreground/30 underline-offset-4"
      >
        Back to dreamnal
      </Link>
    </main>
  );
}
