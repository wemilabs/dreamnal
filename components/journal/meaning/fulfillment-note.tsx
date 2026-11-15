"use client";

import { useTranslations } from "next-intl";
import { useActionState, useState } from "react";
import {
  type MeaningFormState,
  saveFulfillmentNote,
} from "@/app/[locale]/journal/[id]/meaning-actions";
import { Textarea } from "@/components/ui/textarea";

export function FulfillmentNote({
  entryId,
  note,
}: {
  entryId: string;
  note: string | null;
}) {
  const t = useTranslations("Meaning");
  const [editing, setEditing] = useState(false);
  const [state, formAction, pending] = useActionState(
    async (
      prev: MeaningFormState,
      formData: FormData,
    ): Promise<MeaningFormState> => {
      const result = await saveFulfillmentNote(prev, formData);
      if (result?.ok) {
        setEditing(false);
      }
      return result;
    },
    null,
  );

  return (
    <div className="flex flex-col items-start gap-3">
      {editing ? (
        <form action={formAction} className="flex w-full flex-col gap-4">
          <input type="hidden" name="id" value={entryId} />
          <div className="grid gap-1.5">
            <Textarea
              name="note"
              defaultValue={note ?? ""}
              maxLength={2000}
              autoFocus
              placeholder={t("fulfillmentPlaceholder")}
              aria-label={t("noteAria")}
              aria-invalid={state?.fieldErrors?.note ? true : undefined}
              autoComplete="off"
              onKeyDown={(event) => {
                if (event.key === "Escape" && !pending) {
                  event.preventDefault();
                  setEditing(false);
                }
              }}
              className="min-h-24 resize-none rounded-lg border border-border bg-card/60 p-4 text-sm md:text-control"
            />
            {state?.fieldErrors?.note?.[0] ? (
              <p role="alert" className="text-sm/tight text-rec">
                {state.fieldErrors.note[0]}
              </p>
            ) : null}
          </div>
          {state?.error ? (
            <p role="alert" className="text-sm/tight text-rec">
              {state.error}
            </p>
          ) : null}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={pending}
              className="pressable w-fit rounded-full bg-primary px-5 py-2 text-control font-semibold text-primary-foreground disabled:opacity-60"
            >
              {pending ? t("saving") : t("save")}
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => setEditing(false)}
              className="pressable text-control font-medium text-muted-foreground underline decoration-foreground/20 underline-offset-[5px] disabled:opacity-60"
            >
              {t("cancel")}
            </button>
          </div>
        </form>
      ) : (
        <>
          {note ? (
            <p className="whitespace-pre-wrap text-sm text-muted-foreground">
              {note}
            </p>
          ) : null}
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="pressable text-control font-medium text-muted-foreground underline decoration-foreground/20 underline-offset-[5px]"
          >
            {t(note ? "editNote" : "addNote")}
          </button>
        </>
      )}
    </div>
  );
}
