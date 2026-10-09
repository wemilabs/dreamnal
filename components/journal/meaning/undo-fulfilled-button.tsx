"use client";

import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { unmarkFulfilled } from "@/app/[locale]/journal/[id]/meaning-actions";

export function UndoFulfilledButton({ entryId }: { entryId: string }) {
  const t = useTranslations("Meaning");
  const [state, formAction, pending] = useActionState(unmarkFulfilled, null);

  return (
    <form action={formAction} className="flex flex-col items-start gap-2">
      <input type="hidden" name="id" value={entryId} />
      <button
        type="submit"
        disabled={pending}
        className="pressable text-control font-medium text-muted-foreground underline decoration-foreground/20 underline-offset-[5px] disabled:opacity-60"
      >
        {pending ? t("undoing") : t("undoFulfillment")}
      </button>
      {state?.error ? (
        <p role="alert" className="text-sm/tight text-rec">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
