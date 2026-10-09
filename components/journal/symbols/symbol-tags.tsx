"use client";

import { useTranslations } from "next-intl";
import { useOptimistic, useState, useTransition } from "react";
import { saveSymbols } from "@/app/[locale]/journal/[id]/symbol-actions";
import { Input } from "@/components/ui/input";
import {
  normalizeLabel,
  SYMBOL_KINDS,
  type SymbolItem,
  type SymbolKind,
} from "@/lib/symbols/schema";

export function SymbolTags({
  entryId,
  items,
}: {
  entryId: string;
  items: SymbolItem[];
}) {
  const t = useTranslations("Symbols");
  const [optimisticItems, setOptimisticItems] = useOptimistic(items);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [kind, setKind] = useState<SymbolKind>("thing");

  const commit = (next: SymbolItem[]) => {
    setError(null);
    startTransition(async () => {
      setOptimisticItems(next);
      const result = await saveSymbols(entryId, next);
      if (result?.error) {
        setError(result.error);
      }
    });
  };

  const add = () => {
    const label = normalizeLabel(draft);
    if (label === null) {
      return;
    }
    if (optimisticItems.some((i) => i.kind === kind && i.label === label)) {
      setDraft("");
      return;
    }
    setDraft("");
    commit([...optimisticItems, { kind, label }]);
  };

  const remove = (item: SymbolItem) => {
    commit(
      optimisticItems.filter(
        (i) => !(i.kind === item.kind && i.label === item.label),
      ),
    );
  };

  return (
    <section className="flex flex-col gap-4 border-t border-border pt-8">
      <h2 className="text-entry-title font-semibold tracking-tight text-foreground">
        {t("heading")}
      </h2>

      {optimisticItems.length === 0 ? (
        <p className="text-control text-muted-foreground">{t("none")}</p>
      ) : (
        <div className="flex flex-col gap-4">
          {SYMBOL_KINDS.map((groupKind) => {
            const group = optimisticItems.filter((i) => i.kind === groupKind);
            if (group.length === 0) {
              return null;
            }
            return (
              <div key={groupKind} className="grid gap-2">
                <span className="tabular-nums text-xs text-muted-foreground">
                  {t(kindKey(groupKind))}
                </span>
                <div className="flex flex-wrap gap-2">
                  {group.map((item) => (
                    <span
                      key={`${item.kind}\u0000${item.label}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-sm text-foreground"
                    >
                      {item.label}
                      <button
                        type="button"
                        aria-label={t("remove", { label: item.label })}
                        onClick={() => remove(item)}
                        disabled={pending}
                        className="pressable text-muted-foreground hover:text-rec disabled:opacity-60"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <form
        className="flex flex-wrap items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          add();
        }}
      >
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          maxLength={60}
          placeholder={t("addPlaceholder")}
          aria-label={t("addPlaceholder")}
          className="w-48"
        />
        <select
          value={kind}
          onChange={(e) => setKind(e.target.value as SymbolKind)}
          aria-label={t("kind")}
          className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
        >
          {SYMBOL_KINDS.map((k) => (
            <option key={k} value={k}>
              {t(kindKey(k))}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={pending || draft.trim() === ""}
          className="pressable rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          {t("add")}
        </button>
      </form>

      {error ? (
        <p role="alert" className="text-sm/tight text-rec">
          {error}
        </p>
      ) : null}
    </section>
  );
}

function kindKey(kind: SymbolKind) {
  return {
    person: "people",
    place: "places",
    thing: "things",
    feeling: "feelings",
  }[kind] as "people" | "places" | "things" | "feelings";
}
