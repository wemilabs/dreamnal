"use client";

import { useActionState, useState } from "react";
import { saveMeaning } from "@/app/journal/[id]/meaning-actions";
import { Textarea } from "@/components/ui/textarea";
import { CONFIDENCE_LEVELS } from "@/lib/meaning";
import { FulfillDialog } from "./fulfill-dialog";

export function MeaningForm({
  entryId,
  meaning,
  confidence,
  createdAt,
}: {
  entryId: string;
  meaning: string | null;
  confidence: number | null;
  createdAt: string;
}) {
  const [state, formAction, pending] = useActionState(saveMeaning, null);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <form action={formAction} className="flex flex-col gap-4">
        <input type="hidden" name="id" value={entryId} />
        <div className="grid gap-1.5">
          <Textarea
            name="meaning"
            defaultValue={meaning ?? ""}
            maxLength={4000}
            placeholder="What do you think it means?"
            aria-label="Meaning"
            autoComplete="off"
            className="min-h-28 resize-none rounded-lg border border-border bg-card/60 p-4 text-sm md:text-control"
          />
          {state?.fieldErrors?.meaning?.[0] ? (
            <p role="alert" className="text-sm/tight text-rec">
              {state.fieldErrors.meaning[0]}
            </p>
          ) : null}
        </div>

        <fieldset className="flex flex-col gap-2">
          <legend className="text-xs text-muted-foreground">
            How sure are you?
          </legend>
          <div
            role="radiogroup"
            aria-label="How sure are you?"
            className="flex flex-wrap gap-2"
          >
            {CONFIDENCE_LEVELS.map((level) => (
              <label
                key={level.value}
                className="has-checked:border-primary has-checked:bg-primary has-checked:text-primary-foreground has-focus-visible:ring-3 has-focus-visible:ring-ring/50 cursor-pointer rounded-full border border-border px-3 py-1 text-sm"
              >
                <input
                  type="radio"
                  name="confidence"
                  value={level.value}
                  defaultChecked={confidence === level.value}
                  className="peer sr-only"
                />
                {level.label}
              </label>
            ))}
          </div>
          {state?.fieldErrors?.confidence?.[0] ? (
            <p role="alert" className="text-sm/tight text-rec">
              {state.fieldErrors.confidence[0]}
            </p>
          ) : null}
        </fieldset>

        {state?.error ? (
          <p role="alert" className="text-sm/tight text-rec">
            {state.error}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={pending}
            className="pressable rounded-full bg-primary px-5 py-2 text-control font-semibold text-primary-foreground disabled:opacity-60"
          >
            {pending ? "Saving…" : "Save"}
          </button>
          {meaning !== null ? (
            <button
              type="button"
              onClick={() => setDialogOpen(true)}
              className="pressable rounded-full border border-border px-5 py-2 text-control font-medium"
            >
              Mark as fulfilled
            </button>
          ) : null}
        </div>
      </form>
      <FulfillDialog
        entryId={entryId}
        createdAt={createdAt}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
