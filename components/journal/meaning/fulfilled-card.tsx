import { Check } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import {
  saveFulfilledMeaning,
  saveFulfillmentNote,
} from "@/app/[locale]/journal/[id]/meaning-actions";
import { Badge } from "@/components/ui/badge";
import type { AppLocale } from "@/i18n/routing";
import { formatDay } from "@/lib/format";
import { CONFIDENCE_LABEL_KEYS, isConfidence } from "@/lib/meaning";
import { InlineTextEdit } from "./inline-text-edit";
import { UndoFulfilledButton } from "./undo-fulfilled-button";

export async function FulfilledCard({
  meaning,
  confidence,
  fulfilledOn,
  fulfillmentNote,
  entryId,
}: {
  meaning: string;
  confidence: number | null;
  fulfilledOn: string;
  fulfillmentNote: string | null;
  entryId: string;
}) {
  const [t, locale] = await Promise.all([
    getTranslations("Meaning"),
    getLocale(),
  ]);
  const confidenceLabel =
    confidence !== null && isConfidence(confidence)
      ? t(CONFIDENCE_LABEL_KEYS[confidence])
      : null;

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-card/60">
      <div className="flex flex-col gap-2 p-4 md:p-5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {t("yourInterpretation")}
          </h3>
          {confidenceLabel ? (
            <Badge variant="outline">{confidenceLabel}</Badge>
          ) : null}
        </div>
        <InlineTextEdit
          key={meaning}
          entryId={entryId}
          field="meaning"
          value={meaning}
          maxLength={4000}
          action={saveFulfilledMeaning}
          editLabel={t("editMeaning")}
          ariaLabel={t("meaningAria")}
          placeholder={t("placeholder")}
          textClassName="text-control text-foreground"
        />
      </div>
      <div className="flex flex-col gap-2 border-t border-border p-4 md:p-5">
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
        <InlineTextEdit
          key={fulfillmentNote ?? ""}
          entryId={entryId}
          field="note"
          value={fulfillmentNote}
          maxLength={2000}
          action={saveFulfillmentNote}
          editLabel={t("editNote")}
          addLabel={t("addNote")}
          ariaLabel={t("noteAria")}
          placeholder={t("fulfillmentPlaceholder")}
          textClassName="text-sm text-muted-foreground"
        />
      </div>
      <div className="border-t border-border px-4 py-3 md:px-5">
        <UndoFulfilledButton entryId={entryId} />
      </div>
    </div>
  );
}
