import { useTranslations } from "next-intl";
import { ThemeToggle } from "@/components/theme-toggle";
import { Wordmark } from "@/components/wordmark";
import { Link } from "@/i18n/navigation";

export function Header() {
  const t = useTranslations("Landing");
  return (
    <header className="relative z-10 flex items-center justify-between px-6 py-7 lg:px-16">
      <Link
        href="/"
        className="pressable font-display text-2xl font-medium italic leading-8 tracking-[-0.02em] text-foreground"
      >
        <Wordmark />
      </Link>
      <nav className="flex items-center gap-7">
        <a
          href="#how-it-works"
          className="pressable hidden text-control font-medium leading-tight whitespace-nowrap text-muted-foreground hover:text-foreground sm:block"
        >
          {t("howItWorks")}
        </a>
        <ThemeToggle />
        <Link
          href="/auth/sign-in"
          className="pressable hidden text-control font-medium leading-tight whitespace-nowrap text-muted-foreground hover:text-foreground sm:block"
        >
          {t("signIn")}
        </Link>
        <Link
          href="/journal"
          className="pressable flex shrink-0 items-center rounded-full bg-primary px-4.5 py-2.5 text-control font-semibold leading-tight whitespace-nowrap text-primary-foreground"
        >
          {t("startJournal")}
        </Link>
      </nav>
    </header>
  );
}
