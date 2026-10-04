import { Mic } from "lucide-react";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

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

type RecordCtaProps = {
  tone: keyof typeof tones;
  href: ComponentProps<typeof Link>["href"];
  children: ReactNode;
};

export function RecordCta({ tone, href, children }: RecordCtaProps) {
  const styles = tones[tone];
  return (
    <Link
      href={href}
      className={cn(
        "pressable flex items-center gap-3 rounded-full py-2 pr-6 pl-2",
        styles.pill,
      )}
    >
      <span
        className={cn(
          "grid size-10 shrink-0 place-items-center rounded-full",
          styles.disc,
        )}
      >
        <Mic className="size-[18px]" aria-hidden />
      </span>
      <span className="text-[17px] font-semibold leading-6 whitespace-nowrap">
        {children}
      </span>
    </Link>
  );
}
