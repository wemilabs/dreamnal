"use client";

import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { setLucid } from "@/app/[locale]/journal/[id]/lucid-actions";
import { cn } from "@/lib/utils";

export function LucidToggle({ id, lucid }: { id: string; lucid: boolean }) {
  const t = useTranslations("Entry");
  const [state, formAction, pending] = useActionState(setLucid, null);
  const Icon = lucid ? Eye : EyeOff;

  return (
    <form action={formAction} className="flex flex-col items-end gap-1">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="lucid" value={lucid ? "false" : "true"} />
      <button
        type="submit"
        disabled={pending}
        aria-pressed={lucid}
        aria-label={lucid ? t("unmarkLucid") : t("markLucid")}
        title={lucid ? t("unmarkLucid") : t("markLucid")}
        data-testid="lucid-toggle"
        className={cn(
          "pressable inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3 text-control font-medium disabled:opacity-60",
          lucid
            ? "bg-secondary text-secondary-foreground"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <Icon className="size-4" aria-hidden />
        <span>{lucid ? t("lucidBadge") : t("markLucid")}</span>
      </button>
      {state?.error ? (
        <p role="alert" className="text-sm/tight text-rec">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
