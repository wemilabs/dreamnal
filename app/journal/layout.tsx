import { PenLine } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Suspense } from "react";
import { Wordmark } from "@/components/wordmark";
import { UserMenu } from "../../components/journal/user-menu";
import { ThemeToggle } from "../../components/theme-toggle";
import { Skeleton } from "../../components/ui/skeleton";

export default function JournalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-svh bg-background font-sans text-foreground antialiased [font-synthesis:none]">
      <header className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-6 pt-7">
        <Link
          href="/journal"
          className="pressable font-display text-2xl font-medium italic leading-8 tracking-[-0.02em] text-foreground"
        >
          <Wordmark />
        </Link>
        <nav className="flex items-center gap-3">
          <Link
            href="/journal/new"
            className="pressable flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm/tight font-semibold whitespace-nowrap text-primary-foreground"
          >
            <PenLine className="size-4" aria-hidden />
            New entry
          </Link>
          <ThemeToggle />
          <Suspense fallback={<Skeleton className="size-9 rounded-full" />}>
            <UserMenu />
          </Suspense>
        </nav>
      </header>
      <main className="mx-auto w-full max-w-180 px-6 pt-14 pb-24">
        {children}
      </main>
    </div>
  );
}
