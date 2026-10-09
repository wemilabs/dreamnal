import { getTranslations } from "next-intl/server";
import { IntentPrefetchLink } from "@/components/journal/intent-prefetch-link";
import type { AppHref } from "@/i18n/paths";
import { listEntries } from "@/lib/entries";
import { titleFallback } from "@/lib/format";
import {
  labelStats,
  MIN_DREAMS_FOR_PATTERNS,
  recurringLabels,
} from "@/lib/insights";
import { SYMBOL_KINDS } from "@/lib/symbols/schema";
import { LabelLine } from "./label-line";
import { LocalDay } from "./local-day";

export async function SymbolsContent() {
  const t = await getTranslations("Symbols");
  const entries = await listEntries();
  if (entries.length < MIN_DREAMS_FOR_PATTERNS) {
    return <p className="text-lead text-muted-foreground">{t("empty")}</p>;
  }

  const recurring = recurringLabels(
    labelStats(
      entries.map((e) => ({
        id: e.id,
        createdAt: e.createdAt,
        symbols: e.symbols,
      })),
    ),
  );
  if (recurring.length === 0) {
    return (
      <p className="text-lead text-muted-foreground">{t("noRecurring")}</p>
    );
  }

  const byId = new Map(entries.map((e) => [e.id, e]));

  return (
    <div className="flex flex-col gap-8">
      {SYMBOL_KINDS.map((kind) => {
        const group = recurring.filter((s) => s.kind === kind);
        if (group.length === 0) {
          return null;
        }
        return (
          <section key={kind} className="flex flex-col gap-1">
            <h2 className="tabular-nums text-xs text-muted-foreground">
              {t(
                kind === "person"
                  ? "people"
                  : kind === "place"
                    ? "places"
                    : kind === "thing"
                      ? "things"
                      : "feelings",
              )}
            </h2>
            <ul className="flex flex-col">
              {group.map((stat) => (
                <li key={`${stat.kind}\u0000${stat.label}`}>
                  <details className="border-b border-border">
                    <summary className="pressable cursor-pointer list-none py-3 text-lead text-foreground [&::-webkit-details-marker]:hidden">
                      <LabelLine stat={stat} />
                    </summary>
                    <ul className="flex flex-col gap-1 pb-4 pl-1">
                      {stat.entryIds.map((id) => {
                        const entry = byId.get(id);
                        if (!entry) {
                          return null;
                        }
                        return (
                          <li key={id}>
                            <IntentPrefetchLink
                              href={`/journal/${id}` as AppHref}
                              className="pressable flex items-baseline justify-between gap-4 py-1.5 text-control"
                            >
                              <span className="text-foreground">
                                {entry.title ??
                                  (titleFallback(entry.excerpt) ||
                                    t("untitled"))}
                              </span>
                              <span className="tabular-nums text-xs text-muted-foreground">
                                <LocalDay iso={entry.createdAt.toISOString()} />
                              </span>
                            </IntentPrefetchLink>
                          </li>
                        );
                      })}
                    </ul>
                  </details>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
