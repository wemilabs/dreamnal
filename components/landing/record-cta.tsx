import { Mic } from "lucide-react";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../lib/utils";

const tones = {
  ink: {
    pill:
      "bg-primary text-primary-foreground " +
      "shadow-[0_12px_28px_-12px_rgb(22_35_59/0.55)]",
    disc: "bg-petal text-ink",
  },
  moon: {
    pill: "bg-moon text-ink",
    disc: "bg-ink text-petal",
  },
} as const;

export type RecordCtaTone = keyof typeof tones;

export function recordCtaClasses(tone: RecordCtaTone) {
  const styles = tones[tone];
  return {
    pill: cn(
      "pressable flex items-center gap-3 rounded-full py-2 pr-6 pl-2",
      styles.pill,
    ),
    disc: cn(
      "grid size-10 shrink-0 place-items-center rounded-full",
      styles.disc,
    ),
    label: "text-[17px] font-semibold leading-6 whitespace-nowrap",
  };
}

type RecordCtaProps = {
  tone: RecordCtaTone;
  href: ComponentProps<typeof Link>["href"];
  children: ReactNode;
};

export function RecordCta({ tone, href, children }: RecordCtaProps) {
  const classes = recordCtaClasses(tone);
  return (
    <Link href={href} className={classes.pill}>
      <span className={classes.disc}>
        <Mic className="size-4.5" aria-hidden />
      </span>
      <span className={classes.label}>{children}</span>
    </Link>
  );
}
