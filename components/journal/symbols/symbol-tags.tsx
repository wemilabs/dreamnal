"use client";

import { useOptimistic, useState, useTransition } from "react";
import { saveSymbols } from "@/app/journal/[id]/symbol-actions";
import { Input } from "@/components/ui/input";
import { symbolsCopy } from "@/lib/symbols/copy";
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
      <h2 className="font-display text-entry-title tracking-[-0.02em] text-foreground">
        {symbolsCopy.entryTags.heading}
      </h2>

      {optimisticItems.length === 0 ? (
        <p className="text-control text-muted-foreground">
          {symbolsCopy.entryTags.none}
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {SYMBOL_KINDS.map((groupKind) => {
            const group = optimisticItems.filter((i) => i.kind === groupKind);
            if (group.length === 0) {
              return null;
            }
            return (
              <div key={groupKind} className="grid gap-2">
                <span className="font-mono text-xs text-muted-foreground">
                  {symbolsCopy.kinds[groupKind]}
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
                        aria-label={symbolsCopy.entryTags.remove(item.label)}
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
          placeholder={symbolsCopy.entryTags.addPlaceholder}
          aria-label={symbolsCopy.entryTags.addPlaceholder}
          className="w-48"
        />
        <select
          value={kind}
          onChange={(e) => setKind(e.target.value as SymbolKind)}
          aria-label={symbolsCopy.entryTags.kindLabel}
          className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
        >
          {SYMBOL_KINDS.map((k) => (
            <option key={k} value={k}>
              {symbolsCopy.kinds[k]}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={pending || draft.trim() === ""}
          className="pressable rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          {symbolsCopy.entryTags.add}
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
