"use client";

import { useLocale } from "next-intl";
import { useSyncExternalStore } from "react";

const subscribeNoop = () => () => {};

export function LocalDay({ iso }: { iso: string }) {
  const locale = useLocale();
  const text = useSyncExternalStore(
    subscribeNoop,
    () =>
      new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-US", {
        month: "short",
        day: "numeric",
      }).format(new Date(iso)),
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
