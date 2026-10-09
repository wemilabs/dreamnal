import type { ReactNode } from "react";
import { TheFold } from "@/components/landing/the-fold";
import { Wordmark } from "@/components/wordmark";
import { Link } from "@/i18n/navigation";

export const ensureStatic = "navigation";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="relative min-h-svh overflow-hidden"
      style={{ backgroundImage: "var(--hero-bg)" }}
    >
      <header className="relative z-10 px-6 pt-7 lg:px-16">
        <Link
          href="/"
          className="pressable font-display text-2xl font-medium italic leading-8 tracking-[-0.02em] text-foreground"
        >
          <Wordmark />
        </Link>
      </header>
      <main className="relative z-10 mx-auto flex w-full max-w-105 flex-col px-6 pt-12 pb-24 lg:pt-16">
        {children}
      </main>
      <TheFold className="anim-fold absolute -bottom-40 left-auto -right-37.5 h-auto w-105 lg:-right-20 lg:w-140" />
    </div>
  );
}
