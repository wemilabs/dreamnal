import type { EntryWithSymbols } from "@/lib/entries";
import { FulfilledCard } from "./fulfilled-card";
import { MeaningForm } from "./meaning-form";

export function MeaningSection({ entry }: { entry: EntryWithSymbols }) {
  return (
    <section className="flex flex-col gap-4 border-t border-border pt-8">
      <h2 className="text-entry-title font-semibold tracking-tight text-foreground">
        Meaning
      </h2>
      {entry.fulfilledOn ? (
        <FulfilledCard
          meaning={entry.meaning ?? ""}
          fulfilledOn={entry.fulfilledOn}
          fulfillmentNote={entry.fulfillmentNote}
          entryId={entry.id}
        />
      ) : (
        <MeaningForm
          key={entry.updatedAt.toISOString()}
          entryId={entry.id}
          meaning={entry.meaning}
          confidence={entry.meaningConfidence}
          createdAt={entry.createdAt.toISOString()}
        />
      )}
    </section>
  );
}
