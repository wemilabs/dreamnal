"use client";

import { useSyncExternalStore } from "react";
import { formatEntryDate } from "../../lib/format";

const subscribeNoop = () => () => {};

export function EntryDate({
  iso,
  className,
}: {
  iso: string;
  className?: string;
}) {
  const text = useSyncExternalStore(
    subscribeNoop,
    () => formatEntryDate(new Date(iso)),
    () => null,
  );

  return (
    <time dateTime={iso} className={className}>
      {text ?? (
        <span className="opacity-0" aria-hidden="true">
          MON 00 OCT · 00:00 AM
        </span>
      )}
    </time>
  );
}
