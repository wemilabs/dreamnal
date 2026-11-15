"use client";

import { useTranslations } from "next-intl";
import { useActionState, useState } from "react";
import type { MeaningFormState } from "@/app/[locale]/journal/[id]/meaning-actions";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export function InlineTextEdit({
  entryId,
  field,
  value,
  maxLength,
  action,
  editLabel,
  addLabel,
  ariaLabel,
  placeholder,
  textClassName,
}: {
  entryId: string;
  field: "meaning" | "note";
  value: string | null;
  maxLength: number;
  action: (
    prev: MeaningFormState,
    formData: FormData,
  ) => Promise<MeaningFormState>;
  editLabel: string;
  addLabel?: string;
  ariaLabel: string;
  placeholder: string;
  textClassName: string;
}) {
  const t = useTranslations("Meaning");
  const [editing, setEditing] = useState(false);
  const [state, formAction, pending] = useActionState(
    async (
      prev: MeaningFormState,
      formData: FormData,
    ): Promise<MeaningFormState> => {
      const result = await action(prev, formData);
      if (result?.ok) {
        setEditing(false);
      }
      return result;
    },
    null,
  );
  const fieldError = state?.fieldErrors?.[field]?.[0];

  return (
    <div className="flex flex-col items-start gap-3">
      {editing ? (
        <form action={formAction} className="flex w-full flex-col gap-4">
          <input type="hidden" name="id" value={entryId} />
          <div className="grid gap-1.5">
            <Textarea
              name={field}
              defaultValue={value ?? ""}
              maxLength={maxLength}
              autoFocus
              placeholder={placeholder}
              aria-label={ariaLabel}
              aria-invalid={fieldError ? true : undefined}
              autoComplete="off"
              onKeyDown={(event) => {
                if (event.key === "Escape" && !pending) {
                  event.preventDefault();
                  setEditing(false);
                }
              }}
              className={cn(
                "resize-none rounded-lg border border-border bg-card/60 p-4 text-sm md:text-control",
                field === "meaning" ? "min-h-28" : "min-h-24",
              )}
            />
            {fieldError ? (
              <p role="alert" className="text-sm/tight text-rec">
                {fieldError}
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
          {value ? (
            <p className={cn("whitespace-pre-wrap", textClassName)}>{value}</p>
          ) : null}
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="pressable text-control font-medium text-muted-foreground underline decoration-foreground/20 underline-offset-[5px]"
          >
            {value ? editLabel : (addLabel ?? editLabel)}
          </button>
        </>
      )}
    </div>
  );
}
