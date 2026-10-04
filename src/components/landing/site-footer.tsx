import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="flex flex-col items-center gap-4 border-t border-night-line bg-night px-6 py-7 md:flex-row md:justify-between lg:px-16">
      <Link
        href="/"
        className="pressable font-display text-[22px] font-medium italic leading-body tracking-[-0.02em] text-moon"
      >
        dreamnal
      </Link>
      <nav className="flex items-center gap-7">
        <Link
          href="/"
          className="pressable text-sm/tight text-night-muted hover:text-moon"
        >
          Privacy
        </Link>
        <Link
          href="/"
          className="pressable text-sm/tight text-night-muted hover:text-moon"
        >
          Terms
        </Link>
        <span className="font-mono text-[13px] leading-[18px] text-night-muted">
          © 2026
        </span>
      </nav>
    </footer>
  );
}
