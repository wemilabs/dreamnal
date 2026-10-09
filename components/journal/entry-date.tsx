"use client";

import { useLocale } from "next-intl";
import { useSyncExternalStore } from "react";
import type { AppLocale } from "@/i18n/routing";
import { formatEntryDate } from "@/lib/format";

const subscribeNoop = () => () => {};

export function EntryDate({
  iso,
  className,
}: {
  iso: string;
  className?: string;
}) {
  const locale = useLocale() as AppLocale;
  const text = useSyncExternalStore(
    subscribeNoop,
    () => formatEntryDate(new Date(iso), locale),
    () => null,
  );

  return (
    <time dateTime={iso} className={className}>
      {text ?? (
        <span className="opacity-0" aria-hidden="true">
          Mon 00 Oct · 00:00 am
        </span>
      )}
    </time>
  );
}
