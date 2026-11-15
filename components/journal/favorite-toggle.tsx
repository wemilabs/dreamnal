"use client";

import { Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { setFavorite } from "@/app/[locale]/journal/[id]/favorite-actions";
import { cn } from "@/lib/utils";

export function FavoriteToggle({
  id,
  favorite,
}: {
  id: string;
  favorite: boolean;
}) {
  const t = useTranslations("Entry");
  const [state, formAction, pending] = useActionState(setFavorite, null);

  return (
    <form action={formAction} className="flex flex-col items-end gap-1">
      <input type="hidden" name="id" value={id} />
      <input
        type="hidden"
        name="favorite"
        value={favorite ? "false" : "true"}
      />
      <button
        type="submit"
        disabled={pending}
        aria-pressed={favorite}
        aria-label={favorite ? t("unmarkFavorite") : t("markFavorite")}
        title={favorite ? t("unmarkFavorite") : t("markFavorite")}
        data-testid="favorite-toggle"
        className={cn(
          "pressable inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3 text-control font-medium disabled:opacity-60",
          favorite
            ? "bg-secondary text-secondary-foreground"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <Star
          className={cn("size-4", favorite && "fill-current")}
          aria-hidden
        />
        <span>{favorite ? t("favoriteBadge") : t("markFavorite")}</span>
      </button>
      {state?.error ? (
        <p role="alert" className="text-sm/tight text-rec">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
