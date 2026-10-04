import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="flex min-h-svh flex-col items-center justify-center gap-6 px-6 text-center"
      style={{ backgroundImage: "var(--hero-bg)" }}
    >
      <h1 className="font-display text-[56px] leading-tight tracking-display text-foreground">
        This page drifted away.
      </h1>
      <p className="text-lg leading-body text-muted-foreground">
        Like a dream at breakfast.
      </p>
      <Link
        href="/journal"
        className="pressable flex items-center rounded-full bg-primary px-6 py-2.5 text-[15px] font-semibold text-primary-foreground"
      >
        Back to your journal
      </Link>
    </div>
  );
}
