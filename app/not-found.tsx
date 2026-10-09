import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  description: "This page drifted away. Head back to your journal.",
};

export default function NotFound() {
  return (
    <div
      className="flex min-h-svh flex-col items-center justify-center gap-6 px-6 text-center"
      style={{ backgroundImage: "var(--hero-bg)" }}
    >
      <h1 className="font-display text-headline tracking-display text-foreground">
        This page drifted away.
      </h1>
      <p className="text-lead text-muted-foreground">
        Like a dream at breakfast.
      </p>
      <Link
        href="/journal"
        className="pressable flex items-center rounded-full bg-primary px-6 py-2.5 text-control font-semibold text-primary-foreground"
      >
        Back to your journal
      </Link>
    </div>
  );
}
