import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDay } from "@/lib/format";
import { UndoFulfilledButton } from "./undo-fulfilled-button";

export function FulfilledCard({
  meaning,
  fulfilledOn,
  fulfillmentNote,
  entryId,
}: {
  meaning: string;
  fulfilledOn: string;
  fulfillmentNote: string | null;
  entryId: string;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card/60 p-4 md:p-5">
      <p className="whitespace-pre-wrap text-control text-foreground">
        {meaning}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">
          <Check data-icon="inline-start" />
          Fulfilled
        </Badge>
        <span className="tabular-nums text-sm text-muted-foreground">
          on {formatDay(fulfilledOn)}
        </span>
      </div>
      {fulfillmentNote ? (
        <p className="whitespace-pre-wrap text-sm text-muted-foreground">
          {fulfillmentNote}
        </p>
      ) : null}
      <UndoFulfilledButton entryId={entryId} />
    </div>
  );
}
