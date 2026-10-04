import Link from "next/link";
import { ThemeToggle } from "../theme-toggle";

export function Header() {
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
          href="/auth/sign-in"
          className="pressable hidden text-[15px] font-medium leading-tight whitespace-nowrap text-muted-foreground hover:text-foreground sm:block"
        >
          Sign in
        </Link>
        <Link
          href="/journal"
          className="pressable flex shrink-0 items-center rounded-full bg-primary px-4.5 py-2.5 text-[15px] font-semibold leading-tight whitespace-nowrap text-primary-foreground"
        >
          Start your journal
        </Link>
      </nav>
    </header>
  );
}
