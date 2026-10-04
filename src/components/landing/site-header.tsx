import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  return (
    <header className="relative z-10 flex items-center justify-between px-6 py-7 lg:px-16">
      <Link
        href="/"
        className="pressable font-display text-2xl font-medium italic leading-8 tracking-[-0.02em] text-foreground"
      >
        dreamnal
      </Link>
      <nav className="flex items-center gap-7">
        <a
          href="#how-it-works"
          className="pressable hidden text-[15px] font-medium leading-tight whitespace-nowrap text-muted-foreground hover:text-foreground sm:block"
        >
          How it works
        </a>
        <ThemeToggle />
        <Link
          href="/sign-in"
          className="pressable hidden text-[15px] font-medium leading-tight whitespace-nowrap text-muted-foreground hover:text-foreground sm:block"
        >
          Sign in
        </Link>
        <Link
          href="/sign-in"
          className="pressable flex shrink-0 items-center rounded-full bg-primary px-[18px] py-[10px] text-[15px] font-semibold leading-tight whitespace-nowrap text-primary-foreground"
        >
          Start your journal
        </Link>
      </nav>
    </header>
  );
}
