"use client";

import { useSyncExternalStore } from "react";

const dayFmt = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

const subscribeNoop = () => () => {};

export function LocalDay({ iso }: { iso: string }) {
  const text = useSyncExternalStore(
    subscribeNoop,
    () => dayFmt.format(new Date(iso)),
    () => null,
  );

  return (
    <time dateTime={iso}>
      {text ?? (
        <span className="opacity-0" aria-hidden="true">
          Jan 0
        </span>
      )}
    </time>
  );
}
