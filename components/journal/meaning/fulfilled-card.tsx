import { Check } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import type { AppLocale } from "@/i18n/routing";
import { formatDay } from "@/lib/format";
import { UndoFulfilledButton } from "./undo-fulfilled-button";

export async function FulfilledCard({
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
  const [t, locale] = await Promise.all([
    getTranslations("Meaning"),
    getLocale(),
  ]);

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card/60 p-4 md:p-5">
      <p className="whitespace-pre-wrap text-control text-foreground">
        {meaning}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">
          <Check data-icon="inline-start" />
          {t("fulfilled")}
        </Badge>
        <span className="tabular-nums text-sm text-muted-foreground">
          {t("fulfilledOn", {
            date: formatDay(fulfilledOn, locale as AppLocale),
          })}
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
