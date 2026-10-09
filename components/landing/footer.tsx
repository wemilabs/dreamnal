import { useTranslations } from "next-intl";
import { Wordmark } from "@/components/wordmark";
import { Link } from "@/i18n/navigation";

export function Footer() {
  const t = useTranslations("Landing");
  return (
    <footer className="flex flex-col items-center gap-4 border-t border-night-line bg-night px-6 py-7 md:flex-row md:justify-between lg:px-16">
      <Link
        href="/"
        className="pressable font-display text-[22px] font-medium italic leading-body tracking-[-0.02em] text-moon"
      >
        <Wordmark />
      </Link>
      <nav className="flex items-center gap-7">
        <Link
          href="/"
          className="pressable text-sm/tight text-night-muted hover:text-moon"
        >
          {t("privacy")}
        </Link>
        <Link
          href="/"
          className="pressable text-sm/tight text-night-muted hover:text-moon"
        >
          {t("terms")}
        </Link>
        <span className="font-mono text-[13px] leading-4.5 text-night-muted">
          © 2026
        </span>
      </nav>
    </footer>
  );
}
