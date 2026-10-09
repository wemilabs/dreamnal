"use client";

import { type ReactNode, useState } from "react";
import { type AppHref, Link } from "@/i18n/navigation";

type IntentPrefetchLinkProps = {
  href: AppHref;
  className?: string;
  testId?: string;
  children: ReactNode;
};

export function IntentPrefetchLink({
  href,
  className,
  testId,
  children,
}: IntentPrefetchLinkProps) {
  const [intent, setIntent] = useState(false);
  const showIntent = () => setIntent(true);

  return (
    <Link
      href={href}
      className={className}
      data-testid={testId}
      prefetch={intent ? true : "auto"}
      onMouseEnter={showIntent}
      onTouchStart={showIntent}
      onFocus={showIntent}
    >
      {children}
    </Link>
  );
}
